export default function PriceFilter({ minPrice, maxPrice, onChange }) {
  return (
    <div>
      <p className="text-sm font-bold text-gray-800 mb-3">Price</p>
      <div className="space-y-2">
        {/* Min */}
        <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-white">
          <span className="pl-3 text-gray-400 text-sm">$</span>
          <input
            type="number"
            min="0"
            value={minPrice}
            onChange={(e) => onChange({ minPrice: e.target.value, maxPrice })}
            placeholder="Min price"
            className="flex-1 px-2 py-2 text-sm text-gray-700 focus:outline-none min-w-0"
          />
          <div className="border-l border-gray-200 px-2 py-2 flex items-center gap-1 text-xs text-gray-500 bg-gray-50 cursor-pointer select-none">
            USD
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" />
            </svg>
          </div>
        </div>

        {/* Max */}
        <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-white">
          <span className="pl-3 text-gray-400 text-sm">$</span>
          <input
            type="number"
            min="0"
            value={maxPrice}
            onChange={(e) => onChange({ minPrice, maxPrice: e.target.value })}
            placeholder="Max price"
            className="flex-1 px-2 py-2 text-sm text-gray-700 focus:outline-none min-w-0"
          />
          <div className="border-l border-gray-200 px-2 py-2 flex items-center gap-1 text-xs text-gray-500 bg-gray-50 cursor-pointer select-none">
            USD
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" />
            </svg>
          </div>
        </div>

        {(minPrice !== '' || maxPrice !== '') && (
          <button
            onClick={() => onChange({ minPrice: '', maxPrice: '' })}
            className="text-xs text-blue-600 hover:underline"
          >
            Clear
          </button>
        )}
      </div>
    </div>
  )
}
