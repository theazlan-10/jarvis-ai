from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc
from app.models.conversation import Conversation
from app.models.message import Message
from app.config import settings
from typing import List, Optional
import uuid

class MemoryService:

    async def get_or_create_conversation(self, session, conversation_id=None, mode="chat"):
        if conversation_id:
            result = await session.execute(
                select(Conversation).where(Conversation.id == conversation_id)
            )
            conversation = result.scalar_one_or_none()
            if conversation:
                return conversation

        conversation = Conversation(
            id=str(uuid.uuid4()),
            mode=mode,
        )
        session.add(conversation)
        await session.flush()
        return conversation

    async def save_message(self, session, conversation_id, role, content, tokens_used=0, model_used=None):
        result = await session.execute(
            select(Message)
            .where(Message.conversation_id == conversation_id)
            .order_by(desc(Message.sequence))
            .limit(1)
        )
        last = result.scalar_one_or_none()
        next_seq = (last.sequence + 1) if last else 0

        message = Message(
            conversation_id=conversation_id,
            role=role,
            content=content,
            tokens_used=tokens_used,
            model_used=model_used,
            sequence=next_seq,
        )
        session.add(message)

        result = await session.execute(
            select(Conversation).where(Conversation.id == conversation_id)
        )
        conv = result.scalar_one_or_none()
        if conv:
            conv.message_count += 1

        await session.flush()
        return message

    async def get_context_messages(self, session, conversation_id):
        result = await session.execute(
            select(Message)
            .where(
                Message.conversation_id == conversation_id,
                Message.role.in_(["user", "assistant"])
            )
            .order_by(desc(Message.sequence))
            .limit(settings.max_memory_messages)
        )
        messages = list(reversed(result.scalars().all()))
        return [{"role": m.role, "content": m.content} for m in messages]

memory_service = MemoryService()
