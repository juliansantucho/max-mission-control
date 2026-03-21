# Mission Control — SA Horizon

Real-time operations dashboard. Next.js 14 · Tailwind CSS · Supabase Realtime · dark theme.
Deployed on Vercel — auto-deploy on every push to `main`.

---

## 🔑 Dashboard API Key

```
ea6a512d3c67f9e59c4646c21145da45202abf8843460852bc9658625444ea96
```

Use this in the `x-api-key` header for all agent → dashboard API calls.

---

## Panels

| # | Panel | Data Source | Phase |
|---|-------|-------------|-------|
| 1 | Agent Status (full-width) | Supabase `agent_status` + realtime | 2 |
| 2 | Business Metrics | GHL API (contacts + pipeline) | 1 |
| 3 | Financial Overview | Supabase `financials` (mock) | 2 |
| 4 | Calendar & Pipeline | Calendly API (next 48h) | 1 |
| 5 | Communications | Supabase `telegram_messages` + realtime | 1 |
| 6 | Personal Performance | Placeholder | 3 |
| 7 | Daily Habits | Placeholder | 3 |
| 8 | Automations | Make.com API + Supabase `automation_status` | 1+2 |
| 9 | Alerts | Supabase `alerts` + realtime | 2 |

---

## Setup

### 1. Supabase

1. Create a project at [supabase.com](https://supabase.com)
2. Run the SQL in **`supabase/schema.sql`** in the SQL Editor
3. Copy your project URL, anon key, and service role key

### 2. Vercel Environment Variables

Add these in Vercel → Project → Settings → Environment Variables:

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY

DASHBOARD_API_KEY=ea6a512d3c67f9e59c4646c21145da45202abf8843460852bc9658625444ea96
NEXT_PUBLIC_DASHBOARD_API_KEY=ea6a512d3c67f9e59c4646c21145da45202abf8843460852bc9658625444ea96

GHL_API_KEY=pit-a0ccc641-31fc-4ccd-be6c-8fc2bc3c25df
GHL_LOCATION_ID=WxBbD2eeRqx3oYOHIzO3
GHL_PIPELINE_CRM=D7nNkjGWiF06GUnhF2Lj
GHL_PIPELINE_SALES=npq2H5DdUkxhY6jb3GNZ
GHL_BASE_URL=https://services.leadconnectorhq.com

CALENDLY_TOKEN=eyJraWQiOiIxY2UxZTEzNjE3ZGNmNzY2YjNjZWJjY2Y4ZGM1YmFmYThhNjVlNjg0MDIzZjdjMzJiZTgzNDliMjM4MDEzNWI0IiwidHlwIjoiUEFUIiwiYWxnIjoiRVMyNTYifQ.eyJpc3MiOiJodHRwczovL2F1dGguY2FsZW5kbHkuY29tIiwiaWF0IjoxNzcyNTUxMTUzLCJqdGkiOiIyMGUwNTM1Yy02OWYxLTQ1NTctYWY2YS02ODNlNDM2MTA4NzgiLCJ1c2VyX3V1aWQiOiIxYjNlMmRlYy0wZGJhLTQ5ZTEtODliMC1hMzExZmMwYTg1M2EifQ.L7rKul4aw0wZAcTQL_Dq2mW7himTuH4KtP4gFkHzV76VzYxVtfSZ03qsqTYLfu56Zjq37cQQzx-6k9Sxc1WDLQ

MAKE_API_KEY=26eb6038-9d3f-439f-91c3-67d88a23312d
MAKE_BASE_URL=https://us1.make.com/api/v2

CLICKUP_TOKEN=pk_78741764_2BI7VNG0J2UGPFGGYOZFPZ8YVEQSND0
CLICKUP_USER_ID=78741764
CLICKUP_WORKSPACE_ID=9013219708

GOOGLE_SHEETS_ID=1kBztcrM98YXRCw6P7hJZG8hJXGmS7uMoi4xxWDkRuKM
```

### 3. Local dev

```bash
npm install
cp .env.example .env.local   # fill in values
npm run dev
```

---

## API Routes

All routes require `x-api-key: <DASHBOARD_API_KEY>` header.

### POST /api/agent/heartbeat
```json
{
  "agent_name": "Max",
  "status": "online",
  "current_task": "Monitoring pipelines",
  "tasks_in_queue": 3,
  "metadata": {
    "uptime_minutes": 120,
    "model": "claude-opus-4-6",
    "gateway_port": 18789
  }
}
```

### POST /api/alerts
```json
{
  "type": "business",
  "severity": "warning",
  "title": "CPL spike detected",
  "message": "Average CPL rose 40% vs last week across dental campaigns",
  "source_panel": "automations"
}
```

### POST /api/automations/status
```json
{
  "automation_name": "Daily KPI Report",
  "platform": "n8n",
  "last_status": "success",
  "next_run": "2026-03-22T08:00:00Z"
}
```

### POST /api/alerts/:id/acknowledge
No body needed — marks alert as acknowledged.

---

## Supabase Schema

```sql
-- Run in Supabase SQL Editor
-- Full schema in supabase/schema.sql
```

See [`supabase/schema.sql`](./supabase/schema.sql) for the complete schema including:
- `agent_status` — agent heartbeats
- `alerts` — push from agents or automations
- `automation_status` — cron run results
- `financials` — account balances (mock → future bank API)
- `telegram_messages` — Max pushes incoming Telegram messages here

---

## Activating the Heartbeat (OpenClaw)

Once Vercel is live, activate the Max heartbeat:

```bash
# Test manually
curl -X POST https://your-vercel-url.vercel.app/api/agent/heartbeat \
  -H "x-api-key: ea6a512d3c67f9e59c4646c21145da45202abf8843460852bc9658625444ea96" \
  -H "Content-Type: application/json" \
  -d '{"agent_name":"Max","status":"online","current_task":"Monitoring","tasks_in_queue":0,"metadata":{"model":"claude-opus-4-6","gateway_port":18789,"uptime_minutes":0}}'
```

---

## Legacy Dashboard

The original dashboard is still accessible at `/legacy.html`.

---

*SA Horizon Group — dental + chiro + medspas marketing agency*
