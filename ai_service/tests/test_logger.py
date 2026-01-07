
import pytest
import os
import csv
from app.core.logger import LoggerService
from datetime import datetime

# Setup temp log file
LOG_FILE = "test_logs.csv"

@pytest.fixture
def logger_service():
    # Teardown: Remove file before test
    if os.path.exists(LOG_FILE):
        os.remove(LOG_FILE)
    
    service = LoggerService(log_file=LOG_FILE)
    yield service
    
    # Teardown: Remove file after test
    if os.path.exists(LOG_FILE):
        os.remove(LOG_FILE)

def test_log_request_creates_file_and_entry(logger_service):
    # Data
    request_id = "test-uuid"
    prompt = "Test prompt"
    context = {"key": "C Major", "bpm": 120}
    response_json = {"notes": []}
    
    # Action (Async method, so we should really use pytest-asyncio, 
    # but for CSV writing we might keep it synchronous for simplicity first, or use async)
    # Assumons un logger synchrone pour commencer simple
    logger_service.log_transaction(
        request_id=request_id,
        prompt=prompt,
        context=context,
        system_prompt="Sys Prompt",
        response_json=response_json,
        duration=0.5
    )
    
    # Assert
    assert os.path.exists(LOG_FILE)
    
    with open(LOG_FILE, mode='r', newline='', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        rows = list(reader)
        assert len(rows) == 1
        assert rows[0]["RequestID"] == request_id
        assert rows[0]["Prompt"] == prompt
        assert rows[0]["Duration"] == "0.5"
