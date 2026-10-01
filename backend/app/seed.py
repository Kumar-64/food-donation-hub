"""
Seed sample data into Supabase for FoodBridge.
Run with: python -m app.seed
"""
from supabase import create_client
from app.config import settings

supabase = create_client(
    settings.SUPABASE_URL,
    settings.SUPABASE_SERVICE_ROLE_KEY,
)

SEED_PASSWORD = "Password@123"


def seed():
    """Seed the database with sample data."""
    print("Seeding FoodBridge database...")

    # Create auth users first (public.users references auth.users)
    users = [
        {
            "id": "11111111-1111-1111-1111-111111111111",
            "name": "Spice Garden Restaurant",
            "email": "donor@foodbridge.com",
            "phone": "+91 98765 43210",
            "role": "donor",
            "organization": "Spice Garden Restaurant",
            "address": "Andheri West, Mumbai",
            "city": "Mumbai",
            "latitude": 19.076,
            "longitude": 72.8777,
            "verified": True,
            "suspended": False,
        },
        {
            "id": "22222222-2222-2222-2222-222222222222",
            "name": "Hope Foundation",
            "email": "ngo@foodbridge.com",
            "phone": "+91 98765 43211",
            "role": "ngo",
            "organization": "Hope Foundation",
            "address": "Karol Bagh, Delhi",
            "city": "Delhi",
            "latitude": 28.6139,
            "longitude": 77.209,
            "verified": True,
            "suspended": False,
        },
        {
            "id": "33333333-3333-3333-3333-333333333333",
            "name": "Ravi Kumar",
            "email": "volunteer@foodbridge.com",
            "phone": "+91 98765 43212",
            "role": "volunteer",
            "organization": None,
            "address": "Indiranagar, Bangalore",
            "city": "Bangalore",
            "latitude": 12.9716,
            "longitude": 77.5946,
            "verified": True,
            "suspended": False,
        },
        {
            "id": "44444444-4444-4444-4444-444444444444",
            "name": "Admin User",
            "email": "admin@foodbridge.com",
            "phone": "+91 98765 43213",
            "role": "admin",
            "organization": "FoodBridge",
            "address": "Madhapur, Hyderabad",
            "city": "Hyderabad",
            "latitude": 17.385,
            "longitude": 78.4867,
            "verified": True,
            "suspended": False,
        },
        {
            "id": "55555555-5555-5555-5555-555555555555",
            "name": "Priya Sharma",
            "email": "organizer@foodbridge.com",
            "phone": "+91 98765 43214",
            "role": "organizer",
            "organization": "Sharma Events",
            "address": "T Nagar, Chennai",
            "city": "Chennai",
            "latitude": 13.0827,
            "longitude": 80.2707,
            "verified": True,
            "suspended": False,
        },
    ]

    for user in users:
        # Create the auth account so the seeded logins work
        try:
            supabase.auth.admin.create_user(
                {
                    "email": user["email"],
                    "password": SEED_PASSWORD,
                    "email_confirm": True,
                    "user_metadata": {
                        "name": user["name"],
                        "phone": user["phone"],
                        "role": user["role"],
                        "organization": user["organization"],
                        "address": user["address"],
                        "city": user["city"],
                    },
                }
            )
        except Exception as e:
            print(f"  Auth user {user['email']} skipped: {e}")

        # Profile row in public.users
        try:
            supabase.table("users").upsert(user).execute()
            print(f"  Created user: {user['name']} ({user['role']})")
        except Exception as e:
            print(f"  User {user['name']} skipped: {e}")

    # Create donations
    donations = [
        {
            "id": "d1111111-1111-1111-1111-111111111111",
            "donor_id": "11111111-1111-1111-1111-111111111111",
            "title": "Vegetable Biryani",
            "description": "Fresh vegetable biryani from lunch service, packed hot.",
            "food_type": "Vegetarian",
            "quantity": 50,
            "unit": "meals",
            "servings": 50,
            "preparation_time": "2026-09-30T10:00:00+05:30",
            "expiry_date": "2026-09-30T14:00:00+05:30",
            "storage_condition": "Hot storage",
            "pickup_address": "Spice Garden, Andheri West, Mumbai",
            "pickup_city": "Mumbai",
            "pickup_lat": 19.1136,
            "pickup_lng": 72.8697,
            "pickup_window": "12:00 – 14:00",
            "status": "available",
            "is_emergency": False,
        },
        {
            "id": "d2222222-2222-2222-2222-222222222222",
            "donor_id": "11111111-1111-1111-1111-111111111111",
            "title": "Paneer Tikka Masala",
            "description": "Main course surplus from banquet order.",
            "food_type": "Vegetarian",
            "quantity": 30,
            "unit": "meals",
            "servings": 30,
            "preparation_time": "2026-09-30T11:00:00+05:30",
            "expiry_date": "2026-09-30T15:00:00+05:30",
            "storage_condition": "Hot storage",
            "pickup_address": "Spice Garden, Andheri West, Mumbai",
            "pickup_city": "Mumbai",
            "pickup_lat": 19.1136,
            "pickup_lng": 72.8697,
            "pickup_window": "13:00 – 15:00",
            "status": "matched",
            "is_emergency": False,
        },
        {
            "id": "d3333333-3333-3333-3333-333333333333",
            "donor_id": "55555555-5555-5555-5555-555555555555",
            "title": "Wedding Buffet - Mixed",
            "description": "Leftover buffet from a 500-guest wedding reception.",
            "food_type": "Non-Vegetarian",
            "quantity": 100,
            "unit": "meals",
            "servings": 100,
            "preparation_time": "2026-09-30T09:00:00+05:30",
            "expiry_date": "2026-09-30T13:00:00+05:30",
            "storage_condition": "Room temperature",
            "pickup_address": "Sharma Banquet Hall, T Nagar, Chennai",
            "pickup_city": "Chennai",
            "pickup_lat": 13.0418,
            "pickup_lng": 80.2341,
            "pickup_window": "11:00 – 13:00",
            "status": "available",
            "is_emergency": False,
        },
    ]

    for donation in donations:
        supabase.table("donations").upsert(donation).execute()
        print(f"  Created donation: {donation['title']}")

    # Create food requests
    requests = [
        {
            "id": "a1111111-1111-1111-1111-111111111111",
            "ngo_id": "22222222-2222-2222-2222-222222222222",
            "title": "Lunch for 40 residents",
            "description": "Daily lunch support for shelter residents.",
            "food_type": "Vegetarian",
            "quantity_needed": 40,
            "unit": "meals",
            "servings_needed": 40,
            "urgency": "high",
            "needed_by_date": "2026-09-30T14:00:00+05:30",
            "delivery_address": "Hope Foundation, Karol Bagh, Delhi",
            "delivery_city": "Delhi",
            "status": "pending",
        },
        {
            "id": "a2222222-2222-2222-2222-222222222222",
            "ngo_id": "22222222-2222-2222-2222-222222222222",
            "title": "Evening meals for 25",
            "description": "Light evening meals for children.",
            "food_type": "Any",
            "quantity_needed": 25,
            "unit": "meals",
            "servings_needed": 25,
            "urgency": "medium",
            "needed_by_date": "2026-09-30T15:00:00+05:30",
            "delivery_address": "Hope Foundation, Karol Bagh, Delhi",
            "delivery_city": "Delhi",
            "status": "fulfilled",
        },
    ]

    for req in requests:
        supabase.table("requests").upsert(req).execute()
        print(f"  Created request: {req['quantity_needed']} meals")

    # Create deliveries
    deliveries = [
        {
            "id": "b1111111-1111-1111-1111-111111111111",
            "donation_id": "d2222222-2222-2222-2222-222222222222",
            "volunteer_id": "33333333-3333-3333-3333-333333333333",
            "request_id": "a2222222-2222-2222-2222-222222222222",
            "pickup_address": "Spice Garden, Andheri West, Mumbai",
            "delivery_address": "Hope Foundation, Karol Bagh, Delhi",
            "status": "delivered",
            "assigned_at": "2026-09-30T12:45:00+05:30",
            "picked_up_at": "2026-09-30T13:30:00+05:30",
            "delivered_at": "2026-09-30T14:15:00+05:30",
        },
        {
            "id": "b2222222-2222-2222-2222-222222222222",
            "donation_id": "d1111111-1111-1111-1111-111111111111",
            "volunteer_id": "33333333-3333-3333-3333-333333333333",
            "request_id": "a1111111-1111-1111-1111-111111111111",
            "pickup_address": "Spice Garden, Andheri West, Mumbai",
            "delivery_address": "Hope Foundation, Karol Bagh, Delhi",
            "status": "assigned",
            "assigned_at": "2026-09-30T11:30:00+05:30",
            "picked_up_at": None,
            "delivered_at": None,
        },
    ]

    for delivery in deliveries:
        supabase.table("deliveries").upsert(delivery).execute()
        print(f"  Created delivery: {delivery['status']}")

    # Create notifications
    notifications = [
        {
            "id": "c1111111-1111-1111-1111-111111111111",
            "user_id": "11111111-1111-1111-1111-111111111111",
            "title": "Donation Matched",
            "message": "Your donation 'Paneer Tikka Masala' has been matched with Hope Foundation.",
            "type": "donation",
            "read": False,
        },
        {
            "id": "c2222222-2222-2222-2222-222222222222",
            "user_id": "33333333-3333-3333-3333-333333333333",
            "title": "New Delivery Assignment",
            "message": "You have been assigned a delivery from Spice Garden to Hope Foundation.",
            "type": "delivery",
            "read": False,
        },
        {
            "id": "c3333333-3333-3333-3333-333333333333",
            "user_id": "22222222-2222-2222-2222-222222222222",
            "title": "Delivery Completed",
            "message": "Your food request has been delivered successfully.",
            "type": "delivery",
            "read": True,
        },
    ]

    for notification in notifications:
        supabase.table("notifications").upsert(notification).execute()
        print(f"  Created notification: {notification['title']}")

    # Create emergency requests
    emergencies = [
        {
            "id": "e1111111-1111-1111-1111-111111111111",
            "ngo_id": "22222222-2222-2222-2222-222222222222",
            "title": "Flood relief - 60 meals needed",
            "description": "Sudden influx of flood-affected families at the shelter.",
            "people_affected": 60,
            "quantity_needed": 60,
            "unit": "meals",
            "level": "critical",
            "needed_by_date": "2026-09-30T18:00:00+05:30",
            "delivery_address": "Hope Foundation, Karol Bagh, Delhi",
            "delivery_city": "Delhi",
            "contact_number": "+91 98765 43211",
            "reason": "Unexpected increase in shelter residents due to flood relief",
            "status": "open",
        },
        {
            "id": "e2222222-2222-2222-2222-222222222222",
            "ngo_id": "22222222-2222-2222-2222-222222222222",
            "title": "Kitchen maintenance - dinner",
            "description": "Kitchen under maintenance, dinner needs to be arranged.",
            "people_affected": 30,
            "quantity_needed": 30,
            "unit": "meals",
            "level": "high",
            "needed_by_date": "2026-09-30T20:00:00+05:30",
            "delivery_address": "Hope Foundation, Karol Bagh, Delhi",
            "delivery_city": "Delhi",
            "contact_number": "+91 98765 43211",
            "reason": "Kitchen maintenance - need dinner supplies",
            "status": "open",
        },
    ]

    for emergency in emergencies:
        supabase.table("emergency_requests").upsert(emergency).execute()
        print(f"  Created emergency: {emergency['quantity_needed']} meals")

    print("\nSeeding complete!")
    print("\nLogin credentials:")
    print("  Donor:     donor@foodbridge.com / " + SEED_PASSWORD)
    print("  NGO:       ngo@foodbridge.com / " + SEED_PASSWORD)
    print("  Volunteer: volunteer@foodbridge.com / " + SEED_PASSWORD)
    print("  Admin:     admin@foodbridge.com / " + SEED_PASSWORD)


if __name__ == "__main__":
    seed()
