import { useEffect, useState, useRef, useCallback } from "react"
import { ChevronDown } from "react-feather"
import { useLocation } from "react-router-dom"

import ProductList from "@/components/product/ProductList"
import Container from "@/components/common/Container"
import Button from "@/components/common/Button"
import DropDown, { Select, Option } from "@/components/common/DropDown"
import useClickOutside from "@/hooks/useClickOutside"
import api from "@/services/api"
import { useCart } from "@/hooks/useCart"
import useDocumentTitle from '@/hooks/useDocumentTitle'
import { ProductListSkeleton } from '@/components/common/Skeleton'
import EmptyState from '@/components/common/EmptyState'
import ToastContainer from '@/components/common/Toast'
import { useToast } from '@/hooks/useToast'

const sortOptions = [
  "popular",
  "new",
  "price: low to high",
  "price: high to low",
]

export default function ProductsPage() {
  useDocumentTitle('Products')
  const { addToCart } = useCart()
  const query = new URLSearchParams(useLocation().search)
  const [products, setProducts] = useState([])
  const [sort, setSort] = useState(0)
  const [showSortOptions, setShowSortOptions] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const dropDownRef = useClickOutside(() => setShowSortOptions(false))
  const { toasts, addToast, removeToast } = useToast()
  const sortRef = useRef(sort)
  sortRef.current = sort

  const category = query.get("category")

  useEffect(() => {
    (async () => {
      setLoading(true)
      setError(null)
      try {
        const resp = await api.fetchProducts(category)
        if (resp.status != "error") {
          setProducts(resp)
        } else {
          setError('Failed to load products')
          setProducts([])
        }
      } catch (e) {
        setError('Unable to connect to server')
      }
      setLoading(false)
    })()
  }, [category])

  const sortedProducts = useCallback(() => {
    const sorted = [...products]
    switch (sortRef.current) {
      case 1:
        sorted.sort((a, b) => new Date(a.updatedAt || 0) - new Date(b.updatedAt || 0))
        break
      case 2:
        sorted.sort((a, b) => a.price - b.price)
        break
      case 3:
        sorted.sort((a, b) => b.price - a.price)
        break
    }
    return sorted
  }, [products])

  const handleAddToCart = (product) => {
    addToCart(product)
    addToast(`${product.title} added to cart`)
  }

  return (
    <main>
      <Container
        heading={`Products${category ? " for: " + category : ""}`}
        type="page"
      >
        {!loading && !error && products.length > 1 && (
          <section className="flex justify-end mb-4">
            <div className="relative" ref={dropDownRef}>
              <span className="font-bold">Sort by:</span>
              <Button
                secondary
                onClick={() => setShowSortOptions((prev) => !prev)}
                aria-haspopup="listbox"
                aria-expanded={showSortOptions}
              >
                {sortOptions[sort]} <ChevronDown className="ml-2" />
              </Button>

              {showSortOptions && (
                <DropDown className="mt-10 inset-x-0" onClick={() => setShowSortOptions(false)} role="listbox" aria-label="Sort options">
                  <Select>
                    {sortOptions.map((option, i) => (
                      <Option key={option} onClick={() => setSort(i)} role="option" aria-selected={sort === i}>
                        {option}
                      </Option>
                    ))}
                  </Select>
                </DropDown>
              )}
            </div>
          </section>
        )}

        {loading ? (
          <ProductListSkeleton count={8} />
        ) : error ? (
          <EmptyState
            title="Unable to load products"
            message={error}
            actionLabel="Try Again"
            onAction={() => window.location.reload()}
          />
        ) : products.length === 0 ? (
          <EmptyState
            title="No products found"
            message={category ? `No products available in "${category}" category.` : 'No products available at the moment.'}
            actionLabel="Browse All Products"
            actionTo="/products"
          />
        ) : (
          <ProductList products={sortedProducts()} onAddToCart={handleAddToCart} />
        )}
      </Container>

      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </main>
  )
}
