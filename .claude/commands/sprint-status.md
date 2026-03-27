---
description: Show current sprint progress and blockers
allowed-tools: Read, Grep, Glob, Bash
---

Analyze current state of the EPANO project:

1. Read CLAUDE.md for sprint plan and current focus
2. Check git log --oneline -20 for recent commits
3. Check which core loop steps are implemented (scan src/)
4. Check if analytics events from CLAUDE.md are implemented
5. List TODO, FIXME, HACK comments in codebase
6. Verify Supabase migrations are up to date

Output: Current Sprint, Completed, In Progress, Next Up, Blockers, Tech Debt
