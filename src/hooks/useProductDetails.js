import { useState, useEffect } from 'react'
import { fetchProductById } from '../api/productsApi'

export function useProductDetails(id) {
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!id) return
    let cancelled = false
    setLoading(true)
    setError(null)

    fetchProductById(id)
      .then((data) => {
        if (!cancelled) {
          setProduct(data)
          setLoading(false)
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err.response?.status === 404 ? 'Product not found.' : err.message || 'Failed to load product.')
          setLoading(false)
        }
      })

    return () => { cancelled = true }
  }, [id])

  return { product, loading, error }
}
