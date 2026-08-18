create table if not exists public.submissions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  challenge_slug text not null references public.challenges(slug) on delete cascade,
  submitted_code text not null,
  score int not null check (score >= 0 and score <= 100),
  pattern_applied boolean not null,
  feedback_json jsonb not null,
  created_at timestamptz not null default now()
);

alter table public.submissions enable row level security;

create policy "Users can view own submissions"
  on public.submissions
  for select
  to authenticated
  using (auth.uid() = user_id);

create policy "Users can insert own submissions"
  on public.submissions
  for insert
  to authenticated
  with check (auth.uid() = user_id);

grant select, insert on public.submissions to authenticated;
