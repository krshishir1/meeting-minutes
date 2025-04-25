import os
import uuid
import tempfile
from pathlib import Path
from settings import Settings
from pipeline import process_audio

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
            
            return {
                "segments": transcription_result,
                "success": True
            }
        
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