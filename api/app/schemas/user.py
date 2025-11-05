"""
Pydantic schemas for User model.
"""
from datetime import datetime
from typing import Optional
from pydantic import BaseModel, EmailStr, Field, ConfigDict


# Shared properties
class UserBase(BaseModel):
    """Base user schema with common attributes."""

    email: EmailStr
    username: Optional[str] = None
    full_name: Optional[str] = None
    is_active: bool = True
    is_superuser: bool = False


# Properties to receive via API on creation
class UserCreate(BaseModel):
    """Schema for creating a new user."""

    email: EmailStr
    username: Optional[str] = None
    full_name: Optional[str] = None
    password: str = Field(..., min_length=8)


# Properties to receive via API on update
class UserUpdate(BaseModel):
    """Schema for updating user information."""

    email: Optional[EmailStr] = None
    username: Optional[str] = None
    full_name: Optional[str] = None
    password: Optional[str] = Field(None, min_length=8)
    is_active: Optional[bool] = None


# Properties to return via API
class User(UserBase):
    """Schema for user response."""

    id: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


# Properties stored in DB
class UserInDB(User):
    """Schema for user in database (includes hashed password)."""

    hashed_password: str
