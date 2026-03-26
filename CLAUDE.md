# CLAUDE.md – ENAPO Project Configuration

## What this project is

ENAPO is a mobile-first collaborative group travel planning app built with Expo, React Native, Expo Router, and TypeScript. It solves one core problem: turning chaotically shared travel links into structured group decisions.

**Tagline:** "Where groups decide."

**Product thesis:** Group trips fail in the planning phase not due to lack of interest, but due to unstructured coordination. ENAPO transforms shared travel links into comparable options and helps groups make decisions together.

**What ENAPO is NOT:** Not a booking platform, not a messenger, not an itinerary builder, not a meta-search engine, not a cost-splitting tool, not an inspiration feed.

## Lean Startup Context

This is an MVP following Build-Measure-Learn methodology. Every feature must map to a testable hypothesis. If a feature does not directly contribute to validating the core loop, it does not get built.

**Core Loop (5 steps, must work in 90 seconds):**
1. Create trip (< 10 seconds, 1-2 taps)
2. Invite group (share link via WhatsApp/iMessage, no app install needed to join)
3. Share links (paste URL → auto-parsed structured card in 1-2 seconds)
4. Compare & vote (swipe/tap vote, deadlines, live results)
5. Make decision visible (Decision Card → Decision Board with progress)

**North Star Metric:** Decision Completion Rate (% of trips with ≥1 documented decision)

**Key Metrics:** Time-to-First-Decision, Active participants per trip (target: 3+), Invite acceptance rate (target: >60%), Second-trip rate (organic, unprompted)

**Vanity Metrics (DO NOT optimize):** Downloads, registrations, page views, affiliate revenue (v1), premium conversion (v1)

## What matters most

- speed to MVP
- readability and consistency
- low architectural debt
- Expo compatibility
- mobile-first UX
- validated learning over feature completeness

## Tech Stack

| Component | Technology |
|-----------|-----------|
| Mobile App | React Native (Expo SDK 54), TypeScript, Expo Router |
| Backend / API | Supabase (PostgreSQL + Auth + Realtime) |
| Real-Time | Supabase Realtime (votes, options, decisions – all live) |
| Link Parsing | Supabase Edge Function + OG-tag scraping |
| State (global) | Zustand |
| State (server) | TanStack Query (React Query) |
| Animations | Reanimated + Gesture Handler |
| Push Notifications | expo-notifications (later: OneSignal) |
| Analytics | PostHog or Mixpanel (event-based) |
| Monitoring | Sentry |
| CI/CD | GitHub Actions + EAS Build |

## Repo structure

```
enapo/
├── app/                          # Expo Router routes (KEEP THIN)
├── src/
│   ├── components/
│   │   ├── ui/                   # Design system primitives (GlassCard, Button)
│   │   ├── trip/                 # TripCard, TripHeader
│   │   ├── options/              # OptionCard, OptionsList
│   │   ├── voting/               # PollCard, VoteSwiper
│   │   ├── decision/             # DecisionBoard, DecisionCard
│   │   └── common/               # Avatar, AvatarStack, ProgressDots
│   ├── features/                 # Business logic per domain
│   │   ├── auth/
│   │   ├── trips/
│   │   ├── options/
│   │   ├── voting/
│   │   └── decisions/
│   ├── hooks/                    # Shared custom hooks
│   ├── stores/                   # Zustand stores
│   ├── lib/                      # Supabase client, query client, utils
│   ├── constants/                # Design tokens, app constants
│   ├── services/                 # Backend integrations
│   └── types/                    # Shared TypeScript types
├── supabase/
│   ├── migrations/               # SQL migrations
│   └── functions/parse-link/     # Link parsing Edge Function
├── docs/                         # Product & architecture docs
├── .claude/                      # Skills, commands, agents
├── CLAUDE.md                     # This file
└── AGENTS.md                     # Agent instructions
```

## How to work in this repo

