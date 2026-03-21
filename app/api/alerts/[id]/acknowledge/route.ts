import { NextRequest, NextResponse } from 'next/server'
import { validateApiKey } from '@/lib/api-key'
import { createServiceClient } from '@/lib/supabase/service'

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const err = validateApiKey(req)
  if (err) return err

  const db = createServiceClient()
  const { data, error } = await db
    .from('alerts')
    .update({ acknowledged: true })
    .eq('id', params.id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
