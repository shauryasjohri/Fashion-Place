import { useEffect, useState, useCallback } from 'react'
import { Trash2 } from 'react-feather'
import * as api from '@/services/adminApi'
import DataTable from '@/components/common/DataTable'
import PageHeader from '@/components/common/PageHeader'
import ConfirmDialog from '@/components/common/ConfirmDialog'
import ToastContainer from '@/components/common/Toast'
import { useToast } from '@/hooks/useToast'

export default function UsersPage() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [confirmDelete, setConfirmDelete] = useState(null)
  const { toasts, addToast, removeToast } = useToast()

  const loadData = useCallback(async () => {
    setLoading(true)
    try {
      const resp = await api.listUsers()
      setUsers(Array.isArray(resp) ? resp : [])
    } catch {
      addToast('Failed to load users', 'danger')
    }
    setLoading(false)
  }, [])

  useEffect(() => { loadData() }, [])

  const handleDelete = async () => {
    if (!confirmDelete) return
    try {
      await api.deleteUser(confirmDelete._id)
      addToast('User deleted')
      setConfirmDelete(null)
      await loadData()
    } catch {
      addToast('Failed to delete user', 'danger')
    }
  }

  const columns = [
    { key: 'fullname', label: 'Name', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'isAdmin', label: 'Role', render: (row) => row.isAdmin ? <span className="badge bg-primary">Admin</span> : <span className="badge bg-secondary">User</span> },
    { key: 'createdAt', label: 'Joined', sortable: true, render: (row) => row.createdAt ? new Date(row.createdAt).toLocaleDateString() : '—' },
    {
      key: 'actions', label: 'Actions', render: (row) => (
        <div className="d-flex gap-1">
          <button className="btn btn-sm btn-outline-danger" onClick={(e) => { e.stopPropagation(); setConfirmDelete(row) }} disabled={row.isAdmin}>
            <Trash2 size={16} />
          </button>
        </div>
      ),
    },
  ]

  return (
    <div>
      <PageHeader title="Users" subtitle={`${users.length} user${users.length !== 1 ? 's' : ''} total`} />

      <div className="card shadow-sm">
        <div className="card-body">
          <DataTable columns={columns} data={users} searchKeys={['fullname', 'email']} pageSize={10} loading={loading} />
        </div>
      </div>

      <ConfirmDialog
        show={!!confirmDelete}
        title="Delete User"
        message={`Delete user "${confirmDelete?.fullname}"? This cannot be undone.`}
        onConfirm={handleDelete}
        onCancel={() => setConfirmDelete(null)}
      />

      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </div>
  )
}
