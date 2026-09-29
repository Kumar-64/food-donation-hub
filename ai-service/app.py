from fastapi import FastAPI
from pydantic import BaseModel, Field
from typing import List

app = FastAPI(title="FoodBridge AI Service", version="1.0.0")

class MatchScoreRequest(BaseModel):
    distance_km: float = Field(..., ge=0)
    freshness_hours: float = Field(..., ge=0)
    quantity_available: float = Field(..., ge=0)
    quantity_required: float = Field(..., ge=0)
    urgency: str
    food_type_match: int = Field(..., ge=0, le=1)
    time_difference_hours: float = Field(..., ge=0)

class MatchScoreResponse(BaseModel):
    score: int
    explanation: List[str]

@app.get("/health")
def health():
    return {"success": True, "message": "FoodBridge AI service is healthy"}

@app.post("/match-score", response_model=MatchScoreResponse)
def match_score(payload: MatchScoreRequest):
    distance_score = max(0, 30 - min(payload.distance_km * 3, 30))
    freshness_score = max(0, 20 - min(payload.freshness_hours * 1.5, 20))
    quantity_gap = abs(payload.quantity_available - payload.quantity_required)
    quantity_score = max(0, 20 - min(quantity_gap / 10, 20))
    urgency_score = 15 if payload.urgency == "EMERGENCY" else 12 if payload.urgency == "URGENT" else 8
    food_type_score = 10 if payload.food_type_match == 1 else 0
    time_score = max(0, 5 - min(payload.time_difference_hours, 5))
    score = min(100, round(distance_score + freshness_score + quantity_score + urgency_score + food_type_score + time_score))

    explanation = []
    if distance_score >= 20:
        explanation.append("Donation is nearby")
    if freshness_score >= 10:
        explanation.append("Food is fresh")
    if quantity_score >= 10:
        explanation.append("Quantity is suitable")
    if urgency_score >= 12:
        explanation.append("Request has high urgency")
    if food_type_score:
        explanation.append("Food type matches the request")
    if time_score >= 3:
        explanation.append("Timing looks suitable")

    return {"score": score, "explanation": explanation}
