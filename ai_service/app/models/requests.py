
from pydantic import BaseModel
from typing import Optional, Tuple, Dict

class GenerationParams(BaseModel):
    root: str = "C"
    scale_type: str = "Major"
    bpm: int = 120
    octave_range: Tuple[int, int] = (3, 5) # Default Lead
    density: str = "medium" # high, medium, low

class GenerateRequest(BaseModel):
    prompt: str
    bpm: int = 120
    options: Optional[GenerationParams] = None # Explicit overrides provided by user
    global_key: Optional[Dict[str, str]] = None # {"root": "C", "scale": "Major"}

class FeedbackRequest(BaseModel):
    request_id: str
    rating: int # 1-10
    comment: Optional[str] = None
