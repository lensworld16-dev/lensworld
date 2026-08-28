import React, { useState } from 'react';
import { 
  X, 
  Star, 
  Heart, 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  ArrowRight, 
  Check,
  ShoppingBag
} from 'lucide-react';
import { useShop } from '../context/ShopContext';

export default function QuickViewModal({ onOpenLensModal, onNavigateToProduct }) {
  const { quickViewProduct, setQuickViewProduct, wishlist, toggleWishlist, addToCart } = useShop();

  if (!quickViewProduct) return null;

  const product = quickViewProduct;
  const isWishlisted = wishlist.includes(product.id);
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0] || product.color || 'Standard');
  const [selectedPower, setSelectedPower] = useState(product.powersAvailable?.[0] || null);

  const handleAdd = () => {
    if (product.lensOptionsAvailable) {
      setQuickViewProduct(null);
      onOpenLensModal(product);
    } else {
      addToCart(product, {
        selectedColor,
        readingPower: selectedPower
      });
      setQuickViewProduct(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden">
        
        {/* Close button */}
        <button
          onClick={() => setQuickViewProduct(null)}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/80 hover:bg-white text-slate-500 hover:text-slate-800 shadow transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid md:grid-cols-2">
          {/* Product Image */}
          <div className="bg-slate-100 p-8 flex items-center justify-center relative">
            <img 
              src={product.img} 
              alt={product.name} 
              className="max-h-72 w-full object-contain mix-blend-multiply" 
            />
            {product.bestSeller && (
              <span className="absolute top-4 left-4 bg-amber-500 text-white text-[11px] font-bold px-3 py-1 rounded-full shadow">
                Bestseller
              </span>
            )}
          </div>

          {/* Product Details */}
          <div className="p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                <span className="font-semibold text-teal-700 uppercase tracking-wider">{product.brand}</span>
                {product.rating && (
                  <span className="flex items-center gap-1 font-bold text-slate-700">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    {product.rating} ({product.reviews} reviews)
                  </span>
                )}
              </div>

              <h2 className="font-display font-bold text-slate-900 text-xl sm:text-2xl leading-tight">
                {product.name}
              </h2>

              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-2xl font-extrabold text-slate-900">
                  ₹{product.price.toLocaleString('en-IN')}
                </span>
                {product.mrp > product.price && (
                  <span className="text-sm text-slate-400 line-through">
                    ₹{product.mrp.toLocaleString('en-IN')}
                  </span>
                )}
                <span className="text-xs font-bold text-rose-600">
                  Save ₹{(product.mrp - product.price).toLocaleString('en-IN')}
                </span>
              </div>

              <p className="text-xs text-slate-600 mt-3 leading-relaxed">
                {product.description}
              </p>

              {/* Color choices */}
              {product.colors && product.colors.length > 1 && (
                <div className="mt-4">
                  <span className="text-xs font-bold text-slate-700 block mb-1.5">Color:</span>
                  <div className="flex flex-wrap gap-2">
                    {product.colors.map(col => (
                      <button
                        key={col}
                        onClick={() => setSelectedColor(col)}
                        className={`text-xs px-3 py-1.5 rounded-lg border font-semibold transition ${
                          selectedColor === col ? 'bg-slate-900 text-white border-slate-900' : 'bg-slate-50 border-slate-200 text-slate-700'
                        }`}
                      >
                        {col}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Reading Power selection */}
              {product.powersAvailable && (
                <div className="mt-4">
                  <span className="text-xs font-bold text-slate-700 block mb-1.5">Select Reading Power:</span>
                  <select
                    value={selectedPower}
                    onChange={(e) => setSelectedPower(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 text-xs font-semibold p-2.5 rounded-xl outline-none"
                  >
                    {product.powersAvailable.map(pow => (
                      <option key={pow} value={pow}>{pow} Diopters</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Guarantees */}
              <div className="mt-5 grid grid-cols-2 gap-2 text-[11px] text-slate-600">
                <div className="flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-teal-700" /> Free Express Delivery
                </div>
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-teal-700" /> 1-Year Frame Warranty
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-3">
              <button
                onClick={() => toggleWishlist(product.id)}
                className={`p-3 rounded-xl border transition ${
                  isWishlisted ? 'bg-rose-50 border-rose-200 text-rose-600' : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
                title="Wishlist"
              >
                <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-rose-600' : ''}`} />
              </button>

              <button
                onClick={handleAdd}
                className="flex-1 py-3 bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs rounded-xl shadow-lg shadow-teal-700/20 transition flex items-center justify-center gap-2 active:scale-95"
              >
                {product.lensOptionsAvailable ? (
                  <>Customize Lens & Buy <ArrowRight className="w-4 h-4" /></>
                ) : (
                  <><ShoppingBag className="w-4 h-4" /> Add to Cart</>
                )}
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
