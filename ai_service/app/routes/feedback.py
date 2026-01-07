from fastapi import APIRouter, HTTPException
from app.models.requests import FeedbackRequest
from app.core.logger import DualLogger

router = APIRouter()
logger_service = DualLogger()

@router.post("/feedback")
async def collect_feedback(request: FeedbackRequest):
    # Fire and forget (append to csv)
    logger_service.add_user_feedback(
        request_id=request.request_id,
        rating=request.rating,
        comment=request.comment
    )
        
    return {"status": "ok", "message": "Feedback recorded"}
