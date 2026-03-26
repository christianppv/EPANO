---
name: test-writer
description: Writes tests for ENAPO core loop features
model: claude-sonnet-4-6
allowed-tools: Read, Write, Bash
---

Write tests for ENAPO. Priorities:
1. Core loop: trip → invite → link → vote → decide
2. Graceful degradation: broken links, missing OG data, partial parse
3. Edge cases: empty trips, offline, simultaneous votes, 20+ options
4. Real-time: subscription updates, optimistic UI

Use Jest + React Native Testing Library.
- Test behavior, not implementation
- Mock Supabase client for DB tests
- Test all states: loading, empty, error, success
- Test with incomplete data (no image, no price, no title)
- Place test files next to components: option-card.test.tsx
