import { NextRequest, NextResponse } from 'next/server'
import { validateApiKey } from '@/lib/api-key'
import { createServiceClient } from '@/lib/supabase/service'

export async function POST(req: NextRequest) {
  const err = validateApiKey(req)
  if (err) return err

  const { type, severity, title, message, source_panel } = await req.json()
  if (!type || !severity || !title || !message) {
    return NextResponse.json({ error: 'type, severity, title, message required' }, { status: 400 })
  }

  const db = createServiceClient()
  const { data, error } = await db
    .from('alerts')
    .insert({ type, severity, title, message, source_panel: source_panel ?? null, acknowledged: false })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}

export async function GET(req: NextRequest) {
  const err = validateApiKey(req)
  if (err) return err
  const { searchParams } = new URL(req.url)
  const all = searchParams.get('all') === 'true'

  const db = createServiceClient()
  let q = db.from('alerts').select('*').order('created_at', { ascending: false }).limit(50)
  if (!all) q = q.eq('acknowledged', false)

  const { data, error } = await q
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
