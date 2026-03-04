-- Job descriptions linked to a resume
create table if not exists public.job_descriptions (
  id uuid primary key default gen_random_uuid(),
  resume_id uuid not null references public.resumes(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  source_type text not null default 'text',
  source_url text,
  title text,
  company_name text,
  raw_text text not null,
  created_at timestamptz not null default now()
);

alter table public.job_descriptions enable row level security;

create policy "jd_select_own" on public.job_descriptions
  for select using (auth.uid() = user_id);

create policy "jd_insert_own" on public.job_descriptions
  for insert with check (auth.uid() = user_id);

create policy "jd_update_own" on public.job_descriptions
  for update using (auth.uid() = user_id);

create policy "jd_delete_own" on public.job_descriptions
  for delete using (auth.uid() = user_id);
