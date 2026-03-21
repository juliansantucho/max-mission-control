import { NextRequest, NextResponse } from 'next/server'
import { validateApiKey } from '@/lib/api-key'
import { createServiceClient } from '@/lib/supabase/service'

export async function POST(req: NextRequest) {
  const err = validateApiKey(req)
  if (err) return err

  const { automation_name, platform, last_status, next_run, error_message } = await req.json()
  if (!automation_name || !last_status) {
    return NextResponse.json({ error: 'automation_name and last_status required' }, { status: 400 })
  }

  const db = createServiceClient()
  const { data, error } = await db
    .from('automation_status')
    .upsert({
      automation_name,
      platform: platform ?? 'unknown',
      last_status,
      next_run: next_run ?? null,
      error_message: last_status === 'failed' ? (error_message ?? null) : null,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'automation_name' })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
