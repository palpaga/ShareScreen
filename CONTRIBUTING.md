# Contributing Guidelines

Thank you for considering contributing to **ShareScreen.live** 🎉  

---

## Workflow

1. **Fork** the repo
2. Create a branch → `feat/short-name`, `fix/short-name`, etc.
3. Make changes, keep PRs small and focused
4. Submit a **Pull Request** against `main`

---

## Commit & PR style

- Follow **Conventional Commits**:
  - `feat: add new option`
  - `fix: resolve crash`
  - `docs: update README`
  - `chore: update deps`
- Squash & merge by default
- At least **1 review** required for merge

---

## Development

```bash
npm ci
npm run typecheck
npm run build:worker
npm run build:pages
```

Node.js 20 recommended
Keep code minimal, typed, and documented

## Out of scope

- No TURN/relay servers
- No accounts, no tracking
- No heavy dependencies
