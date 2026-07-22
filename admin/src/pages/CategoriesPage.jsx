import { useEffect, useState, useCallback } from 'react'
import { Edit3, Trash2, Plus } from 'react-feather'
import { Button, Modal, Form, Spinner } from 'react-bootstrap'
import * as api from '@/services/adminApi'
import DataTable from '@/components/common/DataTable'
import PageHeader from '@/components/common/PageHeader'
import ConfirmDialog from '@/components/common/ConfirmDialog'
import ToastContainer from '@/components/common/Toast'
import { useToast } from '@/hooks/useToast'

export default function CategoriesPage() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editCat, setEditCat] = useState(null)
  const [formName, setFormName] = useState('')
  const [saving, setSaving] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(null)
  const { toasts, addToast, removeToast } = useToast()

  const loadData = useCallback(async () => {
    setLoading(true)
    try {
      const resp = await api.listCategories()
      setCategories(Array.isArray(resp) ? resp : [])
    } catch {
      addToast('Failed to load categories', 'danger')
    }
    setLoading(false)
  }, [])

  useEffect(() => { loadData() }, [])

  const openCreate = () => {
    setEditCat(null)
    setFormName('')
    setShowForm(true)
  }

  const openEdit = (cat) => {
    setEditCat(cat)
    setFormName(cat.name || '')
    setShowForm(true)
  }

  const handleSave = async (e) => {
    e.preventDefault()
    if (!formName.trim()) return
    setSaving(true)
    try {
      if (editCat) {
        await api.updateCategory(editCat.id, formName.trim())
        addToast('Category updated')
      } else {
        await api.createCategory(formName.trim())
        addToast('Category created')
      }
      setShowForm(false)
      await loadData()
    } catch {
      addToast('Failed to save category', 'danger')
    }
    setSaving(false)
  }

  const handleDelete = async () => {
    if (!confirmDelete) return
    try {
      await api.deleteCategory(confirmDelete.id)
      addToast('Category deleted')
      setConfirmDelete(null)
      await loadData()
    } catch {
      addToast('Failed to delete category', 'danger')
    }
  }

  const columns = [
    { key: 'name', label: 'Name', sortable: true },
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
      <PageHeader title="Categories" subtitle={`${categories.length} categor${categories.length !== 1 ? 'ies' : 'y'} total`}>
        <Button size="sm" onClick={openCreate}><Plus size={18} className="me-1" /> Add Category</Button>
      </PageHeader>

      <div className="card shadow-sm">
        <div className="card-body">
          <DataTable columns={columns} data={categories} searchKeys={['name']} pageSize={10} loading={loading} />
        </div>
      </div>

      <Modal show={showForm} onHide={() => setShowForm(false)} centered>
        <Form onSubmit={handleSave}>
          <Modal.Header closeButton>
            <Modal.Title>{editCat ? 'Edit Category' : 'New Category'}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group>
              <Form.Label>Name</Form.Label>
              <Form.Control value={formName} onChange={e => setFormName(e.target.value)} required autoFocus />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowForm(false)}>Cancel</Button>
            <Button type="submit" disabled={saving}>{saving ? <Spinner size="sm" /> : (editCat ? 'Update' : 'Create')}</Button>
          </Modal.Footer>
        </Form>
      </Modal>

      <ConfirmDialog
        show={!!confirmDelete}
        title="Delete Category"
        message={`Delete category "${confirmDelete?.name}"? Products linked to it may break.`}
        onConfirm={handleDelete}
        onCancel={() => setConfirmDelete(null)}
      />

      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </div>
  )
}
