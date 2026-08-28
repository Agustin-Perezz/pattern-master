# src/app/

Next.js App Router delivery layer.

- `page.tsx` = composition only — imports + arranges components, fetches server data. No logic, no inline styles.
- `actions.ts` = server actions + data fetchers (`"use server"`). Creates Supabase client per-request, calls container, returns data.
- `queries.ts` = read-only data fetchers for Server Components. Plain async functions that call the container and return data. Used by `page.tsx`.
- `components/` = route-private components. Named with feature prefix (`ChallengeCard`, not `Card`). 50-line hard limit per component, split at 40.
- `"use client"` only on leaf components that need hooks/events/browser APIs. Keep server/client boundary as low as possible.
- `hooks/` = route-private hooks. Promote to `src/hooks/` if used by 2+ routes.
- Import shared UI via `@/components/ui/*`, hooks via `@/hooks/*`, utils via `@/lib/*`.

## SOLID in the delivery layer

Next.js App Router makes it easy to violate SOLID without noticing — fat pages, god components, server actions that do everything. These rules keep the delivery layer honest.

**Single Responsibility** — each file has one job. `page.tsx` composes, `actions.ts`/`queries.ts` fetch/mutate via the container, components render one concern, hooks encapsulate one piece of UI state. If a file's description needs "and", split it.

**Open/Closed** — extend components through composition and props, not by editing their internals. Prefer slot patterns (`children`, render props) over branching logic inside a component for every new variant.

```tsx
// Bad — closed: every new variant adds a branch here
function ChallengeCard({ challenge, variant }: { challenge: Challenge; variant: "compact" | "detailed" | "admin" }) {
  if (variant === "compact") return <CompactLayout challenge={challenge} />;
  if (variant === "admin") return <AdminLayout challenge={challenge} />;
  return <DetailedLayout challenge={challenge} />;
}

// Good — open: new layouts don't touch this component
function ChallengeCard({ challenge, children }: { challenge: Challenge; children: React.ReactNode }) {
  return <article>{children}</article>;
}
// Call site: <ChallengeCard challenge={c}><AdminLayout challenge={c} /></ChallengeCard>
```

**Liskov Substitution** — a component must honour its prop contract. No "special" component that silently requires props it declares as optional, or returns a different shape than its siblings. If `ChallengeList` accepts `challenges: Challenge[]`, any component accepting `challenges: Challenge[]` is a valid drop-in replacement.

**Interface Segregation** — don't pass a fat object when a component needs two fields. Split props so components depend only on what they use.

```tsx
// Bad — ChallengeTitle depends on the entire Challenge, but only uses title
function ChallengeTitle({ challenge }: { challenge: Challenge }) {
  return <h2>{challenge.title}</h2>;
}

// Good — ChallengeTitle depends only on what it uses
function ChallengeTitle({ title }: { title: string }) {
  return <h2>{title}</h2>;
}
```

**Dependency Inversion** — delivery layer depends on container abstractions and DTOs, never concrete repositories or use case classes. `actions.ts`/`queries.ts` call the container, which wires the use case to the repository interface. See `docs/architecture.md` "Dependency rules".

```tsx
// Bad — delivery layer knows about the repository
import { SupabaseGetChallengesRepository } from "@/infrastructure/database/postgres/repositories/challenges/supabase-get-challenges.repository";
const repository = new SupabaseGetChallengesRepository(supabase);

// Good — delivery layer knows only the container
import { createChallengeContainer } from "@/lib/containers/challenge.container";
const { list } = createChallengeContainer(supabase);
```

Page shape — composition only, data fetched here and passed down:

```tsx
export default async function BooksPage() {
  const books = await getBooks();
  return (
    <main>
      <BookHeader />
      <BookCreateForm />
      <BookList books={books} />
    </main>
  );
}
```