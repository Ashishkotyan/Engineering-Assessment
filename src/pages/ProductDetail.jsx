import { useState } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { useProductDetails } from '../hooks/useProductDetails'
import { useCart } from '../context/CartContext'
import Loader from '../components/Loader'
import ErrorMessage from '../components/ErrorMessage'
import Header from '../components/Header'

function StarRating({ rating }) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }, (_, i) => (
        <svg
          key={i}
          className={`w-4 h-4 ${i < Math.round(rating) ? 'text-amber-400 fill-amber-400' : 'text-gray-200 fill-gray-200'}`}
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
      <span className="text-gray-500 text-sm ml-1">{rating} / 5</span>
    </div>
  )
}

export default function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const { product, loading, error } = useProductDetails(id)
  const { addToCart, items } = useCart()
  const [qty, setQty] = useState(1)
  const [activeImg, setActiveImg] = useState(null)
  const [addedFeedback, setAddedFeedback] = useState(false)

  const handleBack = () => {
    if (location.key !== 'default') navigate(-1)
    else navigate('/')
  }

  const handleAddToCart = () => {
    if (!product) return
    for (let i = 0; i < qty; i++) addToCart(product)
    setAddedFeedback(true)
    setTimeout(() => setAddedFeedback(false), 2000)
  }

  const cartQty = items.find((i) => i.id === product?.id)?.qty || 0
  const displayImg = activeImg || product?.thumbnail

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Back */}
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 font-medium mb-6 transition-colors group"
        >
          <svg className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/>
          </svg>
          Back to products
        </button>

        {loading ? (
          <Loader message="Loading product…" />
        ) : error ? (
          <ErrorMessage message={error} />
        ) : product ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="flex flex-col md:flex-row">
              {/* Images column */}
              <div className="md:w-2/5 flex flex-col">
                {/* Main image */}
                <div className="bg-gray-50 flex items-center justify-center p-8 min-h-64 sm:min-h-80">
                  <img
                    src={displayImg}
                    alt={product.title}
                    className="max-h-64 sm:max-h-72 object-contain w-full transition-all duration-200"
                  />
                </div>
                {/* Thumbnails */}
                {product.images && product.images.length > 1 && (
                  <div className="flex gap-2 overflow-x-auto p-4 border-t border-gray-100 bg-white">
                    {product.images.map((img, i) => (
                      <button
                        key={i}
                        onClick={() => setActiveImg(img)}
                        className={`flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-colors ${
                          displayImg === img ? 'border-blue-500' : 'border-gray-100 hover:border-gray-300'
                        }`}
                      >
                        <img src={img} alt={`${product.title} ${i + 1}`} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Details column */}
              <div className="md:w-3/5 p-6 sm:p-8 flex flex-col gap-4">
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-widest mb-1 capitalize">
                    {product.category} · {product.brand}
                  </p>
                  <h1 className="text-xl sm:text-2xl font-bold text-gray-900 leading-tight">{product.title}</h1>
                </div>

                <StarRating rating={product.rating} />

                <div className="flex items-baseline gap-3">
                  <p className="text-3xl font-bold text-blue-600">
                    ${product.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </p>
                  {product.discountPercentage > 0 && (
                    <span className="text-sm bg-red-100 text-red-600 font-semibold px-2 py-0.5 rounded-full">
                      -{product.discountPercentage}% off
                    </span>
                  )}
                </div>

                <p className="text-gray-500 leading-relaxed text-sm">{product.description}</p>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gray-50 rounded-xl p-3">
                    <p className="text-xs text-gray-400 mb-0.5">Brand</p>
                    <p className="text-sm font-semibold text-gray-800">{product.brand || '—'}</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-3">
                    <p className="text-xs text-gray-400 mb-0.5">Category</p>
                    <p className="text-sm font-semibold text-gray-800 capitalize">{product.category}</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-3">
                    <p className="text-xs text-gray-400 mb-0.5">Stock</p>
                    <p className={`text-sm font-semibold ${product.stock < 10 ? 'text-red-600' : 'text-gray-800'}`}>
                      {product.stock} units {product.stock < 10 && '· Low stock'}
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-3">
                    <p className="text-xs text-gray-400 mb-0.5">Rating</p>
                    <p className="text-sm font-semibold text-amber-600">{product.rating} ★</p>
                  </div>
                </div>

                {/* Add to cart */}
                <div className="flex items-center gap-3 pt-2">
                  {/* Qty selector */}
                  <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden flex-shrink-0">
                    <button
                      onClick={() => setQty((q) => Math.max(1, q - 1))}
                      className="px-3 py-2.5 text-gray-600 hover:bg-gray-50 transition-colors font-bold text-lg leading-none"
                    >−</button>
                    <span className="px-4 py-2.5 text-sm font-semibold text-gray-900 min-w-[2.5rem] text-center">{qty}</span>
                    <button
                      onClick={() => setQty((q) => q + 1)}
                      className="px-3 py-2.5 text-gray-600 hover:bg-gray-50 transition-colors font-bold text-lg leading-none"
                    >+</button>
                  </div>

                  {/* Add button */}
                  <button
                    onClick={handleAddToCart}
                    className={`flex-1 py-3 rounded-xl font-semibold text-sm transition-all ${
                      addedFeedback
                        ? 'bg-green-600 text-white scale-95'
                        : 'bg-blue-600 text-white hover:bg-blue-700 active:scale-95'
                    }`}
                  >
                    {addedFeedback ? '✓ Added to cart!' : cartQty > 0 ? `Add more (${cartQty} in cart)` : 'Add to Cart'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  )
}
