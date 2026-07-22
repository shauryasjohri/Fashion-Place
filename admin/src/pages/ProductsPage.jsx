import { useEffect, useState, useCallback } from 'react'
import { Edit3, Trash2, Plus } from 'react-feather'
import { Button } from 'react-bootstrap'
import * as api from '@/services/adminApi'
import DataTable from '@/components/common/DataTable'
import PageHeader from '@/components/common/PageHeader'
import ConfirmDialog from '@/components/common/ConfirmDialog'
import ProductForm from '@/components/products/ProductForm'
import ToastContainer from '@/components/common/Toast'
import { useToast } from '@/hooks/useToast'

export default function ProductsPage() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [editProduct, setEditProduct] = useState(null)
  const [confirmDelete, setConfirmDelete] = useState(null)
  const { toasts, addToast, removeToast } = useToast()

  const loadData = useCallback(async () => {
    setLoading(true)
    try {
      const [prodResp, catResp] = await Promise.all([
        api.listProducts(),
        api.listCategories(),
      ])
      setProducts(Array.isArray(prodResp) ? prodResp : [])
      setCategories(Array.isArray(catResp) ? catResp : [])
    } catch {
      addToast('Failed to load products', 'danger')
    }
    setLoading(false)
  }, [])

  useEffect(() => { loadData() }, [])

  const handleSave = async (data) => {
    setSaving(true)
    try {
      if (editProduct) {
        await api.updateProduct(editProduct._id, data)
        addToast('Product updated successfully')
      } else {
        await api.createProduct(data)
        addToast('Product created successfully')
      }
      setShowForm(false)
      setEditProduct(null)
      await loadData()
    } catch {
      addToast('Failed to save product', 'danger')
    }
    setSaving(false)
  }

  const handleDelete = async () => {
    if (!confirmDelete) return
    try {
      await api.deleteProduct(confirmDelete._id)
      addToast('Product deleted')
      setConfirmDelete(null)
      await loadData()
    } catch {
      addToast('Failed to delete product', 'danger')
    }
  }

  const openEdit = (product) => {
    setEditProduct(product)
    setShowForm(true)
  }

  const columns = [
    { key: 'image', label: 'Image', render: (row) => row.image ? <img src={row.image} alt="" style={{ width: 40, height: 40, objectFit: 'cover' }} className="rounded" /> : '—' },
    { key: 'title', label: 'Title', sortable: true },
    { key: 'price', label: 'Price', sortable: true, render: (row) => `$${row.price}` },
    { key: 'categories', label: 'Categories', render: (row) => Array.isArray(row.categories) ? row.categories.join(', ') : '—' },
    { key: 'inStock', label: 'Stock', render: (row) => row.inStock ? <span className="badge bg-success">In Stock</span> : <span className="badge bg-danger">Out</span> },
    {
      key: 'actions', label: 'Actions', render: (row) => (
        <div className="d-flex gap-1">
          <button className="btn btn-sm btn-outline-primary" onClick={(e) => { e.stopPropagation(); openEdit(row) }}><Edit3 size={16} /></button>
          <button className="btn btn-sm btn-outline-danger" onClick={(e) => { e.stopPropagation(); setConfirmDelete(row) }}><Trash2 size={16} /></button>
        </div>
      ),
    },
  ]

  return (
    <div>
      <PageHeader title="Products" subtitle={`${products.length} product${products.length !== 1 ? 's' : ''} total`}>
        <Button size="sm" onClick={() => { setEditProduct(null); setShowForm(true) }}>
          <Plus size={18} className="me-1" /> Add Product
        </Button>
      </PageHeader>

      <div className="card shadow-sm">
        <div className="card-body">
          <DataTable
            columns={columns}
            data={products}
            searchKeys={['title', 'categories']}
            pageSize={10}
            loading={loading}
          />
        </div>
      </div>

      <ProductForm
        show={showForm}
        onHide={() => { setShowForm(false); setEditProduct(null) }}
        onSubmit={handleSave}
        product={editProduct}
        categories={categories}
        loading={saving}
      />

      <ConfirmDialog
        show={!!confirmDelete}
        title="Delete Product"
        message={`Are you sure you want to delete "${confirmDelete?.title}"?`}
        onConfirm={handleDelete}
        onCancel={() => setConfirmDelete(null)}
      />

      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </div>
  )
}
