import React, { useState, useEffect } from 'react';
import { ShopProvider, useShop } from './context/ShopContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import QuickViewModal from './components/QuickViewModal';
import LensCustomizerModal from './components/LensCustomizerModal';

// Pages
import HomePage from './pages/HomePage';
import ShopPage from './pages/ShopPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderSuccessPage from './pages/OrderSuccessPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import LensGuidePage from './pages/LensGuidePage';
import ContactLensesPage from './pages/ContactLensesPage';
import ReadingGlassesPage from './pages/ReadingGlassesPage';
import OffersPage from './pages/OffersPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import TrackOrderPage from './pages/TrackOrderPage';

import { MessageCircle, ArrowUp } from 'lucide-react';
import { getWhatsAppUrl, STORE_PHONE } from './utils/whatsappHelper';

function AppContent() {
  // Navigation State
  const [currentRoute, setCurrentRoute] = useState({ name: 'home' });
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [customizingProduct, setCustomizingProduct] = useState(null);
  const [completedOrder, setCompletedOrder] = useState(null);
  const [showScrollTop, setShowScrollTop] = useState(false);

  const { setCartDrawerOpen } = useShop();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentRoute]);

  // Scroll listener for back-to-top button
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSelectProduct = (product) => {
    setSelectedProductId(product.id);
    setCurrentRoute({ name: 'product-detail', id: product.id });
  };

  const handleOpenLensModal = (product) => {
    setCustomizingProduct(product);
  };

  const handleSelectCategory = (catKey) => {
    setActiveCategory(catKey);
    setCurrentRoute({ name: 'shop' });
  };

  const renderCurrentPage = () => {
    switch (currentRoute.name) {
      case 'home':
        return (
          <HomePage
            setCurrentRoute={setCurrentRoute}
            onSelectCategory={handleSelectCategory}
            onSelectProduct={handleSelectProduct}
            onOpenLensModal={handleOpenLensModal}
          />
        );
      case 'shop':
        return (
          <ShopPage
            activeCategory={activeCategory}
            onSelectCategory={setActiveCategory}
            onSelectProduct={handleSelectProduct}
            onOpenLensModal={handleOpenLensModal}
          />
        );
      case 'product-detail':
        return (
          <ProductDetailPage
            productId={currentRoute.id || selectedProductId}
            setCurrentRoute={setCurrentRoute}
            onSelectProduct={handleSelectProduct}
            onOpenLensModal={handleOpenLensModal}
          />
        );
      case 'cart':
        return (
          <CartPage
            setCurrentRoute={setCurrentRoute}
            onSelectProduct={handleSelectProduct}
          />
        );
      case 'checkout':
        return (
          <CheckoutPage
            setCurrentRoute={setCurrentRoute}
            setCompletedOrder={setCompletedOrder}
          />
        );
      case 'order-success':
        return (
          <OrderSuccessPage
            orderId={currentRoute.orderId}
            completedOrder={completedOrder}
            setCurrentRoute={setCurrentRoute}
          />
        );
      case 'admin':
        return (
          <AdminDashboardPage
            setCurrentRoute={setCurrentRoute}
          />
        );
      case 'lenses-guide':
        return (
          <LensGuidePage
            setCurrentRoute={setCurrentRoute}
            onSelectCategory={handleSelectCategory}
          />
        );
      case 'contact-lenses':
        return (
          <ContactLensesPage
            setCurrentRoute={setCurrentRoute}
            onSelectProduct={handleSelectProduct}
            onOpenLensModal={handleOpenLensModal}
          />
        );
      case 'reading-glasses':
        return (
          <ReadingGlassesPage
            setCurrentRoute={setCurrentRoute}
            onSelectProduct={handleSelectProduct}
            onOpenLensModal={handleOpenLensModal}
          />
        );
      case 'offers':
        return (
          <OffersPage
            setCurrentRoute={setCurrentRoute}
            onSelectCategory={handleSelectCategory}
          />
        );
      case 'about':
        return (
          <AboutPage
            setCurrentRoute={setCurrentRoute}
          />
        );
      case 'contact':
        return (
          <ContactPage />
        );
      case 'track-order':
        return (
          <TrackOrderPage
            setCurrentRoute={setCurrentRoute}
          />
        );
      case 'wishlist':
        return (
          <ShopPage
            activeCategory="all"
            onSelectCategory={setActiveCategory}
            onSelectProduct={handleSelectProduct}
            onOpenLensModal={handleOpenLensModal}
          />
        );
      default:
        return (
          <HomePage
            setCurrentRoute={setCurrentRoute}
            onSelectCategory={handleSelectCategory}
            onSelectProduct={handleSelectProduct}
            onOpenLensModal={handleOpenLensModal}
          />
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-teal-700 selection:text-white">
      {/* Main Header / Navigation */}
      <Navbar
        currentRoute={currentRoute}
        setCurrentRoute={setCurrentRoute}
        onSelectCategory={handleSelectCategory}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {renderCurrentPage()}
      </main>

      {/* Main Footer */}
      <Footer
        setCurrentRoute={setCurrentRoute}
        onSelectCategory={handleSelectCategory}
      />

      {/* Slide-over Cart Drawer */}
      <CartDrawer
        onProceedToCheckout={() => setCurrentRoute({ name: 'checkout' })}
        onOpenCartPage={() => setCurrentRoute({ name: 'cart' })}
      />

      {/* Quick View Modal */}
      <QuickViewModal
        onOpenLensModal={handleOpenLensModal}
        onNavigateToProduct={handleSelectProduct}
      />

      {/* Step-by-Step Lens Customizer Modal */}
      {customizingProduct && (
        <LensCustomizerModal
          product={customizingProduct}
          onClose={() => setCustomizingProduct(null)}
        />
      )}

      {/* Floating WhatsApp Action Button */}
      <a
        href={getWhatsAppUrl("Hello LENS S WORLD, I would like to enquire about eyewear.")}
        target="_blank"
        rel="noreferrer"
        className="fixed bottom-6 left-6 z-40 bg-emerald-500 hover:bg-emerald-600 text-white p-3.5 sm:px-4 sm:py-3 rounded-full shadow-2xl flex items-center gap-2 hover:scale-105 transition transform active:scale-95 group"
        title="WhatsApp Support"
      >
        <MessageCircle className="w-5 h-5" />
        <span className="hidden sm:inline text-xs font-bold tracking-wide">
          Need Optical Help?
        </span>
      </a>

      {/* Floating Scroll-to-Top Button */}
      {showScrollTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-6 right-6 z-40 bg-slate-900/80 hover:bg-slate-900 text-white p-3 rounded-full shadow-xl backdrop-blur transition transform hover:-translate-y-1"
          title="Scroll to Top"
        >
          <ArrowUp className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}

export default function App() {
  return (
    <ShopProvider>
      <AppContent />
    </ShopProvider>
  );
}
