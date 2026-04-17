import { useNavigate, useLocation } from 'react-router-dom'

export default function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()

  const navLinks = [
    { label: 'Dashboard', path: '/grid' },
    { label: 'Investor', path: '/investor' },
    { label: 'Architecture', path: '#architecture' },
  ]

  return (
    <nav style={{
      position: 'fixed',
      top: 0,
      width: '100%',
      zIndex: 50,
      borderBottom: '1px solid rgba(30, 41, 59, 0.8)',
    }} className="glass">
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '0 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: '64px',
      }}>

        {/* Logo */}
        <div
          onClick={() => navigate('/')}
          style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}
        >
          <div style={{
            width: '32px', height: '32px',
            background: 'linear-gradient(135deg, #94a3b8, #475569)',
            borderRadius: '8px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: '1px solid rgba(148,163,184,0.3)',
          }}>
            <svg width="18" height="18" fill="none" stroke="#020617" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z"/>
            </svg>
          </div>
          <span style={{ fontSize: '1.2rem', fontWeight: 700, color: '#e2e8f0', letterSpacing: '-0.02em' }}>
            Sharq<span style={{ color: '#94a3b8' }}>Net</span>
          </span>
        </div>

        {/* Nav Links */}
        <div style={{ display: 'flex', gap: '2rem' }}>
          {navLinks.map(link => (
            <span
              key={link.path}
              onClick={() => navigate(link.path)}
              style={{
                fontSize: '0.875rem',
                fontWeight: 500,
                cursor: 'pointer',
                color: location.pathname === link.path ? '#38bdf8' : '#94a3b8',
                transition: 'color 0.2s',
              }}
              onMouseEnter={e => e.target.style.color = '#38bdf8'}
              onMouseLeave={e => e.target.style.color = location.pathname === link.path ? '#38bdf8' : '#94a3b8'}
            >
              {link.label}
            </span>
          ))}
        </div>

        {/* Right side */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span className="live-dot" style={{
            fontSize: '0.75rem',
            fontFamily: 'var(--font-mono)',
            color: '#38bdf8',
            fontWeight: 500,
          }}>LIVE</span>
          <button
            style={{
              padding: '0.4rem 1rem',
              background: '#1e293b',
              color: '#e2e8f0',
              border: '1px solid #334155',
              borderRadius: '8px',
              fontSize: '0.875rem',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Export
          </button>
        </div>

      </div>
    </nav>
  )
}