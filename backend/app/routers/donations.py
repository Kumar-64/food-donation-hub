"""
Donations router - Supabase integration.
"""
import math
from datetime import datetime
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from supabase import Client
from app.database import get_supabase
from app.auth import get_current_active_user
from app.schemas import DonationCreate, DonationUpdate, DonationResponse

router = APIRouter(prefix="/api/donations", tags=["donations"])


def haversine(lat1, lon1, lat2, lon2):
    """Calculate distance between two points in km."""
    R = 6371
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = math.sin(dlat / 2) ** 2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon / 2) ** 2
    return R * 2 * math.asin(math.sqrt(a))


@router.get("", response_model=dict)
async def list_donations(
    status: Optional[str] = None,
    donor_id: Optional[str] = None,
    food_type: Optional[str] = None,
    limit: int = Query(50, ge=1, le=100),
    offset: int = Query(0, ge=0),
    current_user: dict = Depends(get_current_active_user),
    supabase: Client = Depends(get_supabase),
):
    """List donations with optional filters."""
    query = supabase.table("donations").select("*, donor:donor_id(*)").order("created_at", desc=True)

    if status:
        query = query.eq("status", status)
    if donor_id:
        query = query.eq("donor_id", donor_id)
    if food_type:
        query = query.eq("food_type", food_type)

    query = query.range(offset, offset + limit - 1)
    result = query.execute()

    return {"data": result.data, "total": len(result.data)}


@router.get("/nearby", response_model=dict)
async def nearby_donations(
    lat: float = Query(..., description="Latitude"),
    lng: float = Query(..., description="Longitude"),
    radius: float = Query(10.0, description="Radius in km"),
    current_user: dict = Depends(get_current_active_user),
    supabase: Client = Depends(get_supabase),
):
    """Get nearby donations using Haversine distance."""
    result = (
        supabase.table("donations")
        .select("*, donor:donor_id(*)")
        .in_("status", ["pending", "available"])
        .execute()
    )

    nearby = []
    for d in result.data:
        if d.get("pickup_lat") and d.get("pickup_lng"):
            dist = haversine(lat, lng, d["pickup_lat"], d["pickup_lng"])
            if dist <= radius:
                d["distance"] = round(dist, 2)
                nearby.append(d)

    nearby.sort(key=lambda x: x["distance"])
    return {"data": nearby, "total": len(nearby)}


@router.post("", response_model=DonationResponse, status_code=status.HTTP_201_CREATED)
async def create_donation(
    donation: DonationCreate,
    current_user: dict = Depends(get_current_active_user),
    supabase: Client = Depends(get_supabase),
):
    """Create a new donation."""
    data = donation.model_dump()
    data["donor_id"] = current_user["id"]
    data["status"] = "pending"

    result = supabase.table("donations").insert(data).execute()
    return result.data[0]


@router.get("/{donation_id}", response_model=DonationResponse)
async def get_donation(
    donation_id: str,
    current_user: dict = Depends(get_current_active_user),
    supabase: Client = Depends(get_supabase),
):
    """Get donation by ID."""
    result = (
        supabase.table("donations")
        .select("*, donor:donor_id(*)")
        .eq("id", donation_id)
        .execute()
    )
    if not result.data:
        raise HTTPException(status_code=404, detail="Donation not found")
    return result.data[0]


@router.put("/{donation_id}", response_model=DonationResponse)
async def update_donation(
    donation_id: str,
    donation: DonationUpdate,
    current_user: dict = Depends(get_current_active_user),
    supabase: Client = Depends(get_supabase),
):
    """Update a donation."""
    # Check ownership
    existing = supabase.table("donations").select("*").eq("id", donation_id).execute()
    if not existing.data:
        raise HTTPException(status_code=404, detail="Donation not found")
    if existing.data[0]["donor_id"] != current_user["id"] and current_user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")

    update_data = {k: v for k, v in donation.model_dump().items() if v is not None}
    result = supabase.table("donations").update(update_data).eq("id", donation_id).execute()
    return result.data[0]


@router.post("/{donation_id}/cancel")
async def cancel_donation(
    donation_id: str,
    current_user: dict = Depends(get_current_active_user),
    supabase: Client = Depends(get_supabase),
):
    """Cancel a donation."""
    existing = supabase.table("donations").select("*").eq("id", donation_id).execute()
    if not existing.data:
        raise HTTPException(status_code=404, detail="Donation not found")
    if existing.data[0]["donor_id"] != current_user["id"] and current_user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")

    supabase.table("donations").update({"status": "cancelled"}).eq("id", donation_id).execute()
    return {"success": True}


@router.post("/{donation_id}/match")
async def match_donation(
    donation_id: str,
    request_user: dict = Depends(get_current_active_user),
    supabase: Client = Depends(get_supabase),
):
    """Match a donation with a request."""
    # Update donation status
    supabase.table("donations").update({"status": "matched"}).eq("id", donation_id).execute()

    # Create notification for donor
    donation = supabase.table("donations").select("*").eq("id", donation_id).execute()
    if donation.data:
        supabase.table("notifications").insert({
            "user_id": donation.data[0]["donor_id"],
            "title": "Donation Matched",
            "message": f"Your donation '{donation.data[0]['title']}' has been matched with a recipient.",
            "type": "donation",
            "read": False,
        }).execute()

    return {"success": True, "message": "Donation matched successfully"}
