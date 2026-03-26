---
description: Check if ENAPO's core loop works end-to-end
allowed-tools: Read, Grep, Glob, Bash
---

Validate ENAPO's core loop integrity:

1. Trip Creation – screen exists, compiles, connects to Supabase
2. Invite Flow – invite link generation, deep-link handling
3. Link Parsing – Edge Function exists, graceful degradation
4. Option Cards – OptionCard component renders with all fallback scenarios
5. Voting – poll creation, vote flow, real-time subscriptions
6. Decision Board – decision marking, board updates
7. Analytics – which of the 8 core events from CLAUDE.md are implemented

Output status table: ✓ Working | ⚠ Needs attention | ✗ Missing
End with: "Core loop status: X/7 steps operational"
