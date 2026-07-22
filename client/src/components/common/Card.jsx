import clsx from "clsx"

export default function Card({ imgSrc, alt = '', children, className }) {
  return (
    <div className={clsx(
      "max-w-72 relative overflow-hidden group",
      "bg-white dark:bg-gray-800",
      "shadow-md dark:shadow-gray-900/50",
      "hover:shadow-lg dark:hover:shadow-gray-900/70",
      className,
    )}>
      <img
        className={clsx(
          "object-cover",
          "transition duration-500 ease-out transform",
          "group-hover:(scale-110)",
        )}
        src={imgSrc}
        alt={alt}
        loading="lazy"
      />
      {children}
    </div>
  )
}
