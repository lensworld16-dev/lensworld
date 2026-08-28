import React, { useState } from 'react';
import { 
  BookOpen, 
  Sparkles, 
  ShieldCheck, 
  Check, 
  HelpCircle, 
  ArrowRight,
  Eye
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import ProductCard from '../components/ProductCard';

export default function ReadingGlassesPage({ setCurrentRoute, onSelectProduct, onOpenLensModal }) {
  const { products } = useShop();

  const readingProducts = products.filter(p => p.type === 'reading-glasses');

  const readingPowers = ["+1.00", "+1.25", "+1.50", "+1.75", "+2.00", "+2.25", "+2.50", "+2.75", "+3.00", "+3.50"];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-16">
      
      {/* Hero */}
      <div className="bg-gradient-to-r from-amber-900 via-amber-800 to-slate-900 text-white p-8 sm:p-12 rounded-3xl space-y-4 shadow-xl">
        <div className="inline-flex items-center gap-2 bg-white/10 text-amber-300 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
          <BookOpen className="w-3.5 h-3.5" /> Ready-to-Wear Optical Power Readers
        </div>
        <h1 className="font-display text-3xl sm:text-4xl font-extrabold max-w-xl">
          Crystal Clear Reading & Screen Clarity
        </h1>
        <p className="text-xs sm:text-sm text-amber-100 max-w-lg leading-relaxed">
          Enjoy effortless close-up focus on smartphones, newspapers, books, and laptops with lightweight Swiss TR90 and metal readers.
        </p>
      </div>

      {/* Reading Power Guide Box */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
        <h3 className="font-display font-bold text-slate-900 text-lg flex items-center gap-2">
          <Eye className="w-5 h-5 text-teal-700" /> Standard Age-to-Power Reading Chart Guide
        </h3>
        <p className="text-xs text-slate-500">
          If you haven't consulted an eye doctor recently, you can refer to the approximate optical power chart below:
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 bg-slate-50 rounded-xl border">
            <span className="text-slate-400 block text-[10px] font-bold">Age 40 - 44</span>
            <span className="font-bold text-slate-900 text-sm">+1.00 to +1.25 D</span>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border">
            <span className="text-slate-400 block text-[10px] font-bold">Age 45 - 49</span>
            <span className="font-bold text-slate-900 text-sm">+1.50 to +1.75 D</span>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border">
            <span className="text-slate-400 block text-[10px] font-bold">Age 50 - 54</span>
            <span className="font-bold text-slate-900 text-sm">+2.00 to +2.25 D</span>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border">
            <span className="text-slate-400 block text-[10px] font-bold">Age 55+</span>
            <span className="font-bold text-slate-900 text-sm">+2.50 to +3.50 D</span>
          </div>
        </div>
      </div>

      {/* Catalog */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="font-display font-bold text-2xl text-slate-900">
            Available Reading Spectacles
          </h2>
          <span className="text-xs text-slate-500">{readingProducts.length} Styles In Stock</span>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {readingProducts.map(product => (
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
