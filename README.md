# FoodBridge - AI-Enabled Free Food Redistribution Platform

FoodBridge is a B.Tech final-year full-stack project that connects surplus food donors with NGOs, orphanages, and volunteers.

## Features
- React + Vite frontend
- Node.js + Express backend
- MongoDB + Mongoose data models
- JWT authentication and role-based access
- Donation, request, matching, delivery, notifications, ratings, rewards
- FastAPI AI matching service with explainable scoring
- Leaflet + OpenStreetMap maps
- Demo seed data and simple fallback behavior for optional services

## Folder Structure
- `client/` - React frontend
- `server/` - Express API
- `ai-service/` - FastAPI scoring service
- `docs/` - Short technical documentation

## Requirements
- Node.js 18+
- MongoDB Atlas or local MongoDB
- Python 3.10+

## Setup
1. Install dependencies: `npm install`
2. Copy `server/.env.example` to `server/.env`
3. Copy `client/.env.example` to `client/.env`
4. Optionally copy `ai-service/.env` if you add extra config later

## Environment Variables
### Server
- `PORT=5000`
- `MONGODB_URI=`
- `JWT_SECRET=`
- `JWT_EXPIRES_IN=7d`
- `CLIENT_URL=http://localhost:5173`
- `AI_SERVICE_URL=http://localhost:8000`
- `CORS_ORIGIN=http://localhost:5173`
- `CLOUDINARY_CLOUD_NAME=`
- `CLOUDINARY_API_KEY=`
- `CLOUDINARY_API_SECRET=`

### Client
- `VITE_API_URL=http://localhost:5000/api`
- `VITE_AI_SERVICE_URL=http://localhost:8000`

## Run
- Frontend: `npm run dev --workspace client`
- Backend: `npm run dev --workspace server`
- AI service: `uvicorn app:app --reload --port 8000` inside `ai-service/`

## Seed Demo Data
- Backend seed script: `node scripts/seed.js` inside `server/`
- Demo password: `Demo@12345`

## Demo Credentials
- `admin@foodbridge.demo`
- `donor@foodbridge.demo`
- `volunteer@foodbridge.demo`
- `ngo@foodbridge.demo`
- `orphanage@foodbridge.demo`

## Key API Endpoints
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `POST /api/donations`
- `POST /api/requests`
- `POST /api/matches/generate`
- `POST /api/deliveries/:id/verify`
- `GET /api/analytics/overview`
- `GET /api/admin/dashboard`

## AI Matching
The AI service returns an explainable score from 0 to 100 using distance, freshness, quantity fit, urgency, food type, and timing.
If the AI service is unavailable, the backend uses a local fallback scorer so the app still works.

## Deployment
- Frontend: Vercel
- Backend: Render
- AI service: Render or any Python host

## Future Scope
- Better map routing
- Push notifications with Firebase Cloud Messaging
- Real image storage with Cloudinary
- More detailed analytics charts
- Stronger recommendation models
