"""
Authentication endpoints for login, register, and token refresh.
"""
from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.security import create_access_token, create_refresh_token, verify_token
from app.db.session import get_db
from app.schemas.auth import LoginRequest, RegisterRequest
from app.schemas.token import Token, RefreshTokenRequest
from app.schemas.user import User
from app.services.user_service import UserService
from app.core.deps import get_current_active_user


router = APIRouter()


@router.post("/register", response_model=User, status_code=status.HTTP_201_CREATED)
async def register(
    user_in: RegisterRequest,
    db: Annotated[AsyncSession, Depends(get_db)]
) -> User:
    """
    Register a new user.

    Args:
        user_in: User registration data
        db: Database session

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
    from app.schemas.user import UserCreate
    user_create = UserCreate(
        email=user_in.email,
        password=user_in.password,
        username=user_in.username,
        full_name=user_in.full_name,
    )
    user = await UserService.create(db, user_in=user_create)

    return user


@router.post("/login", response_model=Token)
async def login(
    login_data: LoginRequest,
    db: Annotated[AsyncSession, Depends(get_db)]
) -> Token:
    """
    Login and get access token.

    Args:
        login_data: Login credentials
        db: Database session

    Returns:
        Access and refresh tokens

    Raises:
        HTTPException: If credentials are invalid
    """
    # Authenticate user
    user = await UserService.authenticate(
        db,
        email=login_data.email,
        password=login_data.password
    )

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    if not await UserService.is_active(user):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Inactive user"
        )

    # Create tokens
    access_token = create_access_token(subject=user.email)
    refresh_token = create_refresh_token(subject=user.email)

    return Token(
        access_token=access_token,
        refresh_token=refresh_token,
        token_type="bearer"
    )


@router.post("/refresh", response_model=Token)
async def refresh_token(
    token_data: RefreshTokenRequest,
    db: Annotated[AsyncSession, Depends(get_db)]
) -> Token:
    """
    Refresh access token using refresh token.

    Args:
        token_data: Refresh token
        db: Database session

    Returns:
        New access and refresh tokens

    Raises:
        HTTPException: If refresh token is invalid
    """
    # Verify refresh token
    email = verify_token(token_data.refresh_token, token_type="refresh")

    # Get user from database
    user = await UserService.get_by_email(db, email=email)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
            headers={"WWW-Authenticate": "Bearer"},
        )

    if not await UserService.is_active(user):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Inactive user"
        )

    # Create new tokens
    access_token = create_access_token(subject=user.email)
    refresh_token = create_refresh_token(subject=user.email)

    return Token(
        access_token=access_token,
        refresh_token=refresh_token,
        token_type="bearer"
    )


@router.get("/me", response_model=User)
async def get_current_user_info(
    current_user: Annotated[User, Depends(get_current_active_user)]
) -> User:
    """
    Get current user information.

    Args:
        current_user: Current authenticated user

    Returns:
        Current user object
    """
    return current_user
