-- Cover letters
create table if not exists public.cover_letters (
  id uuid primary key default gen_random_uuid(),
  resume_id uuid references public.resumes(id) on delete cascade,
  job_description_id uuid references public.job_descriptions(id),
  user_id uuid not null references auth.users(id) on delete cascade,
  content jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.cover_letters enable row level security;

create policy "cover_letters_select_own" on public.cover_letters
  for select using (auth.uid() = user_id);

create policy "cover_letters_insert_own" on public.cover_letters
  for insert with check (auth.uid() = user_id);

create policy "cover_letters_update_own" on public.cover_letters
  for update using (auth.uid() = user_id);

create policy "cover_letters_delete_own" on public.cover_letters
  for delete using (auth.uid() = user_id);
