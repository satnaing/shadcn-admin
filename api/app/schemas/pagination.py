"""
Pydantic schemas for pagination.
"""
from typing import Generic, TypeVar, List
from pydantic import BaseModel


T = TypeVar('T')


class PaginatedResponse(BaseModel, Generic[T]):
    """Generic paginated response schema."""

    items: List[T]
    total: int
    skip: int
    limit: int

    @property
    def has_more(self) -> bool:
        """Check if there are more items."""
        return (self.skip + self.limit) < self.total

    @property
    def total_pages(self) -> int:
        """Calculate total pages."""
        return (self.total + self.limit - 1) // self.limit

    @property
    def current_page(self) -> int:
        """Calculate current page (1-indexed)."""
        return (self.skip // self.limit) + 1
