import clsx from "clsx"

export default function Input({ icon, className, ...props}) {
  const input =
    <input
      type="text"
      className={clsx(
        "w-full min-w-56 bg-gray-50 border border-gray-300 text-gray-900 rounded-lg p-2",
        "focus:(outline-none ring ring-gray-300)",
        "dark:(bg-gray-700 border-gray-600 text-gray-100 focus:ring-gray-500)",
        icon && "pl-10",
        props.disabled && "!text-gray-600 !bg-gray-200 dark:!text-gray-400 dark:!bg-gray-800",
        className,
      )}
      {...props}
    />

  if (icon) {
    return (
      <div className="w-full flex items-center relative mx-0 md:mx-3">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-600 dark:text-gray-400">
          {icon}
        </div>
        {input}
      </div>
    )
  }
  return input
}
