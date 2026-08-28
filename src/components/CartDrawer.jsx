import React from 'react';
import { 
  X, 
  ShoppingBag, 
  Trash2, 
  Plus, 
  Minus, 
  ArrowRight, 
  ShieldCheck, 
  Sparkles, 
  Tag 
} from 'lucide-react';
import { useShop } from '../context/ShopContext';

export default function CartDrawer({ onProceedToCheckout, onOpenCartPage }) {
  const { 
    cart, 
    cartDrawerOpen, 
    setCartDrawerOpen, 
    updateCartQty, 
    removeFromCart, 
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

  if (!cartDrawerOpen) return null;

  const freeShippingThreshold = 499;
  const progressPercent = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-in fade-in duration-200">
      {/* Backdrop */}
      <div 
        onClick={() => setCartDrawerOpen(false)}
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          
          {/* Drawer Header */}
          <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-teal-700" />
              <h2 className="font-display font-bold text-slate-900 text-lg">
                Your Shopping Bag ({cart.reduce((a, b) => a + b.qty, 0)})
              </h2>
            </div>
            <button 
              onClick={() => setCartDrawerOpen(false)}
              className="p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Indicator */}
          <div className="bg-teal-50 px-5 py-3 border-b border-teal-100">
            {subtotal >= freeShippingThreshold ? (
              <p className="text-xs font-bold text-teal-800 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-teal-600" /> 🎉 Congratulations! You've unlocked FREE Shipping across India!
              </p>
            ) : (
              <div>
                <p className="text-xs text-teal-900 font-medium">
                  Add <strong className="font-bold text-teal-950">₹{freeShippingThreshold - subtotal}</strong> more to qualify for <strong>FREE Shipping</strong>!
                </p>
                <div className="w-full bg-teal-200/60 h-1.5 rounded-full mt-2 overflow-hidden">
                  <div 
                    className="bg-teal-700 h-full rounded-full transition-all duration-300"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 divide-y divide-slate-100 space-y-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
                <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4 text-slate-300">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="font-display font-bold text-slate-800 text-lg">Your Cart is Empty</h3>
                <p className="text-xs text-slate-500 max-w-xs mt-1">
                  Discover our premium frames, blue-cut computer lenses, and sunglasses to get started.
                </p>
                <button
                  onClick={() => {
                    setCartDrawerOpen(false);
                    onOpenCartPage();
                  }}
                  className="mt-6 px-6 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-teal-700 transition"
                >
                  Explore Collection
                </button>
              </div>
            ) : (
              cart.map((item) => {
                const itemUnitPrice = item.price + (item.selectedLens?.price || 0);
                const itemTotal = itemUnitPrice * item.qty;

                return (
                  <div key={item.cartItemId} className="pt-4 first:pt-0 flex gap-3.5 items-start">
                    <img 
                      src={item.img} 
                      alt={item.name} 
                      className="w-20 h-20 rounded-xl object-cover border border-slate-100 bg-slate-50 shrink-0" 
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-1">
                        <h4 className="font-bold text-slate-900 text-sm truncate">{item.name}</h4>
                        <button 
                          onClick={() => removeFromCart(item.cartItemId)}
                          className="text-slate-400 hover:text-rose-600 transition p-1"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Item details */}
                      <p className="text-xs text-slate-500 mt-0.5">
                        Color: <span className="text-slate-700 font-medium">{item.selectedColor}</span>
                      </p>
                      
                      {item.selectedLens ? (
                        <p className="text-[11px] font-semibold text-teal-800 bg-teal-50 px-2 py-0.5 rounded-md inline-block mt-1">
                          + {item.selectedLens.name} (+₹{item.selectedLens.price})
                        </p>
                      ) : (
                        <p className="text-[11px] text-slate-400 mt-0.5">Frame Only (Demo Lenses)</p>
                      )}

                      {item.readingPower && (
                        <p className="text-[11px] text-teal-700 font-medium">Power: {item.readingPower}</p>
                      )}

                      {/* Qty and price line */}
                      <div className="mt-3 flex items-center justify-between">
                        <div className="flex items-center border border-slate-200 rounded-lg bg-slate-50 overflow-hidden">
                          <button 
                            onClick={() => updateCartQty(item.cartItemId, item.qty - 1)}
                            className="p-1 px-2 hover:bg-slate-200 text-slate-600 transition"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2.5 text-xs font-bold text-slate-800">{item.qty}</span>
                          <button 
                            onClick={() => updateCartQty(item.cartItemId, item.qty + 1)}
                            className="p-1 px-2 hover:bg-slate-200 text-slate-600 transition"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <div className="text-right">
                          <span className="font-extrabold text-sm text-slate-900">
                            ₹{itemTotal.toLocaleString('en-IN')}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Drawer Footer / Summary & Checkout */}
          {cart.length > 0 && (
            <div className="p-5 border-t border-slate-100 bg-slate-50 space-y-3.5">
              
              {/* Price Breakdown */}
              <div className="space-y-1.5 text-xs">
                <div className="flex items-center justify-between text-slate-600">
                  <span>Subtotal</span>
                  <span className="font-semibold text-slate-900">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>

                {discount > 0 && (
                  <div className="flex items-center justify-between text-emerald-700 font-medium">
                    <span>Discount ({appliedCoupon})</span>
                    <span>-₹{discount.toLocaleString('en-IN')}</span>
                  </div>
                )}

                <div className="flex items-center justify-between text-slate-600">
                  <span>Shipping</span>
                  <span className="font-semibold">{shipping === 0 ? <span className="text-emerald-700">FREE</span> : `₹${shipping}`}</span>
                </div>

                <div className="flex items-center justify-between text-slate-600">
                  <span>Estimated GST (12%)</span>
                  <span className="font-semibold text-slate-900">₹{gst.toLocaleString('en-IN')}</span>
                </div>

                <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-sm">
                  <span className="font-bold text-slate-900">Grand Total</span>
                  <span className="font-display font-extrabold text-lg text-teal-800">
                    ₹{grandTotal.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Checkout CTA */}
              <div className="pt-2 flex flex-col gap-2">
                <button
                  onClick={() => {
                    setCartDrawerOpen(false);
                    onProceedToCheckout();
                  }}
                  className="w-full py-3.5 bg-teal-700 hover:bg-teal-800 text-white font-bold text-sm rounded-2xl shadow-lg shadow-teal-700/20 transition flex items-center justify-center gap-2 active:scale-95"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => {
                    setCartDrawerOpen(false);
                    onOpenCartPage();
                  }}
                  className="w-full py-2.5 text-center text-xs font-bold text-slate-600 hover:text-teal-800 transition"
                >
                  View Full Cart & Apply Coupons
                </button>
              </div>

              <p className="text-[10px] text-center text-slate-400 flex items-center justify-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Secure Checkout · GST Tax Invoice Included
              </p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
