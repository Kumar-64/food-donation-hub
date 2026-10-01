"""
Notifications router - Supabase integration.
"""
from fastapi import APIRouter, Depends, HTTPException, status, Query
from supabase import Client
from app.database import get_supabase
from app.auth import get_current_active_user

router = APIRouter(prefix="/api/notifications", tags=["notifications"])


@router.get("")
async def get_notifications(
    unread_only: bool = False,
    limit: int = Query(50, ge=1, le=100),
    offset: int = Query(0, ge=0),
    current_user: dict = Depends(get_current_active_user),
    supabase: Client = Depends(get_supabase),
):
    """Get user notifications."""
    query = (
        supabase.table("notifications")
        .select("*")
        .eq("user_id", current_user["id"])
        .order("created_at", desc=True)
    )

    if unread_only:
        query = query.eq("read", False)

    query = query.range(offset, offset + limit - 1)
    result = query.execute()
    return result.data


@router.put("/{notification_id}/read")
async def mark_notification_read(
    notification_id: str,
    current_user: dict = Depends(get_current_active_user),
    supabase: Client = Depends(get_supabase),
):
    """Mark a notification as read."""
    supabase.table("notifications").update({"read": True}).eq("id", notification_id).execute()
    return {"success": True}


@router.put("/read-all")
async def mark_all_notifications_read(
    current_user: dict = Depends(get_current_active_user),
    supabase: Client = Depends(get_supabase),
):
    """Mark all notifications as read."""
    supabase.table("notifications").update({"read": True}).eq("user_id", current_user["id"]).eq("read", False).execute()
    return {"success": True}


@router.get("/unread-count")
async def get_unread_count(
    current_user: dict = Depends(get_current_active_user),
    supabase: Client = Depends(get_supabase),
):
    """Get unread notification count."""
    result = (
        supabase.table("notifications")
        .select("id", count="exact")
        .eq("user_id", current_user["id"])
        .eq("read", False)
        .execute()
    )
    return {"count": result.count or 0}
