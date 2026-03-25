# EPANO

EPANO is a mobile-first group travel planning app built with Expo, React Native, Expo Router, and TypeScript.

## Goal
EPANO helps groups of friends plan trips together with less chaos, less indecision, and less messy chat coordination.

## Core MVP
The MVP focuses on lightweight group trip coordination:
- create a trip
- invite friends
- collect trip suggestions
- vote on ideas
- estimate shared expenses
- create a simple itinerary

## What EPANO is not
EPANO is not:
- a booking engine
- a flight or hotel comparison tool
- a public travel social network
- a full AI travel concierge in the MVP

## Stack
- Expo
- React Native
- TypeScript
- Expo Router

## Architecture principles
- Expo-first workflow
- thin route files in `app/`
- business logic in `src/features`
- reusable UI in `src/components/ui`
- shared helpers in `src/lib`
- simple patterns over clever abstractions
- keep the repo readable for a solo founder

## Repo structure
- `app/` contains Expo Router route files and screen composition
- `src/features/` contains domain logic
- `src/components/` contains reusable components
- `src/lib/` contains shared utilities and helpers
- `docs/` contains product and architecture source-of-truth documentation
- `.cursor/rules/` contains Cursor project rules
- `.claude/agents/` contains Claude Code subagents
- `AGENTS.md` contains repo instructions for coding agents
- `CLAUDE.md` contains Claude project memory and working style

## Working rules
Before making major changes:
1. read `README.md`
2. read `AGENTS.md`
3. read `CLAUDE.md`
4. read the most relevant file in `docs/`
5. inspect the nearest existing implementation pattern

## Product focus
The main problem EPANO solves is group coordination friction:
- too many chat messages
- unclear decisions
- missing structure
- lost context
- vague expense expectations

## Expo-first rule
This project should remain compatible with the Expo workflow for as long as possible.
Prefer Expo-compatible libraries and Expo APIs before considering custom native solutions.
Do not introduce native complexity casually.