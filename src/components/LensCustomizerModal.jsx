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
  Eye
} from 'lucide-react';
import { LENS_PACKAGES, PRESCRIPTION_POWER_OPTIONS } from '../data/lensesData';
import { useShop } from '../context/ShopContext';
import { getWhatsAppUrl } from '../utils/whatsappHelper';

export default function LensCustomizerModal({ product, onClose }) {
  const { addToCart } = useShop();

  // State
  const [frameType, setFrameType] = useState('with-lens'); // 'frame-only' | 'with-lens'
  const [selectedLens, setSelectedLens] = useState(LENS_PACKAGES[1]); // Default to Blue Cut
  const [selectedColor, setSelectedColor] = useState(product?.colors?.[0] || product?.color || 'Standard');
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
    addPower: '+1.50',
    pd: '63'
  });

  if (!product) return null;

  const basePrice = product.price;
  const lensPrice = frameType === 'with-lens' && selectedLens ? selectedLens.price : 0;
  const totalPrice = basePrice + lensPrice;

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
    addToCart(product, {
      selectedColor,
      selectedLens: frameType === 'with-lens' ? selectedLens : null,
      prescriptionMethod: frameType === 'with-lens' ? prescriptionMethod : null,
      prescriptionFile: prescriptionMethod === 'upload' ? uploadedFile : null,
      prescriptionDetails: prescriptionMethod === 'manual' ? manualPower : null,
      qty: 1
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-3">
            <img src={product.img} alt={product.name} className="w-12 h-12 rounded-xl object-cover border border-slate-200 bg-white" />
            <div>
              <h2 className="font-display font-bold text-slate-900 text-lg sm:text-xl leading-tight">
                Customize Lenses for {product.name}
              </h2>
              <p className="text-xs text-slate-500">
                Frame SKU: {product.sku} · Select your preferred lens protection & prescription
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
          
          {/* Step 1: Color Choice */}
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
                    Custom fitted with Blue Cut, ARC, Photochromic, or Progressive prescription lenses.
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
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  3. Select Lens Type & Coating
                </label>
                <span className="text-xs text-teal-700 font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> 1-Year Coating Warranty
                </span>
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

          {/* Step 4: Prescription Method */}
          {frameType === 'with-lens' && (
            <div className="pt-5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                4. How would you like to provide your prescription?
              </label>

              <div className="grid sm:grid-cols-3 gap-2.5 mb-4">
                <button
                  onClick={() => setPrescriptionMethod('upload')}
                  className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1.5 text-center transition ${
                    prescriptionMethod === 'upload' 
                      ? 'bg-teal-700 text-white border-teal-700' 
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300'
                  }`}
                >
                  <Upload className="w-4 h-4" />
                  <span>Upload Doctor's Prescription</span>
                </button>

                <button
                  onClick={() => setPrescriptionMethod('manual')}
                  className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1.5 text-center transition ${
                    prescriptionMethod === 'manual' 
                      ? 'bg-teal-700 text-white border-teal-700' 
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300'
                  }`}
                >
                  <FileText className="w-4 h-4" />
                  <span>Enter Values Manually</span>
                </button>

                <button
                  onClick={() => setPrescriptionMethod('later')}
                  className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1.5 text-center transition ${
                    prescriptionMethod === 'later' 
                      ? 'bg-teal-700 text-white border-teal-700' 
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300'
                  }`}
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Send Later via WhatsApp</span>
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
                      {uploadedFile ? `${uploadedFile.size} · Uploaded Successfully` : "Supports JPG, PNG, WEBP, or PDF up to 15MB"}
                    </p>
                  </label>
                </div>
              )}

              {/* Manual Power Entry Table */}
              {prescriptionMethod === 'manual' && (
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-4">
                  <div className="text-xs font-semibold text-slate-700 flex items-center justify-between">
                    <span>Power Matrix (OD: Right Eye, OS: Left Eye)</span>
                    <span className="text-slate-400 text-[11px]">Consult your optical prescription slip</span>
                  </div>

                  <div className="grid grid-cols-4 gap-2 text-center text-xs font-bold text-slate-600 pb-1 border-b border-slate-200">
                    <div>Eye</div>
                    <div>Sphere (SPH)</div>
                    <div>Cylinder (CYL)</div>
                    <div>Axis (0-180)</div>
                  </div>

                  {/* Right Eye (OD) */}
                  <div className="grid grid-cols-4 gap-2 items-center text-xs">
                    <span className="font-bold text-slate-800 text-center">OD (Right)</span>
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

                  {/* Left Eye (OS) */}
                  <div className="grid grid-cols-4 gap-2 items-center text-xs">
                    <span className="font-bold text-slate-800 text-center">OS (Left)</span>
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
                    No problem! You can complete your order now and send your prescription photo directly to our optical specialist on WhatsApp <strong>+91 86686 87897</strong> with your Order ID.
                  </p>
                </div>
              )}
            </div>
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
                (Frame ₹{basePrice} {lensPrice > 0 ? `+ Lens ₹${lensPrice}` : ''})
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
              <span>Add Customized Pair</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
