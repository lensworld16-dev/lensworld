import React from 'react';
import { 
  Glasses, 
  Phone, 
  Mail, 
  MessageCircle, 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  Award,
  CreditCard,
  Lock,
  LayoutDashboard
} from 'lucide-react';
import { 
  STORE_PHONE, 
  STORE_EMAIL, 
  STORE_INSTAGRAM, 
  STORE_FACEBOOK, 
  getWhatsAppUrl 
} from '../utils/whatsappHelper';

export default function Footer({ setCurrentRoute, onSelectCategory }) {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800">
      
      {/* 1. Value Proposition Grid */}
      <div className="border-b border-slate-800 bg-slate-950/60 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-teal-500/10 text-teal-400 flex items-center justify-center shrink-0 border border-teal-500/20">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">100% Genuine Eyewear</h4>
              <p className="text-xs text-slate-400 mt-0.5">Authentic frames with GST tax invoices</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/20">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">Doctor Precision Lenses</h4>
              <p className="text-xs text-slate-400 mt-0.5">Automated computerized lens cutting</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/20">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">Fast Pan-India Delivery</h4>
              <p className="text-xs text-slate-400 mt-0.5">Dispatched in safe hard protective cases</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-rose-500/10 text-rose-400 flex items-center justify-center shrink-0 border border-rose-500/20">
              <RotateCcw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">Hassle-Free Returns</h4>
              <p className="text-xs text-slate-400 mt-0.5">Easy 7-day exchange & power guarantee</p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div 
              onClick={() => setCurrentRoute({ name: 'home' })}
              className="cursor-pointer"
            >
              <img 
                src="images/lenss_world_logo_with_name-removebg-preview.png" 
                alt="LENS S WORLD" 
                className="h-12 max-w-[220px] object-contain mb-2"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  if (e.currentTarget.nextSibling) e.currentTarget.nextSibling.style.display = 'flex';
                }}
              />
              <div className="hidden items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center shadow-lg">
                  <Glasses className="w-6 h-6" />
                </div>
                <div>
                  <span className="block font-display text-2xl font-bold tracking-tight text-white leading-none">
                    LENS <span className="text-teal-400">S</span> WORLD
                  </span>
                  <span className="block text-[9px] font-bold tracking-[0.22em] text-teal-400 uppercase mt-0.5">
                    Nayi Nazar, Naya Style
                  </span>
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              LENS S WORLD is India's modern optical destination offering premium designer eyeglasses, polarized sunglasses, blue-cut computer lenses, and contact lenses at fair factory prices.
            </p>

            {/* Contact quick badges */}
            <div className="space-y-2 pt-2 text-xs">
              <a 
                href={`tel:${STORE_PHONE}`}
                className="flex items-center gap-2 text-slate-300 hover:text-teal-400 transition"
              >
                <Phone className="w-4 h-4 text-teal-400" /> {STORE_PHONE}
              </a>
              <a 
                href={`mailto:${STORE_EMAIL}`}
                className="flex items-center gap-2 text-slate-300 hover:text-teal-400 transition"
              >
                <Mail className="w-4 h-4 text-teal-400" /> {STORE_EMAIL}
              </a>
            </div>

            {/* Social Icons */}
            <div className="flex items-center gap-3 pt-2">
              <a 
                href={STORE_INSTAGRAM} 
                target="_blank" 
                rel="noreferrer"
                className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-gradient-to-tr hover:from-amber-500 hover:to-rose-500 text-white flex items-center justify-center transition shadow"
                title="Instagram"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              </a>
              <a 
                href={STORE_FACEBOOK} 
                target="_blank" 
                rel="noreferrer"
                className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-blue-600 text-white flex items-center justify-center transition shadow"
                title="Facebook"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M9 8H6v4h3v12h5V12h3.642L18 8h-4V6.333C14 5.374 14.5 5 15.667 5H18V0h-3.889C10.667 0 9 1.636 9 4.889V8z"/></svg>
              </a>
              <a 
                href={getWhatsAppUrl("Hello LENS S WORLD, I need help.")} 
                target="_blank" 
                rel="noreferrer"
                className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-emerald-600 text-white flex items-center justify-center transition shadow"
                title="WhatsApp Support"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Shop Categories */}
          <div>
            <h3 className="font-bold text-white text-sm tracking-wider uppercase mb-4">
              Eyewear Catalog
            </h3>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <button 
                  onClick={() => { onSelectCategory('eyeglasses'); setCurrentRoute({ name: 'shop' }); }}
                  className="hover:text-white transition"
                >
                  Eyeglasses
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { onSelectCategory('sunglasses'); setCurrentRoute({ name: 'shop' }); }}
                  className="hover:text-white transition"
                >
                  Sunglasses
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { onSelectCategory('power-specs'); setCurrentRoute({ name: 'shop' }); }}
                  className="hover:text-white transition"
                >
                  Power Specs
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { onSelectCategory('contact-lenses'); setCurrentRoute({ name: 'shop' }); }}
                  className="hover:text-white transition"
                >
                  Contact Lens
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { onSelectCategory('reading-glasses'); setCurrentRoute({ name: 'shop' }); }}
                  className="hover:text-white transition"
                >
                  Readers
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { onSelectCategory('lenses'); setCurrentRoute({ name: 'shop' }); }}
                  className="hover:text-white transition"
                >
                  Lens
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { onSelectCategory('accessories'); setCurrentRoute({ name: 'shop' }); }}
                  className="hover:text-white transition"
                >
                  Accessories
                </button>
              </li>
            </ul>
          </div>

          {/* Collections by Gender */}
          <div>
            <h3 className="font-bold text-white text-sm tracking-wider uppercase mb-4">
              Collections
            </h3>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <button 
                  onClick={() => { onSelectCategory('men'); setCurrentRoute({ name: 'shop' }); }}
                  className="hover:text-white transition"
                >
                  Men's Eyewear
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { onSelectCategory('women'); setCurrentRoute({ name: 'shop' }); }}
                  className="hover:text-white transition"
                >
                  Women's Eyewear
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { onSelectCategory('kids'); setCurrentRoute({ name: 'shop' }); }}
                  className="hover:text-white transition"
                >
                  Kids' Flexible Frames
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { onSelectCategory('couple'); setCurrentRoute({ name: 'shop' }); }}
                  className="hover:text-white transition"
                >
                  Couple & Unisex Pairs
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setCurrentRoute({ name: 'offers' })}
                  className="text-amber-400 hover:text-amber-300 font-bold transition flex items-center gap-1"
                >
                  🔥 Summer 50% Off Deals
                </button>
              </li>
            </ul>
          </div>

          {/* Customer Care & Admin */}
          <div>
            <h3 className="font-bold text-white text-sm tracking-wider uppercase mb-4">
              Help & Information
            </h3>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <button onClick={() => setCurrentRoute({ name: 'track-order' })} className="hover:text-white transition">
                  Track Your Order
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentRoute({ name: 'about' })} className="hover:text-white transition">
                  About LENS S WORLD
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentRoute({ name: 'contact' })} className="hover:text-white transition">
                  Contact Store Support
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentRoute({ name: 'lenses-guide' })} className="hover:text-white transition">
                  Lens Guide & Coatings
                </button>
              </li>
              <li className="pt-3 border-t border-slate-800">
                <button 
                  onClick={() => setCurrentRoute({ name: 'admin' })}
                  className="inline-flex items-center gap-1.5 bg-amber-500/10 text-amber-300 hover:text-amber-200 px-3 py-1.5 rounded-lg border border-amber-500/30 font-bold"
                >
                  <LayoutDashboard className="w-3.5 h-3.5" /> Store Owner Admin Portal
                </button>
              </li>
            </ul>
          </div>

        </div>
      </div>

      {/* 3. Bottom Bar */}
      <div className="border-t border-slate-800 bg-slate-950 py-5 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} LENS S WORLD. All rights reserved. Nayi Nazar, Naya Style.</p>
          <div className="flex items-center gap-4 text-slate-400">
            <span className="flex items-center gap-1"><Lock className="w-3.5 h-3.5 text-teal-400" /> 256-Bit SSL Encryption</span>
            <span>·</span>
            <span>UPI / COD / Cards Accepted</span>
          </div>
        </div>
      </div>

    </footer>
  );
}
