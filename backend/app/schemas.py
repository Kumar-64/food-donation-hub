"""
Pydantic schemas for FoodBridge API.
"""
from datetime import datetime
from typing import Optional
from pydantic import BaseModel, EmailStr, Field


# ---- User Schemas ----
class UserBase(BaseModel):
    name: str
    email: EmailStr
    phone: Optional[str] = None
    role: str = "donor"
    organization: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None


class UserCreate(UserBase):
    password: str


class UserResponse(UserBase):
    id: str
    verified: bool = False
    suspended: bool = False
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class UserProfile(BaseModel):
    id: str
    name: str
    email: EmailStr
    phone: Optional[str] = None
    role: str
    organization: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    verified: bool = False
    suspended: bool = False
    created_at: Optional[datetime] = None


# ---- Auth Schemas ----
class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class RegisterRequest(BaseModel):
    email: EmailStr
    password: str
    name: str
    phone: Optional[str] = None
    role: str = "donor"
    organization: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None


class AuthResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse


# ---- Donation Schemas ----
class DonationBase(BaseModel):
    title: str
    description: Optional[str] = None
    food_type: str = "Vegetarian"
    quantity: int = Field(..., gt=0)
    unit: str = "meals"
    servings: int = Field(1, gt=0)
    preparation_time: Optional[datetime] = None
    expiry_date: Optional[datetime] = None
    storage_condition: Optional[str] = None
    pickup_address: str
    pickup_city: Optional[str] = None
    pickup_lat: Optional[float] = None
    pickup_lng: Optional[float] = None
    pickup_window: Optional[str] = None
    images: Optional[list] = None
    is_emergency: bool = False
    notes: Optional[str] = None


class DonationCreate(DonationBase):
    pass


class DonationUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    food_type: Optional[str] = None
    quantity: Optional[int] = None
    unit: Optional[str] = None
    servings: Optional[int] = None
    preparation_time: Optional[datetime] = None
    expiry_date: Optional[datetime] = None
    storage_condition: Optional[str] = None
    pickup_address: Optional[str] = None
    pickup_city: Optional[str] = None
    pickup_lat: Optional[float] = None
    pickup_lng: Optional[float] = None
    pickup_window: Optional[str] = None
    status: Optional[str] = None
    is_emergency: Optional[bool] = None
    notes: Optional[str] = None


class DonationResponse(DonationBase):
    id: str
    donor_id: str
    status: str = "pending"
    matched_request_id: Optional[str] = None
    volunteer_id: Optional[str] = None
    created_at: Optional[datetime] = None
    donor: Optional[UserResponse] = None

    class Config:
        from_attributes = True


# ---- Food Request Schemas ----
class FoodRequestBase(BaseModel):
    title: str
    description: Optional[str] = None
    food_type: Optional[str] = None
    quantity_needed: int = Field(..., gt=0)
    unit: str = "meals"
    servings_needed: int = Field(1, gt=0)
    urgency: str = "medium"
    needed_by_date: Optional[datetime] = None
    delivery_address: str
    delivery_city: Optional[str] = None
    additional_requirements: Optional[str] = None
    is_emergency: bool = False


class FoodRequestCreate(FoodRequestBase):
    pass


class FoodRequestResponse(FoodRequestBase):
    id: str
    ngo_id: str
    status: str = "pending"
    matched_donation_id: Optional[str] = None
    created_at: Optional[datetime] = None
    ngo: Optional[UserResponse] = None

    class Config:
        from_attributes = True


# ---- Delivery Schemas ----
class DeliveryResponse(BaseModel):
    id: str
    donation_id: str
    volunteer_id: Optional[str] = None
    request_id: Optional[str] = None
    pickup_address: Optional[str] = None
    delivery_address: Optional[str] = None
    status: str = "assigned"
    assigned_at: Optional[datetime] = None
    picked_up_at: Optional[datetime] = None
    delivered_at: Optional[datetime] = None
    estimated_arrival: Optional[datetime] = None
    notes: Optional[str] = None
    created_at: Optional[datetime] = None
    donation: Optional[DonationResponse] = None
    volunteer: Optional[UserResponse] = None

    class Config:
        from_attributes = True


class DeliveryStatusUpdate(BaseModel):
    status: str


# ---- Emergency Request Schemas ----
class EmergencyRequestBase(BaseModel):
    title: str
    description: Optional[str] = None
    people_affected: int = Field(..., gt=0)
    food_type: Optional[str] = None
    quantity_needed: int = Field(..., gt=0)
    unit: str = "meals"
    level: str = "critical"
    needed_by_date: Optional[datetime] = None
    delivery_address: str
    delivery_city: Optional[str] = None
    reason: Optional[str] = None
    contact_number: str


class EmergencyRequestCreate(EmergencyRequestBase):
    pass


class EmergencyRequestResponse(EmergencyRequestBase):
    id: str
    ngo_id: str
    status: str = "open"
    resolved_at: Optional[datetime] = None
    created_at: Optional[datetime] = None
    ngo: Optional[UserResponse] = None

    class Config:
        from_attributes = True


# ---- Notification Schemas ----
class NotificationResponse(BaseModel):
    id: str
    user_id: str
    title: str
    message: str
    type: str
    read: bool = False
    link: Optional[str] = None
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# ---- Impact Stats Schemas ----
class ImpactStats(BaseModel):
    total_meals_served: int = 0
    total_food_rescued: float = 0
    total_donors: int = 0
    total_volunteers: int = 0
    total_organizations: int = 0
    total_donations: int = 0
    total_deliveries: int = 0
    active_emergency_requests: int = 0
    estimated_waste_avoided: float = 0


class AdminStats(ImpactStats):
    active_users: int = 0
    active_volunteers: int = 0
    food_rescued: float = 0
    emergency_requests: int = 0


class DonationsOverTime(BaseModel):
    date: str
    count: int
    meals: int
