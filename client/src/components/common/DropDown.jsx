import clsx from "clsx"

export default function DropDown({ children, className, ...props }) {
  return (
    <div
      className={clsx(
        "absolute top-0 z-50",
        "bg-white dark:bg-gray-800 text-sm list-none",
        "divide-y divide-gray-100 dark:divide-gray-700",
        "rounded shadow-lg dark:shadow-gray-900/60 my-2",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export function Select({ children, className, ...props }) {
  return (
    <ul className={`py-1 ${className}`} {...props}>
      {children}
    </ul>
  )
}

export function Option({ children, className, ...props }) {
  return (
    <li
      className={`hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 block px-4 py-2 truncate cursor-pointer ${className}`}
      {...props}
    >
      {children}
    </li>
  )
}
