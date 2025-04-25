from pydantic import BaseModel
from typing import Optional, List

class TranscriptionRequest(BaseModel):
    auth_token: Optional[str] = None

class TranscriptionSegment(BaseModel):
    speaker: str
    start: str
    end: str
    text: str

class TranscriptionResponse(BaseModel):
    segments: List[TranscriptionSegment]
    success: bool
    message: str = "Transcription completed successfully"