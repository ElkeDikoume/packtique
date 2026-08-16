'use client'

import { useState } from 'react'
import Nav from '@/components/Nav'

interface LandingProps {
  onStart: () => void
}

const S: Record<string, React.CSSProperties> = {
  page: { minHeight: '100vh', background: '#FAFAF8' },
  hero: {
    minHeight: '100vh', display: 'flex', alignItems: 'center',
    padding: '0 40px', paddingTop: 60, position: 'relative', overflow: 'hidden',
  },
  heroLeft: { flex: 1, maxWidth: 580, zIndex: 2, position: 'relative' },
  heroRight: {
    flex: 1, display: 'flex', justifyContent: 'flex-end', alignItems: 'center',
    zIndex: 2, position: 'relative',
  },
  eyebrow: {
    display: 'inline-flex', alignItems: 'center', gap: 8,
    background: 'rgba(13,122,112,0.08)', border: '1px solid rgba(13,122,112,0.2)',
    borderRadius: 20, padding: '5px 14px', marginBottom: 28,
  },
  eyebrowDot: { width: 6, height: 6, background: '#0D7A70', borderRadius: '50%' },
  eyebrowText: { fontSize: 11, fontWeight: 700, letterSpacing: '1.5px', color: '#0D7A70', textTransform: 'uppercase' as const },
  h1: { fontSize: 62, fontWeight: 900, lineHeight: 1.02, marginBottom: 22, letterSpacing: '-1.5px', color: '#1B2D4F' },
  h1Gold: { color: '#C9A84C' },
  sub: { fontSize: 18, lineHeight: 1.65, color: '#64748B', marginBottom: 40, maxWidth: 460 },
  actions: { display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' as const },
  btnPrimary: {
    background: '#1B2D4F', color: '#fff', fontSize: 15, fontWeight: 700,
    padding: '14px 32px', borderRadius: 8, border: 'none', cursor: 'pointer',
    letterSpacing: '0.2px', boxShadow: '0 4px 20px rgba(27,45,79,0.25)',
  },
  btnSecondary: {
    background: 'transparent', color: '#1B2D4F', fontSize: 15, fontWeight: 600,
    padding: '14px 28px', borderRadius: 8, border: '1.5px solid rgba(27,45,79,0.18)',
    cursor: 'pointer', letterSpacing: '0.2px',
  },
  smallNote: { marginTop: 18, fontSize: 12, color: '#94A3B8', letterSpacing: '0.2px' },
}

// Photo URLs for the "How it works" step cards
const STEP_PHOTOS = [
  'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=600&q=75', // airplane / boarding
  'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=600&q=75', // clothing flat lay
  'https://images.unsplash.com/photo-1565026057447-bc90a3dceb87?w=600&q=75', // row of suitcases
  'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=75', // doorstep / delivery
]

// SVG icon components â brand navy #1B2D4F, 28Ã28
function IconTicket() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#1B2D4F" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="5" width="20" height="14" rx="2"/>
      <path d="M2 10h20M8 5v2M16 5v2M8 15v2M16 15v2"/>
    </svg>
  )
}

function IconSparkles() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#1B2D4F" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/>
      <path d="M20 3v4M22 5h-4M4 17v2M5 18H3"/>
    </svg>
  )
}

function IconLuggage() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#1B2D4F" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <rect x="6" y="8" width="12" height="13" rx="2"/>
      <path d="M9 8V6a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"/>
      <line x1="6" y1="13" x2="18" y2="13"/>
      <line x1="10" y1="21" x2="10" y2="23"/>
      <line x1="14" y1="21" x2="14" y2="23"/>
    </svg>
  )
}

function IconPackage() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#1B2D4F" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83z"/>
      <path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65"/>
      <path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65"/>
    </svg>
  )
}

const STEP_ICONS = [<IconTicket />, <IconSparkles />, <IconLuggage />, <IconPackage />]

