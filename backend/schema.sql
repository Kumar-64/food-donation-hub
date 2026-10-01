-- ============================================================
-- FoodBridge — Supabase (PostgreSQL) Schema
-- Canonical naming matches frontend/lib/types.ts
-- Run in the Supabase SQL editor, or: psql $DATABASE_URL -f schema.sql
-- ============================================================

-- ---------- Enums ----------
DO $$ BEGIN
  CREATE TYPE user_role AS ENUM ('donor', 'organizer', 'ngo', 'volunteer', 'admin');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE donation_status AS ENUM
    ('pending', 'available', 'matched', 'picked_up', 'in_transit', 'delivered', 'cancelled');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE request_status AS ENUM ('open', 'pending', 'matched', 'fulfilled', 'cancelled');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE delivery_status AS ENUM ('assigned', 'picked_up', 'in_transit', 'delivered', 'failed');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE urgency_level AS ENUM ('low', 'medium', 'high', 'critical');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE notification_type AS ENUM
    ('donation', 'request', 'delivery', 'system', 'emergency', 'verification');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ---------- Helpers ----------
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================================
-- USERS — profile rows for every authenticated account.
-- id must equal auth.users.id (Supabase Auth).
-- ============================================================
CREATE TABLE IF NOT EXISTS public.users (
  id           uuid PRIMARY KEY REFERENCES auth.users (id) ON DELETE CASCADE,
  name         text NOT NULL,
  email        text NOT NULL UNIQUE,
  phone        text,
  role         user_role NOT NULL DEFAULT 'donor',
  organization text,
  address      text,
  city         text,
  latitude     double precision,
  longitude    double precision,
  avatar_url   text,
  verified     boolean NOT NULL DEFAULT false,
  suspended    boolean NOT NULL DEFAULT false,
  created_at   timestamptz NOT NULL DEFAULT now(),
  last_login   timestamptz
);

CREATE INDEX IF NOT EXISTS idx_users_role ON public.users (role);
CREATE INDEX IF NOT EXISTS idx_users_city ON public.users (city);
CREATE INDEX IF NOT EXISTS idx_users_verified ON public.users (verified);

