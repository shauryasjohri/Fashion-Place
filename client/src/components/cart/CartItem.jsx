import { memo } from 'react'
import { Plus, Minus, Trash } from "react-feather"

function CartItem({ imgSrc, name, price, quantity, setQuantity }) {
  return (
    <div className="flex flex-wrap items-center m-2 p-2 border-b border-gray-200 dark:border-gray-700 last:border-b-0">
      <section className="max-w-28 md:max-w-40 overflow-hidden mr-2">
        <img className="object-cover" src={imgSrc} alt={name} loading="lazy" />
      </section>
      <section className="flex-1 flex flex-col">
        <div>
          <h3 className="text-lg font-medium">{name}</h3>
        </div>
        <div className="flex justify-between">
          <div className="flex flex-col space-y-2 mr-2 py-2">
            <div className="flex items-center">
              <span className="font-bold mr-2">Price:</span>
              <span className="text-lg" aria-label={`Price: $${price}`}>${price}</span>
            </div>
            <div className="flex">
              <span className="font-bold mr-2">Color:</span>
              <div className="h-6 w-6 bg-gray-400 dark:bg-gray-500 rounded-full" aria-label="Color: gray" />
            </div>
            <div>
              <span className="font-bold mr-2">Size:</span>
              <span>M</span>
            </div>
          </div>
          <div className="flex justify-between flex-col items-end ml-auto space-y-2">
            <div>
              <span className="text-2xl font-light" aria-label={`Subtotal: $${quantity * price}`}>${quantity * price}</span>
            </div>
            <div className="flex items-center space-x-2 border border-gray-300 dark:border-gray-600 rounded-lg p-1">
              <button
                onClick={() => setQuantity(quantity - 1)}
                className="flex items-center justify-center p-0.5 focus:outline-none focus:ring-2 focus:ring-gray-400 rounded"
                aria-label={quantity > 1 ? `Decrease quantity of ${name}` : `Remove ${name} from cart`}
              >
                {quantity > 1 ? <Minus size={18} /> : <Trash size={18} />}
              </button>
              <span className="text-xl px-1" aria-label={`Quantity: ${quantity}`}>{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="flex items-center justify-center p-0.5 focus:outline-none focus:ring-2 focus:ring-gray-400 rounded"
                aria-label={`Increase quantity of ${name}`}
              >
                <Plus size={18} />
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default memo(CartItem)
