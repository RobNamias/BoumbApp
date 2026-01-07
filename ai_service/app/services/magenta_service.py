import os
import logging
from typing import Optional, List, Dict, Any

# Configure logging
logger = logging.getLogger(__name__)

# Constants
MAGENTA_MODEL_PATH = os.path.join(os.path.dirname(__file__), "../models/magenta/attention_rnn.mag")

class MagentaService:
    _instance = None
    _model = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(MagentaService, cls).__new__(cls)
            cls._instance._initialize()
        return cls._instance

    def _initialize(self):
        """Lazy loader for the massive TensorFlow model"""
        self.model_ready = False
        logger.info("MagentaService initialized (Lazy Loading)")

    def load_model(self):
        """Loads the model into memory. Heavy operation."""
        if self._model:
            return

        logger.info(f"Loading Magenta model from {MAGENTA_MODEL_PATH}...")
        
        try:
            # Import here to avoid overhead if service is unused
            import magenta.music as mm
            from magenta.models.shared import sequence_generator_bundle
            from magenta.models.melody_rnn import melody_rnn_sequence_generator
            from note_seq.protobuf import generator_pb2
            
            # Check if model file exists
            if not os.path.exists(MAGENTA_MODEL_PATH):
                raise FileNotFoundError(f"Model file not found at {MAGENTA_MODEL_PATH}")

            # Initialize the generator
            bundle = sequence_generator_bundle.read_bundle_file(MAGENTA_MODEL_PATH)
            generator_map = melody_rnn_sequence_generator.get_generator_map()
            
            self._model = generator_map['attention_rnn'](checkpoint=None, bundle=bundle)
            self._model.initialize()
            
            self.model_ready = True
            logger.info("Magenta model loaded successfully.")

        except ImportError as e:
            logger.error(f"Failed to import Magenta/TensorFlow: {e}")
            raise RuntimeError("Magenta dependencies not installed.")
        except Exception as e:
            logger.error(f"Failed to load Magenta model: {e}")
            raise

    def generate_melody(self, primer_notes: List[Dict[str, Any]], total_steps: int = 32, temperature: float = 1.0) -> Dict[str, Any]:
        """
        Generates a melody continuation.
        primer_notes: List of dicts {'pitch': 60, 'startTime': 0.0, 'endTime': 0.5}
        """
        if not self.model_ready:
            self.load_model()

        import magenta.music as mm
        from note_seq.protobuf import music_pb2, generator_pb2

        # 1. Convert JSON Primer to NoteSequence
        primer_sequence = music_pb2.NoteSequence()
        primer_sequence.ticks_per_quarter = 220 # Standard
        
        # Calculate max time to know where generation starts
        current_time = 0.0
        
        for note in primer_notes:
            n = primer_sequence.notes.add()
            n.pitch = int(note.get('pitch', 60))
            n.start_time = float(note.get('startTime', 0.0))
            n.end_time = float(note.get('endTime', n.start_time + 0.5))
            n.velocity = int(note.get('velocity', 80))
            current_time = max(current_time, n.end_time)

        # 2. Setup Generation Options
        # Seconds per step. Assuming 120 BPM, 1 step = 1/16th note = 0.125s
        # Total duration needed = total_steps * seconds_per_step
        qpm = 120.0
        seconds_per_step = 60.0 / qpm / 4.0
        
        total_seconds = total_steps * seconds_per_step # This is the absolute target end time
        
        # We want to generate FROM current_time TO total_seconds.
        # If primer is already longer than total_seconds, we extend by a small amount or stop.
        if current_time >= total_seconds:
             logger.warning(f"Primer ({current_time}s) is longer than target ({total_seconds}s). Extending by 1 bar.")
             total_seconds = current_time + (16 * seconds_per_step)

        generator_options = generator_pb2.GeneratorOptions()
        generate_section = generator_options.generate_sections.add()
        generate_section.start_time = current_time
        generate_section.end_time = total_seconds
        
        generator_options.args['temperature'].float_value = temperature
        generator_options.args['beam_size'].int_value = 1
        generator_options.args['branch_factor'].int_value = 1

        # 3. Generate
        logger.info(f"Generating melody... Primer length: {len(primer_notes)}, Target Duration: {total_seconds}s")
        sequence = self._model.generate(primer_sequence, generator_options)

        # 4. Convert back to JSON
        output_notes = []
        for note in sequence.notes:
            # Filter out the primer notes if they are included in result (usually yes)
            output_notes.append({
                "pitch": note.pitch,
                "startTime": round(note.start_time, 3),
                "endTime": round(note.end_time, 3),
                "velocity": note.velocity
            })

        return {"notes": output_notes}
