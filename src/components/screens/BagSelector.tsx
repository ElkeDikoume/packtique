'use client'

import { useState } from 'react'
import Nav from '@/components/Nav'
import StepBar from '@/components/StepBar'
import { TripData } from '@/lib/bedrock'

interface BagSelectorProps {
  tripData: TripData | null
  itemCount: number
  onNext: (email: string, bagBrand: string, bagModel: string, serviceTier: 'explorer' | 'concierge') => void
  onBack: () => void
  loading?: boolean
}

const BAGS = [
  {
    id: 'away-medium', brand: 'Away', name: 'The Medium', size: '63.5L', dim: '55×35×25cm', weight: '3.7kg', price: 295,
    features: ['Ejectable battery', '360° spinner wheels', 'TSA lock', 'Laundry bag'],
    colors: ['#1B2D4F', '#E5E7EB', '#374151', '#D97706'],
    colorNames: ['Navy', 'White', 'Slate', 'Caramel'],
    fit: 98, recommended: true,
  },
  {
    id: 'rimowa-essential', brand: 'Rimowa', name: 'Essential Check-In M', size: '62L', dim: '78×52×31cm', weight: '3.9kg', price: 740,
    features: ['Polycarbonate shell', 'Multi-wheel system', 'Flex-divider', 'Lifetime warranty'],
    colors: ['#C0C0C0', '#111827', '#FED7AA'],
    colorNames: ['Silver', 'Matte Black', 'Rose'],
    fit: 95, recommended: false,
  },
  {
    id: 'samsonite-outline', brand: 'Samsonite', name: 'Outline Pro Medium', size: '60L', dim: '75×50×28cm', weight: '3.3kg', price: 189,
    features: ['Dual-tube frame', 'SilentRun wheels', 'Expansion zip', 'Packing cubes included'],
    colors: ['#374151', '#1E3A5F', '#7C3AED'],
    colorNames: ['Charcoal', 'Midnight Blue', 'Plum'],
    fit: 91, recommended: false,
  },
]

