import { NextRequest, NextResponse } from 'next/server'
import { validateApiKey } from '@/lib/api-key'
import { createServiceClient } from '@/lib/supabase/service'

export async function POST(req: NextRequest) {
  const err = validateApiKey(req)
  if (err) return err

  const { agent_name, status, current_task, tasks_in_queue, metadata } = await req.json()
  if (!agent_name || !status) {
    return NextResponse.json({ error: 'agent_name and status required' }, { status: 400 })
  }

  const db = createServiceClient()
  const { data, error } = await db
    .from('agent_status')
    .upsert({
      agent_name,
      status,
      current_task: current_task ?? null,
      tasks_in_queue: tasks_in_queue ?? 0,
      metadata: metadata ?? {},
      updated_at: new Date().toISOString(),
    }, { onConflict: 'agent_name' })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function GET(req: NextRequest) {
  const err = validateApiKey(req)
  if (err) return err
  const db = createServiceClient()
  const { data, error } = await db.from('agent_status').select('*').order('updated_at', { ascending: false })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
