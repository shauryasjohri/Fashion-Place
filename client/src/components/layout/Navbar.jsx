import { useContext, useState } from 'react'
import clsx from "clsx"
import { Link } from "react-router-dom"
import { Menu, Search, User, LogIn, X, ShoppingCart, Sun, Moon } from "react-feather"

import { UserContext, CartContext } from '@/context'
import { useTheme } from '@/context/ThemeContext'
import Button from "@/components/common/Button"
import Input from "@/components/common/Input"
import UserDropDown from '@/components/account/UserDropDown'
import useClickOutside from '@/hooks/useClickOutside'

export default function Navbar() {
  const { user, logout } = useContext(UserContext)
  const { cart, cartDispatch } = useContext(CartContext)
  const { theme, toggleTheme } = useTheme()
  const [showMenu, setShowMenu] = useState(false)
  const navbarRef = useClickOutside(() => setShowMenu(false))

  return (
    <nav className={clsx(
      "w-full flex flex-wrap justify-between items-center",
      "sticky top-0 z-40 py-3 px-4",
      "bg-gray-200/90 border-b border-gray-300",
      "dark:(bg-gray-800/90 border-gray-700)",
      "backdrop-filter backdrop-blur-lg shadow-sm",
      "md:(py-1)"
    )} ref={navbarRef} role="navigation" aria-label="Main navigation">
      <div className="flex justify-between items-center md:mx-0">
        <Link to="/" aria-label="Home">
          <h3 className="text-medium text-2xl">BRAND</h3>
        </Link>
      </div>

      <div className="flex items-center ml-2 space-x-4 md:order-2">
        <button
          onClick={toggleTheme}
          className="flex items-center justify-center p-1.5 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400 transition-colors"
          aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
        >
          {theme === 'dark' ? <Sun width={20} height={20} /> : <Moon width={20} height={20} />}
        </button>

        <Link to="/cart" className="relative flex items-center pr-2" aria-label={`Shopping cart${cart.products.length ? ` (${cart.products.length} items)` : ''}`}>
          <ShoppingCart width={24} height={24} aria-hidden="true" />
          {cart.products.length ?
            <div className="absolute flex justify-center items-center w-4 h-4 bg-red-500 text-white rounded-full top-0 right-0 text-xs" aria-label={`${cart.products.length} items in cart`}>
              {cart.products.length}
            </div>
            : null
          }
        </Link>
        {user &&
          <UserDropDown
            user={user}
            onLogout={() => {
              logout()
              cartDispatch({ type: "RESET" })
            }}
          />
        }
        <button
          className="md:hidden flex items-center focus:outline-none focus:ring-2 focus:ring-gray-400 rounded"
          onClick={() => setShowMenu(prev => !prev)}
          aria-label={showMenu ? 'Close menu' : 'Open menu'}
          aria-expanded={showMenu}
        >
          {showMenu
            ? <X width={24} height={24} />
            : <Menu width={24} height={24} />
          }
        </button>
      </div>

      <div className={clsx(
        "hidden w-full",
        showMenu && "!flex flex-col mt-8",
        "md:(flex flex-row mt-0 ml-auto order-1 w-auto)"
      )}>
        <ul className={clsx(
          "flex flex-col items-center order-2",
          "mt-8 mb-2 text-xl space-y-1 divide-y-2 divide-gray-200 dark:divide-gray-700",
          "md:(flex-row text-base m-0 space-y-0 divide-y-0 divide-x)"
        )} onClick={() => setShowMenu(false)} role="menubar" aria-label="Product categories">
          <NavLink to="/products?category=men">Men</NavLink>
          <NavLink to="/products?category=women">Women</NavLink>
          <NavLink to="/products">All Products</NavLink>
        </ul>
        <div className="flex items-center order-1 md:order-2">
          <Input
            className="md:max-w-min bg-opacity-40"
            icon={<Search />}
            placeholder="Search..."
            aria-label="Search products"
          />
        </div>
        {!user && (
          <ul className={clsx(
            "flex flex-col order-3",
            showMenu && "mt-4",
            "md:(flex-row text-base mt-0 space-x-2)"
          )}>
            <li>
              <Link to="/login">
                <Button secondary className="w-full md:w-auto">
                  <LogIn width={20} height={20} className="mr-2" />Login
                </Button>
              </Link>
            </li>
            <li>
              <Link to="/register">
                <Button className="w-full md:w-auto">
                  <User width={20} height={20} className="mr-2" />Register
                </Button>
              </Link>
            </li>
          </ul>
        )}
      </div>
    </nav>
  )
}

function NavLink({ children, to }) {
  return (
    <li className="hover:text-gray-800 dark:hover:text-gray-200 text-gray-700 dark:text-gray-300 block px-4 py-2 truncate" role="none">
      <Link to={to} role="menuitem">{children}</Link>
    </li>
  )
}