1. Read this file first
2. Inspect existing patterns before creating new ones
3. Keep route files in app/ thin
4. Business logic in src/features/
5. Reusable UI in src/components/ui/
6. Prefer Expo-first solutions
7. Do not over-engineer
8. Every PR references a hypothesis and a metric
9. Update this file when architecture changes

## Database Schema

```sql
users         (id, name, email, avatar_url, created_at)
trips         (id, name, date_from, date_to, invite_code, created_by, status, created_at)
trip_members  (trip_id, user_id, role[organizer|member], joined_at)
options       (id, trip_id, url, title, image_url, price, rating, source_domain,
               category[accommodation|flight|activity|car|other], notes, added_by,
               status[active|decided|rejected], created_at)
polls         (id, trip_id, title, category, deadline, status[open|closed], created_by)
poll_options  (id, poll_id, option_id)
votes         (id, poll_id, poll_option_id, user_id, value[yes|no|maybe], created_at)
              UNIQUE(poll_id, user_id)
comments      (id, trip_id, option_id?, poll_id?, user_id, text, created_at)
```

All tables use RLS. Only trip members can access trip data.

## Design System – Liquid Glass

### Colors
- Primary: #1A9E8F (Teal), Accent/CTA: #E8734A (Coral)
- Decided: #1A9E8F, Voting/Open: #E8A94A (Amber)
- Background: #F0EDE8 (Warm off-white)
- Glass: rgba(255,255,255,0.55) + backdrop-blur(20px)
- Text: #1A1A1A / #6B6B6B / #9B9B9B

### Glass Levels
- Nav/Modals: opacity 0.7, blur 20px
- Cards: opacity 0.55, blur 20px
- Elevated: opacity 0.75, blur 24px
- Accent (Decision Board): primary at 0.12, blur 16px

### Layout Rules
- 4px grid, 16px screen padding, 16px card padding
- Border-radius: 16px cards, 10px buttons, full-round avatars
- Bottom nav: max 4 tabs (Trips | Options | Votes | Decisions)
- Typography: heading 20/700, subtitle 15/600, body 13/400

## Link Parsing (Technical Wedge)

1. User pastes URL → Edge Function
2. Extract OG tags (title, image, description)
3. Domain-specific heuristics (Booking, Airbnb, Skyscanner, GetYourGuide, etc.)
4. Auto-categorize via domain mapping
5. **CRITICAL: Graceful Degradation** – parse fail → show URL + domain + manual title
6. **THE LOOP MUST NEVER BLOCK**
7. Performance: < 2 seconds

## Analytics Events (from Day 1)

trip_created, invite_sent, invite_accepted, option_added, poll_created, vote_cast, decision_made (NORTH STAR), booking_click

## Engineering mindset

- simple beats clever
- explicit beats magical
- consistent beats novel
- no feature without a hypothesis
- graceful degradation everywhere

## Coding conventions

- TypeScript strict, no `any`
- Functional components only
- Zustand = global, React Query = server, useState = local
- StyleSheet.create() with tokens from constants/tokens.ts
- File naming: kebab-case. Components: PascalCase. Hooks: camelCase with use-
- Conventional commits: feat:, fix:, chore:, docs:

## Expo mindset

Expo-first always. Prefer Expo APIs and compatible packages. Do not introduce native complexity without strong justification.

## What NOT to build in v1

Booking, cost splitting, itinerary planner, document hub, social features, third-party API deps, full chat, AI recommendations.

## Sprint Reference

| Sprint | Weeks | Deliverable |
|--------|-------|-------------|
| 1 | 6-7 | Trip creation + invite flow |
| 2 | 8-9 | Link parsing + option cards |
| 3 | 10-11 | Voting + decision board |

## Performance targets

Trip creation < 10s, Link parsing < 2s, App start < 1.5s, Vote update < 500ms

## Commands

```bash
npx expo start              # Dev server
npx expo start --ios        # iOS sim
supabase start              # Local Supabase
supabase db reset           # Reset DB
supabase migration new <n>  # New migration
npm run lint                # ESLint
npx tsc --noEmit            # Type check
```
