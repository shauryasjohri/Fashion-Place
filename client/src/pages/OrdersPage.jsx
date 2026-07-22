import { useEffect, useState } from 'react'
import { Link } from "react-router-dom"
import { ShoppingBag } from "react-feather"

import OrderItem from "@/components/order/OrderItem"
import PageHeader from "@/components/common/PageHeader"
import Button from "@/components/common/Button"
import api from '@/services/api'
import useDocumentTitle from '@/hooks/useDocumentTitle'
import { OrderItemSkeleton } from '@/components/common/Skeleton'
import EmptyState from '@/components/common/EmptyState'
import ToastContainer from '@/components/common/Toast'
import { useToast } from '@/hooks/useToast'

export default function OrdersPage() {
  useDocumentTitle('My Orders')
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { toasts, addToast, removeToast } = useToast()

  useEffect(() => {
    (async () => {
      setLoading(true)
      setError(null)
      try {
        const resp = await api.fetchAllOrders()
        if (Array.isArray(resp)) {
          setOrders(resp)
        } else {
          setOrders([])
        }
      } catch (e) {
        setError('Failed to load orders')
        addToast('Failed to load orders', 'danger')
      }
      setLoading(false)
    })()
  }, [])

  if (loading) {
    return (
      <main className="min-h-screen my-14">
        <PageHeader>Your Orders</PageHeader>
        <section className="flex flex-col max-w-2xl border border-gray-300 dark:border-gray-600 rounded shadow dark:shadow-gray-900/50 divide-y divide-gray-200 dark:divide-gray-700 my-16 px-2 py-4 m-4 sm:mx-auto">
          {[1, 2, 3].map(i => <OrderItemSkeleton key={i} />)}
        </section>
      </main>
    )
  }

  if (error) {
    return (
      <main className="min-h-screen my-14">
        <EmptyState
          title="Unable to load orders"
          message={error}
          actionLabel="Try Again"
          onAction={() => window.location.reload()}
        />
      </main>
    )
  }

  if (orders.length === 0) {
    return (
      <main className="min-h-screen my-14">
        <EmptyState
          icon={ShoppingBag}
          title="You Currently Have No Orders"
          message="Start shopping to see your orders here."
          actionLabel="Order Something"
          actionTo="/products"
        />
      </main>
    )
  }

  return (
    <main className="min-h-screen my-14">
      <PageHeader>Your Orders</PageHeader>
      <p className="text-center text-gray-500 dark:text-gray-400 mb-4">{orders.length} order{orders.length !== 1 ? 's' : ''} total</p>

      <section className="flex flex-col max-w-2xl border border-gray-300 dark:border-gray-600 rounded shadow dark:shadow-gray-900/50 divide-y divide-gray-200 dark:divide-gray-700 my-16 px-2 py-4 m-4 sm:mx-auto">
        {orders.map(order => (
          <Link key={order._id} to={`/orders/${order._id}`} aria-label={`View order ${order._id}`}>
            <OrderItem
              products={order.products}
              status={order.status}
              amount={order.amount}
            />
          </Link>
        ))}
      </section>

      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </main>
  )
}
