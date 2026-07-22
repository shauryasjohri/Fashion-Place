import { useEffect, useState } from 'react'
import { Link } from "react-router-dom"
import { ChevronRight } from "react-feather"
import { sliderItems, categories } from '@/constants'

import Button from "@/components/common/Button"
import Container from "@/components/common/Container"
import CategoryList from "@/components/product/CategoryList"
import ProductList from "@/components/product/ProductList"
import Newsletter from "@/components/ui/Newsletter"
import Carousel from '@/components/common/Carousel'
import api from '@/services/api'
import { useCart } from '@/hooks/useCart'
import useDocumentTitle from '@/hooks/useDocumentTitle'
import { ProductListSkeleton } from '@/components/common/Skeleton'
import ToastContainer from '@/components/common/Toast'
import { useToast } from '@/hooks/useToast'

export default function HomePage() {
  useDocumentTitle('Home')
  const { addToCart } = useCart()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { toasts, addToast, removeToast } = useToast()

  useEffect(() => {
    (async () => {
      setLoading(true)
      setError(null)
      try {
        const resp = await api.fetchProducts("", true)
        if (resp.status !== "error") {
          setProducts(resp)
        } else {
          setError('Failed to load products')
        }
      } catch (e) {
        setError('Unable to connect to server')
      }
      setLoading(false)
    })()
  }, [])

  const handleAddToCart = (product) => {
    addToCart(product)
    addToast(`${product.title} added to cart`)
  }

  return (
    <main>
      <section>
        <Carousel slides={sliderItems} />
      </section>

      <Container heading="Popular Categories">
        <CategoryList categories={categories} />
      </Container>

      <Container heading="Latest Arrivals">
        {loading ? (
          <ProductListSkeleton count={4} />
        ) : error ? (
          <p className="text-center text-red-500" role="alert">{error}</p>
        ) : (
          <>
            <ProductList products={[...products].splice(0, 4)} onAddToCart={handleAddToCart} />
            <Link to="/products" className="flex justify-center" aria-label="View all products">
              <Button className="text-lg mt-6" link>
                View More <ChevronRight className="ml-2" />
              </Button>
            </Link>
          </>
        )}
      </Container>

      <section className="my-20">
        <Newsletter addToast={addToast} />
      </section>

      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </main>
  )
}
