export default function PageHeader({ title, subtitle, children }) {
  return (
    <div className="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h4 className="mb-1" style={{ color: 'var(--color-text)' }}>{title}</h4>
        {subtitle && <small className="text-muted">{subtitle}</small>}
      </div>
      {children && <div>{children}</div>}
    </div>
  )
}
