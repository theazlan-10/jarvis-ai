from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from app.database import create_tables
from app.routes import health, chat
from app.models import conversation, message

@asynccontextmanager
async def lifespan(app: FastAPI):
    print("🚀 JARVIS starting up...")
    await create_tables()
    print("✅ JARVIS is online!")
    yield
    print("🔴 JARVIS shutting down...")

app = FastAPI(
    title="JARVIS AI OS",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router, prefix="/api", tags=["Health"])
app.include_router(chat.router, prefix="/api", tags=["Chat"])

@app.get("/")
async def root():
    return {
        "system": "JARVIS AI OS",
        "status": "online",
        "docs": "/docs",
    }
    
