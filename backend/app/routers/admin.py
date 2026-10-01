"""
Admin router - Supabase integration.
"""
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from supabase import Client
from app.database import get_supabase
from app.auth import require_admin

router = APIRouter(prefix="/api/admin", tags=["admin"])


@router.get("/stats")
async def get_admin_stats(
    current_user: dict = Depends(require_admin),
    supabase: Client = Depends(get_supabase),
):
    """Get admin dashboard statistics."""
    # Get counts
    users_count = supabase.table("users").select("id", count="exact").execute()
    donations_count = supabase.table("donations").select("id", count="exact").execute()
    deliveries_count = supabase.table("deliveries").select("id", count="exact").execute()
    emergency_count = supabase.table("emergency_requests").select("id", count="exact").in_("status", ["open", "pending", "matched"]).execute()

    # Get active users (active in last 30 days)
    active_users = supabase.table("users").select("id", count="exact").eq("suspended", False).execute()

    # Get volunteers
    volunteers = supabase.table("users").select("id", count="exact").eq("role", "volunteer").execute()

    # Get total meals served
    meals_result = supabase.table("donations").select("servings").eq("status", "delivered").execute()
    total_meals = sum(d["servings"] for d in meals_result.data)

    # Get food rescued (sum of quantities for delivered donations)
    food_result = supabase.table("donations").select("quantity").eq("status", "delivered").execute()
    total_food = sum(d["quantity"] for d in food_result.data)

    return {
        "total_donations": donations_count.count or 0,
        "meals_served": total_meals,
        "active_users": active_users.count or 0,
        "active_volunteers": volunteers.count or 0,
        "food_rescued": total_food,
        "emergency_requests": emergency_count.count or 0,
        "total_deliveries": deliveries_count.count or 0,
        "total_users": users_count.count or 0,
    }


@router.get("/users")
async def list_users(
    role: Optional[str] = None,
    verified: Optional[bool] = None,
    suspended: Optional[bool] = None,
    search: Optional[str] = None,
    limit: int = Query(50, ge=1, le=100),
    offset: int = Query(0, ge=0),
    current_user: dict = Depends(require_admin),
    supabase: Client = Depends(get_supabase),
):
    """List all users with filters."""
    query = supabase.table("users").select("*").order("created_at", desc=True)

    if role:
        query = query.eq("role", role)
    if verified is not None:
        query = query.eq("verified", verified)
    if suspended is not None:
        query = query.eq("suspended", suspended)
    if search:
        query = query.or_(f"name.ilike.%{search}%,email.ilike.%{search}%")

    query = query.range(offset, offset + limit - 1)
    result = query.execute()
    return {"data": result.data, "total": len(result.data)}


@router.put("/users/{user_id}/verify")
async def verify_user(
    user_id: str,
    current_user: dict = Depends(require_admin),
    supabase: Client = Depends(get_supabase),
):
    """Verify a user."""
    supabase.table("users").update({"verified": True}).eq("id", user_id).execute()

    # Create notification
    supabase.table("notifications").insert({
        "user_id": user_id,
        "title": "Account Verified",
        "message": "Your account has been verified by the FoodBridge team.",
        "type": "verification",
        "read": False,
    }).execute()

    return {"success": True}


@router.put("/users/{user_id}/suspend")
async def suspend_user(
    user_id: str,
    current_user: dict = Depends(require_admin),
    supabase: Client = Depends(get_supabase),
):
    """Suspend a user."""
    supabase.table("users").update({"suspended": True}).eq("id", user_id).execute()
    return {"success": True}


@router.put("/users/{user_id}/activate")
async def activate_user(
    user_id: str,
    current_user: dict = Depends(require_admin),
    supabase: Client = Depends(get_supabase),
):
    """Activate a suspended user."""
    supabase.table("users").update({"suspended": False}).eq("id", user_id).execute()
    return {"success": True}


@router.get("/donations")
async def admin_list_donations(
    status: Optional[str] = None,
    limit: int = Query(50, ge=1, le=100),
    offset: int = Query(0, ge=0),
    current_user: dict = Depends(require_admin),
    supabase: Client = Depends(get_supabase),
):
    """Admin: list all donations."""
    query = supabase.table("donations").select("*, donor:donor_id(*)").order("created_at", desc=True)

    if status:
        query = query.eq("status", status)

    query = query.range(offset, offset + limit - 1)
    result = query.execute()
    return {"data": result.data, "total": len(result.data)}


@router.get("/emergency-requests")
async def admin_list_emergency_requests(
    current_user: dict = Depends(require_admin),
    supabase: Client = Depends(get_supabase),
):
    """Admin: list all emergency requests."""
    result = (
        supabase.table("emergency_requests")
        .select("*, ngo:ngo_id(*)")
        .order("created_at", desc=True)
        .execute()
    )
    return {"data": result.data, "total": len(result.data)}
