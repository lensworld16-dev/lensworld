import React from 'react';
import { 
  Glasses, 
  Award, 
  ShieldCheck, 
  Heart, 
  Eye, 
  Truck, 
  CheckCircle, 
  ArrowRight 
} from 'lucide-react';
import { STORE_PHONE, STORE_EMAIL } from '../utils/whatsappHelper';

export default function AboutPage({ setCurrentRoute }) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-16">
      
      {/* Hero */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 bg-teal-50 text-teal-700 font-extrabold text-xs px-3.5 py-1.5 rounded-full border border-teal-100 uppercase tracking-wider">
          <Glasses className="w-4 h-4" /> About LENS S WORLD
        </div>
        <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 leading-tight">
          Nayi Nazar, Naya Style
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-2xl mx-auto">
          We believe vision care should never be a compromise between astronomical prices and subpar optical clarity. LENS S WORLD delivers factory-direct handcrafted frames paired with certified doctor-grade prescription lenses.
        </p>
      </div>

      {/* Story Grid */}
      <div className="grid md:grid-cols-2 gap-10 items-center">
        <div className="rounded-3xl overflow-hidden shadow-xl bg-slate-100 h-96">
          <img 
            src="https://images.unsplash.com/photo-1591076482161-42ce6da69f67?auto=format&fit=crop&w=1000&q=80" 
            alt="Optical Precision" 
            className="w-full h-full object-cover" 
          />
        </div>

        <div className="space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed">
          <h2 className="font-display font-bold text-2xl text-slate-900">
            Our Vision & Promise
          </h2>
          <p>
            Founded with the philosophy of <em>"Nayi Nazar, Naya Style"</em>, LENS S WORLD reimagined eyewear shopping across India. Every pair is cut and fitted using digital robotic surfacing machines that eliminate optical aberrations and guarantee 100% axis accuracy.
          </p>
          <p>
            Whether you are working 10+ hours on digital screens needing blue-light relief, driving under high-beam glare, or requiring progressive multi-focal correction, our team of seasoned optometrists verifies every prescription before assembly.
          </p>

          <div className="pt-3 grid grid-cols-2 gap-4">
            <div className="p-3.5 bg-slate-50 rounded-2xl border">
              <ShieldCheck className="w-5 h-5 text-teal-700 mb-1" />
              <strong className="text-slate-900 block">100% Genuine</strong>
              <span className="text-[11px] text-slate-500">Certified Optical Quality</span>
            </div>
            <div className="p-3.5 bg-slate-50 rounded-2xl border">
              <Award className="w-5 h-5 text-teal-700 mb-1" />
              <strong className="text-slate-900 block">GST Tax Invoices</strong>
              <span className="text-[11px] text-slate-500">Official Claimable Billing</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
