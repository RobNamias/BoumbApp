from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
import httpx
import json
import logging
import csv
import time
from datetime import datetime, timezone, timedelta
from app.routes import generate, feedback
from app.core.exceptions import setup_exception_handlers
from app.core.logger import DualLogger

# Configure Logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize Global Services
logger_service = DualLogger() # This will be injected/used by routers via Dependency Injection or Global Import

app = FastAPI(
    title="BoumbApp AI Service",
    description="API pour générer des mélodies via Ollama",
    version="2.0.0"
)

# CORS Configuration
origins = [
    "http://localhost:5173",  # Vite Frontend
    "http://127.0.0.1:5173",
    "*" # Permissive for dev
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

setup_exception_handlers(app)

# Include Routers
app.include_router(generate.router, prefix="/api/v1")
app.include_router(feedback.router, prefix="/api/v1")

@app.get("/")
def health_check():
    return {"status": "ok", "service": "boumbapp_ai_api", "version": "1.1.0"}
