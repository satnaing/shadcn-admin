"""
Pydantic schemas for User model.
"""
from datetime import datetime
from typing import Optional
from pydantic import BaseModel, EmailStr, Field, ConfigDict
from enum import Enum


class UserRole(str, Enum):
    """User role enumeration."""
    SUPERADMIN = "superadmin"
    ADMIN = "admin"
    MANAGER = "manager"
    CASHIER = "cashier"


class UserStatus(str, Enum):
    """User status enumeration."""
    ACTIVE = "active"
    INACTIVE = "inactive"
    INVITED = "invited"
    SUSPENDED = "suspended"


# Shared properties
class UserBase(BaseModel):
    """Base user schema with common attributes."""

    email: EmailStr
    username: Optional[str] = None
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    phone_number: Optional[str] = None
    role: UserRole = UserRole.CASHIER
    status: UserStatus = UserStatus.ACTIVE
    is_superuser: bool = False


# Properties to receive via API on creation
class UserCreate(BaseModel):
    """Schema for creating a new user."""

    email: EmailStr
    username: Optional[str] = None
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    phone_number: Optional[str] = None
    password: str = Field(..., min_length=8)
    role: Optional[UserRole] = UserRole.CASHIER


# Properties to receive via API on update
class UserUpdate(BaseModel):
    """Schema for updating user information."""

    email: Optional[EmailStr] = None
    username: Optional[str] = None
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    phone_number: Optional[str] = None
    password: Optional[str] = Field(None, min_length=8)
    role: Optional[UserRole] = None
    status: Optional[UserStatus] = None


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
