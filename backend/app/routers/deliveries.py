"""
Deliveries router - Supabase integration.
"""
from datetime import datetime
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from supabase import Client
from app.database import get_supabase
from app.auth import get_current_active_user
from app.schemas import DeliveryResponse, DeliveryStatusUpdate

router = APIRouter(prefix="/api/deliveries", tags=["deliveries"])


@router.get("", response_model=dict)
async def list_deliveries(
    status: Optional[str] = None,
    volunteer_id: Optional[str] = None,
    limit: int = Query(50, ge=1, le=100),
    offset: int = Query(0, ge=0),
    current_user: dict = Depends(get_current_active_user),
    supabase: Client = Depends(get_supabase),
):
    """List deliveries."""
    query = supabase.table("deliveries").select("*, donation:donation_id(*), volunteer:volunteer_id(*)").order("created_at", desc=True)

    if status:
        query = query.eq("status", status)
    if volunteer_id:
        query = query.eq("volunteer_id", volunteer_id)

    query = query.range(offset, offset + limit - 1)
    result = query.execute()
    return {"data": result.data, "total": len(result.data)}


@router.get("/available", response_model=dict)
async def available_deliveries(
    current_user: dict = Depends(get_current_active_user),
    supabase: Client = Depends(get_supabase),
):
    """Get available deliveries for volunteers."""
    result = (
        supabase.table("deliveries")
        .select("*, donation:donation_id(*, donor:donor_id(*))")
        .eq("status", "assigned")
        .is_("volunteer_id", "null")
        .execute()
    )
    return {"data": result.data, "total": len(result.data)}


@router.post("", response_model=DeliveryResponse, status_code=status.HTTP_201_CREATED)
async def create_delivery(
    donation_id: str,
    request_id: Optional[str] = None,
    current_user: dict = Depends(get_current_active_user),
    supabase: Client = Depends(get_supabase),
):
    """Create a delivery (assign volunteer)."""
    data = {
        "donation_id": donation_id,
        "volunteer_id": current_user["id"],
        "request_id": request_id,
        "status": "assigned",
    }
    result = supabase.table("deliveries").insert(data).execute()
    return result.data[0]


@router.get("/{delivery_id}", response_model=DeliveryResponse)
async def get_delivery(
    delivery_id: str,
    current_user: dict = Depends(get_current_active_user),
    supabase: Client = Depends(get_supabase),
):
    """Get delivery by ID."""
    result = (
        supabase.table("deliveries")
        .select("*, donation:donation_id(*, donor:donor_id(*)), volunteer:volunteer_id(*)")
        .eq("id", delivery_id)
        .execute()
    )
    if not result.data:
        raise HTTPException(status_code=404, detail="Delivery not found")
    return result.data[0]


@router.put("/{delivery_id}/status", response_model=DeliveryResponse)
async def update_delivery_status(
    delivery_id: str,
    status_update: DeliveryStatusUpdate,
    current_user: dict = Depends(get_current_active_user),
    supabase: Client = Depends(get_supabase),
):
    """Update delivery status."""
    # Verify volunteer owns this delivery
    existing = supabase.table("deliveries").select("*").eq("id", delivery_id).execute()
    if not existing.data:
        raise HTTPException(status_code=404, detail="Delivery not found")

    delivery = existing.data[0]
    if delivery.get("volunteer_id") != current_user["id"] and current_user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")

    update_data = {"status": status_update.status}

    if status_update.status == "picked_up":
        update_data["picked_up_at"] = datetime.utcnow().isoformat()
    elif status_update.status == "delivered":
        update_data["delivered_at"] = datetime.utcnow().isoformat()
        # Update donation status too
        supabase.table("donations").update({"status": "delivered"}).eq("id", delivery["donation_id"]).execute()

    result = supabase.table("deliveries").update(update_data).eq("id", delivery_id).execute()

    # Create notifications
    if status_update.status == "delivered":
        # Notify donor
        donation = supabase.table("donations").select("*").eq("id", delivery["donation_id"]).execute()
        if donation.data:
            supabase.table("notifications").insert({
                "user_id": donation.data[0]["donor_id"],
                "title": "Delivery Completed",
                "message": f"Your donation '{donation.data[0]['title']}' has been delivered successfully.",
                "type": "delivery",
                "read": False,
            }).execute()

    return result.data[0]


@router.post("/{delivery_id}/accept")
async def accept_delivery(
    delivery_id: str,
    current_user: dict = Depends(get_current_active_user),
    supabase: Client = Depends(get_supabase),
):
    """Accept a delivery assignment."""
    existing = supabase.table("deliveries").select("*").eq("id", delivery_id).execute()
    if not existing.data:
        raise HTTPException(status_code=404, detail="Delivery not found")

    supabase.table("deliveries").update({
        "volunteer_id": current_user["id"],
        "status": "assigned",
    }).eq("id", delivery_id).execute()

    return {"success": True}
