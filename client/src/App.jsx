import { Suspense, lazy, useContext, useEffect } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { ClerkProvider } from '@clerk/clerk-react'
import { UserProvider, UserContext } from './context/UserContext'
import { CartProvider, CartContext } from './context/CartContext'
import { addProductsToCart, getUserCart } from '@/services/api'
import ScrollToTop from '@/components/layout/ScrollToTop'
import UserLayout from '@/components/layout/UserLayout'
import ErrorBoundary from '@/components/common/ErrorBoundary'

const HomePage = lazy(() => import('@/pages/HomePage'))
const LoginPage = lazy(() => import('@/pages/LoginPage'))
const RegisterPage = lazy(() => import('@/pages/RegisterPage'))
const NotFoundPage = lazy(() => import('@/pages/404Page'))
const ProductsPage = lazy(() => import('@/pages/ProductsPage'))
const ProductDetailsPage = lazy(() => import('@/pages/ProductDetailsPage'))
const CartPage = lazy(() => import('@/pages/CartPage'))
const OrdersPage = lazy(() => import('@/pages/OrdersPage'))
const OrderDetailsPage = lazy(() => import('@/pages/OrderDetailsPage'))
const AccountPage = lazy(() => import('@/pages/AccountPage'))

const CLERK_PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

function CartSync() {
  const { user } = useContext(UserContext)
  const { cartDispatch } = useContext(CartContext)

  useEffect(() => {
    if (!user) return

    ;(async () => {
      let localProducts = []
      try {
        const stored = JSON.parse(localStorage.getItem('cart') || '{"products":[]}')
        if (stored.products) localProducts = stored.products
      } catch (e) {}

      if (localProducts.length > 0) {
        await addProductsToCart(localProducts.map(p => ({
          productID: p.id,
          quantity: p.quantity,
        })))
      }

      const resp = await getUserCart()
      if (resp && resp.products) {
        cartDispatch({ type: 'SET_PRODUCTS', payload: resp.products })
      }
    })()
  }, [user])

  return null
}

function AppContent() {
  const { user } = useContext(UserContext)

  return (
    <CartProvider>
      <CartSync />
      <ScrollToTop />
      <Suspense fallback={
        <div className="flex justify-center items-center min-h-screen bg-gray-100" role="status" aria-label="Loading page">
          <div className="flex flex-col items-center space-y-4">
            <div className="w-10 h-10 border-4 border-gray-300 border-t-gray-800 rounded-full animate-spin" />
            <span className="text-gray-500 text-sm">Loading...</span>
          </div>
        </div>
      }>
        <ErrorBoundary>
          <Routes>
            <Route path="/" element={<UserLayout />}>
              <Route index element={<HomePage />} />
              <Route path="cart" element={<CartPage />} />
              <Route path="login" element={user ? <Navigate replace to="/" /> : <LoginPage />} />
              <Route path="register" element={user ? <Navigate replace to="/" /> : <RegisterPage />} />
              <Route path="account" element={user ? <AccountPage /> : <Navigate replace to="/login" />} />
              <Route path="products">
                <Route index element={<ProductsPage />} />
                <Route path=":id" element={<ProductDetailsPage />} />
              </Route>
              <Route path="orders">
                <Route index element={user ? <OrdersPage /> : <Navigate replace to="/login" />} />
                <Route path=":id" element={user ? <OrderDetailsPage /> : <Navigate replace to="/login" />} />
              </Route>
            </Route>
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </ErrorBoundary>
      </Suspense>
    </CartProvider>
  )
}

export default function App() {
  return (
    <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY}>
      <BrowserRouter>
        <UserProvider>
          <AppContent />
        </UserProvider>
      </BrowserRouter>
    </ClerkProvider>
  )
}
