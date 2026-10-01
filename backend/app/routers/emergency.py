"""
Emergency Requests router - Supabase integration.
"""
from datetime import datetime
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from supabase import Client
from app.database import get_supabase
from app.auth import get_current_active_user
from app.schemas import EmergencyRequestCreate, EmergencyRequestResponse

router = APIRouter(prefix="/api/emergency", tags=["emergency"])


@router.get("", response_model=dict)
async def list_emergency_requests(
    status: Optional[str] = None,
    limit: int = Query(50, ge=1, le=100),
    offset: int = Query(0, ge=0),
    current_user: dict = Depends(get_current_active_user),
    supabase: Client = Depends(get_supabase),
):
    """List emergency requests."""
    query = supabase.table("emergency_requests").select("*, ngo:ngo_id(*)").order("created_at", desc=True)

    if status:
        query = query.eq("status", status)

    query = query.range(offset, offset + limit - 1)
    result = query.execute()
    return {"data": result.data, "total": len(result.data)}


@router.get("/active", response_model=dict)
async def active_emergency_requests(
    current_user: dict = Depends(get_current_active_user),
    supabase: Client = Depends(get_supabase),
):
    """Get active emergency requests."""
    result = (
        supabase.table("emergency_requests")
        .select("*, ngo:ngo_id(*)")
        .in_("status", ["open", "pending", "matched"])
        .order("created_at", desc=True)
        .execute()
    )
    return {"data": result.data, "total": len(result.data)}


@router.post("", response_model=EmergencyRequestResponse, status_code=status.HTTP_201_CREATED)
async def create_emergency_request(
    request: EmergencyRequestCreate,
    current_user: dict = Depends(get_current_active_user),
    supabase: Client = Depends(get_supabase),
):
    """Create an emergency food request."""
    data = request.model_dump()
    data["ngo_id"] = current_user["id"]
    data["status"] = "open"

    result = supabase.table("emergency_requests").insert(data).execute()

    # Notify all donors and volunteers
    notify_emergency(supabase, result.data[0])

    return result.data[0]


@router.get("/{request_id}", response_model=EmergencyRequestResponse)
async def get_emergency_request(
    request_id: str,
    current_user: dict = Depends(get_current_active_user),
    supabase: Client = Depends(get_supabase),
):
    """Get emergency request by ID."""
    result = (
        supabase.table("emergency_requests")
        .select("*, ngo:ngo_id(*)")
        .eq("id", request_id)
        .execute()
    )
    if not result.data:
        raise HTTPException(status_code=404, detail="Emergency request not found")
    return result.data[0]


@router.put("/{request_id}/status")
async def update_emergency_status(
    request_id: str,
    status: str,
    current_user: dict = Depends(get_current_active_user),
    supabase: Client = Depends(get_supabase),
):
    """Update emergency request status."""
    supabase.table("emergency_requests").update({"status": status}).eq("id", request_id).execute()
    return {"success": True}


def notify_emergency(supabase: Client, emergency_data: dict):
    """Notify all donors and volunteers about emergency."""
    # Get all donors and volunteers
    users = supabase.table("users").select("id").in_("role", ["donor", "volunteer"]).execute()
    for user in users.data:
        supabase.table("notifications").insert({
            "user_id": user["id"],
            "title": "Emergency Food Request",
            "message": f"Emergency: {emergency_data['quantity_needed']} meals needed at {emergency_data['delivery_address']}. Required by {emergency_data['needed_by_date']}.",
            "type": "emergency",
            "read": False,
        }).execute()
