import axios from 'axios'

const api = axios.create({
  baseURL: 'https://dummyjson.com',
})

export async function fetchProducts({ limit = 12, skip = 0, category = '' } = {}) {
  const url = category
    ? `/products/category/${encodeURIComponent(category)}`
    : '/products'
  const { data } = await api.get(url, { params: { limit, skip } })
  return data
}

export async function fetchCategories() {
  const { data } = await api.get('/products/categories')
  return data
}

export async function fetchProductById(id) {
  const { data } = await api.get(`/products/${id}`)
  return data
}
