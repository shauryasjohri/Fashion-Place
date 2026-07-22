export default function ToastContainer({ toasts, removeToast }) {
  if (!toasts.length) return null

  return (
    <div className="position-fixed top-0 end-0 p-3" style={{ zIndex: 9999 }}>
      {toasts.map(toast => (
        <div
          key={toast.id}
          className={`toast show align-items-center text-white bg-${toast.variant} border-0 mb-2`}
          role="alert"
          aria-live="assertive"
          aria-atomic="true"
        >
          <div className="d-flex">
            <div className="toast-body">{toast.message}</div>
            <button
              type="button"
              className="btn-close btn-close-white me-2 m-auto"
              onClick={() => removeToast(toast.id)}
              aria-label="Dismiss"
            />
          </div>
        </div>
      ))}
    </div>
  )
}
