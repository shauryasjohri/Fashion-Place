import { Package } from 'react-feather'
import { Link } from 'react-router-dom'
import Button from './Button'

export default function EmptyState({
  icon: Icon = Package,
  title = 'Nothing here yet',
  message = '',
  actionLabel = '',
  actionTo = '',
  onAction,
}) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-4 space-y-4" role="status">
      <Icon className="w-16 h-16 text-gray-400" aria-hidden="true" />
      <h2 className="text-2xl font-medium text-gray-700">{title}</h2>
      {message && <p className="text-gray-500 max-w-md">{message}</p>}
      {actionLabel && actionTo && (
        <Link to={actionTo}>
          <Button link className="text-lg">{actionLabel}</Button>
        </Link>
      )}
      {actionLabel && onAction && (
        <Button link className="text-lg" onClick={onAction}>{actionLabel}</Button>
      )}
    </div>
  )
}
