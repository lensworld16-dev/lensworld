import React from 'react';
import { 
  Eye, 
  ShieldCheck, 
  Sparkles, 
  Check, 
  ArrowRight, 
  Sun, 
  Monitor, 
  Glasses, 
  Award,
  Layers
} from 'lucide-react';
import { LENS_PACKAGES } from '../data/lensesData';

export default function LensGuidePage({ setCurrentRoute, onSelectCategory }) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-16">
      
      {/* 1. Header Banner */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 bg-teal-50 text-teal-700 font-extrabold text-xs px-3.5 py-1.5 rounded-full border border-teal-100 uppercase tracking-wider">
          <Eye className="w-4 h-4" /> Comprehensive Optical Lens Guide
        </div>
        <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 leading-tight">
          Find The Right Lens For Your Eyes
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          From screen protection to seamless multi-distance progressive focus, discover our four specialized laboratory lens technologies designed for daily optical clarity.
        </p>
      </div>

      {/* 2. Lens Cards Grid */}
      <div className="grid md:grid-cols-2 gap-8">
        {LENS_PACKAGES.map((lens, idx) => (
          <div 
            key={lens.id}
            className="p-8 rounded-3xl bg-white border border-slate-200/80 shadow-sm hover:shadow-xl transition flex flex-col justify-between space-y-6"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold uppercase tracking-wider bg-teal-50 text-teal-800 px-3 py-1 rounded-full border border-teal-200">
                  {lens.badge}
                </span>
                <span className="text-2xl font-extrabold text-slate-900">
                  +₹{lens.price.toLocaleString('en-IN')}
                </span>
              </div>

              <div>
                <h3 className="font-display font-bold text-2xl text-slate-900">
                  {lens.name}
                </h3>
                <p className="text-xs font-semibold text-teal-700 mt-1">
                  {lens.tagline}
                </p>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {lens.description}
              </p>

              {/* Benefits list */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <span className="text-[11px] font-bold uppercase text-slate-400">Key Technology Features:</span>
                <ul className="space-y-2 text-xs text-slate-700">
                  {lens.features.map((feat, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-600">
                <strong>Best Suited For:</strong> {lens.recommendedFor}
              </div>
            </div>

            <button
              onClick={() => {
                onSelectCategory('eyeglasses');
                setCurrentRoute({ name: 'shop' });
              }}
              className="w-full py-3.5 bg-slate-900 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow transition flex items-center justify-center gap-2"
            >
              <span>Shop Frames with {lens.name.split(' ')[0]} Lenses</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {/* 3. Comparison Matrix Table */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-1">
          <h3 className="font-display font-bold text-xl sm:text-2xl text-slate-900">
            Lens Features Comparison
          </h3>
          <p className="text-xs text-slate-500">Quick side-by-side breakdown of our lens packages</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-700 font-bold uppercase">
                <th className="p-3.5">Feature</th>
                <th className="p-3.5 text-center">Anti-Glare ARC</th>
                <th className="p-3.5 text-center bg-teal-50/60 text-teal-900">Blue Cut Shield</th>
                <th className="p-3.5 text-center">Photochromic</th>
                <th className="p-3.5 text-center">Progressive HD</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              <tr>
                <td className="p-3.5 font-bold">Anti-Reflective ARC Coating</td>
                <td className="p-3.5 text-center text-emerald-600 font-bold">✓ Included</td>
                <td className="p-3.5 text-center text-emerald-600 font-bold bg-teal-50/30">✓ Included</td>
                <td className="p-3.5 text-center text-emerald-600 font-bold">✓ Included</td>
                <td className="p-3.5 text-center text-emerald-600 font-bold">✓ Included</td>
              </tr>
              <tr>
                <td className="p-3.5 font-bold">Blue Light Digital Filter (UV420)</td>
                <td className="p-3.5 text-center text-slate-300">—</td>
                <td className="p-3.5 text-center text-emerald-600 font-bold bg-teal-50/30">✓ Advanced</td>
                <td className="p-3.5 text-center text-emerald-600 font-bold">✓ Included</td>
                <td className="p-3.5 text-center text-emerald-600 font-bold">✓ Included</td>
              </tr>
              <tr>
                <td className="p-3.5 font-bold">Outdoor Sunlight Darkening</td>
                <td className="p-3.5 text-center text-slate-300">—</td>
                <td className="p-3.5 text-center text-slate-300 bg-teal-50/30">—</td>
                <td className="p-3.5 text-center text-emerald-600 font-bold">✓ 30s Fast Darkening</td>
                <td className="p-3.5 text-center text-slate-300">Optional</td>
              </tr>
              <tr>
                <td className="p-3.5 font-bold">Near + Mid + Distance Vision</td>
                <td className="p-3.5 text-center text-slate-300">Single Vision</td>
                <td className="p-3.5 text-center text-slate-300 bg-teal-50/30">Single Vision</td>
                <td className="p-3.5 text-center text-slate-300">Single Vision</td>
                <td className="p-3.5 text-center text-emerald-600 font-bold">✓ 3-in-1 Seamless</td>
              </tr>
              <tr>
                <td className="p-3.5 font-bold">Scratch Guard Hard Coating</td>
                <td className="p-3.5 text-center text-emerald-600 font-bold">✓ 1-Year Warranty</td>
                <td className="p-3.5 text-center text-emerald-600 font-bold bg-teal-50/30">✓ 1-Year Warranty</td>
                <td className="p-3.5 text-center text-emerald-600 font-bold">✓ 1-Year Warranty</td>
                <td className="p-3.5 text-center text-emerald-600 font-bold">✓ 1-Year Warranty</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
