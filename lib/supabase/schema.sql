-- Arrow Industries — website capture schema (Phase 1)
-- Run this in the Supabase SQL editor for the Arrow project.
--
-- Two tables feed the future Arrow dashboard:
--   leads        — quote (/request-a-quote) + finance (/finance) enquiries
--   applications — careers (/careers) applications, with server-side score
--
-- The website writes with the service-role key (server actions only), which
-- bypasses RLS. RLS is enabled with NO public policies, so the anon/public
-- key can neither read nor write. The dashboard (Phase 2) will add policies
-- for authenticated staff.

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- leads: sales enquiries from the quote + finance forms
-- ---------------------------------------------------------------------------
create table if not exists public.leads (
  id               uuid primary key default gen_random_uuid(),
  created_at       timestamptz not null default now(),
  source           text not null,            -- 'quote' | 'finance'
  status           text not null default 'new',
  name             text not null,
  business_name    text,
  email            text,
  phone            text,
  location         text,                      -- suburb / town
  enquiry_type     text,                      -- quote: enquiry type · finance: equipment
  finance_type     text,                      -- finance only
  estimated_amount text,                      -- finance only
  timeframe        text,
  message          text,
  attachments      text[] not null default '{}',
  details          jsonb  not null default '{}'::jsonb, -- full raw payload
  assigned_to      text,                      -- dashboard: owner
  notes            text                       -- dashboard: internal notes
);

create index if not exists leads_created_at_idx on public.leads (created_at desc);
create index if not exists leads_source_idx     on public.leads (source);
create index if not exists leads_status_idx     on public.leads (status);

alter table public.leads enable row level security;

-- ---------------------------------------------------------------------------
-- applications: careers applications, with server-side scoring
-- ---------------------------------------------------------------------------
create table if not exists public.applications (
  id                  uuid primary key default gen_random_uuid(),
  created_at          timestamptz not null default now(),
  status              text not null default 'new',
  name                text not null,
  email               text,
  mobile              text,
  suburb              text,
  role                text,
  industry_experience text,
  years_experience    text,
  work_rights         text,
  availability        text,
  score               integer,
  category            text,                   -- Priority Interview / Interview Review / ...
  why_hire            text,
  message             text,
  resume_names        text[] not null default '{}',
  details             jsonb  not null default '{}'::jsonb, -- tickets/licences etc.
  assigned_to         text,
  notes               text
);

create index if not exists applications_created_at_idx on public.applications (created_at desc);
create index if not exists applications_status_idx     on public.applications (status);
create index if not exists applications_score_idx      on public.applications (score desc);

alter table public.applications enable row level security;
