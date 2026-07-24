'use client'

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
        <span style={{ color: 'white', fontSize: 12 }}>●●●</span>
      </div>
      {/* App header */}
      <div style={{ background: '#1B2D4F', padding: '12px 20px 16px', borderBottom: '1px solid rgba(201,168,76,0.2)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 10, letterSpacing: '1px', fontWeight: 600 }}>YOUR NEXT TRIP</div>
            <div style={{ color: '#fff', fontSize: 16, fontWeight: 800, letterSpacing: '-0.3px' }}>Paris, Sep 15</div>
          </div>
          <div style={{ width: 34, height: 34, background: '#C9A84C', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>✈️</div>
        </div>
      </div>
      {/* Content */}
      <div style={{ background: '#F4F7FB', flex: 1, padding: '16px 16px 0' }}>
        {/* AI badge */}
        <div style={{ background: '#fff', borderRadius: 10, padding: '10px 14px', marginBottom: 10, border: '1px solid #E2EAF4', display: 'flex', gap: 10, alignItems: 'center' }}>
          <div style={{ width: 28, height: 28, background: '#C9A84C', borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 800, color: '#1B2D4F', flexShrink: 0 }}>AI</div>
          <div>
            <div style={{ fontSize: 10, fontWeight: 700, color: '#1B2D4F' }}>14 items recommended</div>
            <div style={{ fontSize: 9, color: '#94A3B8', marginTop: 1 }}>Based on Air France rules · 18°C Paris</div>
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
        {/* Background grid */}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle at 80% 50%, rgba(201,168,76,0.06) 0%, transparent 60%), radial-gradient(circle at 10% 70%, rgba(13,122,112,0.04) 0%, transparent 50%)' }} />

        <div style={S.heroLeft}>
          <div style={S.eyebrow}>
            <span style={S.eyebrowDot} />
            <span style={S.eyebrowText}>AI-powered packing · NYC launch</span>
          </div>

          <h1 style={S.h1}>
            Your bag.<br />
            <span style={S.h1Gold}>Packed right.</span><br />
            At your door.
          </h1>

          <p style={S.sub}>
            Upload your ticket. Our AI reads the baggage rules,
            builds your personalized pack, and a professional
            delivers it — TSA-compliant — before you leave.
          </p>

          <div style={S.actions}>
            <button style={S.btnPrimary} onClick={onStart}>
              Plan my trip →
            </button>
            <button style={S.btnSecondary}>
              See how it works
            </button>
          </div>

          <p style={S.smallNote}>From $49/trip · No subscription required</p>
        </div>

        <div style={S.heroRight}>
          <PhoneFrame onStart={onStart} />
        </div>
      </section>

      {/* Social proof strip */}
      <div style={{ borderTop: '1px solid rgba(27,45,79,0.07)', borderBottom: '1px solid rgba(27,45,79,0.07)', padding: '18px 40px', display: 'flex', alignItems: 'center', gap: 40, background: '#fff', overflowX: 'auto' as const }}>
        <span style={{ fontSize: 11, color: '#94A3B8', fontWeight: 600, letterSpacing: '1px', whiteSpace: 'nowrap' }}>TRUSTED PARTNERS</span>
        {['Tumi', 'Away', 'Rimowa', 'Samsonite', 'Air France', 'Delta', 'United'].map(brand => (
          <span key={brand} style={{ fontSize: 13, fontWeight: 700, color: '#B0BAC8', letterSpacing: '0.5px', whiteSpace: 'nowrap' }}>{brand}</span>
        ))}
      </div>

      {/* How it works */}
      <section style={{ padding: '96px 40px', maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '2px', color: '#0D7A70', textTransform: 'uppercase', marginBottom: 12 }}>The Process</div>
          <h2 style={{ fontSize: 40, fontWeight: 900, color: '#1B2D4F', letterSpacing: '-1px', marginBottom: 14 }}>Four steps. Zero stress.</h2>
          <p style={{ fontSize: 16, color: '#64748B', maxWidth: 440, margin: '0 auto' }}>From ticket to doorstep — everything handled.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24 }}>
          {[
            { n: '01', title: 'Upload your ticket', body: 'Drop your boarding pass. AI extracts your airline, route, fare class, and exact baggage allowance in seconds.', icon: '✈️' },
            { n: '02', title: 'AI builds your list', body: 'Weather, destination, trip type, your personal style profile. You review and approve.', icon: '🧠' },
            { n: '03', title: 'Choose your bag', body: 'Curated options perfectly sized for your allowance, with a fit score for your exact item count.', icon: '🧳' },
            { n: '04', title: 'We pack and deliver', body: 'A certified packer assembles everything, verifies TSA compliance on a certified scale, and delivers.', icon: '📦' },
          ].map((step) => (
            <div key={step.n} style={{ background: '#fff', borderRadius: 16, padding: '28px 24px', border: '1px solid rgba(27,45,79,0.07)', transition: 'box-shadow 0.2s' }}>
              <div style={{ fontSize: 28, marginBottom: 14 }}>{step.icon}</div>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '1.5px', color: '#C9A84C', marginBottom: 8 }}>{step.n}</div>
              <h3 style={{ fontSize: 15, fontWeight: 800, color: '#1B2D4F', marginBottom: 8, letterSpacing: '-0.3px' }}>{step.title}</h3>
              <p style={{ fontSize: 13, color: '#64748B', lineHeight: 1.6 }}>{step.body}</p>
            </div>
          ))}
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
            { name: 'Essentials', price: 'Free', sub: 'always', features: ['AI packing list', 'Baggage rule checker', 'Destination weather', 'Shareable list'], cta: 'Start free', highlight: false },
            { name: 'Explorer', price: '$49', sub: 'per trip', features: ['Everything in Essentials', 'Professional packing', 'TSA compliance check', 'Same-day delivery', 'Style profile building'], cta: 'Book Explorer', highlight: true },
            { name: 'Concierge', price: '$149', sub: 'per trip', features: ['Everything in Explorer', 'Dedicated travel stylist', 'Priority delivery', 'Luggage storage option', 'White-glove unpacking'], cta: 'Book Concierge', highlight: false },
          ].map(plan => (
            <div key={plan.name} style={{
              borderRadius: 16, padding: '28px 24px',
              background: plan.highlight ? '#1B2D4F' : '#fff',
              border: plan.highlight ? '2px solid #C9A84C' : '1px solid rgba(27,45,79,0.08)',
              boxShadow: plan.highlight ? '0 20px 60px rgba(27,45,79,0.2)' : 'none',
            }}>
              {plan.highlight && <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '1.5px', color: '#C9A84C', marginBottom: 14, textTransform: 'uppercase' }}>Most Popular</div>}
              <div style={{ fontSize: 14, fontWeight: 700, color: plan.highlight ? '#fff' : '#1B2D4F', marginBottom: 4 }}>{plan.name}</div>
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

      {/* Footer CTA */}
      <section style={{ background: '#1B2D4F', padding: '72px 40px', textAlign: 'center' }}>
        <div style={{ maxWidth: 500, margin: '0 auto' }}>
          <h2 style={{ fontSize: 36, fontWeight: 900, color: '#fff', letterSpacing: '-0.8px', marginBottom: 14 }}>Ready to travel differently?</h2>
          <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.5)', marginBottom: 28 }}>NYC launch coming. Join the waitlist or book a corporate demo.</p>
          <div style={{ display: 'flex', gap: 10, maxWidth: 400, margin: '0 auto' }}>
            <input type="email" placeholder="your@email.com" style={{
              flex: 1, background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: 8, padding: '12px 16px', color: '#fff', fontSize: 13,
              outline: 'none'
            }} />
            <button style={{ background: '#C9A84C', color: '#1B2D4F', fontWeight: 700, fontSize: 13, padding: '12px 20px', borderRadius: 8, border: 'none', cursor: 'pointer', whiteSpace: 'nowrap' }}>
              Join waitlist
            </button>
          </div>
        </div>
      </section>

      <footer style={{ background: '#111E33', padding: '24px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 24, height: 24, background: '#C9A84C', borderRadius: 5, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 800, color: '#1B2D4F' }}>P</div>
          <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: '2px', color: 'rgba(255,255,255,0.35)' }}>PACKTIQUE</span>
        </div>
        <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.2)' }}>© 2026 Packtique · NYC launch 2026</p>
      </footer>
    </div>
  )
}
