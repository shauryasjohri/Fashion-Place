import { useEffect, useRef, useCallback } from "react"

export default function useClickOutside(callbackFn) {
  const domNode = useRef()
  const callbackRef = useRef(callbackFn)

  useEffect(() => {
    callbackRef.current = callbackFn
  })

  useEffect(() => {
    const handler = (event) => {
      if (!domNode.current?.contains(event.target)) {
        callbackRef.current()
      }
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  return domNode
}
