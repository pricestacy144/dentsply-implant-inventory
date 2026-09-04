-- V72 Cloud Inventory Foundation
-- Run in Supabase SQL Editor.
-- This schema intentionally contains no pricing/cost fields.

create extension if not exists pgcrypto;

create table if not exists public.practices (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.practice_members (
  id uuid primary key default gen_random_uuid(),
  practice_id uuid not null references public.practices(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null default 'staff' check (role in ('owner','admin','manager','staff','viewer')),
  created_at timestamptz not null default now(),
  unique(practice_id,user_id)
);

create table if not exists public.practice_locations (
  id uuid primary key default gen_random_uuid(),
  practice_id uuid not null references public.practices(id) on delete cascade,
  name text not null,
  parent_id uuid references public.practice_locations(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists public.inventory (
  id uuid primary key default gen_random_uuid(),
  practice_id uuid not null references public.practices(id) on delete cascade,
  ref text not null,
  lot text not null,
  expiration_date date,
  manufacture_date date,
  ownership text not null default 'Practice Owned' check (ownership in ('Practice Owned','Consignment')),
  quantity integer not null default 0 check (quantity >= 0),
  expected_quantity integer,
  location_id uuid references public.practice_locations(id) on delete set null,
  quarantined boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(practice_id,ref,lot,ownership)
);

create table if not exists public.inventory_transactions (
  id uuid primary key default gen_random_uuid(),
  practice_id uuid not null references public.practices(id) on delete cascade,
  inventory_id uuid references public.inventory(id) on delete set null,
  action text not null,
  ref text,
  lot text,
  quantity integer,
  ownership text,
  patient_case_id text,
  location text,
  notes text,
  user_id uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists public.implant_cases (
  id uuid primary key default gen_random_uuid(),
  practice_id uuid not null references public.practices(id) on delete cascade,
  patient_case_id text not null,
  date_placed date,
  doctor text,
  tooth_site text,
  ref text,
  lot text,
  quantity integer not null default 1 check (quantity > 0),
  warranty_status text,
  notes text,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists idx_inventory_practice on public.inventory(practice_id);
create index if not exists idx_transactions_practice on public.inventory_transactions(practice_id);
create index if not exists idx_cases_practice on public.implant_cases(practice_id);

create or replace function public.is_practice_member(target_practice uuid)
returns boolean language sql stable security definer set search_path = public
as $$ select exists (
  select 1 from public.practice_members pm
  where pm.practice_id = target_practice and pm.user_id = auth.uid()
); $$;

alter table public.practices enable row level security;
alter table public.practice_members enable row level security;
alter table public.practice_locations enable row level security;
alter table public.inventory enable row level security;
alter table public.inventory_transactions enable row level security;
alter table public.implant_cases enable row level security;

drop policy if exists "practice members can view practice" on public.practices;
create policy "practice members can view practice" on public.practices for select to authenticated
using (public.is_practice_member(id));

drop policy if exists "members can view memberships" on public.practice_members;
create policy "members can view memberships" on public.practice_members for select to authenticated
using (user_id = auth.uid() or public.is_practice_member(practice_id));

drop policy if exists "members can access locations" on public.practice_locations;
create policy "members can access locations" on public.practice_locations for all to authenticated
using (public.is_practice_member(practice_id))
with check (public.is_practice_member(practice_id));

drop policy if exists "members can access inventory" on public.inventory;
create policy "members can access inventory" on public.inventory for all to authenticated
using (public.is_practice_member(practice_id))
with check (public.is_practice_member(practice_id));

drop policy if exists "members can access transactions" on public.inventory_transactions;
create policy "members can access transactions" on public.inventory_transactions for all to authenticated
using (public.is_practice_member(practice_id))
with check (public.is_practice_member(practice_id));

drop policy if exists "members can access cases" on public.implant_cases;
create policy "members can access cases" on public.implant_cases for all to authenticated
using (public.is_practice_member(practice_id))
with check (public.is_practice_member(practice_id));

-- Grants are intentionally limited to authenticated users.
grant select, insert, update, delete on public.practices to authenticated;
grant select, insert, update, delete on public.practice_members to authenticated;
grant select, insert, update, delete on public.practice_locations to authenticated;
grant select, insert, update, delete on public.inventory to authenticated;
grant select, insert, update, delete on public.inventory_transactions to authenticated;
grant select, insert, update, delete on public.implant_cases to authenticated;
