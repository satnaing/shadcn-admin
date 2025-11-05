"""
User management endpoints.
"""
from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.deps import get_current_active_user, get_current_superuser
from app.db.session import get_db
from app.models.user import User as UserModel
from app.schemas.user import User, UserUpdate
from app.services.user_service import UserService


router = APIRouter()


@router.get("/me", response_model=User)
async def read_user_me(
    current_user: Annotated[UserModel, Depends(get_current_active_user)]
) -> User:
    """
    Get current user.

    Args:
        current_user: Current authenticated user

    Returns:
        Current user object
    """
    return current_user


@router.put("/me", response_model=User)
async def update_user_me(
    user_in: UserUpdate,
    current_user: Annotated[UserModel, Depends(get_current_active_user)],
    db: Annotated[AsyncSession, Depends(get_db)]
) -> User:
    """
    Update current user.

    Args:
        user_in: User update data
        current_user: Current authenticated user
        db: Database session

    Returns:
        Updated user object
    """
    # Check if email is being updated and already exists
    if user_in.email and user_in.email != current_user.email:
        existing_user = await UserService.get_by_email(db, email=user_in.email)
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )

    # Check if username is being updated and already exists
    if user_in.username and user_in.username != current_user.username:
        existing_username = await UserService.get_by_username(db, username=user_in.username)
        if existing_username:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Username already taken"
            )

    user = await UserService.update(db, user=current_user, user_in=user_in)
    return user


@router.get("/{user_id}", response_model=User)
async def read_user_by_id(
    user_id: int,
    current_user: Annotated[UserModel, Depends(get_current_superuser)],
    db: Annotated[AsyncSession, Depends(get_db)]
) -> User:
    """
    Get user by ID (superuser only).

    Args:
        user_id: User ID
        current_user: Current authenticated superuser
        db: Database session

    Returns:
        User object

    Raises:
        HTTPException: If user not found
    """
    user = await UserService.get_by_id(db, user_id=user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    return user
