"""
Food Requests router - Supabase integration.
"""
import math
from datetime import datetime
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from supabase import Client
from app.database import get_supabase
from app.auth import get_current_active_user
from app.schemas import FoodRequestCreate, FoodRequestResponse

router = APIRouter(prefix="/api/requests", tags=["requests"])


def haversine(lat1, lon1, lat2, lon2):
    R = 6371
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = math.sin(dlat / 2) ** 2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon / 2) ** 2
    return R * 2 * math.asin(math.sqrt(a))


@router.get("", response_model=dict)
async def list_requests(
    status: Optional[str] = None,
    ngo_id: Optional[str] = None,
    is_emergency: Optional[bool] = None,
    limit: int = Query(50, ge=1, le=100),
    offset: int = Query(0, ge=0),
    current_user: dict = Depends(get_current_active_user),
    supabase: Client = Depends(get_supabase),
):
    """List food requests."""
    query = supabase.table("requests").select("*, ngo:ngo_id(*)").order("created_at", desc=True)

    if status:
        query = query.eq("status", status)
    if ngo_id:
        query = query.eq("ngo_id", ngo_id)
    if is_emergency is not None:
        query = query.eq("is_emergency", is_emergency)

    query = query.range(offset, offset + limit - 1)
    result = query.execute()
    return {"data": result.data, "total": len(result.data)}


@router.get("/nearby", response_model=dict)
async def nearby_requests(
    lat: float = Query(...),
    lng: float = Query(...),
    radius: float = Query(10.0),
    current_user: dict = Depends(get_current_active_user),
    supabase: Client = Depends(get_supabase),
):
    """Get nearby food requests."""
    result = (
        supabase.table("requests")
        .select("*, ngo:ngo_id(*)")
        .eq("status", "pending")
        .execute()
    )

    # Filter by distance if coordinates available
    nearby = []
    for r in result.data:
        # For requests, we use the requesting NGO's location
        ngo = r.get("ngo", {})
        if ngo and ngo.get("latitude") and ngo.get("longitude"):
            dist = haversine(lat, lng, ngo["latitude"], ngo["longitude"])
            if dist <= radius:
                r["distance"] = round(dist, 2)
                nearby.append(r)
        else:
            nearby.append(r)

    nearby.sort(key=lambda x: x.get("distance", 999))
    return {"data": nearby, "total": len(nearby)}


@router.post("", response_model=FoodRequestResponse, status_code=status.HTTP_201_CREATED)
async def create_request(
    request: FoodRequestCreate,
    current_user: dict = Depends(get_current_active_user),
    supabase: Client = Depends(get_supabase),
):
    """Create a food request."""
    data = request.model_dump()
    data["ngo_id"] = current_user["id"]
    data["status"] = "pending"

    result = supabase.table("requests").insert(data).execute()

    # Notify nearby donors
    notify_nearby_donors(supabase, data)

    return result.data[0]


@router.get("/{request_id}", response_model=FoodRequestResponse)
async def get_request(
    request_id: str,
    current_user: dict = Depends(get_current_active_user),
    supabase: Client = Depends(get_supabase),
):
    """Get request by ID."""
    result = (
        supabase.table("requests")
        .select("*, ngo:ngo_id(*)")
        .eq("id", request_id)
        .execute()
    )
    if not result.data:
        raise HTTPException(status_code=404, detail="Request not found")
    return result.data[0]


@router.put("/{request_id}/fulfill")
async def fulfill_request(
    request_id: str,
    current_user: dict = Depends(get_current_active_user),
    supabase: Client = Depends(get_supabase),
):
    """Mark request as fulfilled."""
    supabase.table("requests").update({"status": "fulfilled"}).eq("id", request_id).execute()
    return {"success": True}


def notify_nearby_donors(supabase: Client, request_data: dict):
    """Notify donors about new food request."""
    donors = supabase.table("users").select("id").eq("role", "donor").execute()
    for donor in donors.data:
        supabase.table("notifications").insert({
            "user_id": donor["id"],
            "title": "New Food Request",
            "message": f"A new food request has been posted near you.",
            "type": "request",
            "read": False,
        }).execute()
