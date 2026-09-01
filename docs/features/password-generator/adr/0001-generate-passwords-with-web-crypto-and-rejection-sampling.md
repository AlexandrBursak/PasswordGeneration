---
status: Accepted
owner: "Tech Lead"
reviewers: ["Security Lead"]
updated_at: "2026-09-02"
feature_size: "S"
ticket: ""
---

# 0001 — Generate passwords with Web Crypto and rejection sampling

- **Status:** Accepted
- **Date:** 2026-09-02
- **Deciders:** Tech Lead and product owner

## Context

The feature generates confidential passwords locally. Policy correctness and unpredictable selection are quality goals, and the project architecture prohibits predictable password randomness.

## Decision drivers

- Generated passwords must not be predictable.
- Every selected character group must be represented without allowing unselected groups.
- Generation p95 must be ≤250 ms.

## Considered options

1. **Web Crypto with rejection sampling** — Use browser cryptographic random bytes and discard out-of-range values.
2. **Web Crypto with direct remainder mapping** — Map random bytes directly into the character set.
3. **General-purpose pseudo-random selection** — Use non-cryptographic application randomness.

## Decision outcome

**Chosen:** Web Crypto with rejection sampling. It provides browser-native cryptographic randomness while avoiding selection bias and retaining the local-only architecture.

## Consequences

**Positive**
- Password selection is not predictable through a general-purpose random source.
- Character-group policy can be tested independently of UI rendering.

**Negative**
- The generator needs a small rejection loop for some alphabet sizes.

**Neutral**
- The browser must provide the Web Crypto capability.

## Links

- Spec: [[../spec.md]]
- SAD: [[../sad.md]] §4
- Related ADR: [[0002-retain-password-history-only-after-explicit-local-consent]]
