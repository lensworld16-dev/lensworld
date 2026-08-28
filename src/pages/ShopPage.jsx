import React, { useState, useMemo } from 'react';
import { 
  Filter, 
  SlidersHorizontal, 
  X, 
  ChevronDown, 
  RotateCcw, 
  Glasses, 
  Search,
  Sparkles
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import ProductCard from '../components/ProductCard';
import { CATEGORIES } from '../data/productsData';

export default function ShopPage({ 
  activeCategory = 'all', 
  onSelectCategory, 
  onSelectProduct, 
  onOpenLensModal 
}) {
  const { products } = useShop();

  // Filters State
  const [selectedGender, setSelectedGender] = useState('all');
  const [selectedShape, setSelectedShape] = useState('all');
  const [selectedMaterial, setSelectedMaterial] = useState('all');
  const [selectedPriceRange, setSelectedPriceRange] = useState('all');
  const [searchFilter, setSearchFilter] = useState('');
  const [sortBy, setSortBy] = useState('featured'); // 'featured' | 'price-asc' | 'price-desc' | 'rating'
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Available unique shapes & materials
  const shapes = ["all", "Rectangle", "Round", "Aviator", "Cat-Eye", "Wayfarer", "Sports"];
  const materials = ["all", "Premium Italian Acetate", "Ultra-Lightweight Metal Alloy", "Swiss TR90 Memory Polymer", "High-Impact Polycarbonate"];

  // Filter logic
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      // Category filter
      if (activeCategory !== 'all') {
        if (['men', 'women', 'kids', 'couple'].includes(activeCategory)) {
          if (!product.cats?.includes(activeCategory)) return false;
        } else if (product.type !== activeCategory) {
          return false;
        }
      }

      // Gender filter
      if (selectedGender !== 'all' && !product.cats?.includes(selectedGender)) {
        return false;
      }

      // Shape filter
      if (selectedShape !== 'all' && product.shape?.toLowerCase() !== selectedShape.toLowerCase()) {
        return false;
      }

      // Material filter
      if (selectedMaterial !== 'all' && product.material !== selectedMaterial) {
        return false;
      }

      // Price filter
      if (selectedPriceRange !== 'all') {
        if (selectedPriceRange === 'under-1000' && product.price >= 1000) return false;
        if (selectedPriceRange === '1000-1800' && (product.price < 1000 || product.price > 1800)) return false;
        if (selectedPriceRange === 'above-1800' && product.price <= 1800) return false;
      }

      // Search filter
      if (searchFilter.trim()) {
        const q = searchFilter.toLowerCase();
        const matchesName = product.name.toLowerCase().includes(q);
        const matchesDesc = product.description?.toLowerCase().includes(q);
        const matchesColor = product.color?.toLowerCase().includes(q);
        if (!matchesName && !matchesDesc && !matchesColor) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
      return 0; // default featured
    });
  }, [products, activeCategory, selectedGender, selectedShape, selectedMaterial, selectedPriceRange, searchFilter, sortBy]);

  const resetAllFilters = () => {
    setSelectedGender('all');
    setSelectedShape('all');
    setSelectedMaterial('all');
    setSelectedPriceRange('all');
    setSearchFilter('');
    setSortBy('featured');
    onSelectCategory('all');
  };

  const hasActiveFilters = 
    activeCategory !== 'all' || 
    selectedGender !== 'all' || 
    selectedShape !== 'all' || 
    selectedMaterial !== 'all' || 
    selectedPriceRange !== 'all' || 
    searchFilter !== '';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      
      {/* 1. Page Header & Category Tabs */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 capitalize">
              {activeCategory === 'all' ? 'All Eyewear & Optics' : `${activeCategory} Collection`}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Showing {filteredProducts.length} premium optical styles with verified quality guarantee
            </p>
          </div>

          {/* Search within shop */}
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="Filter by keyword..."
              className="w-full bg-white text-xs text-slate-800 placeholder-slate-400 pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-teal-600 outline-none"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
            {searchFilter && (
              <button 
                onClick={() => setSearchFilter('')}
                className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Category Pills Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {CATEGORIES.map(cat => (
            <button
              key={cat.key}
              onClick={() => onSelectCategory(cat.key)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition border ${
                activeCategory === cat.key
                  ? 'bg-teal-700 text-white border-teal-700 shadow-sm'
                  : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Controls & Sort Row */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-sm">
        
        {/* Left: Mobile Filter trigger + Active Filter count */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            className="md:hidden flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 text-slate-700 text-xs font-bold rounded-lg"
          >
            <Filter className="w-3.5 h-3.5" /> Filters
          </button>

          {hasActiveFilters && (
            <button
              onClick={resetAllFilters}
              className="flex items-center gap-1 text-xs font-semibold text-rose-600 hover:text-rose-700 bg-rose-50 px-2.5 py-1 rounded-lg transition"
            >
              <RotateCcw className="w-3 h-3" /> Clear All Filters
            </button>
          )}
        </div>

        {/* Right: Sort By */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-500 font-medium">Sort By:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-slate-800 font-semibold p-1.5 px-3 rounded-xl outline-none"
          >
            <option value="featured">Featured & Trending</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating">Highest Customer Rating</option>
          </select>
        </div>
      </div>

      {/* 3. Main Grid Layout (Sidebar Filters + Products Grid) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 items-start">
        
        {/* Desktop Sidebar Filters */}
        <aside className={`md:block space-y-6 ${mobileFilterOpen ? 'block' : 'hidden'} md:static fixed inset-0 z-40 bg-white md:bg-transparent p-6 md:p-0 overflow-y-auto`}>
          
          {/* Mobile header */}
          <div className="md:hidden flex items-center justify-between pb-4 border-b border-slate-100">
            <h3 className="font-display font-bold text-lg">Filter Eyewear</h3>
            <button onClick={() => setMobileFilterOpen(false)} className="p-2 text-slate-500">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Filter 1: Gender */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-3">
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500">Gender / Fit</h4>
            <div className="space-y-1.5 text-xs">
              {[
                { key: 'all', label: 'All Fits' },
                { key: 'men', label: "Men's Frames" },
                { key: 'women', label: "Women's Frames" },
                { key: 'kids', label: "Kids' Frames" },
                { key: 'couple', label: 'Unisex / Couple' }
              ].map(g => (
                <label key={g.key} className="flex items-center gap-2 cursor-pointer text-slate-700 hover:text-teal-700">
                  <input
                    type="radio"
                    name="gender-filter"
                    checked={selectedGender === g.key}
                    onChange={() => setSelectedGender(g.key)}
                    className="accent-teal-700"
                  />
                  <span>{g.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Filter 2: Shape */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-3">
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500">Frame Shape</h4>
            <div className="space-y-1.5 text-xs">
              {shapes.map(s => (
                <label key={s} className="flex items-center gap-2 cursor-pointer text-slate-700 hover:text-teal-700">
                  <input
                    type="radio"
                    name="shape-filter"
                    checked={selectedShape === s}
                    onChange={() => setSelectedShape(s)}
                    className="accent-teal-700"
                  />
                  <span className="capitalize">{s === 'all' ? 'All Shapes' : s}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Filter 3: Price Range */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-3">
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500">Price Range</h4>
            <div className="space-y-1.5 text-xs">
              {[
                { key: 'all', label: 'All Prices' },
                { key: 'under-1000', label: 'Under ₹1,000' },
                { key: '1000-1800', label: '₹1,000 - ₹1,800' },
                { key: 'above-1800', label: '₹1,800 & Above' }
              ].map(p => (
                <label key={p.key} className="flex items-center gap-2 cursor-pointer text-slate-700 hover:text-teal-700">
                  <input
                    type="radio"
                    name="price-filter"
                    checked={selectedPriceRange === p.key}
                    onChange={() => setSelectedPriceRange(p.key)}
                    className="accent-teal-700"
                  />
                  <span>{p.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Mobile apply button */}
          <div className="md:hidden pt-4">
            <button
              onClick={() => setMobileFilterOpen(false)}
              className="w-full py-3 bg-teal-700 text-white font-bold text-xs rounded-xl shadow"
            >
              Apply Filters ({filteredProducts.length} Results)
            </button>
          </div>

        </aside>

        {/* Product Cards Grid */}
        <div className="md:col-span-3">
          {filteredProducts.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 space-y-4">
              <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto">
                <Glasses className="w-8 h-8" />
              </div>
              <h3 className="font-display font-bold text-slate-800 text-lg">No matching eyewear found</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Try adjusting or clearing your filters to explore our full collection of frames and lenses.
              </p>
              <button
                onClick={resetAllFilters}
                className="px-5 py-2.5 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-teal-700 transition"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map(product => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onSelectProduct={onSelectProduct}
                  onOpenLensModal={onOpenLensModal}
                />
              ))}
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
