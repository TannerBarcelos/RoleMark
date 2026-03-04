-- Companies a user is applying to
create table if not exists public.companies (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  website text,
  logo_url text,
  notes text,
  created_at timestamptz not null default now()
);

alter table public.companies enable row level security;

create policy "companies_select_own" on public.companies
  for select using (auth.uid() = user_id);

create policy "companies_insert_own" on public.companies
  for insert with check (auth.uid() = user_id);

create policy "companies_update_own" on public.companies
  for update using (auth.uid() = user_id);

create policy "companies_delete_own" on public.companies
  for delete using (auth.uid() = user_id);
