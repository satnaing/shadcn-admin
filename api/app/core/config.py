"""
Core configuration settings for the FastAPI application.
"""
from typing import Any, List, Optional
from pydantic import AnyHttpUrl, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """
    Application settings loaded from environment variables.
    """

    # API Configuration
    API_V1_STR: str = "/api/v1"
    PROJECT_NAME: str = "Shadcn Admin API"
    VERSION: str = "1.0.0"
    DESCRIPTION: str = "FastAPI backend for Shadcn Admin Dashboard"

    # CORS Configuration
    BACKEND_CORS_ORIGINS: List[AnyHttpUrl] = []

    @field_validator("BACKEND_CORS_ORIGINS", mode="before")
    @classmethod
    def assemble_cors_origins(cls, v: str | List[str]) -> List[str] | str:
        if isinstance(v, str) and not v.startswith("["):
            return [i.strip() for i in v.split(",")]
        elif isinstance(v, (list, str)):
            return v
        raise ValueError(v)

    # JWT Configuration
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7

    # Database Configuration
    DATABASE_URL: str = "sqlite+aiosqlite:///./app.db"

    # For PostgreSQL (uncomment and configure when ready):
    # DATABASE_URL: str = "postgresql+asyncpg://user:password@localhost/dbname"

    # Security
    PASSWORD_MIN_LENGTH: int = 8

    # Superuser (for initial setup)
    FIRST_SUPERUSER_EMAIL: str = "admin@example.com"
    FIRST_SUPERUSER_PASSWORD: str = "admin123"

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="allow"
    )


settings = Settings()
