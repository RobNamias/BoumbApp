
from pydantic import BaseModel
from typing import List, Any
from app.models.requests import GenerationParams

class GenerateResponse(BaseModel):
    request_id: str
    notes: List[dict] # The JSON pattern
    analysis: GenerationParams # Normalized params used for generation
