// LENS S WORLD - Hash Router
import { UI } from './ui.js';
import { store } from './store.js';

export function handleRoute() {
  const hash = window.location.hash || '#home';
  const mainApp = document.getElementById('app-main');
  if (!mainApp) return;

  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' });

  // Parse path & params
  const [pathWithHash, queryString] = hash.split('?');
  const path = pathWithHash.replace('#', '');
  const params = new URLSearchParams(queryString || '');

  // Update active nav links
  document.querySelectorAll('.nav-menu-item a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === hash || (href === '#shop' && path === 'shop')) {
      a.classList.add('active');
    } else {
      a.classList.remove('active');
    }
  });

  try {
    if (path === '' || path === 'home') {
      mainApp.innerHTML = UI.renderHomePage();
    } else if (path === 'shop') {
      const category = params.get('category') || 'all';
      const gender = params.get('gender') || 'all';
      const sort = params.get('sort') || 'latest';
      mainApp.innerHTML = UI.renderShopPage({ category, gender, sort });
    } else if (path.startsWith('product/')) {
      const productId = path.replace('product/', '');
      mainApp.innerHTML = UI.renderProductDetailPage(productId);
    } else if (path === 'cart') {
      mainApp.innerHTML = UI.renderCartPage();
    } else if (path === 'checkout') {
      mainApp.innerHTML = UI.renderCheckoutPage();
    } else if (path === 'order-success') {
      const orderId = params.get('id');
      mainApp.innerHTML = UI.renderOrderSuccessPage(orderId);
    } else if (path === 'track' || path === 'track-order') {
      const orderId = params.get('id') || '';
      mainApp.innerHTML = UI.renderTrackOrderPage(orderId);
    } else if (path === 'lenses-guide') {
      mainApp.innerHTML = UI.renderLensGuidePage();
    } else if (path === 'admin') {
      const tab = params.get('tab') || 'products';
      mainApp.innerHTML = UI.renderAdminDashboard(tab);
    } else if (path === 'wishlist') {
      mainApp.innerHTML = UI.renderWishlistPage();
    } else {
      mainApp.innerHTML = UI.renderHomePage();
    }
  } catch (err) {
    console.error("Routing render error:", err);
    mainApp.innerHTML = UI.renderHomePage();
  }

  UI.updateNavBadges();
}

export function initRouter() {
  window.addEventListener('hashchange', handleRoute);
  window.addEventListener('DOMContentLoaded', handleRoute);
}
