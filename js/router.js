// LENS S WORLD - Hash Router
import { UI } from './ui.js';
import { store } from './store.js';

export function handleRoute() {
  const mainApp = document.getElementById('app-main');
  if (!mainApp) return;

  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' });

  // Parse path & params (supports both hash routing and Cashfree return_url pathname)
  let path = '';
  let params = new URLSearchParams();

  if (window.location.pathname && window.location.pathname.startsWith('/order-success')) {
    path = 'order-success';
    params = new URLSearchParams(window.location.search);
  } else {
    const hash = window.location.hash || '#home';
    const [pathWithHash, queryString] = hash.split('?');
    path = pathWithHash.replace('#', '');
    params = new URLSearchParams(queryString || window.location.search || '');
  }

  // Update active nav links
  document.querySelectorAll('.nav-menu-item a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === window.location.hash || (href === '#shop' && path === 'shop')) {
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
      const tag = params.get('tag') || 'all';
      const sort = params.get('sort') || 'latest';
      mainApp.innerHTML = UI.renderShopPage({ category, gender, tag, sort });
    } else if (path.startsWith('product/')) {
      const productId = path.replace('product/', '');
      mainApp.innerHTML = UI.renderProductDetailPage(productId);
    } else if (path === 'cart') {
      mainApp.innerHTML = UI.renderCartPage();
    } else if (path === 'checkout') {
      mainApp.innerHTML = UI.renderCheckoutPage();
    } else if (path === 'order-success') {
      const orderId = params.get('id') || params.get('order_id') || params.get('cf_id');
      mainApp.innerHTML = UI.renderOrderSuccessPage(orderId);
    } else if (path === 'track' || path === 'track-order') {
      const orderId = params.get('id') || params.get('order_id') || '';
      mainApp.innerHTML = UI.renderTrackOrderPage(orderId);
    } else if (path === 'lenses-guide') {
      mainApp.innerHTML = UI.renderLensGuidePage();
    } else if (path === 'admin') {
      const tab = params.get('tab') || 'orders';
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
