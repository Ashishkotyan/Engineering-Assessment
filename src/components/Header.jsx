import { useState, useEffect, useRef, useCallback } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { fetchCategories } from '../api/productsApi'

const NOTIFICATIONS = [
  { id: 1, text: 'Your order #4821 has been shipped!', time: '2m ago', read: false },
  { id: 2, text: 'New promo: 20% off selected items', time: '1h ago', read: false },
  { id: 3, text: 'Price drop on item in your wishlist', time: '3h ago', read: true },
  { id: 4, text: 'Your review was published', time: '1d ago', read: true },
]

const MESSAGES = [
  { id: 1, initials: 'JD', name: 'John D.', text: 'Is this available in size 10?', time: '5m ago', unread: true },
  { id: 2, initials: 'SP', name: 'Support', text: 'Your return has been approved.', time: '2h ago', unread: false },
  { id: 3, initials: 'AL', name: 'Alice L.', text: 'Thanks for the quick delivery!', time: '1d ago', unread: false },
]

function useClickOutside(handler) {
  const ref = useRef(null)
  useEffect(() => {
    const listener = (e) => { if (ref.current && !ref.current.contains(e.target)) handler() }
    document.addEventListener('mousedown', listener)
    return () => document.removeEventListener('mousedown', listener)
  }, [handler])
  return ref
}

function useDropdown() {
  const [open, setOpen] = useState(false)
  const close = useCallback(() => setOpen(false), [])
  const ref = useClickOutside(close)
  return { open, setOpen, ref, toggle: () => setOpen((v) => !v), close }
}

// ── Sub-components ───────────────────────────────────────────────────────────

function CartDropdown({ ref, items, updateQty, removeFromCart, totalPrice, totalItems }) {
  return (
    <div ref={ref} className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
        <span className="font-semibold text-gray-800">Cart</span>
        <span className="text-xs text-gray-400">{totalItems} item{totalItems !== 1 ? 's' : ''}</span>
      </div>
      {items.length === 0 ? (
        <div className="px-4 py-10 text-center text-gray-400 text-sm">Your cart is empty</div>
      ) : (
        <>
          <ul className="max-h-64 overflow-y-auto divide-y divide-gray-50">
            {items.map((item) => (
              <li key={item.id} className="flex items-center gap-3 px-4 py-3">
                <img src={item.thumbnail} alt={item.title} className="w-12 h-12 object-contain rounded-lg bg-gray-50 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-gray-800 line-clamp-1">{item.title}</p>
                  <p className="text-xs text-blue-600 font-bold">${(item.price * item.qty).toFixed(2)}</p>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button onClick={() => updateQty(item.id, item.qty - 1)} className="w-6 h-6 rounded-full border border-gray-200 text-gray-500 hover:bg-gray-50 flex items-center justify-center text-sm">−</button>
                  <span className="w-5 text-center text-xs font-medium">{item.qty}</span>
                  <button onClick={() => updateQty(item.id, item.qty + 1)} className="w-6 h-6 rounded-full border border-gray-200 text-gray-500 hover:bg-gray-50 flex items-center justify-center text-sm">+</button>
                  <button onClick={() => removeFromCart(item.id)} className="ml-1 text-gray-300 hover:text-red-400 transition-colors">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
                  </button>
                </div>
              </li>
            ))}
          </ul>
          <div className="px-4 py-3 border-t border-gray-100 bg-gray-50">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-gray-600">Total</span>
              <span className="font-bold text-gray-900">${totalPrice.toFixed(2)}</span>
            </div>
            <button className="w-full bg-blue-600 text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors">
              Checkout
            </button>
          </div>
        </>
      )}
    </div>
  )
}

