import { memo } from 'react'

function OrderProduct({ name, imgSrc, price, quantity }) {
  return (
    <div className="flex flex-col items-center bg-gray-100 dark:bg-gray-700 rounded-lg shadow p-2">
      <div className="w-28 h-28 sm:(w-36 h-36) overflow-hidden rounded-lg">
        <img className="object-cover h-full" src={imgSrc} alt={name} loading="lazy" />
      </div>
      <div className="flex flex-col items-center mt-2">
        <h4 className="text-sm text-center">{name}</h4>
        <span className="text-base font-light">${price}</span>
        {quantity > 1 && <span className="text-xs text-gray-400 dark:text-gray-500" aria-label={`Quantity: ${quantity}`}>Qty: {quantity}</span>}
      </div>
    </div>
  )
}

export default memo(OrderProduct)
