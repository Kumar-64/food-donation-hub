"""
Auth router - Supabase Auth integration.
"""
from fastapi import APIRouter, Depends, HTTPException, status
from supabase import Client
from app.database import get_supabase
from app.schemas import LoginRequest, RegisterRequest, AuthResponse, UserResponse

router = APIRouter(prefix="/api/auth", tags=["auth"])


@router.post("/login", response_model=AuthResponse)
async def login(
    request: LoginRequest,
    supabase: Client = Depends(get_supabase),
):
    """Login with email and password via Supabase Auth."""
    try:
        response = supabase.auth.sign_in_with_password(
            {"email": request.email, "password": request.password}
        )
        if not response.user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password",
            )

        # Get or create user profile
        profile = get_or_create_profile(supabase, response.user)

        return AuthResponse(
            access_token=response.session.access_token,
            token_type="bearer",
            user=profile,
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )


@router.post("/register", response_model=AuthResponse)
async def register(
    request: RegisterRequest,
    supabase: Client = Depends(get_supabase),
):
    """Register a new user via Supabase Auth."""
    try:
        # Sign up with Supabase Auth
        response = supabase.auth.sign_up(
            {
                "email": request.email,
                "password": request.password,
                "options": {
                    "data": {
                        "name": request.name,
                        "phone": request.phone,
                        "role": request.role,
                        "organization": request.organization,
                        "address": request.address,
                        "city": request.city,
                    }
                },
            }
        )

        if not response.user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Registration failed",
            )

        # Create user profile in public.users table
        profile_data = {
            "id": response.user.id,
            "name": request.name,
            "email": request.email,
            "phone": request.phone,
            "role": request.role,
            "organization": request.organization,
            "address": request.address,
            "city": request.city,
            "latitude": request.latitude,
            "longitude": request.longitude,
            "verified": False,
            "suspended": False,
        }

        supabase.table("users").upsert(profile_data).execute()

        return AuthResponse(
            access_token=response.session.access_token if response.session else "",
            token_type="bearer",
            user=UserResponse(
                id=response.user.id,
                name=request.name,
                email=request.email,
                phone=request.phone,
                role=request.role,
                organization=request.organization,
                address=request.address,
                city=request.city,
                latitude=request.latitude,
                longitude=request.longitude,
                verified=False,
                suspended=False,
            ),
        )
    except HTTPException:
        raise
    except Exception as e:
        error_msg = str(e)
        if "already registered" in error_msg.lower() or "already exists" in error_msg.lower():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered",
            )
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Registration failed: {error_msg}",
        )


@router.get("/profile", response_model=UserResponse)
async def get_profile(
    current_user: dict = Depends(lambda: None),  # Will be overridden by dependency
    supabase: Client = Depends(get_supabase),
):
    """Get current user profile."""
    # This will be handled by the dependency injection
    pass


@router.get("/me", response_model=UserResponse)
async def get_me(
    current_user: dict = Depends(lambda: None),
    supabase: Client = Depends(get_supabase),
):
    """Get current user profile."""
    pass


def get_or_create_profile(supabase: Client, auth_user) -> UserResponse:
    """Get or create user profile from auth user."""
    # Try to get existing profile
    result = (
        supabase.table("users")
        .select("*")
        .eq("id", auth_user.id)
        .execute()
    )

    if result.data:
        data = result.data[0]
        return UserResponse(**data)

    # Create new profile
    metadata = auth_user.user_metadata or {}
    profile_data = {
        "id": auth_user.id,
        "name": metadata.get("name", ""),
        "email": auth_user.email,
        "phone": metadata.get("phone"),
        "role": metadata.get("role", "donor"),
        "organization": metadata.get("organization"),
        "address": metadata.get("address"),
        "city": metadata.get("city"),
        "latitude": metadata.get("latitude"),
        "longitude": metadata.get("longitude"),
        "verified": False,
        "suspended": False,
    }

    supabase.table("users").upsert(profile_data).execute()
    return UserResponse(**profile_data)
