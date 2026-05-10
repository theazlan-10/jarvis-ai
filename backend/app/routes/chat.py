from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from pydantic import BaseModel
from typing import Optional
from app.database import get_db
from app.services.ai_service import ai_service
from app.services.memory_service import memory_service

router = APIRouter()

class ChatRequest(BaseModel):
    message: str
    conversation_id: Optional[str] = None
    mode: str = "chat"

class ChatResponse(BaseModel):
    response: str
    conversation_id: str
    tokens_used: int
    model: str

@router.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest, db: AsyncSession = Depends(get_db)):
    if not request.message.strip():
        raise HTTPException(status_code=400, detail="Message cannot be empty")
    try:
        conversation = await memory_service.get_or_create_conversation(
            session=db,
            conversation_id=request.conversation_id,
            mode=request.mode,
        )
        await memory_service.save_message(
            session=db,
            conversation_id=conversation.id,
            role="user",
            content=request.message,
        )
        context = await memory_service.get_context_messages(
            session=db,
            conversation_id=conversation.id,
        )
        ai_response = await ai_service.generate_response(
            messages=context,
            mode=request.mode,
        )
        await memory_service.save_message(
            session=db,
            conversation_id=conversation.id,
            role="assistant",
            content=ai_response["content"],
            tokens_used=ai_response["tokens_used"],
            model_used=ai_response["model"],
        )
        return ChatResponse(
            response=ai_response["content"],
            conversation_id=conversation.id,
            tokens_used=ai_response["tokens_used"],
            model=ai_response["model"],
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
