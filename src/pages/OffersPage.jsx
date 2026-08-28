import React from 'react';
import { 
  Percent, 
  Tag, 
  Sparkles, 
  Check, 
  Copy, 
  ArrowRight, 
  ShieldCheck, 
  Glasses 
} from 'lucide-react';
import { COUPONS } from '../data/productsData';
import { useShop } from '../context/ShopContext';

export default function OffersPage({ setCurrentRoute, onSelectCategory }) {
  const { showToast, applyCoupon } = useShop();

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    applyCoupon(code);
    showToast(`Code '${code}' copied and applied!`, "success");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-16">
      
      {/* Hero */}
      <div className="bg-gradient-to-r from-rose-900 via-rose-800 to-slate-900 text-white p-8 sm:p-12 rounded-3xl space-y-4 shadow-xl">
        <div className="inline-flex items-center gap-2 bg-white/10 text-rose-300 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
          <Percent className="w-3.5 h-3.5" /> LENS S WORLD Verified Offers & Promo Deals
        </div>
        <h1 className="font-display text-3xl sm:text-4xl font-extrabold max-w-xl">
          Exclusive Eyewear Discounts & Coupon Codes
        </h1>
        <p className="text-xs sm:text-sm text-rose-100 max-w-lg leading-relaxed">
          Enjoy verified discounts on prescription frames, polarized sunglasses, and progressive lens packages. Applied directly at checkout!
        </p>
      </div>

      {/* Coupon Cards Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Coupon 1: FLAT200 */}
        <div className="bg-white p-6 rounded-3xl border-2 border-dashed border-teal-500 shadow-sm space-y-4 flex flex-col justify-between">
          <div className="space-y-2">
            <span className="text-[10px] font-extrabold uppercase bg-teal-50 text-teal-800 px-2.5 py-1 rounded-full border border-teal-200">
              Summer Special
            </span>
            <h3 className="font-display font-bold text-2xl text-slate-900">Flat ₹200 OFF</h3>
            <p className="text-xs text-slate-500">Applicable on all orders of ₹1,200 and above.</p>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <div className="bg-slate-100 p-2.5 px-3 rounded-xl font-mono font-extrabold text-sm text-slate-800 tracking-wider">
              FLAT200
            </div>
            <button
              onClick={() => handleCopyCode('FLAT200')}
              className="px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold rounded-xl shadow transition flex items-center gap-1.5"
            >
              <Copy className="w-3.5 h-3.5" /> Apply
            </button>
          </div>
        </div>

        {/* Coupon 2: LENS10 */}
        <div className="bg-white p-6 rounded-3xl border-2 border-dashed border-amber-500 shadow-sm space-y-4 flex flex-col justify-between">
          <div className="space-y-2">
            <span className="text-[10px] font-extrabold uppercase bg-amber-50 text-amber-800 px-2.5 py-1 rounded-full border border-amber-200">
              Sitewide 10% Discount
            </span>
            <h3 className="font-display font-bold text-2xl text-slate-900">10% OFF Total Cart</h3>
            <p className="text-xs text-slate-500">Valid on all frames, lenses, and contact lenses (Min order ₹500).</p>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <div className="bg-slate-100 p-2.5 px-3 rounded-xl font-mono font-extrabold text-sm text-slate-800 tracking-wider">
              LENS10
            </div>
            <button
              onClick={() => handleCopyCode('LENS10')}
              className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl shadow transition flex items-center gap-1.5"
            >
              <Copy className="w-3.5 h-3.5" /> Apply
            </button>
          </div>
        </div>

        {/* Offer 3: Free Shipping */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between">
          <div className="space-y-2">
            <span className="text-[10px] font-extrabold uppercase bg-emerald-50 text-emerald-800 px-2.5 py-1 rounded-full border border-emerald-200">
              Automatic Benefit
            </span>
            <h3 className="font-display font-bold text-2xl text-slate-900">FREE Express Delivery</h3>
            <p className="text-xs text-slate-500">Automatic free shipping on all orders over ₹499 across all Indian PIN codes.</p>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-700">Auto-Applied at Cart</span>
            <button
              onClick={() => {
                onSelectCategory('all');
                setCurrentRoute({ name: 'shop' });
              }}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow transition"
            >
              Shop Now
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}
