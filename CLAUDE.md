# CLAUDE.md – ENAPO Project Configuration

## What this project is

ENAPO is a mobile-first collaborative group travel planning app built with Expo, React Native, Expo Router, and TypeScript. It solves one core problem: turning chaotically shared travel links into structured group decisions.

**Tagline:** "Where groups decide."

**Product thesis:** Group trips fail in the planning phase not due to lack of interest, but due to unstructured coordination. ENAPO transforms shared travel links into comparable options and helps groups make decisions together.

**What ENAPO is NOT:** Not a booking platform, not a messenger, not an itinerary builder, not a meta-search engine, not a cost-splitting tool, not an inspiration feed.

---

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

---

## Auth Strategy

Auth is minimal by design. Every extra step before the first Wow-Moment costs ~20–30% drop-off.

### Organizer (trip creator)
- **Social Login only:** Apple Sign-In + Google Sign-In
- No email/password, no confirmation email, no onboarding carousel
- Name and avatar pulled automatically from the social account
- Persistent identity required from Day 1 — needed for Second-Trip-Rate tracking

```
──────────────────────────────
     Willkommen bei ENAPO
  Plane Reisen. Als Gruppe.
──────────────────────────────

  [ G  Mit Google starten  ]
  [   Mit Apple starten   ]

──────────────────────────────
```

That's the entire login screen. Nothing else.

### Invited member (joins via link)
- Opens Web Invite URL in browser — **no app install required, no account required**
- Single input screen: first name only, stored in browser/local session
- No email, no password, no profile photo in v1
- Full account creation only triggered if the member later wants to create their own trip

```
──────────────────────────────
  Lissabon Sommer 🇵🇹
  Mia hat dich eingeladen

  Wie sollen wir dich nennen?
  [ Max                      ]

      → Zum Trip beitreten
──────────────────────────────
```

**Principle:** Show value first, ask for commitment second. This is the Dropbox pattern.

---

## Feature Priority — v1

Every feature is evaluated against one question: **does it directly contribute to the Decision Completion Rate?**

### Sprint 1 — Trip & Invite (Weeks 6–7)

| Feature | Why |
|---|---|
| Social Login (Google + Apple) | Persistent organizer identity — required for North Star tracking |
| Name input for invited members | Social visibility in votes/options — core to group feel |
| Trip creation (name + optional dates) | Entry point to the core loop |
| Invite link generation + deep link handling | Growth loop start — must be measured from day 1 |
| Web landing page for invite (Next.js) | Members join without app install |
| Trip member list + realtime sync | Group awareness |
| Trip list screen + Progress Dots | Orientation across trips |

### Sprint 2 — Link Parsing & Options (Weeks 8–9)

| Feature | Why |
|---|---|
| URL input field + Share Extension (iOS/Android) | Primary input mechanism |
| Edge Function: OG-tag scraping | The Wow-Moment — link becomes structured card |
| Option cards (title, image, price, domain, category) | Visual structure replaces chat chaos |
| Auto-categorization (accommodation/flight/activity) | Instant smart grouping, no manual sorting |
| Manual edit fallback (title, price, notes) | Graceful degradation — loop must never block |
| Option list with type filters | Essential once a trip has 4+ options |
| Thumbs Up / Down on option card | Low-friction inline reaction — not a replacement for polls |
| Decision Board mini (in trip dashboard) | Progress feeling — "we're getting somewhere" |
| Filter Pills (All / Accommodation / Flight / Activity) | Required for usability at scale |

### Sprint 3 — Voting & Decision Board (Weeks 10–11)

| Feature | Why |
|---|---|
| Formal poll creation from existing options (1-tap) | The decision mechanism — core to North Star |
| Vote interface (swipe or tap) | Completion of the core loop |
| Live vote results (realtime) | Group feedback loop |
| "Who has voted" + avatar stack | Social nudge without push notification |
| Mark option as decided | The North Star event: `decision_made` |
| Decision Board (Decided / Open / No proposals) | Trip status at a glance — no reconstruction needed |
| Comments on options (not a trip chat) | Context for decisions — scoped, not a messenger |
| Push notifications (new option, vote started, result) | Activates passive members |

