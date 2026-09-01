# AGENTS.md

## Project Instructions

This repository is the frontend. The backend lives in a separate repository and is
reached through `API_URL` or `NEXT_PUBLIC_API_URL` as appropriate.

- Frontend: Next.js App Router
- Language: TypeScript
- Infrastructure: Docker Compose
- Package manager: pnpm
- Stack profile: `frontend-nextjs`

The architecture this repository must match is `docs/architecture.md` — the source root, the
layer dependency table, and the core principles. It is authored, not generated: SDD's `survey`
reads it as an authoritative input and reconciles its scan against it, never overwriting it, and
`design` then works from the generated `docs/architecture-map.md`. Record a deviation in
`docs/architecture.md` with its reason; a silent one is drift.

Use `$rexsoft-frontend` for frontend implementation, review, debugging, architecture,
API integration, Docker, responsive UI, and visual verification tasks. Its references
are under `.agents/skills/rexsoft-frontend/references/`.

Before changing code, inspect the repository README, package scripts, design source,
and existing component patterns. Use Server Components by default. Keep API access in
typed client modules and do not expose backend secrets or server-only session data to
the client bundle.

Do not invent missing product requirements, API shapes, content, or design tokens.

## Project-specific rules

- This MVP has no backend API, authentication, or server-side database. Do not add one without an
  ADR and an update to `docs/architecture-map.md`.
- Password generation must use Web Crypto. Never use `Math.random`, log generated passwords, or
  transmit them.
- Password history is an explicitly enabled, plaintext IndexedDB feature. Keep it local, never
  synchronize it, and preserve a user-visible clear-all path.
- Local checks: `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build`, and `pnpm test:e2e`.
- Docker Compose runs the `web` service; `pnpm dev` is the fast host workflow.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
