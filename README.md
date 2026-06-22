# Product Listing App

A production-quality React product listing application built with the DummyJSON API.

## Setup

```bash
npm install
npm run dev
```

## Architecture Decisions

### URL Search Params
All filter and pagination state is stored in the URL via `useSearchParams()`. This means:
- Filters survive navigation — clicking a product and pressing Back restores the exact listing state
- URLs are shareable/bookmarkable with filters included
- No external state management library needed

Parameters stored: `category`, `brands` (comma-separated), `minPrice`, `maxPrice`, `page`

### Custom Hooks
- `useProducts` — fetches the product list for a given category/page; handles loading + error state with cleanup (cancelled flag prevents stale state updates)
- `useProductDetails` — fetches a single product by ID; handles 404 specifically

### Component Structure
- **Pages** (`ProductListing`, `ProductDetail`) — orchestrate data + URL params, compose smaller pieces
- **Filters** (`CategoryFilter`, `BrandFilter`, `PriceFilter`) — each owns its own UI; category filter fetches its own data; brand filter receives extracted brands from the parent
- **Components** (`ProductCard`, `ProductGrid`, `Pagination`, `Loader`, `ErrorMessage`) — pure presentational, reusable
- **`filterProducts` util** — client-side filter logic (brand + price range) applied after the API fetch, since the DummyJSON API doesn't support those filters server-side

### Client-side vs Server-side Filtering
Category filtering is done server-side (API supports it). Brand and price filters are applied client-side after fetching the page, since the API doesn't expose those query params. This is a known trade-off: the displayed count may differ from the paginated total.

## Future Improvements
- Search (text query via `/products/search?q=`)
- Sorting (by price, rating)
- Infinite scrolling instead of pagination
- Unit tests with React Testing Library
- React Query integration for caching and background refetching