-- ============================================================
-- DONATIONS — surplus food published by donors / restaurants /
-- function organizers.
-- ============================================================
CREATE TABLE IF NOT EXISTS public.donations (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  donor_id          uuid NOT NULL REFERENCES public.users (id) ON DELETE CASCADE,
  title             text NOT NULL,
  description       text,
  food_type         text NOT NULL DEFAULT 'Vegetarian',
  quantity          integer NOT NULL CHECK (quantity > 0),
  unit              text NOT NULL DEFAULT 'meals',
  servings          integer NOT NULL DEFAULT 1,
  preparation_time  timestamptz,
  expiry_date       timestamptz,
  storage_condition text,
  pickup_address    text NOT NULL,
  pickup_city       text,
  pickup_lat        double precision,
  pickup_lng        double precision,
  pickup_window     text,
  status            donation_status NOT NULL DEFAULT 'pending',
  images            text[],
  matched_request_id uuid,
  volunteer_id      uuid REFERENCES public.users (id) ON DELETE SET NULL,
  is_emergency      boolean NOT NULL DEFAULT false,
  notes             text,
  created_at        timestamptz NOT NULL DEFAULT now(),
  updated_at        timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_donations_donor ON public.donations (donor_id);
CREATE INDEX IF NOT EXISTS idx_donations_status ON public.donations (status);
CREATE INDEX IF NOT EXISTS idx_donations_city ON public.donations (pickup_city);
CREATE INDEX IF NOT EXISTS idx_donations_created ON public.donations (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_donations_expiry ON public.donations (expiry_date);

DROP TRIGGER IF EXISTS trg_donations_updated_at ON public.donations;
CREATE TRIGGER trg_donations_updated_at
  BEFORE UPDATE ON public.donations
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============================================================
-- REQUESTS — normal food requests from NGOs / orphanages.
-- ============================================================
CREATE TABLE IF NOT EXISTS public.requests (
  id                    uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ngo_id                uuid NOT NULL REFERENCES public.users (id) ON DELETE CASCADE,
  title                 text NOT NULL,
  description           text,
  food_type             text,
  quantity_needed       integer NOT NULL CHECK (quantity_needed > 0),
  unit                  text NOT NULL DEFAULT 'meals',
  servings_needed       integer NOT NULL DEFAULT 1,
  urgency               urgency_level NOT NULL DEFAULT 'medium',
  needed_by_date        timestamptz,
  delivery_address      text NOT NULL,
  delivery_city         text,
  is_emergency          boolean NOT NULL DEFAULT false,
  additional_requirements text,
  status                request_status NOT NULL DEFAULT 'pending',
  matched_donation_id   uuid REFERENCES public.donations (id) ON DELETE SET NULL,
  created_at            timestamptz NOT NULL DEFAULT now(),
  updated_at            timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_requests_ngo ON public.requests (ngo_id);
CREATE INDEX IF NOT EXISTS idx_requests_status ON public.requests (status);
CREATE INDEX IF NOT EXISTS idx_requests_urgency ON public.requests (urgency);
CREATE INDEX IF NOT EXISTS idx_requests_created ON public.requests (created_at DESC);

DROP TRIGGER IF EXISTS trg_requests_updated_at ON public.requests;
CREATE TRIGGER trg_requests_updated_at
  BEFORE UPDATE ON public.requests
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============================================================
-- EMERGENCY REQUESTS — urgent meals needed right away.
-- ============================================================
CREATE TABLE IF NOT EXISTS public.emergency_requests (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ngo_id            uuid NOT NULL REFERENCES public.users (id) ON DELETE CASCADE,
  title             text NOT NULL,
  description       text,
  people_affected   integer NOT NULL CHECK (people_affected > 0),
  food_type         text,
  quantity_needed   integer NOT NULL CHECK (quantity_needed > 0),
  unit              text NOT NULL DEFAULT 'meals',
  level             urgency_level NOT NULL DEFAULT 'critical',
  needed_by_date    timestamptz,
  delivery_address  text NOT NULL,
  delivery_city     text,
  contact_number    text NOT NULL,
  reason            text,
  status            request_status NOT NULL DEFAULT 'open',
  resolved_at       timestamptz,
  created_at        timestamptz NOT NULL DEFAULT now(),
  updated_at        timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_emergency_ngo ON public.emergency_requests (ngo_id);
CREATE INDEX IF NOT EXISTS idx_emergency_status ON public.emergency_requests (status);
CREATE INDEX IF NOT EXISTS idx_emergency_level ON public.emergency_requests (level);
CREATE INDEX IF NOT EXISTS idx_emergency_created ON public.emergency_requests (created_at DESC);

DROP TRIGGER IF EXISTS trg_emergency_updated_at ON public.emergency_requests;
CREATE TRIGGER trg_emergency_updated_at
  BEFORE UPDATE ON public.emergency_requests
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============================================================
-- DELIVERIES — volunteer pickup + delivery runs.
-- ============================================================
CREATE TABLE IF NOT EXISTS public.deliveries (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  donation_id      uuid NOT NULL REFERENCES public.donations (id) ON DELETE CASCADE,
  request_id       uuid REFERENCES public.requests (id) ON DELETE SET NULL,
  volunteer_id     uuid REFERENCES public.users (id) ON DELETE SET NULL,
  pickup_address   text,
  delivery_address text,
  status           delivery_status NOT NULL DEFAULT 'assigned',
  assigned_at      timestamptz NOT NULL DEFAULT now(),
  picked_up_at     timestamptz,
  delivered_at     timestamptz,
  estimated_arrival timestamptz,
  notes            text,
  created_at       timestamptz NOT NULL DEFAULT now(),
  updated_at       timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_deliveries_volunteer ON public.deliveries (volunteer_id);
CREATE INDEX IF NOT EXISTS idx_deliveries_donation ON public.deliveries (donation_id);
CREATE INDEX IF NOT EXISTS idx_deliveries_status ON public.deliveries (status);

DROP TRIGGER IF EXISTS trg_deliveries_updated_at ON public.deliveries;
CREATE TRIGGER trg_deliveries_updated_at
  BEFORE UPDATE ON public.deliveries
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============================================================
-- NOTIFICATIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.notifications (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    uuid NOT NULL REFERENCES public.users (id) ON DELETE CASCADE,
  type       notification_type NOT NULL DEFAULT 'system',
  title      text NOT NULL,
  message    text NOT NULL,
  read       boolean NOT NULL DEFAULT false,
  link       text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_notifications_user ON public.notifications (user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_unread ON public.notifications (user_id) WHERE read = false;

-- ============================================================
-- ROW LEVEL SECURITY
-- Authenticated users can read the shared tables (matching,
-- dashboards) and write only their own rows. The service role
-- key (backend / seed) bypasses RLS.
-- ============================================================
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.emergency_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deliveries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- users
DROP POLICY IF EXISTS users_select ON public.users;
CREATE POLICY users_select ON public.users
  FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS users_insert_own ON public.users;
CREATE POLICY users_insert_own ON public.users
  FOR INSERT TO authenticated WITH CHECK (id = auth.uid());

DROP POLICY IF EXISTS users_update_own ON public.users;
CREATE POLICY users_update_own ON public.users
  FOR UPDATE TO authenticated USING (id = auth.uid()) WITH CHECK (id = auth.uid());

DROP POLICY IF EXISTS users_delete_own ON public.users;
CREATE POLICY users_delete_own ON public.users
  FOR DELETE TO authenticated USING (id = auth.uid());

-- donations (public listings are readable by everyone; writes are the owner's)
DROP POLICY IF EXISTS donations_select ON public.donations;
CREATE POLICY donations_select ON public.donations
  FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS donations_insert_own ON public.donations;
CREATE POLICY donations_insert_own ON public.donations
  FOR INSERT TO authenticated WITH CHECK (donor_id = auth.uid());

DROP POLICY IF EXISTS donations_update_own ON public.donations;
CREATE POLICY donations_update_own ON public.donations
  FOR UPDATE TO authenticated USING (donor_id = auth.uid() OR volunteer_id = auth.uid());

DROP POLICY IF EXISTS donations_delete_own ON public.donations;
CREATE POLICY donations_delete_own ON public.donations
  FOR DELETE TO authenticated USING (donor_id = auth.uid());

-- requests
DROP POLICY IF EXISTS requests_select ON public.requests;
CREATE POLICY requests_select ON public.requests
  FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS requests_insert_own ON public.requests;
CREATE POLICY requests_insert_own ON public.requests
  FOR INSERT TO authenticated WITH CHECK (ngo_id = auth.uid());

DROP POLICY IF EXISTS requests_update_own ON public.requests;
CREATE POLICY requests_update_own ON public.requests
  FOR UPDATE TO authenticated USING (ngo_id = auth.uid());

-- emergency_requests
DROP POLICY IF EXISTS emergency_select ON public.emergency_requests;
CREATE POLICY emergency_select ON public.emergency_requests
  FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS emergency_insert_own ON public.emergency_requests;
CREATE POLICY emergency_insert_own ON public.emergency_requests
  FOR INSERT TO authenticated WITH CHECK (ngo_id = auth.uid());

DROP POLICY IF EXISTS emergency_update_own ON public.emergency_requests;
CREATE POLICY emergency_update_own ON public.emergency_requests
  FOR UPDATE TO authenticated USING (ngo_id = auth.uid());

-- deliveries (volunteers update their own runs; NGOs/donors read all)
DROP POLICY IF EXISTS deliveries_select ON public.deliveries;
CREATE POLICY deliveries_select ON public.deliveries
  FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS deliveries_insert ON public.deliveries;
CREATE POLICY deliveries_insert ON public.deliveries
  FOR INSERT TO authenticated WITH CHECK (volunteer_id = auth.uid());

DROP POLICY IF EXISTS deliveries_update ON public.deliveries;
CREATE POLICY deliveries_update ON public.deliveries
  FOR UPDATE TO authenticated USING (volunteer_id = auth.uid());

-- notifications (private per user)
DROP POLICY IF EXISTS notifications_select ON public.notifications;
CREATE POLICY notifications_select ON public.notifications
  FOR SELECT TO authenticated USING (user_id = auth.uid());

DROP POLICY IF EXISTS notifications_update_own ON public.notifications;
CREATE POLICY notifications_update_own ON public.notifications
  FOR UPDATE TO authenticated USING (user_id = auth.uid());

DROP POLICY IF EXISTS notifications_delete_own ON public.notifications;
CREATE POLICY notifications_delete_own ON public.notifications
  FOR DELETE TO authenticated USING (user_id = auth.uid());

-- ============================================================
-- SEED DATA — auth accounts, profiles and sample content.
-- Seeded users can sign in immediately with Password@123:
--   donor@foodbridge.com | ngo@foodbridge.com |
--   volunteer@foodbridge.com | admin@foodbridge.com |
--   organizer@foodbridge.com
-- Every step is guarded, so re-running this file is safe.
-- ============================================================

-- 1) Supabase Auth accounts.
--    public.users.id references auth.users.id, so the auth
--    rows must exist before the profiles below. The password
--    hash is bcrypt of "Password@123" (bcrypt hashes contain
--    no two consecutive dollar signs, so it is safe inside
--    this dollar-quoted block).
--    IMPORTANT: GoTrue scans its token columns into plain Go
--    strings, so they must be '' — never NULL — or sign-in
--    fails with 500 "Database error querying schema".
DO $$
BEGIN
  INSERT INTO auth.users (
    instance_id, id, aud, role, email, encrypted_password,
    email_confirmed_at, confirmation_token, recovery_token,
    email_change, email_change_token_new, email_change_token_current,
    phone_change, phone_change_token, reauthentication_token,
    raw_app_meta_data, raw_user_meta_data, created_at, updated_at
  )
  SELECT v.instance_id, v.id, 'authenticated', 'authenticated',
         v.email, '$2b$10$BKbS5.H2z.OZsd2yF8syOOKR0rWpSMQmsQz26LrcpFw.MJ91ahexC',
         now(), '', '', '', '', '',
         '', '', '',
         '{"provider":"email","providers":["email"]}',
         v.meta, now(), now()
  FROM (VALUES
    ('00000000-0000-0000-0000-000000000000'::uuid, '11111111-1111-1111-1111-111111111111'::uuid, 'donor@foodbridge.com',      '{"name":"Spice Garden Restaurant","role":"donor"}'::jsonb),
    ('00000000-0000-0000-0000-000000000000'::uuid, '22222222-2222-2222-2222-222222222222'::uuid, 'ngo@foodbridge.com',        '{"name":"Hope Foundation","role":"ngo"}'::jsonb),
    ('00000000-0000-0000-0000-000000000000'::uuid, '33333333-3333-3333-3333-333333333333'::uuid, 'volunteer@foodbridge.com',  '{"name":"Ravi Kumar","role":"volunteer"}'::jsonb),
    ('00000000-0000-0000-0000-000000000000'::uuid, '44444444-4444-4444-4444-444444444444'::uuid, 'admin@foodbridge.com',      '{"name":"Admin User","role":"admin"}'::jsonb),
    ('00000000-0000-0000-0000-000000000000'::uuid, '55555555-5555-5555-5555-555555555555'::uuid, 'organizer@foodbridge.com',  '{"name":"Priya Sharma","role":"organizer"}'::jsonb)
  ) AS v(instance_id, id, email, meta)
  WHERE NOT EXISTS (
    SELECT 1 FROM auth.users u WHERE lower(u.email) = lower(v.email)
  )
  ON CONFLICT DO NOTHING;
EXCEPTION WHEN OTHERS THEN
  RAISE NOTICE 'FoodBridge seed: auth.users insert SKIPPED (%). Demo logins will not work until auth users exist — alternative: run "python -m app.seed".', SQLERRM;
END $$;

-- 2) Email identities, so the accounts look like normal
--    email/password sign-ups. Skipped harmlessly if the
--    identities column layout differs between versions.
DO $$
BEGIN
  INSERT INTO auth.identities (
    id, user_id, provider, provider_id, identity_data,
    last_sign_in_at, created_at, updated_at
  )
  SELECT gen_random_uuid(), u.id, 'email', u.id::text,
         jsonb_build_object('sub', u.id, 'email', u.email,
                            'email_verified', true, 'phone_verified', false),
         now(), now(), now()
  FROM auth.users u
  WHERE u.id IN (
    '11111111-1111-1111-1111-111111111111',
    '22222222-2222-2222-2222-222222222222',
    '33333333-3333-3333-3333-333333333333',
    '44444444-4444-4444-4444-444444444444',
    '55555555-5555-5555-5555-555555555555'
  )
  ON CONFLICT DO NOTHING;
EXCEPTION WHEN OTHERS THEN
  RAISE NOTICE 'Seed step 2 (auth.identities) skipped: %', SQLERRM;
END $$;

-- 3) Profiles in public.users (id matches auth.users.id)
DO $$
BEGIN
  INSERT INTO public.users (id, name, email, phone, role, organization, address, city, latitude, longitude, verified, suspended) VALUES
    ('11111111-1111-1111-1111-111111111111', 'Spice Garden Restaurant', 'donor@foodbridge.com',    '+91 98765 43210', 'donor',     'Spice Garden Restaurant', 'Andheri West, Mumbai',  'Mumbai',   19.0760, 72.8777, true,  false),
    ('22222222-2222-2222-2222-222222222222', 'Hope Foundation',         'ngo@foodbridge.com',      '+91 98765 43211', 'ngo',       'Hope Foundation',         'Karol Bagh, Delhi',     'Delhi',    28.6139, 77.2090, true,  false),
    ('33333333-3333-3333-3333-333333333333', 'Ravi Kumar',              'volunteer@foodbridge.com','+91 98765 43212', 'volunteer', NULL,                     'Indiranagar, Bangalore','Bangalore',12.9716, 77.5946, true,  false),
    ('44444444-4444-4444-4444-444444444444', 'Admin User',              'admin@foodbridge.com',    '+91 98765 43213', 'admin',     'FoodBridge',              'Madhapur, Hyderabad',   'Hyderabad',17.3850, 78.4867, true,  false),
    ('55555555-5555-5555-5555-555555555555', 'Priya Sharma',            'organizer@foodbridge.com','+91 98765 43214', 'organizer', 'Sharma Events',          'T Nagar, Chennai',      'Chennai',  13.0827, 80.2707, true,  false)
  ON CONFLICT DO NOTHING;
EXCEPTION WHEN OTHERS THEN
  RAISE NOTICE 'FoodBridge seed: public.users profiles SKIPPED (%). Without profiles the demo dashboards will be empty — alternative: run "python -m app.seed".', SQLERRM;
END $$;

-- 4) Donations
DO $$
BEGIN
  INSERT INTO public.donations (id, donor_id, title, description, food_type, quantity, unit, servings, preparation_time, expiry_date, storage_condition, pickup_address, pickup_city, pickup_lat, pickup_lng, pickup_window, status, is_emergency) VALUES
    ('d1111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'Vegetable Biryani',    'Fresh vegetable biryani from lunch service, packed hot.', 'Vegetarian',   50, 'meals', 50, '2026-09-30 10:00:00+05:30', '2026-09-30 14:00:00+05:30', 'Hot storage',  'Spice Garden, Andheri West, Mumbai', 'Mumbai',   19.1136, 72.8697, '12:00 – 14:00', 'available',  false),
    ('d2222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', 'Paneer Tikka Masala',  'Main course surplus from banquet order.',                  'Vegetarian',   30, 'meals', 30, '2026-09-30 11:00:00+05:30', '2026-09-30 15:00:00+05:30', 'Hot storage',  'Spice Garden, Andheri West, Mumbai', 'Mumbai',   19.1136, 72.8697, '13:00 – 15:00', 'matched',    false),
    ('d3333333-3333-3333-3333-333333333333', '55555555-5555-5555-5555-555555555555', 'Wedding Buffet – Mixed','Leftover buffet from a 500-guest wedding reception.',     'Non-Vegetarian',100,'meals',100, '2026-09-30 09:00:00+05:30', '2026-09-30 13:00:00+05:30', 'Room temperature','Sharma Banquet Hall, T Nagar, Chennai','Chennai', 13.0418, 80.2341, '11:00 – 13:00', 'available',  false)
  ON CONFLICT DO NOTHING;
EXCEPTION WHEN OTHERS THEN
  RAISE NOTICE 'Seed step 4 (donations) skipped: %', SQLERRM;
END $$;

-- 5) Requests
DO $$
BEGIN
  INSERT INTO public.requests (id, ngo_id, title, description, food_type, quantity_needed, unit, servings_needed, urgency, needed_by_date, delivery_address, delivery_city, status) VALUES
    ('a1111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', 'Lunch for 40 residents', 'Daily lunch support for shelter residents.', 'Vegetarian', 40, 'meals', 40, 'high',   '2026-09-30 14:00:00+05:30', 'Hope Foundation, Karol Bagh, Delhi', 'Delhi', 'pending'),
    ('a2222222-2222-2222-2222-222222222222', '22222222-2222-2222-2222-222222222222', 'Evening meals for 25',   'Light evening meals for children.',          'Any',         25, 'meals', 25, 'medium', '2026-09-30 15:00:00+05:30', 'Hope Foundation, Karol Bagh, Delhi', 'Delhi', 'fulfilled')
  ON CONFLICT DO NOTHING;
EXCEPTION WHEN OTHERS THEN
  RAISE NOTICE 'Seed step 5 (requests) skipped: %', SQLERRM;
END $$;

-- 6) Deliveries
DO $$
BEGIN
  INSERT INTO public.deliveries (id, donation_id, request_id, volunteer_id, pickup_address, delivery_address, status, assigned_at, picked_up_at, delivered_at) VALUES
    ('b1111111-1111-1111-1111-111111111111', 'd2222222-2222-2222-2222-222222222222', 'a2222222-2222-2222-2222-222222222222', '33333333-3333-3333-3333-333333333333', 'Spice Garden, Andheri West, Mumbai', 'Hope Foundation, Karol Bagh, Delhi', 'delivered', '2026-09-30 12:45:00+05:30', '2026-09-30 13:30:00+05:30', '2026-09-30 14:15:00+05:30'),
    ('b2222222-2222-2222-2222-222222222222', 'd1111111-1111-1111-1111-111111111111', 'a1111111-1111-1111-1111-111111111111', '33333333-3333-3333-3333-333333333333', 'Spice Garden, Andheri West, Mumbai', 'Hope Foundation, Karol Bagh, Delhi', 'assigned',  '2026-09-30 11:30:00+05:30', NULL, NULL)
  ON CONFLICT DO NOTHING;
EXCEPTION WHEN OTHERS THEN
  RAISE NOTICE 'Seed step 6 (deliveries) skipped: %', SQLERRM;
END $$;

-- 7) Notifications
DO $$
BEGIN
  INSERT INTO public.notifications (id, user_id, type, title, message, read) VALUES
    ('c1111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'donation', 'Donation Matched',        'Your donation ''Paneer Tikka Masala'' has been matched with Hope Foundation.', false),
    ('c2222222-2222-2222-2222-222222222222', '33333333-3333-3333-3333-333333333333', 'delivery', 'New Delivery Assignment', 'You have been assigned a delivery from Spice Garden to Hope Foundation.',    false),
    ('c3333333-3333-3333-3333-333333333333', '22222222-2222-2222-2222-222222222222', 'delivery', 'Delivery Completed',      'Your food request has been delivered successfully.',                          true)
  ON CONFLICT DO NOTHING;
EXCEPTION WHEN OTHERS THEN
  RAISE NOTICE 'Seed step 7 (notifications) skipped: %', SQLERRM;
END $$;

-- 8) Emergency requests
DO $$
BEGIN
  INSERT INTO public.emergency_requests (id, ngo_id, title, description, people_affected, quantity_needed, unit, level, needed_by_date, delivery_address, delivery_city, contact_number, reason, status) VALUES
    ('e1111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', 'Flood relief – 60 meals needed', 'Sudden influx of flood-affected families at the shelter.', 60, 60, 'meals', 'critical', '2026-09-30 18:00:00+05:30', 'Hope Foundation, Karol Bagh, Delhi', 'Delhi', '+91 98765 43211', 'Unexpected increase in shelter residents due to flood relief', 'open'),
    ('e2222222-2222-2222-2222-222222222222', '22222222-2222-2222-2222-222222222222', 'Kitchen maintenance – dinner',   'Kitchen under maintenance, dinner needs to be arranged.',    30, 30, 'meals', 'high',     '2026-09-30 20:00:00+05:30', 'Hope Foundation, Karol Bagh, Delhi', 'Delhi', '+91 98765 43211', 'Kitchen maintenance - need dinner supplies', 'open')
  ON CONFLICT DO NOTHING;
EXCEPTION WHEN OTHERS THEN
  RAISE NOTICE 'Seed step 8 (emergency_requests) skipped: %', SQLERRM;
END $$;

-- Tell PostgREST to pick up the new schema
NOTIFY pgrst, 'reload schema';
