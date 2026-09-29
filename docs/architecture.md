# Architecture

FoodBridge uses a simple three-part architecture.

1. Client: React pages and reusable dashboard components.
2. Server: Express routes, controllers, services, and MongoDB models.
3. AI service: FastAPI endpoint that returns explainable match scores.

Main flow:
Donor creates donation -> MongoDB stores it -> matcher finds requests -> AI score ranks the match -> volunteer handles delivery -> QR verification completes delivery -> analytics update.
