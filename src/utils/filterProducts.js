export function filterProducts(products, { brands, minPrice, maxPrice }) {
  return products.filter((p) => {
    if (brands.length > 0 && !brands.includes(p.brand)) return false
    if (minPrice !== '' && p.price < Number(minPrice)) return false
    if (maxPrice !== '' && p.price > Number(maxPrice)) return false
    return true
  })
}

export function extractBrands(products) {
  const set = new Set(products.map((p) => p.brand).filter(Boolean))
  return Array.from(set).sort()
}