### v1.1 — After Beta Signal

| Feature | Condition |
|---|---|
| Poll deadline + auto-close logic | Only if passive member activation is insufficient in beta |
| Nudge system (smart reminders) | Only if active participants/trip stays below 3 |

### v2 — After PMF

| Feature | Reason deferred |
|---|---|
| Full trip chat | ENAPO must not become a messenger. Group chats on WhatsApp anyway. Comments on options cover the context need. |
| Cost splitting | Second product area. Splitwise exists and is excellent. |
| Itinerary / day planner | Post-decision phase. Wanderlog covers this better. |
| AI recommendations | Creates more options, not fewer. Does not solve the decision problem. |
| Booking / checkout | Massive operational complexity before core is validated. |
| Document hub | Post-decision, not essential for the wedge. |
| Social / community features | Distraction from the collaborative core. |

---

## Tech Stack

| Component | Technology |
|-----------|-----------|
| Mobile App | React Native (Expo SDK 54), TypeScript, Expo Router |
| Web (Invite Flow) | Next.js (React) — SSR, no app install needed for members |
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

---

## Repo Structure

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

---

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

---

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

### Key UX Screens (from design concept)
- **Trip List:** Progress Dots per trip (green = decided, amber = voting, grey = empty) — always visible
- **Trip Dashboard:** 3 tabs — Options (primary), Votes (secondary), Chat tab removed from v1
- **Option Card:** Emoji icon + title + domain + price + rating + inline thumbs up/down for active options
- **Decision Board Mini:** Always pinned in trip dashboard header (Decided / Voting / Open / Empty per category)
- **Poll Screen:** Avatar stack showing who voted, "X noch nicht abgestimmt" social nudge
- **Invite Landing (Web):** Trip name + member count + single name input → join. Works without app.

---

## Link Parsing (Technical Wedge)

1. User pastes URL → Edge Function
2. Extract OG tags (title, image, description)
3. Domain-specific heuristics (Booking, Airbnb, Skyscanner, GetYourGuide, etc.)
4. Auto-categorize via domain mapping
5. **CRITICAL: Graceful Degradation** – parse fail → show URL + domain + manual title field
6. **THE LOOP MUST NEVER BLOCK**
7. Performance target: < 2 seconds

Top 10 domains cover ~80% of links. Build heuristics for these first:
`booking.com`, `airbnb.com`, `skyscanner.de/net`, `getyourguide.com`, `hostelworld.com`, `google.com/flights`, `kayak.com`, `tripadvisor.com`, `rentalcars.com`, `maps.google.com`

---

## Analytics Events (from Day 1, non-negotiable)

| Event | What it measures |
|---|---|
| `trip_created` | Funnel entry |
| `invite_sent` | Growth loop start |
| `invite_accepted` | Invite acceptance rate |
| `option_added` | Core activity #1 |
| `poll_created` | Transition to decision |
| `vote_cast` | Group engagement |
| `decision_made` | **NORTH STAR** |
| `booking_click` | Monetization funnel (post-v1) |

No analytics setup = beta is worthless. Ship this before any beta user touches the app.

---

## Engineering Mindset

- simple beats clever
- explicit beats magical
- consistent beats novel
- no feature without a hypothesis
- graceful degradation everywhere

---

## Coding Conventions

- TypeScript strict, no `any`
- Functional components only
- Zustand = global, React Query = server, useState = local
- StyleSheet.create() with tokens from constants/tokens.ts
- File naming: kebab-case. Components: PascalCase. Hooks: camelCase with `use`-prefix
- Conventional commits: `feat:`, `fix:`, `chore:`, `docs:`

---

## Expo Mindset

