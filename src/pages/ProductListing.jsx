import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useProducts } from '../hooks/useProducts'
import { filterProducts, extractBrands } from '../utils/filterProducts'
import ProductGrid from '../components/ProductGrid'
import Pagination from '../components/Pagination'
import Loader from '../components/Loader'
import ErrorMessage from '../components/ErrorMessage'
import Header from '../components/Header'
import CategoryFilter from '../filters/CategoryFilter'
import BrandFilter from '../filters/BrandFilter'
import PriceFilter from '../filters/PriceFilter'

const LIMIT = 12
const SORT_OPTIONS = ['Popular', 'Newest', 'Price: Low to High', 'Price: High to Low']

export default function ProductListing() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false)
  const [sort, setSort] = useState('Popular')

  const category = searchParams.get('category') || ''
  const brandsParam = searchParams.get('brands') || ''
  const selectedBrands = brandsParam ? brandsParam.split(',') : []
  const minPrice = searchParams.get('minPrice') || ''
  const maxPrice = searchParams.get('maxPrice') || ''
  const page = parseInt(searchParams.get('page') || '1', 10)
  const query = searchParams.get('q') || ''

  const { products, total, loading, error } = useProducts({ category, page, limit: LIMIT })

  const availableBrands = extractBrands(products)

  let filtered = filterProducts(products, { brands: selectedBrands, minPrice, maxPrice })

  if (query) {
    const q = query.toLowerCase()
    filtered = filtered.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        (p.brand && p.brand.toLowerCase().includes(q)) ||
        (p.description && p.description.toLowerCase().includes(q))
    )
  }

  if (sort === 'Price: Low to High') filtered = [...filtered].sort((a, b) => a.price - b.price)
  if (sort === 'Price: High to Low') filtered = [...filtered].sort((a, b) => b.price - a.price)
  if (sort === 'Newest') filtered = [...filtered].sort((a, b) => b.id - a.id)

  const totalPages = Math.ceil(total / LIMIT)
  const hasActiveFilters = category || selectedBrands.length > 0 || minPrice || maxPrice

  // Close filter drawer on resize to desktop
  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 768) setFilterDrawerOpen(false) }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const updateParams = (updates) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev)
      Object.entries(updates).forEach(([k, v]) => {
        if (v === '' || v === null || v === undefined || (Array.isArray(v) && v.length === 0)) {
          next.delete(k)
        } else {
          next.set(k, Array.isArray(v) ? v.join(',') : v)
        }
      })
      return next
    })
  }

  const handleCategoryChange = (val) => { updateParams({ category: val, page: '' }); setFilterDrawerOpen(false) }
  const handleBrandChange = (brands) => updateParams({ brands, page: '' })
  const handlePriceChange = ({ minPrice: min, maxPrice: max }) => updateParams({ minPrice: min, maxPrice: max, page: '' })
  const handlePageChange = (p) => {
    updateParams({ page: p === 1 ? '' : String(p) })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  const clearAllFilters = () => setSearchParams({})

  const searchLabel = query ? `'${query}'` : category ? `'${category}'` : 'all products'

  const filtersPanel = (
    <div className="space-y-5">
      <CategoryFilter selected={category} onChange={handleCategoryChange} />
      <hr className="border-gray-100" />
      <BrandFilter brands={availableBrands} selected={selectedBrands} onChange={handleBrandChange} />
      {availableBrands.length > 0 && <hr className="border-gray-100" />}
      <PriceFilter minPrice={minPrice} maxPrice={maxPrice} onChange={handlePriceChange} />
      {hasActiveFilters && (
        <>
          <hr className="border-gray-100" />
          <button onClick={clearAllFilters} className="w-full text-xs text-red-500 hover:underline text-left">
            Clear all filters
          </button>
        </>
      )}
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Mobile filter drawer overlay */}
      {filterDrawerOpen && (
        <>
          <div
            className="md:hidden fixed inset-0 bg-black/30 backdrop-blur-sm z-20"
            onClick={() => setFilterDrawerOpen(false)}
          />
          <div className="md:hidden fixed top-16 right-0 bottom-0 w-72 bg-white z-20 shadow-2xl overflow-y-auto">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <h3 className="font-bold text-gray-900">Filters</h3>
              <button onClick={() => setFilterDrawerOpen(false)} className="text-gray-400 hover:text-gray-700">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>
            <div className="p-5">{filtersPanel}</div>
          </div>
        </>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5">
        <div className="flex gap-5">
          {/* Desktop sidebar */}
          <aside className="hidden md:block w-52 flex-shrink-0">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sticky top-20">
              {filtersPanel}
            </div>
          </aside>

          {/* Main content */}
          <main className="flex-1 min-w-0">
            {/* Results heading */}
            <div className="mb-4">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-800 leading-tight">
                Showing search results for{' '}
                <span className="font-bold">{searchLabel}</span>
              </h2>
            </div>

            {/* Sort bar */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-4 sm:px-5 py-3 mb-5">
              <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                <span className="text-sm text-gray-500 font-medium flex-shrink-0">Sort by :</span>

                {/* Sort buttons – scroll on very small screens */}
                <div className="flex items-center gap-1.5 overflow-x-auto flex-1 min-w-0 pb-0.5">
                  {SORT_OPTIONS.map((opt) => (
                    <button
                      key={opt}
                      onClick={() => setSort(opt)}
                      className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${
                        sort === opt
                          ? 'bg-gray-900 text-white'
                          : 'text-gray-600 hover:bg-gray-100 border border-gray-200'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>

                {/* Filter button (mobile) + prev/next */}
                <div className="flex items-center gap-1.5 flex-shrink-0 ml-auto">
                  <button
                    onClick={() => setFilterDrawerOpen(true)}
                    className="md:hidden flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-xs text-gray-600 font-medium hover:bg-gray-50 transition-colors"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h18M6 10h12M9 16h6"/>
                    </svg>
                    Filters {hasActiveFilters && <span className="w-1.5 h-1.5 rounded-full bg-blue-500 inline-block"/>}
                  </button>
                  <button
                    onClick={() => handlePageChange(Math.max(1, page - 1))}
                    disabled={page === 1}
                    className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-lg leading-none"
                  >
                    ‹
                  </button>
                  <button
                    onClick={() => handlePageChange(Math.min(totalPages || 1, page + 1))}
                    disabled={page >= (totalPages || 1)}
                    className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-lg leading-none"
                  >
                    ›
                  </button>
                </div>
              </div>
            </div>

            {/* Products */}
            {loading ? (
              <Loader message="Loading products…" />
            ) : error ? (
              <ErrorMessage message={error} />
            ) : (
              <>
                {!loading && (
                  <p className="text-xs text-gray-400 mb-3">
                    {filtered.length} product{filtered.length !== 1 ? 's' : ''}
                    {totalPages > 1 ? ` · page ${page} of ${totalPages}` : ''}
                  </p>
                )}
                <ProductGrid products={filtered} />
                <Pagination page={page} totalPages={totalPages} onPageChange={handlePageChange} />
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}
