from fastapi import FastAPI, Depends, HTTPException, Body
from models import TranscriptionResponse, S3FileRequest
from services import TranscriptionService, SummaryService
from fastapi.middleware.cors import CORSMiddleware
from settings import Settings
from setup_logging import setup_logging
import boto3
import tempfile
import os
import uuid
from pathlib import Path
import traceback

from dotenv import load_dotenv
load_dotenv()

logger = setup_logging(__name__)

app = FastAPI(
    title=Settings.app_name,
    description="API for audio transcription using speaker diarization with S3 integration",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/transcribe", response_model=TranscriptionResponse)
async def transcribe_audio(
    file_request: S3FileRequest = Body(...),
    transcribe_service: TranscriptionService = Depends(lambda: TranscriptionService()),
    summary_service: SummaryService = Depends(lambda: SummaryService()),
):
    """
    Transcribe audio with speaker diarization and generate summaries
    
    - **s3_key**: S3 object key for the audio file (.wav, .mp3, etc.)
    - **bucket_name**: (Optional) S3 bucket name (defaults to configured bucket)
    """
    try:
        # Get the file from S3
        bucket = Settings.S3_BUCKET
        s3_key = file_request.s3_key
        
        # Validate file extension
        allowed_extensions = {".wav", ".mp3", ".ogg", ".flac", ".m4a"}
        file_ext = Path(s3_key).suffix.lower()
        
        if file_ext not in allowed_extensions:
            raise HTTPException(
                status_code=400, 
                detail=f"Unsupported file format. Supported formats: {', '.join(allowed_extensions)}"
            )
        
        # Download file from S3 to a temporary location
        temp_dir = tempfile.mkdtemp()
        temp_audio_path = os.path.join(temp_dir, f"{uuid.uuid4()}{file_ext}")
        
        logger.info(f"Downloading {s3_key} from bucket {bucket} to {temp_audio_path}")
        
        try:

            
            s3_client = boto3.client(
                's3',
                aws_access_key_id=Settings.AWS_ACCESS_KEY_ID,
                aws_secret_access_key=Settings.AWS_SECRET_ACCESS_KEY,
                region_name=Settings.AWS_REGION
            )

            s3_client.head_object(Bucket=bucket, Key=s3_key)
            logger.debug("Object exists!")
            
            s3_client.download_file(bucket, s3_key, temp_audio_path)
            logger.info(f"Successfully downloaded file from S3")
            
        except Exception as e:
            logger.error(f"Error downloading from S3: {str(e)}")
            logger.error(traceback.format_exc())
            raise HTTPException(status_code=404, detail=f"File not found in S3 or access denied: {str(e)}")
        
        try:
            # Process the downloaded audio file
            result = await transcribe_service.transcribe_audio_from_path(temp_audio_path)
            
            # Process summarization if transcription was successful
            if result and result.get("success", False):
                summary = await summary_service.generate_summary(result.get("segments", []))
                logger.debug(f"Generated summary: {summary}")
            else:
                summary = {
                    "summary": "Transcription failed, no summary available.",
                    "decisions": [],
                    "action_items": [],
                    "relevant_links": []
                }
            
            # Clean up the temporary file
            try:
                os.unlink(temp_audio_path)
                os.rmdir(temp_dir)
            except Exception as e:
                logger.warning(f"Error cleaning up temporary file: {str(e)}")
            
            if not result or not result.get("success", False):
                raise HTTPException(
                    status_code=500,
                    detail=result.get("message", "Unknown error during transcription")
                )
            
            return TranscriptionResponse(
                segments=result.get("segments", []),
                summary=summary,
                success=True,
                message="Transcription and summarization completed successfully"
            )
            
        except HTTPException:
            # Re-raise HTTP exceptions
            raise
            
        except Exception as e:
            logger.error(f"Error processing audio: {str(e)}")
            logger.error(traceback.format_exc())
            
            # Clean up the temporary file in case of exception
            try:
                if os.path.exists(temp_audio_path):
                    os.unlink(temp_audio_path)
                if os.path.exists(temp_dir):
                    os.rmdir(temp_dir)
            except:
                pass
                
            raise HTTPException(status_code=500, detail=f"Error processing audio: {str(e)}")
            
    except HTTPException:
        # Re-raise HTTP exceptions
        raise
    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}")
        logger.error(traceback.format_exc())
        raise HTTPException(status_code=500, detail=f"Server error: {str(e)}")

@app.get("/")
async def root():
    return {"message": "Welcome to briefly!"}

@app.get("/docs")
async def docs():
    return responses.RedirectResponse(url="/docs")