import { useEffect, useState } from 'react'
import { DollarSign, Users, Package, ShoppingBag } from 'react-feather'
import * as api from '@/services/adminApi'
import StatsCard from '@/components/common/StatsCard'
import PageHeader from '@/components/common/PageHeader'

export default function Dashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    (async () => {
      try {
        const [allOrders, allUsers, allProducts] = await Promise.all([
          api.listOrders(),
          api.listUsers(),
          api.listProducts(),
        ])
        const orderList = Array.isArray(allOrders) ? allOrders : []
        const userList = Array.isArray(allUsers) ? allUsers : []
        const productList = Array.isArray(allProducts) ? allProducts : []

        const totalRevenue = orderList.reduce((sum, o) => sum + (o.amount || 0), 0)
        const pendingOrders = orderList.filter(o => o.status === 'pending' || o.status === 'confirmed').length

        setStats({
          totalOrders: orderList.length,
          totalRevenue,
          totalUsers: userList.length,
          totalProducts: productList.length,
          pendingOrders,
        })
      } catch (e) {
        console.error('Failed to load dashboard stats:', e)
      }
      setLoading(false)
    })()
  }, [])

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status" />
      </div>
    )
  }

  return (
    <div>
      <PageHeader title="Dashboard" subtitle="Overview of your store" />

      <div className="row g-3">
        <div className="col-sm-6 col-lg-3">
          <StatsCard title="Total Orders" value={stats?.totalOrders} icon={<ShoppingBag size={28} />} variant="primary" />
        </div>
        <div className="col-sm-6 col-lg-3">
          <StatsCard title="Revenue" value={`$${stats?.totalRevenue?.toFixed(2) || '0.00'}`} icon={<DollarSign size={28} />} variant="success" />
        </div>
        <div className="col-sm-6 col-lg-3">
          <StatsCard title="Users" value={stats?.totalUsers} icon={<Users size={28} />} variant="info" />
        </div>
        <div className="col-sm-6 col-lg-3">
          <StatsCard title="Products" value={stats?.totalProducts} icon={<Package size={28} />} variant="warning" />
        </div>
      </div>

      {stats?.pendingOrders > 0 && (
        <div className="alert alert-warning mt-4 mb-0" role="alert">
          You have <strong>{stats.pendingOrders}</strong> pending order{stats.pendingOrders > 1 ? 's' : ''} that need attention.
        </div>
      )}
    </div>
  )
}
