# AGENTS.md

## Project

ENAPO is a mobile-first group travel planning app built with Expo, React Native, Expo Router, and TypeScript. Backend: Supabase (PostgreSQL + Auth + Realtime + Edge Functions).

## Mission

Help groups plan trips together by turning chaotically shared travel links into structured, votable options and clear group decisions.

## Core Loop

Every feature must serve this loop: Create trip → Invite group → Share links → Compare & vote → Make decision visible.

## Product scope (v1 MVP)

Included: authentication (Supabase Auth), trip creation, inviting members (share link), collecting options (link parsing), voting (polls), decision board.

Excluded: flight/hotel booking, payment processing, cost splitting, public social feed, AI concierge, itinerary planning, full in-app chat, heavy native customization.

## Architecture rules

- Expo-first solutions always
- Expo Router for routing
- Keep files in `app/` thin (route composition only)
- Business logic in `src/features/`
- Reusable UI in `src/components/ui/`
- Shared helpers in `src/lib/`
- Domain logic close to its feature
- Zustand for global state, TanStack Query for server state
- Supabase for backend (Auth, DB, Realtime, Edge Functions)
- RLS on every table

## Database

Core tables: users, trips, trip_members, options, polls, poll_options, votes, comments. All with Row Level Security. See CLAUDE.md for full schema.

## Design System

Liquid Glass: translucent cards with backdrop-blur, warm off-white background, teal primary (#1A9E8F), coral accent (#E8734A). See CLAUDE.md for full design tokens.

## Expo rules

- Prefer Expo SDK capabilities before third-party native libraries
- Prefer Expo-compatible packages
- Do not introduce bare React Native patterns without strong reason
- Keep EAS Build compatibility

## TypeScript rules

- Strict mode, no `any`
- Explicit domain types
- Validate external input
- Types in src/types/ for shared, in feature folders for feature-specific

## Code style

- Simple over clever, consistent over novel
- Keep functions small
- Name by domain meaning
- Reuse nearest existing pattern
- kebab-case files, PascalCase components, camelCase hooks

## File placement

- Routes: `app/`
- UI primitives: `src/components/ui/`
- Feature components: `src/components/<domain>/`
- Feature logic: `src/features/<domain>/`
- Shared hooks: `src/hooks/`
- Stores: `src/stores/`
- Utilities: `src/lib/`
- Services: `src/services/`
- Types: `src/types/`
- Design tokens: `src/constants/tokens.ts`
- Docs: `docs/`

## Done criteria

1. Code works and compiles
2. Types correct (no `any`)
3. No dead code left
4. Existing patterns respected
5. Graceful degradation for link parsing
6. Analytics events tracked (if core loop feature)
7. Docs updated if structure changed

## Agent behavior

Before major edits: read CLAUDE.md, inspect nearest implementation. When uncertain: choose simpler solution, keep Expo compatibility, keep it founder-readable.

## Key reference

CLAUDE.md is the Single Source of Truth. It contains: tech stack, database schema, design system, analytics events, sprint plan, coding conventions, and performance targets.
