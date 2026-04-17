import { useNavigate } from 'react-router-dom'
import Navbar from '../components/layout/Navbar'
import ElectricOrb from '../components/orb/ElectricOrb'
import MetricCard from '../components/ui/MetricCard'
import { useGridData } from '../hooks/useGridData'

export default function Landing() {
  const navigate = useNavigate()
  const { summary, connected } = useGridData()

  return (
    <div className="grid-bg" style={{ minHeight: '100vh', background: 'var(--color-bg)' }}>
      <Navbar />

      {/* HERO */}
      <section style={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden',
        background: 'radial-gradient(circle at 60% 50%, #0f2040 0%, #020617 65%)',
      }}>
        <ElectricOrb />

        <div style={{
          position: 'relative',
          zIndex: 10,
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '0 2rem',
          width: '100%',
          paddingTop: '80px',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '4rem',
          alignItems: 'center',
        }}>
          {/* Left — copy */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              padding: '6px 16px',
              borderRadius: '999px',
              border: '1px solid rgba(148,163,184,0.2)',
              background: 'rgba(15,23,42,0.5)',
              fontSize: '0.75rem',
              fontFamily: 'var(--font-mono)',
              color: '#94a3b8',
              width: 'fit-content',
            }}>
              <span style={{
                width: '6px', height: '6px',
                background: '#38bdf8',
                borderRadius: '50%',
                marginRight: '8px',
                animation: 'blink 2s infinite',
              }} />
              Eastern Province Grid Online ⚡ 12kV
            </div>

            <h1 style={{
              fontSize: 'clamp(3rem, 6vw, 5rem)',
              fontWeight: 800,
              lineHeight: 0.9,
              letterSpacing: '-0.03em',
              color: '#fff',
            }}>
              Microgrid<br />
              <span className="text-gradient">Intelligence</span>
            </h1>

            <p style={{
              fontSize: '1.1rem',
              color: 'var(--color-text-secondary)',
              maxWidth: '480px',
              lineHeight: 1.7,
              fontWeight: 300,
            }}>
              Real-time telemetry for distributed energy clusters across the Eastern Province.
              Edge-to-cloud pipeline with{' '}
              <span style={{ color: '#7dd3fc', fontWeight: 600 }}>high-voltage monitoring</span>.
            </p>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <button
                onClick={() => navigate('/grid')}
                style={{
                  padding: '1rem 2rem',
                  background: '#f1f5f9',
                  color: '#020617',
                  border: 'none',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.95rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  animation: 'electric-pulse 3s infinite',
                }}>
                Access Dashboard
              </button>
              <button
                onClick={() => navigate('/investor')}
                style={{
                  padding: '1rem 2rem',
                  background: 'transparent',
                  color: '#94a3b8',
                  border: '1px solid #334155',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.95rem',
                  fontWeight: 500,
                  cursor: 'pointer',
                }}>
                Investor Overview
              </button>
            </div>
          </div>

          {/* Right — live metrics */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', position: 'relative', zIndex: 20 }}>
            <MetricCard
              label="Total Cluster Demand"
              value={summary.totalDemand}
              unit="kW"
              icon="⚡"
              accent={false}
            />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <MetricCard label="Active Nodes" value={`${summary.nodeCount}/10`} icon="📡" />
              <MetricCard label="Solar Output" value={summary.totalSolar} unit="kW" icon="☀️" accent />
            </div>
            <MetricCard label="Avg Battery SOC" value={`${summary.avgBattery}%`} icon="🔋" />
          </div>
        </div>
      </section>
    </div>
  )
}