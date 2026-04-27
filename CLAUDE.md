# Project conventions

## What this is
A CLI tool that removes all entries for a given package from a yarn v1 lockfile. Takes a lockfile path and a package name as arguments, edits the file in place (atomically). Published as `@ymainier/yarn-v1-lock-snip`.

## Runtime
TypeScript source is executed with `node --strip-types` (not compiled to JS during development).

## Tests
Import from vitest explicitly: `import { describe, expect, it } from "vitest"`

## Package manager
Use `pnpm` exclusively.

## After making changes
After any change to source files or tooling configs (tsconfig, eslint, vite, package.json, etc.), always run:
```
pnpm typecheck && pnpm lint && pnpm test
```
