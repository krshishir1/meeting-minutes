from fastapi import FastAPI, Depends, UploadFile, File, Depends, HTTPException, Form, responses
from models import TranscriptionResponse
from services import TranscriptionService

from fastapi.middleware.cors import CORSMiddleware
from settings import Settings

from setup_logging import setup_logging
logger = setup_logging(__name__)

app = FastAPI(
    title=Settings.app_name,
    description="API for audio transcription using speaker diarization and Whisper",
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
    audio_file: UploadFile = File(...),
    service: TranscriptionService = Depends(lambda: TranscriptionService()),
):
    """
    Transcribe audio with speaker diarization
    
    - **audio_file**: Audio file to transcribe (.wav, .mp3, etc.)
    - **auth_token**: Optional HuggingFace token (will use environment variable if not provided)
    """
    # Validate file type
    allowed_extensions = {".wav", ".mp3", ".ogg", ".flac", ".m4a"}
    file_ext = '.' + audio_file.filename.split('.')[-1].lower()
    
    if file_ext not in allowed_extensions:
        raise HTTPException(
            status_code=400, 
            detail=f"Unsupported file format. Supported formats: {', '.join(allowed_extensions)}"
        )
    
    # Process transcription
    result = await service.transcribe_audio(audio_file)

    logger.debug(f"This is result: {result}") 
    if not result["success"]:
        raise HTTPException(
            status_code=500,
            detail=result["message"]
        )
    
    return result


@app.get("/")
async def root():
    return responses.RedirectResponse(url="/docs")