Expo-first always. Prefer Expo APIs and compatible packages. Do not introduce native complexity without strong justification.

---

## Performance Targets

| Action | Target |
|---|---|
| App start | < 1.5s |
| Trip creation | < 10s |
| Link parsing | < 2s |
| Vote update (realtime) | < 500ms |

---

## Sprint Reference

| Sprint | Weeks | Deliverable | Gate |
|--------|-------|-------------|------|
| 1 | 6–7 | Social Login + Trip creation + Invite flow + Member name input | A member can join a trip via web link with name only, no app install |
| 2 | 8–9 | Link parsing + Option cards + Filters + Decision Board mini | Paste a Booking.com link → structured card appears in < 2s |
| 3 | 10–11 | Formal polls + Vote UI + "Who voted" + Decision marking + Comments on options + Push notifications | Complete core loop end-to-end: trip → link → vote → decision |

## Design Reference

The canonical UX reference is `docs/ux-reference/enapo-ux-concept.jsx`.
Before building any screen or component, read this file first.
All colors, glass effects, spacing, and component patterns are defined there.
Do not invent styles — extract from the reference.
```

**3. Design Tokens als eigene Datei extrahieren**

Lass Claude Code als allererste Aufgabe die Tokens aus dem Entwurf extrahieren:
```
src/constants/tokens.ts
```

Das ist ein konkreter erster Prompt für Claude Code.

---

## Die konkreten Prompts, die funktionieren

**Schritt 1 — Tokens extrahieren:**
```
Read docs/ux-reference/enapo-ux-concept.jsx and extract ALL design 
tokens into src/constants/tokens.ts as a typed TypeScript object.
Include: colors, glass levels (opacity + blur values), border-radius, 
spacing, typography sizes and weights, shadow definitions.
Every value must come from the reference file — no invented values.
```

**Schritt 2 — GlassCard als erste Komponente:**
```
Read docs/ux-reference/enapo-ux-concept.jsx.
Implement the GlassCard component from the reference as a React Native 
component in src/components/ui/glass-card.tsx.
Use tokens from src/constants/tokens.ts.
The component must accept: children, style override, onPress, hover state.
Match the reference exactly: backdrop blur, border, shadow, border-radius.
```

**Schritt 3 — Screen für Screen:**
```
Read docs/ux-reference/enapo-ux-concept.jsx — specifically the 
TripListScreen component.
Implement this screen in app/(tabs)/index.tsx using React Native.
Use existing components from src/components/ui/.
Match the layout exactly: greeting header, + button, trip cards with 
ProgressDots and AvatarStack.
Data is hardcoded for now — Supabase integration comes later.
```

---

## Commands

```bash
npx expo start              # Dev server
npx expo start --ios        # iOS simulator
supabase start              # Local Supabase
supabase db reset           # Reset DB
supabase migration new <n>  # New migration
npm run lint                # ESLint
npx tsc --noEmit            # Type check
```

---

## Known Dev Limitations

### Auth: Magic Link only (temporary)
Google OAuth and Apple Sign-In require a Dev Build (Apple Developer Account, $99/year).
Currently using Magic Link (email/password) as a temporary workaround for development.

When Apple Developer Account is available:
- Run `eas build --profile development --platform ios`
- Re-add `signInWithGoogle` and `signInWithApple` in `features/auth/use-sign-in.ts`
- Add Google OAuth client ID to app.config.ts
- Add Apple Sign-In entitlement

Do NOT attempt to fix Google/Apple OAuth in Expo Go — it is a known Expo Go limitation
with WebCrypto that cannot be patched.

---

## How to Work in This Repo

1. Read this file first
2. Inspect existing patterns before creating new ones
3. Keep route files in `app/` thin — logic belongs in `src/features/`
4. Reusable UI in `src/components/ui/`
5. Prefer Expo-first solutions
6. Do not over-engineer
7. Every PR references a hypothesis and a metric
8. Update this file when architecture or product decisions change