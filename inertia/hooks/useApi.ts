import { useState, useEffect } from 'react'
import api from '~/lib/api'
import type { PaginatedResponse, ApiResponse } from '~/types'

export function useFetch<T>(url: string) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    api
      .get(url)
      .then((res) => {
        // Backend wraps single resources in { data: ... },
        // paginated resources in { data: [...], meta: {...} }
        setData(res.data.data || res.data)
        setLoading(false)
      })
      .catch((err) => {
        setError(err.message)
        setLoading(false)
      })
  }, [url])

  return { data, loading, error }
}

export function usePaginatedFetch<T>(url: string) {
  const [data, setData] = useState<T[]>([])
  const [meta, setMeta] = useState<PaginatedResponse<T>['meta'] | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    api
      .get(url)
      .then((res) => {
        const body: PaginatedResponse<T> = res.data
        setData(body.data)
        setMeta(body.meta)
        setLoading(false)
      })
      .catch((err) => {
        setError(err.message)
        setLoading(false)
      })
  }, [url])

  return { data, meta, loading, error }
}

export function useApiMutation<T = any, P = any>(url: string, method: 'post' | 'put' | 'patch' | 'delete' = 'post') {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const mutate = async (payload?: P) => {
    setLoading(true)
    setError(null)
    try {
      const res = await api[method](url, payload)
      setData(res.data.data || res.data)
      return res.data.data || res.data
    } catch (err: any) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return { data, loading, error, mutate }
}
