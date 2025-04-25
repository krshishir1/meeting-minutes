import os
import json
import uuid
import tempfile
import asyncio
from models import Summary
from google import genai
import shutil

from pathlib import Path
from settings import Settings
from pipeline import process_audio
from setup_logging import setup_logging

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
        
    
