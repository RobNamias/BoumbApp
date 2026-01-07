from fastapi.testclient import TestClient
from app.main import app
from unittest.mock import patch, MagicMock

client = TestClient(app)

# Mock Response from Ollama
MOCK_OLLAMA_RESPONSE = {
    "response": "{\"sequence\":[{\"note\":\"C4\",\"time\":\"0:0:0\",\"duration\":\"4n\",\"velocity\":0.9}]}"
}

def test_health_check():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"status": "ok", "service": "boumbapp_ai_api"}

@patch("requests.post")
def test_generate_melody_success(mock_post):
    # Setup Mock
    mock_response = MagicMock()
    mock_response.status_code = 200
    mock_response.json.return_value = MOCK_OLLAMA_RESPONSE
    mock_post.return_value = mock_response

    # Request Payload
    payload = {
        "prompt": "Funky Bass",
        "tempo": 110,
        "scale": "D Minor"
    }

    response = client.post("/v1/melody", json=payload)

    # Assertions
    assert response.status_code == 200
    data = response.json()
    assert "sequence" in data
    assert data["sequence"][0]["note"] == "C4"
    assert data["sequence"][0]["time"] == "0:0:0"

    # Verify Prompt Construction (The Hybrid Logic)
    # We check if 'tempo' and 'scale' were actually sent to Ollama
    call_args = mock_post.call_args
    assert call_args is not None
    sent_json = call_args[1]["json"]
    sent_prompt = sent_json["prompt"]
    
    assert "System:" in sent_prompt
    assert "Funky Bass" in sent_prompt
    assert "Tempo: 110" in sent_prompt
    assert "Scale: D Minor" in sent_prompt

import requests

@patch("requests.post")
def test_generate_melody_ollama_failure(mock_post):
    # Setup Mock to fail
    mock_post.side_effect = requests.exceptions.RequestException("Ollama Down")

    payload = {"prompt": "Test"}
    response = client.post("/v1/melody", json=payload)


    assert response.status_code == 200 # App handles error and returns JSON
    data = response.json()
    assert data["status"] == "error"
    assert "Ollama Down" in data["message"]
