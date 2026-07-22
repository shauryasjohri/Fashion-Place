import { useContext, useState } from 'react'
import { Link, useNavigate } from "react-router-dom"
import clsx from "clsx"
import { Edit2, User, Mail, Lock, ChevronRight, Package, ShoppingCart, LogOut } from "react-feather"

import { UserContext, CartContext } from '@/context'
import Container from "@/components/common/Container"
import Input from "@/components/common/Input"
import Button from "@/components/common/Button"
import useDocumentTitle from '@/hooks/useDocumentTitle'
import ToastContainer from '@/components/common/Toast'
import { useToast } from '@/hooks/useToast'

export default function AccountPage() {
  useDocumentTitle('My Account')
  const navigate = useNavigate()
  const { user, logout } = useContext(UserContext)
  const { cartDispatch } = useContext(CartContext)
  const [showEditForm, setShowEditForm] = useState(false)
  const [formValues, setFormValues] = useState({ fullname: '', currentPassword: '', newPassword: '', confirmPassword: '' })
  const [formErrors, setFormErrors] = useState({})
  const { toasts, addToast, removeToast } = useToast()

  if (!user) {
    navigate("/login")
    return null
  }

  const handleEdit = e => {
    e.preventDefault()
    const errors = {}
    if (!formValues.fullname.trim()) {
      errors.fullname = 'Name is required'
    }
    if (formValues.newPassword && formValues.newPassword.length < 6) {
      errors.newPassword = 'Password must be at least 6 characters'
    }
    if (formValues.newPassword && formValues.newPassword !== formValues.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match'
    }
    if (formValues.newPassword && !formValues.currentPassword) {
      errors.currentPassword = 'Current password is required to set a new password'
    }
    setFormErrors(errors)
    if (Object.keys(errors).length > 0) return

    addToast('Profile updated successfully')
    setShowEditForm(false)
    setFormValues({ fullname: '', currentPassword: '', newPassword: '', confirmPassword: '' })
    setFormErrors({})
  }

  return (
    <main className="min-h-screen my-14">
      <Container heading="Your Account" type="page">
        <div className="grid grid-cols-1 md:(grid-cols-2)">
          <section className="flex flex-col items-center text-center space-y-2">
            <div className={clsx(
              "h-24 w-24 rounded-full overflow-hidden mb-4",
              "sm:(w-32 h-32)",
              "focus-within:(ring-4 ring-gray-300 dark:ring-gray-600 outline-none)"
            )}>
              <img
                className="object-cover w-full h-full"
                src={user.avatarSrc}
                alt={`${user.fullname}'s avatar`}
              />
            </div>
            {showEditForm ? (
              <form
                className="flex flex-col gap-2 min-w-xs max-w-lg m-4"
                onSubmit={handleEdit}
                noValidate
              >
                <div className="text-left w-full">
                  <Input
                    icon={<User />}
                    type="text"
                    placeholder="full name"
                    value={formValues.fullname}
                    onChange={e => setFormValues(prev => ({ ...prev, fullname: e.target.value }))}
                    aria-label="Full name"
                    aria-invalid={!!formErrors.fullname}
                  />
                  {formErrors.fullname && <p className="text-red-500 text-xs mt-1" role="alert">{formErrors.fullname}</p>}
                </div>
                <Input icon={<Mail />} type="email" defaultValue={user.email} disabled aria-label="Email address" />
                <div className="text-left w-full">
                  <Input
                    icon={<Lock />}
                    type="password"
                    placeholder="Current Password"
                    value={formValues.currentPassword}
                    onChange={e => setFormValues(prev => ({ ...prev, currentPassword: e.target.value }))}
                    aria-label="Current password"
                    aria-invalid={!!formErrors.currentPassword}
                  />
                  {formErrors.currentPassword && <p className="text-red-500 text-xs mt-1" role="alert">{formErrors.currentPassword}</p>}
                </div>
                <div className="text-left w-full">
                  <Input
                    icon={<Lock />}
                    type="password"
                    placeholder="New Password"
                    value={formValues.newPassword}
                    onChange={e => setFormValues(prev => ({ ...prev, newPassword: e.target.value }))}
                    aria-label="New password"
                    aria-invalid={!!formErrors.newPassword}
                  />
                  {formErrors.newPassword && <p className="text-red-500 text-xs mt-1" role="alert">{formErrors.newPassword}</p>}
                </div>
                <div className="text-left w-full">
                  <Input
                    icon={<Lock />}
                    type="password"
                    placeholder="Confirm New Password"
                    value={formValues.confirmPassword}
                    onChange={e => setFormValues(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    aria-label="Confirm new password"
                    aria-invalid={!!formErrors.confirmPassword}
                  />
                  {formErrors.confirmPassword && <p className="text-red-500 text-xs mt-1" role="alert">{formErrors.confirmPassword}</p>}
                </div>
                <div className="text-right mt-4 space-x-2">
                  <Button secondary onClick={() => { setShowEditForm(false); setFormErrors({}); setFormValues({ fullname: '', currentPassword: '', newPassword: '', confirmPassword: '' }) }}>Cancel</Button>
                  <Button type="submit">Update</Button>
                </div>
              </form>
            ) : (
              <div>
                <div className="mb-2">
                  <h3 className="text-xl font-light">{user.fullname}</h3>
                  <span>{user.email}</span>
                </div>
                <Button secondary onClick={() => { setShowEditForm(true); setFormValues(prev => ({ ...prev, fullname: user.fullname || '' })) }}>
                  <Edit2 width={16} height={16} className="mr-2" />Edit
                </Button>
              </div>
            )}
          </section>
          <section className="mx-4 my-8 sm:my-0">
            <ul className="my-4 max-w-md mx-auto" aria-label="Account menu">
              <AccountLink to="/orders">
                <Package className="mr-2" />My Orders
              </AccountLink>
              <AccountLink to="/cart">
                <ShoppingCart className="mr-2" />My Shopping Cart
              </AccountLink>
              <AccountLink to="mailto:contact@brand.com">
                <Mail className="mr-2" />Need Help? Contact Us
              </AccountLink>
              <AccountLink to="/" onClick={() => {
                logout()
                cartDispatch({ type: "RESET" })
                addToast('Logged out successfully')
              }}>
                <LogOut className="mr-2" />Log out from this Account
              </AccountLink>
            </ul>
          </section>
        </div>
      </Container>

      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </main>
  )
}

function AccountLink({ children, ...props }) {
  return (
    <Link {...props}>
      <li className={clsx(
        "flex items-center",
        "px-3 py-2 my-2",
        "text-gray-800 dark:text-gray-200 bg-gray-100 dark:bg-gray-700",
        "rounded border border-gray-300 dark:border-gray-600",
        "hover:(bg-gray-200 dark:bg-gray-600)",
        "focus-within:(ring-2 ring-gray-400)"
      )}>
        {children}
        <ChevronRight className="ml-auto" />
      </li>
    </Link>
  )
}
