import React from 'react';
import { Heart, Star, Sparkles, Eye, ArrowRight, ShieldCheck, ShoppingBag } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export default function ProductCard({ product, onSelectProduct, onOpenLensModal }) {
  const { wishlist, toggleWishlist, addToCart, setQuickViewProduct } = useShop();
  const isWishlisted = wishlist.includes(product.id);

  const discountPercent = Math.round(((product.mrp - product.price) / product.mrp) * 100);

  const handleQuickAdd = (e) => {
    e.stopPropagation();
    if (product.lensOptionsAvailable || product.type === 'contact-lenses') {
      onOpenLensModal(product);
    } else {
      addToCart(product);
    }
  };

  const isContact = product.type === 'contact-lenses';

  return (
    <div 
      onClick={() => onSelectProduct(product)}
      className="group relative bg-white rounded-2xl border border-slate-200/80 hover:border-teal-500/50 hover:shadow-xl hover:shadow-teal-900/5 transition-all duration-300 flex flex-col overflow-hidden cursor-pointer"
    >
      {/* Image Container */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100 flex items-center justify-center">
        <img 
          src={product.img} 
          alt={product.name} 
          className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
          loading="lazy"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {product.bestSeller && (
            <span className="inline-flex items-center gap-1 bg-amber-500 text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow-sm">
              <Sparkles className="w-3 h-3" /> Bestseller
            </span>
          )}
          {discountPercent > 0 && (
            <span className="bg-rose-600 text-white text-[11px] font-extrabold px-2 py-0.5 rounded-full shadow-sm">
              {discountPercent}% OFF
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          className={`absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center shadow-md transition ${
            isWishlisted 
              ? 'bg-rose-50 text-rose-600 scale-110' 
              : 'bg-white/90 text-slate-600 hover:text-rose-600 hover:bg-white'
          }`}
          title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-600 text-rose-600' : ''}`} />
        </button>

        {/* Quick View Button (Desktop Hover) */}
        <div className="absolute inset-x-3 bottom-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 hidden sm:flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setQuickViewProduct(product);
            }}
            className="flex-1 bg-white/95 backdrop-blur hover:bg-white text-slate-800 text-xs font-bold py-2 rounded-xl shadow-lg border border-slate-200 flex items-center justify-center gap-1.5 transition"
          >
            <Eye className="w-3.5 h-3.5 text-teal-700" /> Quick View
          </button>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Category & Rating */}
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
            <span className="capitalize font-medium text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md">
              {product.shape || product.type}
            </span>
            {product.rating && (
              <span className="flex items-center gap-1 font-semibold text-slate-700">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                {product.rating} <span className="text-slate-400 font-normal">({product.reviews})</span>
              </span>
            )}
          </div>

          {/* Product Title */}
          <h3 className="font-display font-bold text-slate-900 text-sm sm:text-base leading-snug group-hover:text-teal-700 transition">
            {product.name}
          </h3>

          {/* Color & Material Subtitle */}
          <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">
            {isContact ? 'Daily · Monthly · Quarterly · Yearly' : `${product.color} · ${product.material || product.duration || 'Optical Quality'}`}
          </p>

          {/* Lens capability tag */}
          {product.lensOptionsAvailable && (
            <div className="mt-2 flex items-center gap-1.5 text-[10px] font-semibold text-emerald-700 bg-emerald-50/80 px-2 py-0.5 rounded-md border border-emerald-100">
              <ShieldCheck className="w-3 h-3 text-emerald-600 shrink-0" />
              <span>Prescription & Blue Cut Ready</span>
            </div>
          )}

          {isContact && (
            <div className="mt-2 flex items-center gap-1.5 text-[10px] font-semibold text-teal-700 bg-teal-50/80 px-2 py-0.5 rounded-md border border-teal-100">
              <ShieldCheck className="w-3 h-3 text-teal-600 shrink-0" />
              <span>All Powers & Disposals In Stock</span>
            </div>
          )}
        </div>

        {/* Pricing & CTA */}
        <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between gap-2">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-base sm:text-lg font-extrabold text-slate-900">
                ₹{product.price.toLocaleString('en-IN')}
              </span>
              {product.mrp > product.price && (
                <span className="text-[11px] text-slate-400 line-through">
                  ₹{product.mrp.toLocaleString('en-IN')}
                </span>
              )}
            </div>
            <span className="text-[9px] text-emerald-600 font-semibold block">
              Inclusive of GST
            </span>
          </div>

          <button
            onClick={handleQuickAdd}
            className="flex items-center justify-center gap-1 bg-slate-900 hover:bg-teal-700 text-white text-[11px] font-bold px-3 py-2 rounded-xl shadow-sm transition active:scale-95 shrink-0"
          >
            {isContact ? (
              <>Select Pack</>
            ) : product.lensOptionsAvailable ? (
              <>Add Lens</>
            ) : (
              <>
                <ShoppingBag className="w-3 h-3" /> Buy
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
