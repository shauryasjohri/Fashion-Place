import { useState } from 'react'
import { Mail } from "react-feather"

import Input from "@/components/common/Input"
import Button from "@/components/common/Button"

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function Newsletter({ addToast }) {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')

    if (!email.trim()) {
      setError('Please enter your email address')
      return
    }

    if (!EMAIL_REGEX.test(email.trim())) {
      setError('Please enter a valid email address')
      return
    }

    if (addToast) {
      addToast('Subscribed to newsletter!')
    }
    setEmail('')
  }

  return (
    <div className="max-w-2xl m-4 sm:mx-auto rounded-md text-center border-2 border-gray-600 dark:border-gray-500 p-4 bg-gradient-to-r from-violet-50 to-indigo-50 dark:from-violet-900/30 dark:to-indigo-900/30">
      <h2 className="text-4xl font-medium mb-3"> Newsletter</h2>
      <p className="text-xl text-gray-500 dark:text-gray-400">Subscribe to our weekly newsletter and get timely updates for your favorite products.</p>
      <form className="max-w-xl flex flex-col sm:flex-row mx-auto mt-8 mb-4" onSubmit={handleSubmit} noValidate>
        <div className="flex-1">
          <Input
            icon={<Mail />}
            type="email"
            placeholder="Your Email"
            value={email}
            onChange={e => { setEmail(e.target.value); setError('') }}
            aria-label="Email for newsletter"
            aria-invalid={!!error}
            aria-describedby={error ? 'newsletter-error' : undefined}
          />
        </div>
        <Button type="submit">Subscribe</Button>
      </form>
      {error && (
        <p id="newsletter-error" className="text-red-500 text-sm" role="alert">{error}</p>
      )}
    </div>
  )
}
