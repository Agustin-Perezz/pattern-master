## Supabase

Supabase (Postgres + Auth + Storage) wired via `@supabase/ssr` for cookie-based auth in the Next.js App Router.

**Required env vars** (app crashes if missing — no defaults):

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`

## Getting Started

This project uses a **local Supabase stack** for development and tests. The app's `.env` points to `http://127.0.0.1:55321` (not a remote project).

**Prerequisites**: Docker running, Supabase CLI installed (`brew install supabase/tap/supabase` or see [CLI docs](https://supabase.com/docs/guides/local-development/cli/getting-started)).

```bash
# 1. Start the local stack (Docker, ~1 GB first pull, ~10s after)
supabase start

# 2. Get your API keys
supabase status -o env
# Copy API_URL, ANON_KEY (publishable), SERVICE_ROLE_KEY (secret)

# 3. Fill in .env (app dev) and .env.test (tests)
# .env:
#   NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:55321
#   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=<publishable key>
#   OPENAI_API_KEY=<your-openai-api-key>
# .env.test:
#   SUPABASE_URL=http://127.0.0.1:55321
#   SUPABASE_SERVICE_ROLE_KEY=<secret key>
#   NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:55321
#   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=<publishable key>

# 4. Fill in supabase/.env (ports + OAuth secrets)
#    See the "supabase/.env configuration" section below for the full table.
#    supabase/.env:
#   SUPABASE_API_PORT=55321
#   SUPABASE_DB_PORT=55322
#   SUPABASE_DB_SHADOW_PORT=55320
#   SUPABASE_STUDIO_PORT=55323
#   SUPABASE_INBUCKET_PORT=55324
#   SUPABASE_ANALYTICS_PORT=55327
#   SUPABASE_AUTH_EXTERNAL_GOOGLE_CLIENT_SECRET=<google secret>   # optional
#   SUPABASE_AUTH_EXTERNAL_GITHUB_CLIENT_SECRET=<github secret>   # optional

# 5. Studio GUI at http://127.0.0.1:55323
#    Mailpit (email testing) at http://127.0.0.1:55324
```

**Auth providers:** Email (magic link) works by default. Mailpit captures the emails. Google and GitHub OAuth need provider setup and secrets in `supabase/.env`. See the "Auth providers local development" section below.

## `supabase/.env` configuration

Per-developer port block and OAuth secrets. Gitignore this file. Do not commit real secrets.

| Variable                                  | Description                          |
| ----------------------------------------- | ------------------------------------ |
| `SUPABASE_API_PORT`                       | API port (default 55321)             |
| `SUPABASE_DB_PORT`                        | Postgres port (default 55322)       |
| `SUPABASE_DB_SHADOW_PORT`                 | Shadow DB port (default 55320)      |
| `SUPABASE_STUDIO_PORT`                    | Studio GUI port (default 55323)     |
| `SUPABASE_INBUCKET_PORT`                   | Mailpit email port (default 55324)   |
| `SUPABASE_ANALYTICS_PORT`                 | Analytics port (default 55327)       |
| `SUPABASE_AUTH_EXTERNAL_GOOGLE_CLIENT_SECRET`  | Google OAuth secret (optional) |
| `SUPABASE_AUTH_EXTERNAL_GITHUB_CLIENT_SECRET`  | GitHub OAuth secret (optional) |

Each developer picks a distinct 5-port block to avoid conflicts between projects. See "Port conflicts between projects" below.

## Commands

```bash
supabase start                 # Start local stack
supabase stop                  # Stop stack (data persists)
supabase stop --no-backup      # Stop and wipe all data
supabase status -o env         # Show URLs + keys
supabase db reset              # Wipe DB, replay migrations + seed
supabase migration new <name> # Create a blank migration
supabase db pull               # Pull remote schema into a new local migration
supabase db push               # Apply local migrations to the linked remote project
pnpm supabase:gen-types        # Regenerate database.types.ts from local DB
```

## Port conflicts between projects

CLI defaults every project to ports 54321–54327. Two projects on the same machine collide.

This project uses `env()` port indirection in `supabase/config.toml` — actual port values live in `supabase/.env` (gitignored). Each developer picks a distinct 5-port block:

```bash
# supabase/.env — this project uses 55321–55327
SUPABASE_API_PORT=55321
SUPABASE_DB_PORT=55322
SUPABASE_DB_SHADOW_PORT=55320
SUPABASE_STUDIO_PORT=55323
SUPABASE_INBUCKET_PORT=55324
SUPABASE_ANALYTICS_PORT=55327
```

Give each project on your machine a different block (for example, project B uses 56321–56327). `config.toml` is committed (shared). `.env` is per-developer. CI reads ports dynamically from `supabase status -o env` — unaffected.

## Dev and tests share the same local DB

`pnpm dev` and `pnpm test` both point at `127.0.0.1:55321`. No separate test database.

`pnpm test` runs `supabase db reset` first — **wipes all data**, reapplies migrations + seed. Manual dev data is gone after a test run.

`supabase/seed.sql` re-creates reference data after every reset, so the DB returns to a known baseline, not empty. Keep it minimal — reference data only, not test fixtures. Test-specific data belongs in the test setup.

## Types and migrations: local vs remote

**Types** (`database.types.ts`) are a build artifact, not pushed to Supabase. Regenerate from local DB after schema changes, commit the file, and teammates get it via `git pull`. Never generate from remote during local dev — it causes drift.

**Migrations** live in `supabase/migrations/`, committed to git, run locally on every `db reset`. Pushing to remote is a deploy step:

```bash
supabase link --project-ref ypdlrfoioxdlcowdjpiz   # One-time per machine
supabase db push --dry-run                         # Preview
supabase db push                                   # Apply pending migrations to remote
```

Push when schema changes are ready for staging/prod — not on every commit. `db push` skips already-applied migrations (safe to re-run). Seed is never pushed by default. Use `--include-seed` for dev/staging only, never prod.

**Pulling remote changes** (schema drift recovery):

```bash
supabase db pull    # New local migration from remote diff
supabase db reset   # Verify locally
```

Prefer local-first changes — keeps migrations as the source of truth.

## Auth providers local development

### Email (magic link)

Works by default — no config needed. Local Supabase Auth has email enabled by default. Mailpit captures the emails at `http://127.0.0.1:55324` (it does not send them). Open the Mailpit UI to click the magic link during dev.

### OAuth (Google, GitHub)

`config.toml` has `[auth.external.google]` and `[auth.external.github]` with `enabled = true` and `client_id` (not a secret — safe to commit). The `secret` uses `env()` indirection. Fill it in `supabase/.env` (gitignored):

```bash
SUPABASE_AUTH_EXTERNAL_GOOGLE_CLIENT_SECRET=<secret>
SUPABASE_AUTH_EXTERNAL_GITHUB_CLIENT_SECRET=<secret>
```

Put your `client_id` directly in `config.toml` (it is not a secret). Then restart the stack (`supabase stop && supabase start`).

**Provider setup** (client ID, secret, redirect URIs): follow the official Supabase guides — [Google](https://supabase.com/docs/guides/auth/social-login/auth-google#local-development), [GitHub](https://supabase.com/docs/guides/auth/social-login/auth-github). The local callback URL is `http://127.0.0.1:55321/auth/v1/callback` (the port matches `SUPABASE_API_PORT`).