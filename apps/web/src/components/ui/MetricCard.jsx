export default function MetricCard({ label, value, unit, icon, accent = false }) {
  return (
    <div className="glass" style={{
      borderRadius: 'var(--radius-xl)',
      padding: '1.25rem 1.5rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '0.4rem',
      transition: 'all 0.3s ease',
    }}>
      <div style={{
        fontSize: '0.7rem',
        fontFamily: 'var(--font-mono)',
        textTransform: 'uppercase',
        letterSpacing: '0.1em',
        color: 'var(--color-text-muted)',
      }}>
        {icon && <span style={{ marginRight: '0.4rem' }}>{icon}</span>}
        {label}
      </div>
      <div style={{
        fontSize: '2rem',
        fontWeight: 700,
        color: accent ? 'var(--color-electric)' : 'var(--color-text-primary)',
        lineHeight: 1,
      }}>
        {value}
        {unit && (
          <span style={{
            fontSize: '1rem',
            fontWeight: 400,
            color: 'var(--color-text-secondary)',
            marginLeft: '0.3rem',
          }}>
            {unit}
          </span>
        )}
      </div>
    </div>
  )
}