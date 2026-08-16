'use client'

interface NavProps {
  onLogoClick?: () => void
  light?: boolean
  /**
   * Only the landing page contains the #how-it-works / #pricing / #corporate
   * sections, so the link cluster is opt-in. Inner flow screens render a
   * logo-only nav rather than links that scroll to nothing.
   */
  showLinks?: boolean
  onGetStarted?: () => void
}

const NAV_LINKS = [
  { label: 'How it works', href: '#how-it-works' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'Corporate', href: '#corporate' },
]

/**
 * The Packtique suitcase-P mark, matching public/logo.svg.
 * Gold reads on both the navy and cream nav backgrounds, so it needs no
 * light/dark variant. Exported for reuse in the footer.
 */
export function LogoMark({ size = 30 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="8 20 76 76" fill="none" aria-hidden="true" style={{ flexShrink: 0 }}>
      <rect x="12" y="20" width="16" height="72" rx="5" fill="#C9A84C" />
      <path d="M 28 46 Q 28 28 52 28 Q 76 28 76 46" stroke="#C9A84C" strokeWidth="9" strokeLinecap="round" fill="none" />
      <rect x="28" y="44" width="50" height="42" rx="10" fill="#C9A84C" />
      <rect x="28" y="62" width="50" height="6" fill="#B8943A" opacity="0.55" />
      <rect x="44" y="58" width="20" height="14" rx="5" fill="#B8943A" opacity="0.7" />
      <rect x="48" y="62" width="12" height="6" rx="3" fill="#1B2D4F" opacity="0.3" />
    </svg>
  )
}

export default function Nav({ onLogoClick, light = false, showLinks = false, onGetStarted }: NavProps) {
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
      <button
        onClick={onLogoClick}
        aria-label="Packtique home"
        style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'none', border: 'none', cursor: onLogoClick ? 'pointer' : 'default', padding: 0 }}
      >
        <LogoMark size={30} />
        <span style={{
          fontSize: 16, fontWeight: 800, letterSpacing: '2.5px',
          color: light ? '#1B2D4F' : '#FFFFFF'
        }}>
          PACK<span style={{ color: '#C9A84C' }}>TIQUE</span>
        </span>
      </button>

      {showLinks && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
          {NAV_LINKS.map(link => (
            <a key={link.label} href={link.href} style={{
              color: light ? 'rgba(27,45,79,0.55)' : 'rgba(255,255,255,0.65)',
              fontSize: 13, textDecoration: 'none', cursor: 'pointer', letterSpacing: '0.3px',
              fontWeight: 500, transition: 'color 0.15s'
            }}>{link.label}</a>
          ))}
          {onGetStarted && (
            <button onClick={onGetStarted} style={{
              background: '#C9A84C', color: '#1B2D4F', fontSize: 13, fontWeight: 700,
              padding: '8px 20px', borderRadius: 6, border: 'none', cursor: 'pointer',
              letterSpacing: '0.3px'
            }}>Get started</button>
          )}
        </div>
      )}
    </nav>
  )
}
