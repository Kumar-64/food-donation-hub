"""
Impact router - Supabase integration.
"""
from fastapi import APIRouter, Depends, Query
from supabase import Client
from app.database import get_supabase
from app.auth import get_current_active_user

router = APIRouter(prefix="/api/impact", tags=["impact"])


@router.get("/stats")
async def get_impact_stats(
    current_user: dict = Depends(get_current_active_user),
    supabase: Client = Depends(get_supabase),
):
    """Get platform-wide impact statistics."""
    # Total meals served
    meals_result = supabase.table("donations").select("servings").eq("status", "delivered").execute()
    total_meals = sum(d["servings"] for d in meals_result.data)

    # Total food rescued
    food_result = supabase.table("donations").select("quantity").eq("status", "delivered").execute()
    total_food = sum(d["quantity"] for d in food_result.data)

    # Total donors
    donors = supabase.table("users").select("id", count="exact").eq("role", "donor").execute()

    # Total volunteers
    volunteers = supabase.table("users").select("id", count="exact").eq("role", "volunteer").execute()

    # Total organizations (NGOs + orphanages)
    orgs = supabase.table("users").select("id", count="exact").eq("role", "ngo").execute()

    # Total donations
    donations = supabase.table("donations").select("id", count="exact").execute()

    # Total deliveries
    deliveries = supabase.table("deliveries").select("id", count="exact").eq("status", "delivered").execute()

    # Estimated waste avoided (kg) - rough estimate: 0.5 kg per meal
    waste_avoided = total_meals * 0.5

    return {
        "total_meals_served": total_meals,
        "total_food_rescued": total_food,
        "total_donors": donors.count or 0,
        "total_volunteers": volunteers.count or 0,
        "total_organizations": orgs.count or 0,
        "total_donations": donations.count or 0,
        "total_deliveries": deliveries.count or 0,
        "estimated_waste_avoided": waste_avoided,
    }


@router.get("/donations-over-time")
async def get_donations_over_time(
    period: str = Query("30d", description="Period: 7d, 30d, 90d, 1y"),
    current_user: dict = Depends(get_current_active_user),
    supabase: Client = Depends(get_supabase),
):
    """Get donations over time for charts."""
    # Get all donations
    result = supabase.table("donations").select("created_at, quantity, servings").execute()

    # Group by date
    from collections import defaultdict
    from datetime import datetime, timedelta

    daily_data = defaultdict(lambda: {"count": 0, "meals": 0})

    for d in result.data:
        date_key = d["created_at"][:10] if d.get("created_at") else "unknown"
        daily_data[date_key]["count"] += 1
        daily_data[date_key]["meals"] += d.get("servings", 0)

    # Convert to list
    data = [{"date": k, "count": v["count"], "meals": v["meals"]} for k, v in sorted(daily_data.items())]
    return data
