from pydantic import BaseModel
from typing import Optional, List, Dict

class TranscriptionRequest(BaseModel):
    auth_token: Optional[str] = None

class TranscriptionSegment(BaseModel):
    speaker: str
    start: str
    end: str
    text: str

class LinkModel(BaseModel):
    description: str
    URL: str

class Summary(BaseModel):
    summary: str
    decisions: list[str]
    action_items: list[str]
    relevant_links: list[LinkModel]

class TranscriptionResponse(BaseModel):
    segments: List[TranscriptionSegment]
    summary: Summary
    success: bool
    message: str = "Transcription and Summarization completed successfully"

class S3FileRequest(BaseModel):
    s3_key: str
    bucket_name: Optional[str] = None