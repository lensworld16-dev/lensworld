import React, { useState } from 'react';
import { 
  Search, 
  Truck, 
  CheckCircle, 
  Clock, 
  Package, 
  Printer, 
  MessageCircle, 
  MapPin, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { printGSTInvoice } from '../utils/invoiceGenerator';
import { getWhatsAppUrl, STORE_PHONE } from '../utils/whatsappHelper';

export default function TrackOrderPage({ setCurrentRoute }) {
  const { orders } = useShop();

  const [query, setQuery] = useState('');
  const [searchedOrder, setSearchedOrder] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    const cleanQ = query.trim().replace(/^#/, '').toLowerCase();
    if (!cleanQ) return;

    setHasSearched(true);
    const found = orders.find(o => 
      o.id.toLowerCase().includes(cleanQ) || 
      o.customer?.phone?.replace(/\D/g, '').includes(cleanQ.replace(/\D/g, ''))
    );
    setSearchedOrder(found || null);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-10">
      
      {/* Header */}
      <div className="text-center max-w-xl mx-auto space-y-3">
        <span className="text-xs font-extrabold uppercase tracking-widest text-teal-700 bg-teal-50 px-3 py-1 rounded-full border border-teal-100">
          Live Dispatch & Optical Status
        </span>
        <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-slate-900">
          Track Your Eyewear Order
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Enter your Order ID (e.g. <strong>LSW-9281</strong>) or your 10-digit mobile number to view live lab cutting, fitting, and courier dispatch stages.
        </p>
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="max-w-xl mx-auto bg-white p-2 rounded-2xl border border-slate-300 shadow-md flex gap-2">
        <input
          type="text"
          placeholder="Enter Order ID (e.g. LSW-9281) or Phone..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 px-4 py-3 text-xs sm:text-sm font-semibold outline-none text-slate-800 placeholder-slate-400"
        />
        <button
          type="submit"
          className="px-6 py-3 bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs rounded-xl shadow transition flex items-center gap-1.5"
        >
          <Search className="w-4 h-4" /> Track Order
        </button>
      </form>

      {/* Result Card */}
      {hasSearched && (
        searchedOrder ? (
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-lg space-y-6 animate-in fade-in duration-200">
            
            {/* Header Status */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-bold uppercase text-slate-400">Order Reference</span>
                <h3 className="font-display font-bold text-slate-900 text-xl">Order #{searchedOrder.id}</h3>
                <p className="text-xs text-slate-500">
                  Placed on {new Date(searchedOrder.createdAt).toLocaleDateString('en-IN', { month: 'long', day: 'numeric', year: 'numeric' })}
                </p>
              </div>

              <div className="self-start sm:self-auto text-right">
                <span className="text-xs font-bold bg-teal-50 text-teal-800 px-3.5 py-1.5 rounded-full border border-teal-200 inline-block">
                  Status: {searchedOrder.status}
                </span>
              </div>
            </div>

            {/* Stages Tracker */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-xs">
              <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200">
                <CheckCircle className="w-5 h-5 text-emerald-600 mx-auto mb-1" />
                <strong className="block text-emerald-950">1. Placed</strong>
                <span className="text-[10px] text-emerald-700">Payment {searchedOrder.paymentStatus || 'Confirmed'}</span>
              </div>

              <div className={`p-3 rounded-2xl border ${
                ['Prescription Verification', 'Processing', 'Packed', 'Shipped', 'Delivered'].includes(searchedOrder.status)
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                  : 'bg-slate-50 border-slate-200 opacity-50'
              }`}>
                <Clock className="w-5 h-5 mx-auto mb-1 text-teal-700" />
                <strong className="block">2. Lab Verification</strong>
                <span className="text-[10px] text-slate-500">Doctor Power Check</span>
              </div>

              <div className={`p-3 rounded-2xl border ${
                ['Packed', 'Shipped', 'Delivered'].includes(searchedOrder.status)
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                  : 'bg-slate-50 border-slate-200 opacity-50'
              }`}>
                <Package className="w-5 h-5 mx-auto mb-1 text-teal-700" />
                <strong className="block">3. Packed & Fitted</strong>
                <span className="text-[10px] text-slate-500">QC Approved</span>
              </div>

              <div className={`p-3 rounded-2xl border ${
                searchedOrder.status === 'Delivered'
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                  : searchedOrder.status === 'Shipped'
                    ? 'bg-amber-50 border-amber-200 text-amber-950'
                    : 'bg-slate-50 border-slate-200 opacity-50'
              }`}>
                <Truck className="w-5 h-5 mx-auto mb-1 text-teal-700" />
                <strong className="block">4. Dispatch & Delivery</strong>
                <span className="text-[10px] text-slate-500">{searchedOrder.status === 'Delivered' ? 'Delivered' : 'In Transit'}</span>
              </div>
            </div>

            {/* Customer & Items Details */}
            <div className="grid sm:grid-cols-2 gap-4 text-xs bg-slate-50 p-4 rounded-2xl border">
              <div>
                <span className="font-bold text-slate-900 block mb-1">Destination:</span>
                <p>{searchedOrder.customer?.name}</p>
                <p>{searchedOrder.customer?.address}, {searchedOrder.customer?.city}</p>
                <p>{searchedOrder.customer?.state} - {searchedOrder.customer?.pincode}</p>
              </div>
              <div className="space-y-1">
                <span className="font-bold text-slate-900 block mb-1">Order Summary:</span>
                <p>Items: <strong>{searchedOrder.items?.length} item(s)</strong></p>
                <p>Total Paid / Payable: <strong>₹{searchedOrder.total?.toLocaleString('en-IN')}</strong></p>
                <p>Payment Mode: <strong>{searchedOrder.paymentMethod}</strong></p>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
              <button
                onClick={() => printGSTInvoice(searchedOrder)}
                className="px-5 py-2.5 bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs rounded-xl shadow transition flex items-center gap-1.5"
              >
                <Printer className="w-4 h-4" /> Download Official GST Tax Invoice
              </button>

              <a
                href={getWhatsAppUrl(`Hello LENS S WORLD, I am checking tracking update for order #${searchedOrder.id}.`)}
                target="_blank"
                rel="noreferrer"
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow transition flex items-center gap-1.5"
              >
                <MessageCircle className="w-4 h-4" /> WhatsApp Support
              </a>
            </div>

          </div>
        ) : (
          <div className="p-8 text-center bg-white rounded-3xl border border-slate-200 space-y-2">
            <h3 className="font-display font-bold text-slate-900 text-base">No Order Found</h3>
            <p className="text-xs text-slate-500">
              We couldn't find an order matching "{query}". Please verify your Order ID or contact support on WhatsApp.
            </p>
          </div>
        )
      )}

    </div>
  );
}
