"""
API v1 router configuration.
"""
from fastapi import APIRouter

from app.api.v1.endpoints import auth, users


api_router = APIRouter()

# Include authentication routes
api_router.include_router(
    auth.router,
    prefix="/auth",
    tags=["authentication"]
)

# Include user routes
api_router.include_router(
    users.router,
    prefix="/users",
    tags=["users"]
)
