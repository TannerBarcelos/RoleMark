-- Resumes table
create table if not exists public.resumes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  company_id uuid references public.companies(id) on delete set null,
  title text not null,
  original_file_url text,
  original_text text,
  status text not null default 'uploaded',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.resumes enable row level security;

create policy "resumes_select_own" on public.resumes
  for select using (auth.uid() = user_id);

create policy "resumes_insert_own" on public.resumes
  for insert with check (auth.uid() = user_id);

create policy "resumes_update_own" on public.resumes
  for update using (auth.uid() = user_id);

create policy "resumes_delete_own" on public.resumes
  for delete using (auth.uid() = user_id);

-- Resume versions for versioning system
create table if not exists public.resume_versions (
  id uuid primary key default gen_random_uuid(),
  resume_id uuid not null references public.resumes(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  version_number int not null,
  content jsonb not null,
  label text,
  is_current boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.resume_versions enable row level security;

create policy "resume_versions_select_own" on public.resume_versions
  for select using (auth.uid() = user_id);

create policy "resume_versions_insert_own" on public.resume_versions
  for insert with check (auth.uid() = user_id);

create policy "resume_versions_update_own" on public.resume_versions
  for update using (auth.uid() = user_id);

create policy "resume_versions_delete_own" on public.resume_versions
  for delete using (auth.uid() = user_id);
