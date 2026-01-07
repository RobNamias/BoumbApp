import os
import httpx
import logging
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

class PerplexityClient:
    """
    Client for the Perplexity AI 'sonar' model.
    Acts as a 'Senior Musicologist' to fetch theoretical context.
    """
    BASE_URL = "https://api.perplexity.ai/chat/completions"
    MODEL = "sonar" # Standard model, more likely to be available

    def __init__(self):
        self.api_key = os.getenv("PERPLEXITY_API_KEY")
        if not self.api_key:
            raise ValueError("Missing PERPLEXITY_API_KEY environment variable. Check your .env file.")
        
        self.headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }
        self.logger = logging.getLogger("Librarian")
        self.logger.setLevel(logging.INFO)
        
        if not self.api_key:
             self.logger.error("API KEY IS MISSING/EMPTY!")
        else:
             masked_key = self.api_key[:8] + "..." + self.api_key[-4:]
             self.logger.info(f"🔑 API Key Loaded: {masked_key} (Len: {len(self.api_key)})")

    async def fetch_theory(self, topic: str) -> str:
        """
        Queries Perplexity to get a detailed musical breakdown of the topic.
        """
        self.logger.info(f"🧠 Searching theory for: {topic}")
        
        system_prompt = (
            "You are an expert Musicologist and Music Theory Teacher. "
            "Your goal is to explain musical styles in a way that a computer sequencer can understand. "
            "Focus strictly on: Rhythmic patterns (16th notes), Scales (names and intervals), "
            "Velocity/Dynamics, and Instrumentation roles. "
            "Avoid poetic descriptions. Be technical, precise, and concise."
            "Output Format: Markdown."
        )

        user_prompt = (
            f"Explain the musical characteristics of '{topic}'. "
            "Break it down into: \n"
            "1. Rhythm & Groove (Syncopation, Swing)\n"
            "2. Harmony & Scales\n"
            "3. Typical Instruments & Patterns (Kick, Snare, Bass)\n"
            "4. Velocity dynamic range."
        )

        payload = {
            "model": self.MODEL,
            "messages": [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            "temperature": 0.2
        }

        async with httpx.AsyncClient(timeout=30.0) as client:
            try:
                response = await client.post(self.BASE_URL, headers=self.headers, json=payload)
                response.raise_for_status()
                data = response.json()
                content = data['choices'][0]['message']['content']
                return content
            except httpx.HTTPStatusError as e:
                self.logger.error(f"API Error: {e.response.text}")
                raise

# Quick Test
if __name__ == "__main__":
    import asyncio
    async def main():
        client = PerplexityClient()
        print(await client.fetch_theory("Funk Bass"))
    
    asyncio.run(main())
