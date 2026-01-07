
import music21
from typing import List, Tuple
from app.models.music import NoteConstraint # Assuming we might define models later, but for now primitives are fine

class MusicTheoryService:
    def __init__(self):
        # Service is stateless for now
        pass

    def get_scale_notes(self, root: str, scale_type: str) -> List[str]:
        """
        Returns a list of pitch names (e.g. ['C', 'D', 'E']) for a given key.
        Supports exotic scales via Custom Dict, then falls back to music21.
        """
        
        # 1. Custom Scales Definition (Intervals from Root)
        # 0=Root, 1=m2, 2=M2, 3=m3, 4=M3, 5=P4, 6=d5/tri, 7=P5, 8=m6, 9=M6, 10=m7, 11=M7
        CUSTOM_SCALES = {
            "hirajoshi": [0, 2, 3, 7, 8], # Japanese
            "insen": [0, 1, 5, 7, 10],   # Japanese
            "iwato": [0, 1, 5, 6, 10],   # Japanese
            "blues": [0, 3, 5, 6, 7, 10], # Hexatonic Blues
            "pentatonic_minor": [0, 3, 5, 7, 10],
            "pentatonic_major": [0, 2, 4, 7, 9],
            "double_harmonic": [0, 1, 4, 5, 7, 8, 11], # Arabic/Byzantine
            "phrygian_dominant": [0, 1, 4, 5, 7, 8, 10]
        }
        
        scale_key = scale_type.lower().replace(" ", "_")
        
        try:
            # Validate root pitch
            root_obj = music21.pitch.Pitch(root)
            root_midi = root_obj.midi
            
            # A. Check Custom Dictionary First
            if scale_key in CUSTOM_SCALES:
                intervals = CUSTOM_SCALES[scale_key]
                distinct_names = []
                for interval in intervals:
                    p = music21.pitch.Pitch()
                    p.midi = root_midi + interval
                    name = p.name.replace('-', 'b')
                    distinct_names.append(name)
                return distinct_names

            # B. Fallback to Music21 Standard Scales
            if scale_key == "major":
                s = music21.scale.MajorScale(root)
            elif scale_key == "minor":
                s = music21.scale.MinorScale(root)
            elif scale_key == "dorian":
                 s = music21.scale.DorianScale(root)
            elif scale_key == "phrygian":
                 s = music21.scale.PhrygianScale(root)
            elif scale_key == "lydian":
                 s = music21.scale.LydianScale(root)
            elif scale_key == "mixolydian":
                 s = music21.scale.MixolydianScale(root)
            else:
                # Default Logic
                s = music21.scale.MinorScale(root)
            
            pitches = s.getPitches()
            distinct_names = []
            for p in pitches:
                name = p.name.replace('-', 'b')
                if name not in distinct_names:
                    distinct_names.append(name)
            
            return list(dict.fromkeys(distinct_names))

        except Exception as e:
            print(f"Error in get_scale_notes: {e}")
            return []

    def get_valid_pitches(self, scale_notes: List[str], min_octave: int, max_octave: int) -> List[str]:
        """
        Generates all valid MIDI pitches (e.g. C2, D2... C3) within the range
        using the allowed notes.
        """
        valid_pitches = []
        for octave in range(min_octave, max_octave + 1):
            for note_name in scale_notes:
                # Re-convert 'b' to '-' for music21 internal logic if needed, 
                # but here we just doing string concat
                # ex: 'Eb' + '2' -> 'Eb2'
                valid_pitches.append(f"{note_name}{octave}")
        
        # This is a naive implementation. 
        # Ideally we should sort them by pitch height to be clean.
        # Let's verify sort with music21 if we have time.
        return valid_pitches

    def validate_sequence(self, sequence: List[dict], allowed_notes: List[str]) -> bool:
        """
        Checks if a sequence of notes respects the allowed notes.
        sequence: List of dicts with 'pitch' key (e.g. 'C3', 'Eb2')
        """
        # Simplify allowed_notes to just Pitch Classes (C, Eb)
        # allowed_notes input might be ['C', 'Eb'] or ['C3', 'Eb3']? 
        # The spec says "allowed_notes" are usually Scale notes (C, D, E...)
        
        allowed_pcs = {n.replace('0','').replace('1','').replace('2','').replace('3','').replace('4','').replace('5','').replace('6','').replace('7','').replace('8','') for n in allowed_notes}
        
        for note in sequence:
            pitch_str = note.get('pitch', '') # "C3"
            # Extract PC
            pc = pitch_str.rstrip('0123456789')
            if pc not in allowed_pcs:
                return False
        return True

    def detect_key_from_notes(self, notes: List[str]) -> str:
        """
        Uses music21 analysis to guess key.
        """
        try:
            s = music21.stream.Stream()
            for n in notes:
                s.append(music21.note.Note(n))
            k = s.analyze('key')
            return f"{k.tonic.name} {k.mode}"
        except Exception:
            return "Unknown"
