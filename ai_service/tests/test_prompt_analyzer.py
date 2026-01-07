
import pytest
from app.services.prompt_analyzer import PromptAnalyzer
from app.models.requests import GenerationParams

@pytest.fixture
def analyzer():
    return PromptAnalyzer()

def test_analyze_intent_explicit(analyzer):
    # Prompt contains explicit key
    prompt = "Compose a funky bassline in C# Major"
    params = analyzer.analyze_intent(prompt)
    
    assert params.root == "C#"
    assert params.scale_type == "Major"

def test_analyze_intent_fallback_global_key(analyzer):
    # Prompt is vague, Global Key provided
    prompt = "Make it bouncy"
    global_key = {"root": "D", "scale": "Minor"}
    params = analyzer.analyze_intent(prompt, global_key=global_key)
    
    assert params.root == "D"
    assert params.scale_type == "Minor"

def test_analyze_intent_heuristic_sad(analyzer):
    # Prompt is vague, NO Global Key
    # "Triste" should map to Minor
    prompt = "Une mélodie très triste et lente"
    params = analyzer.analyze_intent(prompt)
    
    assert params.scale_type == "Minor"
    # Root defaults to C if unknown
    assert params.root == "C"

def test_analyze_intent_heuristic_happy(analyzer):
    # "Joyeux" -> Major
    prompt = "Un truc super joyeux"
    params = analyzer.analyze_intent(prompt)
    
    assert params.scale_type == "Major"
