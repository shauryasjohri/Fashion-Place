import { useEffect, useState, useCallback } from 'react'
import { Trash2, Eye } from 'react-feather'
import { Modal, Button, Form } from 'react-bootstrap'
import * as api from '@/services/adminApi'
import DataTable from '@/components/common/DataTable'
import PageHeader from '@/components/common/PageHeader'
import StatusBadge from '@/components/common/StatusBadge'
import ConfirmDialog from '@/components/common/ConfirmDialog'
import ToastContainer from '@/components/common/Toast'
import { useToast } from '@/hooks/useToast'

const STATUS_OPTIONS = ['pending', 'confirmed', 'shipped', 'in transit', 'delivered', 'cancelled']

export default function OrdersPage() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [viewOrder, setViewOrder] = useState(null)
  const [editStatus, setEditStatus] = useState(null)
  const [statusValue, setStatusValue] = useState('')
  const [confirmDelete, setConfirmDelete] = useState(null)
  const { toasts, addToast, removeToast } = useToast()

  const loadData = useCallback(async () => {
    setLoading(true)
    try {
      const resp = await api.listOrders()
      setOrders(Array.isArray(resp) ? resp : [])
    } catch {
      addToast('Failed to load orders', 'danger')
    }
    setLoading(false)
  }, [])

  useEffect(() => { loadData() }, [])

  const openStatusEdit = (order) => {
    setEditStatus(order)
    setStatusValue(order.status || '')
  }

  const handleStatusUpdate = async () => {
    if (!editStatus) return
    setSaving(true)
    try {
      await api.updateOrder(editStatus._id || editStatus.id, { status: statusValue })
      addToast(`Order status updated to "${statusValue}"`)
      setEditStatus(null)
      await loadData()
    } catch {
      addToast('Failed to update order', 'danger')
    }
    setSaving(false)
  }

  const handleDelete = async () => {
    if (!confirmDelete) return
    try {
      await api.deleteOrder(confirmDelete._id || confirmDelete.id)
      addToast('Order deleted')
      setConfirmDelete(null)
      await loadData()
    } catch {
      addToast('Failed to delete order', 'danger')
    }
  }

  const columns = [
    { key: '_id', label: 'Order ID', sortable: true, render: (row) => <code>{(row._id || row.id || '').slice(-8)}</code> },
    { key: 'amount', label: 'Amount', sortable: true, render: (row) => `$${row.amount?.toFixed(2) || '0.00'}` },
    { key: 'status', label: 'Status', sortable: true, render: (row) => <StatusBadge status={row.status} /> },
    { key: 'createdAt', label: 'Date', sortable: true, render: (row) => row.createdAt ? new Date(row.createdAt).toLocaleDateString() : '—' },
    {
      key: 'actions', label: 'Actions', render: (row) => (
        <div className="d-flex gap-1">
          <button className="btn btn-sm btn-outline-info" onClick={(e) => { e.stopPropagation(); setViewOrder(row) }}><Eye size={16} /></button>
          <button className="btn btn-sm btn-outline-warning" onClick={(e) => { e.stopPropagation(); openStatusEdit(row) }}>Status</button>
          <button className="btn btn-sm btn-outline-danger" onClick={(e) => { e.stopPropagation(); setConfirmDelete(row) }}><Trash2 size={16} /></button>
        </div>
      ),
    },
  ]

  return (
    <div>
      <PageHeader title="Orders" subtitle={`${orders.length} order${orders.length !== 1 ? 's' : ''} total`} />

      <div className="card shadow-sm">
        <div className="card-body">
          <DataTable columns={columns} data={orders} searchKeys={['_id', 'status']} pageSize={10} loading={loading} />
        </div>
      </div>

      <Modal show={!!viewOrder} onHide={() => setViewOrder(null)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Order Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {viewOrder && (
            <div>
              <p><strong>ID:</strong> <code>{viewOrder._id || viewOrder.id}</code></p>
              <p><strong>Status:</strong> <StatusBadge status={viewOrder.status} /></p>
              <p><strong>Amount:</strong> ${viewOrder.amount?.toFixed(2)}</p>
              <p><strong>Date:</strong> {viewOrder.createdAt ? new Date(viewOrder.createdAt).toLocaleString() : '—'}</p>
              {viewOrder.address && <p><strong>Address:</strong> {typeof viewOrder.address === 'object' ? JSON.stringify(viewOrder.address) : viewOrder.address}</p>}
              {viewOrder.products?.length > 0 && (
                <div>
                  <strong>Products:</strong>
                  <ul className="mt-1">
                    {viewOrder.products.map((p, i) => (
                      <li key={i}>
                        {p.productID?.title || p.title || 'Product'} — Qty: {p.quantity} — ${p.productID?.price || p.price}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setViewOrder(null)}>Close</Button>
        </Modal.Footer>
      </Modal>

      <Modal show={!!editStatus} onHide={() => setEditStatus(null)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Update Status</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Status</Form.Label>
            <Form.Select value={statusValue} onChange={e => setStatusValue(e.target.value)}>
              <option value="">— Select —</option>
              {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
            </Form.Select>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setEditStatus(null)}>Cancel</Button>
          <Button onClick={handleStatusUpdate} disabled={saving || !statusValue}>Update</Button>
        </Modal.Footer>
      </Modal>

      <ConfirmDialog
        show={!!confirmDelete}
        title="Delete Order"
        message={`Delete order ${(confirmDelete?._id || confirmDelete?.id || '').slice(-8)}?`}
        onConfirm={handleDelete}
        onCancel={() => setConfirmDelete(null)}
      />

      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </div>
  )
}
