import React, { useState } from 'react';
import { 
  Phone, 
  Mail, 
  MessageCircle, 
  MapPin, 
  Send, 
  Clock, 
  ShieldCheck,
  CheckCircle
} from 'lucide-react';
import { 
  STORE_PHONE, 
  STORE_EMAIL, 
  STORE_INSTAGRAM, 
  STORE_FACEBOOK, 
  getWhatsAppUrl 
} from '../utils/whatsappHelper';
import { useShop } from '../context/ShopContext';
import { supabase } from '../utils/supabaseClient';

export default function ContactPage() {
  const { showToast } = useShop();

  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim()) {
      showToast("Please enter your name and phone number", "error");
      return;
    }

    setSubmitting(true);

    if (supabase) {
      try {
        await supabase.from('inquiries').insert([
          {
            name: form.name.trim(),
            phone: form.phone.trim(),
            email: form.email.trim() || null,
            message: form.message.trim(),
            status: 'New'
          }
        ]);
      } catch (err) {
        console.warn("Supabase inquiry insert:", err);
      }
    }

    setSubmitting(false);
    setSubmitted(true);
    showToast("Thank you! Our optical team will reach out shortly.", "success");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-16">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-extrabold uppercase tracking-widest text-teal-700 bg-teal-50 px-3 py-1 rounded-full border border-teal-100">
          Customer Support & Concierge
        </span>
        <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-slate-900">
          We're Here to Help You See Better
        </h1>
        <p className="text-xs sm:text-sm text-slate-600">
          Have queries about your prescription, lens choice, frame sizing, or delivery? Reach out directly.
        </p>
      </div>

      <div className="grid lg:grid-cols-12 gap-10 items-start">
        
        {/* Left: Contact Info Cards (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Phone Card */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-2">
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center">
              <Phone className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Direct Phone Call</h3>
            <p className="text-xs text-slate-500">Mon - Sat (9:30 AM - 8:30 PM IST)</p>
            <a href={`tel:${STORE_PHONE}`} className="text-sm font-extrabold text-teal-700 block hover:underline">
              {STORE_PHONE}
            </a>
          </div>

          {/* WhatsApp Card */}
          <div className="bg-emerald-50/80 p-6 rounded-3xl border border-emerald-200 shadow-sm space-y-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center">
              <MessageCircle className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">WhatsApp Fast Support</h3>
            <p className="text-xs text-slate-600">Send prescription photos, power questions, or order inquiries.</p>
            <a 
              href={getWhatsAppUrl("Hello LENS S WORLD, I would like to speak to an optometrist.")}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 px-4 py-2 rounded-xl transition shadow"
            >
              <MessageCircle className="w-3.5 h-3.5" /> Chat on WhatsApp ({STORE_PHONE})
            </a>
          </div>

          {/* Email Card */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-2">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
              <Mail className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Official Email</h3>
            <p className="text-xs text-slate-500">For business enquiries, GST invoice queries & feedback</p>
            <a href={`mailto:${STORE_EMAIL}`} className="text-sm font-extrabold text-blue-700 block hover:underline">
              {STORE_EMAIL}
            </a>
          </div>

          {/* Social Media Card */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-950 text-white p-6 rounded-3xl border border-slate-800 shadow-sm space-y-3">
            <h3 className="font-bold text-sm">Follow Us on Social Media</h3>
            <p className="text-xs text-slate-400">Get latest eyewear trends, offers & new arrivals.</p>
            <div className="flex items-center gap-3 pt-1">
              <a 
                href={STORE_INSTAGRAM}
                target="_blank"
                rel="noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-3 bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 hover:opacity-90 text-white text-xs font-bold rounded-xl transition shadow"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                <span>Instagram</span>
              </a>
              <a 
                href={STORE_FACEBOOK}
                target="_blank"
                rel="noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition shadow"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M9 8H6v4h3v12h5V12h3.642L18 8h-4V6.333C14 5.374 14.5 5 15.667 5H18V0h-3.889C10.667 0 9 1.636 9 4.889V8z"/></svg>
                <span>Facebook</span>
              </a>
            </div>
          </div>

        </div>

        {/* Right: Message Form (7 cols) */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-6">
          <h3 className="font-display font-bold text-slate-900 text-xl">
            Send Us a Message
          </h3>

          {submitted ? (
            <div className="p-8 text-center bg-emerald-50 rounded-2xl border border-emerald-200 space-y-3">
              <CheckCircle className="w-10 h-10 text-emerald-600 mx-auto" />
              <h4 className="font-bold text-slate-900 text-base">Message Sent Successfully</h4>
              <p className="text-xs text-slate-600">Our customer care representative will contact you via phone/WhatsApp within 2 hours.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Your Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ankit Sharma"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full p-3 bg-slate-50 border rounded-xl outline-none font-medium"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">10-Digit Mobile Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 9820123456"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full p-3 bg-slate-50 border rounded-xl outline-none font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Email Address</label>
                <input
                  type="email"
                  placeholder="e.g. ankit@example.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full p-3 bg-slate-50 border rounded-xl outline-none font-medium"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">How can we help you? *</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Ask about prescription powers, frame fits, order status, or custom lens coatings..."
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="w-full p-3 bg-slate-50 border rounded-xl outline-none font-medium"
                />
              </div>

              <button
                type="submit"
                className="px-8 py-3.5 bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs rounded-xl shadow-lg shadow-teal-700/20 transition flex items-center gap-2"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit Inquiry</span>
              </button>
            </form>
          )}
        </div>

      </div>

    </div>
  );
}