const FAQ_ITEMS = [
  { q: 'What exactly does Packtique do?', a: 'You upload your boarding pass. Our AI reads your airline\'s baggage rules, builds a personalized packing list based on your destination, weather, and trip type, and a professional packer assembles and delivers everything TSA-compliant before you leave.' },
  { q: 'Do I need to subscribe?', a: 'No. The AI packing list and baggage rule checker are always free. Explorer and Concierge are per-trip â you only pay when you book a service.' },
  { q: 'How does the AI know what to pack for me?', a: 'It uses your boarding pass (airline, fare class, route, dates), destination weather, trip purpose, and your style profile â built from your past trips. The more you use it, the better the recommendations get.' },
  { q: 'What cities do you currently serve?', a: 'We\'re launching in New York City first. Join the waitlist and you\'ll be notified when we expand to your city.' },
  { q: 'What\'s the difference between Explorer and Concierge?', a: 'Explorer gives you an AI-built style profile, professional packing, and same-day delivery â everything most travelers need. Concierge adds a dedicated personal travel stylist who calls you before each trip, priority delivery, and white-glove unpacking at your destination.' },
  { q: 'How far in advance do I need to book?', a: 'Explorer can be booked up to the morning of your departure for same-day delivery. Concierge works best with 48 hours notice so your stylist has time to curate properly.' },
]

