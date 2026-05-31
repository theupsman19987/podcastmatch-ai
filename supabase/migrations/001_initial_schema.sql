-- ═══════════════════════════════════════════════════════════════════════════
--  PodcastMatch AI — Initial Database Schema
--  Run this in Supabase SQL Editor: https://supabase.com/dashboard → SQL Editor
-- ═══════════════════════════════════════════════════════════════════════════

-- ── 1. Profiles ─────────────────────────────────────────────────────────────
-- Extends auth.users with display info. Created automatically via trigger.

create table if not exists public.profiles (
  id          uuid        references auth.users on delete cascade not null primary key,
  email       text        not null,
  full_name   text,
  avatar_url  text,
  created_at  timestamptz default now() not null,
  updated_at  timestamptz default now() not null
);

-- ── 2. Creator DNA Assessments ───────────────────────────────────────────────
-- Stores the 7-step assessment answers. One row per user.

create table if not exists public.dna_assessments (
  id           uuid        default gen_random_uuid() primary key,
  user_id      uuid        references auth.users on delete cascade not null,
  answers      jsonb       not null default '{}',
  completed    boolean     not null default false,
  completed_at timestamptz,
  created_at   timestamptz default now() not null,
  updated_at   timestamptz default now() not null,
  unique (user_id)
);

-- ── 3. Creator Profiles ──────────────────────────────────────────────────────
-- Generated from DNA assessment. One row per user.

create table if not exists public.creator_profiles (
  id                  uuid        default gen_random_uuid() primary key,
  user_id             uuid        references auth.users on delete cascade not null,
  archetype           text,
  category            text,
  title               text,
  brand_identity      jsonb       not null default '{}',
  strengths           jsonb       not null default '{}',
  audience_profile    jsonb       not null default '{}',
  speaking_topics     text[]      not null default '{}',
  visibility_score    integer     not null default 0,
  ai_alignment_score  integer     not null default 0,
  raw_dna_data        jsonb       not null default '{}',
  created_at          timestamptz default now() not null,
  updated_at          timestamptz default now() not null,
  unique (user_id)
);

-- ── 4. Saved Podcasts ────────────────────────────────────────────────────────
-- Podcasts the user has bookmarked. Stores a snapshot of the podcast data.

create table if not exists public.saved_podcasts (
  id           uuid        default gen_random_uuid() primary key,
  user_id      uuid        references auth.users on delete cascade not null,
  podcast_id   text        not null,
  podcast_data jsonb       not null,
  saved_at     timestamptz default now() not null,
  unique (user_id, podcast_id)
);

-- ── 5. Match History ─────────────────────────────────────────────────────────
-- Records every podcast the user has viewed + its match score.

create table if not exists public.match_history (
  id          uuid        default gen_random_uuid() primary key,
  user_id     uuid        references auth.users on delete cascade not null,
  podcast_id  text        not null,
  match_score integer     not null default 0,
  match_data  jsonb       not null default '{}',
  viewed_at   timestamptz,
  saved       boolean     not null default false,
  created_at  timestamptz default now() not null,
  unique (user_id, podcast_id)
);

-- ── 6. User Settings ─────────────────────────────────────────────────────────
-- All user preferences stored as JSONB sections. One row per user.

create table if not exists public.user_settings (
  id                    uuid        default gen_random_uuid() primary key,
  user_id               uuid        references auth.users on delete cascade not null,
  profile_settings      jsonb       not null default '{}',
  notification_settings jsonb       not null default '{}',
  creator_preferences   jsonb       not null default '{}',
  account_settings      jsonb       not null default '{}',
  updated_at            timestamptz default now() not null,
  unique (user_id)
);

-- ═══════════════════════════════════════════════════════════════════════════
--  Row Level Security
--  All tables are locked down: users can only access their own rows.
-- ═══════════════════════════════════════════════════════════════════════════

alter table public.profiles        enable row level security;
alter table public.dna_assessments enable row level security;
alter table public.creator_profiles enable row level security;
alter table public.saved_podcasts  enable row level security;
alter table public.match_history   enable row level security;
alter table public.user_settings   enable row level security;

-- profiles
create policy "profiles: own row only"
  on public.profiles for all
  using      (auth.uid() = id)
  with check (auth.uid() = id);

-- dna_assessments
create policy "dna_assessments: own rows only"
  on public.dna_assessments for all
  using      (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- creator_profiles
create policy "creator_profiles: own rows only"
  on public.creator_profiles for all
  using      (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- saved_podcasts
create policy "saved_podcasts: own rows only"
  on public.saved_podcasts for all
  using      (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- match_history
create policy "match_history: own rows only"
  on public.match_history for all
  using      (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- user_settings
create policy "user_settings: own rows only"
  on public.user_settings for all
  using      (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ═══════════════════════════════════════════════════════════════════════════
--  Auto-create profile + settings on new sign-up
-- ═══════════════════════════════════════════════════════════════════════════

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data ->> 'full_name'
  )
  on conflict (id) do nothing;

  insert into public.user_settings (user_id)
  values (new.id)
  on conflict (user_id) do nothing;

  return new;
end;
$$;

-- Drop + recreate trigger (idempotent)
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
