# CLAUDE.md

## What this project is
EPANO is a group travel planning app.
It helps groups align on destinations, ideas, voting, rough shared costs, and itinerary.

## What matters most
- speed to MVP
- readability
- consistency
- low architectural debt
- Expo compatibility
- mobile-first UX

## Repo mindset
This repo should stay understandable and maintainable for one founder.
Optimize for clarity, speed, and sustainable iteration with AI coding agents.

## How to work in this repo
1. inspect existing patterns before creating new ones
2. keep route files thin
3. keep business logic out of screens
4. prefer feature folders over scattered helpers
5. prefer Expo-first solutions
6. do not over-engineer
7. update docs when architecture changes
8. keep EAS Build compatibility in mind

## Product mindset
EPANO solves group coordination chaos.
The enemy is:
- fragmented planning
- indecision
- lost chat context
- unclear next steps
- weak cost visibility

The app is not a booking platform in the MVP.

## Engineering mindset
- simple beats clever
- explicit beats magical
- consistent beats novel
- one clean pattern beats three half-good patterns

## Expo mindset
This is an Expo app first.
Prefer Expo APIs, Expo-compatible packages, and patterns that keep the managed/prebuild workflow clean.
Do not drift into unnecessary native complexity.

## Refactoring rule
When refactoring:
- preserve behavior first
- improve structure second
- explain tradeoffs if introducing larger changes

## Output preference
When making substantial changes:
- summarize what changed
- note risks or follow-ups
- mention docs that should be updated