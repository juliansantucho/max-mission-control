'use client'
interface Props {
  title: string
  subtitle?: string
  badge?: React.ReactNode
  children: React.ReactNode
  className?: string
  fullWidth?: boolean
}
export default function PanelWrapper({ title, subtitle, badge, children, className = '', fullWidth }: Props) {
  return (
    <div className={`bg-surface-1 border border-surface-3 rounded-lg flex flex-col ${fullWidth ? 'col-span-full' : ''} ${className}`}>
      <div className="flex items-center justify-between px-4 pt-3 pb-2 border-b border-surface-3 flex-shrink-0">
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-widest text-slate-400">{title}</h2>
          {subtitle && <p className="text-xs text-slate-600 mt-0.5">{subtitle}</p>}
        </div>
        {badge}
      </div>
      <div className="flex-1 overflow-auto p-4 min-h-0">{children}</div>
    </div>
  )
}
