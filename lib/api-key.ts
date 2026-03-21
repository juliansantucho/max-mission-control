import { NextRequest, NextResponse } from 'next/server'

export function validateApiKey(req: NextRequest): NextResponse | null {
  const key = req.headers.get('x-api-key')
  const expected = process.env.DASHBOARD_API_KEY
  if (!expected) return NextResponse.json({ error: 'API key not configured' }, { status: 500 })
  if (!key || key !== expected) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  return null
}
