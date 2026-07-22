const variants = {
  pending: 'warning',
  processing: 'info',
  shipped: 'primary',
  delivered: 'success',
  cancelled: 'danger',
  confirmed: 'success',
}

export default function StatusBadge({ status }) {
  const variant = variants[status?.toLowerCase()] || 'secondary'
  return <span className={`badge bg-${variant}`}>{status}</span>
}
