import os
import httpx
import json
import logging
import re
from app.core.exceptions import LLMGenerationError

logger = logging.getLogger(__name__)

class LLMService:
    def __init__(self, model: str = "qwen2.5:3b", base_url: str = None):
        # Prefer env var if set (e.g. Docker), else fallback to localhost
        self.model = model
        self.base_url = base_url or os.getenv("OLLAMA_HOST", "http://localhost:11434")

    async def generate(self, system_prompt: str, user_prompt: str) -> dict:
        """
        Call Ollama Chat API and parse JSON response.
        """
        url = f"{self.base_url}/api/chat"
        logger.info(f"DEBUG: LLMService init with OLLAMA_HOST='{os.getenv('OLLAMA_HOST')}'")
        logger.info(f"DEBUG: LLMService base_url='{self.base_url}'")
        logger.info(f"DEBUG: Attempting to connect to URL: {url}")
        
        payload = {
            "model": self.model,
            "messages": [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            "format": "json", # Force JSON output from Ollama
            "stream": False,
            "options": {
                "temperature": 0.5, # Lower temp for structure stability
                "num_predict": 1024
            }
        }

        try:
            # Increased timeout for cold start (model loading)
            async with httpx.AsyncClient(timeout=120.0) as client:
                logger.info(f"Calling Ollama ({self.model})...")
                response = await client.post(url, json=payload, timeout=180.0) # Maximum timeout for complex constraints
                response.raise_for_status()
                
                result = response.json()
                content = result.get("message", {}).get("content", "")
                logger.info(f"Ollama Response Length: {len(content)}")
                logger.debug(f"Ollama Raw Content: {content[:200]}...")
                
                # Extract JSON from Markdown code blocks if present
                clean_json = self._extract_json(content)
                logger.debug(f"Cleaned JSON: {clean_json[:200]}...")
                
                return json.loads(clean_json)

        except (httpx.RequestError, httpx.HTTPStatusError) as e:
            logger.error(f"Ollama Connection Error: {e}")
            raise LLMGenerationError(f"Failed to connect to AI Engine: {e}")
        except json.JSONDecodeError as e:
            logger.error(f"Invalid JSON from AI: {content} - Error: {e}")
            raise LLMGenerationError(f"AI returned invalid data format. Raw: {content[:100]}...")
            
    def _extract_json(self, text: str) -> str:
        """
        Robustly extract JSON (List or Object) from text.
        """
        # 1. Try to find markdown code blocks with JSON
        match = re.search(r"```(?:json)?\s*(\[.*?\]|\{.*?\})\s*```", text, re.DOTALL)
        if match:
             return match.group(1)
        
        # 2. Heuristic: Look for outer-most brackets/braces
        # Check if it looks more like a list or an object
        first_open_bracket = text.find("[")
        first_open_brace = text.find("{")
        
        
        # If both exist, take the one that appears first
        end_char = ""
        start_index = -1
        
        if first_open_bracket != -1 and (first_open_brace == -1 or first_open_bracket < first_open_brace):
             end_char = "]"
             start_index = first_open_bracket
        elif first_open_brace != -1:
             end_char = "}"
             start_index = first_open_brace
             
        if start_index != -1:
             end_index = text.rfind(end_char)
             if end_index != -1:
                 return text[start_index : end_index + 1]
                 
        return text # Hope it's raw JSON or fail gracefully
