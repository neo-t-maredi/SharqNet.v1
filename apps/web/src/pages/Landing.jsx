import { useNavigate } from 'react-router-dom'

function Landing() {
  const navigate = useNavigate()
  
  // then on the buttons:
  // onClick={() => navigate('/grid')}
  // onClick={() => navigate('/investor')}


function Landing() {
  return (
    <div style={{
      minHeight: '100vh',
      background: '#0a0a0a',
      color: '#ffffff',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'sans-serif'
    }}>
     <h1 style={{ fontSize: '3rem', marginBottom: '0.5rem', color: '#ffffff' }}>
  ⚡ SharqNet
</h1>
      <p style={{ color: '#888', fontSize: '1.2rem', marginBottom: '2rem' }}>
        Real-time microgrid telemetry for the Eastern Province
      </p>
      <div style={{ display: 'flex', gap: '1rem' }}>
        <button style={{
          background: '#e63946',
          color: '#fff',
          border: 'none',
          padding: '0.8rem 2rem',
          borderRadius: '6px',
          fontSize: '1rem',
          cursor: 'pointer'
        }}>
          View Live Grid
        </button>
        <button style={{
          background: 'transparent',
          color: '#fff',
          border: '1px solid #444',
          padding: '0.8rem 2rem',
          borderRadius: '6px',
          fontSize: '1rem',
          cursor: 'pointer'
        }}>
          Investor Overview
        </button>
      </div>
    </div>
  )
}

export default Landing