export default function GlassCard({ children, style = {}, hover = true }) {
  return (
    <div
      className={hover ? 'glass' : ''}
      style={{
        borderRadius: 'var(--radius-xl)',
        padding: '1.5rem',
        position: 'relative',
        overflow: 'hidden',
        ...style,
      }}
    >
      {children}
    </div>
  )
}