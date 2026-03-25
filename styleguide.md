# EPANO Style Guide

## General principles
- Keep the code boring, readable, and explicit.
- Prefer consistency over cleverness.
- Prefer simple Expo-compatible solutions.
- Keep the codebase easy to understand for a solo founder.

## Expo and routing
- Use Expo Router.
- Keep route files in `app/` thin.
- Route files should compose screens and connect feature logic, not contain heavy domain logic.
- Do not place API calls or complex validation directly inside route files.

## Folder responsibilities
- `app/`: routes and screen composition
- `src/features/`: feature/domain logic
- `src/components/ui/`: reusable UI primitives
- `src/components/common/`: reusable app-level components
- `src/lib/`: shared utilities, constants, errors
- `src/services/`: backend/service integrations
- `docs/`: product and architecture source of truth

## Naming
- Prefer domain names over vague technical names.
- Good:
  - `trip-form-schema.ts`
  - `useCreateTrip.ts`
  - `trip-member-list.tsx`
- Bad:
  - `helpers.ts`
  - `dataStuff.ts`
  - `manager.ts`

## Components
- Keep components small and composable.
- Separate presentational components from feature logic when practical.
- Reuse existing button, card, modal, and form patterns before creating new ones.
- Avoid duplicate primitives.

## Hooks
- Hooks should have a focused responsibility.
- Feature hooks belong in the feature folder.
- Shared hooks go in shared folders only if they are truly shared.

## TypeScript
- Avoid `any`.
- Prefer explicit types for domain entities.
- Keep shared types in shared locations only when truly cross-feature.
- Validate external input before trusting it.

## Validation
- Validation logic should live close to the feature.
- Keep schemas small and explicit.
- Do not duplicate the same validation logic across multiple files.

## State management
- Remote data belongs in feature API/hooks layers.
- Local UI state belongs in dedicated stores only when needed.
- Avoid mixing too many patterns.

## Error handling
- Handle expected failure states explicitly.
- Show helpful UI states for loading, empty, and error cases.
- Do not swallow errors silently.

## Testing expectations
- Add tests when logic becomes non-trivial.
- Prefer testing behavior over implementation details.
- Keep tests readable.
- Do not add fake complexity just to satisfy testing rituals.

## Dependency policy
- Do not add a package casually.
- Prefer Expo/platform capabilities first.
- Prefer Expo-compatible libraries.
- Explain why a dependency is justified.

## Documentation
- Update docs when architecture, folder structure, or domain concepts change.
- The repo should remain understandable without relying on chat history.