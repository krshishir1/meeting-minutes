import os
import json
import uuid
import tempfile
import asyncio
from models import Summary
from google import genai
from pathlib import Path
from settings import Settings
from pipeline import process_audio
from setup_logging import setup_logging

logger = setup_logging(__name__)

class TranscriptionService:
    async def transcribe_audio(self, audio_file):
        """Process uploaded audio file and return diarized transcription"""
        try:
            # Create temp file to store the uploaded audio
            temp_dir = tempfile.mkdtemp()
            temp_audio_path = Path(temp_dir) / f"{uuid.uuid4()}{Path(audio_file.filename).suffix}"
            
            # Write the audio file content to the temp file
            with open(temp_audio_path, "wb") as f:
                f.write(await audio_file.read())
            
            # Process the audio file using Deepgram
            transcription_result = process_audio(
                str(temp_audio_path),
                Settings.DEEPGRAM_API_KEY
            )
            
            # Clean up temp file
            os.unlink(temp_audio_path)
            os.rmdir(temp_dir)
            
            return transcription_result
        
        except Exception as e:
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
        
    
    