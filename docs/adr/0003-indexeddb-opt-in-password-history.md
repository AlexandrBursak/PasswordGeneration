# ADR 0003: Opt-in password history in IndexedDB

- Status: Accepted
- Date: 2026-09-01

## Context

Users want to keep generated passwords locally. `localStorage` is synchronous, string-only, and
awkward for versioned structured history. Any same-origin browser storage remains accessible to
JavaScript running on the origin, so plaintext password history increases the impact of XSS.

## Decision

Use IndexedDB through a small typed adapter. Password history is disabled by default and starts only
after explicit user opt-in accompanied by a plaintext-storage warning. Store each selected password
with an ID from `crypto.randomUUID()`, creation timestamp, and only the minimal generation metadata
needed by the UI. Do not sync, transmit, log, or include history in analytics. Provide an always
visible way to clear all history and a setting that disables history without silently re-enabling it.

The MVP does not encrypt records. Encryption with a user-held master password is a separate feature
because key derivation, locking, recovery, and session semantics require their own design.

## Consequences

- Structured history and schema upgrades are possible without blocking the main thread.
- Same-origin malicious scripts can still read stored passwords; CSP, dependency restraint, and the
  explicit opt-in warning are required mitigations, not a claim of secrecy.
- Tests need an IndexedDB-compatible harness and must cover opt-in, write/read, disable, and clear.
