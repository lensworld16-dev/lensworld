import React, { useState, useEffect, useRef } from 'react';
import { 
  Glasses, 
  Search, 
  Heart, 
  ShoppingBag, 
  Menu, 
  X, 
  Phone, 
  MessageCircle, 
  ShieldCheck, 
  Sparkles, 
  ChevronDown, 
  LayoutDashboard,
  Truck,
  ArrowRight
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { STORE_PHONE, getWhatsAppUrl } from '../utils/whatsappHelper';

export default function Navbar({ currentRoute, setCurrentRoute, onSelectCategory }) {
  const { cartCount, wishlist, products, setCartDrawerOpen } = useShop();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const searchRef = useRef(null);

  // Search filtering
  useEffect(() => {
    if (searchQuery.trim().length > 1) {
      const q = searchQuery.toLowerCase();
      const matches = products.filter(p => 
        p.name.toLowerCase().includes(q) ||
        p.type.toLowerCase().includes(q) ||
        p.shape?.toLowerCase().includes(q) ||
        p.color?.toLowerCase().includes(q) ||
        p.material?.toLowerCase().includes(q)
      ).slice(0, 5);
      setSearchResults(matches);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery, products]);

  // Click outside to close search dropdown
  useEffect(() => {
    function handleClickOutside(e) {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setSearchFocused(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSelect = (product) => {
    setSearchQuery('');
    setSearchFocused(false);
    setCurrentRoute({ name: 'product-detail', id: product.id });
  };

  const navLinks = [
    { label: 'Eyeglasses', route: 'shop', category: 'eyeglasses' },
    { label: 'Sunglasses', route: 'shop', category: 'sunglasses' },
    { label: 'Power Specs', route: 'shop', category: 'power-specs' },
    { label: 'Contact Lens', route: 'shop', category: 'contact-lenses' },
    { label: 'Readers', route: 'shop', category: 'reading-glasses' },
    { label: 'Lens', route: 'shop', category: 'lenses' },
    { label: 'Accessories', route: 'shop', category: 'accessories' },
    { label: '🔥 Offers', route: 'offers', highlight: true },
    { label: 'Track Order', route: 'track-order' }
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-100">
      {/* 1. Top Announcement Bar - Slim */}
      <div className="bg-slate-900 text-slate-200 text-[11px] py-1 px-3 sm:px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-1.5">
          <div className="flex items-center gap-2 font-medium tracking-wide">
            <span className="inline-flex items-center gap-1 bg-teal-500/20 text-teal-300 px-2 py-0.5 rounded-full text-[10px] font-bold border border-teal-400/30">
              <Sparkles className="w-2.5 h-2.5" /> Special Deal
            </span>
            <span className="truncate">SUMMER SALE: BUY 1 GET 1 · USE CODE <strong className="text-amber-400">FLAT200</strong></span>
          </div>

          <div className="flex items-center gap-3 text-[10px] text-slate-300 shrink-0">
            <span className="hidden md:flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-teal-400" /> 100% Genuine · GST Invoice
            </span>
            <span className="hidden sm:inline text-slate-700">|</span>
            <a 
              href={getWhatsAppUrl("Hello LENS S WORLD, I need help with an order.")}
              target="_blank" 
              rel="noreferrer"
              className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 font-semibold transition"
            >
              <MessageCircle className="w-3 h-3" /> WhatsApp
            </a>
            <span className="hidden sm:inline text-slate-700">|</span>
            <button 
              onClick={() => setCurrentRoute({ name: 'admin' })}
              className="flex items-center gap-1 text-amber-300 hover:text-amber-200 font-semibold bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20 text-[10px]"
            >
              <LayoutDashboard className="w-2.5 h-2.5" /> Owner Admin
            </button>
          </div>
        </div>
      </div>

      {/* 2. Main Header Bar - Prominent on Desktop, Ultra-Compact on Mobile */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-1.5 sm:py-2.5 flex items-center justify-between gap-2 sm:gap-3">
        {/* Brand Logo - Enlarged on Desktop & Slim on Mobile */}
        <div 
          onClick={() => setCurrentRoute({ name: 'home' })}
          className="flex items-center gap-2 cursor-pointer group shrink-0"
        >
          <img 
            src="images/lenss_world_logo_with_name-removebg-preview.png" 
            alt="LENS S WORLD" 
            className="h-11 sm:h-10 md:h-11 max-w-[185px] sm:max-w-[210px] object-contain transition group-hover:scale-105"
            onError={(e) => {
              // Fallback if image not loaded directly
              e.currentTarget.style.display = 'none';
              if (e.currentTarget.nextSibling) e.currentTarget.nextSibling.style.display = 'flex';
            }}
          />
          <div className="hidden items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-teal-700 text-white flex items-center justify-center shadow-sm">
              <Glasses className="w-5 h-5" />
            </div>
            <div>
              <span className="block font-display text-lg font-extrabold tracking-tight text-slate-900 leading-none">
                LENS <span className="text-teal-700">S</span> WORLD
              </span>
              <span className="block text-[8px] font-bold tracking-[0.18em] text-slate-400 uppercase mt-0.5">
                Nayi Nazar, Naya Style
              </span>
            </div>
          </div>
        </div>

        {/* Search Bar with live dropdown - Slim Height */}
        <div ref={searchRef} className="relative hidden md:block flex-1 max-w-md mx-2 lg:mx-4">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              placeholder="Search frames, sunglasses, lenses..."
              className="w-full bg-slate-100 hover:bg-slate-50 focus:bg-white text-xs text-slate-800 placeholder-slate-400 pl-8 pr-8 py-1.5 rounded-full border border-slate-200 focus:border-teal-600 focus:ring-2 focus:ring-teal-600/10 outline-none transition"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1.5 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Search dropdown results */}
          {searchFocused && searchResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1.5 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-50 p-2 divide-y divide-slate-100 animate-in fade-in duration-150">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2.5 py-1">
                Matching Eyewear ({searchResults.length})
              </div>
              {searchResults.map(item => (
                <div
                  key={item.id}
                  onClick={() => handleSearchSelect(item)}
                  className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-teal-50/60 cursor-pointer transition"
                >
                  <img src={item.img} alt={item.name} className="w-10 h-10 rounded-lg object-cover bg-slate-100" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-slate-800 truncate">{item.name}</p>
                    <p className="text-[10px] text-slate-500 capitalize">{item.type} · {item.shape || item.material}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-teal-700">₹{item.price.toLocaleString('en-IN')}</p>
                    <p className="text-[10px] text-slate-400 line-through">₹{item.mrp.toLocaleString('en-IN')}</p>
                  </div>
                </div>
              ))}
              <div 
                onClick={() => {
                  setSearchFocused(false);
                  setCurrentRoute({ name: 'shop' });
                }}
                className="p-1.5 text-center text-xs font-semibold text-teal-700 hover:bg-slate-50 cursor-pointer rounded-lg flex items-center justify-center gap-1"
              >
                View all results <ArrowRight className="w-3 h-3" />
              </div>
            </div>
          )}
        </div>

        {/* Header Actions (Wishlist, Cart, Mobile toggle) */}
        <div className="flex items-center gap-2">
          {/* Wishlist Button */}
          <button
            onClick={() => setCurrentRoute({ name: 'wishlist' })}
            className="relative p-2 rounded-full text-slate-700 hover:text-teal-700 hover:bg-slate-100 transition"
            title="Wishlist"
          >
            <Heart className="w-4 h-4" />
            {wishlist.length > 0 && (
              <span className="absolute top-0.5 right-0.5 w-3.5 h-3.5 bg-rose-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center shadow">
                {wishlist.length}
              </span>
            )}
          </button>

          {/* Cart Drawer Trigger */}
          <button
            onClick={() => setCartDrawerOpen(true)}
            className="relative flex items-center gap-1.5 bg-teal-700 hover:bg-teal-800 text-white px-3.5 py-1.5 rounded-full font-bold text-xs shadow-sm transition active:scale-95"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Cart</span>
            {cartCount > 0 && (
              <span className="bg-white text-teal-800 text-[10px] font-extrabold px-1.5 py-0.2 rounded-full">
                {cartCount}
              </span>
            )}
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-1.5 rounded-lg text-slate-700 hover:bg-slate-100"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* 3. Compact Navigation Row */}
      <nav className="hidden md:block bg-slate-50/90 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ul className="flex items-center justify-start space-x-1 lg:space-x-2 py-1 text-xs font-semibold text-slate-700">
            <li>
              <button
                onClick={() => setCurrentRoute({ name: 'home' })}
                className={`px-2.5 py-1 rounded-md transition ${currentRoute.name === 'home' ? 'text-teal-700 bg-teal-50 font-bold' : 'hover:text-teal-700 hover:bg-white'}`}
              >
                Home
              </button>
            </li>
            {navLinks.map((link, idx) => (
              <li key={idx}>
                <button
                  onClick={() => {
                    if (link.category) {
                      onSelectCategory(link.category);
                    }
                    setCurrentRoute({ name: link.route });
                  }}
                  className={`px-2.5 py-1 rounded-md transition flex items-center gap-1 ${
                    link.highlight 
                      ? 'text-rose-600 bg-rose-50 hover:bg-rose-100 font-bold' 
                      : currentRoute.name === link.route 
                        ? 'text-teal-700 bg-teal-50 font-bold' 
                        : 'hover:text-teal-700 hover:bg-white'
                  }`}
                >
                  {link.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* 4. Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-slate-200 px-4 pt-3 pb-6 space-y-3 shadow-xl animate-in slide-in-from-top-4 duration-200">
          {/* Mobile Search */}
          <div className="relative mb-3">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search eyewear & lenses..."
              className="w-full bg-slate-100 text-sm text-slate-800 placeholder-slate-400 pl-10 pr-4 py-2 rounded-xl border border-slate-200 outline-none"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
          </div>

          <div className="grid grid-cols-2 gap-2">
            {navLinks.map((link, idx) => (
              <button
                key={idx}
                onClick={() => {
                  if (link.category) onSelectCategory(link.category);
                  setCurrentRoute({ name: link.route });
                  setMobileMenuOpen(false);
                }}
                className={`p-3 rounded-xl text-left text-sm font-semibold transition border ${
                  link.highlight
                    ? 'bg-rose-50 border-rose-200 text-rose-700'
                    : 'bg-slate-50 border-slate-100 text-slate-800 hover:bg-teal-50 hover:text-teal-800'
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>

          <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
            <button
              onClick={() => {
                setCurrentRoute({ name: 'admin' });
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-center gap-2 bg-amber-500/10 text-amber-700 font-bold p-2.5 rounded-xl border border-amber-500/30 text-sm"
            >
              <LayoutDashboard className="w-4 h-4" /> Open Owner Admin Dashboard
            </button>
            <a
              href={getWhatsAppUrl("Hello LENS S WORLD, I would like to enquire about eyewear.")}
              target="_blank"
              rel="noreferrer"
              className="w-full flex items-center justify-center gap-2 bg-emerald-600 text-white font-bold p-2.5 rounded-xl text-sm shadow"
            >
              <MessageCircle className="w-4 h-4" /> Chat on WhatsApp ({STORE_PHONE})
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
