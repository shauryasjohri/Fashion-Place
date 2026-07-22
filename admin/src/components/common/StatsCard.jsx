export default function StatsCard({ title, value, icon, variant = 'primary' }) {
  return (
    <div className={`card border-start border-4 border-${variant} shadow-sm h-100`} style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)', color: 'var(--color-text)' }}>
      <div className="card-body d-flex align-items-center gap-3">
        <div className={`text-${variant} flex-shrink-0`}>
          {icon}
        </div>
        <div>
          <div className="card-subtitle text-muted small">{title}</div>
          <div className="card-title mb-0 h4" style={{ color: 'var(--color-text)' }}>{value}</div>
        </div>
      </div>
    </div>
  )
}
