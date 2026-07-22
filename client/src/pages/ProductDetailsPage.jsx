import { useEffect, useState } from 'react'
import { Link, useParams, useNavigate } from "react-router-dom"
import { Check, ChevronLeft, ShoppingCart } from "react-feather"

import Button from "@/components/common/Button"
import api from '@/services/api'
import { useCart } from '@/hooks/useCart'
import useDocumentTitle from '@/hooks/useDocumentTitle'
import { ProductDetailSkeleton } from '@/components/common/Skeleton'
import ToastContainer from '@/components/common/Toast'
import { useToast } from '@/hooks/useToast'

export default function ProductDetailsPage() {
  const { cart, addToCart } = useCart()
  const navigate = useNavigate()
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const { toasts, addToast, removeToast } = useToast()

  useEffect(() => {
    (async () => {
      setLoading(true)
      try {
        const resp = await api.fetchProduct(id)
        if (resp.status == "error") {
          navigate("/404", { replace: true })
          return
        }
        setProduct(resp)
      } catch {
        navigate("/404", { replace: true })
      }
      setLoading(false)
    })()
  }, [id])

  useDocumentTitle(product ? product.title : 'Product')

  if (loading) return <ProductDetailSkeleton />

  if (!product) return null

  const handleAddToCart = () => {
    addToCart(product)
    addToast(`${product.title} added to cart`)
  }

  return (
    <main className="relative mb-20">
      <div className="grid grid-cols-1 md:grid-cols-2 py-8 px-4">
        <section className="flex items-center max-h-2xl overflow-hidden my-10 sm:mx-0">
          <img
            className="object-cover"
            src={product.image}
            alt={product.title}
            loading="lazy"
          />
        </section>
        <section className="flex flex-col justify-center space-y-6 text-gray-600">
          <h2 className="text-4xl text-gray-800">{product.title}</h2>
          <p className="text-xl">{product.description}</p>
          <span className="text-2xl font-medium">${product.price}</span>
          {cart.products.some(p => p.id === id) ? (
            <Link to="/cart">
              <Button link className="sm:max-w-xs text-base">
                <Check className="mr-2" />
                <span>Added to Cart</span>
              </Button>
            </Link>
          ) : (
            <Button className="sm:max-w-xs text-base" onClick={handleAddToCart}>
              <ShoppingCart className="opacity-80 mr-4" />
              <span>Add to Cart</span>
            </Button>
          )}
        </section>
      </div>
      <Button
        onClick={() => navigate(-1)}
        className="absolute top-0 text-lg"
        secondary
        aria-label="Go back to previous page"
      ><ChevronLeft className="mr-2" /> Back
      </Button>

      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </main>
  )
}
