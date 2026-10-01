# FoodBridge

> **Connecting Surplus Food with Those Who Need It Most.**

A smart food redistribution platform that connects donors, restaurants, function organizers, NGOs, orphanages, volunteers, and administrators to reduce food waste and distribute meals to people in need.

---

## Tech Stack

| Layer     | Technology                          |
|-----------|-------------------------------------|
| Frontend  | Next.js 14 (App Router), TypeScript, Tailwind CSS |
| Backend   | FastAPI (Python) — optional API layer |
| Database  | Supabase (PostgreSQL)               |
| Auth      | Supabase Auth (email/password, Google OAuth, JWT) |
| Charts    | Recharts                            |
| Icons     | Lucide React                        |

---

## Project Structure

```
food-donation/
├── frontend/                 # Next.js 14 application
│   ├── app/                  # App Router pages
│   │   ├── (auth)/           # Login, Register
│   │   ├── (dashboard)/      # Role-based dashboards
│   │   │   ├── donor/        # Donor dashboard, donate form, donation details
│   │   │   ├── ngo/          # NGO dashboard, request form, emergency form
│   │   │   ├── volunteer/    # Volunteer dashboard, delivery details, tracking
│   │   │   ├── admin/        # Admin dashboard, user/donation/emergency management
│   │   │   ├── profile/      # User profile
│   │   │   ├── notifications/# Notification feed
│   │   │   └── history/      # History with tabs
│   │   └── page.tsx          # Landing page
│   ├── components/           # Reusable UI components
│   ├── lib/                  # API client, types, utilities
│   └── ...
├── backend/                  # FastAPI application
│   ├── app/
│   │   ├── routers/          # API route handlers
│   │   ├── auth.py           # Supabase Auth integration
│   │   ├── schemas.py        # Pydantic schemas
│   │   ├── database.py       # Supabase client
│   │   ├── config.py         # Settings
│   │   ├── seed.py           # Sample data seeder
│   │   └── main.py           # FastAPI app entry
│   ├── schema.sql            # Supabase schema + seed
│   ├── requirements.txt
│   └── Dockerfile
└── README.md
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- Python 3.11+
- A [Supabase](https://supabase.com) project (the repo ships with project credentials in `.env.example`)

### 1. Database Setup (Supabase)

Open your Supabase project → **SQL Editor** → paste and run `backend/schema.sql`.

This creates all tables (`users`, `donations`, `requests`, `emergency_requests`, `deliveries`, `notifications`), enums, indexes, row-level security policies, and sample seed rows — **including the Supabase Auth accounts** for the five demo users below, so they can sign in immediately with `Password@123`.

> The script is safe to re-run: every step is guarded with `ON CONFLICT DO NOTHING` / exception notices, so re-executing it never fails or duplicates data.

> The frontend talks to Supabase directly for auth and data — no backend required to run the UI.

### 2. Frontend Setup

```bash
cd frontend
npm install
cp .env.local.example .env.local
```

`.env.local`:

```
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_SUPABASE_URL=https://nbvvvqcjzxittnzoxmbr.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
```

```bash
npm run dev
```

App available at `http://localhost:3000`

### 3. Backend Setup (optional API layer)

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
uvicorn app.main:app --reload --port 8000
```

API docs available at `http://localhost:8000/docs`

### 4. Seed Sample Data (optional)

`schema.sql` already seeds everything. To re-seed or add more data through the Supabase admin API (creates/updates auth users + profiles + sample content):

```bash
cd backend
python -m app.seed
```

---

## User Roles & Credentials (Seeded)

| Role       | Email                  | Password      |
|------------|------------------------|---------------|
| Donor      | donor@foodbridge.com   | Password@123  |
| NGO        | ngo@foodbridge.com     | Password@123  |
| Volunteer  | volunteer@foodbridge.com | Password@123 |
| Admin      | admin@foodbridge.com   | Password@123  |

---

## Core Flows

### Donation Flow
Login → Dashboard → Donate Food → Food Details → Safety Details → Location → Matching → Confirmation → Tracking → Completed

### Normal Request Flow
Login → NGO Dashboard → Request Food → Enter Details → Nearby Donations → Accept Donation → Volunteer Delivery → Confirmation

### Emergency Flow
NGO Dashboard → Emergency Food Request → Required Meals → Submit → Notify Nearby Donors and Volunteers → Donor Accepts → Volunteer Assigned → Live Tracking → Delivery Confirmation

### Volunteer Flow
Login → Volunteer Dashboard → Nearby Deliveries → Accept → Pickup → Start Delivery → Live Tracking → Delivered → Verification

---

## API Endpoints

| Method | Endpoint                          | Description              |
|--------|-----------------------------------|--------------------------|
| POST   | /api/auth/register                | Register new user        |
| POST   | /api/auth/login                   | Login                    |
| GET    | /api/auth/profile                 | Get current user         |
| GET    | /api/donations                    | List donations           |
| POST   | /api/donations                    | Create donation          |
| GET    | /api/donations/nearby             | Nearby donations         |
| GET    | /api/requests                     | List food requests       |
| POST   | /api/requests                     | Create food request      |
| GET    | /api/emergency/active             | Active emergency requests|
| POST   | /api/emergency                    | Create emergency request |
| GET    | /api/deliveries                   | List deliveries          |
| PUT    | /api/deliveries/{id}/status       | Update delivery status   |
| GET    | /api/admin/stats                  | Admin dashboard stats    |
| GET    | /api/admin/users                  | List all users           |
| GET    | /api/impact                       | Impact statistics        |
| GET    | /api/notifications                | User notifications       |

---

## Design System

| Token           | Value     | Usage                    |
|-----------------|-----------|--------------------------|
| Primary         | `#16A34A` | Brand, CTAs, active      |
| Primary Dark    | `#166534` | Headings, hover states   |
| Primary Light   | `#DCFCE7` | Backgrounds, badges     |
| Warning         | `#F59E0B` | Pending states           |
| Danger          | `#DC2626` | Urgent, emergency        |
| Info            | `#2563EB` | Informational            |
| Background      | `#F8FAFC` | Page background          |
| Surface         | `#FFFFFF` | Cards, panels            |
| Text            | `#0F172A` | Primary text             |
| Text Secondary  | `#64748B` | Secondary text           |
| Border          | `#E2E8F0` | Borders, dividers        |

**Typography:** Inter (Google Fonts)
**Spacing:** 8px base unit
**Border Radius:** 12-16px
**Shadows:** Soft, subtle

---

## License

MIT