function FaqAccordion() {
  const [open, setOpen] = useState<number | null>(null)
  return (
    <div style={{ maxWidth: 680, margin: '0 auto' }}>
      {FAQ_ITEMS.map((item, i) => (
        <div key={i} style={{ borderBottom: '1px solid rgba(27,45,79,0.08)' }}>
          <button
            onClick={() => setOpen(open === i ? null : i)}
            style={{
              width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '20px 0', background: 'none', border: 'none', cursor: 'pointer',
              textAlign: 'left' as const,
            }}
          >
            <span style={{ fontSize: 15, fontWeight: 700, color: '#1B2D4F', letterSpacing: '-0.2px', paddingRight: 16 }}>{item.q}</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"
              style={{ flexShrink: 0, transform: open === i ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
              <path d="M6 9l6 6 6-6"/>
            </svg>
          </button>
          {open === i && (
            <p style={{ fontSize: 14, color: '#64748B', lineHeight: 1.7, paddingBottom: 20, margin: 0 }}>{item.a}</p>
          )}
        </div>
      ))}
    </div>
  )
}

function PhoneFrame({ onStart }: { onStart: () => void }) {
  return (
    <div style={{
      width: 280, height: 520,
      background: '#1B2D4F', borderRadius: 40,
      boxShadow: '0 40px 80px rgba(27,45,79,0.3), 0 0 0 8px rgba(27,45,79,0.08)',
      overflow: 'hidden', position: 'relative', cursor: 'pointer',
    }} onClick={onStart}>
      {/* Status bar */}
      <div style={{ height: 44, background: '#1B2D4F', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', padding: '0 24px 8px', }}>
        <span style={{ color: 'white', fontSize: 12, fontWeight: 600 }}>9:41</span>
        <div style={{ width: 100, height: 22, background: 'rgba(0,0,0,0.4)', borderRadius: 20, margin: '0 auto' }} />
        <span style={{ color: 'white', fontSize: 12 }}>âââ</span>
      </div>
      {/* App header */}
      <div style={{ background: '#1B2D4F', padding: '12px 20px 16px', borderBottom: '1px solid rgba(201,168,76,0.2)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 10, letterSpacing: '1px', fontWeight: 600 }}>YOUR NEXT TRIP</div>
            <div style={{ color: '#fff', fontSize: 16, fontWeight: 800, letterSpacing: '-0.3px' }}>Paris, Sep 15</div>
          </div>
          <div style={{ width: 34, height: 34, background: '#C9A84C', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>âï¸</div>
        </div>
      </div>
      {/* Content */}
      <div style={{ background: '#F4F7FB', flex: 1, padding: '16px 16px 0' }}>
        {/* AI badge */}
        <div style={{ background: '#fff', borderRadius: 10, padding: '10px 14px', marginBottom: 10, border: '1px solid #E2EAF4', display: 'flex', gap: 10, alignItems: 'center' }}>
          <div style={{ width: 28, height: 28, background: '#C9A84C', borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 800, color: '#1B2D4F', flexShrink: 0 }}>AI</div>
          <div>
            <div style={{ fontSize: 10, fontWeight: 700, color: '#1B2D4F' }}>14 items recommended</div>
            <div style={{ fontSize: 9, color: '#94A3B8', marginTop: 1 }}>Based on Air France rules Â· 18Â°C Paris</div>
          </div>
        </div>
        {/* Pack items */}
        {[
          { name: 'Trench coat', tag: 'AI', checked: true },
          { name: 'Travel adapter (Type E)', tag: 'AI', checked: true },
          { name: 'Toiletries kit (carry-on)', tag: 'TSA', checked: true },
          { name: 'Walking shoes', tag: '', checked: false },
        ].map((item, i) => (
          <div key={i} style={{ background: '#fff', borderRadius: 8, padding: '8px 12px', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 10, border: '1px solid #E8EDF4' }}>
            <div style={{
              width: 16, height: 16, borderRadius: 4, flexShrink: 0,
              background: item.checked ? '#0D7A70' : 'transparent',
              border: item.checked ? 'none' : '1.5px solid #CBD5E1',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              {item.checked && <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={3.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>}
            </div>
            <span style={{ fontSize: 11, color: '#1B2D4F', fontWeight: 500, flex: 1 }}>{item.name}</span>
            {item.tag && <span style={{ fontSize: 8, fontWeight: 700, color: item.tag === 'AI' ? '#8a6e2a' : '#0D7A70', background: item.tag === 'AI' ? '#C9A84C20' : '#0D7A7015', padding: '2px 5px', borderRadius: 3 }}>{item.tag}</span>}
          </div>
        ))}
        {/* Weight bar */}
        <div style={{ background: '#fff', borderRadius: 8, padding: '8px 12px', border: '1px solid #E8EDF4', marginTop: 4 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
            <span style={{ fontSize: 9, fontWeight: 700, color: '#94A3B8', letterSpacing: '0.5px' }}>EST. WEIGHT</span>
            <span style={{ fontSize: 9, fontWeight: 700, color: '#0D7A70' }}>9.2kg / 23kg</span>
          </div>
          <div style={{ height: 4, background: '#E8EDF4', borderRadius: 2, overflow: 'hidden' }}>
            <div style={{ width: '40%', height: '100%', background: '#0D7A70', borderRadius: 2 }} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Landing({ onStart }: LandingProps) {
  return (
    <div style={S.page}>
      <Nav />

      {/* Hero */}
      <section style={S.hero}>
        {/* Background gradient */}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle at 80% 50%, rgba(201,168,76,0.06) 0%, transparent 60%), radial-gradient(circle at 10% 70%, rgba(13,122,112,0.04) 0%, transparent 50%)' }} />

        <div style={S.heroLeft}>
          <div style={S.eyebrow}>
            <span style={S.eyebrowDot} />
            <span style={S.eyebrowText}>AI-powered packing Â· NYC launch</span>
          </div>

          <h1 style={S.h1}>
            Your bag.<br />
            <span style={S.h1Gold}>Packed right.</span><br />
            At your door.
          </h1>

          <p style={S.sub}>
            Upload your ticket. Our AI reads the baggage rules,
            builds your personalized pack, and a professional
            delivers it â TSA-compliant â before you leave.
          </p>

          <div style={S.actions}>
            <button style={S.btnPrimary} onClick={onStart}>
              Plan my trip â
            </button>
            <button style={S.btnSecondary}>
              See how it works
            </button>
          </div>

          <p style={S.smallNote}>From $59/trip Â· No subscription required</p>
        </div>

        <div style={S.heroRight}>
          <PhoneFrame onStart={onStart} />
        </div>
      </section>

      {/* How it works */}
      <section style={{ padding: '96px 40px 72px', maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '2px', color: '#0D7A70', textTransform: 'uppercase', marginBottom: 12 }}>The Process</div>
          <h2 style={{ fontSize: 40, fontWeight: 900, color: '#1B2D4F', letterSpacing: '-1px', marginBottom: 14 }}>Four steps. Zero stress.</h2>
          <p style={{ fontSize: 16, color: '#64748B', maxWidth: 440, margin: '0 auto' }}>From ticket to doorstep â everything handled.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24 }}>
          {[
            { n: '01', title: 'Upload your ticket', body: 'Drop your boarding pass. AI extracts your airline, route, fare class, and exact baggage allowance in seconds.' },
            { n: '02', title: 'AI builds your list', body: 'Weather, destination, trip type, your personal style profile. You review and approve.' },
            { n: '03', title: 'Choose your bag', body: 'Curated options perfectly sized for your allowance, with a fit score for your exact item count.' },
            { n: '04', title: 'We pack and deliver', body: 'A professional packer assembles everything, verifies TSA compliance on a calibrated scale, and delivers.' },
          ].map((step, idx) => (
            <div key={step.n} style={{ background: '#fff', borderRadius: 16, border: '1px solid rgba(27,45,79,0.07)', overflow: 'hidden' }}>
              {/* Step photo */}
              <div style={{ height: 160, overflow: 'hidden', position: 'relative' }}>
                <img
                  src={STEP_PHOTOS[idx]}
                  alt={step.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 40%, rgba(27,45,79,0.18) 100%)' }} />
              </div>
              {/* Step content */}
              <div style={{ padding: '20px 22px 24px' }}>
                <div style={{ marginBottom: 12 }}>{STEP_ICONS[idx]}</div>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '1.5px', color: '#C9A84C', marginBottom: 8 }}>{step.n}</div>
                <h3 style={{ fontSize: 15, fontWeight: 800, color: '#1B2D4F', marginBottom: 8, letterSpacing: '-0.3px' }}>{step.title}</h3>
                <p style={{ fontSize: 13, color: '#64748B', lineHeight: 1.6 }}>{step.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Lifestyle photo band */}
      <section style={{ padding: '0 40px 96px', maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, height: 340 }}>
          {/* Left â tall photo with overlay text */}
          <div style={{ position: 'relative', borderRadius: 16, overflow: 'hidden', gridRow: 'span 1' }}>
            <img
              src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&q=75"
              alt="Effortless travel"
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(27,45,79,0.75) 0%, transparent 55%)' }} />
            <div style={{ position: 'absolute', bottom: 22, left: 22, right: 22 }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '1.5px', color: 'rgba(255,255,255,0.6)', marginBottom: 6, textTransform: 'uppercase' }}>The experience</div>
              <div style={{ fontSize: 18, fontWeight: 800, color: '#fff', letterSpacing: '-0.3px', lineHeight: 1.25 }}>Leave lighter.<br />Arrive better.</div>
            </div>
          </div>
          {/* Center â NYC photo */}
          <div style={{ position: 'relative', borderRadius: 16, overflow: 'hidden' }}>
            <img
              src="https://images.unsplash.com/photo-1522083165195-3424ed129620?w=800&q=75"
              alt="New York City"
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(27,45,79,0.5) 0%, transparent 60%)' }} />
            <div style={{ position: 'absolute', bottom: 18, left: 18 }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '1px', color: 'rgba(255,255,255,0.7)', background: 'rgba(27,45,79,0.5)', padding: '4px 10px', borderRadius: 20, display: 'inline-block' }}>Launching in NYC</div>
            </div>
          </div>
          {/* Right â professional packing photo */}
          <div style={{ position: 'relative', borderRadius: 16, overflow: 'hidden' }}>
            <img
              src="https://images.unsplash.com/photo-1590650153855-d9e808231d41?w=800&q=75"
              alt="Airport security checkpoint"
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(201,168,76,0.35) 0%, transparent 70%)' }} />
            <div style={{ position: 'absolute', bottom: 18, left: 18, right: 18 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#fff', letterSpacing: '-0.2px' }}>TSA-compliant, every time.</div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section style={{ padding: '0 40px 96px', maxWidth: 920, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '2px', color: '#0D7A70', textTransform: 'uppercase', marginBottom: 12 }}>Pricing</div>
          <h2 style={{ fontSize: 40, fontWeight: 900, color: '#1B2D4F', letterSpacing: '-1px' }}>Simple, per-trip pricing.</h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
          {[
            { name: 'Essentials', subtitle: '', price: 'Free', sub: 'always', features: ['AI packing list', 'Baggage rule checker', 'Destination weather', 'Shareable list'], cta: 'Start free', highlight: false },
            { name: 'Explorer', subtitle: 'AI style profile', price: '$59', sub: 'per trip', features: ['Everything in Essentials', 'Professional packing', 'TSA compliance check', 'Same-day delivery', 'Style profile building'], cta: 'Book Explorer', highlight: true },
            { name: 'Concierge', subtitle: 'Personal travel stylist', price: '$149', sub: 'per trip', features: ['Everything in Explorer', 'Dedicated travel stylist', 'Priority delivery', 'Luggage storage option', 'White-glove unpacking'], cta: 'Book Concierge', highlight: false },
          ].map(plan => (
            <div key={plan.name} style={{
              borderRadius: 16, padding: '28px 24px',
              background: plan.highlight ? '#1B2D4F' : '#fff',
              border: plan.highlight ? '2px solid #C9A84C' : '1px solid rgba(27,45,79,0.08)',
              boxShadow: plan.highlight ? '0 20px 60px rgba(27,45,79,0.2)' : 'none',
            }}>
              {plan.highlight && <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '1.5px', color: '#C9A84C', marginBottom: 14, textTransform: 'uppercase' }}>Most Popular</div>}
              <div style={{ fontSize: 14, fontWeight: 700, color: plan.highlight ? '#fff' : '#1B2D4F', marginBottom: 2 }}>{plan.name}</div>
              {plan.subtitle && (
                <div style={{ fontSize: 11, fontWeight: 600, color: plan.highlight ? 'rgba(201,168,76,0.8)' : '#0D7A70', marginBottom: 8, letterSpacing: '0.3px' }}>{plan.subtitle}</div>
              )}
              <div style={{ fontSize: 38, fontWeight: 900, color: plan.highlight ? '#C9A84C' : '#1B2D4F', letterSpacing: '-1px', marginBottom: 2 }}>{plan.price}</div>
              <div style={{ fontSize: 12, color: plan.highlight ? 'rgba(255,255,255,0.4)' : '#94A3B8', marginBottom: 22 }}>{plan.sub}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
                {plan.features.map(f => (
                  <div key={f} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={plan.highlight ? '#C9A84C' : '#0D7A70'} strokeWidth={2.5} style={{ flexShrink: 0, marginTop: 1 }}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
                    <span style={{ fontSize: 13, color: plan.highlight ? 'rgba(255,255,255,0.7)' : '#475569', lineHeight: 1.4 }}>{f}</span>
                  </div>
                ))}
              </div>
              <button onClick={onStart} style={{
                width: '100%', padding: '12px', borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: 'pointer', letterSpacing: '0.2px',
                background: plan.highlight ? '#C9A84C' : 'transparent',
                color: plan.highlight ? '#1B2D4F' : '#1B2D4F',
                border: plan.highlight ? 'none' : '1.5px solid rgba(27,45,79,0.2)',
              }}>{plan.cta}</button>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ accordion */}
      <section style={{ padding: '0 40px 96px', maxWidth: 920, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '2px', color: '#0D7A70', textTransform: 'uppercase', marginBottom: 12 }}>FAQ</div>
          <h2 style={{ fontSize: 40, fontWeight: 900, color: '#1B2D4F', letterSpacing: '-1px' }}>Questions before you book.</h2>
        </div>
        <FaqAccordion />
      </section>

      {/* Corporate B2B section */}
      <section id="corporate" style={{ background: '#F4F7FB', padding: '80px 40px', borderTop: '1px solid rgba(27,45,79,0.07)' }}>
        <div style={{ maxWidth: 840, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '2px', color: '#0D7A70', textTransform: 'uppercase', marginBottom: 12 }}>For Teams</div>
            <h2 style={{ fontSize: 36, fontWeight: 900, color: '#1B2D4F', letterSpacing: '-0.8px', marginBottom: 16 }}>Corporate travel programs.</h2>
            <p style={{ fontSize: 15, color: '#64748B', lineHeight: 1.7, marginBottom: 28 }}>
              Packtique for teams: centralized billing, traveler profiles for your whole org, and dedicated account support. Built for frequent business travelers who can't afford packing mistakes.
            </p>
            <a href="mailto:corporate@packtique.com" style={{
              display: 'inline-block', background: '#1B2D4F', color: '#fff', fontSize: 14, fontWeight: 700,
              padding: '13px 28px', borderRadius: 8, textDecoration: 'none', letterSpacing: '0.2px',
            }}>Book a demo â</a>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {[
              { icon: 'ð¥', label: 'Team profiles', desc: 'One account for your entire travel program. Individual style profiles for every traveler.' },
              { icon: 'ð', label: 'Centralized billing', desc: 'Monthly invoicing, spend reports, and per-traveler breakdowns for finance.' },
              { icon: 'ð', label: 'Policy compliance', desc: 'Enforce carry-on-only or specific bag weight limits across the whole team.' },
            ].map(item => (
              <div key={item.label} style={{ background: '#fff', borderRadius: 12, padding: '18px 20px', border: '1px solid rgba(27,45,79,0.07)', display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                <span style={{ fontSize: 20 }}>{item.icon}</span>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#1B2D4F', marginBottom: 3 }}>{item.label}</div>
                  <div style={{ fontSize: 12, color: '#64748B', lineHeight: 1.5 }}>{item.desc}</div>
                </div>
   
             </div>
            ))}
          </div>
        </div>
      </section>

      {/* Split footer CTA: waitlist + corporate */}
      <section style={{ background: '#1B2D4F', padding: '72px 40px' }}>
        <div style={{ maxWidth: 840, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, alignItems: 'center' }}>
          {/* Waitlist path */}
          <div style={{ borderRight: '1px solid rgba(255,255,255,0.1)', paddingRight: 40 }}>
            <h2 style={{ fontSize: 28, fontWeight: 900, color: '#fff', letterSpacing: '-0.6px', marginBottom: 10 }}>Be first in NYC.</h2>
            <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', marginBottom: 22, lineHeight: 1.6 }}>Join the waitlist and get early access when we launch.</p>
            <div style={{ display: 'flex', gap: 8 }}>
              <input type="email" placeholder="your@email.com" style={{
                flex: 1, background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)',
                borderRadius: 8, padding: '11px 14px', color: '#fff', fontSize: 13, outline: 'none',
              }} />
              <button style={{ background: '#C9A84C', color: '#1B2D4F', fontWeight: 700, fontSize: 13, padding: '11px 18px', borderRadius: 8, border: 'none', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                Join waitlist
              </button>
            </div>
          </div>
          {/* Corporate path */}
          <div style={{ paddingLeft: 40 }}>
            <h2 style={{ fontSize: 28, fontWeight: 900, color: '#fff', letterSpacing: '-0.6px', marginBottom: 10 }}>Corporate travel programs.</h2>
            <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', marginBottom: 22, lineHeight: 1.6 }}>Team accounts, centralized billing, and dedicated support.</p>
            <a href="#corporate" style={{
              display: 'inline-block', background: 'rgba(255,255,255,0.1)', color: '#fff', fontWeight: 700, fontSize: 13,
              padding: '11px 22px', borderRadius: 8, textDecoration: 'none', border: '1px solid rgba(255,255,255,0.2)',
            }}>
              Learn more â
            </a>
          </div>
        </div>
      </section>

      <footer style={{ background: '#111E33', padding: '24px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <img src="/logo.svg" alt="Packtique" style={{ height: 32, width: 'auto' }} />
        </div>
        <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.2)' }}>Â© 2026 Packtique Â· NYC launch 2026</p>
      </footer>
    </div>
  )
}
