import { useState, useCallback } from 'react'

let nextId = 0

export function useToast() {
  const [toasts, setToasts] = useState([])

  const addToast = useCallback((message, variant = 'success') => {
    const id = ++nextId
    setToasts(prev => [...prev, { id, message, variant }])
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, 4000)
  }, [])

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  return { toasts, addToast, removeToast }
}
