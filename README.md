# passGeneration

Browser-based password generator built with Next.js, TypeScript, and pnpm.

## Local development

```sh
pnpm install
pnpm dev
```

Open http://localhost:3000.

The canonical container workflow is:

```sh
docker compose up --build
```

## Verification

```sh
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm test:e2e
```

## Architecture

- `src/app/` composes routes and global styles.
- `src/entities/password/` contains framework-free password domain types.
- `src/shared/` contains reusable infrastructure, generic primitives, Web Crypto utilities, and browser persistence adapters.
- `src/view/` contains domain-aware interactive UI.

Imports flow downward: `app → view → entities/shared`. The enforced rules are in
`eslint.layers.mjs`; `eslint.config.mjs` loads them.

## Password-history security boundary

Password history is local IndexedDB storage and is disabled by default. Users must explicitly opt
in before any generated password is saved. Stored records are plaintext and can be read by
same-origin JavaScript, including malicious code introduced through an XSS vulnerability. The
application must never sync, log, or transmit password history, and must provide a clear-all action.

The password generator itself will use browser Web Crypto (`crypto.getRandomValues`), never
`Math.random`.
