import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Header from './Header'

export default function AdminLayout() {
  const [showSidebar, setShowSidebar] = useState(false)

  return (
    <div className="d-flex" style={{ minHeight: '100vh' }}>
      <div className="d-none d-md-block">
        <Sidebar />
      </div>
      {showSidebar && (
        <div className="position-fixed top-0 start-0 z-3 d-md-none" style={{ minHeight: '100vh' }}>
          <div className="position-fixed top-0 start-0 w-100 h-100" style={{ backgroundColor: 'var(--color-overlay)' }} onClick={() => setShowSidebar(false)} />
          <div className="position-relative" style={{ zIndex: 4 }}>
            <Sidebar />
          </div>
        </div>
      )}
      <div className="flex-grow-1 d-flex flex-column">
        <Header onToggleSidebar={() => setShowSidebar(prev => !prev)} />
        <main className="flex-grow-1 p-4" style={{ backgroundColor: 'var(--color-bg)', color: 'var(--color-text)' }}>
          <Outlet />
        </main>
      </div>
    </div>
  )
}
