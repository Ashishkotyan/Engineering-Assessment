# CLAUDE.md

## Project Overview

Build a production-quality React Product Listing Application using the DummyJSON API.

This is a frontend engineering assessment. Prioritize:

- Clean architecture
- Reusable components
- State management
- Routing
- Loading and error states
- Maintainable code
- Responsive UI

Do not over-engineer but implement with professional standards.

---

# Tech Stack

Use:

- React 18+
- Vite
- React Router DOM
- Tailwind CSS
- Axios (optional)

Use functional components only.

Avoid Redux and heavy UI libraries.

---

# API Endpoints

Base URL:

https://dummyjson.com

Required endpoints:

GET /products
GET /products/categories
GET /products/{id}

Optional:

GET /products/category/{category}

---

# Application Pages

Implement exactly two pages.

## 1. Product Listing Page

Route:

/

### Layout

Desktop:

- Left sidebar = Filters
- Right section = Product Grid
- Pagination at bottom

Mobile:

- Filters collapse into drawer or top section
- Grid becomes responsive

### Product Card

Display:

- Thumbnail/Image
- Product Title
- Price
- Rating

Card should be clickable.

Clicking a card navigates to:

/product/:id

### Filters

Implement all mandatory filters.

#### Category Filter

Fetch categories dynamically.

Endpoint:

GET /products/categories

Requirements:

- Categories rendered dynamically
- Selecting category updates products
- Only one category selected at a time

#### Brand Filter

Extract brands from fetched products.

Requirements:

- Generate unique brands
- Multi-select preferred
- Checkbox UI

#### Price Range Filter

Inputs:

- Min Price
- Max Price

Requirements:

- Filter products within range
- Update results immediately

### Filter Rules

All filters must work together.

Whenever any filter changes:

- Product list updates immediately
- Pagination resets to page 1

### Pagination

Implement pagination.

Use:

limit=12

skip=(page-1)*12

Requirements:

- Next
- Previous
- Page numbers

Reset pagination when filters change.

### Loading State

Show loading UI while fetching:

- Products
- Categories
- Product details

### Error Handling

Handle:

- Network errors
- Failed API responses
- Invalid product ID

---

## 2. Product Detail Page

Route:

/product/:id

Fetch:

GET /products/:id

Display:

- Product Image
- Product Title
- Price
- Rating
- Description
- Brand
- Category

### Navigation

Provide Back Button.

Requirement:

When returning to listing page, all previously selected filters and pagination state must remain intact.

---

# State Management Strategy

Use URL Search Params.

Example:

/?category=beauty&brand=Apple&page=2

Use:

useSearchParams()

Store:

- category
- brands
- minPrice
- maxPrice
- page

---

# Project Structure

src/

api/
productsApi.js

components/
ProductCard.jsx
ProductGrid.jsx
Pagination.jsx
Loader.jsx
ErrorMessage.jsx

filters/
CategoryFilter.jsx
BrandFilter.jsx
PriceFilter.jsx

hooks/
useProducts.js
useProductDetails.js

pages/
ProductListing.jsx
ProductDetail.jsx

utils/
filterProducts.js

routes/
AppRoutes.jsx

App.jsx
main.jsx

---

# Code Quality Rules

1. No duplicated logic.
2. Reusable components only.
3. Small focused components.
4. No inline API requests in JSX.
5. Meaningful naming.
6. Clean imports.
7. Handle all loading states.
8. Handle all error states.
9. Mobile responsive.

---

# Deliverables

Generate:

- Complete React application
- README.md
- Proper folder structure
- Responsive UI

README must include:

## Setup

npm install
npm run dev

## Architecture Decisions

Explain:
- URL search params approach
- Custom hooks
- Component structure

## Future Improvements

- Search
- Sorting
- Infinite scrolling
- Unit tests
- React Query integration