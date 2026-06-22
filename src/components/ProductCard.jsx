import { Link } from 'react-router-dom'
import { useState } from 'react'

export default function ProductCard({ product }) {
  const [liked, setLiked] = useState(false)

  return (
    <Link
      to={`/product/${product.id}`}
      className="group bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden flex flex-col"
    >
      {/* Image area */}
      <div className="relative bg-white p-4 h-52 flex items-center justify-center">
        <img
          src={product.thumbnail}
          alt={product.title}
          className="max-h-44 object-contain w-full group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        {/* Heart button */}
        <button
          onClick={(e) => { e.preventDefault(); setLiked((v) => !v) }}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white shadow-sm border border-gray-100 flex items-center justify-center hover:scale-110 transition-transform"
        >
          <svg
            className={`w-4 h-4 transition-colors ${liked ? 'text-red-500 fill-red-500' : 'text-gray-300 fill-none'}`}
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>
      </div>

      {/* Info area */}
      <div className="px-4 pb-4 pt-1 flex flex-col gap-1 flex-1">
        <p className="text-xs text-gray-400 truncate">{product.category}</p>
        <h3 className="text-sm font-bold text-gray-900 leading-snug line-clamp-2 group-hover:text-blue-600 transition-colors">
          {product.title}
        </h3>
        <div className="flex items-center justify-between mt-auto pt-2">
          <span className="text-blue-600 font-bold text-base">
            ${product.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </span>
          <span className="flex items-center gap-1 text-xs text-gray-500">
            <svg className="w-3.5 h-3.5 text-amber-400 fill-amber-400" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            {product.rating}
          </span>
        </div>
      </div>
    </Link>
  )
}
