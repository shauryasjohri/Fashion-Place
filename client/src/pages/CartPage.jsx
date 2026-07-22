import { useContext, useState } from 'react'
import { Link } from "react-router-dom"
import { ShoppingBag } from "react-feather"

import { CartContext } from "@/context/CartContext"
import { UserContext } from "@/context/UserContext"
import CartList from "@/components/cart/CartList"
import CartSummary from "@/components/cart/CartSummary"
import Button from "@/components/common/Button"
import PageHeader from "@/components/common/PageHeader"
import api from "@/services/api"
import CheckoutModal from '@/components/checkout/Checkout'
import useDocumentTitle from '@/hooks/useDocumentTitle'
import EmptyState from '@/components/common/EmptyState'
import ToastContainer from '@/components/common/Toast'
import { useToast } from '@/hooks/useToast'

export default function CartPage() {
  useDocumentTitle('Cart')
  const [showCheckoutModal, setShowCheckoutModal] = useState(false)
  const { user } = useContext(UserContext)
  const { cart, cartDispatch } = useContext(CartContext)
  const { toasts, addToast, removeToast } = useToast()

  const setProductQuantity = async (id, quantity) => {
    if (quantity < 1) {
      cartDispatch({ type: "REMOVE_PRODUCT", payload: id })
      addToast('Item removed from cart')
      if (user) api.removeProductFromCart(id)
    } else {
      cartDispatch({ type: "SET_PRODUCT_QUANTITY", payload: { id, quantity } })
      if (user) api.patchCart(id, quantity)
    }
  }

  const handleCreateOrder = () => {
    cartDispatch({ type: "RESET" })
    addToast('Order placed successfully!')
  }

  if (cart.products.length === 0) {
    return (
      <main className="my-14">
        <EmptyState
          icon={ShoppingBag}
          title="Your Shopping Cart is Empty"
          message="Looks like you haven't added anything yet."
          actionLabel="Continue Shopping"
          actionTo="/products"
        />
      </main>
    )
  }

  return (
    <main className="my-14">
      <PageHeader>Your Shopping Cart</PageHeader>
      <p className="text-center text-gray-500 dark:text-gray-400 mb-4" aria-live="polite">
        {cart.products.length} item{cart.products.length !== 1 ? 's' : ''} in your cart
      </p>
      <section className="max-w-6xl mx-auto my-16 relative gap-8 flex flex-col p-4 md:(flex-row items-start)">
        <section className="flex-1 sm:min-w-md divide-y divide-gray-200 dark:divide-gray-700 border border-gray-300 dark:border-gray-600 rounded shadow dark:shadow-gray-900/50">
          <CartList
            items={cart.products}
            setItemQuantity={(id, qty) => setProductQuantity(id, qty)}
          />
        </section>

        <section className="w-full md:w-auto border border-gray-300 dark:border-gray-600 rounded shadow dark:shadow-gray-900/50 py-4 md:(sticky top-20)">
          <CartSummary
            onCheckout={() => setShowCheckoutModal(true)}
            subtotal={cart.total}
            charges={[
              { name: "Shipping Charges", amount: 9 },
            ]}
            discounts={[
              { name: "Shipping Discount", amount: 9 },
            ]}
          />
        </section>
      </section>

      {showCheckoutModal &&
        <CheckoutModal
          onCancel={() => setShowCheckoutModal(false)}
          onSuccess={handleCreateOrder}
          addToast={addToast}
        />
      }

      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </main>
  )
}
