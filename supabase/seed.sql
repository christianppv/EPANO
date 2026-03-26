-- ═══════════════════════════════════════════════════
-- ENAPO Development Seed Data
-- Run with: npx supabase db reset (applies migrations + seed)
-- ═══════════════════════════════════════════════════

-- NOTE: Seed data requires auth users to exist first.
-- In local development, create test users via Supabase Dashboard
-- or use the Auth API. The UUIDs below are placeholders.
--
-- After creating test users, replace these UUIDs:
--   user_mia:   <replace with actual auth.users UUID>
--   user_tom:   <replace with actual auth.users UUID>
--   user_lea:   <replace with actual auth.users UUID>
--   user_jan:   <replace with actual auth.users UUID>

-- For now, this file serves as a template.
-- Uncomment and fill in UUIDs after setting up auth users.

/*
-- ─── TRIPS ─────────────────────────────────────────
INSERT INTO trips (id, name, date_from, date_to, invite_code, created_by, status) VALUES
  ('11111111-1111-1111-1111-111111111111', 'Lissabon Sommer 🇵🇹', '2026-07-15', '2026-07-22', 'abc123', '<user_mia_uuid>', 'active'),
  ('22222222-2222-2222-2222-222222222222', 'Barcelona Weekend 🇪🇸', '2026-05-08', '2026-05-11', 'def456', '<user_mia_uuid>', 'active');

-- ─── TRIP MEMBERS ──────────────────────────────────
INSERT INTO trip_members (trip_id, user_id, role) VALUES
  ('11111111-1111-1111-1111-111111111111', '<user_mia_uuid>', 'organizer'),
  ('11111111-1111-1111-1111-111111111111', '<user_tom_uuid>', 'member'),
  ('11111111-1111-1111-1111-111111111111', '<user_lea_uuid>', 'member'),
  ('11111111-1111-1111-1111-111111111111', '<user_jan_uuid>', 'member');

-- ─── OPTIONS ───────────────────────────────────────
INSERT INTO options (trip_id, url, title, image_url, price, rating, source_domain, category, added_by, status) VALUES
  ('11111111-1111-1111-1111-111111111111', 'https://www.booking.com/hotel/pt/alfama-loft', 'Airbnb Alfama – Altstadt-Loft', NULL, '89€/Nacht', '4.8', 'booking.com', 'accommodation', '<user_mia_uuid>', 'active'),
  ('11111111-1111-1111-1111-111111111111', 'https://www.hostelworld.com/pwa/hosteldetails/lisboa-central', 'Hostel Lisboa Central', NULL, '24€/Nacht', NULL, 'hostelworld.com', 'accommodation', '<user_tom_uuid>', 'active'),
  ('11111111-1111-1111-1111-111111111111', 'https://www.getyourguide.com/lisbon/food-tour', 'Time Out Market Food Tour', NULL, '35€/Person', '4.9', 'getyourguide.com', 'activity', '<user_lea_uuid>', 'decided'),
  ('11111111-1111-1111-1111-111111111111', 'https://www.skyscanner.de/flights/fra/lis', 'TAP Air – FRA→LIS', NULL, '127€ Hin+Rück', NULL, 'skyscanner.de', 'flight', '<user_jan_uuid>', 'decided');
*/
