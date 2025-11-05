"""
User management endpoints.
"""
from typing import Annotated, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.deps import get_current_active_user, get_current_superuser
from app.db.session import get_db
from app.models.user import User as UserModel, UserRole, UserStatus
from app.schemas.user import User, UserUpdate, UserCreate
from app.schemas.pagination import PaginatedResponse
from app.services.user_service import UserService


router = APIRouter()


@router.get("", response_model=PaginatedResponse[User])
async def list_users(
    db: Annotated[AsyncSession, Depends(get_db)],
    current_user: Annotated[UserModel, Depends(get_current_active_user)],
    skip: int = Query(0, ge=0, description="Number of records to skip"),
    limit: int = Query(100, ge=1, le=500, description="Maximum number of records to return"),
    search: Optional[str] = Query(None, description="Search term for email, username, or name"),
    role: Optional[UserRole] = Query(None, description="Filter by role"),
    status: Optional[UserStatus] = Query(None, description="Filter by status"),
) -> PaginatedResponse[User]:
    """
    Get list of users with pagination and filtering.

    Args:
        db: Database session
        current_user: Current authenticated user
        skip: Number of records to skip
        limit: Maximum number of records to return
        search: Search term
        role: Filter by role
        status: Filter by status

    Returns:
        Paginated list of users
    """
    users, total = await UserService.get_all(
        db=db,
        skip=skip,
        limit=limit,
        search=search,
        role=role,
        status=status,
    )

    return PaginatedResponse(
        items=users,
        total=total,
        skip=skip,
        limit=limit,
    )


@router.post("", response_model=User, status_code=status.HTTP_201_CREATED)
async def create_user(
    user_in: UserCreate,
    db: Annotated[AsyncSession, Depends(get_db)],
    current_user: Annotated[UserModel, Depends(get_current_superuser)],
) -> User:
    """
    Create a new user (superuser only).

    Args:
        user_in: User creation data
        db: Database session
        current_user: Current authenticated superuser

    Returns:
        Created user object

    Raises:
        HTTPException: If email or username already exists
    """
    # Check if user with email already exists
    existing_user = await UserService.get_by_email(db, email=user_in.email)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )

    # Check if username is provided and already exists
    if user_in.username:
        existing_username = await UserService.get_by_username(db, username=user_in.username)
        if existing_username:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Username already taken"
            )

    # Create new user
    user = await UserService.create_admin(db, user_in=user_in)
    return user


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
    current_user: Annotated[UserModel, Depends(get_current_active_user)],
    db: Annotated[AsyncSession, Depends(get_db)]
) -> User:
    """
    Get user by ID.

    Args:
        user_id: User ID
        current_user: Current authenticated user
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


@router.put("/{user_id}", response_model=User)
async def update_user(
    user_id: int,
    user_in: UserUpdate,
    db: Annotated[AsyncSession, Depends(get_db)],
    current_user: Annotated[UserModel, Depends(get_current_superuser)],
) -> User:
    """
    Update user by ID (superuser only).

    Args:
        user_id: User ID
        user_in: User update data
        db: Database session
        current_user: Current authenticated superuser

    Returns:
        Updated user object

    Raises:
        HTTPException: If user not found or validation fails
    """
    user = await UserService.get_by_id(db, user_id=user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )

    # Check if email is being updated and already exists
    if user_in.email and user_in.email != user.email:
        existing_user = await UserService.get_by_email(db, email=user_in.email)
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )

    # Check if username is being updated and already exists
    if user_in.username and user_in.username != user.username:
        existing_username = await UserService.get_by_username(db, username=user_in.username)
        if existing_username:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Username already taken"
            )

    updated_user = await UserService.update(db, user=user, user_in=user_in)
    return updated_user


@router.delete("/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_user(
    user_id: int,
    db: Annotated[AsyncSession, Depends(get_db)],
    current_user: Annotated[UserModel, Depends(get_current_superuser)],
) -> None:
    """
    Delete user by ID (superuser only).

    Args:
        user_id: User ID
        db: Database session
        current_user: Current authenticated superuser

    Raises:
        HTTPException: If user not found or trying to delete self
    """
    if user_id == current_user.id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot delete yourself"
        )

    deleted = await UserService.delete(db, user_id=user_id)
    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
