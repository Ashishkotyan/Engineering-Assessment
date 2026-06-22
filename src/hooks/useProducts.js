import { useState, useEffect } from 'react'
import { fetchProducts } from '../api/productsApi'

export function useProducts({ category, page, limit = 12 }) {
  const [products, setProducts] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)

    const skip = (page - 1) * limit

    fetchProducts({ limit, skip, category })
      .then((data) => {
        if (!cancelled) {
          setProducts(data.products)
          setTotal(data.total)
          setLoading(false)
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err.message || 'Failed to load products.')
          setLoading(false)
        }
      })

    return () => { cancelled = true }
  }, [category, page, limit])

  return { products, total, loading, error }
}