export default function BagSelector({ tripData, itemCount, onNext, onBack, loading = false }: BagSelectorProps) {
  const [selected, setSelected] = useState('away-medium')
  const [colorIdx, setColorIdx] = useState<Record<string, number>>({})
  const [plan, setPlan] = useState<'explorer' | 'concierge'>('explorer')
  const [email, setEmail] = useState('')
  const [emailError, setEmailError] = useState('')

  const bag = BAGS.find(b => b.id === selected)!
  const cIdx = colorIdx[selected] ?? 0
  const checkedKg = tripData?.checked_bag_kg ?? 23
  const airline = tripData?.airline ?? 'your airline'

  function handleContinue() {
    if (!email.trim() || !email.includes('@')) {
      setEmailError('Please enter a valid email address')
      return
    }
    setEmailError('')
    onNext(email.trim(), bag.brand, bag.name, plan)
  }

  return (
    <div style={{ minHeight: '100vh', background: '#FAFAF8' }}>
      <Nav light onLogoClick={onBack} />
      <div style={{ paddingTop: 84, paddingBottom: 64, paddingLeft: 24, paddingRight: 24, maxWidth: 600, margin: '0 auto' }}>
        <div style={{ marginBottom: 40 }}><StepBar current={2} /></div>

        <h1 style={{ fontSize: 30, fontWeight: 900, color: '#1B2D4F', letterSpacing: '-0.8px', marginBottom: 6 }}>Choose your bag.</h1>
        <p style={{ fontSize: 14, color: '#64748B', marginBottom: 28, lineHeight: 1.6 }}>
          All options fit your {checkedKg}kg {airline} allowance. Fit score is based on your {itemCount} selected items.
        </p>

        {/* Bag cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20 }}>
          {BAGS.map(b => {
            const ci = colorIdx[b.id] ?? 0
            const isSelected = selected === b.id
            return (
              <div key={b.id} onClick={() => setSelected(b.id)} style={{
                background: '#fff', borderRadius: 16,
                border: `2px solid ${isSelected ? '#1B2D4F' : 'rgba(27,45,79,0.07)'}`,
                padding: 18, cursor: 'pointer', transition: 'all 0.2s',
                boxShadow: isSelected ? '0 4px 20px rgba(27,45,79,0.1)' : 'none',
              }}>
                <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                  {/* Luggage visual */}
                  <div style={{
                    width: 64, height: 80, borderRadius: 12, flexShrink: 0,
                    background: b.colors[ci] + '18', border: `2px solid ${b.colors[ci]}30`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 28, position: 'relative',
                  }}>
                    🧳
                    <div style={{ position: 'absolute', bottom: 4, right: 4, width: 10, height: 10, borderRadius: '50%', background: b.colors[ci], border: '2px solid #fff' }} />
                  </div>

                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                          <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '1px', color: '#94A3B8', textTransform: 'uppercase' }}>{b.brand}</span>
                          {b.recommended && <span style={{ fontSize: 9, fontWeight: 700, color: '#8a6e2a', background: 'rgba(201,168,76,0.15)', padding: '2px 7px', borderRadius: 20 }}>Best fit</span>}
                        </div>
                        <div style={{ fontSize: 15, fontWeight: 800, color: '#1B2D4F', letterSpacing: '-0.3px' }}>{b.name}</div>
                        <div style={{ fontSize: 12, color: '#94A3B8', marginTop: 1 }}>{b.size} · {b.weight} empty · {b.dim}</div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: 20, fontWeight: 900, color: '#1B2D4F', letterSpacing: '-0.5px' }}>${b.price}</div>
                        <div style={{ fontSize: 11, color: '#94A3B8' }}>or rent</div>
                      </div>
                    </div>

                    {/* Fit bar */}
                    <div style={{ marginTop: 10 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                        <span style={{ fontSize: 10, fontWeight: 700, color: '#94A3B8', letterSpacing: '0.5px', textTransform: 'uppercase' }}>Pack fit</span>
                        <span style={{ fontSize: 11, fontWeight: 800, color: b.fit >= 95 ? '#0D7A70' : '#C9A84C' }}>{b.fit}%</span>
                      </div>
                      <div style={{ height: 4, background: '#F0F4FA', borderRadius: 2, overflow: 'hidden' }}>
                        <div style={{ width: `${b.fit}%`, height: '100%', background: b.fit >= 95 ? '#0D7A70' : '#C9A84C', borderRadius: 2 }} />
                      </div>
                    </div>

                    {/* Color selector */}
                    {isSelected && (
                      <div style={{ marginTop: 12 }}>
                        <div style={{ fontSize: 10, fontWeight: 700, color: '#94A3B8', letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: 7 }}>
                          Color · {b.colorNames[ci]}
                        </div>
                        <div style={{ display: 'flex', gap: 8 }}>
                          {b.colors.map((c, i) => (
                            <button key={i} onClick={(e) => { e.stopPropagation(); setColorIdx(p => ({ ...p, [b.id]: i })) }} style={{
                              width: 24, height: 24, borderRadius: '50%', background: c, border: 'none', cursor: 'pointer',
                              outline: ci === i ? `3px solid ${c}` : 'none',
                              outlineOffset: 2, transition: 'outline 0.15s',
                            }} />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Radio */}
                  <div style={{
                    width: 20, height: 20, borderRadius: '50%', flexShrink: 0, marginTop: 2,
                    border: `2px solid ${isSelected ? '#1B2D4F' : '#CBD5E1'}`,
                    background: isSelected ? '#1B2D4F' : 'transparent',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    {isSelected && <div style={{ width: 7, height: 7, background: '#fff', borderRadius: '50%' }} />}
                  </div>
                </div>

                {/* Features strip */}
                {isSelected && (
                  <div style={{ marginTop: 14, paddingTop: 14, borderTop: '1px solid #F1F5F9', display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {b.features.map(f => (
                      <span key={f} style={{ fontSize: 11, background: '#F0F4FA', color: '#475569', padding: '4px 10px', borderRadius: 20, fontWeight: 500 }}>{f}</span>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Service plan */}
        <div style={{ background: '#fff', borderRadius: 14, border: '1px solid rgba(27,45,79,0.08)', padding: 20, marginBottom: 16 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#1B2D4F', marginBottom: 12 }}>Service plan</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {[
              { id: 'explorer', price: '$49', name: 'Explorer', desc: 'Professional packing · TSA check · Same-day delivery' },
              { id: 'concierge', price: '$149', name: 'Concierge', desc: 'Dedicated stylist · Priority delivery · White-glove' },
            ].map(p => (
              <div key={p.id} onClick={() => setPlan(p.id as 'explorer' | 'concierge')} style={{
                borderRadius: 10, padding: '14px', cursor: 'pointer',
                border: `2px solid ${plan === p.id ? '#C9A84C' : '#E2EAF4'}`,
                background: plan === p.id ? 'rgba(201,168,76,0.05)' : 'transparent',
              }}>
                <div style={{ fontSize: 20, fontWeight: 900, color: '#1B2D4F', letterSpacing: '-0.5px' }}>{p.price}</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#1B2D4F', marginBottom: 4 }}>{p.name}</div>
                <div style={{ fontSize: 11, color: '#94A3B8', lineHeight: 1.5 }}>{p.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Email input */}
        <div style={{ background: '#fff', borderRadius: 14, border: '1px solid rgba(27,45,79,0.08)', padding: 20, marginBottom: 16 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#1B2D4F', marginBottom: 8 }}>Confirmation email</div>
          <p style={{ fontSize: 12, color: '#94A3B8', marginBottom: 12, lineHeight: 1.5 }}>We&apos;ll send your order confirmation and delivery tracking here.</p>
          <input
            type="email"
            value={email}
            onChange={e => { setEmail(e.target.value); setEmailError('') }}
            placeholder="your@email.com"
            style={{
              width: '100%', border: `1.5px solid ${emailError ? '#E53E3E' : '#E2EAF4'}`, borderRadius: 8,
              padding: '11px 14px', fontSize: 14, color: '#1B2D4F',
              background: '#fff', outline: 'none', boxSizing: 'border-box',
              fontFamily: 'inherit',
            }}
          />
          {emailError && <p style={{ fontSize: 11, color: '#E53E3E', marginTop: 6 }}>{emailError}</p>}
        </div>

        {/* Summary */}
        <div style={{ background: '#1B2D4F', borderRadius: 12, padding: '16px 18px', marginBottom: 18 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'rgba(255,255,255,0.55)', marginBottom: 8 }}>
            <span>{bag.brand} {bag.name} · {bag.colorNames[cIdx]}</span>
            <span>${bag.price}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'rgba(255,255,255,0.55)', paddingBottom: 12, borderBottom: '1px solid rgba(255,255,255,0.1)', marginBottom: 12 }}>
            <span>{plan === 'explorer' ? 'Explorer' : 'Concierge'} service</span>
            <span>${plan === 'explorer' ? 49 : 149}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800 }}>
            <span style={{ color: '#fff', fontSize: 15 }}>Total</span>
            <span style={{ color: '#C9A84C', fontSize: 20, letterSpacing: '-0.5px' }}>${bag.price + (plan === 'explorer' ? 49 : 149)}</span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={onBack} disabled={loading} style={{ flex: 1, border: '1.5px solid #E2EAF4', background: '#fff', color: '#64748B', fontWeight: 600, fontSize: 14, padding: '13px', borderRadius: 10, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.6 : 1 }}>← Back</button>
          <button onClick={handleContinue} disabled={loading} style={{ flex: 2, background: '#C9A84C', color: '#1B2D4F', fontWeight: 800, fontSize: 15, padding: '13px', borderRadius: 10, border: 'none', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1 }}>
            {loading ? 'Saving…' : 'Schedule delivery →'}
          </button>
        </div>
      </div>
    </div>
  )
}
