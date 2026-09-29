# AI

FoodBridge uses a small explainable scoring service.

Inputs include distance, freshness, quantity fit, urgency, food type compatibility, and timing.

The FastAPI service returns a score from 0 to 100 and a short explanation list.
If the service is offline, the Node backend falls back to the same scoring logic locally.
