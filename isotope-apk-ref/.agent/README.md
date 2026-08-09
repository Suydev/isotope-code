# IsotopeAI Android — Agent Handoff System

**Start here if you are a new agent.**

## Step 1 — Read AGENTS.md
```
cat AGENTS.md
```

## Step 2 — Read current state
```
cat .agent/CURRENT_STATE.md
cat .agent/NEXT_TASKS.md
```

## Step 3 — Run resume script
```
npm run agent:resume
```

## Step 4 — Check status
```
npm run agent:status
```

## Before ending session
```
npm run agent:handoff
```

---

## Quick Reference

| What | Where |
|------|-------|
| What to do next | `.agent/NEXT_TASKS.md` |
| What is broken | `.agent/KNOWN_ISSUES.md` |
| How to set up | `.agent/BOOTSTRAP.md` |
| Architecture | `.agent/ARCHITECTURE.md` |
| Why we made decisions | `.agent/DECISIONS.md` |
| Test results | `.agent/TEST_STATUS.md` |
| Session history | `.agent/SESSION_LOG.md` |
| Machine state | `.agent/state.json` |
