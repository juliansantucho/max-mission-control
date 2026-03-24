'use client'
import { useState } from 'react'
import PanelWrapper from '@/components/PanelWrapper'

const IDEAS = [
  { num: '01', title: 'El problema que nadie te dice sobre conseguir pacientes hispanos', desc: 'Video UGC de doctor frustrado con agencias genéricas. Hook en español.', type: 'Video' },
  { num: '02', title: '"Conseguimos 23 nuevos pacientes en 90 días o te devolvemos el dinero"', desc: 'Garantía ROI al frente. Testimonial de cliente real. CTA: agendar llamada.', type: 'Imagen' },
  { num: '03', title: 'Antes vs Después: agenda llena vs agenda vacía', desc: 'Split screen. Clínica sin sistema vs clínica con Hispanic Dental Domination System™.', type: 'Video' },
  { num: '04', title: '¿Cuánto te está costando cada paciente nuevo?', desc: 'Calculadora de CAC. Pain point financiero. Reencuadre: $1,499 vs $300/paciente.', type: 'Carrusel' },
  { num: '05', title: 'Lo que Spanish Smile no te dice (sin mencionarlos)', desc: 'Comparación implícita. SA-Dental también cubre chiro y medspa.', type: 'Comparación' },
  { num: '06', title: 'Testimonio: "Llenamos el calendario en 3 semanas"', desc: 'Video testimonial de cliente dental hispano. Resultados concretos + proceso simple.', type: 'Video UGC' },
  { num: '07', title: 'El sistema que usan las clínicas dentales top de Florida', desc: 'Social proof geográfico. Autoridad por ubicación.', type: 'Imagen' },
  { num: '08', title: 'Chiro: "20 pacientes nuevos por mes sin pagar por referidos"', desc: 'Específico para quiroprácticos hispanos. Nicho validado.', type: 'Video' },
  { num: '09', title: 'Medspa: 15 clientes de Botox en 14 días', desc: 'Dato concreto de cliente real. Urgencia implícita.', type: 'Imagen' },
]

const TYPE_COLORS: Record<string, string> = {
  'Video': 'bg-indigo-900/40 text-indigo-400',
  'Video UGC': 'bg-violet-900/40 text-violet-400',
  'Imagen': 'bg-emerald-900/40 text-emerald-400',
  'Carrusel': 'bg-blue-900/40 text-blue-400',
  'Comparación': 'bg-orange-900/40 text-orange-400',
}

export default function AdsIdeasPanel() {
  const [active, setActive] = useState<string | null>(null)

  return (
    <PanelWrapper
      title="Ads Ideas"
      subtitle="Ideas B2B para SA-Dental — Hispanos USA"
      badge={
        <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-400/10 text-indigo-400 border border-indigo-400/20">
          {IDEAS.length} ideas
        </span>
      }
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-2">
        {IDEAS.map(idea => (
          <div
            key={idea.num}
            className={`bg-surface-2 border rounded-lg p-3 cursor-pointer transition-colors ${
              active === idea.num ? 'border-indigo-500/50' : 'border-surface-3 hover:border-surface-4'
            }`}
            onClick={() => setActive(active === idea.num ? null : idea.num)}
          >
            <div className="text-[10px] text-slate-600 mb-1">{idea.num}</div>
            <p className="text-xs font-semibold text-slate-300 leading-snug mb-2">{idea.title}</p>
            {active === idea.num && (
              <p className="text-xs text-slate-500 leading-relaxed mb-2">{idea.desc}</p>
            )}
            <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${TYPE_COLORS[idea.type] ?? 'bg-surface-3 text-slate-500'}`}>
              {idea.type}
            </span>
          </div>
        ))}
      </div>
    </PanelWrapper>
  )
}
