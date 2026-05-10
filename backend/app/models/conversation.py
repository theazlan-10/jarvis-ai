from sqlalchemy import Column, String, DateTime, Text, Integer
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid
from app.database import Base

class Conversation(Base):
    __tablename__ = "conversations"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    title = Column(String(200), default="New Conversation")
    mode = Column(String(50), default="chat")
    created_at = Column(DateTime, default=datetime.utcnow)
    message_count = Column(Integer, default=0)
    messages = relationship("Message", back_populates="conversation", cascade="all, delete-orphan")

    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "mode": self.mode,
            "message_count": self.message_count,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }
