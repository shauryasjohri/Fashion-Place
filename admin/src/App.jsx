import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ClerkProvider, useAuth } from '@clerk/clerk-react'
import { AuthProvider, useAuthContext } from '@/context/AuthContext'
import AdminLayout from '@/components/layout/AdminLayout'
import LoginPage from '@/pages/LoginPage'
import config from '@/config'

const Dashboard = lazy(() => import('@/pages/Dashboard'))
const ProductsPage = lazy(() => import('@/pages/ProductsPage'))
const CategoriesPage = lazy(() => import('@/pages/CategoriesPage'))
const OrdersPage = lazy(() => import('@/pages/OrdersPage'))
const UsersPage = lazy(() => import('@/pages/UsersPage'))

function FullPageSpinner() {
  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100">
      <div className="spinner-border text-primary" role="status" />
    </div>
  )
}

function FullPageError({ message, variant = 'danger' }) {
  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100">
      <div className={`alert alert-${variant} text-center`} role="alert" style={{ maxWidth: 500 }}>
        {message}
      </div>
    </div>
  )
}

function AdminRoutes() {
  const { admin, adminLoading, error } = useAuthContext()

  if (adminLoading) return <FullPageSpinner />
  if (error) return <FullPageError message={error} />
  if (!admin) return <FullPageError message="Access denied. Admin privileges required." variant="warning" />

  return (
    <AdminLayout>
      <Suspense fallback={<FullPageSpinner />}>
        <Routes>
          <Route index element={<Dashboard />} />
          <Route path="products" element={<ProductsPage />} />
          <Route path="categories" element={<CategoriesPage />} />
          <Route path="orders" element={<OrdersPage />} />
          <Route path="users" element={<UsersPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </AdminLayout>
  )
}

function AdminGuard() {
  const { isSignedIn, isLoaded } = useAuth()

  if (!isLoaded) return <FullPageSpinner />
  if (!isSignedIn) return <LoginPage />

  return (
    <AuthProvider>
      <AdminRoutes />
    </AuthProvider>
  )
}

export default function App() {
  return (
    <ClerkProvider publishableKey={config.clerkPublishableKey}>
      <BrowserRouter>
        <Routes>
          <Route path="/*" element={<AdminGuard />} />
        </Routes>
      </BrowserRouter>
    </ClerkProvider>
  )
}
