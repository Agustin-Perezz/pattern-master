create type difficulty_enum as enum ('Easy', 'Medium', 'Hard');

create table if not exists public.challenges (
  slug text primary key,
  title text not null,
  category text not null,
  difficulty difficulty_enum not null,
  summary text not null,
  challenge text not null,
  description text not null,
  description_code text,
  starter_file text not null,
  starter_code text not null,
  editor_file text not null,
  editor_code text not null,
  created_at timestamptz not null default now()
);

alter table public.challenges enable row level security;

create policy "Anyone can read challenges"
  on public.challenges
  for select
  to anon, authenticated
  using (true);

grant select on public.challenges to anon, authenticated;
