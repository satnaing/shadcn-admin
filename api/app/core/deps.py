"""
FastAPI dependencies for authentication and authorization.
"""
from typing import Annotated
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.security import verify_token
from app.db.session import get_db
from app.models.user import User
from app.services.user_service import UserService


# OAuth2 scheme for JWT token
security = HTTPBearer()


async def get_current_user(
    credentials: Annotated[HTTPAuthorizationCredentials, Depends(security)],
    db: Annotated[AsyncSession, Depends(get_db)]
) -> User:
    """
    Get current authenticated user from JWT token.

    Args:
        credentials: HTTP Authorization credentials containing the JWT token
        db: Database session

    Returns:
        Current authenticated user

    Raises:
        HTTPException: If token is invalid or user not found
    """
    token = credentials.credentials

    # Verify token and extract email
    email = verify_token(token, token_type="access")

    # Get user from database
    user = await UserService.get_by_email(db, email=email)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
            headers={"WWW-Authenticate": "Bearer"},
        )

    return user


async def get_current_active_user(
    current_user: Annotated[User, Depends(get_current_user)]
) -> User:
    """
    Get current active user.

    Args:
        current_user: Current authenticated user

    Returns:
        Current active user

    Raises:
        HTTPException: If user is inactive
    """
    if not await UserService.is_active(current_user):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Inactive user"
        )
    return current_user


async def get_current_superuser(
    current_user: Annotated[User, Depends(get_current_active_user)]
) -> User:
    """
    Get current superuser.

    Args:
        current_user: Current active user

    Returns:
        Current superuser

    Raises:
        HTTPException: If user is not a superuser
    """
    if not await UserService.is_superuser(current_user):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="The user doesn't have enough privileges"
        )
    return current_user
