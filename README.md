# EPANO

**Where groups decide.** A mobile-first group travel planning app that turns chaotic link sharing into structured group decisions.

## The Problem

Friends planning trips together use WhatsApp to share links and try to agree. Links get lost, decisions drag on, one person does all the work.

## Core Loop

1. **Create trip** – Name it, done (< 10 seconds)
2. **Invite friends** – Share link, no app install needed
3. **Share links** – Paste URL → auto-structured option card
4. **Vote** – Swipe/tap to vote, live results
5. **Decide** – Decision Board shows what's settled

## Stack

- **App:** Expo (React Native) + TypeScript + Expo Router
- **Backend:** Supabase (PostgreSQL, Auth, Realtime, Edge Functions)
- **State:** Zustand (global) + React Query (server)

## Getting Started

```bash
npm install
cp .env.example .env    # Fill in Supabase credentials
npx supabase start
npx supabase db reset
npx expo start
```

## AI-Assisted Development

- **CLAUDE.md** – Project context for Claude Code
- **AGENTS.md** – Instructions for all coding agents
- `.claude/skills/` – Auto-triggered patterns
- `.claude/commands/` – Slash commands (/new-screen, /validate-loop)
- `.claude/agents/` – Specialized subagents
