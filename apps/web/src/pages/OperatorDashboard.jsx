import { useGridData } from '../hooks/useGridData'
import Navbar from '../components/layout/Navbar'
import MetricCard from '../components/ui/MetricCard'
import LiveBadge from '../components/ui/LiveBadge'

function NodeCard({ node }) {
  const batteryColor = node.battery_soc_pct > 50 ? '#4caf50' : node.battery_soc_pct > 20 ? '#f59e0b' : '#e63946'

  return (
    <div className="glass" style={{
      borderRadius: 'var(--radius-xl)',
      padding: '1.25rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '0.75rem',
      transition: 'all 0.3s ease',
    }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{
          fontSize: '0.7rem',
          fontFamily: 'var(--font-mono)',
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          color: 'var(--color-text-muted)',
        }}>
          {node.meter_id.replace('_', ' ')}
        </span>
        <span style={{
          fontSize: '0.65rem',
          fontFamily: 'var(--font-mono)',
          padding: '2px 8px',
          borderRadius: '999px',
          background: 'rgba(26,58,26,0.6)',
          color: '#4caf50',
          border: '1px solid rgba(76,175,80,0.3)',
        }}>ONLINE</span>
      </div>

      {/* Demand */}
      <div style={{
        fontSize: '1.8rem',
        fontWeight: 700,
        color: 'var(--color-text-primary)',
        lineHeight: 1,
      }}>
        {node.kw_demand?.toFixed(1)}
        <span style={{ fontSize: '1rem', fontWeight: 400, color: 'var(--color-text-secondary)', marginLeft: '4px' }}>kW</span>
      </div>

      {/* Solar + Battery row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>
        <span>☀️ {node.solar_kw?.toFixed(1)} kW</span>
        <span style={{ color: batteryColor }}>🔋 {node.battery_soc_pct?.toFixed(0)}%</span>
      </div>

      {/* Battery bar */}
      <div style={{ background: 'var(--color-surface-2)', borderRadius: '999px', height: '3px', overflow: 'hidden' }}>
        <div style={{
          width: `${node.battery_soc_pct || 0}%`,
          height: '100%',
          background: batteryColor,
          borderRadius: '999px',
          transition: 'width 0.5s ease',
        }} />
      </div>
    </div>
  )
}

export default function OperatorDashboard() {
  const { nodes, summary, connected } = useGridData()

  return (
    <div className="grid-bg" style={{ minHeight: '100vh', background: 'var(--color-bg)', color: 'var(--color-text-primary)', fontFamily: 'var(--font-sans)' }}>
      <Navbar />

      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '6rem 2rem 2rem' }}>

        {/* Page header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: '0.25rem' }}>
              Live Grid
            </h1>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)' }}>
              Eastern Province Microgrid Cluster
            </p>
          </div>
          <LiveBadge connected={connected} />
        </div>

        {/* Summary cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
          <MetricCard label="Total Demand" value={summary.totalDemand} unit="kW" icon="⚡" />
          <MetricCard label="Active Nodes" value={summary.nodeCount} icon="📡" />
          <MetricCard label="Solar Output" value={summary.totalSolar} unit="kW" icon="☀️" accent />
          <MetricCard label="Avg Battery" value={`${summary.avgBattery}%`} icon="🔋" />
        </div>

        {/* Node grid */}
        <h2 style={{ fontSize: '0.875rem', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--color-text-muted)', marginBottom: '1rem' }}>
          Live Grid Nodes
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem' }}>
          {nodes.map(node => <NodeCard key={node.meter_id} node={node} />)}
        </div>

      </div>
    </div>
  )
}