'use client'

const STEPS = ['Trip Details', 'Pack List', 'Luggage', 'Delivery']

interface StepBarProps {
  current: number
}

export default function StepBar({ current }: StepBarProps) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', width: '100%', maxWidth: 480, margin: '0 auto' }}>
      {STEPS.map((label, i) => {
        const done = i < current
        const active = i === current
        return (
          <div key={label} style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5, flexShrink: 0 }}>
              <div style={{
                width: 30, height: 30, borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 11, fontWeight: 700, transition: 'all 0.2s',
                background: done ? '#0D7A70' : active ? '#1B2D4F' : '#E8EDF4',
                color: done || active ? '#fff' : '#94A3B8',
              }}>
                {done ? (
                  <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                ) : i + 1}
              </div>
              <span style={{
                fontSize: 10, letterSpacing: '0.5px', fontWeight: 600, whiteSpace: 'nowrap',
                color: active ? '#1B2D4F' : done ? '#0D7A70' : '#B0BAC8',
              }}>{label}</span>
            </div>
            {i < STEPS.length - 1 && (
              <div style={{
                flex: 1, height: 2, margin: '0 6px', marginBottom: 14,
                background: done ? '#0D7A70' : '#E8EDF4', transition: 'background 0.3s'
              }} />
            )}
          </div>
        )
      })}
    </div>
  )
}
