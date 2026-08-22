# PatternMaster

[![Quality gate status](https://sonarcloud.io/api/project_badges/measure?project=Agustin-Perezz_pattern-master&metric=alert_status&token=488d382bfa2f8608447379c0b9438ba29f899556)](https://sonarcloud.io/summary/new_code?id=Agustin-Perezz_pattern-master)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=Agustin-Perezz_pattern-master&metric=coverage)](https://sonarcloud.io/summary/new_code?id=Agustin-Perezz_pattern-master)

An interactive coding environment where developers practice software design patterns. Users refactor anti-pattern code into clean, pattern-based solutions. A Monaco editor lets users write their refactored code. An LLM evaluator gives a score (0–100), detects the target pattern, and returns structured feedback on clean architecture violations.

Built on [Next.js](https://nextjs.org) 16 with Clean Architecture and strict layering. Domain entities and Zod invariant schemas sit at the core. Application use cases depend only on repository interfaces. Infrastructure provides Supabase-backed and OpenAI-backed implementations. The App Router delivery layer composes per-request DI containers, not module-level singletons. Dependencies point inward toward the domain. Framework and I/O concerns stay at the edges. The project takes a shift-left approach to quality: linting, type checking, static analysis, and E2E tests run on every push and pull request.

## Table of Contents

- [Tech Stack](#tech-stack)
- [Features](#features)
- [Folder Structure](#folder-structure)
- [Setup](#setup)
  - [Supabase Local Development](#supabase-local-development)
- [Scripts](#scripts)
- [Architecture](#architecture)
- [Testing](#testing)
  - [Unit tests](#unit-tests)
  - [E2E tests](#e2e-tests)
  - [Prerequisites](#prerequisites)
  - [Test Structure](#test-structure)
  - [Coverage Reports](#coverage-reports)
- [Git Hooks](#git-hooks)
- [CI (GitHub Actions)](#ci-github-actions)
  - [Required GitHub Configuration](#required-github-configuration)
- [Documentation](#documentation)

## Tech Stack

| Area            | Choice                                        |
| --------------- | --------------------------------------------- |
| Framework       | Next.js 16 (App Router)                        |
| UI runtime      | React 19                                       |
| Language        | TypeScript (strict)                           |
| Components      | base-ui + shadcn                               |
| Styling         | Tailwind CSS v4                                |
| Code editor     | Monaco Editor (`@monaco-editor/react`)         |
| Forms           | react-hook-form + zod                          |
| Database        | Supabase (Postgres + Auth + Storage)           |
| Supabase client | `@supabase/ssr` (cookie-based SSR auth)        |
| LLM evaluation  | OpenAI via Vercel AI SDK (`@ai-sdk/openai`)    |
| Lint / Format   | Biome 2                                        |
| E2E             | Playwright (Chromium) + Monocart Reporter    |
| Monitoring      | Sentry (`@sentry/nextjs`)                      |
| Security scan   | Snyk (SARIF → GitHub Code Scanning)            |
| Code quality    | SonarCloud (static analysis + Quality Gate)    |
| Package manager | pnpm 9                                         |
| Git hooks       | Husky + nano-staged                            |

## Features

- **Challenge catalog** — Six seeded design-pattern challenges across Behavioral, Creational, and Structural categories. Each challenge has a description, starter code (the anti-pattern), and the code to refactor.
- **Monaco editor workspace** — A split-view workspace per challenge. The challenge description is on the left. The Monaco editor is on the right, with TypeScript syntax highlighting and a custom dark theme.
- **LLM-driven evaluation** — Submit refactored code to the `/api/evaluate` endpoint. OpenAI scores the solution (0–100), detects the target pattern, and returns structured feedback. The feedback includes praise, critical feedback, and clean architecture violations.
- **Auth** — Magic link email sign-in plus OAuth (Google, GitHub). Supabase handles session management with cookie-based SSR auth. Protected routes require authentication via middleware.
- **Submission persistence** — Every evaluation is persisted to Supabase with the user ID, submitted code, score, and feedback JSON. RLS enforces owner-only access.

## Folder Structure

```
pattern-master/
├── .github/
│   └── workflows/
│       └── ci.yml                # SonarQube, lint, typecheck, E2E, build, Snyk pipeline
├── docs/                         # High-level docs for humans
│   ├── architecture.md           # Clean Architecture concepts
│   ├── supabase.md               # Supabase local dev operations
│   └── development-guidelines.md # TypeScript and clean code standards
├── public/                       # Static assets served at root
├── src/
│   ├── domain/                   # Pure entities + Zod invariant schemas (zero framework deps)
│   │   └── entities/             # Challenge, Submission, Evaluation, Difficulty, OAuthProvider
│   ├── application/              # Use cases, repository interfaces, request/response DTOs
│   │   └── use-cases/            # auth, challenges, create-submission, evaluate-submission
│   ├── infrastructure/           # Supabase repos, DB row aliases, mappers, generated types
│   │   ├── database/postgres/    # Repositories + mappers for challenges & submissions
│   │   └── ai/openai/            # OpenAI-backed evaluation repository
│   ├── lib/
│   │   ├── containers/           # DI wiring (auth, challenge, submission, evaluation)
│   │   ├── shared/
│   │   │   └── infrastructure/  # Supabase server/browser clients, env validation, auth helpers
│   │   └── utils.ts
│   ├── app/                      # App Router routes (pages, layouts, actions, proxy)
│   │   ├── page.tsx              # Home — challenge browser
│   │   ├── signin/               # Sign-in page (magic link + OAuth)
│   │   ├── signup/               # Sign-up page
│   │   ├── auth/callback/        # OAuth/magic-link callback handler
│   │   ├── problems/             # Challenge catalog + protected challenge workspace
│   │   │   ├── [slug]/           # Per-challenge Monaco editor + evaluation
│   │   │   └── components/       # ProblemBrowser, ProblemWorkspace, MonacoEditor, FeedbackCard
│   │   └── api/evaluate/         # POST endpoint for LLM evaluation
│   ├── components/
│   │   └── ui/                   # Reusable base-ui / shadcn primitives
│   └── proxy.ts                  # Session refresh + route protection via @supabase/ssr
├── supabase/
│   ├── migrations/               # profiles, challenges, submissions, service-role grants
│   ├── seed.sql                  # 6 design-pattern challenges (Strategy through Decorator)
│   └── config.toml               # Local Supabase config (ports, OAuth providers)
├── tests/                        # Playwright E2E specs + shared fixtures
│   ├── e2e/                      # challenges-db, evaluate, monaco, problems specs
│   ├── _shared/                  # Fixtures (supabase test client, auth fixtures)
│   ├── smoke.test.ts
│   ├── signin.test.ts
│   └── auth-callback.test.ts
├── playwright.config.ts          # Playwright config (monocart reporter, V8 coverage)
├── playwright.monocart-reporter.ts  # Monocart coverage + report config
├── biome.json                    # Linter & formatter config
├── sonar-project.properties       # SonarCloud analysis configuration
├── next.config.ts                # Next.js configuration
├── package.json
└── tsconfig.json                 # Path alias: @/* -> ./src/*
```

See [`AGENTS.md`](./AGENTS.md) for the engineering conventions that agents and contributors must follow.

## Setup

1. Copy `.env.example` to `.env` and fill in the values:

   ```bash
   cp .env.example .env
   ```

2. Install dependencies and Playwright browsers:

   ```bash
   pnpm install
   pnpm test:install
   ```

3. Configure `supabase/.env` — set your port block and optional OAuth secrets. See [`docs/supabase.md`](./docs/supabase.md) "`supabase/.env` configuration".

4. Start the Supabase local stack (see [Supabase Local Development](#supabase-local-development) below):

   ```bash
   supabase start
   ```

5. Start the dev server:

   ```bash
   pnpm dev
   ```

The app runs at [http://localhost:3000](http://localhost:3000). On startup, the dev server logs the local Supabase URLs (Studio, Mailpit, API).

### Supabase Local Development

This project uses a **local Supabase stack** for development and tests. The app's `.env` points to `http://127.0.0.1:55321` (not a remote project).

**Prerequisites**: Docker running, Supabase CLI installed (`brew install supabase/tap/supabase` or see [CLI docs](https://supabase.com/docs/guides/local-development/cli/getting-started)).

For the full getting started guide, daily commands, schema changes, and remote deploy, see [`docs/supabase.md`](./docs/supabase.md).

**Seeded challenges:** Six design-pattern challenges are seeded automatically on `supabase db reset`:

| Slug                              | Title                          | Category    | Difficulty | Pattern    |
| --------------------------------- | ------------------------------ | ----------- | ---------- | ---------- |
| `refactor-the-payment-processor`  | Refactor the Payment Processor | Behavioral  | Medium     | Strategy   |
| `tame-the-notification-service`   | Tame the Notification Service  | Behavioral  | Easy       | Observer   |
| `build-a-widget-factory`          | Build a Widget Factory         | Creational  | Medium     | Factory    |
| `one-config-to-rule-them-all`     | One Config to Rule Them All    | Creational  | Easy       | Singleton  |
| `wrap-the-legacy-api`             | Wrap the Legacy API            | Structural  | Medium     | Adapter    |
| `decorate-your-coffee`            | Decorate Your Coffee           | Structural  | Hard       | Decorator  |

> **Port conflicts between projects?** This project uses `env()` port indirection in `supabase/config.toml`. Each developer picks a distinct 5-port block via `supabase/.env` (gitignored). The default block is 55321–55327. See [`docs/supabase.md`](./docs/supabase.md).

## Scripts

| Script              | Description                              |
| ------------------- | ---------------------------------------- |
| `pnpm dev`          | Start development server                  |
| `pnpm build`        | Production build                         |
| `pnpm start`        | Start production server                  |
| `pnpm lint`         | Run Biome lint & format checks           |
| `pnpm format`       | Auto-format with Biome                   |
| `pnpm typecheck`    | Run TypeScript type checking (`tsc --noEmit`) |
| `pnpm test`         | Reset DB + run Playwright E2E tests       |
| `pnpm test:ui`      | Reset DB + run Playwright in UI mode      |
| `pnpm test:ci`      | Run Playwright only (no DB reset, for CI) |
| `pnpm test:install` | Install Playwright Chromium browser       |
| `pnpm test:unit`    | Run Vitest unit tests (no Supabase needed) |
| `pnpm test:unit:coverage` | Run Vitest with V8 coverage       |
| `pnpm test:show-report`     | Open Monocart HTML test report   |
| `pnpm coverage:show-report` | Open V8 coverage report          |

## Architecture

This project follows Clean Architecture with strict layering. See [Architecture](./docs/architecture.md) for the full guide.

```
src/
├── domain/            # Pure entities + Zod invariant schemas (zero framework deps)
├── application/       # Use cases, repository interfaces, request/response DTOs
├── infrastructure/    # Supabase repos, OpenAI evaluator, DB mappers, generated types
├── lib/containers/    # DI wiring (use cases ↔ concrete repositories)
└── app/               # Delivery layer (Server Components, Server Actions, UI components)
```

## Testing

The project has two complementary test layers, mapped to SonarCloud coverage:

- **Unit tests (Vitest)** — cover the pure Clean Architecture core: use-cases, schemas, DTOs, mappers, and utilities. They also cover the server code that browser coverage cannot see: Server Actions, route handlers, and repositories. Fast feedback. They run locally with no Supabase.
- **E2E tests (Playwright)** — Chromium-only, with V8 client-side coverage via the Monocart Reporter. They cover routes and client-rendered components end-to-end. This includes the challenge catalog, the Monaco editor, and the evaluation flow.

> **Why two layers?** Playwright browser V8 coverage captures only client-side JS. Server Components, server actions, route handlers, middleware, and the Postgres repositories run on the server. They are invisible to browser coverage. Vitest covers that surface. Playwright covers the rest. SonarCloud merges both LCOV files.

### Unit tests

```bash
pnpm test:unit            # run once
pnpm test:unit:coverage   # run with V8 coverage → coverage/unit/lcov.info
```

Unit tests are co-located next to the source they cover (`src/**/*.test.ts`). They run in the Node environment (no jsdom). The use-case repository interfaces (`*.repository.interface.ts`) make them dependency-free. Pass a fake or in-memory repository. No Supabase is necessary.

### Coverage scope: Clean Architecture core in, outer layers out

SonarCloud's coverage gate targets **logic, not volume**. The new-code gate (Clean as You Code) limits the burden to code you add or change, not legacy. Only the **Clean Architecture core** is in the coverage metric. The outer layers are excluded in both `sonar.coverage.exclusions` and Vitest's `coverage.exclude`. These layers are exercised by E2E, are framework glue, or are invisible to browser V8 coverage (Server Components, server actions).

| In coverage scope (needs unit tests)       | Out of coverage scope (E2E / glue, no unit tests required) |
| ------------------------------------------ | --------------------------------------------------------- |
| Use-cases (`*.use-case.ts`)                | DTOs (`*.dto.ts`), Zod schemas (`*.schema.ts`), enums (`*.enum.ts`) |
| Entity validation (`*.entity.ts`)          | Repository interfaces (`*.repository.interface.ts`)       |
| Mappers (`*.mapper.ts`)                    | Supabase repository implementations, server actions (`actions.ts`) |
|                                            | Presentational components, shadcn UI (`components/ui/**`)  |
|                                            | DI containers, env/Supabase/auth factories, Sentry config, instrumentation |
|                                            | App shell, route handlers, middleware, generated types, `errors.ts`, `utils.ts` |

Excluded files are still analyzed for **bugs, smells, and duplication**. They do not count toward the coverage %. Write unit tests for new use-cases, entity logic, and mappers. The outer layers are covered by E2E. New infrastructure or presentation code is smell-gated and bug-gated, not coverage-gated.

### E2E tests

### Prerequisites

Local Supabase must be running:

```bash
pnpm supabase:start
```

Copy `.env.test.example` to `.env.test` (or let `supabase start` generate defaults):

```bash
cp .env.test.example .env.test
```

### Test Structure

```
tests/
├── e2e/
│   ├── challenges-db.spec.ts     # Seeded challenges exist in DB after reset
│   ├── evaluate.spec.ts          # /api/evaluate auth, validation, happy path
│   ├── monaco.spec.ts            # Monaco editor loads, typing, persistence
│   └── problems.spec.ts          # Problems page renders seeded challenge titles
├── _shared/
│   ├── app-fixtures.ts           # Merged fixtures (coverage + supabase test client)
│   └── fixtures/
│       ├── auth-fixtures.ts      # createTestUser, signInAndGetCookies, authenticatedPage
│       └── supabase-test-client.ts  # Supabase service client for seeding
├── auth-callback.test.ts         # Callback redirect on error/no-param/invalid-code
├── signin.test.ts                # Signin page renders all auth elements
└── smoke.test.ts                 # Home page loads and shows heading
```

All tests import `test` and `expect` from `_shared/app-fixtures` (not directly from Playwright).

### Coverage Reports

| Format        | Path                                              |
| ------------- | ------------------------------------------------- |
| Monocart HTML | `./coverage/tests/monocart-report.html`           |
| V8 HTML (E2E) | `./coverage/tests/v8/index.html`                  |
| LCOV (E2E)    | `./coverage/tests/lcov.info`                      |
| LCOV (unit)   | `./coverage/unit/lcov.info`                      |
| Cobertura XML | `./coverage/tests/cobertura/code-coverage.cobertura.xml` |

SonarCloud reads both LCOV files (`sonar.*.lcov.reportPaths=coverage/unit/lcov.info,coverage/tests/lcov.info`) so unit + E2E coverage feed a single analysis.

## Git Hooks

[Husky](https://typicode.github.io/husky/) manages Git hooks:

- **pre-commit**: runs `nano-staged`, which executes `biome check --staged` on staged files.
- **pre-push**: runs `pnpm typecheck && pnpm test`.

Hooks are installed automatically via the `prepare` script when running `pnpm install`.

## CI (GitHub Actions)

The `.github/workflows/ci.yml` workflow runs on push to `main` and on pull requests:

1. **lint** — Biome lint + TypeScript typecheck
2. **test** — E2E tests (Playwright + local Supabase + V8 coverage via Monocart Reporter). Uploads the `test-report` (E2E coverage) artifact.
3. **sonar** — SonarCloud static analysis and Quality Gate. **Runs after `test`**. It generates the Vitest unit coverage (`coverage/unit/lcov.info`). Then it downloads the E2E coverage artifact (`coverage/tests/lcov.info`) and scans both files. This makes sure that coverage is never missing from the report. PR decoration posts the gate status and inline issue comments to the PR.
4. **build** — Production build with Sentry source map upload (gated on lint + test)

A **snyk** job runs in parallel. It scans dependencies for high-severity vulnerabilities. Then it uploads the results as SARIF to GitHub Code Scanning. It can continue on error, so findings do not block the pipeline.

```
lint ──┐
       ├──> build
test ──┼──> sonar
snyk
```

### Required GitHub Configuration

Configure these in **Settings → Secrets and variables → Actions**.

**Secrets** (sensitive values):

| Secret              | Description                            |
| ------------------- | -------------------------------------- |
| `SONAR_TOKEN`       | SonarCloud analysis token               |
| `SENTRY_AUTH_TOKEN` | Sentry auth token for source map upload |
| `SENTRY_ORG`        | Sentry organization slug               |
| `SENTRY_PROJECT`    | Sentry project slug                    |
| `SNYK_TOKEN`        | Snyk API token for vulnerability scans |

> **Note:** `SONAR_TOKEN` is the only SonarCloud secret you must add manually. `GITHUB_TOKEN` is provided automatically by GitHub Actions. No `SONAR_HOST_URL` is necessary for SonarCloud.

**Variables** (public values, safe to expose):

| Variable                               | Description                     |
| -------------------------------------- | ------------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`             | Supabase project URL            |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Supabase publishable (anon) key |
| `NEXT_PUBLIC_SENTRY_DSN`               | Sentry DSN (client + server)    |

### Shift-left: SonarCloud gate on every PR

Coverage and code quality are enforced as early as possible (shift-left):

1. **IDE — SonarLint Connected Mode.** Install the SonarLint extension (VS Code or JetBrains). Bind it to SonarCloud organization `general-organization`, project `Agustin-Perezz_pattern-master`. This syncs the quality profile. It surfaces issues in the editor before you commit, in agreement with CI.
2. **Pre-push — unit tests.** The Husky `pre-push` hook runs `pnpm test:unit` before the slower E2E suite, so pure-logic regressions fail fast locally.
3. **PR — analysis and decoration.** The `sonar` job runs on every PR. It posts the Quality Gate status and inline issue comments to the PR. This is PR decoration, enabled by the job's `pull-requests: write` permission. It reports only *new* issues introduced by the PR.
4. **Merge gate — required check.** In **Settings → Branches → Branch protection rules** for `main`, add the **"SonarCloud Code Analysis"** check as a *required* status check. A failing Quality Gate then blocks the merge.

On SonarCloud, keep the **New Code Definition** set to `previous_version`. Leave the Quality Gate on the default **Sonar way** (new-code coverage ≥ 80%, no new issues, new duplication ≤ 3%). Do not raise an overall-coverage condition until the unit suite matures. New-code-only keeps the gate achievable for server-action or route code that E2E covers or that is excluded.

## Documentation

- [Architecture](./docs/architecture.md) — Clean Architecture concepts
- [Supabase](./docs/supabase.md) — Local dev operations
- [Development Guidelines](./docs/development-guidelines.md) — TypeScript and clean code standards