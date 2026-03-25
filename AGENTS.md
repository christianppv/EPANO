# AGENTS.md

## Project
EPANO is a mobile-first group travel planning app built with Expo, React Native, Expo Router, and TypeScript.

## Mission
Help groups plan trips together without chaos, unclear responsibilities, or endless chat indecision.

## Product scope
The MVP includes:
- authentication
- trip creation
- inviting members
- collecting suggestions
- voting
- rough expense planning
- simple itinerary planning

The MVP excludes:
- flight booking
- hotel booking
- payment processing
- public social feed
- advanced AI concierge flows
- heavy native customization

## Core architecture rules
- Use Expo-first solutions whenever possible.
- Use Expo Router for routing.
- Keep files in `app/` thin and focused on route composition and screen rendering.
- Put business logic in `src/features`.
- Put reusable UI primitives in `src/components/ui`.
- Put shared helpers in `src/lib`.
- Keep domain logic close to the feature it belongs to.
- Avoid duplicate domain types across features.

## Expo rules
- Prefer Expo SDK capabilities before third-party native-heavy libraries.
- Prefer libraries that are compatible with Expo and EAS Build.
- Do not recommend or introduce bare React Native patterns unless there is a strong reason.
- Treat native escalation as an exception, not the default.

## State rules
- Remote data should live in feature-level hooks and service/api layers.
- Local UI state should live in local stores only when needed.
- Do not introduce multiple competing state patterns without strong justification.

## Dependency rules
- Do not add a dependency unless it solves a real problem.
- Prefer existing Expo/platform capabilities first.
- Explain why any new dependency is needed.
- Avoid libraries that create unnecessary native complexity.

## TypeScript rules
- Use strict TypeScript.
- Avoid `any` unless there is no realistic alternative.
- Prefer explicit domain types.
- Validate external input before trusting it.
- Keep types narrow and boring.

## Code style
- Prefer simple code over clever code.
- Prefer consistency over novelty.
- Keep functions small.
- Name files and symbols by domain meaning.
- Reuse the nearest existing pattern before inventing a new one.

## File placement rules
- Routes and screens go in `app/`
- Shared UI goes in `src/components/ui`
- Shared app components go in `src/components/common`
- Feature-specific code goes in `src/features/<feature>`
- Global utilities go in `src/lib`
- Backend/service wrappers go in `src/services`
- Architecture and product decisions go in `docs/`

## Done criteria
A task is not done unless:
1. the code works
2. the code compiles
3. types remain correct
4. no dead code is left behind
5. the nearest existing pattern was respected
6. docs are updated if structure or architecture changed

## Agent behavior
Before major edits:
- read `README.md`
- read `CLAUDE.md`
- read the most relevant docs file
- inspect the nearest existing implementation

When uncertain:
- choose the simpler solution
- keep Expo compatibility
- keep the repo founder-readable