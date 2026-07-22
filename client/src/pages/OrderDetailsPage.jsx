import { useEffect, useState } from 'react'
import { ChevronLeft } from "react-feather"
import { useParams, useNavigate, Link } from "react-router-dom"

import Button from "@/components/common/Button"
import Container from "@/components/common/Container"
import OrderStatus from "@/components/order/OrderStatus"
import OrderProduct from "@/components/order/OrderProduct"
import api from '@/services/api'
import useDocumentTitle from '@/hooks/useDocumentTitle'
import { ProductDetailSkeleton } from '@/components/common/Skeleton'
import EmptyState from '@/components/common/EmptyState'

export default function OrderDetailsPage() {
  useDocumentTitle('Order Details')
  const navigate = useNavigate()
  const { id } = useParams()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    (async () => {
      setLoading(true)
      try {
        const resp = await api.fetchOrderDetails(id)
        if (resp.status !== "ok") {
          navigate("/404", { replace: true })
          return
        }
        setOrder(resp.order)
      } catch {
        navigate("/404", { replace: true })
      }
      setLoading(false)
    })()
  }, [id])

  if (loading) {
    return (
      <main className="relative mb-20">
        <Container heading={`Order Details`} className="flex flex-col">
          <ProductDetailSkeleton />
        </Container>
      </main>
    )
  }

  if (!order) return null

  return (
    <main className="relative mb-20">
      <Container heading={`Order Details for #${id}`} className="flex flex-col">
        <OrderDetailsSection heading="Status:">
          <div className="max-w-2xl mx-2 px-2 py-4 sm:mx-auto border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm dark:shadow-gray-900/50">
            <OrderStatus currentStatus={order.status} />
          </div>
          <div className="text-center space-y-2">
            <h3 className="text-xl mt-10">Shipping Info:</h3>
            <div className="space-x-1">
              <span className="font-normal">Address:</span>
              <span className="font-light">{order.address}</span>
            </div>
            <div className="space-x-1">
              <span className="font-normal">Phone No.:</span>
              <span className="font-light">+1234-567-890</span>
            </div>
          </div>
        </OrderDetailsSection>

        <OrderDetailsSection heading="Products:">
          <div className="flex flex-wrap justify-center gap-2">
            {order.products.map(p => (
              <Link key={p._id} to={`/products/${p.productID._id}`} aria-label={`View ${p.productID.title}`}>
                <OrderProduct
                  name={p.productID.title}
                  imgSrc={p.productID.image}
                  price={p.productID.price}
                  quantity={p.quantity}
                />
              </Link>
            ))}
          </div>
          <div className="text-center space-y-2">
            <h3 className="text-xl mt-10">Total Amount:</h3>
            <p className="text-2xl font-light">${order.amount}</p>
          </div>
        </OrderDetailsSection>
      </Container>

      <Button
        onClick={() => navigate(-1)}
        className="absolute -top-12 -left-4 text-lg"
        secondary
        aria-label="Go back to previous page"
      ><ChevronLeft className="mr-2" /> Back
      </Button>
    </main>
  )
}

function OrderDetailsSection({ heading, children }) {
  return (
    <section className="my-12">
      <h2 className="text-2xl text-center font-medium mb-4">{heading}</h2>
      {children}
    </section>
  )
}
