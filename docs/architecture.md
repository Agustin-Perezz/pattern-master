# Architecture

Clean Architecture with strict layering. Dependencies point inward — outer layers depend on inner, never the reverse.

## Layers

| Layer | Location | Responsibility |
|-------|----------|----------------|
| Domain | `src/domain/entities/` | Entity classes (Challenge, Submission) with business rules + Zod invariant schemas. Enums (Difficulty, OAuthProvider). Domain errors. Zero framework deps. |
| Application | `src/application/use-cases/` | One class per use case (auth, challenges, create-submission, evaluate-submission). Repository interfaces, request DTOs (Zod), response DTOs (plain types). |
| Infrastructure | `src/infrastructure/` | Supabase repository implementations, DB row types, mappers (one per entity). OpenAI-backed evaluation repository. Generated `database.types.ts`. |
| Container | `src/lib/containers/` | DI wiring — connects use cases to concrete repos (auth, challenge, submission, evaluation). Takes a Supabase or OpenAI client. |
| Shared Infra | `src/lib/shared/infrastructure/` | Supabase server/browser clients, env validation, auth helpers (`getUser`, `requireUser`, `getUserVerified`, `getUserInitials`). |
| Delivery | `src/app/{feature}/` | Next.js Server Components, Server Actions, UI components. Routes: home, signin, signup, problems, api/evaluate. |

## Dependency rules

- Domain has zero external imports — no Supabase, no Next.js. Only `zod` and own entity classes.
- Use cases depend on repository interfaces, never concrete implementations.
- Infrastructure depends on Domain (entities) and DB types. The OpenAI evaluator implements the `evaluate-submission` repository interface.
- Delivery layer imports only container functions and DTOs — never repositories or use cases directly.
- Mappers are flat, one per entity — any repo that touches an entity imports the same mapper.

## Request flow

`page.tsx` / `actions.ts` → container → use case → repository interface → Supabase/OpenAI repository → mapper → domain entity → back up.

Supabase client is created per-request via `cookies()` and passed to the container at call time. Never module-level singletons.

### Evaluation flow

The `/api/evaluate` route is the core product loop:

1. `getUserVerified()` — network-verified auth (not just local JWT), so writes fail with 401 on revoked users.
2. `evaluateSubmissionRequestDto` — Zod validates the submitted code and challenge slug.
3. `createEvaluationContainer()` — wires the `EvaluateSubmissionUseCase` to the OpenAI repository.
4. OpenAI evaluates the code: returns score (0–100), `patternApplied` flag, praise, critical feedback, and clean architecture violations.
5. `createSubmissionContainer()` — persists the evaluation to Supabase (user ID, code, score, feedback JSON).
6. Response returns the evaluation JSON to the client, which renders `ScoreDial` + `FeedbackCard`.

### Auth flow

- **Sign-in**: Magic link (`signInWithOtp`) or OAuth (Google, GitHub) → `/auth/callback` → `exchangeCodeForSession` → redirect home.
- **Route protection**: `proxy.ts` (middleware) calls `getClaims()` on every request. Stale refresh tokens are cleared automatically. Protected routes (`/problems/[slug]`, `/api/evaluate`) redirect unauthenticated users to `/signin`.
- **Sign-out**: `signOutAction` server action calls the `SignOutUseCase` → `supabase.auth.signOut({ scope: "local" })` → redirect home.

## Where schemas live

- Domain invariants → `src/domain/entities/{entity}.schema.ts` (source of truth)
- Request DTOs → `src/application/use-cases/{use-case}/{use-case}.request.dto.ts` (Zod, composes domain schemas)
- Response DTOs → `src/application/use-cases/{use-case}/{use-case}.response.dto.ts` (plain type, not Zod)
- Form validation → reuse the request DTO directly, no second schema