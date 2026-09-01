# ADR 0001: Next.js client-side stack and cryptographic generation

- Status: Accepted
- Date: 2026-09-01

## Context

passGeneration is a focused web application that creates passwords from a user-selected length,
complexity, and character groups. It needs browser interaction but no backend, account, or shared
data. Password generation must not depend on predictable pseudo-randomness.

## Decision

Use Next.js App Router, React, strict TypeScript, and pnpm. Implement the generator as a client-side
interaction inside an otherwise thin App Router page. Generate randomness with Web Crypto
`crypto.getRandomValues`, using rejection sampling where mapping random integers into a character
alphabet could introduce modulo bias. Never use `Math.random` for password generation.

Use Vitest for pure logic, Testing Library for meaningful UI behavior, and Playwright for one browser
smoke path. CI runs lint, typecheck, unit/UI tests, and build.

## Consequences

- The project can deploy as a static/client-oriented web application without a backend.
- Password material does not need to cross the network.
- The generator requires a secure browser context in production.
- Browser interaction requires a narrow Client Component boundary.
