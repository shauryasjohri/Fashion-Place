import clsx from "clsx"

export default function Alert({ heading, body, info, success, danger, warning }) {
  return (
    <div
      className={clsx(
        "rounded-lg px-4 py-3 mb-4 text-sm",
        info && "text-blue-700 bg-blue-100 dark:text-blue-200 dark:bg-blue-900/50",
        danger && "text-red-700 bg-red-100 dark:text-red-200 dark:bg-red-900/50",
        success && "text-green-700 bg-green-100 dark:text-green-200 dark:bg-green-900/50",
        warning && "text-yellow-700 bg-yellow-100 dark:text-yellow-200 dark:bg-yellow-900/50",
      )}
      role="alert"
    >
      <span className="font-medium">{heading}</span> {body}
    </div>
  )
}
