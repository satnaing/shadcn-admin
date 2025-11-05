"""
Pydantic schemas for authentication.
"""
from pydantic import BaseModel, EmailStr


class LoginRequest(BaseModel):
    """Schema for login request."""

    email: EmailStr
    password: str


class RegisterRequest(BaseModel):
    """Schema for registration request."""

    email: EmailStr
    password: str
    username: str | None = None
    full_name: str | None = None
