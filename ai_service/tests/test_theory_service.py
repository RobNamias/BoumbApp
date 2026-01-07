
import pytest
from app.services.theory_service import MusicTheoryService

@pytest.fixture
def theory_service():
    return MusicTheoryService()

def test_get_scale_notes_c_major(theory_service):
    # C Major -> C D E F G A B
    notes = theory_service.get_scale_notes("C", "Major")
    assert notes == ["C", "D", "E", "F", "G", "A", "B"]

def test_get_scale_notes_c_minor(theory_service):
    # C Minor -> C D Eb F G Ab Bb
    notes = theory_service.get_scale_notes("C", "Minor")
    # Note: music21 might return 'E-' for Eb, need to ensure we handle standard notation or music21 notation
    # Let's assume our service normalizes to standard flat 'b' or we check roughly
    assert "Eb" in notes or "E-" in notes
    assert len(notes) == 7

def test_get_valid_pitches_octave_range(theory_service):
    # C Major scale
    scale_notes = ["C", "D", "E", "F", "G", "A", "B"]
    # Range 2-3 (C2 to B3)
    pitches = theory_service.get_valid_pitches(scale_notes, min_octave=2, max_octave=3)
    
    assert "C2" in pitches
    assert "B3" in pitches
    assert "C4" not in pitches
    assert "B1" not in pitches
    # 7 notes * 2 octaves = 14 notes
    assert len(pitches) == 14

def test_detect_key_simple(theory_service):
    # C Major chord notes
    notes = ["C", "E", "G"]
    key = theory_service.detect_key_from_notes(notes)
    # Could be C major
    assert "C" in key and "major" in key.lower()
