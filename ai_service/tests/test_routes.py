
import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.models.requests import GenerateRequest

client = TestClient(app)

# We need to mock the services, but since we haven't implemented dependency injection fully yet, 
# for this phase we might just test the wiring or create the route successfully first.
# To properly TDD the route without real LLM, we should stick to simple wiring or mock.
# Let's assume the LLM service is not yet called or is mocked inside the route logic (later step).
# For now, let's just assert that the endpoint exists and validates input.

def test_generate_endpoint_validation_error():
    response = client.post("/api/v1/generate", json={})
    assert response.status_code == 422 # Missing prompt

def test_feedback_endpoint_exists():
    response = client.post("/api/v1/feedback", json={"request_id": "123", "rating": 5})
    # status might be 404 if not implemented or 200/500
    # This just asserts we are trying to reach it
    assert response.status_code != 404

# Actual functional test will require mocking Logic or implementing the Route.
# Let's write the test that expects success, which will fail (RED).
def test_generate_endpoint_success():
    payload = {
        "prompt": "Funky bass",
        "bpm": 120
    }
    response = client.post("/api/v1/generate", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "request_id" in data
    assert "notes" in data
    assert "analysis" in data
