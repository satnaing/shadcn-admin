"""
User service for database operations.
"""
from typing import Optional, List, Tuple
from sqlalchemy import select, func, or_
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.user import User, UserRole, UserStatus
from app.schemas.user import UserCreate, UserUpdate
from app.core.security import get_password_hash, verify_password


class UserService:
    """Service for user-related database operations."""

    @staticmethod
    async def get_by_email(db: AsyncSession, email: str) -> Optional[User]:
        """
        Get user by email.

        Args:
            db: Database session
            email: User email

        Returns:
            User object or None if not found
        """
        result = await db.execute(select(User).where(User.email == email))
        return result.scalar_one_or_none()

    @staticmethod
    async def get_by_id(db: AsyncSession, user_id: int) -> Optional[User]:
        """
        Get user by ID.

        Args:
            db: Database session
            user_id: User ID

        Returns:
            User object or None if not found
        """
        result = await db.execute(select(User).where(User.id == user_id))
        return result.scalar_one_or_none()

    @staticmethod
    async def get_by_username(db: AsyncSession, username: str) -> Optional[User]:
        """
        Get user by username.

        Args:
            db: Database session
            username: Username

        Returns:
            User object or None if not found
        """
        result = await db.execute(select(User).where(User.username == username))
        return result.scalar_one_or_none()

    @staticmethod
    async def create(db: AsyncSession, user_in: UserCreate) -> User:
        """
        Create a new user.

        Args:
            db: Database session
            user_in: User creation schema

        Returns:
            Created user object
        """
        from app.models.user import UserStatus

        db_user = User(
            email=user_in.email,
            username=user_in.username,
            first_name=user_in.first_name,
            last_name=user_in.last_name,
            phone_number=user_in.phone_number,
            hashed_password=get_password_hash(user_in.password),
            role=user_in.role,
            status=UserStatus.ACTIVE,
            is_superuser=False,
        )
        db.add(db_user)
        await db.commit()
        await db.refresh(db_user)
        return db_user

    @staticmethod
    async def update(db: AsyncSession, user: User, user_in: UserUpdate) -> User:
        """
        Update user information.

        Args:
            db: Database session
            user: User object to update
            user_in: User update schema

        Returns:
            Updated user object
        """
        update_data = user_in.model_dump(exclude_unset=True)

        # Hash password if provided
        if "password" in update_data:
            update_data["hashed_password"] = get_password_hash(update_data.pop("password"))

        for field, value in update_data.items():
            setattr(user, field, value)

        db.add(user)
        await db.commit()
        await db.refresh(user)
        return user

    @staticmethod
    async def authenticate(db: AsyncSession, email: str, password: str) -> Optional[User]:
        """
        Authenticate user with email and password.

        Args:
            db: Database session
            email: User email
            password: Plain text password

        Returns:
            User object if authentication successful, None otherwise
        """
        user = await UserService.get_by_email(db, email)
        if not user:
            return None
        if not verify_password(password, user.hashed_password):
            return None
        return user

    @staticmethod
    async def is_active(user: User) -> bool:
        """
        Check if user is active.

        Args:
            user: User object

        Returns:
            True if user is active, False otherwise
        """
        from app.models.user import UserStatus
        return user.status == UserStatus.ACTIVE

    @staticmethod
    async def is_superuser(user: User) -> bool:
        """
        Check if user is superuser.

        Args:
            user: User object

        Returns:
            True if user is superuser, False otherwise
        """
        return user.is_superuser

    @staticmethod
    async def get_all(
        db: AsyncSession,
        skip: int = 0,
        limit: int = 100,
        search: Optional[str] = None,
        role: Optional[UserRole] = None,
        status: Optional[UserStatus] = None,
    ) -> Tuple[List[User], int]:
        """
        Get all users with pagination and filtering.

        Args:
            db: Database session
            skip: Number of records to skip
            limit: Maximum number of records to return
            search: Search term for email, username, first_name, last_name
            role: Filter by role
            status: Filter by status

        Returns:
            Tuple of (list of users, total count)
        """
        query = select(User)

        # Apply search filter
        if search:
            search_filter = or_(
                User.email.ilike(f"%{search}%"),
                User.username.ilike(f"%{search}%"),
                User.first_name.ilike(f"%{search}%"),
                User.last_name.ilike(f"%{search}%"),
            )
            query = query.where(search_filter)

        # Apply role filter
        if role:
            query = query.where(User.role == role)

        # Apply status filter
        if status:
            query = query.where(User.status == status)

        # Get total count
        count_query = select(func.count()).select_from(query.subquery())
        total_result = await db.execute(count_query)
        total = total_result.scalar_one()

        # Apply pagination and ordering
        query = query.order_by(User.created_at.desc()).offset(skip).limit(limit)

        result = await db.execute(query)
        users = result.scalars().all()

        return list(users), total

    @staticmethod
    async def delete(db: AsyncSession, user_id: int) -> bool:
        """
        Delete a user by ID.

        Args:
            db: Database session
            user_id: User ID to delete

        Returns:
            True if deleted, False if not found
        """
        user = await UserService.get_by_id(db, user_id)
        if not user:
            return False

        await db.delete(user)
        await db.commit()
        return True

    @staticmethod
    async def create_admin(
        db: AsyncSession,
        user_in: UserCreate,
        is_superuser: bool = False
    ) -> User:
        """
        Create a new user (admin/superuser action).

        Args:
            db: Database session
            user_in: User creation schema
            is_superuser: Whether to create as superuser

        Returns:
            Created user object
        """
        db_user = User(
            email=user_in.email,
            username=user_in.username,
            first_name=user_in.first_name,
            last_name=user_in.last_name,
            phone_number=user_in.phone_number,
            hashed_password=get_password_hash(user_in.password),
            role=user_in.role,
            status=UserStatus.ACTIVE,
            is_superuser=is_superuser,
        )
        db.add(db_user)
        await db.commit()
        await db.refresh(db_user)
        return db_user
