
import logging
from typing import Optional, Dict
from app.models.requests import GenerationParams

logger = logging.getLogger(__name__)

class PromptAnalyzer:
    def __init__(self, llm_service):
        self.llm = llm_service

    async def analyze_intent(self, prompt: str, global_key: Optional[Dict[str, str]] = None) -> GenerationParams:
        """
        Uses LLM to extract musical parameters, allowing for smart style-to-scale mapping.
        """
        # Default Context
        g_root = global_key.get("root", "C") if global_key else "C"
        g_scale = global_key.get("scale", "Major") if global_key else "Major"
        
        system_prompt = f"""
        You are a Music Theory Expert.
        Task: Extract musical parameters from the user request.
        
        CONTEXT:
        - Current Project Key: {g_root} {g_scale}
        
        INSTRUCTIONS:
        1. **Detect Key/Scale**:
           - If user specifies a key (e.g. "in F# Minor"), USE IT.
           - If user specifies a STYLE that implies a scale (e.g. "Japanese" -> Hirajoshi, "Blues" -> Blues Scale, "Arabic" -> Double Harmonic), OVERRIDE the project key.
           - Otherwise, KEEP the Project Key.
           
        2. **Detect BPM**:
           - If specified, use it.
           - If style implies speed (e.g. "Techno" -> 140, "Lofi" -> 85), infer it.
           - Default: 120.

        3. **Detect Density/Octave**:
           - Density: 'low', 'medium', 'high'.
           - Octave: 'bass' (2-3), 'mid' (3-5), 'high' (4-6). Return as [min, max].

        OUTPUT FORMAT (JSON ONLY):
        {{
            "root": "C",
            "scale_type": "Major",
            "bpm": 120,
            "density": "medium",
            "octave_range": [3, 5]
        }}
        """
        
        try:
            # Call LLM (3B model is recommended for this logic)
            analysis = await self.llm.generate(system_prompt, f"User Request: {prompt}")
            
            # Map Parsed JSON to Pydantic Model (handling defaults safely)
            return GenerationParams(
                root=analysis.get("root", g_root),
                scale_type=analysis.get("scale_type", g_scale),
                bpm=int(analysis.get("bpm", 120)),
                density=analysis.get("density", "medium"),
                octave_range=tuple(analysis.get("octave_range", [3, 5]))
            )

        except Exception as e:
            logger.error(f"Smart Analysis Failed: {e}. Falling back to Global Key.")
            # Fallback
            return GenerationParams(
                root=g_root,
                scale_type=g_scale,
                bpm=120,
                density="medium",
                octave_range=(3, 5)
            )
