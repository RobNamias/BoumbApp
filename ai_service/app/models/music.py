
from pydantic import BaseModel
from typing import List, Optional

class NoteConstraint(BaseModel):
    pitch: str
    min_duration: Optional[float] = None
    max_duration: Optional[float] = None

class ScaleInfo(BaseModel):
    root: str
    scale_type: str
    notes: List[str]
