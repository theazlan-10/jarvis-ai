from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    anthropic_api_key: str = ""
    groq_api_key: str = "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"
    ai_provider: str = "groq"
    ai_model: str = "llama3-70b-8192"
    host: str = "0.0.0.0"
    port: int = 8000
    debug: bool = True
    database_url: str = "sqlite+aiosqlite:///./data/jarvis.db"
    log_level: str = "DEBUG"
    max_memory_messages: int = 20

    class Config:
        env_file = ".env"
        extra = "ignore"

settings = Settings()
