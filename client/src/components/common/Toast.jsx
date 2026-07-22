import { X } from 'react-feather'
import clsx from 'clsx'

const variantClasses = {
  success: 'bg-green-500 text-white',
  danger: 'bg-red-500 text-white',
  warning: 'bg-yellow-500 text-white',
  info: 'bg-blue-500 text-white',
}

export default function ToastContainer({ toasts, removeToast }) {
  if (!toasts.length) return null

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col space-y-2" aria-live="polite" aria-label="Notifications">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className={clsx(
            'flex items-center justify-between min-w-[280px] max-w-sm px-4 py-3 rounded-lg shadow-lg transition-all duration-300',
            variantClasses[toast.variant] || variantClasses.info,
          )}
          role="alert"
        >
          <span className="text-sm font-medium mr-3">{toast.message}</span>
          <button
            onClick={() => removeToast(toast.id)}
            className="flex-shrink-0 ml-2 p-0.5 rounded hover:bg-white/20 transition-colors focus:outline-none focus:ring-2 focus:ring-white"
            aria-label="Dismiss notification"
          >
            <X size={16} />
          </button>
        </div>
      ))}
    </div>
  )
}
