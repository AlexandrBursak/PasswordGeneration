---
status: Draft
owner: "Product owner"
reviewers: ["Tech Lead", "Security Lead"]
updated_at: "2026-09-02"
feature_size: "S"
---

# Spec — password-generator

> **Glossary:** [CONTEXT](./CONTEXT.md)
> **Reference module / docs / channels used:** None — only the interview, CONTEXT, and `docs/architecture-map.md`.

## 1. Context

People need a quick way to create passwords that fit a chosen length and character-group policy without manually composing random strings. The first release serves a person directly in a browser and must keep the generation controls understandable rather than hiding them behind opaque complexity labels.

The project has a working application shell and a browser-only privacy boundary, so the first product feature can establish the core interaction and the rules future password-related work must preserve. There is no account, remote service, or cross-device behavior in scope.

The committed approach is a single generator experience in which a length from 4 through 128 characters and selected character groups are the complexity controls. A person can generate and copy a password, and can explicitly opt into a local password history that they can later disable or fully clear.

## 2. Goals

- Let a person configure a password policy using length and character-group choices.
- Let a person obtain and copy a password that satisfies their selected policy.
- Let a person make an informed, reversible choice about retaining generated passwords locally.

## 3. Non-goals

- Password-manager behavior, accounts, synchronization, and sharing are out of scope because the MVP is intentionally local-only.
- Preset labels such as “weak”, “medium”, or “strong” are out of scope because length and selected character groups are the agreed complexity controls.
- Importing, exporting, editing, or recovering retained passwords is out of scope because password history is a minimal, optional record.
- Analytics that collect generated password material are out of scope because passwords are confidential.

## 4. User stories

### US-01: Set password length

**As a** person
**I want** to choose a password length from 4 through 128 characters
**So that** the result fits the requirements I have to meet.

### US-02: Select character groups

**As a** person
**I want** to include or exclude lowercase letters, uppercase letters, digits, and symbols
**So that** I control the composition of the generated password.

### US-03: Generate a password

**As a** person
**I want** to generate a password from my selected policy
**So that** I can use a new password without inventing it myself.

### US-04: Copy a password

**As a** person
**I want** to copy the generated password
**So that** I can paste it where I need it without retyping it.

### US-05: Choose password history

**As a** person
**I want** to explicitly enable or leave disabled local password history
**So that** I control whether generated passwords remain on this device.

### US-06: Clear password history

**As a** person
**I want** to view retained password history when I return and clear it when I no longer need it
**So that** I can remove confidential passwords when I no longer need them.

## 5. Acceptance criteria

### AC-01 (US-01) — happy path

**Given** a person has chosen a length and at least one character group
**When** the person generates a password
**Then** the person sees a freshly generated password with the chosen length.

### AC-02 (US-02) — error path

**Given** a person has selected no character groups, a length outside 4 through 128 characters, or a length smaller than the number of selected character groups
**When** the person tries to generate a password
**Then** generation is blocked and the person sees a plain-language explanation of the invalid selection.

### AC-03 (US-05) — authorization

**Given** a person has not explicitly enabled password history
**When** the person generates a password
**Then** the password is not retained and the history remains unavailable to that person.

### AC-04 (US-03) — domain invariant

**Given** a person has selected one or more character groups and a valid length that can include every selected group
**When** the person generates a password
**Then** the generated password includes at least one character from every selected group and contains no character from an unselected group.

### AC-05 (US-05) — cross-context

**Given** a person has explicitly enabled password history
**When** the person generates a password
**Then** the freshly generated password appears in that person’s password history, remains local to the device, and is available when the person returns to the application.

### AC-06 (US-04) — happy path

**Given** a person can see a generated password
**When** the person chooses to copy it
**Then** the password is placed on the person’s clipboard and the person receives confirmation that it is ready to paste.

### AC-07 (US-06) — happy path

**Given** a person has retained one or more passwords
**When** the person clears password history
**Then** the history is empty and the person receives confirmation that retained passwords were removed.

### AC-08 (US-05) — informed consent

**Given** a person has not enabled password history
**When** the person chooses to enable it
**Then** the person sees a clear warning that retained passwords are local plaintext and can either confirm or decline the choice before any password is retained.

### AC-09 (US-05) — reversible consent

**Given** a person has enabled password history and retained one or more passwords
**When** the person disables password history
**Then** no later passwords are retained, existing retained passwords remain available until explicitly cleared, and the person sees the new disabled state.

### AC-10 (US-04) — error path

**Given** a person can see a generated password and copying is unavailable
**When** the person chooses to copy it
**Then** the person sees a plain-language explanation that the password was not copied and can try again.

## 6. Non-functional requirements

| Aspect | Target | Measurement |
|---|---|---|
| Password generation latency p95 | ≤250 ms | Browser-level automated measurement for valid policies. |
| Copy-action feedback latency p95 | ≤250 ms | Browser-level automated measurement after the person chooses copy. |
| Local history read/write latency p95 | ≤250 ms | Automated browser measurement with a retained-history fixture. |
| Availability | N/A | The feature is a local browser interaction with no service-level dependency. |
| Browser verification | 100% of release smoke runs pass in the project browser harness | Browser-level automated verification in CI. |
| Policy accuracy | 100% of tested valid policies satisfy their selected length and character groups | Unit tests covering policy combinations and boundary lengths. |

## 6.1 Security / privacy

- **Data classification:** confidential — generated passwords and password history can grant access to other systems.
- **Personal data touched:** none; the feature does not collect identity data.
- **AuthZ/AuthN impact:** no account capability is added. Explicit local consent is required before password history is retained.
- **Abuse cases:**
  - A person accidentally enables password history: the application explains that retained passwords remain local and provides a full-clear action.
  - A person leaves a shared device: the person can clear all retained passwords without an account or recovery workflow.
  - A malicious script attempts to read retained passwords: the feature must not transmit or log password material, and the local-history warning explains the same-origin risk before opt-in.
  - A person requests an invalid policy: generation is blocked rather than producing a misleading password.
- **Security review:** N/A — no new authentication boundary or personal data is introduced; the existing local-history risk decision is already documented and must be preserved.

## 7. Metrics / KPIs

- **Valid-policy generation coverage** — baseline: 0%, target: 100% of supported character-group combinations covered by automated tests before the first release.
- **Copy-flow coverage** — baseline: 0%, target: 100% of browser smoke runs confirm that a generated password can be copied before the first release.
- **History-consent coverage** — baseline: 0%, target: 100% of automated history tests cover disabled, enabled, and cleared states before the first release.

## 8. Open questions

<!-- N/A: The first-release scope, complexity controls, and local-history boundary were confirmed during intake. -->

## Assumptions ledger

- The MVP supports only a person using the application in one browser; no account or remote service is added.
- Length from 4 through 128 characters and selected character groups are the only complexity controls; no presets are added.
- Password history is disabled by default, requires explicit opt-in, stays on the device, remains available after disabling until explicitly cleared, and can be fully cleared.
- The confirmed p95 responsiveness target for generation, copying, and history interactions is 250 ms or less and will be validated by automated browser tests.
