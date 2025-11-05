"""
Security utilities for password hashing and JWT token generation/verification.
"""
from datetime import datetime, timedelta
from typing import Any, Optional
from jose import jwt, JWTError
from passlib.context import CryptContext
from fastapi import HTTPException, status

from app.core.config import settings


# Password hashing context
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def create_access_token(subject: str | Any, expires_delta: Optional[timedelta] = None) -> str:
    """
    Create a JWT access token.

    Args:
        subject: The subject of the token (usually user ID or email)
        expires_delta: Optional custom expiration time

    Returns:
        Encoded JWT token
    """
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(
            minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
        )

    to_encode = {"exp": expire, "sub": str(subject), "type": "access"}
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt


def create_refresh_token(subject: str | Any) -> str:
    """
    Create a JWT refresh token.

    Args:
        subject: The subject of the token (usually user ID or email)

    Returns:
        Encoded JWT refresh token
    """
    expire = datetime.utcnow() + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)
    to_encode = {"exp": expire, "sub": str(subject), "type": "refresh"}
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt


def verify_token(token: str, token_type: str = "access") -> str:
    """
    Verify and decode a JWT token.

    Args:
        token: The JWT token to verify
        token_type: Expected token type ("access" or "refresh")

    Returns:
        The subject (user ID/email) from the token

    Raises:
        HTTPException: If token is invalid or expired
    """
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        subject: str = payload.get("sub")
        token_type_claim: str = payload.get("type")

        if subject is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Could not validate credentials",
                headers={"WWW-Authenticate": "Bearer"},
            )

        if token_type_claim != token_type:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail=f"Invalid token type. Expected {token_type}",
                headers={"WWW-Authenticate": "Bearer"},
            )

        return subject

    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Verify a password against a hashed password.

    Args:
        plain_password: The plain text password
        hashed_password: The hashed password to compare against

    Returns:
        True if passwords match, False otherwise
    """
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
    """
    Hash a password.

    Args:
        password: The plain text password to hash

    Returns:
        The hashed password
    """
    return pwd_context.hash(password)
