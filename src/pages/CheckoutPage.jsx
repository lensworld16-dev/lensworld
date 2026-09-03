import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Truck, 
  CreditCard, 
  Banknote, 
  QrCode, 
  MessageCircle, 
  Upload, 
  Check, 
  Lock, 
  ArrowLeft, 
  AlertCircle,
  Loader2,
  Sparkles
} from 'lucide-react';
import { load } from '@cashfreepayments/cashfree-js';
import { useShop } from '../context/ShopContext';
import { getWhatsAppUrl, STORE_PHONE } from '../utils/whatsappHelper';
import confetti from 'canvas-confetti';

export default function CheckoutPage({ setCurrentRoute, setCompletedOrder }) {
  const { 
    cart, 
    subtotal, 
    discount, 
    shipping, 
    gst, 
    grandTotal, 
    appliedCoupon, 
    placeOrder, 
    showToast 
  } = useShop();

  // Form State
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    pincode: '',
    city: '',
    state: '',
    address: '',
    landmark: ''
  });

  const [paymentMethod, setPaymentMethod] = useState('UPI'); // 'UPI' | 'COD' | 'Card'
  const [prescriptionMethod, setPrescriptionMethod] = useState('upload'); // 'upload' | 'later'
  const [prescriptionFile, setPrescriptionFile] = useState(null);
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  // Check if any cart item requires prescription
  const hasPrescriptionItems = cart.some(item => item.selectedLens || item.type === 'contact-lenses');

  const handlePincodeChange = (pin) => {
    setFormData(prev => ({ ...prev, pincode: pin }));
    if (pin.length === 6) {
      // Basic auto-fill simulation for Indian PINs
      if (pin.startsWith('11') || pin.startsWith('12')) {
        setFormData(prev => ({ ...prev, city: 'Delhi / NCR', state: 'Delhi' }));
      } else if (pin.startsWith('40') || pin.startsWith('41')) {
        setFormData(prev => ({ ...prev, city: 'Mumbai / Pune', state: 'Maharashtra' }));
      } else if (pin.startsWith('56')) {
        setFormData(prev => ({ ...prev, city: 'Bengaluru', state: 'Karnataka' }));
      } else if (pin.startsWith('70')) {
        setFormData(prev => ({ ...prev, city: 'Kolkata', state: 'West Bengal' }));
      } else if (pin.startsWith('60')) {
        setFormData(prev => ({ ...prev, city: 'Chennai', state: 'Tamil Nadu' }));
      } else if (pin.startsWith('50')) {
        setFormData(prev => ({ ...prev, city: 'Hyderabad', state: 'Telangana' }));
      }
    }
  };

  const validate = () => {
    const errs = {};
    if (!formData.fullName.trim()) errs.fullName = 'Please enter your full name';
    if (!formData.phone.trim() || formData.phone.length < 10) errs.phone = 'Enter a valid 10-digit mobile number';
    if (!formData.email.trim() || !formData.email.includes('@')) errs.email = 'Enter a valid email address';
    if (!formData.pincode.trim() || formData.pincode.length !== 6) errs.pincode = 'Enter a valid 6-digit PIN code';
    if (!formData.address.trim()) errs.address = 'Please provide your full delivery address';
    if (!formData.city.trim()) errs.city = 'Please specify city';
    if (!formData.state.trim()) errs.state = 'Please specify state';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const finalizeOrder = async (extraOrderData = {}) => {
    const order = await placeOrder({
      customer: {
        name: formData.fullName,
        phone: formData.phone.startsWith('+91') ? formData.phone : `+91 ${formData.phone}`,
        email: formData.email,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode,
        landmark: formData.landmark
      },
      paymentMethod: extraOrderData.paymentMethod || (paymentMethod === 'COD' ? 'Cash on Delivery' : 'Cashfree Online'),
      paymentStatus: extraOrderData.paymentStatus || (paymentMethod === 'COD' ? 'Pending' : 'Paid'),
      prescriptionMethod: hasPrescriptionItems ? prescriptionMethod : null,
      prescriptionFile: prescriptionFile,
      notes,
      ...extraOrderData
    });

    try {
      confetti({
        particleCount: 120,
        spread: 75,
        origin: { y: 0.6 }
      });
    } catch (e) {}

    setIsSubmitting(false);
    setStatusMessage('');
    setCompletedOrder(order);
    setCurrentRoute({ name: 'order-success', orderId: order.id });
  };

  const handlePlaceOrder = async (e) => {
    if (e) e.preventDefault();
    if (!validate()) {
      showToast("Please fill all required delivery details.", "error");
      return;
    }

    // COD Flow
    if (paymentMethod === 'COD') {
      setIsSubmitting(true);
      setStatusMessage('Placing Cash on Delivery order...');
      setTimeout(() => {
        finalizeOrder({
          paymentMethod: 'Cash on Delivery',
          paymentStatus: 'Pending'
        });
      }, 500);
      return;
    }

    // Cashfree Online Payment Flow (UPI / Cards / NetBanking)
    setIsSubmitting(true);
    setStatusMessage('Connecting to Cashfree Payments...');

    try {
      // 1. Create Cashfree Order on Server
      const tempOrderId = `LSW_${Date.now()}`;
      const customerObj = {
        name: formData.fullName,
        phone: formData.phone.startsWith('+91') ? formData.phone : `+91 ${formData.phone}`,
        email: formData.email,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode,
        landmark: formData.landmark
      };

      const res = await fetch('/api/create-cashfree-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: tempOrderId,
          orderAmount: grandTotal,
          customerName: formData.fullName,
          customerPhone: formData.phone,
          customerEmail: formData.email,
          customer: customerObj,
          items: cart,
          subtotal,
          discount,
          couponApplied,
          shipping,
          gst,
          total: grandTotal,
          paymentMethod: paymentMethod === 'UPI' ? 'Cashfree UPI' : 'Cashfree Card/Netbanking',
          prescriptionMethod: hasPrescriptionItems ? prescriptionMethod : null,
          prescriptionFile,
          notes
        })
      });

      const orderData = await res.json();

      if (!res.ok || !orderData.paymentSessionId) {
        throw new Error(orderData.error || 'Failed to initialize Cashfree payment session');
      }

      setStatusMessage('Opening Cashfree Payment Gateway...');

      // 2. Load Cashfree JS SDK
      const cashfreeMode = import.meta.env.VITE_CASHFREE_MODE || 'sandbox';
      const cashfree = await load({
        mode: cashfreeMode
      });

      // 3. Launch Checkout Modal
      const checkoutOptions = {
        paymentSessionId: orderData.paymentSessionId,
        redirectTarget: '_modal'
      };

      cashfree.checkout(checkoutOptions).then(async (result) => {
        if (result.error) {
          console.warn('Cashfree payment error/closed:', result.error);
          setIsSubmitting(false);
          setStatusMessage('');
          showToast(result.error.message || 'Payment was cancelled or failed. Please try again.', 'error');
          return;
        }

        if (result.paymentDetails) {
          console.log('Cashfree paymentDetails:', result.paymentDetails);
          setStatusMessage('Verifying payment confirmation...');

          // Finalize order in state and DB
          await finalizeOrder({
            paymentMethod: paymentMethod === 'UPI' ? 'Cashfree UPI' : 'Cashfree Card/Netbanking',
            paymentStatus: 'Paid',
            cfOrderId: orderData.orderId,
            cfPaymentSessionId: orderData.paymentSessionId
          });
          showToast('Payment successful! Your order has been placed.', 'success');
        } else {
          // If modal closed without error or user redirected
          setIsSubmitting(false);
          setStatusMessage('');
        }
      }).catch((err) => {
        console.error('Checkout error:', err);
        setIsSubmitting(false);
        setStatusMessage('');
        showToast('Payment process interrupted. Please try again.', 'error');
      });

    } catch (err) {
      console.error('Cashfree init error:', err);
      setIsSubmitting(false);
      setStatusMessage('');
      showToast(err.message || 'Could not connect to Cashfree payment gateway.', 'error');
    }
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="font-display font-bold text-2xl">Your Cart is Empty</h2>
        <p className="text-xs text-slate-500">Please add items to cart before proceeding to checkout.</p>
        <button
          onClick={() => setCurrentRoute({ name: 'shop' })}
          className="px-6 py-2.5 bg-teal-700 text-white rounded-xl text-xs font-bold"
        >
          Return to Shop
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      
      {/* Back button */}
      <button
        onClick={() => setCurrentRoute({ name: 'cart' })}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-teal-700 transition"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Cart
      </button>

      <div className="grid lg:grid-cols-12 gap-10 items-start">
        
        {/* Left Form: Delivery & Payment (7 cols) */}
        <div className="lg:col-span-7 space-y-8">
          
          {/* Section 1: Customer & Address */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-5">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
              <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold text-sm">
                1
              </div>
              <div>
                <h2 className="font-display font-bold text-slate-900 text-lg">
                  Shipping & Delivery Address
                </h2>
                <p className="text-xs text-slate-500">Enter where you'd like your eyewear delivered</p>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4 text-xs">
              
              {/* Full Name */}
              <div className="sm:col-span-2 space-y-1">
                <label className="font-bold text-slate-700 block">Full Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Rahul Sharma"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className={`w-full p-3 bg-slate-50 border rounded-xl outline-none font-medium ${errors.fullName ? 'border-rose-400 bg-rose-50/30' : 'border-slate-200 focus:border-teal-600'}`}
                />
                {errors.fullName && <p className="text-rose-600 text-[11px]">{errors.fullName}</p>}
              </div>

              {/* Phone */}
              <div className="space-y-1">
                <label className="font-bold text-slate-700 block">10-Digit Mobile Number *</label>
                <input
                  type="tel"
                  maxLength={10}
                  placeholder="e.g. 9820123456"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, '') })}
                  className={`w-full p-3 bg-slate-50 border rounded-xl outline-none font-medium ${errors.phone ? 'border-rose-400 bg-rose-50/30' : 'border-slate-200 focus:border-teal-600'}`}
                />
                {errors.phone && <p className="text-rose-600 text-[11px]">{errors.phone}</p>}
              </div>

              {/* Email */}
              <div className="space-y-1">
                <label className="font-bold text-slate-700 block">Email Address (For GST Invoice) *</label>
                <input
                  type="email"
                  placeholder="e.g. rahul@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className={`w-full p-3 bg-slate-50 border rounded-xl outline-none font-medium ${errors.email ? 'border-rose-400 bg-rose-50/30' : 'border-slate-200 focus:border-teal-600'}`}
                />
                {errors.email && <p className="text-rose-600 text-[11px]">{errors.email}</p>}
              </div>

              {/* Pincode */}
              <div className="space-y-1">
                <label className="font-bold text-slate-700 block">PIN Code (6 Digits) *</label>
                <input
                  type="text"
                  maxLength={6}
                  placeholder="e.g. 400053"
                  value={formData.pincode}
                  onChange={(e) => handlePincodeChange(e.target.value.replace(/\D/g, ''))}
                  className={`w-full p-3 bg-slate-50 border rounded-xl outline-none font-medium ${errors.pincode ? 'border-rose-400 bg-rose-50/30' : 'border-slate-200 focus:border-teal-600'}`}
                />
                {errors.pincode && <p className="text-rose-600 text-[11px]">{errors.pincode}</p>}
              </div>

              {/* City */}
              <div className="space-y-1">
                <label className="font-bold text-slate-700 block">City *</label>
                <input
                  type="text"
                  placeholder="e.g. Mumbai"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className={`w-full p-3 bg-slate-50 border rounded-xl outline-none font-medium ${errors.city ? 'border-rose-400' : 'border-slate-200 focus:border-teal-600'}`}
                />
                {errors.city && <p className="text-rose-600 text-[11px]">{errors.city}</p>}
              </div>

              {/* State */}
              <div className="space-y-1">
                <label className="font-bold text-slate-700 block">State *</label>
                <input
                  type="text"
                  placeholder="e.g. Maharashtra"
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  className={`w-full p-3 bg-slate-50 border rounded-xl outline-none font-medium ${errors.state ? 'border-rose-400' : 'border-slate-200 focus:border-teal-600'}`}
                />
                {errors.state && <p className="text-rose-600 text-[11px]">{errors.state}</p>}
              </div>

              {/* Address */}
              <div className="sm:col-span-2 space-y-1">
                <label className="font-bold text-slate-700 block">Flat / House No., Building, Street *</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Flat 402, Sunshine Heights, Main Road"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className={`w-full p-3 bg-slate-50 border rounded-xl outline-none font-medium ${errors.address ? 'border-rose-400' : 'border-slate-200 focus:border-teal-600'}`}
                />
                {errors.address && <p className="text-rose-600 text-[11px]">{errors.address}</p>}
              </div>

            </div>
          </div>

          {/* Section 2: Prescription Confirmation (If applicable) */}
          {hasPrescriptionItems && (
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
              <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold text-sm">
                  2
                </div>
                <div>
                  <h2 className="font-display font-bold text-slate-900 text-lg">
                    Prescription Confirmation
                  </h2>
                  <p className="text-xs text-slate-500">How would you like to verify your eye power?</p>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-3 text-xs">
                <button
                  type="button"
                  onClick={() => setPrescriptionMethod('upload')}
                  className={`p-4 rounded-2xl border-2 text-left transition flex items-start gap-3 ${
                    prescriptionMethod === 'upload' ? 'border-teal-700 bg-teal-50/40 shadow-sm' : 'border-slate-200 bg-white'
                  }`}
                >
                  <Upload className="w-5 h-5 text-teal-700 shrink-0" />
                  <div>
                    <span className="font-bold text-slate-900 block">Upload Prescription Slip</span>
                    <span className="text-[11px] text-slate-500">Camera Photo or Doctor's PDF</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setPrescriptionMethod('later')}
                  className={`p-4 rounded-2xl border-2 text-left transition flex items-start gap-3 ${
                    prescriptionMethod === 'later' ? 'border-teal-700 bg-teal-50/40 shadow-sm' : 'border-slate-200 bg-white'
                  }`}
                >
                  <MessageCircle className="w-5 h-5 text-emerald-600 shrink-0" />
                  <div>
                    <span className="font-bold text-slate-900 block">Send Later via WhatsApp</span>
                    <span className="text-[11px] text-slate-500">Message us after placing order</span>
                  </div>
                </button>
              </div>

              {prescriptionMethod === 'upload' && (
                <div className="border-2 border-dashed border-slate-300 rounded-2xl p-4 text-center bg-slate-50">
                  <input
                    type="file"
                    id="checkout-rx-file"
                    accept="image/*,application/pdf"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) setPrescriptionFile({ name: f.name, size: `${(f.size / (1024*1024)).toFixed(2)} MB` });
                    }}
                    className="hidden"
                  />
                  <label htmlFor="checkout-rx-file" className="cursor-pointer block">
                    <Upload className="w-6 h-6 text-teal-700 mx-auto mb-1" />
                    <span className="text-xs font-bold text-slate-800 block">
                      {prescriptionFile ? prescriptionFile.name : "Click to select prescription image/document"}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {prescriptionFile ? `${prescriptionFile.size} · Uploaded` : "Our optometrists will verify before cutting lenses"}
                    </span>
                  </label>
                </div>
              )}
            </div>
          )}

          {/* Section 3: Payment Method */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-5">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
              <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold text-sm">
                {hasPrescriptionItems ? '3' : '2'}
              </div>
              <div>
                <h2 className="font-display font-bold text-slate-900 text-lg">
                  Select Payment Method
                </h2>
                <p className="text-xs text-slate-500">100% Secure & Encrypted by Cashfree Payments (RBI Authorized)</p>
              </div>
            </div>

            <div className="space-y-3">
              {/* Option 1: Cashfree UPI */}
              <label 
                onClick={() => setPaymentMethod('UPI')}
                className={`p-4 rounded-2xl border-2 cursor-pointer transition flex items-center justify-between ${
                  paymentMethod === 'UPI' ? 'border-teal-700 bg-teal-50/40 shadow-sm' : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center">
                    <QrCode className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs sm:text-sm text-slate-900 block">
                        ⚡ UPI / QR Code
                      </span>
                      <span className="text-[10px] font-extrabold text-teal-700 bg-teal-100 px-2 py-0.5 rounded-full">
                        Fastest
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-500">GPay, PhonePe, Paytm, BHIM</span>
                  </div>
                </div>
              </label>

              {/* Option 2: Cashfree Cards & NetBanking */}
              <label 
                onClick={() => setPaymentMethod('Card')}
                className={`p-4 rounded-2xl border-2 cursor-pointer transition flex items-center justify-between ${
                  paymentMethod === 'Card' ? 'border-teal-700 bg-teal-50/40 shadow-sm' : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-bold text-xs sm:text-sm text-slate-900 block">
                      💳 Card & NetBanking
                    </span>
                    <span className="text-[11px] text-slate-500">Visa, Mastercard, RuPay & Banks</span>
                  </div>
                </div>
              </label>

              {/* Option 3: Cash on Delivery */}
              <label 
                onClick={() => setPaymentMethod('COD')}
                className={`p-4 rounded-2xl border-2 cursor-pointer transition flex items-center justify-between ${
                  paymentMethod === 'COD' ? 'border-teal-700 bg-teal-50/40 shadow-sm' : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
                    <Banknote className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-bold text-xs sm:text-sm text-slate-900 block">
                      💵 Cash on Delivery (COD)
                    </span>
                    <span className="text-[11px] text-slate-500">Pay when parcel arrives</span>
                  </div>
                </div>
              </label>
            </div>

            {/* Special Instructions */}
            <div className="pt-2">
              <label className="text-xs font-bold text-slate-700 block mb-1.5">
                Special Delivery / Power Instructions (Optional):
              </label>
              <textarea
                rows={2}
                placeholder="e.g. Call before delivery, add blue cut certificate, urgent dispatch..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-teal-600"
              />
            </div>
          </div>

        </div>

        {/* Right: Side Order Summary (5 cols) */}
        <div className="lg:col-span-5 space-y-6 sticky top-24">
          
          <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/80 shadow-lg space-y-5">
            <h3 className="font-display font-bold text-slate-900 text-lg pb-3 border-b border-slate-100">
              Order Details ({cart.reduce((a, b) => a + b.qty, 0)} Items)
            </h3>

            {/* Mini Items Scroll */}
            <div className="max-h-60 overflow-y-auto space-y-3 divide-y divide-slate-100 pr-1">
              {cart.map(item => {
                const unitPrice = item.price + (item.selectedLens?.price || 0);
                return (
                  <div key={item.cartItemId} className="pt-3 first:pt-0 flex items-center gap-3 text-xs">
                    <img src={item.img} alt={item.name} className="w-12 h-12 rounded-xl object-cover border bg-slate-50" />
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-slate-800 truncate">{item.name} x{item.qty}</p>
                      <p className="text-[11px] text-slate-500 truncate">
                        {item.selectedColor} {item.selectedLens ? `· ${item.selectedLens.name}` : ''}
                      </p>
                    </div>
                    <span className="font-extrabold text-slate-900 shrink-0">
                      ₹{(unitPrice * item.qty).toLocaleString('en-IN')}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Price Calculations */}
            <div className="pt-3 border-t border-slate-200 space-y-2 text-xs">
              <div className="flex items-center justify-between text-slate-600">
                <span>Subtotal</span>
                <span className="font-semibold text-slate-900">₹{subtotal.toLocaleString('en-IN')}</span>
              </div>

              {discount > 0 && (
                <div className="flex items-center justify-between text-emerald-700 font-semibold">
                  <span>Coupon Discount ({appliedCoupon})</span>
                  <span>-₹{discount.toLocaleString('en-IN')}</span>
                </div>
              )}

              <div className="flex items-center justify-between text-slate-600">
                <span>Shipping</span>
                <span className="font-semibold">
                  {shipping === 0 ? <span className="text-emerald-700 font-bold">FREE</span> : `₹${shipping}`}
                </span>
              </div>

              <div className="flex items-center justify-between text-slate-600">
                <span>GST (Integrated 12%)</span>
                <span className="font-semibold text-slate-900">₹{gst.toLocaleString('en-IN')}</span>
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
                <span className="font-bold text-slate-900 text-base">Grand Total</span>
                <span className="font-display font-extrabold text-2xl text-teal-800">
                  ₹{grandTotal.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* Status Notification when submitting */}
            {statusMessage && (
              <div className="p-3 bg-teal-50 border border-teal-200 rounded-xl flex items-center gap-2 text-xs font-semibold text-teal-800 animate-pulse">
                <Loader2 className="w-4 h-4 animate-spin text-teal-700 shrink-0" />
                <span>{statusMessage}</span>
              </div>
            )}

            {/* Place Order Button */}
            <button
              onClick={handlePlaceOrder}
              disabled={isSubmitting}
              className="w-full py-4 bg-teal-700 hover:bg-teal-800 disabled:bg-slate-400 text-white font-bold text-sm rounded-2xl shadow-xl shadow-teal-700/25 transition flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>
                    {paymentMethod === 'COD'
                      ? `Place COD Order · ₹${grandTotal.toLocaleString('en-IN')}`
                      : `Pay ₹${grandTotal.toLocaleString('en-IN')} with Cashfree`}
                  </span>
                </>
              )}
            </button>

            <div className="text-[11px] text-center text-slate-500 space-y-1 pt-1">
              <p className="flex items-center justify-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Secured by Cashfree 256-bit SSL & GST Invoice Ready</span>
              </p>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
