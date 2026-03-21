-- Mission Control — SA Horizon
-- Run this in your Supabase SQL Editor

create extension if not exists "uuid-ossp";

-- Agent Status
create table if not exists agent_status (
  id            uuid primary key default uuid_generate_v4(),
  agent_name    text not null unique,
  status        text not null default 'offline' check (status in ('online','offline','error','idle')),
  current_task  text,
  tasks_in_queue integer not null default 0,
  metadata      jsonb not null default '{}',
  updated_at    timestamptz not null default now()
);

-- Alerts
create table if not exists alerts (
  id           uuid primary key default uuid_generate_v4(),
  type         text not null check (type in ('system','business','task','health','communication')),
  severity     text not null check (severity in ('info','warning','critical')),
  title        text not null,
  message      text not null,
  source_panel text,
  acknowledged boolean not null default false,
  created_at   timestamptz not null default now()
);

-- Automation Status (OpenClaw crons + anything)
create table if not exists automation_status (
  id               uuid primary key default uuid_generate_v4(),
  automation_name  text not null unique,
  platform         text not null default 'unknown',
  last_status      text not null default 'unknown' check (last_status in ('success','failed','running','unknown')),
  next_run         timestamptz,
  error_message    text,
  updated_at       timestamptz not null default now()
);

-- Financials (mock / future bank sync)
create table if not exists financials (
  id           uuid primary key default uuid_generate_v4(),
  account_name text not null unique,
  balance      numeric not null default 0,
  currency     text not null default 'USD',
  updated_at   timestamptz not null default now()
);

-- Telegram Messages (Max pushes here from OpenClaw)
create table if not exists telegram_messages (
  id           uuid primary key default uuid_generate_v4(),
  message_text text not null,
  from_user    text not null default 'unknown',
  urgency      text not null default 'normal' check (urgency in ('low','normal','high')),
  read         boolean not null default false,
  created_at   timestamptz not null default now()
);

-- Indexes
create index if not exists idx_agent_name on agent_status(agent_name);
create index if not exists idx_alerts_ack on alerts(acknowledged, created_at desc);
create index if not exists idx_automation_name on automation_status(automation_name);
create index if not exists idx_telegram_created on telegram_messages(created_at desc);

-- Enable Realtime
alter publication supabase_realtime add table agent_status;
alter publication supabase_realtime add table alerts;
alter publication supabase_realtime add table automation_status;
alter publication supabase_realtime add table telegram_messages;
