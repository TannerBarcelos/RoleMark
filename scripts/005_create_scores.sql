-- Resume AI scores
create table if not exists public.resume_scores (
  id uuid primary key default gen_random_uuid(),
  resume_id uuid not null references public.resumes(id) on delete cascade,
  job_description_id uuid not null references public.job_descriptions(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  overall_score int,
  scores jsonb,
  weaknesses jsonb,
  strengths jsonb,
  suggestions jsonb,
  created_at timestamptz not null default now()
);

alter table public.resume_scores enable row level security;

create policy "scores_select_own" on public.resume_scores
  for select using (auth.uid() = user_id);

create policy "scores_insert_own" on public.resume_scores
  for insert with check (auth.uid() = user_id);

create policy "scores_update_own" on public.resume_scores
  for update using (auth.uid() = user_id);

create policy "scores_delete_own" on public.resume_scores
  for delete using (auth.uid() = user_id);
