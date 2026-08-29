// LENS S WORLD - Reactive State Manager (LocalStorage Powered)
import { INITIAL_PRODUCTS, INITIAL_MOCK_ORDERS, COUPONS, STORE_INFO, CATEGORIES, LENS_PACKAGES, DEFAULT_CATEGORY_IMAGES } from './data.js';

class Store {
  constructor() {
    this.listeners = new Set();

    // 1. Products State
    try {
      const initialMap = new Map(INITIAL_PRODUCTS.map(p => [p.id, p]));
      const saved = localStorage.getItem("lsw_products");
      if (saved) {
        const parsed = JSON.parse(saved);
        parsed.forEach(p => {
          if (initialMap.has(p.id)) {
            // Keep admin edits like price, stock, and updated images
            const orig = initialMap.get(p.id);
            initialMap.set(p.id, { ...orig, ...p, img: p.img || orig.img, gallery: p.gallery || orig.gallery });
          } else {
            initialMap.set(p.id, p);
          }
        });
      }
      this.products = Array.from(initialMap.values());
      this.saveProducts();
    } catch {
      this.products = INITIAL_PRODUCTS;
    }

    // 2. Cart State
    try {
      const saved = localStorage.getItem("lsw_cart");
      this.cart = saved ? JSON.parse(saved) : [];
    } catch {
      this.cart = [];
    }

    // 3. Wishlist State
    try {
      const saved = localStorage.getItem("lsw_wishlist");
      this.wishlist = saved ? JSON.parse(saved) : ["lens-s-world-orbit-round-metal", "lens-s-world-solaro-aviator"];
    } catch {
      this.wishlist = ["lens-s-world-orbit-round-metal", "lens-s-world-solaro-aviator"];
    }

    // 4. Orders State
    try {
      const saved = localStorage.getItem("lsw_orders");
      this.orders = saved ? JSON.parse(saved) : INITIAL_MOCK_ORDERS;
    } catch {
      this.orders = INITIAL_MOCK_ORDERS;
    }

    // 5. Categories State
    try {
      const saved = localStorage.getItem("lsw_categories");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.some(c => c.key === 'lenses-guide') || !parsed.some(c => c.key === 'power-specs')) {
          this.categories = CATEGORIES;
          localStorage.setItem("lsw_categories", JSON.stringify(CATEGORIES));
        } else {
          this.categories = parsed;
        }
      } else {
        this.categories = CATEGORIES;
      }
    } catch {
      this.categories = CATEGORIES;
    }

    // 6. Lens Packages State
    try {
      const saved = localStorage.getItem("lsw_lens_packages");
      this.lensPackages = saved ? JSON.parse(saved) : LENS_PACKAGES;
    } catch {
      this.lensPackages = LENS_PACKAGES;
    }

    // 7. Coupons State
    try {
      const saved = localStorage.getItem("lsw_coupons");
      this.coupons = saved ? JSON.parse(saved) : COUPONS;
    } catch {
      this.coupons = COUPONS;
    }

    // 8. Store Settings State
    try {
      const saved = localStorage.getItem("lsw_settings");
      this.storeSettings = saved ? JSON.parse(saved) : STORE_INFO;
    } catch {
      this.storeSettings = STORE_INFO;
    }

    // 9. Category & Demographic Banner Images State
    try {
      const saved = localStorage.getItem("lsw_category_images");
      this.categoryImages = saved ? { ...DEFAULT_CATEGORY_IMAGES, ...JSON.parse(saved) } : DEFAULT_CATEGORY_IMAGES;
    } catch {
      this.categoryImages = DEFAULT_CATEGORY_IMAGES;
    }

    // 10. Active coupon & UI
    this.appliedCoupon = null;
    this.couponError = "";
    this.cartDrawerOpen = false;
    this.quickViewProductId = null;
    this.customizingProductId = null;
  }

  saveCategoryImages(images) {
    this.categoryImages = { ...this.categoryImages, ...images };
    try {
      localStorage.setItem("lsw_category_images", JSON.stringify(this.categoryImages));
    } catch (e) {
      console.warn("Storage write error", e);
    }
    this.notify("CATEGORY_IMAGES_UPDATED", this.categoryImages);
  }

  getCatImg(key, fallback = "") {
    return this.categoryImages?.[key] || DEFAULT_CATEGORY_IMAGES[key] || fallback;
  }

  // Subscribe to changes
  subscribe(fn) {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }

  notify(eventType, data) {
    for (const fn of this.listeners) {
      try {
        fn(eventType, data, this);
      } catch (err) {
        console.error("Store listener error:", err);
      }
    }
  }

  // Persistence Helpers
  saveProducts() {
    try {
      localStorage.setItem("lsw_products", JSON.stringify(this.products));
    } catch (e) {
      console.error(e);
    }
  }

  saveCart() {
    try {
      localStorage.setItem("lsw_cart", JSON.stringify(this.cart));
    } catch (e) {
      console.error(e);
    }
  }

  saveWishlist() {
    try {
      localStorage.setItem("lsw_wishlist", JSON.stringify(this.wishlist));
    } catch (e) {
      console.error(e);
    }
  }

  saveOrders() {
    try {
      localStorage.setItem("lsw_orders", JSON.stringify(this.orders));
    } catch (e) {
      console.error(e);
    }
  }

  saveCategories() {
    try {
      localStorage.setItem("lsw_categories", JSON.stringify(this.categories));
    } catch (e) {
      console.error(e);
    }
  }

  saveLensPackages() {
    try {
      localStorage.setItem("lsw_lens_packages", JSON.stringify(this.lensPackages));
    } catch (e) {
      console.error(e);
    }
  }

  saveCoupons() {
    try {
      localStorage.setItem("lsw_coupons", JSON.stringify(this.coupons));
    } catch (e) {
      console.error(e);
    }
  }

  saveStoreSettings() {
    try {
      localStorage.setItem("lsw_settings", JSON.stringify(this.storeSettings));
    } catch (e) {
      console.error(e);
    }
  }

  // Toast Notification
  showToast(message, type = "success") {
    const toastContainer = document.getElementById("toast-container");
    if (!toastContainer) return;

    const toast = document.createElement("div");
    toast.className = `toast toast-${type} animate-slide-up`;
    
    let iconSvg = '';
    if (type === 'success') {
      iconSvg = '<svg class="w-5 h-5 text-emerald-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>';
    } else if (type === 'error') {
      iconSvg = '<svg class="w-5 h-5 text-rose-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>';
    } else {
      iconSvg = '<svg class="w-5 h-5 text-teal-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>';
    }

    toast.innerHTML = `
      ${iconSvg}
      <span class="toast-text">${message}</span>
    `;

    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.classList.add("toast-fade-out");
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }

  // Get Calculations
  getTotals() {
    const subtotal = this.cart.reduce((sum, item) => {
      const itemUnitPrice = item.price + (item.selectedLens?.price || 0);
      return sum + (itemUnitPrice * item.qty);
    }, 0);

    let discount = 0;
    const activeCoupons = this.coupons || COUPONS;
    if (this.appliedCoupon && activeCoupons[this.appliedCoupon]) {
      const cp = activeCoupons[this.appliedCoupon];
      if (subtotal >= (cp.minOrder || 0)) {
        if (cp.type === "percent") {
          discount = Math.round((subtotal * cp.value) / 100);
        } else if (cp.type === "flat") {
          discount = Math.min(cp.value, subtotal);
        }
      }
    }

    const freeThreshold = this.storeSettings?.freeShippingAbove || STORE_INFO.freeShippingAbove || 499;
    const shipping = (subtotal >= freeThreshold || subtotal === 0 || this.appliedCoupon === "FREESHIP") ? 0 : 79;
    const grandTotal = Math.max(0, subtotal - discount) + shipping;
    const cartCount = this.cart.reduce((count, item) => count + item.qty, 0);

    return {
      subtotal,
      discount,
      shipping,
      gst: 0,
      grandTotal,
      cartCount
    };
  }

  // Cart Methods
  addToCart(product, options = {}) {
    const {
      selectedColor = product.color || (product.colors && product.colors[0]) || "Standard",
      selectedLens = null,
      readingPower = null,
      prescriptionMethod = null,
      prescriptionDetails = null,
      prescriptionFile = null,
      qty = 1
    } = options;

    const cartItemId = `${product.id}-${selectedColor}-${selectedLens?.id || 'frame'}-${readingPower || 'std'}`;
    const existingIdx = this.cart.findIndex(item => item.cartItemId === cartItemId);

    if (existingIdx > -1) {
      this.cart[existingIdx].qty += qty;
    } else {
      this.cart.push({
        ...product,
        cartItemId,
        selectedColor,
        selectedLens,
        readingPower,
        prescriptionMethod,
        prescriptionDetails,
        prescriptionFile,
        qty
      });
    }

    this.saveCart();
    this.showToast(`Added "${product.name}" to cart!`, "success");
    this.openCartDrawer();
    this.notify("cart_updated");
  }

  updateCartQty(cartItemId, newQty) {
    if (newQty <= 0) {
      this.removeFromCart(cartItemId);
      return;
    }
    const item = this.cart.find(i => i.cartItemId === cartItemId);
    if (item) {
      item.qty = newQty;
      this.saveCart();
      this.notify("cart_updated");
    }
  }

  removeFromCart(cartItemId) {
    this.cart = this.cart.filter(item => item.cartItemId !== cartItemId);
    this.saveCart();
    this.showToast("Item removed from cart.", "info");
    this.notify("cart_updated");
  }

  clearCart() {
    this.cart = [];
    this.appliedCoupon = null;
    this.saveCart();
    this.notify("cart_updated");
  }

  // Cart Drawer
  openCartDrawer() {
    this.cartDrawerOpen = true;
    document.getElementById("cart-drawer")?.classList.add("open");
    document.getElementById("cart-overlay")?.classList.add("open");
    this.notify("drawer_opened");
  }

  closeCartDrawer() {
    this.cartDrawerOpen = false;
    document.getElementById("cart-drawer")?.classList.remove("open");
    document.getElementById("cart-overlay")?.classList.remove("open");
    this.notify("drawer_closed");
  }

  // Wishlist Methods
  toggleWishlist(productId) {
    if (this.wishlist.includes(productId)) {
      this.wishlist = this.wishlist.filter(id => id !== productId);
      this.showToast("Removed from Wishlist", "info");
    } else {
      this.wishlist.push(productId);
      this.showToast("Saved to Wishlist ❤️", "success");
    }
    this.saveWishlist();
    this.notify("wishlist_updated");
  }

  isInWishlist(productId) {
    return this.wishlist.includes(productId);
  }

  // Coupon Methods
  applyCoupon(code) {
    this.couponError = "";
    const cleanCode = (code || "").trim().toUpperCase();
    if (!cleanCode) return false;

    if (!COUPONS[cleanCode]) {
      this.couponError = "Invalid coupon code. Try 'LENS10' or 'FLAT200' or 'FREESHIP'";
      this.showToast(this.couponError, "error");
      this.notify("coupon_failed");
      return false;
    }

    const cp = COUPONS[cleanCode];
    const { subtotal } = this.getTotals();
    if (subtotal < cp.minOrder) {
      this.couponError = `Min order of ₹${cp.minOrder} required for ${cleanCode}.`;
      this.showToast(this.couponError, "error");
      this.notify("coupon_failed");
      return false;
    }

    this.appliedCoupon = cleanCode;
    this.showToast(`Coupon '${cleanCode}' applied successfully! 🎉`, "success");
    this.notify("coupon_applied");
    return true;
  }

  removeCoupon() {
    this.appliedCoupon = null;
    this.couponError = "";
    this.showToast("Coupon removed", "info");
    this.notify("coupon_removed");
  }

  // Order Placement
  placeOrder(orderData) {
    const totals = this.getTotals();
    const newOrderId = `LSW-${Math.floor(1000 + Math.random() * 9000)}`;

    const newOrder = {
      id: newOrderId,
      createdAt: new Date().toISOString(),
      status: "Placed",
      items: JSON.parse(JSON.stringify(this.cart)),
      subtotal: totals.subtotal,
      discount: totals.discount,
      couponApplied: this.appliedCoupon,
      shipping: totals.shipping,
      gst: totals.gst,
      total: totals.grandTotal,
      customer: orderData.customer,
      paymentMethod: orderData.paymentMethod || "Cash on Delivery",
      paymentStatus: orderData.paymentMethod === "Cash on Delivery" ? "Pending" : "Paid",
      prescriptionMethod: orderData.prescriptionMethod || null,
      prescriptionFile: orderData.prescriptionFile || null,
      prescriptionDetails: orderData.prescriptionDetails || null,
      notes: orderData.notes || ""
    };

    this.orders.unshift(newOrder);
    this.saveOrders();
    this.clearCart();
    this.notify("order_placed", newOrder);
    return newOrder;
  }

  // Admin Methods
  updateOrderStatus(orderId, newStatus) {
    const order = this.orders.find(o => o.id === orderId);
    if (order) {
      order.status = newStatus;
      this.saveOrders();
      this.showToast(`Order #${orderId} marked as ${newStatus}`, "success");
      this.notify("admin_order_updated", order);
    }
  }

  updateProduct(productId, updatedFields) {
    const idx = this.products.findIndex(p => p.id === productId);
    if (idx > -1) {
      this.products[idx] = { ...this.products[idx], ...updatedFields };
      this.saveProducts();
      this.showToast("Product updated successfully!", "success");
      this.notify("products_updated");
    }
  }

  addProduct(newProduct) {
    const productWithId = {
      ...newProduct,
      id: `lens-s-world-${(newProduct.name || 'custom').toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now()}`
    };
    this.products.unshift(productWithId);
    this.saveProducts();
    this.showToast("New product added to catalog!", "success");
    this.notify("products_updated");
    return productWithId;
  }

  deleteProduct(productId) {
    this.products = this.products.filter(p => p.id !== productId);
    this.saveProducts();
    this.showToast("Product removed from catalog.", "info");
    this.notify("products_updated");
  }

  // Category Management
  addCategory(category) {
    const key = category.key || category.label.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const existing = this.categories.find(c => c.key === key);
    if (existing) {
      this.showToast("Category key already exists!", "error");
      return false;
    }
    this.categories.push({ ...category, key });
    this.saveCategories();
    this.showToast(`Category "${category.label}" added!`, "success");
    this.notify("categories_updated");
    return true;
  }

  updateCategory(key, updatedData) {
    const idx = this.categories.findIndex(c => c.key === key);
    if (idx > -1) {
      this.categories[idx] = { ...this.categories[idx], ...updatedData };
      this.saveCategories();
      this.showToast("Category updated!", "success");
      this.notify("categories_updated");
    }
  }

  deleteCategory(key) {
    if (key === 'all') {
      this.showToast("Cannot delete base 'all' category", "error");
      return;
    }
    this.categories = this.categories.filter(c => c.key !== key);
    this.saveCategories();
    this.showToast("Category removed.", "info");
    this.notify("categories_updated");
  }

  // Lens Package Management
  addLensPackage(pkg) {
    const id = pkg.id || pkg.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    this.lensPackages.push({ ...pkg, id });
    this.saveLensPackages();
    this.showToast(`Lens package "${pkg.name}" added!`, "success");
    this.notify("lens_packages_updated");
  }

  updateLensPackage(id, updatedData) {
    const idx = this.lensPackages.findIndex(l => l.id === id);
    if (idx > -1) {
      this.lensPackages[idx] = { ...this.lensPackages[idx], ...updatedData };
      this.saveLensPackages();
      this.showToast("Lens package updated!", "success");
      this.notify("lens_packages_updated");
    }
  }

  deleteLensPackage(id) {
    this.lensPackages = this.lensPackages.filter(l => l.id !== id);
    this.saveLensPackages();
    this.showToast("Lens package removed.", "info");
    this.notify("lens_packages_updated");
  }

  // Coupon Management
  addCoupon(code, data) {
    const upper = code.trim().toUpperCase();
    this.coupons[upper] = data;
    this.saveCoupons();
    this.showToast(`Coupon "${upper}" created!`, "success");
    this.notify("coupons_updated");
  }

  deleteCoupon(code) {
    const upper = code.trim().toUpperCase();
    delete this.coupons[upper];
    this.saveCoupons();
    this.showToast(`Coupon "${upper}" removed.`, "info");
    this.notify("coupons_updated");
  }

  // Store Settings Management
  updateStoreSettings(settings) {
    this.storeSettings = { ...this.storeSettings, ...settings };
    this.saveStoreSettings();
    this.showToast("Store settings saved successfully!", "success");
    this.notify("settings_updated");
  }

  resetToDefault() {
    this.products = INITIAL_PRODUCTS;
    this.orders = INITIAL_MOCK_ORDERS;
    this.categories = CATEGORIES;
    this.lensPackages = LENS_PACKAGES;
    this.coupons = COUPONS;
    this.storeSettings = STORE_INFO;
    this.saveProducts();
    this.saveOrders();
    this.saveCategories();
    this.saveLensPackages();
    this.saveCoupons();
    this.saveStoreSettings();
    this.showToast("Store data reset to factory defaults!", "success");
    this.notify("store_reset");
  }
}

export const store = new Store();
