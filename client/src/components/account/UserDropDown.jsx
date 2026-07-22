import { useState } from "react"
import { LogOut } from "react-feather"
import { Link } from "react-router-dom"
import DropDown, { Select, Option } from "@/components/common/DropDown"
import useClickOutside from "@/hooks/useClickOutside"

function UserDropDown({ user, onLogout }) {
  const dropDownRef = useClickOutside(() => setShowDropDown(false))
  const [showDropDown, setShowDropDown] = useState(false)

  return (
    <div className="relative flex items-center" ref={dropDownRef}>
      <button
        onClick={() => setShowDropDown(prev => !prev)}
        className="h-8 w-8 rounded-full overflow-hidden focus:(ring-4 ring-gray-300 outline-none) bg-gray-400 dark:bg-gray-600"
        aria-label="User menu"
        aria-haspup="true"
        aria-expanded={showDropDown}
      >
        {user.avatarSrc ? (
          <img className="object-cover w-full h-full" src={user.avatarSrc} alt={`${user.fullname}'s avatar`} />
        ) : (
          <span className="flex items-center justify-center w-full h-full text-white text-sm font-medium">
            {user.fullname?.charAt(0)?.toUpperCase() || "?"}
          </span>
        )}
      </button>
      {showDropDown && (
        <DropDown className="mt-10 right-0" role="menu" aria-label="User options">
          <div className="px-4 py-3">
            <span className="block">{user.fullname}</span>
            <span className="block font-medium text-gray-900 dark:text-gray-100 truncate">{user.email}</span>
          </div>
          <Select onClick={() => setShowDropDown(false)}>
            <Link to="/cart" role="menuitem"><Option>Cart</Option></Link>
            <Link to="/orders" role="menuitem"><Option>Orders</Option></Link>
            <Link to="/account" role="menuitem"><Option>Account</Option></Link>
            <Link to="/" onClick={onLogout} role="menuitem">
              <Option className="flex items-center">
                <LogOut width={20} height={20} className="mr-2" />Logout
              </Option>
            </Link>
          </Select>
        </DropDown>
      )}
    </div>
  )
}

export default UserDropDown
