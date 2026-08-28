import React, { useEffect } from 'react';
import { 
  CheckCircle, 
  Printer, 
  MessageCircle, 
  ShoppingBag, 
  ArrowRight, 
  ShieldCheck, 
  Truck, 
  Sparkles, 
  Calendar,
  User,
  MapPin,
  Clock
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { printGSTInvoice } from '../utils/invoiceGenerator';
import { formatOrderForWhatsApp, getWhatsAppUrl, STORE_PHONE } from '../utils/whatsappHelper';
import confetti from 'canvas-confetti';

export default function OrderSuccessPage({ orderId, completedOrder, setCurrentRoute }) {
  const { orders } = useShop();

  const order = completedOrder || orders.find(o => o.id === orderId) || orders[0];

  useEffect(() => {
    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.5 }
      });
    } catch (e) {}
  }, []);

  if (!order) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="font-display font-bold text-2xl">Order not found</h2>
        <button
          onClick={() => setCurrentRoute({ name: 'home' })}
          className="px-6 py-2 bg-teal-700 text-white rounded-xl text-xs font-bold"
        >
          Return to Home
        </button>
      </div>
    );
  }

  const handleWhatsAppAlert = () => {
    const message = formatOrderForWhatsApp(order);
    window.open(getWhatsAppUrl(message), '_blank');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-8 animate-in fade-in duration-300">
      
      {/* 1. Header Confirmation Banner */}
      <div className="bg-gradient-to-br from-teal-900 to-slate-900 text-white p-8 sm:p-10 rounded-3xl text-center space-y-4 shadow-xl relative overflow-hidden">
        <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-400/30 flex items-center justify-center mx-auto shadow-inner">
          <CheckCircle className="w-10 h-10" />
        </div>

        <span className="text-xs font-extrabold uppercase tracking-widest text-teal-300 bg-white/10 px-3 py-1 rounded-full inline-block">
          Order Placed Successfully
        </span>

        <h1 className="font-display text-3xl sm:text-4xl font-extrabold">
          Thank you for choosing LENS S WORLD!
        </h1>

        <p className="text-xs sm:text-sm text-teal-100 max-w-lg mx-auto leading-relaxed">
          Your order has been recorded in our system. A confirmation email and computerized GST Tax Invoice have been prepared for your order <strong>#{order.id}</strong>.
        </p>

        {/* Action buttons: Invoice & WhatsApp */}
        <div className="pt-4 flex flex-wrap items-center justify-center gap-3.5">
          <button
            onClick={() => printGSTInvoice(order)}
            className="px-6 py-3.5 bg-white text-slate-900 hover:bg-teal-50 font-bold text-xs rounded-2xl shadow-lg transition flex items-center gap-2 active:scale-95"
          >
            <Printer className="w-4 h-4 text-teal-700" />
            <span>Print / Download GST Tax Invoice</span>
          </button>

          <button
            onClick={handleWhatsAppAlert}
            className="px-6 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-2xl shadow-lg shadow-emerald-600/30 transition flex items-center gap-2 active:scale-95"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Send Order Copy on WhatsApp</span>
          </button>
        </div>
      </div>

      {/* 2. Order Live Status Tracker */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Tracking Reference</span>
            <h3 className="font-display font-bold text-slate-900 text-xl">Order #{order.id}</h3>
          </div>
          <span className="self-start sm:self-auto text-xs font-bold bg-teal-50 text-teal-800 px-3 py-1 rounded-full border border-teal-200">
            Current Status: {order.status}
          </span>
        </div>

        {/* Visual Progress Steps */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center text-xs">
          <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 space-y-1">
            <CheckCircle className="w-5 h-5 text-emerald-600 mx-auto" />
            <span className="font-bold text-emerald-950 block">1. Placed</span>
            <span className="text-[10px] text-emerald-700">Order Confirmed</span>
          </div>

          <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 space-y-1">
            <Clock className="w-5 h-5 text-amber-600 mx-auto" />
            <span className="font-bold text-amber-950 block">2. Prescription</span>
            <span className="text-[10px] text-amber-700">Doctor Verification</span>
          </div>

          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-1 opacity-70">
            <div className="w-5 h-5 rounded-full border-2 border-slate-400 mx-auto" />
            <span className="font-bold text-slate-700 block">3. Lab Cutting</span>
            <span className="text-[10px] text-slate-400">Fitting & Polish</span>
          </div>

          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-1 opacity-70">
            <Truck className="w-5 h-5 text-slate-400 mx-auto" />
            <span className="font-bold text-slate-700 block">4. Express Delivery</span>
            <span className="text-[10px] text-slate-400">Pan-India Courier</span>
          </div>
        </div>
      </div>

      {/* 3. Order Details & Customer Info Grid */}
      <div className="grid sm:grid-cols-2 gap-6">
        
        {/* Customer & Address Card */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-3">
          <h4 className="font-display font-bold text-slate-900 text-sm flex items-center gap-2 pb-2 border-b border-slate-100">
            <MapPin className="w-4 h-4 text-teal-700" /> Delivery Destination
          </h4>
          <div className="text-xs text-slate-600 space-y-1 leading-relaxed">
            <p className="font-bold text-slate-900">{order.customer?.name}</p>
            <p>{order.customer?.phone}</p>
            <p>{order.customer?.email}</p>
            <p className="text-slate-800 font-medium pt-1">
              {order.customer?.address}, {order.customer?.city}, {order.customer?.state} - {order.customer?.pincode}
            </p>
          </div>
        </div>

        {/* Payment & Invoice Card */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-3">
          <h4 className="font-display font-bold text-slate-900 text-sm flex items-center gap-2 pb-2 border-b border-slate-100">
            <ShieldCheck className="w-4 h-4 text-teal-700" /> Payment & Tax Summary
          </h4>
          <div className="text-xs space-y-1.5 text-slate-600">
            <div className="flex justify-between">
              <span>Payment Mode:</span>
              <span className="font-bold text-slate-900">{order.paymentMethod}</span>
            </div>
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span className="font-semibold text-slate-900">₹{order.subtotal?.toLocaleString('en-IN')}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-emerald-700">
                <span>Discount ({order.couponApplied}):</span>
                <span>-₹{order.discount?.toLocaleString('en-IN')}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>GST (12% Included):</span>
              <span className="font-semibold text-slate-900">₹{order.gst?.toLocaleString('en-IN')}</span>
            </div>
            <div className="pt-2 border-t border-slate-100 flex justify-between font-bold text-slate-900 text-sm">
              <span>Total Paid / Payable:</span>
              <span className="text-teal-800 font-extrabold">₹{order.total?.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>

      </div>

      {/* 4. Ordered Items Breakdown */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
        <h4 className="font-display font-bold text-slate-900 text-base pb-3 border-b border-slate-100">
          Items Ordered ({order.items?.length || 0})
        </h4>

        <div className="divide-y divide-slate-100">
          {(order.items || []).map((item, idx) => (
            <div key={idx} className="py-3.5 first:pt-0 flex items-center gap-4 text-xs">
              <img src={item.img} alt={item.name} className="w-16 h-16 rounded-xl object-cover border bg-slate-50" />
              <div className="flex-1 min-w-0">
                <h5 className="font-bold text-slate-900 text-sm truncate">{item.name}</h5>
                <p className="text-slate-500">Color: {item.selectedColor} · SKU: {item.sku || 'LSW-STD'}</p>
                {item.selectedLens && (
                  <p className="text-teal-700 font-semibold mt-0.5">
                    + Lens: {item.selectedLens.name} (+₹{item.selectedLens.price})
                  </p>
                )}
                {item.readingPower && (
                  <p className="text-teal-700 font-semibold">Power: {item.readingPower}</p>
                )}
              </div>
              <div className="text-right">
                <span className="font-extrabold text-sm text-slate-900">
                  ₹{((item.price + (item.selectedLens?.price || 0)) * item.qty).toLocaleString('en-IN')}
                </span>
                <span className="block text-[10px] text-slate-400">Qty: {item.qty}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Return Home & Support CTAs */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
        <button
          onClick={() => setCurrentRoute({ name: 'home' })}
          className="w-full sm:w-auto px-8 py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow transition"
        >
          Continue Shopping
        </button>

        <a
          href={getWhatsAppUrl(`Hello LENS S WORLD, I have a query about my order #${order.id}.`)}
          target="_blank"
          rel="noreferrer"
          className="w-full sm:w-auto px-6 py-3.5 bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold text-xs rounded-xl hover:bg-emerald-100 transition flex items-center justify-center gap-2"
        >
          <MessageCircle className="w-4 h-4 text-emerald-600" />
          <span>Need help? WhatsApp Store Helpline ({STORE_PHONE})</span>
        </a>
      </div>

    </div>
  );
}
