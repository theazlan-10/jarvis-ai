from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from contextlib import asynccontextmanager
from loguru import logger

from app.config import settings
from app.database import create_tables
from app.routes import health, chat, network, memory
from app.models import conversation, message

@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("🚀 JARVIS starting up...")
    await create_tables()
    logger.info("✅ JARVIS is online!")
    yield
    logger.info("🔴 JARVIS shutting down...")

app = FastAPI(
    title="JARVIS AI OS",
    version="2.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Error: {exc}")
    return JSONResponse(status_code=500, content={"detail": str(exc)})

app.include_router(health.router, prefix="/api", tags=["Health"])
app.include_router(chat.router, prefix="/api", tags=["Chat"])
app.include_router(memory.router, prefix="/api", tags=["Memory"])
app.include_router(network.router, prefix="/api", tags=["Network"])

@app.get("/")
async def root():
    return {"system": "JARVIS AI OS", "version": "2.0.0", "status": "online"}
