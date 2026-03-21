'use client'
import PanelWrapper from '@/components/PanelWrapper'

export default function PlaceholderPanel({ title, comingSoon }: { title: string; comingSoon: string }) {
  return (
    <PanelWrapper title={title}>
      <div className="flex flex-col items-center justify-center py-8 gap-2">
        <div className="text-2xl opacity-30">⏳</div>
        <p className="text-xs text-slate-600 text-center">{comingSoon}</p>
      </div>
    </PanelWrapper>
  )
}
