'use client'

import { useEffect, useState } from 'react'
import Nav from '@/components/Nav'
import StepBar from '@/components/StepBar'

interface TripSetupLoadingProps {
  onBack: () => void
}

export default function TripSetupLoading({ onBack }: TripSetupLoadingProps) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    let p = 0
    const iv = setInterval(() => {
      p += Math.random() * 6 + 2
      if (p >= 95) { p = 95; clearInterval(iv) }
      setProgress(Math.min(p, 95))
    }, 300)
    return () => clearInterval(iv)
  }, [])

  return (
    <div style={{ minHeight: '100vh', background: '#FAFAF8' }}>
      <Nav light onLogoClick={onBack} />

      <div style={{ paddingTop: 84, paddingBottom: 64, paddingLeft: 24, paddingRight: 24, maxWidth: 600, margin: '0 auto' }}>
        <div style={{ marginBottom: 40 }}>
          <StepBar current={0} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', paddingTop: 80, paddingBottom: 80, textAlign: 'center' }}>
          <div style={{ width: 72, height: 72, position: 'relative', marginBottom: 28 }}>
            <svg viewBox="0 0 72 72" style={{ width: 72, height: 72, transform: 'rotate(-90deg)' }}>
              <circle cx="36" cy="36" r="30" fill="none" stroke="#E8EDF4" strokeWidth="5" />
              <circle cx="36" cy="36" r="30" fill="none" stroke="#C9A84C" strokeWidth="5"
                strokeDasharray={`${2 * Math.PI * 30}`}
                strokeDashoffset={`${2 * Math.PI * 30 * (1 - progress / 100)}`}
                strokeLinecap="round"
                style={{ transition: 'stroke-dashoffset 0.3s ease' }}
              />
            </svg>
            <span style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', fontSize: 14, fontWeight: 800, color: '#1B2D4F' }}>
              {Math.round(progress)}%
            </span>
          </div>

          <h2 style={{ fontSize: 24, fontWeight: 900, color: '#1B2D4F', letterSpacing: '-0.5px', marginBottom: 8 }}>
            Reading your ticket…
          </h2>
          <p style={{ fontSize: 14, color: '#94A3B8', maxWidth: 300, lineHeight: 1.6 }}>
            Extracting airline, route, fare class, and baggage rules. Building your personalized packing list.
          </p>

          <div style={{ marginTop: 36, display: 'flex', flexDirection: 'column', gap: 12, width: '100%', maxWidth: 280, textAlign: 'left' }}>
            {[
              { label: 'Airline & fare class', done: progress > 25 },
              { label: 'Checked bag allowance', done: progress > 45 },
              { label: 'Carry-on restrictions', done: progress > 65 },
              { label: 'Building packing list', done: progress > 85 },
            ].map(item => (
              <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{
                  width: 18, height: 18, borderRadius: '50%', flexShrink: 0,
                  background: item.done ? '#0D7A70' : '#E8EDF4',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'background 0.3s'
                }}>
                  {item.done && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>}
                </div>
                <span style={{ fontSize: 13, color: item.done ? '#1B2D4F' : '#94A3B8', fontWeight: item.done ? 600 : 400, transition: 'all 0.3s' }}>
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
