"""
Supabase client for FoodBridge.
Handles database operations via Supabase PostgREST and Auth.
"""
from supabase import create_client, Client
from app.config import settings

supabase: Client = create_client(
    settings.SUPABASE_URL,
    settings.SUPABASE_SERVICE_ROLE_KEY,
)


def get_supabase() -> Client:
    """Dependency to get Supabase client."""
    return supabase
