---
status: Accepted
owner: "Tech Lead"
reviewers: ["Security Lead"]
updated_at: "2026-09-02"
feature_size: "S"
ticket: ""
---

# 0002 — Retain password history only after explicit local consent

- **Status:** Accepted
- **Date:** 2026-09-02
- **Deciders:** Tech Lead and product owner

## Context

A person may want to revisit generated passwords, but retained plaintext passwords increase the impact of same-origin malicious code and shared-device access. The product scope confirms that history is optional, local, reversible, and manually clearable.

## Decision drivers

- Password material is confidential.
- The person must control whether later generated passwords are retained.
- Existing history remains available until the person explicitly clears it.

## Considered options

1. **Explicit opt-in local history** — Warn before enable, save only after confirmation, and retain records until clear-all.
2. **History enabled by default** — Save generated passwords automatically.
3. **No password history** — Never retain generated passwords.

## Decision outcome

**Chosen:** Explicit opt-in local history. It gives the person a reversible retention choice while preserving the agreed local-only workflow.

## Consequences

**Positive**
- Passwords are not retained before an informed choice.
- Disabling history prevents later records without silently destroying existing records.

**Negative**
- Plaintext retained records remain readable by same-origin scripts.

**Neutral**
- Encryption with a master password remains a future feature with its own key-management design.

## Links

- Spec: [[../spec.md]]
- SAD: [[../sad.md]] §4
- Related ADR: [[0001-generate-passwords-with-web-crypto-and-rejection-sampling]]
