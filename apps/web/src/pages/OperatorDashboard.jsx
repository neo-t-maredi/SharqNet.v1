import { useGridData } from '../hooks/useGridData'

function NodeCard({ node }) {
  return (
    <div style={{
      background: '#1a1a1a',
      border: '1px solid #2a2a2a',
      borderRadius: '8px',
      padding: '1rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '0.5rem'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ color: '#888', fontSize: '0.8rem', textTransform: 'uppercase' }}>
          {node.meter_id}
        </span>
        <span style={{
          background: '#1a3a1a',
          color: '#4caf50',
          fontSize: '0.7rem',
          padding: '2px 8px',
          borderRadius: '4px'
        }}>ONLINE</span>
      </div>
      <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#e63946' }}>
        {node.kw_demand?.toFixed(1)} <span style={{ fontSize: '1rem' }}>kW</span>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#aaa' }}>
        <span>☀️ {node.solar_kw?.toFixed(1)} kW</span>
        <span>🔋 {node.battery_soc_pct?.toFixed(0)}%</span>
      </div>
      <div style={{ background: '#2a2a2a', borderRadius: '4px', height: '4px' }}>
        <div style={{
          background: '#4caf50',
          width: `${node.battery_soc_pct || 0}%`,
          height: '100%',
          borderRadius: '4px',
          transition: 'width 0.5s ease'
        }} />
      </div>
    </div>
  )
}

function OperatorDashboard() {
  const { nodes, summary, connected } = useGridData()

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', color: '#fff', fontFamily: 'sans-serif', padding: '2rem' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.5rem', margin: 0 }}>⚡ SharqNet <span style={{ color: '#888', fontWeight: 'normal' }}>Live Grid</span></h1>
        <span style={{
          background: connected ? '#1a3a1a' : '#3a1a1a',
          color: connected ? '#4caf50' : '#e63946',
          padding: '4px 12px',
          borderRadius: '20px',
          fontSize: '0.8rem'
        }}>
          {connected ? '● LIVE' : '○ DISCONNECTED'}
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
        {[
          { label: 'Total Demand', value: `${summary.totalDemand} kW`, icon: '⚡' },
          { label: 'Active Nodes', value: summary.nodeCount, icon: '📡' },
          { label: 'Solar Output', value: `${summary.totalSolar} kW`, icon: '☀️' },
          { label: 'Avg Battery', value: `${summary.avgBattery}%`, icon: '🔋' },
        ].map(stat => (
          <div key={stat.label} style={{ background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: '8px', padding: '1.2rem' }}>
            <div style={{ fontSize: '1.5rem', marginBottom: '0.3rem' }}>{stat.icon}</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#e63946' }}>{stat.value}</div>
            <div style={{ color: '#888', fontSize: '0.8rem', textTransform: 'uppercase' }}>{stat.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
        {nodes.map(node => <NodeCard key={node.meter_id} node={node} />)}
      </div>

    </div>
  )
}

export default OperatorDashboard