from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import admin, auth, deliveries, donations, emergency, impact, notifications, requests

app = FastAPI(
    title="FoodBridge API",
    description="Food Redistribution Platform API",
    version="1.0.0",
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router)
app.include_router(donations.router)
app.include_router(requests.router)
app.include_router(deliveries.router)
app.include_router(emergency.router)
app.include_router(admin.router)
app.include_router(notifications.router)
app.include_router(impact.router)


@app.get("/")
def root():
    return {
        "message": "Welcome to FoodBridge API",
        "version": "1.0.0",
        "docs": "/docs",
    }


@app.get("/health")
def health_check():
    return {"status": "healthy"}
