const TOKEN = process.env.CALENDLY_TOKEN || ''

async function calendlyFetch(path: string) {
  const res = await fetch(`https://api.calendly.com${path}`, {
    headers: { Authorization: `Bearer ${TOKEN}`, 'Content-Type': 'application/json' },
    next: { revalidate: 300 },
  })
  if (!res.ok) throw new Error(`Calendly ${path}: ${res.status}`)
  return res.json()
}

export async function getCalendlyUser() {
  try {
    const data = await calendlyFetch('/users/me')
    return data.resource
  } catch {
    return null
  }
}

export async function getCalendlyEvents(hours = 48) {
  try {
    const user = await getCalendlyUser()
    if (!user) return []

    const now = new Date()
    const end = new Date(now.getTime() + hours * 60 * 60 * 1000)

    const data = await calendlyFetch(
      `/scheduled_events?user=${encodeURIComponent(user.uri)}&min_start_time=${now.toISOString()}&max_start_time=${end.toISOString()}&count=50&status=active`
    )
    return (data.collection ?? []).map((e: {
      name: string
      start_time: string
      end_time: string
      event_type: string
      invitees_counter?: { active?: number }
    }) => ({
      title: e.name,
      start_time: e.start_time,
      end_time: e.end_time,
      source: 'calendly',
      event_type: 'call' as const,
      invitees: e.invitees_counter?.active ?? 1,
    }))
  } catch {
    return []
  }
}
