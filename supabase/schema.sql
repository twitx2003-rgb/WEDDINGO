-- =============================================================
-- Vaad-Tech — HOA Manager  |  Supabase / PostgreSQL schema
-- Run this in the Supabase Dashboard → SQL Editor
-- =============================================================

-- 1. BUILDINGS ------------------------------------------------
create table public.buildings (
  id               uuid primary key default gen_random_uuid(),
  address          text not null,
  total_apartments int  not null check (total_apartments > 0),
  monthly_fee      numeric(10, 2) not null check (monthly_fee >= 0),
  created_at       timestamptz not null default now()
);

-- 2. USERS (admins + tenants) ---------------------------------
create table public.users (
  id               uuid primary key default gen_random_uuid(),
  building_id      uuid not null references public.buildings (id) on delete cascade,
  -- links to auth.users for admins; null for token-link tenants
  auth_id          uuid unique,
  name             text not null,
  apartment_number text not null,
  phone            text,
  role             text not null check (role in ('admin', 'tenant')),
  -- unguessable token used as the tenant's magic portal URL
  access_token     uuid not null unique default gen_random_uuid(),
  created_at       timestamptz not null default now()
);

-- 3. PAYMENTS -------------------------------------------------
create table public.payments (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references public.users (id) on delete cascade,
  month      int  not null check (month between 1 and 12),
  year       int  not null check (year >= 2000),
  amount     numeric(10, 2) not null check (amount >= 0),
  status     text not null default 'unpaid' check (status in ('paid', 'unpaid')),
  created_at timestamptz not null default now(),
  -- one payment record per tenant per month/year
  unique (user_id, month, year)
);

-- 4. EXPENSES -------------------------------------------------
create table public.expenses (
  id          uuid primary key default gen_random_uuid(),
  building_id uuid not null references public.buildings (id) on delete cascade,
  description text not null,
  amount      numeric(10, 2) not null check (amount >= 0),
  date        date not null,
  created_at  timestamptz not null default now()
);

-- 5. ISSUES (service tickets) ---------------------------------
create table public.issues (
  id                   uuid primary key default gen_random_uuid(),
  building_id          uuid not null references public.buildings (id) on delete cascade,
  reported_by_user_id  uuid not null references public.users (id) on delete cascade,
  description          text not null,
  status               text not null default 'open'
                         check (status in ('open', 'in_progress', 'resolved')),
  created_at           timestamptz not null default now()
);

-- =============================================================
-- Row Level Security (enabled; policies added in a later step)
-- MVP data access runs server-side via the service-role key,
-- which bypasses RLS entirely, so no policies are needed yet.
-- =============================================================
alter table public.buildings enable row level security;
alter table public.users      enable row level security;
alter table public.payments   enable row level security;
alter table public.expenses   enable row level security;
alter table public.issues     enable row level security;
