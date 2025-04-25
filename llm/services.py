import os
import json
import uuid
import tempfile
import asyncio
import boto3
import cv2
import numpy as np
from datetime import datetime, timedelta
from models import Summary, VisualContextRequest
from google import genai
from pathlib import Path
from settings import Settings
from pipeline import process_audio
from setup_logging import setup_logging
import shutil

logger = setup_logging(__name__)

class TranscriptionService:
    def __init__(self):
        self.settings = Settings
    
    async def transcribe_audio(self, audio_file):
        """Process uploaded audio file and return diarized transcription"""
        try:
            # Create temp file to store the uploaded audio
            temp_dir = tempfile.mkdtemp()
            temp_audio_path = Path(temp_dir) / f"{uuid.uuid4()}{Path(audio_file.filename).suffix}"
            
            # Write the audio file content to the temp file
            with open(temp_audio_path, "wb") as f:
                f.write(await audio_file.read())
            
            # Use the common processing method
            result = await self.transcribe_audio_from_path(str(temp_audio_path))
            
            # Clean up temp file
            try:
                os.unlink(temp_audio_path)
                os.rmdir(temp_dir)
            except Exception as e:
                logger.warning(f"Error cleaning up: {str(e)}")
            
            return result
        
        except Exception as e:
            logger.error(f"Error in transcribe_audio: {str(e)}")
            
            # Clean up temp files if they exist
            try:
                if 'temp_audio_path' in locals() and os.path.exists(temp_audio_path):
                    os.unlink(temp_audio_path)
                if 'temp_dir' in locals() and os.path.exists(temp_dir):
                    os.rmdir(temp_dir)
            except:
                pass
            
            return {
                "segments": [],
                "success": False,
                "message": f"Error during transcription: {str(e)}"
            }
    
    async def transcribe_audio_from_path(self, audio_path):
        """Process audio file at specified path and return diarized transcription"""
        try:
            logger.info(f"Processing audio file at {audio_path}")
            
            # Check if file exists and is readable
            if not os.path.exists(audio_path):
                raise FileNotFoundError(f"Audio file not found at {audio_path}")
                
            file_size = os.path.getsize(audio_path)
            logger.info(f"Audio file size: {file_size} bytes")
            
            # Check if we have enough disk space
            free_space = shutil.disk_usage(os.path.dirname(audio_path)).free
            logger.info(f"Free disk space: {free_space} bytes")
            
            # Process the audio file using Deepgram
            from pipeline import process_audio
            transcription_result = process_audio(
                audio_path,
                self.settings.DEEPGRAM_API_KEY
            )
            
            logger.info(f"Transcription complete with {len(transcription_result)} segments")
            
            return {
                "segments": transcription_result,
                "success": True
            }
        
        except Exception as e:
            logger.error(f"Error processing audio file: {str(e)}")
            
            return {
                "segments": [],
                "success": False,
                "message": f"Error during transcription: {str(e)}"
            }


