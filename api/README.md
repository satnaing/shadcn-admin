# Shadcn Admin - FastAPI Backend

A well-structured FastAPI backend with JWT authentication, async SQLAlchemy, and proper separation of concerns.

## Architecture

```
api/
├── app/
│   ├── api/
│   │   └── v1/
│   │       ├── endpoints/     # API route handlers
│   │       │   ├── auth.py    # Authentication endpoints
│   │       │   └── users.py   # User management endpoints
│   │       └── api.py         # API router configuration
│   ├── core/                  # Core application components
│   │   ├── config.py          # Application settings
│   │   ├── security.py        # JWT & password utilities
│   │   └── deps.py            # FastAPI dependencies
│   ├── db/                    # Database configuration
│   │   └── session.py         # Async SQLAlchemy session
│   ├── models/                # SQLAlchemy models
│   │   └── user.py            # User model
│   ├── schemas/               # Pydantic schemas
│   │   ├── user.py            # User schemas
│   │   ├── token.py           # Token schemas
│   │   └── auth.py            # Auth schemas
│   ├── services/              # Business logic layer
│   │   └── user_service.py    # User CRUD operations
│   ├── middleware/            # Custom middleware
│   ├── utils/                 # Utility functions
│   └── main.py                # FastAPI application
├── requirements.txt           # Python dependencies
├── .env.example              # Environment variables template
├── run.py                    # Development server runner
└── README.md                 # This file
```

## Features

- ✅ **FastAPI** - Modern, fast Python web framework
- ✅ **Async SQLAlchemy** - Asynchronous database operations
- ✅ **JWT Authentication** - Secure token-based auth with access & refresh tokens
- ✅ **Password Hashing** - Bcrypt password hashing
- ✅ **Pydantic Validation** - Request/response validation
- ✅ **CORS Middleware** - Cross-origin resource sharing
- ✅ **API Versioning** - Versioned API routes
- ✅ **Auto Documentation** - Swagger UI and ReDoc
- ✅ **Dependency Injection** - FastAPI's dependency system
- ✅ **Service Layer** - Separation of business logic
- ✅ **Type Hints** - Full Python typing support

## Setup

### 1. Install Dependencies

```bash
cd api
pip install -r requirements.txt
```

### 2. Configure Environment

```bash
cp .env.example .env
# Edit .env and set your SECRET_KEY (use: openssl rand -hex 32)
```

### 3. Run the Server

```bash
# Using the run script
python run.py

# Or using uvicorn directly
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at:
- API: http://localhost:8000
- Swagger Docs: http://localhost:8000/api/v1/docs
- ReDoc: http://localhost:8000/api/v1/redoc

## API Endpoints

### Authentication

#### Register
```http
POST /api/v1/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword",
  "username": "johndoe",
  "full_name": "John Doe"
}
```

#### Login
```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword"
}
```

Response:
```json
{
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "refresh_token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "token_type": "bearer"
}
```

#### Refresh Token
```http
POST /api/v1/auth/refresh
Content-Type: application/json

{
  "refresh_token": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

#### Get Current User
```http
GET /api/v1/auth/me
Authorization: Bearer {access_token}
```

### Users

#### Get Current User Profile
```http
GET /api/v1/users/me
Authorization: Bearer {access_token}
```

#### Update Current User
```http
PUT /api/v1/users/me
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "full_name": "John Updated Doe",
  "username": "johndoe_updated"
}
```

#### Get User by ID (Superuser Only)
```http
GET /api/v1/users/{user_id}
Authorization: Bearer {access_token}
```

## Database

The application uses async SQLAlchemy with support for multiple databases:

### SQLite (Default - Development)
```env
DATABASE_URL=sqlite+aiosqlite:///./app.db
```

### PostgreSQL (Production)
```env
DATABASE_URL=postgresql+asyncpg://user:password@localhost:5432/dbname
```

The database is automatically initialized on application startup.

## Security

### JWT Tokens

- **Access Token**: Short-lived (30 minutes by default) for API requests
- **Refresh Token**: Long-lived (7 days by default) for getting new access tokens

### Password Hashing

Passwords are hashed using bcrypt with automatic salt generation.

### CORS

Configure allowed origins in `.env`:
```env
BACKEND_CORS_ORIGINS=http://localhost:5173,http://localhost:3000
```

## Development

### Code Structure

- **Models**: SQLAlchemy ORM models in `app/models/`
- **Schemas**: Pydantic models in `app/schemas/`
- **Services**: Business logic in `app/services/`
- **Endpoints**: Route handlers in `app/api/v1/endpoints/`
- **Dependencies**: Shared dependencies in `app/core/deps.py`

### Adding New Endpoints

1. Create endpoint file in `app/api/v1/endpoints/`
2. Add router to `app/api/v1/api.py`
3. Create schemas in `app/schemas/`
4. Add service methods in `app/services/`

### Database Migrations

For production, use Alembic for migrations:

```bash
# Initialize Alembic
alembic init alembic

# Create migration
alembic revision --autogenerate -m "Description"

# Apply migration
alembic upgrade head
```

## Testing

Create tests in a `tests/` directory:

```python
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_register():
    response = client.post(
        "/api/v1/auth/register",
        json={
            "email": "test@example.com",
            "password": "testpass123"
        }
    )
    assert response.status_code == 201
```

## Production Deployment

### Using Docker

```dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Environment Variables

Make sure to set secure values in production:
- Generate a strong `SECRET_KEY`
- Use PostgreSQL instead of SQLite
- Set appropriate CORS origins
- Use environment-specific settings

## License

MIT
