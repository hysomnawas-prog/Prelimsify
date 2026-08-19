-- Prelimsify Supabase schema + Row Level Security
-- Run this file in Supabase Dashboard -> SQL Editor.
-- Safe to run more than once.

create extension if not exists pgcrypto;

-- ------------------------------------------------------------
-- 1. Student profile
-- ------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  avatar_url text,
  email text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ------------------------------------------------------------
-- 2. Saved question-set projects
--    paper stores the complete question-set JSON.
-- ------------------------------------------------------------
create table if not exists public.quiz_projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  project_number integer not null,
  paper jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint quiz_projects_user_project_number_key unique (user_id, project_number)
);

create index if not exists quiz_projects_user_id_idx
  on public.quiz_projects(user_id);

-- ------------------------------------------------------------
-- 3. Completed test / grade history
-- ------------------------------------------------------------
create table if not exists public.test_history (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  title text not null,
  marks numeric not null default 0,
  max_marks numeric not null default 0,
  percentage numeric not null default 0,
  passed boolean not null default false,
  correct integer not null default 0,
  wrong integer not null default 0,
  unanswered integer not null default 0,
  completed_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create index if not exists test_history_user_id_completed_at_idx
  on public.test_history(user_id, completed_at desc);

-- ------------------------------------------------------------
-- 4. Active / unfinished test
--    One active test per student. The JSON stores the resumable state.
-- ------------------------------------------------------------
create table if not exists public.active_tests (
  user_id uuid primary key default auth.uid() references auth.users(id) on delete cascade,
  title text not null default 'Unfinished Test',
  state jsonb not null,
  updated_at timestamptz not null default now()
);

-- ------------------------------------------------------------
-- updated_at helper
-- ------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

drop trigger if exists quiz_projects_set_updated_at on public.quiz_projects;
create trigger quiz_projects_set_updated_at
before update on public.quiz_projects
for each row execute function public.set_updated_at();

drop trigger if exists active_tests_set_updated_at on public.active_tests;
create trigger active_tests_set_updated_at
before update on public.active_tests
for each row execute function public.set_updated_at();

-- ------------------------------------------------------------
-- Automatically create/update a profile for authenticated users.
-- Google users get their name/email from auth.users metadata.
-- ------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, display_name, avatar_url, email)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name'),
    new.raw_user_meta_data ->> 'avatar_url',
    new.email
  )
  on conflict (id) do update set
    display_name = coalesce(excluded.display_name, profiles.display_name),
    avatar_url = coalesce(excluded.avatar_url, profiles.avatar_url),
    email = coalesce(excluded.email, profiles.email);
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

-- ------------------------------------------------------------
-- Row Level Security
-- ------------------------------------------------------------
alter table public.profiles enable row level security;
alter table public.quiz_projects enable row level security;
alter table public.test_history enable row level security;
alter table public.active_tests enable row level security;

-- Profiles: a student can only read/change their own profile.
drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own"
on public.profiles for select
to authenticated
using (id = auth.uid());

drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own"
on public.profiles for insert
to authenticated
with check (id = auth.uid());

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
on public.profiles for update
to authenticated
using (id = auth.uid())
with check (id = auth.uid());

-- Saved papers: only the owner can read/write/delete them.
drop policy if exists "quiz_projects_select_own" on public.quiz_projects;
create policy "quiz_projects_select_own"
on public.quiz_projects for select
to authenticated
using (user_id = auth.uid());

drop policy if exists "quiz_projects_insert_own" on public.quiz_projects;
create policy "quiz_projects_insert_own"
on public.quiz_projects for insert
to authenticated
with check (user_id = auth.uid());

drop policy if exists "quiz_projects_update_own" on public.quiz_projects;
create policy "quiz_projects_update_own"
on public.quiz_projects for update
to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

drop policy if exists "quiz_projects_delete_own" on public.quiz_projects;
create policy "quiz_projects_delete_own"
on public.quiz_projects for delete
to authenticated
using (user_id = auth.uid());

-- Grade history: only the owner can read/insert/update/delete their records.
drop policy if exists "test_history_select_own" on public.test_history;
create policy "test_history_select_own"
on public.test_history for select
to authenticated
using (user_id = auth.uid());

drop policy if exists "test_history_insert_own" on public.test_history;
create policy "test_history_insert_own"
on public.test_history for insert
to authenticated
with check (user_id = auth.uid());

drop policy if exists "test_history_update_own" on public.test_history;
create policy "test_history_update_own"
on public.test_history for update
to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

drop policy if exists "test_history_delete_own" on public.test_history;
create policy "test_history_delete_own"
on public.test_history for delete
to authenticated
using (user_id = auth.uid());

-- Active/unfinished test: only the owner can read/write it.
drop policy if exists "active_tests_select_own" on public.active_tests;
create policy "active_tests_select_own"
on public.active_tests for select
to authenticated
using (user_id = auth.uid());

drop policy if exists "active_tests_insert_own" on public.active_tests;
create policy "active_tests_insert_own"
on public.active_tests for insert
to authenticated
with check (user_id = auth.uid());

drop policy if exists "active_tests_update_own" on public.active_tests;
create policy "active_tests_update_own"
on public.active_tests for update
to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

drop policy if exists "active_tests_delete_own" on public.active_tests;
create policy "active_tests_delete_own"
on public.active_tests for delete
to authenticated
using (user_id = auth.uid());

-- Grant the normal authenticated role access to the tables.
-- RLS policies above still restrict rows to auth.uid().
grant select, insert, update, delete on public.profiles to authenticated;
grant select, insert, update, delete on public.quiz_projects to authenticated;
grant select, insert, update, delete on public.test_history to authenticated;
grant select, insert, update, delete on public.active_tests to authenticated;
