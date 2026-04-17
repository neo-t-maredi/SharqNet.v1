export default function LiveBadge({ connected }) {
  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      padding: '4px 12px',
      borderRadius: '20px',
      fontSize: '0.75rem',
      fontFamily: 'var(--font-mono)',
      fontWeight: 500,
      background: connected ? 'rgba(26, 58, 26, 0.6)' : 'rgba(58, 26, 26, 0.6)',
      color: connected ? '#4caf50' : '#e63946',
      border: `1px solid ${connected ? '#4caf50' : '#e63946'}33`,
    }}>
      <span style={{
        width: '6px',
        height: '6px',
        borderRadius: '50%',
        background: connected ? '#4caf50' : '#e63946',
        marginRight: '6px',
        animation: connected ? 'blink 2s infinite' : 'none',
      }} />
      {connected ? 'LIVE' : 'DISCONNECTED'}
    </span>
  )
}