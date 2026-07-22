import { NavLink } from 'react-router-dom'
import { Grid, Package, List, ShoppingBag, Users } from 'react-feather'

const links = [
  { to: '/', label: 'Dashboard', icon: Grid },
  { to: '/products', label: 'Products', icon: Package },
  { to: '/categories', label: 'Categories', icon: List },
  { to: '/orders', label: 'Orders', icon: ShoppingBag },
  { to: '/users', label: 'Users', icon: Users },
]

export default function Sidebar() {
  return (
    <nav className="d-flex flex-column" style={{ width: 240, minHeight: '100vh', backgroundColor: 'var(--color-sidebar-bg)' }}>
      <div className="px-4 py-3 border-bottom" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
        <h5 className="mb-0" style={{ color: '#fff' }}>Admin Panel</h5>
      </div>
      <ul className="nav flex-column mt-2">
        {links.map(link => (
          <li className="nav-item" key={link.to}>
            <NavLink
              to={link.to}
              end={link.to === '/'}
              className={({ isActive }) =>
                `nav-link d-flex align-items-center gap-2 px-4 py-2 ${isActive ? 'active' : ''}`
              }
              style={({ isActive }) => ({
                color: isActive ? '#fff' : 'var(--color-sidebar-text)',
                backgroundColor: isActive ? 'var(--color-sidebar-active)' : 'transparent',
              })}
            >
              <link.icon size={18} />
              <span>{link.label}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}
