import React, { useState } from 'react';
import { 
  Star, 
  Heart, 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  Check, 
  Upload, 
  MessageCircle, 
  Sparkles, 
  ArrowLeft, 
  Share2, 
  Ruler, 
  Award,
  Layers,
  ArrowRight
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { LENS_PACKAGES, PRESCRIPTION_POWER_OPTIONS } from '../data/lensesData';
import ProductCard from '../components/ProductCard';
import { getWhatsAppUrl, STORE_PHONE } from '../utils/whatsappHelper';

export default function ProductDetailPage({ 
  productId, 
  setCurrentRoute, 
  onSelectProduct, 
  onOpenLensModal 
}) {
  const { products, wishlist, toggleWishlist, addToCart, showToast } = useShop();

  const product = products.find(p => p.id === productId) || products[0];
  const isWishlisted = wishlist.includes(product.id);

  // Gallery active image
  const gallery = product.gallery || [product.img];
  const [activeImage, setActiveImage] = useState(gallery[0] || product.img);

  // Selection states
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0] || product.color || 'Standard');
  const [frameType, setFrameType] = useState('with-lens'); // 'with-lens' | 'frame-only'
  const [selectedLens, setSelectedLens] = useState(LENS_PACKAGES[1]); // Blue Cut default
  const [selectedPower, setSelectedPower] = useState(product.powersAvailable?.[0] || "+1.50");
  const [prescriptionMethod, setPrescriptionMethod] = useState('upload'); // 'upload' | 'manual' | 'later'
  const [uploadedFile, setUploadedFile] = useState(null);

  // Manual power values
  const [manualPower, setManualPower] = useState({
    odSphere: '0.00 (Plano)',
    odCyl: '0.00',
    odAxis: '0',
    osSphere: '0.00 (Plano)',
    osCyl: '0.00',
    osAxis: '0',
    addPower: '+1.50'
  });

  const basePrice = product.price;
  const lensPrice = product.lensOptionsAvailable && frameType === 'with-lens' && selectedLens ? selectedLens.price : 0;
  const totalPrice = basePrice + lensPrice;

  // Related products
  const relatedProducts = products
    .filter(p => p.id !== product.id && (p.type === product.type || p.shape === product.shape))
    .slice(0, 3);

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile({
        name: file.name,
        size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`
      });
      showToast("Prescription file uploaded!", "success");
    }
  };

  const handleAddToCart = () => {
    addToCart(product, {
      selectedColor,
      selectedLens: product.lensOptionsAvailable && frameType === 'with-lens' ? selectedLens : null,
      readingPower: product.type === 'reading-glasses' ? selectedPower : null,
      prescriptionMethod: product.lensOptionsAvailable && frameType === 'with-lens' ? prescriptionMethod : null,
      prescriptionFile: prescriptionMethod === 'upload' ? uploadedFile : null,
      prescriptionDetails: prescriptionMethod === 'manual' ? manualPower : null,
      qty: 1
    });
  };

  const handleBuyNow = () => {
    handleAddToCart();
    setCurrentRoute({ name: 'checkout' });
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: `Check out ${product.name} at LENS S WORLD!`,
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast("Link copied to clipboard!", "success");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12">
      
      {/* Back link */}
      <button
        onClick={() => setCurrentRoute({ name: 'shop' })}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-teal-700 transition"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Collection
      </button>

      {/* Main Grid: Gallery + Customizer */}
      <div className="grid lg:grid-cols-12 gap-10 lg:gap-12 items-start">
        
        {/* Left: Gallery (5 cols) */}
        <div className="lg:col-span-6 space-y-4 sticky top-24">
          <div className="relative aspect-square w-full rounded-3xl overflow-hidden bg-slate-100 border border-slate-200 shadow-sm flex items-center justify-center">
            <img 
              src={activeImage} 
              alt={product.name} 
              className="w-full h-full object-cover object-center" 
            />

            {/* Top Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              {product.bestSeller && (
                <span className="bg-amber-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow">
                  Bestseller
                </span>
              )}
              {product.mrp > product.price && (
                <span className="bg-rose-600 text-white text-xs font-extrabold px-3 py-1 rounded-full shadow">
                  {Math.round(((product.mrp - product.price) / product.mrp) * 100)}% OFF
                </span>
              )}
            </div>

            {/* Share and Wishlist buttons */}
            <div className="absolute top-4 right-4 flex items-center gap-2">
              <button
                onClick={handleShare}
                className="w-10 h-10 rounded-full bg-white/90 hover:bg-white text-slate-600 shadow-md flex items-center justify-center transition"
                title="Share"
              >
                <Share2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => toggleWishlist(product.id)}
                className={`w-10 h-10 rounded-full flex items-center justify-center shadow-md transition ${
                  isWishlisted ? 'bg-rose-50 text-rose-600 scale-105' : 'bg-white/90 hover:bg-white text-slate-600 hover:text-rose-600'
                }`}
                title="Wishlist"
              >
                <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-600 text-rose-600' : ''}`} />
              </button>
            </div>
          </div>

          {/* Thumbnails */}
          {gallery.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-1">
              {gallery.map((imgUrl, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(imgUrl)}
                  className={`relative w-20 h-20 rounded-2xl overflow-hidden border-2 transition shrink-0 ${
                    activeImage === imgUrl ? 'border-teal-700 shadow-md ring-2 ring-teal-700/20' : 'border-slate-200 hover:border-slate-400 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={imgUrl} alt={`Thumb ${idx}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Specifications Box */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
            <h3 className="font-display font-bold text-slate-900 text-base flex items-center gap-2">
              <Ruler className="w-4 h-4 text-teal-700" /> Frame Dimensions & Anatomy
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Size</span>
                <span className="font-bold text-slate-800">{product.size || 'Medium'}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Material</span>
                <span className="font-bold text-slate-800">{product.material || 'Optical'}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Weight</span>
                <span className="font-bold text-slate-800">{product.weight || '20g'}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">SKU Code</span>
                <span className="font-bold text-slate-800">{product.sku}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Product Details & Customizer (7 cols) */}
        <div className="lg:col-span-6 space-y-6">
          
          {/* Title & Price Header */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span className="font-extrabold uppercase tracking-widest text-teal-700 bg-teal-50 px-2.5 py-1 rounded-md">
                {product.brand} · {product.shape || product.type}
              </span>
              {product.rating && (
                <span className="flex items-center gap-1 font-bold text-slate-700">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  {product.rating} ({product.reviews} customer reviews)
                </span>
              )}
            </div>

            <h1 className="font-display text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-900 leading-snug">
              {product.name}
            </h1>

            {/* Pricing */}
            <div className="pt-1.5 flex items-baseline gap-2.5">
              <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                ₹{totalPrice.toLocaleString('en-IN')}
              </span>
              {product.mrp > product.price && (
                <span className="text-xs sm:text-sm text-slate-400 line-through">
                  ₹{(product.mrp + (lensPrice ? lensPrice * 1.5 : 0)).toLocaleString('en-IN')}
                </span>
              )}
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100">
                Inclusive of GST & Fitting
              </span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed pt-1">
              {product.description}
            </p>
          </div>

          {/* Color Selection */}
          {product.colors && product.colors.length > 1 && (
            <div className="pt-2 space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center justify-between">
                <span>Color: <strong className="text-teal-800">{selectedColor}</strong></span>
                <span className="text-slate-400 text-[11px] font-normal">{product.colors.length} choices</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {product.colors.map(col => (
                  <button
                    key={col}
                    onClick={() => setSelectedColor(col)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold border transition flex items-center gap-2 ${
                      selectedColor === col 
                        ? 'bg-slate-900 text-white border-slate-900 shadow' 
                        : 'bg-white border-slate-200 text-slate-700 hover:border-slate-400'
                    }`}
                  >
                    {selectedColor === col && <Check className="w-3.5 h-3.5 text-teal-400" />}
                    {col}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Reading glasses power dropdown (if reading glasses) */}
          {product.powersAvailable && (
            <div className="p-5 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-amber-900 block">
                Select Optical Magnification Strength:
              </label>
              <select
                value={selectedPower}
                onChange={(e) => setSelectedPower(e.target.value)}
                className="w-full bg-white border border-amber-300 text-xs font-bold text-slate-800 p-3 rounded-xl outline-none"
              >
                {product.powersAvailable.map(pow => (
                  <option key={pow} value={pow}>{pow} Diopters (Ready-to-wear reading power)</option>
                ))}
              </select>
            </div>
          )}

          {/* Lens Customization Section (for Eyeglasses / Frames) */}
          {product.lensOptionsAvailable && (
            <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 space-y-5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold uppercase tracking-widest text-slate-600">
                  Step 1: Choose Option
                </span>
                <span className="text-[11px] text-teal-700 font-bold">1-Year Lens Warranty</span>
              </div>

              {/* Toggle Frame Only vs Add Lens */}
              <div className="grid sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setFrameType('with-lens')}
                  className={`p-3.5 rounded-2xl border-2 text-left transition flex items-start gap-3 ${
                    frameType === 'with-lens' 
                      ? 'border-teal-700 bg-white shadow-md ring-1 ring-teal-700/20' 
                      : 'border-slate-200 hover:border-slate-300 bg-white/60'
                  }`}
                >
                  <div className={`w-4 h-4 rounded-full border flex items-center justify-center mt-0.5 ${
                    frameType === 'with-lens' ? 'border-teal-700 bg-teal-700 text-white' : 'border-slate-300'
                  }`}>
                    {frameType === 'with-lens' && <Check className="w-2.5 h-2.5" />}
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">Add Lens Package</span>
                    <span className="text-[11px] text-slate-500">Anti-Glare, Blue-Cut, Transition</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setFrameType('frame-only')}
                  className={`p-3.5 rounded-2xl border-2 text-left transition flex items-start gap-3 ${
                    frameType === 'frame-only' 
                      ? 'border-teal-700 bg-white shadow-md ring-1 ring-teal-700/20' 
                      : 'border-slate-200 hover:border-slate-300 bg-white/60'
                  }`}
                >
                  <div className={`w-4 h-4 rounded-full border flex items-center justify-center mt-0.5 ${
                    frameType === 'frame-only' ? 'border-teal-700 bg-teal-700 text-white' : 'border-slate-300'
                  }`}>
                    {frameType === 'frame-only' && <Check className="w-2.5 h-2.5" />}
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">Frame Only (Demo Lenses)</span>
                    <span className="text-[11px] text-slate-500">Only frame with zero power</span>
                  </div>
                </button>
              </div>

              {/* Lens Package Selection Grid */}
              {frameType === 'with-lens' && (
                <div className="space-y-3 pt-2">
                  <span className="text-xs font-extrabold uppercase tracking-widest text-slate-600 block">
                    Step 2: Choose Lens Package
                  </span>

                  <div className="grid sm:grid-cols-2 gap-3">
                    {LENS_PACKAGES.map(lens => {
                      const isSelected = selectedLens?.id === lens.id;
                      return (
                        <div
                          key={lens.id}
                          onClick={() => setSelectedLens(lens)}
                          className={`p-3.5 rounded-2xl border-2 cursor-pointer transition flex flex-col justify-between ${
                            isSelected 
                              ? 'border-teal-700 bg-teal-50/40 shadow-sm' 
                              : 'border-slate-200 hover:border-slate-300 bg-white'
                          }`}
                        >
                          <div>
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-xs text-slate-900">{lens.name}</span>
                              <span className="font-extrabold text-xs text-teal-800">+₹{lens.price}</span>
                            </div>
                            <p className="text-[11px] text-slate-500 mt-1 leading-snug">{lens.tagline}</p>
                          </div>
                          {lens.badge && (
                            <span className="mt-2 text-[9px] font-bold uppercase bg-slate-900 text-white px-2 py-0.5 rounded-md self-start">
                              {lens.badge}
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Step 3: Prescription Upload / Entry */}
              {frameType === 'with-lens' && (
                <div className="space-y-3 pt-2">
                  <span className="text-xs font-extrabold uppercase tracking-widest text-slate-600 block">
                    Step 3: Prescription Method
                  </span>

                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => setPrescriptionMethod('upload')}
                      className={`px-3 py-2 rounded-xl text-xs font-bold border transition ${
                        prescriptionMethod === 'upload' ? 'bg-teal-700 text-white border-teal-700' : 'bg-white border-slate-200 text-slate-700'
                      }`}
                    >
                      <Upload className="w-3.5 h-3.5 inline mr-1" /> Upload Prescription
                    </button>
                    <button
                      type="button"
                      onClick={() => setPrescriptionMethod('manual')}
                      className={`px-3 py-2 rounded-xl text-xs font-bold border transition ${
                        prescriptionMethod === 'manual' ? 'bg-teal-700 text-white border-teal-700' : 'bg-white border-slate-200 text-slate-700'
                      }`}
                    >
                      Enter Power Values
                    </button>
                    <button
                      type="button"
                      onClick={() => setPrescriptionMethod('later')}
                      className={`px-3 py-2 rounded-xl text-xs font-bold border transition ${
                        prescriptionMethod === 'later' ? 'bg-teal-700 text-white border-teal-700' : 'bg-white border-slate-200 text-slate-700'
                      }`}
                    >
                      <MessageCircle className="w-3.5 h-3.5 inline mr-1" /> WhatsApp Later
                    </button>
                  </div>

                  {prescriptionMethod === 'upload' && (
                    <div className="border-2 border-dashed border-slate-300 rounded-2xl p-4 text-center bg-white hover:border-teal-500 transition">
                      <input
                        type="file"
                        id="rx-upload-pdp"
                        accept="image/*,application/pdf"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                      <label htmlFor="rx-upload-pdp" className="cursor-pointer block">
                        <Upload className="w-6 h-6 text-teal-700 mx-auto mb-1" />
                        <span className="text-xs font-bold text-slate-800 block">
                          {uploadedFile ? uploadedFile.name : "Attach Prescription Photo / Slip"}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {uploadedFile ? `${uploadedFile.size} · Uploaded` : "Supports Camera photos & PDFs"}
                        </span>
                      </label>
                    </div>
                  )}

                  {prescriptionMethod === 'manual' && (
                    <div className="bg-white p-3 rounded-xl border border-slate-200 text-xs space-y-2">
                      <div className="grid grid-cols-3 gap-2 text-center font-bold text-slate-500 pb-1 border-b border-slate-100">
                        <div>Eye</div>
                        <div>SPH</div>
                        <div>CYL</div>
                      </div>
                      <div className="grid grid-cols-3 gap-2 items-center">
                        <span className="font-bold text-slate-800">Right (OD)</span>
                        <select 
                          value={manualPower.odSphere} 
                          onChange={e => setManualPower({...manualPower, odSphere: e.target.value})}
                          className="p-1.5 border rounded bg-slate-50 text-xs"
                        >
                          {PRESCRIPTION_POWER_OPTIONS.spheres.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                        <select 
                          value={manualPower.odCyl} 
                          onChange={e => setManualPower({...manualPower, odCyl: e.target.value})}
                          className="p-1.5 border rounded bg-slate-50 text-xs"
                        >
                          {PRESCRIPTION_POWER_OPTIONS.cylinders.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                      </div>
                      <div className="grid grid-cols-3 gap-2 items-center">
                        <span className="font-bold text-slate-800">Left (OS)</span>
                        <select 
                          value={manualPower.osSphere} 
                          onChange={e => setManualPower({...manualPower, osSphere: e.target.value})}
                          className="p-1.5 border rounded bg-slate-50 text-xs"
                        >
                          {PRESCRIPTION_POWER_OPTIONS.spheres.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                        <select 
                          value={manualPower.osCyl} 
                          onChange={e => setManualPower({...manualPower, osCyl: e.target.value})}
                          className="p-1.5 border rounded bg-slate-50 text-xs"
                        >
                          {PRESCRIPTION_POWER_OPTIONS.cylinders.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                      </div>
                    </div>
                  )}

                  {prescriptionMethod === 'later' && (
                    <p className="text-xs text-emerald-800 bg-emerald-50 p-3 rounded-xl border border-emerald-200">
                      ✓ Place your order now. You can WhatsApp your prescription photo to <strong>{STORE_PHONE}</strong> after order confirmation.
                    </p>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Action CTAs */}
          <div className="space-y-3 pt-2">
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleAddToCart}
                className="flex-1 py-4 bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm rounded-2xl shadow-md transition active:scale-95 flex items-center justify-center gap-2"
              >
                <span>Add to Shopping Bag</span>
              </button>

              <button
                onClick={handleBuyNow}
                className="flex-1 py-4 bg-teal-700 hover:bg-teal-800 text-white font-bold text-sm rounded-2xl shadow-lg shadow-teal-700/20 transition active:scale-95 flex items-center justify-center gap-2"
              >
                <span>Buy Now · ₹{totalPrice.toLocaleString('en-IN')}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Direct WhatsApp Consultation button */}
            <a
              href={getWhatsAppUrl(`Hello LENS S WORLD, I am interested in ${product.name} (SKU: ${product.sku}). Can you assist me?`)}
              target="_blank"
              rel="noreferrer"
              className="w-full py-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs rounded-xl border border-emerald-200 transition flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4 text-emerald-600" />
              <span>Ask Optometrist on WhatsApp ({STORE_PHONE})</span>
            </a>
          </div>

          {/* Guarantees List */}
          <div className="pt-4 border-t border-slate-200 grid grid-cols-2 gap-3 text-xs text-slate-600">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-teal-700 shrink-0" />
              <span>1-Year Complete Warranty</span>
            </div>
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-teal-700 shrink-0" />
              <span>Free Express Delivery</span>
            </div>
            <div className="flex items-center gap-2">
              <RotateCcw className="w-4 h-4 text-teal-700 shrink-0" />
              <span>7-Day Power Exchange</span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-teal-700 shrink-0" />
              <span>Computerized Precision Fitting</span>
            </div>
          </div>

        </div>

      </div>

      {/* Related Products Recommendation Grid */}
      {relatedProducts.length > 0 && (
        <div className="pt-12 border-t border-slate-200 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-widest text-teal-700 block mb-0.5">
                Handpicked Matches
              </span>
              <h2 className="font-display text-2xl font-extrabold text-slate-900">
                You May Also Like
              </h2>
            </div>
            <button
              onClick={() => setCurrentRoute({ name: 'shop' })}
              className="text-xs font-bold text-teal-700 hover:text-teal-900 flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {relatedProducts.map(p => (
              <ProductCard
                key={p.id}
                product={p}
                onSelectProduct={onSelectProduct}
                onOpenLensModal={onOpenLensModal}
              />
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
