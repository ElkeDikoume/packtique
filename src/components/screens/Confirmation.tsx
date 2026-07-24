'use client'

import Nav from '@/components/Nav'
import { TripData } from '@/lib/bedrock'

interface ConfirmationProps {
  tripData: TripData | null
  selectedBag: string
  serviceTier: 'explorer' | 'concierge'
  tripId: string | null
  onRestart: () => void
}

export default function Confirmation({ tripData, selectedBag, serviceTier, tripId, onRestart }: ConfirmationProps) {
  const orderRef = tripId ? `PKT-${tripId.slice(0, 4).toUpperCase()}` : 'PKT-8821'
  const destination = tripData?.destination ?? 'your destination'
  const airline = tripData?.airline ?? 'Your airline'
  const flightNum = tripData?.flight_number ?? ''
  const departDate = tripData?.depart_date ?? ''
  const origin = tripData?.origin ?? ''

  return (
    <div style={{ minHeight: '100vh', background: '#FAFAF8' }}>
      <Nav light onLogoClick={onRestart} />
      <div style={{ paddingTop: 84, paddingBottom: 64, paddingLeft: 24, paddingRight: 24, maxWidth: 600, margin: '0 auto' }}>

        {/* Success mark */}
        <div style={{ textAlign: 'center', paddingTop: 40, paddingBottom: 48 }}>
          <div style={{
            width: 72, height: 72, borderRadius: '50%', background: 'rgba(13,122,112,0.1)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px',
          }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#0D7A70" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
            </svg>
          </div>
          <h1 style={{ fontSize: 32, fontWeight: 900, color: '#1B2D4F', letterSpacing: '-0.8px', marginBottom: 8 }}>
            You&apos;re all set.
          </h1>
          <p style={{ fontSize: 15, color: '#64748B', lineHeight: 1.6, maxWidth: 360, margin: '0 auto' }}>
            Order #{orderRef} confirmed. Your specialist will review your list and start packing before your departure.
          </p>
        </div>

        {/* Order summary */}
        <div style={{ background: '#fff', borderRadius: 16, border: '1px solid rgba(27,45,79,0.08)', overflow: 'hidden', marginBottom: 14 }}>
          <div style={{ background: '#1B2D4F', padding: '14px 20px' }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '1px', color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase' as const, marginBottom: 2 }}>Order summary</div>
            <div style={{ fontSize: 16, fontWeight: 800, color: '#fff' }}>
              {airline} {flightNum} {departDate ? `· ${departDate}` : ''} {origin && destination ? `· ${origin} → ${destination}` : destination ? `→ ${destination}` : ''}
            </div>
          </div>
          <div style={{ padding: '18px 20px', display: 'flex', flexDirection: 'column' as const, gap: 13 }}>
            {[
              { label: 'Bag', value: selectedBag },
              { label: 'Service', value: serviceTier === 'explorer' ? 'Explorer — $49' : 'Concierge — $149' },
              { label: 'Destination', value: destination },
            ].map(row => (
              <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16 }}>
                <span style={{ fontSize: 12, color: '#94A3B8', fontWeight: 600, flexShrink: 0 }}>{row.label}</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: '#1B2D4F', textAlign: 'right' as const }}>{row.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* What happens next */}
        <div style={{ background: '#fff', borderRadius: 16, border: '1px solid rgba(27,45,79,0.08)', padding: '18px 20px', marginBottom: 14 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: '#1B2D4F', marginBottom: 16 }}>What happens next</div>
          <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 0 }}>
            {[
              { icon: '✓', title: 'Specialist assigned', desc: 'Your packer reviews your list and confirms item fit — today.', done: true },
              { icon: '📦', title: 'Packing begins the day before', desc: 'We start 4 hours before your window. Every item is weighed and logged.', done: false },
              { icon: '📸', title: 'Photo before seal', desc: "You get a photo of your packed, weighed bag before we close it.", done: false },
              { icon: '🚚', title: 'Delivered to your door', desc: "You'll get a live tracking link before delivery.", done: false },
            ].map((step, i, arr) => (
              <div key={step.title} style={{ display: 'flex', gap: 14, paddingBottom: i < arr.length - 1 ? 18 : 0, position: 'relative' as const }}>
                {i < arr.length - 1 && (
                  <div style={{ position: 'absolute' as const, left: 17, top: 36, width: 2, bottom: 0, background: '#F1F5F9' }} />
                )}
                <div style={{
                  width: 34, height: 34, borderRadius: '50%', flexShrink: 0,
                  background: step.done ? 'rgba(13,122,112,0.1)' : '#F4F7FB',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: step.done ? 14 : 16,
                  border: step.done ? '2px solid rgba(13,122,112,0.25)' : '2px solid #E2EAF4',
                  color: step.done ? '#0D7A70' : undefined,
                  fontWeight: step.done ? 700 : undefined,
                  zIndex: 1,
                }}>
                  {step.icon}
                </div>
                <div style={{ paddingTop: 4 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: step.done ? '#0D7A70' : '#1B2D4F', marginBottom: 2 }}>{step.title}</div>
                  <div style={{ fontSize: 12, color: '#94A3B8', lineHeight: 1.5 }}>{step.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Style profile note */}
        <div style={{ background: 'rgba(201,168,76,0.07)', border: '1px solid rgba(201,168,76,0.22)', borderRadius: 12, padding: '14px 16px', display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: 28 }}>
          <div style={{ width: 28, height: 28, background: '#C9A84C', borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 800, color: '#1B2D4F', flexShrink: 0 }}>AI</div>
          <p style={{ fontSize: 12, color: '#7a5e1a', lineHeight: 1.6 }}>
            <strong>Your style profile has been saved.</strong> Your packing preferences, item choices, and bag fit from this trip will make your next pack even faster.
          </p>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 10 }}>
          <button style={{
            width: '100%', background: '#C9A84C', color: '#1B2D4F',
            fontWeight: 800, fontSize: 15, padding: '14px', borderRadius: 10, border: 'none', cursor: 'pointer',
          }}>
            Track my delivery →
          </button>
          <button onClick={onRestart} style={{
            width: '100%', background: 'transparent', color: '#94A3B8',
            fontWeight: 600, fontSize: 13, padding: '11px', borderRadius: 10,
            border: '1.5px solid #E2EAF4', cursor: 'pointer',
          }}>
            Plan another trip
          </button>
        </div>

      </div>
    </div>
  )
}
