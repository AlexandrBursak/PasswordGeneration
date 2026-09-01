# ADR 0002: RexSoft layered frontend with minimal instantiated layers

- Status: Accepted
- Date: 2026-09-01

## Context

The RexSoft frontend baseline defines `app`, `view`, `entities`, `shared`, `data`, and `providers`
layers. This project initially has no remote data source or global provider requirement. Empty layers
would add ceremony without ownership.

## Decision

Use the baseline dependency direction with only the layers that have responsibilities:

- `app` owns routes, metadata, layout, and composition.
- `view` owns the interactive password-generator widget and domain-aware UI.
- `entities` owns framework-free password policy types, constants, and constraints.
- `shared` owns generic UI primitives, Web Crypto utilities, and the IndexedDB adapter.

Imports flow `app → view → entities/shared`. Add `data` only with a remote data contract and
`providers` only with an application-wide provider. Modules communicate through typed function
calls and React props. Validation failures are represented as typed results and rendered as
specific inline feedback rather than thrown through the component tree.

## Consequences

- The scaffold stays small while preserving enforceable ownership boundaries.
- Domain logic remains independently testable.
- Future API or provider work has an explicit place but no placeholder folders.
