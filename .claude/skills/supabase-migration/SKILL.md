---
name: supabase-migration
description: Creates Supabase database migrations with RLS policies, indexes, and type generation. Use when modifying the database schema.
---
When creating Supabase migrations for EPANO:
1. Run: supabase migration new <descriptive-name>
2. snake_case tables (plural), singular_id for foreign keys
3. Always add created_at timestamptz default now()
4. RLS mandatory on EVERY table - no exceptions
5. Policy pattern: auth.uid() checked against trip_members
6. After: supabase db reset, then gen types to src/types/database.ts
7. Indexes: idx_tablename_column for frequent queries
8. Realtime: add table to publication if live updates needed
