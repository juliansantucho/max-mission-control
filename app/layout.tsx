import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Mission Control — SA Horizon',
  description: 'SA Horizon operations dashboard',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="bg-surface-0 text-slate-200 min-h-screen">{children}</body>
    </html>
  )
}
