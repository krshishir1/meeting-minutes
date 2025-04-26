from pydantic import BaseModel
from typing import Optional, List, Dict, Any

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

class VisualMoment(BaseModel):
    start_time: str
    end_time: str
    importance: str
    reason: str
    expected_visual: str
    screenshot_url: Optional[str] = None

class Summary(BaseModel):
    summary: str
    decisions: list[str]
    action_items: list[str]
    relevant_links: list[LinkModel]

class TranscriptionResponse(BaseModel):
    segments: List[TranscriptionSegment]
    summary: Summary
    visual_moments : List[VisualMoment] = None
    success: bool
    message: str = "Transcription and Summarization completed successfully"

class S3FileRequest(BaseModel):
    audio_s3_key: str
    video_s3_key: str
    bucket_name: Optional[str] = None


class VisualContextRequest(BaseModel):
    segments: List[Dict[str, Any]]
    video_key: Optional[str] = None
    
class VisualContextResponse(BaseModel):
    visual_moments: List[VisualMoment]
    success: bool
    message: Optional[str] = None