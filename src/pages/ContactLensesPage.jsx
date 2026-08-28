import React from 'react';
import { 
  Layers, 
  Sparkles, 
  ShieldCheck, 
  Check, 
  Droplet, 
  Clock, 
  Eye,
  ShoppingBag
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import ProductCard from '../components/ProductCard';

export default function ContactLensesPage({ setCurrentRoute, onSelectProduct, onOpenLensModal }) {
  const { products } = useShop();

  const contactProducts = products.filter(p => p.type === 'contact-lenses');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-16">
      
      {/* Hero */}
      <div className="bg-gradient-to-r from-blue-900 via-teal-900 to-slate-900 text-white p-8 sm:p-12 rounded-3xl space-y-4 shadow-xl">
        <div className="inline-flex items-center gap-2 bg-white/10 text-teal-300 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
          <Layers className="w-3.5 h-3.5" /> High Oxygen Permeability & Hydration
        </div>
        <h1 className="font-display text-3xl sm:text-4xl font-extrabold max-w-xl">
          Breathable Contact Lenses for All-Day Freshness
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-lg leading-relaxed">
          Daily and monthly disposable contact lenses crafted with 58% moisture lock technology to prevent dry eyes, redness, and irritation.
        </p>
      </div>

      {/* Benefits grid */}
      <div className="grid sm:grid-cols-3 gap-6">
        <div className="p-6 bg-white rounded-3xl border border-slate-200/80 shadow-sm space-y-2">
          <Droplet className="w-8 h-8 text-teal-600 mb-2" />
          <h3 className="font-display font-bold text-slate-900 text-base">58% Water Hydration</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Keeps eyes hydrated and soothingly lubricated even after 14+ hours of continuous wear.
          </p>
        </div>

        <div className="p-6 bg-white rounded-3xl border border-slate-200/80 shadow-sm space-y-2">
          <ShieldCheck className="w-8 h-8 text-blue-600 mb-2" />
          <h3 className="font-display font-bold text-slate-900 text-base">UV Class II Blocking</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Shields corneas from ambient ultraviolet sunlight rays during outdoor work and sports.
          </p>
        </div>

        <div className="p-6 bg-white rounded-3xl border border-slate-200/80 shadow-sm space-y-2">
          <Clock className="w-8 h-8 text-emerald-600 mb-2" />
          <h3 className="font-display font-bold text-slate-900 text-base">Daily & Monthly Sterile Packs</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Choose between convenient single-use daily disposables or cost-effective monthly blisters.
          </p>
        </div>
      </div>

      {/* Catalog */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="font-display font-bold text-2xl text-slate-900">
            Available Contact Lens Blisters
          </h2>
          <span className="text-xs text-slate-500">{contactProducts.length} Options In Stock</span>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {contactProducts.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              onSelectProduct={onSelectProduct}
              onOpenLensModal={onOpenLensModal}
            />
          ))}
        </div>
      </div>

    </div>
  );
}
