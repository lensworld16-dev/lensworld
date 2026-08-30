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
  Clock,
  ArrowRight,
  FileText
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { LENS_PACKAGES, CONTACT_LENS_DISPOSAL_TYPES, PRESCRIPTION_POWER_OPTIONS } from '../data/lensesData';
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

  const isContactLens = product.type === 'contact-lenses' || product.category === 'contact-lenses';

  // Gallery active image
  const gallery = product.gallery || [product.img];
  const [activeImage, setActiveImage] = useState(gallery[0] || product.img);

  // Selection states
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0] || product.color || 'Standard');
  const [frameType, setFrameType] = useState('with-lens'); // 'with-lens' | 'frame-only'
  const [selectedLens, setSelectedLens] = useState(LENS_PACKAGES[1]); // Blue Cut default
  const [selectedDisposal, setSelectedDisposal] = useState(CONTACT_LENS_DISPOSAL_TYPES[0]); // Daily default for contact lenses
  const [selectedSize, setSelectedSize] = useState('Medium');
  const [selectedPower, setSelectedPower] = useState("+1.00");
  const [prescriptionMethod, setPrescriptionMethod] = useState('upload'); // 'upload' | 'manual' | 'later'
  const [uploadedFile, setUploadedFile] = useState(null);

  // Manual power values
  const [manualPower, setManualPower] = useState({
    odSphere: isContactLens ? '-1.50' : '0.00 (Plano)',
    odCyl: '0.00',
    odAxis: '0',
    osSphere: isContactLens ? '-1.50' : '0.00 (Plano)',
    osCyl: '0.00',
    osAxis: '0',
    addPower: '+1.50'
  });

  const isLenses = product.type === 'lenses';
  const isSunglasses = product.type === 'sunglasses';
  const isReading = product.type === 'reading-glasses';
  const isEyeglasses = product.type === 'eyeglasses';

  const basePrice = product.price;
  const lensPrice = isEyeglasses && frameType === 'with-lens' && selectedLens 
    ? selectedLens.price 
    : isLenses && selectedLens 
      ? Math.max(0, selectedLens.price - basePrice)
      : 0;

  const totalPrice = isContactLens
    ? Math.round(basePrice * (selectedDisposal?.priceMultiplier || 1.0))
    : isLenses && selectedLens
      ? selectedLens.price
      : basePrice + lensPrice;

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
    if (isContactLens) {
      addToCart(product, {
        disposalType: selectedDisposal,
        prescriptionMethod,
        prescriptionFile: prescriptionMethod === 'upload' ? uploadedFile : null,
        prescriptionDetails: prescriptionMethod === 'manual' ? manualPower : null,
        qty: 1
      });
    } else if (isLenses) {
      addToCart(product, {
        selectedLens,
        prescriptionMethod,
        prescriptionFile: prescriptionMethod === 'upload' ? uploadedFile : null,
        prescriptionDetails: prescriptionMethod === 'manual' ? manualPower : null,
        qty: 1
      });
    } else if (isEyeglasses) {
      addToCart(product, {
        selectedColor,
        selectedLens: frameType === 'with-lens' ? selectedLens : null,
        prescriptionMethod: frameType === 'with-lens' ? prescriptionMethod : null,
        prescriptionFile: prescriptionMethod === 'upload' ? uploadedFile : null,
        prescriptionDetails: prescriptionMethod === 'manual' ? manualPower : null,
        qty: 1
      });
    } else {
      addToCart(product, {
        selectedColor,
        readingPower: isReading ? selectedPower : null,
        size: isReading ? selectedSize : product.size,
        qty: 1
      });
    }
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
        onClick={() => setCurrentRoute({ name: isContactLens ? 'contact-lenses' : 'shop' })}
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


          {/* Specifications Box Tailored to Category */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
            <h3 className="font-display font-bold text-slate-900 text-base flex items-center gap-2">
              {product.type === 'contact-lenses' ? (
                <><Layers className="w-4 h-4 text-teal-700" /> Contact Lens Specifications</>
              ) : product.type === 'lenses' ? (
                <><Award className="w-4 h-4 text-teal-700" /> Optical Lens Technical Specifications</>
              ) : product.type === 'accessories' ? (
                <><ShieldCheck className="w-4 h-4 text-teal-700" /> Accessory Specifications</>
              ) : (
                <><Ruler className="w-4 h-4 text-teal-700" /> Frame Dimensions & Anatomy</>
              )}
            </h3>

            {/* Contact Lenses Specs */}
            {product.type === 'contact-lenses' && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Base Curve</span>
                  <span className="font-bold text-slate-800">8.6 mm (Standard)</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Water Content</span>
                  <span className="font-bold text-slate-800">58% High Hydration</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Diameter</span>
                  <span className="font-bold text-slate-800">14.2 mm</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Material</span>
                  <span className="font-bold text-slate-800">{product.material || 'Hydrogel'}</span>
                </div>
              </div>
            )}

            {/* Standalone Prescription Lenses Specs */}
            {product.type === 'lenses' && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Index</span>
                  <span className="font-bold text-slate-800">1.56 / 1.61 HD</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Coating</span>
                  <span className="font-bold text-slate-800">AR & Hydrophobic</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">UV Filter</span>
                  <span className="font-bold text-slate-800">UV420 Digital Shield</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">SKU Code</span>
                  <span className="font-bold text-slate-800">{product.sku}</span>
                </div>
              </div>
            )}

            {/* Accessories Specs */}
            {product.type === 'accessories' && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Kit Includes</span>
                  <span className="font-bold text-slate-800">Spray + 2 Cloths + Driver</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Volume</span>
                  <span className="font-bold text-slate-800">60 ml Spray</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Compatibility</span>
                  <span className="font-bold text-slate-800">All AR / Blue Lenses</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">SKU Code</span>
                  <span className="font-bold text-slate-800">{product.sku}</span>
                </div>
              </div>
            )}

            {/* Eyeglasses & Sunglasses Frame Dimensions */}
            {(product.type === 'eyeglasses' || product.type === 'sunglasses' || product.type === 'reading-glasses') && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Size</span>
                  <span className="font-bold text-slate-800">{product.size || 'Medium (52-18-140)'}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Material</span>
                  <span className="font-bold text-slate-800">{product.material || 'Optical Grade'}</span>
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
            )}
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

          {/* =========================================================================
              FLOW A: CONTACT LENSES PDP
             ========================================================================= */}
          {isContactLens && (
            <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 space-y-6">
              
              {/* Step 1: Disposal Type */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold uppercase tracking-widest text-slate-700 flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-teal-700" />
                    Step 1: Select Disposal Type
                  </span>
                  <span className="text-[11px] text-teal-700 font-bold">Moisture Lock 58%</span>
                </div>

                <div className="grid sm:grid-cols-2 gap-3">
                  {CONTACT_LENS_DISPOSAL_TYPES.map(disp => {
                    const isSelected = selectedDisposal?.id === disp.id;
                    const dispPrice = Math.round(basePrice * disp.priceMultiplier);
                    return (
                      <div
                        key={disp.id}
                        onClick={() => setSelectedDisposal(disp)}
                        className={`p-4 rounded-2xl border-2 cursor-pointer transition flex flex-col justify-between ${
                          isSelected 
                            ? 'border-teal-700 bg-white shadow-md ring-1 ring-teal-700/20' 
                            : 'border-slate-200 hover:border-slate-300 bg-white/70'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                                isSelected ? 'border-teal-700 bg-teal-700 text-white' : 'border-slate-300'
                              }`}>
                                {isSelected && <Check className="w-2.5 h-2.5" />}
                              </div>
                              <span className="font-bold text-xs text-slate-900">{disp.name}</span>
                            </div>
                            <span className="font-extrabold text-xs text-teal-800">₹{dispPrice}</span>
                          </div>
                          
                          <p className="text-[11px] font-semibold text-teal-700 mt-1 pl-6">
                            {disp.tagline}
                          </p>
                          <p className="text-[11px] text-slate-500 mt-1 pl-6 leading-snug">
                            {disp.description}
                          </p>
                        </div>

                        <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] pl-6 text-slate-500">
                          <span>{disp.packInfo}</span>
                          {disp.badge && (
                            <span className="text-[9px] font-bold bg-slate-900 text-white px-2 py-0.5 rounded">
                              {disp.badge}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Step 2: Add Prescription for Contact Lenses */}
              <div className="space-y-3 pt-2 border-t border-slate-200">
                <span className="text-xs font-extrabold uppercase tracking-widest text-slate-700 block">
                  Step 2: Add Prescription (Upload photo/PDF or enter values for each eye)
                </span>

                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setPrescriptionMethod('upload')}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition ${
                      prescriptionMethod === 'upload' ? 'bg-teal-700 text-white border-teal-700 shadow-sm' : 'bg-white border-slate-200 text-slate-700'
                    }`}
                  >
                    <Upload className="w-3.5 h-3.5 inline mr-1" /> Upload Prescription
                  </button>
                  <button
                    type="button"
                    onClick={() => setPrescriptionMethod('manual')}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition ${
                      prescriptionMethod === 'manual' ? 'bg-teal-700 text-white border-teal-700 shadow-sm' : 'bg-white border-slate-200 text-slate-700'
                    }`}
                  >
                    Enter Values (OD / OS)
                  </button>
                  <button
                    type="button"
                    onClick={() => setPrescriptionMethod('later')}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition ${
                      prescriptionMethod === 'later' ? 'bg-teal-700 text-white border-teal-700 shadow-sm' : 'bg-white border-slate-200 text-slate-700'
                    }`}
                  >
                    <MessageCircle className="w-3.5 h-3.5 inline mr-1" /> WhatsApp Later
                  </button>
                </div>

                {prescriptionMethod === 'upload' && (
                  <div className="border-2 border-dashed border-slate-300 rounded-2xl p-4 text-center bg-white hover:border-teal-500 transition">
                    <input
                      type="file"
                      id="rx-contact-upload-pdp"
                      accept="image/*,application/pdf"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <label htmlFor="rx-contact-upload-pdp" className="cursor-pointer block">
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
                  <div className="bg-white p-4 rounded-2xl border border-slate-200 text-xs space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="font-bold text-slate-800 block">Right Eye (OD) Power:</label>
                        <select 
                          value={manualPower.odSphere} 
                          onChange={e => setManualPower({...manualPower, odSphere: e.target.value})}
                          className="w-full p-2 border rounded-xl bg-slate-50 text-xs font-bold text-slate-800 outline-none"
                        >
                          {PRESCRIPTION_POWER_OPTIONS.contactLensSpheres.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="font-bold text-slate-800 block">Left Eye (OS) Power:</label>
                        <select 
                          value={manualPower.osSphere} 
                          onChange={e => setManualPower({...manualPower, osSphere: e.target.value})}
                          className="w-full p-2 border rounded-xl bg-slate-50 text-xs font-bold text-slate-800 outline-none"
                        >
                          {PRESCRIPTION_POWER_OPTIONS.contactLensSpheres.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {prescriptionMethod === 'later' && (
                  <p className="text-xs text-emerald-800 bg-emerald-50 p-3 rounded-xl border border-emerald-200">
                    ✓ Place your order now. You can WhatsApp your prescription photo to <strong>{STORE_PHONE}</strong> after order confirmation.
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Color Selection for Frames (non-contact lenses) */}
          {!isContactLens && product.colors && product.colors.length > 1 && (
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

          {/* Reading glasses Size & Power selection */}
          {product.type === 'reading-glasses' && (
            <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 space-y-5">
              {/* Select Size */}
              <div>
                <div className="flex items-center justify-between mb-0.5">
                  <span className="text-xs font-extrabold uppercase tracking-widest text-slate-900">
                    Select Size
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mb-3">Choose your comfortable fit</p>
                <div className="grid grid-cols-4 gap-2">
                  {['Small', 'Medium', 'Large', 'Extra Wide'].map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setSelectedSize(size)}
                      className={`py-2.5 px-2 rounded-xl text-xs font-bold border-2 transition text-center ${
                        selectedSize === size
                          ? 'border-teal-700 bg-teal-50/60 text-teal-950 shadow-sm'
                          : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Select Reading Power */}
              <div>
                <span className="text-xs font-extrabold uppercase tracking-widest text-slate-900 block mb-3">
                  Select Reading Power
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {['+1.00', '+1.50', '+2.00', '+2.50', '+3.00', '+3.50'].map((pow) => (
                    <button
                      key={pow}
                      type="button"
                      onClick={() => setSelectedPower(pow)}
                      className={`py-3 px-2 rounded-xl text-xs font-extrabold border-2 transition text-center ${
                        selectedPower === pow
                          ? 'border-teal-700 bg-teal-50/60 text-teal-950 shadow-sm'
                          : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      {pow}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* =========================================================================
              FLOW B: EYEGLASSES / SUNGLASSES / LENSES PDP
             ========================================================================= */}
          {!isContactLens && (product.lensOptionsAvailable || product.type === 'eyeglasses' || product.type === 'sunglasses' || product.type === 'lenses') && (
            <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 space-y-5">
              
              {/* Show Frame Only vs Add Lens if product is an optical frame or sunglasses */}
              {(product.type === 'eyeglasses' || product.type === 'sunglasses' || product.lensOptionsAvailable) && product.type !== 'lenses' && (
                <>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold uppercase tracking-widest text-slate-600">
                      Step 1: Choose Option
                    </span>
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
                        <span className="text-xs font-bold text-slate-900 block">
                          {product.type === 'sunglasses' ? 'Frame with Standard Sun Lenses' : 'Frame Only (Demo Lenses)'}
                        </span>
                        <span className="text-[11px] text-slate-500">
                          {product.type === 'sunglasses' ? 'Ready-to-wear UV400 Polarized' : 'Only frame with zero power'}
                        </span>
                      </div>
                    </button>
                  </div>
                </>
              )}

              {/* Lens Package Selection Grid */}
              {(frameType === 'with-lens' || product.type === 'lenses') && (
                <div className="space-y-3 pt-2">
                  <span className="text-xs font-extrabold uppercase tracking-widest text-slate-600 block">
                    {product.type === 'lenses' ? 'Step 1: Select Lens Type' : 'Step 2: Select Lens Type'}
                  </span>

                  <div className="grid sm:grid-cols-2 gap-3">
                    {LENS_PACKAGES.map(lens => {
                      const isSelected = selectedLens?.id === lens.id;
                      return (
                        <div
                          key={lens.id}
                          onClick={() => setSelectedLens(lens)}
                          className={`p-3 rounded-2xl border-2 cursor-pointer transition flex items-start gap-3 ${
                            isSelected 
                              ? 'border-teal-700 bg-teal-50/40 shadow-sm' 
                              : 'border-slate-200 hover:border-slate-300 bg-white'
                          }`}
                        >
                          <img 
                            src={lens.img} 
                            alt={lens.name} 
                            className="w-11 h-11 object-cover rounded-lg border border-slate-200 shrink-0 bg-white"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-1">
                              <span className="font-bold text-xs text-slate-900">{lens.name}</span>
                              <span className="font-extrabold text-xs text-teal-800 shrink-0">
                                {product.type === 'lenses' ? `₹${lens.price}` : `+₹${lens.price}`}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">{lens.tagline}</p>
                            {lens.badge && (
                              <span className="mt-1.5 inline-block text-[9px] font-bold uppercase bg-slate-900 text-white px-2 py-0.5 rounded-md">
                                {lens.badge}
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Step 3: Prescription Upload / Entry for Eyeglasses & Lenses */}
              {(frameType === 'with-lens' || product.type === 'lenses') && (
                <div className="space-y-3 pt-2">
                  <span className="text-xs font-extrabold uppercase tracking-widest text-slate-600 block">
                    {product.type === 'eyeglasses' 
                      ? 'Step 3: Add Prescription (Upload photo/PDF or enter values for each eye)' 
                      : 'Step 2: Add Prescription (Upload photo/PDF or enter values for each eye)'}
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
                      Enter Values (OD / OS)
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

          {/* Guarantees List (Cleaned of 1-year warranty) */}
          <div className="pt-4 border-t border-slate-200 grid grid-cols-2 gap-3 text-xs text-slate-600">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-teal-700 shrink-0" />
              <span>100% Authentic Quality</span>
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
              <h2 className="font-display font-bold text-xl sm:text-2xl text-slate-900">
                You May Also Like
              </h2>
            </div>
            <button 
              onClick={() => setCurrentRoute({ name: isContactLens ? 'contact-lenses' : 'shop' })}
              className="text-xs font-bold text-teal-700 hover:text-teal-900 flex items-center gap-1 transition"
            >
              View Full Collection <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
