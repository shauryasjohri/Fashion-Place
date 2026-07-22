import { useEffect } from 'react'

export default function useDocumentTitle(title) {
  useEffect(() => {
    const prev = document.title
    document.title = title ? `${title} | Fashion Place` : 'Fashion Place'
    return () => { document.title = prev }
  }, [title])
}
