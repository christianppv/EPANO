---
description: Scaffold a new screen for the EPANO mobile app
argument-hint: [screen-name]
---

Create a new screen called $ARGUMENTS for the EPANO mobile app:

1. Create the route file in app/ following Expo Router conventions (thin, composing only)
2. Create the screen component in src/components/ following the rn-component skill
3. Use Liquid Glass design tokens from src/constants/tokens.ts
4. Add navigation if needed in the existing layout
5. Include loading, empty, and error states
6. Add the relevant analytics event from CLAUDE.md if this screen touches the core loop
7. Use TypeScript strict – no any
8. Follow existing patterns in the codebase