class SummaryService:
    def __init__(self):
        self.client = genai.Client(api_key=Settings.GEMINI_API_KEY)
    
    def _format_transcript(self, segments):
        """Format transcription segments into a readable conversation"""
        formatted_transcript = ""
        for segment in segments:
            formatted_transcript += f"{segment["speaker"]}: {segment["text"]}\n\n"
        return formatted_transcript
    
    async def generate_summary(self, segments):
        """Generate summary, action items, decisions and relevant links from transcript"""
        
        # Format transcript for the AI
        transcript = self._format_transcript(segments)
        
        prompt = """
        Below is a transcript of a conversation. Please analyze it thoroughly and provide:
        
        1. A concise yet comprehensive summary of the key points discussed (be specific with details mentioned)
        2. Important decisions that were made during the conversation
        3. Action items that need to be completed based on the conversation
        4. Links or resources mentioned in the conversation or that would be relevant to the topics discussed

        You MUST format your response as JSON with the following structure, DONT generate MARKDOWN:
        {
          "summary": "comprehensive summary here...", 
          "decisions": ["decision 1", "decision 2", ...],
          "action_items": ["action 1", "action 2", ...],
          "relevant_links": [{"description 1": "URL description", "URL 1": "URL"}, ...]
        }
        Transcript:
        """
        
        prompt += transcript
        
        # Use asyncio to run the synchronous Gemini API call
        response = self.client.models.generate_content(
            model='gemini-2.0-flash',
            contents=prompt,
            config={
                'response_mime_type': 'application/json',
                'response_schema': Summary,
            },
        )
        
        
        try:
            # Try to parse the response as JSON
            logger.debug(f"This is response: {response}")
            result_text = response.text

            # Look for JSON content between ```json and ``` if it exists
            if "```json" in result_text:
                json_content = result_text.split("```json")[1].split("```")[0].strip()
                result_data = json.loads(json_content)
            else:
                # Otherwise try to parse the whole response
                result_data = json.loads(result_text)
                logger.debug(f"This is result_data: {result_data}")

            return {
                "summary": result_data.get("summary", "No summary available"),
                "decisions": [d for d in result_data.get("decisions", [])],
                "action_items": [a for a in result_data.get("action_items", [])],
                "relevant_links": [l for l in result_data.get("relevant_links", [])],
                "success": True
            }
            
        except Exception as e:
            # If JSON parsing fails, structure the raw text response
            return {
                "summary": response.text[:1000],  # Limit to first 1000 chars
                "decisions": [],
                "action_items": [],
                "relevant_links": [],
                "success": True,
                "message": "Couldn't extract relevant data"
            }
        
    
    async def identify_visual_contexts(self, segments, video_key=None):
        """
        Identify parts of the transcript that would benefit from visual context
        
        Args:
            segments: List of transcript segments
            video_key: S3 key for the associated video if available
            
        Returns:
            List of segments with timestamps that need visual context
        """
        
        prompt = """
        Below is a transcript of a conversation. Please identify any key moments where visual context 
        would be most valuable for understanding what's being discussed. Focus on moments where:
        
        1. Someone is referencing something visual ("look at this", "as you can see here", etc.)
        2. A demonstration or visual explanation is happening
        3. A physical object or diagram is being described or pointed to
        4. Non-verbal communication seems significant based on the context
        5. Key decisions are being made with visual aids
        
        For each moment, provide:
        1. The exact timestamp (use the original timestamps from the segments)
        2. Why this moment needs visual context
        3. What you expect to see visually
        
        You MUST format your response as JSON, DONT use MARKDOWN:
        {
          "visual_moments": [
            {
              "start_time": "00:05:23",
              "end_time": "00:05:45", 
              "importance": "high|medium|low",
              "reason": "Brief explanation of why visual context is needed",
              "expected_visual": "What you might expect to see in this moment"
            }
          ]
        }
        
        IMPORTANT: Prioritize quality over quantity. Only include moments where visual context is actually indicated.

        Transcript with timestamps:
        """
        
        # Add transcript with timestamps
        formatted_transcript_with_times = ""
        for segment in segments:
            formatted_transcript_with_times += f"[{segment['start']} - {segment['end']}] {segment['speaker']}: {segment['text']}\n\n"
        
        prompt += formatted_transcript_with_times
        
        # Use Gemini API
        response = self.client.models.generate_content(
            model='gemini-2.0-flash',
            contents=prompt,
        )
        
        try:
            # Try to parse the response as JSON
            result_text = response.text
            
            # Look for JSON content between ```json and ``` if it exists
            if "```json" in result_text:
                json_content = result_text.split("```json")[1].split("```")[0].strip()
                result_data = json.loads(json_content)
            else:
                # Otherwise try to parse the whole response
                result_data = json.loads(result_text)
            
            visual_moments = result_data.get("visual_moments", [])
            
            # If we have a video key, process the video for these moments
            if video_key and len(visual_moments) > 0:
                screenshots = await self._extract_video_moments(video_key, visual_moments)
                
                # Add screenshot URLs to the visual moments
                for i, moment in enumerate(visual_moments):
                    if i < len(screenshots):
                        moment["screenshot_url"] = screenshots[i]
            
            return {
                "visual_moments": visual_moments,
                "success": True
            }
            
        except Exception as e:
            logger.error(f"Error identifying visual contexts: {str(e)}")
            return {
                "visual_moments": [],
                "success": False,
                "message": f"Error identifying visual contexts: {str(e)}"
            }

    async def _extract_video_moments(self, video_key, visual_moments, bucket_name=Settings.S3_BUCKET):
        """
        Extract screenshots from video at specific timestamps
        
        Args:
            video_key: S3 key for the video
            visual_moments: List of moments with timestamps
            bucket_name: AWS S3 bucket name
            
        Returns:
            List of URLs for the extracted screenshots
        """
        try:
            # Initialize S3 client
            s3 = boto3.client(
                's3',
                aws_access_key_id=Settings.AWS_ACCESS_KEY_ID,
                aws_secret_access_key=Settings.AWS_SECRET_ACCESS_KEY,
                region_name=Settings.AWS_REGION
            )
            
            # Create temp directory
            temp_dir = tempfile.mkdtemp()
            video_path = os.path.join(temp_dir, f"video_{uuid.uuid4()}.mp4")
            
            # Download video from S3
            s3.download_file(bucket_name, video_key, video_path)
            
            # Open video file
            cap = cv2.VideoCapture(video_path)
            if not cap.isOpened():
                raise Exception("Could not open video file")
            
            # Get video properties
            fps = cap.get(cv2.CAP_PROP_FPS)
            
            screenshot_urls = []
            
            # Process each visual moment
            for moment in visual_moments:
                start_time = moment.get("start_time")
                
                # Convert timestamp to seconds
                h, m, s = start_time.split(":")
                time_seconds = int(h) * 3600 + int(m) * 60 + float(s)
                
                # Calculate frame number
                frame_num = int(time_seconds * fps)
                
                # Set frame position
                cap.set(cv2.CAP_PROP_POS_FRAMES, frame_num)
                
                # Read the frame
                ret, frame = cap.read()
                if not ret:
                    continue
                
                # Generate a unique filename for the screenshot
                timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
                screenshot_filename = f"screenshot_{timestamp}_{uuid.uuid4()}.jpg"
                screenshot_path = os.path.join(temp_dir, screenshot_filename)
                
                # Save the frame as an image
                cv2.imwrite(screenshot_path, frame)
                
                # Upload to S3
                s3_key = f"screenshots/{screenshot_filename}"
                s3.upload_file(screenshot_path, bucket_name, s3_key)
                
                # Generate URL for the screenshot
                if Settings.S3_URL_EXPIRATION > 0:
                    # Generate presigned URL with expiration
                    url = s3.generate_presigned_url(
                        'get_object',
                        Params={'Bucket': bucket_name, 'Key': s3_key},
                        ExpiresIn=Settings.S3_URL_EXPIRATION
                    )
                else:
                    # Use direct S3 URL
                    url = f"https://{bucket_name}.s3.{Settings.AWS_REGION}.amazonaws.com/{s3_key}"
                
                screenshot_urls.append(url)
                
                # Clean up the screenshot file
                os.unlink(screenshot_path)
            
            # Release video file and clean up
            cap.release()
            os.unlink(video_path)
            os.rmdir(temp_dir)
            
            return screenshot_urls
            
        except Exception as e:
            logger.error(f"Error extracting video moments: {str(e)}")
            return []
        
    
