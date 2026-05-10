import asyncio
from groq import Groq
from app.config import settings

JARVIS_PROMPT = """You are JARVIS, an elite AI system created by Azlan.
You are highly intelligent, sophisticated, and helpful.
You speak with confidence and subtle wit.
You address the user as Azlan.
Never say you are a basic chatbot.
You are an advanced AI operating system."""

class AIService:
    def __init__(self):
        self.client = Groq(api_key=settings.groq_api_key)

    def _call_groq(self, messages, max_tokens):
        all_messages = [
            {"role": "system", "content": JARVIS_PROMPT}
        ] + messages
        response = self.client.chat.completions.create(
            model=settings.ai_model,
            max_tokens=max_tokens,
            messages=all_messages,
        )
        return {
            "content": response.choices[0].message.content,
            "tokens_used": response.usage.total_tokens,
            "model": response.model,
        }

    async def generate_response(self, messages, mode="chat", max_tokens=2000):
        try:
            loop = asyncio.get_event_loop()
            result = await loop.run_in_executor(
                None,
                self._call_groq,
                messages,
                max_tokens
            )
            return result
        except Exception as e:
            raise Exception(f"AI error: {str(e)}")

ai_service = AIService()
