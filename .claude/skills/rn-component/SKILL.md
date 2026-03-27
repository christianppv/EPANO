---
name: rn-component
description: Creates React Native components following EPANO's Liquid Glass design system with TypeScript, tokens, and state management patterns. Use when building any new UI component.
---
When creating React Native components for EPANO:
1. Import tokens from @/constants/tokens (colors, spacing, radius, typography, shadows, glass)
2. Liquid Glass: BlurView for glass, 16px card radius, 10px buttons, soft shadows
3. TypeScript strict: Props interface, no any, default export
4. kebab-case files, PascalCase components, one per file
5. StyleSheet.create() at bottom, only reference tokens
6. State: useState=local, Zustand=global, React Query=server
7. Reanimated for animations (<300ms), Gesture Handler for swipe
8. ALWAYS handle missing data with graceful fallbacks
