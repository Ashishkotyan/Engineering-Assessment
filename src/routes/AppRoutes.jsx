import { Routes, Route } from 'react-router-dom'
import ProductListing from '../pages/ProductListing'
import ProductDetail from '../pages/ProductDetail'

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<ProductListing />} />
      <Route path="/product/:id" element={<ProductDetail />} />
    </Routes>
  )
}
