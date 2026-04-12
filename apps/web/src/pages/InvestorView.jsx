import { useGridData } from '../hooks/useGridData'
import { useNavigate } from 'react-router-dom'

function InvestorView() {
  const { nodes, summary, connected } = useGridData()
  const navigate = useNavigate()

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', color: '#fff', fontFamily: 'sans-serif', padding: '2rem' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', margin: 0 }}>⚡ SharqNet</h1>
          <p style={{ color: '#888', margin: '0.3rem 0 0' }}>Investor Overview</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <span style={{
            background: connected ? '#1a3a1a' : '#3a1a1a',
            color: connected ? '#4caf50' : '#e63946',
            padding: '4px 12px',
            borderRadius: '20px',
            fontSize: '0.8rem'
          }}>
            {connected ? '● LIVE' : '○ DISCONNECTED'}
          </span>
          <button
            onClick={() => navigate('/')}
            style={{ background: 'transparent', color: '#888', border: '1px solid #333', padding: '6px 16px', borderRadius: '6px', cursor: 'pointer' }}>
            ← Back
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem', maxWidth: '800px', margin: '0 auto' }}>
        {[
          { label: 'Total Cluster Demand', value: `${summary.totalDemand} kW`, desc: 'Live aggregate power consumption' },
          { label: 'Active Nodes', value: `${summary.nodeCount} / 10`, desc: 'Online SME energy nodes' },
          { label: 'Solar Generation', value: `${summary.totalSolar} kW`, desc: 'Live renewable output' },
          { label: 'Avg Battery SOC', value: `${summary.avgBattery}%`, desc: 'Cluster storage health' },
        ].map(stat => (
          <div key={stat.label} style={{
            background: '#141414',
            border: '1px solid #2a2a2a',
            borderRadius: '12px',
            padding: '2rem',
          }}>
            <div style={{ color: '#888', fontSize: '0.85rem', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
              {stat.label}
            </div>
            <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#e63946', marginBottom: '0.5rem' }}>
              {stat.value}
            </div>
            <div style={{ color: '#555', fontSize: '0.85rem' }}>{stat.desc}</div>
          </div>
        ))}
      </div>

      <div style={{ textAlign: 'center', marginTop: '3rem', color: '#555', fontSize: '0.85rem' }}>
        Real-time data · Eastern Province Microgrid Cluster · SharqNet v1
      </div>

    </div>
  )
}

export default InvestorView