export default function BrandFilter({ brands, selected, onChange }) {
  if (brands.length === 0) return null

  const toggle = (brand) => {
    if (selected.includes(brand)) {
      onChange(selected.filter((b) => b !== brand))
    } else {
      onChange([...selected, brand])
    }
  }

  return (
    <div>
      <p className="text-sm font-bold text-gray-800 mb-3">Brand</p>
      <ul className="space-y-2 max-h-44 overflow-y-auto pr-1">
        {brands.map((brand) => (
          <li key={brand} className="flex items-center gap-2">
            <input
              type="checkbox"
              id={`brand-${brand}`}
              checked={selected.includes(brand)}
              onChange={() => toggle(brand)}
              className="accent-blue-600 w-4 h-4 cursor-pointer"
            />
            <label htmlFor={`brand-${brand}`} className="text-sm text-gray-600 cursor-pointer select-none">
              {brand}
            </label>
          </li>
        ))}
      </ul>
      {selected.length > 0 && (
        <button onClick={() => onChange([])} className="mt-2 text-xs text-blue-600 hover:underline">
          Clear
        </button>
      )}
    </div>
  )
}
