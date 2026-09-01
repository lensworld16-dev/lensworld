import React, { useState } from 'react';
import { 
  X, 
  Check, 
  Sparkles, 
  ShieldCheck, 
  Upload, 
  FileText, 
  MessageCircle, 
  HelpCircle, 
  ArrowRight,
  Eye,
  Layers,
  Clock
} from 'lucide-react';
import { LENS_PACKAGES, CONTACT_LENS_DISPOSAL_TYPES, PRESCRIPTION_POWER_OPTIONS } from '../data/lensesData';
import { useShop } from '../context/ShopContext';
import { STORE_PHONE } from '../utils/whatsappHelper';

export default function LensCustomizerModal({ product, onClose }) {
  const { addToCart } = useShop();

  const isContactLens = product?.type === 'contact-lenses' || product?.category === 'contact-lenses';

  // State for Eyeglasses / Lenses
  const [frameType, setFrameType] = useState('with-lens'); // 'frame-only' | 'with-lens'
  const [selectedLens, setSelectedLens] = useState(LENS_PACKAGES[1]); // Default to Blue Cut
  const [selectedColor, setSelectedColor] = useState(product?.colors?.[0] || product?.color || 'Standard');
  
  // State for Contact Lenses
  const [selectedDisposal, setSelectedDisposal] = useState(CONTACT_LENS_DISPOSAL_TYPES[0]); // Default to Daily

  // Prescription method states (common to both)
  const [prescriptionMethod, setPrescriptionMethod] = useState('upload'); // 'upload' | 'manual' | 'later'
  const [uploadedFile, setUploadedFile] = useState(null);

  // Manual power values
  const [manualPower, setManualPower] = useState({
    odSphere: '-1.50',
    odCyl: '0.00',
    odAxis: '0',
    osSphere: '-1.50',
    osCyl: '0.00',
    osAxis: '0',
    addPower: '+1.50',
    pd: '63'
  });

  if (!product) return null;

  const basePrice = product.price;
  const lensPrice = !isContactLens && frameType === 'with-lens' && selectedLens ? selectedLens.price : 0;
  const totalPrice = isContactLens
    ? Math.round(basePrice * (selectedDisposal?.priceMultiplier || 1.0))
    : basePrice + lensPrice;

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile({
        name: file.name,
        size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
        type: file.type
      });
    }
  };

  const handleConfirmAndAdd = () => {
    if (isContactLens) {
      addToCart(product, {
        disposalType: selectedDisposal,
        prescriptionMethod,
        prescriptionFile: prescriptionMethod === 'upload' ? uploadedFile : null,
        prescriptionDetails: prescriptionMethod === 'manual' ? manualPower : null,
        qty: 1
      });
    } else {
      addToCart(product, {
        selectedColor,
        selectedLens: frameType === 'with-lens' ? selectedLens : null,
        prescriptionMethod: frameType === 'with-lens' ? prescriptionMethod : null,
        prescriptionFile: prescriptionMethod === 'upload' ? uploadedFile : null,
        prescriptionDetails: prescriptionMethod === 'manual' ? manualPower : null,
        qty: 1
      });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-3">
            <img src={product.img} alt={product.name} className="w-12 h-12 rounded-xl object-cover border border-slate-200 bg-white shrink-0" />
            <div>
              <h2 className="font-display font-bold text-slate-900 text-lg sm:text-xl leading-tight">
                {isContactLens ? `Configure ${product.name}` : `Customize Lenses for ${product.name}`}
              </h2>
              <p className="text-xs text-slate-500">
                {isContactLens 
                  ? 'Select disposal schedule & provide prescription'
                  : `SKU: ${product.sku} · Select your preferred lens package & prescription`}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body (Scrollable) */}
        <div className="p-6 overflow-y-auto space-y-6 divide-y divide-slate-100 flex-1">
          
          {/* =========================================================================
              FLOW A: CONTACT LENSES
             ========================================================================= */}
          {isContactLens ? (
            <>
              {/* Step 1: Select Disposal Type */}
              <div className="pt-2">
                <div className="flex items-center justify-between mb-3">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-teal-700" />
                    1. Select Disposal Type
                  </label>
                  <span className="text-xs text-teal-700 font-semibold">
                    Sterile & Moisture-Locked
                  </span>
                </div>

                <div className="grid sm:grid-cols-2 gap-3.5">
                  {CONTACT_LENS_DISPOSAL_TYPES.map(disp => {
                    const isSelected = selectedDisposal?.id === disp.id;
                    const dispPrice = Math.round(basePrice * disp.priceMultiplier);
                    return (
                      <div
                        key={disp.id}
                        onClick={() => setSelectedDisposal(disp)}
                        className={`relative p-4 rounded-2xl border-2 cursor-pointer transition flex flex-col justify-between ${
                          isSelected 
                            ? 'border-teal-700 bg-teal-50/40 shadow-md ring-1 ring-teal-700/20' 
                            : 'border-slate-200 hover:border-slate-300 bg-white'
                        }`}
                      >
                        <div>
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                                isSelected ? 'border-teal-700 bg-teal-700 text-white' : 'border-slate-300'
                              }`}>
                                {isSelected && <Check className="w-2.5 h-2.5" />}
                              </div>
                              <span className="font-bold text-sm text-slate-900">{disp.name}</span>
                            </div>
                            <span className="font-extrabold text-sm text-teal-800 shrink-0">
                              ₹{dispPrice.toLocaleString('en-IN')}
                            </span>
                          </div>
                          
                          <p className="text-xs font-semibold text-teal-700 mt-1 pl-6">
                            {disp.tagline}
                          </p>
                          <p className="text-xs text-slate-600 mt-1.5 pl-6 leading-relaxed">
                            {disp.description}
                          </p>
                        </div>

                        <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] pl-6 text-slate-500">
                          <span>{disp.packInfo}</span>
                          {disp.badge && (
                            <span className="text-[10px] font-bold bg-slate-900 text-white px-2 py-0.5 rounded-md">
                              {disp.badge}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Step 2: Add Prescription for Contact Lens */}
              <div className="pt-5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-3">
                  2. Add Prescription (Upload photo/PDF or enter values for each eye)
                </label>

                <div className="grid sm:grid-cols-3 gap-2.5 mb-4">
                  <button
                    type="button"
                    onClick={() => setPrescriptionMethod('upload')}
                    className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1.5 text-center transition ${
                      prescriptionMethod === 'upload' 
                        ? 'bg-teal-700 text-white border-teal-700 shadow-sm' 
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <Upload className="w-4 h-4" />
                    <span>Upload Prescription</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPrescriptionMethod('manual')}
                    className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1.5 text-center transition ${
                      prescriptionMethod === 'manual' 
                        ? 'bg-teal-700 text-white border-teal-700 shadow-sm' 
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <FileText className="w-4 h-4" />
                    <span>Enter Values (OD / OS)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPrescriptionMethod('later')}
                    className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1.5 text-center transition ${
                      prescriptionMethod === 'later' 
                        ? 'bg-teal-700 text-white border-teal-700 shadow-sm' 
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>WhatsApp Later</span>
                  </button>
                </div>

                {/* Upload Box */}
                {prescriptionMethod === 'upload' && (
                  <div className="border-2 border-dashed border-slate-300 rounded-2xl p-6 text-center hover:border-teal-500 transition bg-slate-50/60">
                    <input
                      type="file"
                      id="rx-contact-upload-modal"
                      accept="image/*,application/pdf"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <label htmlFor="rx-contact-upload-modal" className="cursor-pointer block">
                      <Upload className="w-8 h-8 text-teal-700 mx-auto mb-2" />
                      <p className="text-sm font-bold text-slate-800">
                        {uploadedFile ? uploadedFile.name : "Click to Upload Prescription Slip / Photo"}
                      </p>
                      <p className="text-xs text-slate-400 mt-1">
                        {uploadedFile ? `${uploadedFile.size} · Uploaded Successfully` : "Supports JPG, PNG, WEBP, or PDF"}
                      </p>
                    </label>
                  </div>
                )}

                {/* Manual Power Entry for Contact Lenses */}
                {prescriptionMethod === 'manual' && (
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                    <div className="text-xs font-semibold text-slate-700 flex items-center justify-between">
                      <span>Select Power for Each Eye</span>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      {/* Right Eye */}
                      <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1.5">
                        <label className="block text-xs font-bold text-slate-800">
                          Right Eye Sphere Power:
                        </label>
                        <select
                          value={manualPower.odSphere}
                          onChange={(e) => setManualPower({ ...manualPower, odSphere: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 p-2.5 rounded-lg outline-none focus:border-teal-600"
                        >
                          {PRESCRIPTION_POWER_OPTIONS.contactLensSpheres.map(s => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </div>

                      {/* Left Eye */}
                      <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1.5">
                        <label className="block text-xs font-bold text-slate-800">
                          Left Eye Sphere Power:
                        </label>
                        <select
                          value={manualPower.osSphere}
                          onChange={(e) => setManualPower({ ...manualPower, osSphere: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 p-2.5 rounded-lg outline-none focus:border-teal-600"
                        >
                          {PRESCRIPTION_POWER_OPTIONS.contactLensSpheres.map(s => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {/* WhatsApp Later Notice */}
                {prescriptionMethod === 'later' && (
                  <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl flex items-center gap-3">
                    <MessageCircle className="w-6 h-6 text-emerald-600 shrink-0" />
                    <p className="text-xs text-emerald-900 leading-relaxed">
                      You can complete your order now and send your prescription photo directly to our optical specialist on WhatsApp <strong>{STORE_PHONE}</strong> with your Order ID.
                    </p>
                  </div>
                )}
              </div>
            </>
          ) : (
            /* =========================================================================
                FLOW B: EYEGLASSES / LENSES / SUNGLASSES
               ========================================================================= */
            <>
              {/* Step 1: Color Choice (if applicable) */}
              {product.colors && product.colors.length > 1 && (
                <div className="pt-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                    1. Select Frame Color
                  </label>
                  <div className="flex flex-wrap gap-2.5">
                    {product.colors.map(col => (
                      <button
                        key={col}
                        onClick={() => setSelectedColor(col)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold border transition flex items-center gap-2 ${
                          selectedColor === col 
                            ? 'bg-slate-900 text-white border-slate-900 shadow-sm' 
                            : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-400'
                        }`}
                      >
                        {selectedColor === col && <Check className="w-3.5 h-3.5 text-teal-400" />}
                        {col}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 2: Choose Frame Only vs Add Lens Package */}
              <div className="pt-5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                  2. Choose Purchase Option
                </label>
                <div className="grid sm:grid-cols-2 gap-3">
                  <div
                    onClick={() => setFrameType('with-lens')}
                    className={`p-4 rounded-2xl border-2 cursor-pointer transition flex items-start gap-3 ${
                      frameType === 'with-lens' 
                        ? 'border-teal-700 bg-teal-50/40 shadow-sm' 
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center mt-0.5 ${
                      frameType === 'with-lens' ? 'border-teal-700 bg-teal-700 text-white' : 'border-slate-300'
                    }`}>
                      {frameType === 'with-lens' && <Check className="w-3 h-3" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-slate-900">Add Lens Package</span>
                        <span className="bg-teal-100 text-teal-800 text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                          Recommended
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                        Custom fitted with Blue Cut, Anti-Glare ARC, Photochromic, or Progressive lenses.
                      </p>
                    </div>
                  </div>

                  <div
                    onClick={() => setFrameType('frame-only')}
                    className={`p-4 rounded-2xl border-2 cursor-pointer transition flex items-start gap-3 ${
                      frameType === 'frame-only' 
                        ? 'border-teal-700 bg-teal-50/40 shadow-sm' 
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center mt-0.5 ${
                      frameType === 'frame-only' ? 'border-teal-700 bg-teal-700 text-white' : 'border-slate-300'
                    }`}>
                      {frameType === 'frame-only' && <Check className="w-3 h-3" />}
                    </div>
                    <div>
                      <span className="font-bold text-sm text-slate-900">Frame Only (Zero Power Demo Lens)</span>
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                        Receive the optical frame with transparent non-prescription demo lenses.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 3: Choose Lens Package */}
              {frameType === 'with-lens' && (
                <div className="pt-5">
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                      3. Select Lens Type
                    </label>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-3.5">
                    {LENS_PACKAGES.map(lens => {
                      const isSelected = selectedLens?.id === lens.id;
                      return (
                        <div
                          key={lens.id}
                          onClick={() => setSelectedLens(lens)}
                          className={`relative p-4 rounded-2xl border-2 cursor-pointer transition flex flex-col justify-between ${
                            isSelected 
                              ? 'border-teal-700 bg-teal-50/30 shadow-md ring-1 ring-teal-700/20' 
                              : 'border-slate-200 hover:border-slate-300 bg-white'
                          }`}
                        >
                          <div>
                            <div className="flex items-start justify-between gap-2">
                              <span className="font-bold text-sm text-slate-900">{lens.name}</span>
                              <span className="font-extrabold text-sm text-teal-800 shrink-0">
                                +₹{lens.price.toLocaleString('en-IN')}
                              </span>
                            </div>
                            <p className="text-xs font-semibold text-teal-700 mt-0.5">{lens.tagline}</p>
                            <p className="text-xs text-slate-600 mt-2 leading-relaxed">{lens.description}</p>
                            
                            <ul className="mt-3 space-y-1 text-[11px] text-slate-600">
                              {lens.features.slice(0, 2).map((feat, i) => (
                                <li key={i} className="flex items-center gap-1.5">
                                  <Check className="w-3 h-3 text-emerald-600 shrink-0" />
                                  <span>{feat}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          {lens.badge && (
                            <span className="mt-3 inline-block self-start text-[10px] font-extrabold bg-slate-900 text-white px-2 py-0.5 rounded-md">
                              {lens.badge}
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Step 4: Prescription Method for Eyeglasses */}
              {frameType === 'with-lens' && (
                <div className="pt-5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-3">
                    4. Add Prescription (Upload photo/PDF or enter values for each eye)
                  </label>

                  <div className="grid sm:grid-cols-3 gap-2.5 mb-4">
                    <button
                      type="button"
                      onClick={() => setPrescriptionMethod('upload')}
                      className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1.5 text-center transition ${
                        prescriptionMethod === 'upload' 
                          ? 'bg-teal-700 text-white border-teal-700 shadow-sm' 
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      <Upload className="w-4 h-4" />
                      <span>Upload Doctor's Prescription</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPrescriptionMethod('manual')}
                      className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1.5 text-center transition ${
                        prescriptionMethod === 'manual' 
                          ? 'bg-teal-700 text-white border-teal-700 shadow-sm' 
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      <FileText className="w-4 h-4" />
                      <span>Enter Values (OD / OS)</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPrescriptionMethod('later')}
                      className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1.5 text-center transition ${
                        prescriptionMethod === 'later' 
                          ? 'bg-teal-700 text-white border-teal-700 shadow-sm' 
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>WhatsApp Later</span>
                    </button>
                  </div>

                  {/* Upload Box */}
                  {prescriptionMethod === 'upload' && (
                    <div className="border-2 border-dashed border-slate-200 rounded-2xl p-6 text-center hover:border-teal-500 transition bg-slate-50/50">
                      <input
                        type="file"
                        id="prescription-file-modal"
                        accept="image/*,application/pdf"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                      <label htmlFor="prescription-file-modal" className="cursor-pointer block">
                        <Upload className="w-8 h-8 text-teal-700 mx-auto mb-2" />
                        <p className="text-sm font-bold text-slate-800">
                          {uploadedFile ? uploadedFile.name : "Click to Upload Prescription Slip / Photo"}
                        </p>
                        <p className="text-xs text-slate-400 mt-1">
                          {uploadedFile ? `${uploadedFile.size} · Uploaded Successfully` : "Supports JPG, PNG, WEBP, or PDF"}
                        </p>
                      </label>
                    </div>
                  )}

                  {/* Manual Power Entry Table */}
                  {prescriptionMethod === 'manual' && (
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-4">
                      <div className="text-xs font-semibold text-slate-700 flex items-center justify-between">
                        <span>Power Matrix</span>
                        <span className="text-slate-400 text-[11px]">Consult your optical prescription slip</span>
                      </div>

                      <div className="grid grid-cols-4 gap-2 text-center text-xs font-bold text-slate-600 pb-1 border-b border-slate-200">
                        <div>Eye</div>
                        <div>Sphere (SPH)</div>
                        <div>Cylinder (CYL)</div>
                        <div>Axis (0-180)</div>
                      </div>

                      {/* Right Eye */}
                      <div className="grid grid-cols-4 gap-2 items-center text-xs">
                        <span className="font-bold text-slate-800 text-center">Right Eye</span>
                        <select
                          value={manualPower.odSphere}
                          onChange={(e) => setManualPower({ ...manualPower, odSphere: e.target.value })}
                          className="bg-white p-2 rounded-lg border border-slate-200 text-xs font-semibold"
                        >
                          {PRESCRIPTION_POWER_OPTIONS.spheres.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                        <select
                          value={manualPower.odCyl}
                          onChange={(e) => setManualPower({ ...manualPower, odCyl: e.target.value })}
                          className="bg-white p-2 rounded-lg border border-slate-200 text-xs font-semibold"
                        >
                          {PRESCRIPTION_POWER_OPTIONS.cylinders.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                        <input
                          type="number"
                          placeholder="0° - 180°"
                          value={manualPower.odAxis}
                          onChange={(e) => setManualPower({ ...manualPower, odAxis: e.target.value })}
                          className="bg-white p-2 rounded-lg border border-slate-200 text-xs font-semibold text-center"
                        />
                      </div>

                      {/* Left Eye */}
                      <div className="grid grid-cols-4 gap-2 items-center text-xs">
                        <span className="font-bold text-slate-800 text-center">Left Eye</span>
                        <select
                          value={manualPower.osSphere}
                          onChange={(e) => setManualPower({ ...manualPower, osSphere: e.target.value })}
                          className="bg-white p-2 rounded-lg border border-slate-200 text-xs font-semibold"
                        >
                          {PRESCRIPTION_POWER_OPTIONS.spheres.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                        <select
                          value={manualPower.osCyl}
                          onChange={(e) => setManualPower({ ...manualPower, osCyl: e.target.value })}
                          className="bg-white p-2 rounded-lg border border-slate-200 text-xs font-semibold"
                        >
                          {PRESCRIPTION_POWER_OPTIONS.cylinders.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                        <input
                          type="number"
                          placeholder="0° - 180°"
                          value={manualPower.osAxis}
                          onChange={(e) => setManualPower({ ...manualPower, osAxis: e.target.value })}
                          className="bg-white p-2 rounded-lg border border-slate-200 text-xs font-semibold text-center"
                        />
                      </div>
                    </div>
                  )}

                  {/* WhatsApp Later Notice */}
                  {prescriptionMethod === 'later' && (
                    <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl flex items-center gap-3">
                      <MessageCircle className="w-6 h-6 text-emerald-600 shrink-0" />
                      <p className="text-xs text-emerald-900 leading-relaxed">
                        You can complete your order now and send your prescription photo directly to our optical specialist on WhatsApp <strong>{STORE_PHONE}</strong> with your Order ID.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>

        {/* Modal Footer (Live Price Summary & Add CTA) */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-extrabold text-slate-900">
                ₹{totalPrice.toLocaleString('en-IN')}
              </span>
              <span className="text-xs text-slate-500">
                {isContactLens 
                  ? `(${selectedDisposal?.name || 'Contact'} Pack)` 
                  : `(Frame ₹${basePrice} ${lensPrice > 0 ? `+ Lens ₹${lensPrice}` : ''})`}
              </span>
            </div>
            <p className="text-[11px] text-emerald-700 font-semibold">
              ✓ Free Standard Fitting & Hard Protective Case Included
            </p>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-100 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmAndAdd}
              className="flex-1 sm:flex-none px-6 py-2.5 bg-teal-700 hover:bg-teal-800 text-white text-sm font-bold rounded-xl shadow-lg shadow-teal-700/20 transition flex items-center justify-center gap-2 active:scale-95"
            >
              <span>{isContactLens ? 'Add Contact Lens Pack' : 'Add Customized Pair'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
