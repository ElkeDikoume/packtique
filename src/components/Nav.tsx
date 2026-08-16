'use client'

export default function Nav() {
  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 40px', height: 60,
      background: 'rgba(250,250,248,0.88)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid rgba(27,45,79,0.06)',
    }}>
      {/* Logo */}
      <a href="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
        <img src="/logo.svg" alt="Packtique" style={{ height: 38, width: 'auto' }} />
      </a>

      {/* Nav links */}
      <div style={{ display: 'flex', gap: 32, alignItems: 'center' }}>
        {[
          { label: 'How it works', href: '#' },
          { label: 'Pricing', href: '#' },
          { label: 'Corporate', href: '#corporate' },
        ].map(link => (
          <a key={link.label} href={link.href} style={{
            fontSize: 13, fontWeight: 600, color: '#1B2D4F',
            textDecoration: 'none', letterSpacing: '0.1px',
            opacity: 0.7,
          }}>{link.label}</a>
        ))}
      </div>

      {/* CTA */}
      <a href="#" style={{
        fontSize: 13, fontWeight: 700, color: '#1B2D4F',
        background: '#C9A84C', padding: '8px 20px', borderRadius: 7,
        textDecoration: 'none', letterSpacing: '0.2px',
      }}>Plan my trip â</a>
    </nav>
  )
}
