-- One-time purchases
create table if not exists public.purchases (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  resume_id uuid references public.resumes(id),
  stripe_payment_intent_id text,
  stripe_checkout_session_id text,
  product_type text not null,
  amount_cents int not null,
  status text not null default 'pending',
  created_at timestamptz not null default now()
);

alter table public.purchases enable row level security;

create policy "purchases_select_own" on public.purchases
  for select using (auth.uid() = user_id);

create policy "purchases_insert_own" on public.purchases
  for insert with check (auth.uid() = user_id);

create policy "purchases_update_own" on public.purchases
  for update using (auth.uid() = user_id);

create policy "purchases_delete_own" on public.purchases
  for delete using (auth.uid() = user_id);