function NotifDropdown({ ref, onClose }) {
  const [notifs, setNotifs] = useState(NOTIFICATIONS)
  const unread = notifs.filter((n) => !n.read).length

  const markAllRead = () => setNotifs((prev) => prev.map((n) => ({ ...n, read: true })))

  return (
    <div ref={ref} className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
        <span className="font-semibold text-gray-800">Notifications {unread > 0 && <span className="ml-1 text-xs bg-red-100 text-red-600 px-1.5 py-0.5 rounded-full">{unread}</span>}</span>
        {unread > 0 && <button onClick={markAllRead} className="text-xs text-blue-600 hover:underline">Mark all read</button>}
      </div>
      <ul className="divide-y divide-gray-50 max-h-72 overflow-y-auto">
        {notifs.map((n) => (
          <li
            key={n.id}
            onClick={() => setNotifs((prev) => prev.map((x) => x.id === n.id ? { ...x, read: true } : x))}
            className={`flex items-start gap-3 px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors ${!n.read ? 'bg-blue-50/50' : ''}`}
          >
            <div className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${!n.read ? 'bg-blue-500' : 'bg-gray-200'}`} />
            <div className="flex-1 min-w-0">
              <p className={`text-sm ${!n.read ? 'font-medium text-gray-900' : 'text-gray-600'}`}>{n.text}</p>
              <p className="text-xs text-gray-400 mt-0.5">{n.time}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

function ChatDropdown({ ref }) {
  return (
    <div ref={ref} className="absolute right-0 top-full mt-2 w-72 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-100">
        <span className="font-semibold text-gray-800">Messages</span>
      </div>
      <ul className="divide-y divide-gray-50 max-h-64 overflow-y-auto">
        {MESSAGES.map((m) => (
          <li key={m.id} className={`flex items-start gap-3 px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors ${m.unread ? 'bg-blue-50/40' : ''}`}>
            <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold flex-shrink-0">
              {m.initials}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <p className={`text-sm ${m.unread ? 'font-semibold text-gray-900' : 'font-medium text-gray-700'}`}>{m.name}</p>
                <span className="text-xs text-gray-400 flex-shrink-0">{m.time}</span>
              </div>
              <p className="text-xs text-gray-500 line-clamp-1 mt-0.5">{m.text}</p>
            </div>
          </li>
        ))}
      </ul>
      <div className="px-4 py-2.5 border-t border-gray-100 bg-gray-50">
        <button className="w-full text-xs text-blue-600 font-medium hover:underline">View all messages</button>
      </div>
    </div>
  )
}

function ProductMenuDropdown({ ref, categories, onSelect }) {
  return (
    <div ref={ref} className="absolute left-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 overflow-hidden">
      <div className="px-4 py-2.5 border-b border-gray-100">
        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Shop by Category</span>
      </div>
      <ul className="py-2 max-h-72 overflow-y-auto">
        {categories.map((cat) => {
          const slug = typeof cat === 'string' ? cat : cat.slug
          const label = typeof cat === 'string' ? cat : cat.name
          return (
            <li key={slug}>
              <button
                onClick={() => onSelect(slug)}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors capitalize"
              >
                {label}
              </button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

// ── Main Header ──────────────────────────────────────────────────────────────

export default function Header() {
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()
  const [query, setQuery] = useState(searchParams.get('q') || '')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [categories, setCategories] = useState([])
  const { totalItems, items, removeFromCart, updateQty, totalPrice } = useCart()

  const productMenu = useDropdown()
  const cartMenu = useDropdown()
  const notifMenu = useDropdown()
  const chatMenu = useDropdown()

  useEffect(() => {
    fetchCategories().then(setCategories).catch(() => {})
  }, [])

  // Sync query input when URL changes (e.g. navigating back)
  useEffect(() => {
    setQuery(searchParams.get('q') || '')
  }, [searchParams])

  const handleSearch = (e) => {
    e?.preventDefault()
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev)
      if (query.trim()) next.set('q', query.trim())
      else next.delete('q')
      next.delete('page')
      return next
    })
    navigate({ pathname: '/', search: query.trim() ? `?q=${encodeURIComponent(query.trim())}` : '' })
    setMobileMenuOpen(false)
  }

  const handleCategorySelect = (slug) => {
    productMenu.close()
    setMobileMenuOpen(false)
    navigate(`/?category=${encodeURIComponent(slug)}`)
  }

  const unreadNotifs = NOTIFICATIONS.filter((n) => !n.read).length
  const unreadChats = MESSAGES.filter((m) => m.unread).length

  return (
    <>
      <header className="bg-white border-b border-gray-100 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-3 h-16">

            {/* Hamburger (mobile only) */}
            <button
              className="md:hidden p-1.5 text-gray-500 hover:text-gray-800 flex-shrink-0"
              onClick={() => setMobileMenuOpen((v) => !v)}
              aria-label="Open menu"
            >
              {mobileMenuOpen ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16"/></svg>
              )}
            </button>

            {/* Logo */}
            <Link to="/" className="flex-shrink-0 flex items-center gap-0.5" onClick={() => setMobileMenuOpen(false)}>
              {[0,1,2].map((i) => (
                <svg key={i} className="w-4 h-5" viewBox="0 0 10 14" fill="black">
                  <polygon points="5,0 0,14 10,14" />
                </svg>
              ))}
            </Link>

            {/* Search bar */}
            <form onSubmit={handleSearch} className="flex-1 min-w-0 max-w-lg">
              <div className="relative">
                <button type="submit" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z"/>
                  </svg>
                </button>
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search products..."
                  className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
              </div>
            </form>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-0.5 text-sm font-medium text-gray-600 flex-shrink-0">
              <Link to="/" className="px-3 py-1.5 rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-colors">
                Home
              </Link>
              <span className="text-gray-200 px-0.5">|</span>

              {/* Product dropdown */}
              <div className="relative" ref={productMenu.ref}>
                <button
                  onClick={productMenu.toggle}
                  className={`px-3 py-1.5 rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-colors flex items-center gap-1 ${productMenu.open ? 'bg-gray-50 text-gray-900' : ''}`}
                >
                  Product
                  <svg className={`w-3.5 h-3.5 transition-transform ${productMenu.open ? 'rotate-180' : ''}`} fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"/>
                  </svg>
                </button>
                {productMenu.open && (
                  <ProductMenuDropdown ref={null} categories={categories} onSelect={handleCategorySelect} />
                )}
              </div>

              <span className="text-gray-200 px-0.5">|</span>
              <button className="px-3 py-1.5 rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-colors">Promo</button>
              <span className="text-gray-200 px-0.5">|</span>
              <button className="px-3 py-1.5 rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-colors">Contact us</button>
            </nav>

            {/* Right icons */}
            <div className="flex items-center gap-1 flex-shrink-0 ml-auto md:ml-0">

              {/* Notifications */}
              <div className="relative" ref={notifMenu.ref}>
                <button onClick={notifMenu.toggle} className="relative p-2 text-gray-500 hover:text-gray-800 transition-colors rounded-lg hover:bg-gray-50">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
                  </svg>
                  {unreadNotifs > 0 && (
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                  )}
                </button>
                {notifMenu.open && <NotifDropdown ref={notifMenu.ref} onClose={notifMenu.close} />}
              </div>

              {/* Chat */}
              <div className="relative hidden sm:block" ref={chatMenu.ref}>
                <button onClick={chatMenu.toggle} className="relative p-2 text-gray-500 hover:text-gray-800 transition-colors rounded-lg hover:bg-gray-50">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
                  </svg>
                  {unreadChats > 0 && (
                    <span className="absolute top-1 right-1 w-2 h-2 bg-blue-500 rounded-full" />
                  )}
                </button>
                {chatMenu.open && <ChatDropdown ref={chatMenu.ref} />}
              </div>

              {/* Store (hidden on small mobile) */}
              <button className="hidden sm:flex p-2 text-gray-500 hover:text-gray-800 transition-colors rounded-lg hover:bg-gray-50">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 3h18l-2 9H5L3 3zm2 9v7a1 1 0 001 1h12a1 1 0 001-1v-7"/>
                </svg>
              </button>

              {/* Cart */}
              <div className="relative" ref={cartMenu.ref}>
                <button onClick={cartMenu.toggle} className="relative p-2 text-gray-500 hover:text-gray-800 transition-colors rounded-lg hover:bg-gray-50">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.4 7h12.8M7 13L5.4 5M10 21a1 1 0 100-2 1 1 0 000 2zm7 0a1 1 0 100-2 1 1 0 000 2z"/>
                  </svg>
                  {totalItems > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[10px] font-bold min-w-[16px] h-4 px-0.5 rounded-full flex items-center justify-center">
                      {totalItems > 99 ? '99+' : totalItems}
                    </span>
                  )}
                </button>
                {cartMenu.open && (
                  <CartDropdown
                    ref={cartMenu.ref}
                    items={items}
                    updateQty={updateQty}
                    removeFromCart={removeFromCart}
                    totalPrice={totalPrice}
                    totalItems={totalItems}
                  />
                )}
              </div>

              {/* Divider + Avatar (desktop) */}
              <div className="hidden md:flex items-center gap-2 ml-1">
                <div className="w-px h-6 bg-gray-200" />
                <button className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-200 to-amber-400 flex items-center justify-center overflow-hidden hover:ring-2 hover:ring-amber-300 transition">
                  <svg className="w-5 h-5 text-amber-800" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile nav drawer */}
      {mobileMenuOpen && (
        <>
          <div
            className="md:hidden fixed inset-0 bg-black/30 z-20 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="md:hidden fixed top-16 left-0 bottom-0 w-72 bg-white z-20 shadow-2xl overflow-y-auto flex flex-col">
            {/* Nav links */}
            <nav className="flex flex-col p-4 gap-1">
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-gray-50 text-gray-800 font-medium"
              >
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>
                Home
              </Link>
              <button className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-gray-50 text-gray-800 font-medium text-left w-full">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"/></svg>
                Promo
              </button>
              <button className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-gray-50 text-gray-800 font-medium text-left w-full">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                Contact us
              </button>
            </nav>

            {/* Categories in drawer */}
            <div className="px-4 pb-4">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide px-3 mb-2">Categories</p>
              <ul className="space-y-0.5">
                <li>
                  <button
                    onClick={() => { navigate('/'); setMobileMenuOpen(false) }}
                    className="w-full text-left px-3 py-2 rounded-xl text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-700 transition-colors"
                  >
                    All Products
                  </button>
                </li>
                {categories.map((cat) => {
                  const slug = typeof cat === 'string' ? cat : cat.slug
                  const label = typeof cat === 'string' ? cat : cat.name
                  return (
                    <li key={slug}>
                      <button
                        onClick={() => handleCategorySelect(slug)}
                        className="w-full text-left px-3 py-2 rounded-xl text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors capitalize"
                      >
                        {label}
                      </button>
                    </li>
                  )
                })}
              </ul>
            </div>
          </div>
        </>
      )}
    </>
  )
}
