
from app.models.requests import GenerationParams
from typing import List
from rag_pipeline.rag_loader import RagLoader

class PromptFactory:
    def __init__(self):
        self.rag = RagLoader()

    def build_system_prompt(self, params: GenerationParams, valid_notes: List[str], user_prompt: str) -> str:
        
        notes_str = ", ".join(valid_notes)

        # RAG Retrieval
        rag_context = self.rag.find_context(user_prompt)
        rag_section = ""
        if rag_context:
            rag_section = f"\n### THEORETICAL GUIDANCE (From {user_prompt})\nUse these rules to guide your rhythm and note choice:\n{rag_context}\n"
        
        return f"""
You are an expert music composer AI.
Your task is to generate a monophonic melody (one note at a time) based on the user's request.

### CRITICAL: RAG STRUCTURAL TEMPLATES
{rag_section if rag_context else "No specific rhythmic template found. Create a standard pattern for this style."}
**INSTRUCTION**: If a "STRUCTURAL TEMPLATE" is provided above, you MUST copy its rhythmic grid exactly. Do not improvise the rhythm if a template exists.

### CRITICAL INSTRUCTION: QUANTITY & FORMAT
- **Target Length**: A full 2-bar loop (32 steps).
- **Minimum Quantity**: You MUST generate **at least 8 notes**.
- **Forbidden**: Do NOT return a single note. Do NOT return a single JSON object.
- **Required Format**: You MUST return a **JSON LIST** (Array) of objects. `[ {{...}}, {{...}} ]`

### GLOBAL CONSTRAINTS
1. **Scale/Key**: You MUST use ONLY the following notes (No chromatisim allowed):
   [{notes_str}]

3. **Density Strategy ({params.density.upper()})**:
   {
    " - **HIGH DENSITY**: You MUST use mostly short notes (1/16th, duration=1). Create a continuous, driving stream of notes. **Do NOT leave gaps larger than 1 step**. Your pattern MUST contain at least 16 notes for a 32-step loop."
    if params.density == "high" else
    " - **LOW DENSITY**: You MUST use long, sustained notes (duration=4 to 8). Leave space and silences. Create an atmospheric feel."
    if params.density == "low" else
    " - **MEDIUM DENSITY**: Balance short and long notes. Create a groovy, rhythmic pattern."
   }

4. **Pitch Strategy**:
   {
       "- **BASSLINE RULE**: You are generating a BASSLINE. You MUST use the **ROOT NOTE** (" + params.root + ") for **90%** of the pattern. Do NOT walk the scale like a melody. Repetition is key."
       if params.octave_range[0] < 4 else 
       "- Use the provided scale to create a motif."
   }

5. **Timing**:
   - Time range: 0 to 31.
   - Fill the loop! (Silences are allowed but it must be a complete musical phrase).

3.  **JSON Structure**:
    Example (Melody spanning 2 bars):
   [
      {{ "start": 0, "duration": 4, "pitch": "C3", "velocity": 100 }},
      {{ "start": 4, "duration": 2, "pitch": "E3", "velocity": 90 }},
      {{ "start": 6, "duration": 1, "pitch": "F3", "velocity": 85 }}, 
      {{ "start": 7, "duration": 1, "pitch": "G3", "velocity": 85 }},
      {{ "start": 8, "duration": 4, "pitch": "G3", "velocity": 95 }},
      {{ "start": 12, "duration": 2, "pitch": "B3", "velocity": 85 }},
      {{ "start": 14, "duration": 2, "pitch": "C4", "velocity": 100 }},
      {{ "start": 18, "duration": 3, "pitch": "G3", "velocity": 90 }},
      {{ "start": 21, "duration": 1, "pitch": "A3", "velocity": 80 }},
      {{ "start": 24, "duration": 4, "pitch": "E3", "velocity": 80 }},
      {{ "start": 28, "duration": 4, "pitch": "C3", "velocity": 70 }}
   ]

### CONTEXT
- **BPM**: {params.bpm}
- **Style/Intent**: "{user_prompt}"
- **Root**: {params.root}
- **Scale**: {params.scale_type}

### OUTPUT
Return ONLY the JSON ARRAY `[...]`.
"""

    def build_primer_prompt(self, params: GenerationParams, valid_notes: List[str], user_prompt: str) -> str:
        notes_str = ", ".join(valid_notes)
        return f"""
You are an expert music composer AI.
Your task is to generate a SHORT musical idea (PRIMER) to start a melody.
This primer will be continued by a neural network, so it must be catchy and set the mood.

### CONSTRAINTS
- **Length**: Generate exactly 4 to 8 notes. (Total duration approx 4-8 steps).
- **Scale**: Use only: [{notes_str}]
- **Style**: "{user_prompt}" ({params.root} {params.scale_type})

### OUTPUT FORMAT
Return a JSON ARRAY of objects: `[ {{ "start": 0, "duration": 2, "pitch": "C3", "velocity": 90 }}, ... ]`
Do NOT wrap in markdown. Just the JSON.
"""
