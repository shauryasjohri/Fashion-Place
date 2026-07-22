import { LogOut, User, Sun, Moon } from 'react-feather'
import { useAuthContext } from '@/context/AuthContext'
import { useTheme } from '@/context/ThemeContext'

export default function Header({ onToggleSidebar }) {
  const { admin, logout } = useAuthContext()
  const { theme, toggleTheme } = useTheme()

  return (
    <header className="border-bottom px-4 py-2 d-flex align-items-center justify-content-between shadow-sm" style={{ backgroundColor: 'var(--color-header-bg)', color: 'var(--color-text)', borderColor: 'var(--color-border)' }}>
      <button className="btn btn-outline-secondary d-md-none" onClick={onToggleSidebar} style={{ color: 'var(--color-text)', borderColor: 'var(--color-border)' }}>
        <span className="navbar-toggler-icon" />
      </button>
      <div className="ms-auto d-flex align-items-center gap-3">
        <button
          className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-1"
          onClick={toggleTheme}
          aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
          style={{ color: 'var(--color-text)', borderColor: 'var(--color-border)' }}
        >
          {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
        </button>
        <div className="d-flex align-items-center gap-2" style={{ color: 'var(--color-text-secondary)' }}>
          <User size={18} />
          <span className="small">{admin?.fullname || 'Admin'}</span>
        </div>
        <button className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-1" onClick={logout} style={{ color: 'var(--color-text)', borderColor: 'var(--color-border)' }}>
          <LogOut size={16} /> Logout
        </button>
      </div>
    </header>
  )
}
