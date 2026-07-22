import { useEffect, useReducer } from "react"

export default function useLocalStorage(reducer, initialState, storageKey) {
  const [storedState, dispatch] = useReducer(reducer, initialState, () => {
    try {
      const persisted = window.localStorage.getItem(storageKey)
      return persisted ? JSON.parse(persisted) : initialState
    } catch {
      return initialState
    }
  })

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(storedState))
  }, [storedState])

  return [storedState, dispatch]
}
