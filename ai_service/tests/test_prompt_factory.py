
import pytest
from app.services.prompt_factory import PromptFactory
from app.models.requests import GenerationParams

@pytest.fixture
def factory():
    return PromptFactory()

def test_build_system_prompt_contains_constraints(factory):
    params = GenerationParams(bpm=128, root="C", scale_type="Major")
    valid_notes = ["C3", "D3", "E3"]
    user_prompt = "Funky Bass"
    
    system_prompt = factory.build_system_prompt(params, valid_notes, user_prompt)
    
    # Check injection
    assert "128" in system_prompt
    assert "C3, D3, E3" in system_prompt
    assert "Funky Bass" in system_prompt
    
    # Check strict constraints
    assert "32" in system_prompt # 32 steps
    assert "JSON" in system_prompt
    assert "start" in system_prompt
    assert "duration" in system_prompt
