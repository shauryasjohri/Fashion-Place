import { useContext } from 'react'
import { Link } from 'react-router-dom'

import { UserContext } from '@/context'
import Input from "@/components/common/Input"
import Button from "@/components/common/Button"

export default function CartSummary({ subtotal, charges, discounts, onCheckout }) {
  const { user } = useContext(UserContext)
  const chargesTotal = charges.reduce((sum, c) => sum + c.amount, 0)
  const discountTotal = discounts.reduce((sum, d) => sum + d.amount, 0)
  const total = subtotal + chargesTotal - discountTotal

  return (
    <div className="flex flex-col p-4 space-y-4" aria-label="Cart summary">
      <h2 className="uppercase text-3xl">Cart Summary</h2>
      <div className="border-t border-b border-gray-200 dark:border-gray-700 space-y-4 py-4">
        <div className="flex justify-between text-lg">
          <span>Subtotal</span>
          <span aria-label={`Subtotal: $${subtotal}`}>${subtotal}</span>
        </div>
        {charges.map(charge => (
          <div className="flex justify-between" key={charge.name}>
            <span>{charge.name}</span>
            <span>${charge.amount}</span>
          </div>
        ))}
        {discounts.map(discount => (
          <div className="flex justify-between" key={discount.name}>
            <span>{discount.name}</span>
            <span>-${discount.amount}</span>
          </div>
        ))}
        <div className="flex justify-between font-medium text-2xl">
          <span>Total</span>
          <span aria-label={`Total: $${total}`}>${total}</span>
        </div>
      </div>
      <div className="flex justify-between">
        <Input placeholder="Coupon Code" className="!min-w-20" aria-label="Coupon code" />
        <Button secondary disabled>Apply</Button>
      </div>
      <Button className="w-full self-center" onClick={onCheckout} disabled={!user} aria-label={user ? 'Proceed to checkout' : 'Login to checkout'}>Checkout Now</Button>
      {!user &&
        <Link to="/register" className='text-sm text-gray-600 dark:text-gray-400 text-center'>
          Please login or register to checkout
        </Link>
      }
    </div>
  )
}
