'use client'

import { useState } from 'react'
import Nav from '@/components/Nav'
import StepBar from '@/components/StepBar'
import { TripData, PackingItem } from '@/lib/bedrock'

interface PackingListProps {
  tripData: TripData | null
  initialItems: PackingItem[]
  onNext: (items: PackingItem[]) => void
  onBack: () => void
}

type Item = { id: number; name: string; category: string; why: string; checked: boolean; ai: boolean }

const CATS = ['All', 'Clothing', 'Electronics', 'Toiletries', 'Documents']
const CAT_ICONS: Record<string, string> = { Clothing: '👕', Electronics: '⚡', Toiletries: '🧴', Documents: '📄', All: '📋' }

export default function PackingList({ tripData, initialItems, onNext, onBack }: PackingListProps) {
  const [items, setItems] = useState<Item[]>(() =>
    initialItems.map((item, i) => ({
      id: i + 1,
      name: item.name,
      category: item.category,
      why: item.why,
      checked: true,
      ai: item.ai_suggested,
    }))
  )
  const [filter, setFilter] = useState('All')
  const [newItem, setNewItem] = useState('')
  const [adding, setAdding] = useState(false)

  const filtered = filter === 'All' ? items : items.filter(i => i.category === filter)
  const checked = items.filter(i => i.checked).length
  const weight = (checked * 0.52 + 1.8).toFixed(1)
  const weightNum = parseFloat(weight)

  function toggle(id: number) {
    setItems(p => p.map(i => i.id === id ? { ...i, checked: !i.checked } : i))
  }

  function addItem() {
    if (!newItem.trim()) return
    setItems(p => [...p, { id: Date.now(), name: newItem.trim(), category: filter === 'All' ? 'Clothing' : filter, why: 'Added manually', checked: true, ai: false }])
    setNewItem('')
    setAdding(false)
  }

  function handleNext() {
    const selected = items
      .filter(i => i.checked)
      .map(i => ({
        name: i.name,
        category: i.category,
        why: i.why,
        ai_suggested: i.ai,
      }))
    onNext(selected)
  }

  const weightPct = Math.min((weightNum / 23) * 100, 100)
  const weightColor = weightNum > 21 ? '#E53E3E' : weightNum > 18 ? '#C9A84C' : '#0D7A70'

  const destination = tripData?.destination ?? 'your destination'
  const departDate = tripData?.depart_date ?? ''
  const returnDate = tripData?.return_date ?? ''
  const dateRange = departDate && returnDate ? `${departDate} – ${returnDate}` : departDate || 'your trip'
  const checkedKg = tripData?.checked_bag_kg ?? 23

  return (
    <div style={{ minHeight: '100vh', background: '#FAFAF8' }}>
      <Nav light onLogoClick={onBack} />
      <div style={{ paddingTop: 84, paddingBottom: 64, paddingLeft: 24, paddingRight: 24, maxWidth: 600, margin: '0 auto' }}>
        <div style={{ marginBottom: 40 }}><StepBar current={1} /></div>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
          <div>
            <h1 style={{ fontSize: 30, fontWeight: 900, color: '#1B2D4F', letterSpacing: '-0.8px', marginBottom: 4 }}>Your packing list.</h1>
            <p style={{ fontSize: 14, color: '#64748B' }}>Built for {destination} · {dateRange} · Check off what to include.</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 28, fontWeight: 900, color: '#1B2D4F', letterSpacing: '-1px', lineHeight: 1 }}>{checked}</div>
            <div style={{ fontSize: 11, color: '#94A3B8', fontWeight: 600 }}>of {items.length} items</div>
          </div>
        </div>

        {/* Weight meter */}
        <div style={{ background: '#fff', borderRadius: 12, border: '1px solid rgba(27,45,79,0.08)', padding: '14px 18px', marginBottom: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.8px', color: '#94A3B8', textTransform: 'uppercase' }}>Estimated weight</span>
            <span style={{ fontSize: 12, fontWeight: 800, color: weightColor }}>{weight}kg / {checkedKg}kg allowed</span>
          </div>
          <div style={{ height: 6, background: '#F0F4FA', borderRadius: 3, overflow: 'hidden' }}>
            <div style={{ width: `${weightPct}%`, height: '100%', background: weightColor, borderRadius: 3, transition: 'width 0.4s ease, background 0.3s' }} />
          </div>
          <p style={{ fontSize: 11, color: '#B0BAC8', marginTop: 7 }}>Packers weigh every bag on a certified scale before sealing.</p>
        </div>

        {/* AI summary chip */}
        <div style={{ background: 'rgba(201,168,76,0.08)', border: '1px solid rgba(201,168,76,0.2)', borderRadius: 10, padding: '10px 14px', marginBottom: 18, display: 'flex', gap: 10, alignItems: 'center' }}>
          <div style={{ width: 26, height: 26, background: '#C9A84C', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 800, color: '#1B2D4F', flexShrink: 0 }}>AI</div>
          <p style={{ fontSize: 12, color: '#7a5e1a', lineHeight: 1.5 }}>
            <strong>{items.filter(i => i.ai).length} items</strong> suggested by AI based on your {tripData?.airline ?? ''} fare, {tripData?.trip_purpose ?? 'Leisure'} trip, and destination forecast.
          </p>
        </div>

        {/* Category tabs */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 14, flexWrap: 'wrap' }}>
          {CATS.map(cat => {
            const count = cat === 'All' ? items.filter(i => i.checked).length : items.filter(i => i.category === cat && i.checked).length
            return (
              <button key={cat} onClick={() => setFilter(cat)} style={{
                display: 'flex', alignItems: 'center', gap: 5,
                padding: '6px 14px', borderRadius: 20, fontSize: 12, fontWeight: 600, cursor: 'pointer',
                border: filter === cat ? 'none' : '1.5px solid #E2EAF4',
                background: filter === cat ? '#1B2D4F' : '#fff',
                color: filter === cat ? '#fff' : '#64748B',
              }}>
                <span>{CAT_ICONS[cat]}</span>
                {cat}
                <span style={{ opacity: 0.6, fontSize: 11 }}>({count})</span>
              </button>
            )
          })}
        </div>

        {/* Item list */}
        <div style={{ background: '#fff', borderRadius: 14, border: '1px solid rgba(27,45,79,0.07)', overflow: 'hidden', marginBottom: 12 }}>
          {filtered.map((item, idx) => (
            <div key={item.id} onClick={() => toggle(item.id)} style={{
              display: 'flex', alignItems: 'center', gap: 14, padding: '13px 18px',
              cursor: 'pointer', background: '#fff', transition: 'background 0.1s',
              borderBottom: idx < filtered.length - 1 ? '1px solid #F1F5F9' : 'none',
            }}
              onMouseEnter={e => (e.currentTarget.style.background = '#FAFBFD')}
              onMouseLeave={e => (e.currentTarget.style.background = '#fff')}
            >
              <div style={{
                width: 20, height: 20, borderRadius: 5, flexShrink: 0,
                background: item.checked ? '#0D7A70' : 'transparent',
                border: item.checked ? 'none' : '2px solid #CBD5E1',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.15s'
              }}>
                {item.checked && <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: item.checked ? '#1B2D4F' : '#94A3B8', textDecoration: item.checked ? 'none' : 'line-through' }}>
                    {item.name}
                  </span>
                  {item.ai && (
                    <span style={{ fontSize: 9, fontWeight: 700, color: '#8a6e2a', background: 'rgba(201,168,76,0.15)', padding: '2px 6px', borderRadius: 3, letterSpacing: '0.5px' }}>AI</span>
                  )}
                </div>
                <p style={{ fontSize: 11, color: '#94A3B8', marginTop: 2 }}>{item.why}</p>
              </div>
              <span style={{ fontSize: 10, color: '#CBD5E1', fontWeight: 600, flexShrink: 0 }}>{CAT_ICONS[item.category] ?? '📋'}</span>
            </div>
          ))}
          {filtered.length === 0 && (
            <div style={{ padding: '24px', textAlign: 'center', color: '#94A3B8', fontSize: 13 }}>
              No items in this category yet.
            </div>
          )}
        </div>

        {/* Add item */}
        {adding ? (
          <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
            <input
              value={newItem}
              onChange={e => setNewItem(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addItem()}
              placeholder="Item name…"
              autoFocus
              style={{ flex: 1, border: '1.5px solid #C9A84C', borderRadius: 8, padding: '10px 14px', fontSize: 13, outline: 'none', fontFamily: 'inherit' }}
            />
            <button onClick={addItem} style={{ background: '#1B2D4F', color: '#fff', padding: '10px 18px', borderRadius: 8, border: 'none', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>Add</button>
            <button onClick={() => setAdding(false)} style={{ color: '#94A3B8', background: 'transparent', border: 'none', cursor: 'pointer', fontSize: 13 }}>✕</button>
          </div>
        ) : (
          <button onClick={() => setAdding(true)} style={{
            width: '100%', border: '2px dashed #E2EAF4', borderRadius: 10, padding: '11px',
            fontSize: 13, color: '#94A3B8', background: 'transparent', cursor: 'pointer',
            fontWeight: 600, marginBottom: 14, transition: 'all 0.2s',
          }}>+ Add item</button>
        )}

        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={onBack} style={{ flex: 1, border: '1.5px solid #E2EAF4', background: '#fff', color: '#64748B', fontWeight: 600, fontSize: 14, padding: '13px', borderRadius: 10, cursor: 'pointer' }}>
            ← Back
          </button>
          <button onClick={handleNext} style={{ flex: 2, background: '#C9A84C', color: '#1B2D4F', fontWeight: 800, fontSize: 15, padding: '13px', borderRadius: 10, border: 'none', cursor: 'pointer' }}>
            Choose my luggage →
          </button>
        </div>
      </div>
    </div>
  )
}
