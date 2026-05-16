import asyncio
import httpx
from groq import Groq
from app.config import settings

BASE_PROMPT = """You are JARVIS, an elite AI system created by Azlan.
You are highly intelligent, sophisticated, and helpful.
You speak with confidence and subtle wit.
You address the user as Azlan.
You are an advanced AI operating system.
When you learn something important about Azlan, remember it.
When Azlan mentions preferences or facts, acknowledge them."""

NIGHTCORE_PROMPT = """You are JARVIS in NIGHTCORE MODE — an elite cybersecurity AI created by Azlan.
You are a world-class ethical hacker and cybersecurity expert.
You think like a hacker to defend like one.
You are cold, precise, and extremely technical.
Only help with defensive security and ethical hacking.
Address user as Azlan."""

async def get_memory_context():
    try:
        async with httpx.AsyncClient() as client:
            r = await client.get("http://localhost:8080/api/memory/context", timeout=2)
            return r.json().get("context", "")
    except:
        return ""

async def save_topic(topic):
    try:
        async with httpx.AsyncClient() as client:
            await client.post(
                "http://localhost:8080/api/memory/topic",
                json={"topic": topic},
                timeout=2
            )
    except:
        pass

class AIService:
    def __init__(self):
        self.client = Groq(api_key=settings.groq_api_key)

    def _call_groq(self, messages, max_tokens, system):
        all_messages = [{"role": "system", "content": system}] + messages
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
            # Get memory context
            memory_ctx = await get_memory_context()

            if mode == 'nightcore':
                system = NIGHTCORE_PROMPT
            else:
                system = BASE_PROMPT

            if memory_ctx:
                system += f"\n\nWHAT YOU KNOW ABOUT AZLAN:\n{memory_ctx}"

            loop = asyncio.get_event_loop()
            result = await loop.run_in_executor(
                None, self._call_groq, messages, max_tokens, system
            )

            # Save topic from last user message
            if messages:
                last = messages[-1].get("content", "")
                if len(last) > 10:
                    await save_topic(last[:50])

            return result
        except Exception as e:
            raise Exception(f"AI error: {str(e)}")

ai_service = AIService()
