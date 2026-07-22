import { useState, useMemo } from 'react'

export default function DataTable({
  columns,
  data,
  searchable = true,
  searchKeys = [],
  pageSize = 10,
  onRowClick,
  loading = false,
  emptyMessage = 'No data available',
}) {
  const [search, setSearch] = useState('')
  const [sortKey, setSortKey] = useState(null)
  const [sortDir, setSortDir] = useState('asc')
  const [page, setPage] = useState(0)

  const filtered = useMemo(() => {
    if (!search.trim() || !searchKeys.length) return data
    const q = search.toLowerCase()
    return data.filter(row =>
      searchKeys.some(key => {
        const val = row[key]
        return val != null && String(val).toLowerCase().includes(q)
      })
    )
  }, [data, search, searchKeys])

  const sorted = useMemo(() => {
    if (!sortKey) return filtered
    return [...filtered].sort((a, b) => {
      const aVal = a[sortKey] ?? ''
      const bVal = b[sortKey] ?? ''
      const cmp = typeof aVal === 'number'
        ? aVal - bVal
        : String(aVal).localeCompare(String(bVal), undefined, { numeric: true })
      return sortDir === 'asc' ? cmp : -cmp
    })
  }, [filtered, sortKey, sortDir])

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize))
  const paginated = sorted.slice(page * pageSize, (page + 1) * pageSize)

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortDir(prev => prev === 'asc' ? 'desc' : 'asc')
    } else {
      setSortKey(key)
      setSortDir('asc')
    }
    setPage(0)
  }

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status" />
        <p className="mt-2 text-muted mb-0">Loading...</p>
      </div>
    )
  }

  return (
    <div>
      {searchable && searchKeys.length > 0 && (
        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            placeholder={`Search by ${searchKeys.join(', ')}...`}
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(0) }}
            aria-label="Search table"
          />
        </div>
      )}

      <div className="table-responsive">
        <table className="table table-hover mb-0" style={{ color: 'var(--color-text)' }}>
          <thead className="table-light" style={{ backgroundColor: 'var(--color-surface-2)', color: 'var(--color-text)' }}>
            <tr>
              {columns.map(col => (
                <th
                  key={col.key}
                  onClick={col.sortable ? () => handleSort(col.key) : undefined}
                  style={{
                    cursor: col.sortable ? 'pointer' : 'default',
                    userSelect: 'none',
                    backgroundColor: 'var(--color-surface-2)',
                    color: 'var(--color-text)',
                    borderColor: 'var(--color-border)',
                  }}
                  scope="col"
                  aria-sort={col.sortable && sortKey === col.key ? (sortDir === 'asc' ? 'ascending' : 'descending') : undefined}
                >
                  {col.label}
                  {col.sortable && sortKey === col.key && (
                    <span className="ms-1">{sortDir === 'asc' ? '\u2191' : '\u2193'}</span>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginated.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="text-center py-4 text-muted">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              paginated.map((row, i) => (
                <tr
                  key={row._id || row.id || i}
                  onClick={() => onRowClick?.(row)}
                  style={{
                    cursor: onRowClick ? 'pointer' : 'default',
                    borderColor: 'var(--color-border)',
                  }}
                >
                  {columns.map(col => (
                    <td key={col.key} style={{ borderColor: 'var(--color-border)', color: 'var(--color-text)' }}>
                      {col.render ? col.render(row) : row[col.key]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {sorted.length > pageSize && (
        <div className="d-flex justify-content-between align-items-center mt-3">
          <small className="text-muted">
            Showing {page * pageSize + 1}–{Math.min((page + 1) * pageSize, sorted.length)} of {sorted.length}
          </small>
          <div className="d-flex gap-1">
            <button
              className="btn btn-sm btn-outline-secondary"
              onClick={() => setPage(p => Math.max(0, p - 1))}
              disabled={page === 0}
            >
              Prev
            </button>
            <button
              className="btn btn-sm btn-outline-secondary"
              onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
              disabled={page >= totalPages - 1}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
