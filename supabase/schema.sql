-- =============================================================
-- Hobby Marketplace  |  Supabase / PostgreSQL schema
-- Run this in the Supabase Dashboard → SQL Editor.
-- (Drops the previous HOA tables first.)
-- =============================================================

-- Clean slate from the previous HOA schema -------------------
drop table if exists public.issues    cascade;
drop table if exists public.expenses  cascade;
drop table if exists public.payments  cascade;
drop table if exists public.users     cascade;
drop table if exists public.buildings cascade;

-- 1. PROFILES (one row per auth user; id == auth.users.id) ----
create table public.profiles (
  id          uuid primary key references auth.users (id) on delete cascade,
  role        text not null check (role in ('customer', 'hobbyist')),
  name        text not null,
  phone       text,                      -- used for the WhatsApp/phone reveal
  bio         text,
  location    text,
  avatar_url  text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- 2. CATEGORIES (seeded Hebrew hobby categories) --------------
create table public.categories (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,             -- Hebrew display name
  slug       text not null unique,      -- url-safe latin slug for /?category=
  created_at timestamptz not null default now()
);

-- 3. LISTINGS (service listings published by hobbyists) -------
create table public.listings (
  id           uuid primary key default gen_random_uuid(),
  hobbyist_id  uuid not null references public.profiles (id)   on delete cascade,
  category_id  uuid not null references public.categories (id) on delete restrict,
  title        text not null,
  description  text not null,
  price        numeric(10, 2) not null check (price >= 0),
  price_unit   text not null default 'fixed'
                 check (price_unit in ('fixed', 'hour', 'session', 'item')),
  location     text,
  image_url    text,
  status       text not null default 'active'
                 check (status in ('active', 'paused')),
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create index listings_category_idx on public.listings (category_id);
create index listings_hobbyist_idx on public.listings (hobbyist_id);
create index listings_status_idx   on public.listings (status);

-- 4. CATEGORY SEED --------------------------------------------
insert into public.categories (name, slug) values
  ('צילום',          'photography'),
  ('אפייה',          'baking'),
  ('קונדיטוריה',     'patisserie'),
  ('נגרות',          'carpentry'),
  ('מוזיקה',         'music'),
  ('עיצוב גרפי',     'graphic-design'),
  ('שיעורים פרטיים', 'tutoring'),
  ('גינון',          'gardening'),
  ('כתיבה ותרגום',   'writing-translation'),
  ('עבודות יד',      'handmade');

-- =============================================================
-- Row Level Security (enabled; policies deferred — matches the
-- existing approach. MVP data access runs server-side with the
-- service-role key, which bypasses RLS, so no policies yet.)
-- =============================================================
alter table public.profiles   enable row level security;
alter table public.categories enable row level security;
alter table public.listings   enable row level security;
