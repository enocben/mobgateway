import { useState, useEffect, useCallback } from 'react'

interface UseFetchState<T> {
  data: T | null
  loading: boolean
  error: string | null
}

interface UseFetchReturn<T> extends UseFetchState<T> {
  refetch: () => void
}

export function useFetch<T>(url: string | null): UseFetchReturn<T> {
  const [state, setState] = useState<UseFetchState<T>>({
    data: null,
    loading: !!url,
    error: null,
  })

  const fetchData = useCallback(async () => {
    if (!url) return

    setState((prev) => ({ ...prev, loading: true, error: null }))

    try {
      const response = await fetch(url, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const json = await response.json()
      setState({ data: json as T, loading: false, error: null })
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An unknown error occurred'
      setState({ data: null, loading: false, error: message })
    }
  }, [url])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return { ...state, refetch: fetchData }
}
