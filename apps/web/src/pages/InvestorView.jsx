import { useGridData } from '../hooks/useGridData'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/layout/Navbar'
import MetricCard from '../components/ui/MetricCard'
import LiveBadge from '../components/ui/LiveBadge'

export default function InvestorView() {
  const { summary, connected } = useGridData()
  const navigate = useNavigate()

  return (
    <div className="grid-bg" style={{ minHeight: '100vh', background: 'var(--color-bg)', fontFamily: 'var(--font-sans)' }}>
      <Navbar />

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '6rem 2rem 2rem' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '3rem' }}>
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: '0.4rem' }}>
              Investor Overview
            </h1>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)' }}>
              SharqNet · Eastern Province Microgrid Cluster · Real-time
            </p>
          </div>
          <LiveBadge connected={connected} />
        </div>

        {/* Main metrics */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
          <MetricCard
            label="Total Cluster Demand"
            value={summary.totalDemand}
            unit="kW"
            icon="⚡"
          />
          <MetricCard
            label="Active Nodes"
            value={`${summary.nodeCount} / 10`}
            icon="📡"
          />
          <MetricCard
            label="Solar Generation"
            value={summary.totalSolar}
            unit="kW"
            icon="☀️"
            accent
          />
          <MetricCard
            label="Avg Battery SOC"
            value={`${summary.avgBattery}%`}
            icon="🔋"
          />
        </div>

        {/* Platform info */}
        <div className="glass" style={{
          borderRadius: 'var(--radius-xl)',
          padding: '2rem',
          marginBottom: '1.5rem',
        }}>
          <h3 style={{
            fontSize: '0.75rem',
            fontFamily: 'var(--font-mono)',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            color: 'var(--color-text-muted)',
            marginBottom: '1.5rem',
          }}>
            Platform
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
            {[
              { label: 'Data Pipeline', value: 'Rust → MQTT → TimescaleDB' },
              { label: 'API Layer', value: 'FastAPI + WebSocket' },
              { label: 'Update Frequency', value: '250ms edge · 2s stream' },
              { label: 'Infrastructure', value: 'Docker · Self-hosted' },
              { label: 'Location', value: 'Eastern Province, KSA' },
              { label: 'Node Type', value: 'SME Commercial Cluster' },
            ].map(item => (
              <div key={item.label}>
                <div style={{ fontSize: '0.7rem', fontFamily: 'var(--font-mono)', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.3rem' }}>
                  {item.label}
                </div>
                <div style={{ fontSize: '0.875rem', color: 'var(--color-text-primary)', fontWeight: 500 }}>
                  {item.value}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div style={{ textAlign: 'center', color: 'var(--color-text-muted)', fontSize: '0.8rem', fontFamily: 'var(--font-mono)', marginTop: '2rem' }}>
          Real-time data · SharqNet v1 · Eastern Province Microgrid Platform
        </div>

      </div>
    </div>
  )
}