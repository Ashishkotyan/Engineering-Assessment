import { useEffect, useState } from 'react'
import { fetchCategories } from '../api/productsApi'

export default function CategoryFilter({ selected, onChange }) {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCategories()
      .then((data) => { setCategories(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  if (loading) return <p className="text-xs text-gray-400 animate-pulse">Loading…</p>

  return (
    <div>
      <p className="text-sm font-bold text-gray-800 mb-3">Category</p>
      <ul className="space-y-2 max-h-52 overflow-y-auto">
        <li className="flex items-center gap-2">
          <input
            type="radio"
            id="cat-all"
            name="category"
            checked={selected === ''}
            onChange={() => onChange('')}
            className="accent-blue-600 w-4 h-4 cursor-pointer"
          />
          <label htmlFor="cat-all" className="text-sm text-gray-600 cursor-pointer select-none">All</label>
        </li>
        {categories.map((cat) => {
          const slug = typeof cat === 'string' ? cat : cat.slug
          const label = typeof cat === 'string' ? cat : cat.name
          return (
            <li key={slug} className="flex items-center gap-2">
              <input
                type="radio"
                id={`cat-${slug}`}
                name="category"
                checked={selected === slug}
                onChange={() => onChange(slug)}
                className="accent-blue-600 w-4 h-4 cursor-pointer"
              />
              <label htmlFor={`cat-${slug}`} className="text-sm text-gray-600 cursor-pointer select-none capitalize">
                {label}
              </label>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
