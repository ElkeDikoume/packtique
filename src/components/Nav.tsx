'use client'

interface NavProps {
  onLogoClick?: () => void
  light?: boolean
}

export default function Nav({ onLogoClick, light = false }: NavProps) {
  return (
    <nav
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        background: light ? 'rgba(250,250,248,0.95)' : 'rgba(27,45,79,0.97)',
        backdropFilter: 'blur(16px)',
        borderBottom: light ? '1px solid rgba(27,45,79,0.08)' : '1px solid rgba(201,168,76,0.2)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 40px', height: '60px',
      }}
    >
      <button onClick={onLogoClick} style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'none', border: 'none', cursor: 'pointer' }}>
        <div style={{
          width: 32, height: 32, background: '#C9A84C', borderRadius: 6,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 13, fontWeight: 800, color: '#1B2D4F', letterSpacing: '-0.5px'
        }}>P</div>
        <span style={{
          fontSize: 16, fontWeight: 800, letterSpacing: '2.5px',
          color: light ? '#1B2D4F' : '#FFFFFF'
        }}>
          PACK<span style={{ color: '#C9A84C' }}>TIQUE</span>
        </span>
      </button>

      <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
        {['How it works', 'Pricing', 'Corporate'].map(link => (
          <a key={link} style={{
            color: light ? 'rgba(27,45,79,0.55)' : 'rgba(255,255,255,0.65)',
            fontSize: 13, textDecoration: 'none', cursor: 'pointer', letterSpacing: '0.3px',
            fontWeight: 500, transition: 'color 0.15s'
          }}>{link}</a>
        ))}
        <button style={{
          background: '#C9A84C', color: '#1B2D4F', fontSize: 13, fontWeight: 700,
          padding: '8px 20px', borderRadius: 6, border: 'none', cursor: 'pointer',
          letterSpacing: '0.3px'
        }}>Get started</button>
      </div>
    </nav>
  )
}
