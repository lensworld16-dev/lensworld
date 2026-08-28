import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Trash2, 
  Plus, 
  Minus, 
  ArrowRight, 
  ArrowLeft, 
  Tag, 
  ShieldCheck, 
  Sparkles, 
  Check, 
  RotateCcw 
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { COUPONS } from '../data/productsData';

export default function CartPage({ setCurrentRoute, onSelectProduct }) {
  const { 
    cart, 
    updateCartQty, 
    removeFromCart, 
    clearCart, 
    subtotal, 
    discount, 
    shipping, 
    gst, 
    grandTotal, 
    appliedCoupon, 
    applyCoupon, 
    removeCoupon, 
    couponError 
  } = useShop();

  const [couponInput, setCouponInput] = useState('');

  const freeShippingThreshold = 499;

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (couponInput.trim()) {
      applyCoupon(couponInput.trim());
      setCouponInput('');
    }
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-20 h-20 bg-teal-50 text-teal-700 rounded-full flex items-center justify-center mx-auto shadow-inner">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h1 className="font-display text-3xl font-extrabold text-slate-900">
          Your Shopping Cart is Empty
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
          Looks like you haven't added any eyewear yet. Explore our handcrafted frames, polarized sunglasses, and doctor-approved lenses.
        </p>
        <button
          onClick={() => setCurrentRoute({ name: 'shop' })}
          className="px-8 py-3.5 bg-teal-700 hover:bg-teal-800 text-white font-bold text-sm rounded-full shadow-lg shadow-teal-700/20 transition active:scale-95 inline-flex items-center gap-2"
        >
          <span>Explore All Eyewear</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900">
            Shopping Cart ({cart.reduce((a, b) => a + b.qty, 0)} Items)
          </h1>
          <p className="text-xs text-slate-500 mt-1">Review your frames, lenses, and prescription details</p>
        </div>
        <button
          onClick={clearCart}
          className="text-xs font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1 p-2"
        >
          <Trash2 className="w-3.5 h-3.5" /> Clear Cart
        </button>
      </div>

      <div className="grid lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: Items List (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          {cart.map((item) => {
            const unitPrice = item.price + (item.selectedLens?.price || 0);
            const itemTotal = unitPrice * item.qty;

            return (
              <div 
                key={item.cartItemId} 
                className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row gap-5 items-start justify-between"
              >
                <div className="flex gap-4 items-start flex-1 min-w-0">
                  <img 
                    src={item.img} 
                    alt={item.name} 
                    className="w-24 h-24 rounded-2xl object-cover border border-slate-100 bg-slate-50 shrink-0 cursor-pointer"
                    onClick={() => onSelectProduct(item)}
                  />
                  <div className="space-y-1 flex-1 min-w-0">
                    <h3 
                      onClick={() => onSelectProduct(item)}
                      className="font-display font-bold text-slate-900 text-base sm:text-lg cursor-pointer hover:text-teal-700 transition truncate"
                    >
                      {item.name}
                    </h3>
                    
                    <p className="text-xs text-slate-500">
                      Color: <strong className="text-slate-800 font-semibold">{item.selectedColor}</strong> · SKU: {item.sku}
                    </p>

                    {/* Lens package pill */}
                    {item.selectedLens ? (
                      <div className="inline-block text-[11px] font-semibold text-teal-800 bg-teal-50 px-2.5 py-1 rounded-lg border border-teal-100 mt-1">
                        + Lens: {item.selectedLens.name} (+₹{item.selectedLens.price})
                      </div>
                    ) : (
                      <div className="text-[11px] text-slate-400 mt-1">
                        Frame Only (Non-prescription demo lenses)
                      </div>
                    )}

                    {/* Reading power */}
                    {item.readingPower && (
                      <p className="text-xs text-teal-700 font-semibold mt-1">
                        Selected Power: {item.readingPower}
                      </p>
                    )}

                    {/* Attached prescription info */}
                    {item.prescriptionFile && (
                      <p className="text-[11px] text-emerald-700 font-medium">
                        ✓ Prescription Attached: {item.prescriptionFile.name}
                      </p>
                    )}
                  </div>
                </div>

                {/* Controls & Price */}
                <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-4 pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                  <div className="text-left sm:text-right">
                    <span className="text-lg font-extrabold text-slate-900 block">
                      ₹{itemTotal.toLocaleString('en-IN')}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      ₹{unitPrice.toLocaleString('en-IN')} / pair
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50 overflow-hidden shadow-inner">
                      <button 
                        onClick={() => updateCartQty(item.cartItemId, item.qty - 1)}
                        className="p-1.5 px-3 hover:bg-slate-200 text-slate-600 transition"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-3 text-xs font-bold text-slate-900">{item.qty}</span>
                      <button 
                        onClick={() => updateCartQty(item.cartItemId, item.qty + 1)}
                        className="p-1.5 px-3 hover:bg-slate-200 text-slate-600 transition"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <button 
                      onClick={() => removeFromCart(item.cartItemId)}
                      className="p-2 text-slate-400 hover:text-rose-600 transition rounded-xl hover:bg-rose-50"
                      title="Remove from Cart"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          <button
            onClick={() => setCurrentRoute({ name: 'shop' })}
            className="inline-flex items-center gap-2 text-xs font-bold text-teal-700 hover:text-teal-900 p-2"
          >
            <ArrowLeft className="w-4 h-4" /> Continue Shopping
          </button>
        </div>

        {/* Right: Coupon & Order Summary (4 cols) */}
        <div className="lg:col-span-4 space-y-6 sticky top-24">
          
          {/* Coupon Code Card */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm space-y-3">
            <h3 className="font-display font-bold text-slate-900 text-sm flex items-center gap-2">
              <Tag className="w-4 h-4 text-teal-700" /> Apply Promo Code / Coupon
            </h3>

            {appliedCoupon ? (
              <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 flex items-center justify-between">
                <div>
                  <span className="text-xs font-extrabold text-emerald-900 font-mono">
                    {appliedCoupon} APPLIED
                  </span>
                  <p className="text-[11px] text-emerald-700 mt-0.5">
                    {COUPONS[appliedCoupon]?.label} (-₹{discount})
                  </p>
                </div>
                <button
                  onClick={removeCoupon}
                  className="text-xs font-bold text-rose-600 hover:underline"
                >
                  Remove
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. FLAT200 or LENS10"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                  className="flex-1 bg-slate-50 border border-slate-200 text-xs font-semibold p-2.5 px-3 rounded-xl outline-none uppercase placeholder:normal-case focus:border-teal-600"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-slate-900 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow transition"
                >
                  Apply
                </button>
              </form>
            )}

            {couponError && (
              <p className="text-xs text-rose-600 font-medium">{couponError}</p>
            )}

            {/* Quick coupon tags */}
            <div className="pt-2 flex flex-wrap gap-1.5">
              <button
                onClick={() => applyCoupon('FLAT200')}
                className="text-[10px] font-bold bg-slate-100 hover:bg-teal-50 hover:text-teal-800 text-slate-700 px-2.5 py-1 rounded-lg border border-slate-200 transition"
              >
                FLAT200 (₹200 Off)
              </button>
              <button
                onClick={() => applyCoupon('LENS10')}
                className="text-[10px] font-bold bg-slate-100 hover:bg-teal-50 hover:text-teal-800 text-slate-700 px-2.5 py-1 rounded-lg border border-slate-200 transition"
              >
                LENS10 (10% Off)
              </button>
            </div>
          </div>

          {/* Order Summary Card */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
            <h3 className="font-display font-bold text-slate-900 text-base">
              Order Summary
            </h3>

            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between text-slate-600">
                <span>Subtotal</span>
                <span className="font-semibold text-slate-900">₹{subtotal.toLocaleString('en-IN')}</span>
              </div>

              {discount > 0 && (
                <div className="flex items-center justify-between text-emerald-700 font-semibold">
                  <span>Coupon Discount</span>
                  <span>-₹{discount.toLocaleString('en-IN')}</span>
                </div>
              )}

              <div className="flex items-center justify-between text-slate-600">
                <span>Shipping & Handling</span>
                <span className="font-semibold">
                  {shipping === 0 ? <span className="text-emerald-700 font-bold">FREE</span> : `₹${shipping}`}
                </span>
              </div>

              <div className="flex items-center justify-between text-slate-600">
                <span>GST (Integrated 12%)</span>
                <span className="font-semibold text-slate-900">₹{gst.toLocaleString('en-IN')}</span>
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
                <span className="font-bold text-slate-900 text-sm">Grand Total</span>
                <span className="font-display font-extrabold text-2xl text-teal-800">
                  ₹{grandTotal.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <button
              onClick={() => setCurrentRoute({ name: 'checkout' })}
              className="w-full py-4 bg-teal-700 hover:bg-teal-800 text-white font-bold text-sm rounded-2xl shadow-lg shadow-teal-700/20 transition flex items-center justify-center gap-2 active:scale-95"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="pt-2 text-center space-y-1 text-[11px] text-slate-400">
              <p className="flex items-center justify-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>GST Tax Invoice · Safe & Tracked Pan-India Delivery</span>
              </p>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
