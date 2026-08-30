import React from 'react';
import { 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  Award, 
  Truck, 
  Glasses, 
  Sun, 
  Eye, 
  Layers, 
  BookOpen, 
  MessageCircle, 
  Star, 
  CheckCircle,
  TrendingUp,
  Percent,
  Check
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import ProductCard from '../components/ProductCard';
import { GENDER_COLLECTIONS, CATEGORIES } from '../data/productsData';
import { LENS_PACKAGES } from '../data/lensesData';
import { getWhatsAppUrl, STORE_PHONE } from '../utils/whatsappHelper';

export default function HomePage({ setCurrentRoute, onSelectCategory, onSelectProduct, onOpenLensModal }) {
  const { products } = useShop();

  const bestSellers = products.filter(p => p.bestSeller).slice(0, 4);
  const newArrivals = products.filter(p => p.isNew || p.type === 'sunglasses').slice(0, 4);
  const featuredReaders = products.filter(p => p.type === 'reading-glasses').slice(0, 4);

  const testimonials = [
    {
      name: "Vikram Malhotra",
      location: "New Delhi",
      rating: 5,
      comment: "Ordered the Orbit Round Metal with Blue Cut lenses. The quality is easily comparable to 4000+ Rs showroom frames. Packaging with hard case was top notch!",
      item: "Orbit Round Metal (Gold / Tortoise)"
    },
    {
      name: "Sneha Mukherjee",
      location: "Kolkata",
      rating: 5,
      comment: "Bella Cat-Eye frame is extremely lightweight and stylish! Uploaded my doctor prescription on WhatsApp and got my glasses delivered in 3 days. Super smooth experience.",
      item: "Bella Cat-Eye (Champagne)"
    },
    {
      name: "Karthik Raja",
      location: "Bengaluru",
      rating: 5,
      comment: "Solaro Aviator polarized sunglasses are incredible for driving in bright sun. Zero glare and looks very luxurious. Highly recommend LENS S WORLD!",
      item: "Solaro Aviator (Dark Green Polarized)"
    }
  ];

  const faqs = [
    {
      q: "How do I provide my eye prescription?",
      a: "You can either upload a photo/PDF of your optical prescription slip directly during customization, enter the power values manually (SPH/CYL/AXIS), or select 'Send Later via WhatsApp' to message us after placing your order."
    },
    {
      q: "What is the difference between Blue Cut and Anti-Glare ARC lenses?",
      a: "Anti-Glare ARC eliminates reflection and headlight glare for night driving and crystal clear photos. Blue Cut has all ARC benefits PLUS a specialized filter that blocks 90%+ of harmful blue light from screens and mobile phones."
    },
    {
      q: "Do I get a GST Tax Invoice with my order?",
      a: "Yes! Every single order comes with a legitimate computerized GST Tax Invoice that you can download immediately or receive in your package for reimbursement/tax claims."
    },
    {
      q: "How fast is the delivery across India?",
      a: "Frame-only orders dispatch in 24 hours. Custom prescription and Progressive lens orders take 2-3 business days for precision laboratory cutting and quality checks before express dispatch."
    }
  ];

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-850 to-teal-950 text-white pt-12 pb-20 lg:pt-20 lg:pb-28">
        {/* Ambient Glows */}
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Copy */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-teal-500/15 border border-teal-400/30 text-teal-300 px-3.5 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase">
                <Sparkles className="w-3 h-3" /> LENS S WORLD — NAYI NAZAR, NAYA STYLE
              </div>

              <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
                See Sharper. <br />
                <span className="bg-gradient-to-r from-teal-300 via-teal-100 to-amber-300 bg-clip-text text-transparent">
                  Look Bolder.
                </span>
              </h1>

              <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto lg:mx-0 leading-relaxed">
                Discover handcrafted eyeglasses, polarized sunglasses, and doctor-approved prescription lenses engineered for digital comfort and everyday flair.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-1">
                <button
                  onClick={() => {
                    onSelectCategory('eyeglasses');
                    setCurrentRoute({ name: 'shop' });
                  }}
                  className="px-6 py-3 bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs rounded-full shadow-lg shadow-teal-600/30 transition transform hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-2"
                >
                  <span>Shop Eyeglasses</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => {
                    onSelectCategory('sunglasses');
                    setCurrentRoute({ name: 'shop' });
                  }}
                  className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-full backdrop-blur border border-white/20 transition transform hover:-translate-y-0.5"
                >
                  Explore Sunglasses
                </button>

                <button
                  onClick={() => setCurrentRoute({ name: 'lenses-guide' })}
                  className="px-4 py-3 text-xs font-bold text-teal-300 hover:text-white transition flex items-center gap-1"
                >
                  <Eye className="w-3.5 h-3.5" /> Lens Guide
                </button>
              </div>

              {/* Trust Badges Bar */}
              <div className="pt-4 border-t border-white/10 grid grid-cols-3 gap-3 text-center lg:text-left text-xs text-slate-300">
                <div>
                  <div className="font-extrabold text-white text-sm sm:text-base">12,400+</div>
                  <div className="text-[10px] text-slate-400">Happy Shoppers</div>
                </div>
                <div>
                  <div className="font-extrabold text-white text-sm sm:text-base">100% Genuine</div>
                  <div className="text-[10px] text-slate-400">GST Tax Invoices</div>
                </div>
                <div>
                  <div className="font-extrabold text-white text-sm sm:text-base">Zero Hassle</div>
                  <div className="text-[10px] text-slate-400">7-Day Exchange</div>
                </div>
              </div>
            </div>

            {/* Right Hero Image Card */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md rounded-3xl overflow-hidden shadow-2xl border border-white/15 bg-white/5 backdrop-blur group">
                <img
                  src="https://images.unsplash.com/photo-1574258495973-f010dfbb5371?auto=format&fit=crop&w=1000&q=80"
                  alt="LENS S WORLD Eyewear"
                  className="w-full h-[420px] object-cover group-hover:scale-105 transition-transform duration-700"
                />
                
                {/* Floating Glass Pill */}
                <div className="absolute bottom-5 inset-x-5 p-4 rounded-2xl bg-slate-900/85 backdrop-blur-md border border-white/20 text-white flex items-center justify-between shadow-xl">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-teal-400 tracking-wider">Featured Frame</span>
                    <h4 className="font-bold text-sm">Orbit Round Metal</h4>
                    <p className="text-xs text-slate-300">₹1,899 · Blue Cut Ready</p>
                  </div>
                  <button
                    onClick={() => {
                      const orbit = products.find(p => p.id === 'lens-s-world-orbit-round-metal');
                      if (orbit) onSelectProduct(orbit);
                    }}
                    className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold rounded-xl shadow transition"
                  >
                    View Pair
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. Quick Category Icons Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {CATEGORIES.filter(c => c.key !== 'all').map(cat => (
            <button
              key={cat.key}
              onClick={() => {
                if (cat.key === 'offers') {
                  setCurrentRoute({ name: 'offers' });
                } else if (cat.key === 'lenses') {
                  setCurrentRoute({ name: 'lenses-guide' });
                } else if (cat.key === 'contact-lenses') {
                  setCurrentRoute({ name: 'contact-lenses' });
                } else if (cat.key === 'reading-glasses') {
                  setCurrentRoute({ name: 'reading-glasses' });
                } else {
                  onSelectCategory(cat.key);
                  setCurrentRoute({ name: 'shop' });
                }
              }}
              className="p-4 rounded-2xl bg-white border border-slate-200/80 hover:border-teal-600 hover:shadow-lg transition-all text-center flex flex-col items-center gap-2 group"
            >
              <div className="w-12 h-12 rounded-2xl bg-slate-100 group-hover:bg-teal-50 text-slate-700 group-hover:text-teal-700 flex items-center justify-center transition">
                {cat.key === 'eyeglasses' && <Glasses className="w-6 h-6" />}
                {cat.key === 'sunglasses' && <Sun className="w-6 h-6" />}
                {cat.key === 'lenses' && <Eye className="w-6 h-6" />}
                {cat.key === 'contact-lenses' && <Layers className="w-6 h-6" />}
                {cat.key === 'reading-glasses' && <BookOpen className="w-6 h-6" />}
                {cat.key === 'accessories' && <ShieldCheck className="w-6 h-6" />}
                {cat.key === 'offers' && <Percent className="w-6 h-6 text-rose-600" />}
              </div>
              <span className="text-xs font-bold text-slate-800 group-hover:text-teal-700 transition">
                {cat.label}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* 3. Shop by Gender / Collection */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-widest text-teal-700 block mb-1">
              Curated Collections
            </span>
            <h2 className="font-display text-xl sm:text-2xl font-extrabold text-slate-900">
              Find Your Perfect Fit
            </h2>
          </div>
          <button
            onClick={() => {
              onSelectCategory('all');
              setCurrentRoute({ name: 'shop' });
            }}
            className="text-xs font-bold text-teal-700 hover:text-teal-900 flex items-center gap-1"
          >
            <span>Explore All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {GENDER_COLLECTIONS.map((col) => (
            <div
              key={col.key}
              onClick={() => {
                onSelectCategory(col.key);
                setCurrentRoute({ name: 'shop' });
              }}
              className="group relative h-96 rounded-3xl overflow-hidden cursor-pointer shadow-md hover:shadow-2xl transition duration-500"
            >
              <img 
                src={col.img} 
                alt={col.label} 
                className="w-full h-full object-cover group-hover:scale-110 transition duration-700" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent" />
              
              <div className="absolute bottom-6 inset-x-6 text-white space-y-1">
                <span className="text-[11px] font-semibold text-teal-300 tracking-wider uppercase">
                  {col.tagline}
                </span>
                <h3 className="font-display font-bold text-xl sm:text-2xl">
                  {col.label}
                </h3>
                <div className="pt-2 flex items-center gap-1 text-xs font-bold text-teal-200 group-hover:text-white group-hover:translate-x-1 transition duration-300">
                  <span>Shop Collection</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Best Seller Eyewear Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-widest text-teal-700 block mb-1">
              Customer Favorites
            </span>
            <h2 className="font-display text-xl sm:text-2xl font-extrabold text-slate-900">
              Trending Bestsellers
            </h2>
          </div>
          <button
            onClick={() => {
              onSelectCategory('all');
              setCurrentRoute({ name: 'shop' });
            }}
            className="text-xs font-bold text-teal-700 hover:text-teal-900 flex items-center gap-1"
          >
            <span>View All ({products.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {bestSellers.map(product => (
            <ProductCard 
              key={product.id} 
              product={product} 
              onSelectProduct={onSelectProduct}
              onOpenLensModal={onOpenLensModal}
            />
          ))}
        </div>
      </section>

      {/* 4.5. Featured Reading Glasses Collection (4 Items) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-widest text-purple-600 block mb-1">
              Instant Power Specs (+1.00 to +3.00)
            </span>
            <h2 className="font-display text-xl sm:text-2xl font-extrabold text-slate-900">
              Reading Glasses Collection
            </h2>
          </div>
          <button
            onClick={() => {
              onSelectCategory('reading-glasses');
              setCurrentRoute({ name: 'shop' });
            }}
            className="text-xs font-bold text-teal-700 hover:text-teal-900 flex items-center gap-1"
          >
            <span>View All Readers ({products.filter(p => p.type === 'reading-glasses').length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredReaders.map(product => (
            <ProductCard 
              key={product.id} 
              product={product} 
              onSelectProduct={onSelectProduct}
              onOpenLensModal={onOpenLensModal}
            />
          ))}
        </div>
      </section>

      {/* 5. Lens Technology Showcase */}
      <section className="bg-slate-900 text-white py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
            <span className="text-xs font-extrabold uppercase tracking-widest text-teal-400">
              Precision Optical Science
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold">
              Engineered Lens Packages
            </h2>
            <p className="text-xs sm:text-sm text-slate-300">
              Whether you need blue-light relief from screens or seamless progressive focus, we craft lenses to match your lifestyle.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {LENS_PACKAGES.map(lens => (
              <div 
                key={lens.id}
                className="p-6 rounded-3xl bg-slate-800/80 border border-slate-700 hover:border-teal-500 transition-all flex flex-col justify-between"
              >
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider bg-teal-500/20 text-teal-300 px-2.5 py-1 rounded-full border border-teal-400/30">
                    {lens.badge}
                  </span>
                  
                  <h3 className="font-display font-bold text-lg mt-3 text-white">
                    {lens.name}
                  </h3>
                  
                  <p className="text-[11px] text-teal-300 font-semibold mt-0.5">
                    {lens.tagline}
                  </p>

                  <div className="mt-3 flex items-baseline gap-2">
                    <span className="text-xl font-extrabold text-white">
                      +₹{lens.price.toLocaleString('en-IN')}
                    </span>
                    <span className="text-xs text-slate-400 line-through">
                      ₹{lens.mrp.toLocaleString('en-IN')}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 mt-2.5 leading-relaxed">
                    {lens.description}
                  </p>

                  <ul className="mt-3 space-y-1.5 text-xs text-slate-300">
                    {lens.features.map((f, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <Check className="w-3.5 h-3.5 text-teal-400 shrink-0 mt-0.5" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={() => setCurrentRoute({ name: 'lenses-guide' })}
                  className="mt-5 w-full py-2.5 bg-slate-700 hover:bg-teal-600 text-white text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5"
                >
                  Learn More <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Promotional Banner: Summer Sale */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-teal-900 via-teal-800 to-slate-900 p-6 sm:p-10 text-white shadow-xl">
          <div className="max-w-xl space-y-3">
            <span className="bg-amber-400 text-slate-950 text-[11px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
              Limited Time Summer Offer
            </span>
            
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold leading-tight">
              Get Flat ₹200 OFF on Orders Above ₹1,200
            </h2>

            <p className="text-xs sm:text-sm text-teal-100 leading-relaxed">
              Use promotional coupon code <strong className="bg-white/20 px-2 py-0.5 rounded text-white font-mono font-bold">FLAT200</strong> at checkout. Includes complimentary microfiber cleaner and hard optical case.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={() => {
                  onSelectCategory('eyeglasses');
                  setCurrentRoute({ name: 'shop' });
                }}
                className="px-6 py-3 bg-white text-teal-950 font-bold text-xs rounded-full shadow hover:bg-teal-50 transition"
              >
                Claim Offer & Shop
              </button>
              <button
                onClick={() => setCurrentRoute({ name: 'offers' })}
                className="px-6 py-3 bg-teal-700/50 hover:bg-teal-700 text-white font-bold text-xs rounded-full border border-teal-400/30 transition"
              >
                View All Coupons
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Verified Customer Reviews */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <span className="text-xs font-extrabold uppercase tracking-widest text-teal-700">
            Real Reviews From Real Buyers
          </span>
          <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900">
            Loved By Over 12,000+ Customers Across India
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t, idx) => (
            <div 
              key={idx}
              className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm hover:shadow-md transition space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center gap-1">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic">
                  "{t.comment}"
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-xs text-slate-900 flex items-center gap-1">
                    {t.name} <CheckCircle className="w-3.5 h-3.5 text-teal-600" />
                  </h4>
                  <p className="text-[10px] text-slate-400">{t.location} · Verified Buyer</p>
                </div>
                <span className="text-[10px] text-slate-500 font-medium max-w-[120px] text-right truncate">
                  {t.item}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 8. Frequently Asked Questions */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 space-y-2">
          <span className="text-xs font-extrabold uppercase tracking-widest text-teal-700">
            Got Questions?
          </span>
          <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div key={idx} className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
              <h3 className="font-bold text-sm text-slate-900 mb-2">
                {faq.q}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {faq.a}
              </p>
            </div>
          ))}
        </div>

        {/* WhatsApp Helpline Box */}
        <div className="mt-8 p-6 rounded-3xl bg-emerald-50 border border-emerald-200 text-center space-y-3">
          <MessageCircle className="w-8 h-8 text-emerald-600 mx-auto" />
          <h3 className="font-display font-bold text-slate-900 text-lg">
            Have prescription doubts or need optical advice?
          </h3>
          <p className="text-xs text-slate-600 max-w-md mx-auto">
            Our qualified optometrists are live on WhatsApp to assist you with power entry, lens selection, and frame recommendations.
          </p>
          <a
            href={getWhatsAppUrl("Hello, I need assistance with my prescription power and frame choice.")}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-full shadow transition"
          >
            <MessageCircle className="w-4 h-4" /> Chat with Optometrist ({STORE_PHONE})
          </a>
        </div>
      </section>

    </div>
  );
}
