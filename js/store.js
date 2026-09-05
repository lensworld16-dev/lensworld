// LENS S WORLD - Reactive State Manager (LocalStorage Powered)
import { INITIAL_PRODUCTS, INITIAL_MOCK_ORDERS, COUPONS, STORE_INFO, CATEGORIES, LENS_PACKAGES, DEFAULT_CATEGORY_IMAGES, getProductImgHash } from './data.js';

class Store {
  constructor() {
    this.listeners = new Set();

    // 1. Products State
    try {
      const CATALOG_VERSION = "2026.09.v4_unique";
      const storedVersion = localStorage.getItem("lsw_catalog_version");
      if (storedVersion !== CATALOG_VERSION) {
        localStorage.setItem("lsw_catalog_version", CATALOG_VERSION);
        localStorage.removeItem("lsw_products");
        localStorage.removeItem("lsw_deleted_products");
      }

      const deletedIds = new Set(JSON.parse(localStorage.getItem("lsw_deleted_products") || "[]"));
      const saved = localStorage.getItem("lsw_products");
      
      if (saved) {
        const parsed = JSON.parse(saved);
        const initialMap = new Map(INITIAL_PRODUCTS.map(p => [p.id, p]));
        const resultList = [];
        const seenIds = new Set();

        // 1. Keep valid custom products or edited products, strictly rejecting obsolete legacy -frame- items
        parsed.forEach(p => {
          if (!p || !p.id || deletedIds.has(p.id) || seenIds.has(p.id)) return;
          // Filter out obsolete legacy products whose images were removed
          if (
            p.id.includes('-frame-') ||
            (p.img && (
              p.img.includes('/images/products/womens/') ||
              p.img.includes('/images/products/kids/') ||
              p.img.includes('/images/products/readers/') ||
              p.img.includes('/images/products/sports/') ||
              p.img.includes('/images/products/unisex/')
            ))
          ) return;

          seenIds.add(p.id);
          const isFeat = p.featured !== undefined ? Boolean(p.featured) : Boolean(p.isFeatured);
          const imgPath = p.img || (initialMap.get(p.id)?.img);
          const computedHash = getProductImgHash({ ...p, img: imgPath });

          if (initialMap.has(p.id)) {
            const orig = initialMap.get(p.id);
            resultList.push({
              ...orig,
              ...p,
              img: imgPath || orig.img,
              imgHash: computedHash || orig.imgHash,
              gallery: (p.gallery && p.gallery.length > 0) ? p.gallery : [imgPath || orig.img],
              featured: isFeat,
              isFeatured: isFeat,
              bestSeller: p.bestSeller !== undefined ? Boolean(p.bestSeller) : isFeat
            });
          } else {
            resultList.push({
              ...p,
              imgHash: computedHash,
              featured: isFeat,
              isFeatured: isFeat,
              bestSeller: p.bestSeller !== undefined ? Boolean(p.bestSeller) : isFeat
            });
          }
        });

        // 2. Append all fresh INITIAL_PRODUCTS
        INITIAL_PRODUCTS.forEach(orig => {
          if (!seenIds.has(orig.id) && !deletedIds.has(orig.id)) {
            seenIds.add(orig.id);
            orig.imgHash = getProductImgHash(orig) || orig.imgHash;
            resultList.push(orig);
          }
        });

        this.products = resultList;
      } else {
        this.products = INITIAL_PRODUCTS.filter(p => !deletedIds.has(p.id)).map(p => ({
          ...p,
          imgHash: getProductImgHash(p) || p.imgHash
        }));
      }
      this.saveProducts();
    } catch (e) {
      console.warn("Storage restore notice, using base catalog:", e);
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
      this.lensPackages = LENS_PACKAGES;
      localStorage.setItem("lsw_lens_packages", JSON.stringify(LENS_PACKAGES));
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
    // Always use DEFAULT_CATEGORY_IMAGES from data.js (clears stale cache)
    localStorage.removeItem("lsw_category_images");
    this.categoryImages = DEFAULT_CATEGORY_IMAGES;

    // 10. Active coupon & UI
    this.appliedCoupon = null;
    this.couponError = "";
    this.cartDrawerOpen = false;
    this.quickViewProductId = null;
    this.customizingProductId = null;

    // Fetch live orders and products from Supabase DB on initialization
    this.fetchOrdersFromSupabase();
    this.fetchProductsFromSupabase();
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
      console.warn("localStorage quota notice, saving compact products:", e);
      try {
        const compact = this.products.map(p => {
          if (p.img && p.img.length > 250000) {
            return { ...p, img: 'https://chashmah.com/wp-content/uploads/2026/08/1001073265_768x768.webp', gallery: ['https://chashmah.com/wp-content/uploads/2026/08/1001073265_768x768.webp'] };
          }
          return p;
        });
        localStorage.setItem("lsw_products", JSON.stringify(compact));
      } catch (err2) {
        console.error("Critical storage write failure:", err2);
      }
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
      const itemUnitPrice = item.disposalType 
        ? Math.round(item.price * (item.disposalType.priceMultiplier || item.disposalType.multiplier || 1.0))
        : item.price + (item.selectedLens?.price || 0);
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
      disposalType = null,
      readingPower = null,
      prescriptionMethod = null,
      prescriptionDetails = null,
      prescriptionData = null,
      prescriptionFile = null,
      qty = 1
    } = options;

    const cartItemId = `${product.id}-${selectedColor}-${selectedLens?.id || 'frame'}-${disposalType?.id || 'std'}-${readingPower || 'std'}`;
    const existingIdx = this.cart.findIndex(item => item.cartItemId === cartItemId);

    if (existingIdx > -1) {
      this.cart[existingIdx].qty += qty;
    } else {
      this.cart.push({
        ...product,
        cartItemId,
        selectedColor,
        selectedLens,
        disposalType,
        readingPower,
        prescriptionMethod,
        prescriptionDetails: prescriptionDetails || prescriptionData,
        prescriptionData: prescriptionData || prescriptionDetails,
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
    const newOrderId = orderData.cfOrderId || `LSW-${Math.floor(1000 + Math.random() * 9000)}`;

    const newOrder = {
      id: newOrderId,
      createdAt: new Date().toISOString(),
      status: orderData.paymentStatus === 'Paid' ? "Payment Confirmed" : "Placed",
      items: JSON.parse(JSON.stringify(this.cart)),
      subtotal: totals.subtotal,
      discount: totals.discount,
      couponApplied: this.appliedCoupon,
      shipping: totals.shipping,
      gst: totals.gst,
      total: totals.grandTotal,
      customer: orderData.customer,
      paymentMethod: orderData.paymentMethod || "Cash on Delivery",
      paymentStatus: orderData.paymentStatus || (orderData.paymentMethod === "Cash on Delivery" ? "Pending" : "Paid"),
      prescriptionMethod: orderData.prescriptionMethod || null,
      prescriptionFile: orderData.prescriptionFile || null,
      prescriptionDetails: orderData.prescriptionDetails || null,
      notes: orderData.notes || "",
      cfOrderId: orderData.cfOrderId || null,
      cfPaymentSessionId: orderData.cfPaymentSessionId || null
    };

    this.orders.unshift(newOrder);
    this.saveOrders();
    this.clearCart();
    this.notify("order_placed", newOrder);

    // Synchronize to Supabase DB so order is saved globally for Admin
    fetch('/api/save-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newOrder)
    }).then(res => res.json()).then(data => {
      console.log('✓ Order synced to Supabase DB:', data);
    }).catch(err => console.warn('Supabase save-order async notice:', err));

    return newOrder;
  }

  // Fetch live orders from Supabase DB (Global cross-device Admin sync)
  async fetchOrdersFromSupabase() {
    try {
      const res = await fetch('/api/get-orders');
      if (!res.ok) return;
      const data = await res.json();
      if (data.success && Array.isArray(data.orders)) {
        const dbOrders = data.orders.map(o => ({
          id: o.id,
          createdAt: o.created_at || o.createdAt,
          status: o.status,
          items: Array.isArray(o.items) ? o.items : [],
          subtotal: Number(o.subtotal || 0),
          discount: Number(o.discount || 0),
          couponApplied: o.coupon_applied || o.couponApplied,
          shipping: Number(o.shipping || 0),
          gst: Number(o.gst || 0),
          total: Number(o.total || 0),
          customer: o.customer || {},
          paymentMethod: o.payment_method || o.paymentMethod || 'Cash on Delivery',
          paymentStatus: o.payment_status || o.paymentStatus || 'Pending',
          prescriptionMethod: o.prescription_method || o.prescriptionMethod,
          prescriptionFile: o.prescription_file || o.prescriptionFile,
          prescriptionDetails: o.prescription_details || o.prescriptionDetails,
          notes: o.notes || ''
        }));

        if (dbOrders.length > 0) {
          // Merge database orders with local orders (DB orders take precedence)
          const orderMap = new Map();
          dbOrders.forEach(o => orderMap.set(o.id, o));
          this.orders.forEach(o => {
            // Keep local non-mock order if not yet in DB
            if (!orderMap.has(o.id) && !o.id.startsWith('LSW-928')) {
              orderMap.set(o.id, o);
            }
          });

          this.orders = Array.from(orderMap.values()).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          this.saveOrders();
          this.notify("orders_updated", this.orders);
          console.log(`✓ Synchronized ${this.orders.length} orders from Supabase`);
        }
      }
    } catch (e) {
      console.warn('Notice fetching Supabase orders:', e.message);
    }
  }

  // Fetch live products from Supabase DB (Global cross-device live cloud sync)
  async fetchProductsFromSupabase() {
    try {
      const res = await fetch('/api/get-products');
      if (!res.ok) return;
      const data = await res.json();
      if (data.success && Array.isArray(data.products) && data.products.length > 0) {
        const deletedIds = new Set(JSON.parse(localStorage.getItem("lsw_deleted_products") || "[]"));
        
        const dbProds = data.products
          .filter(p => p && p.id && !deletedIds.has(p.id))
          .map(p => {
            const imgs = Array.isArray(p.images) && p.images.length > 0 
              ? p.images 
              : [p.img || 'https://chashmah.com/wp-content/uploads/2026/08/1001073265_768x768.webp'];
            const primaryImg = imgs[0];
            const isFeat = Boolean(p.badge === 'Bestseller' || p.badge === 'Featured' || p.badge === 'Trending' || p.is_featured || p.featured);
            const cat = p.category || p.type || 'eyeglasses';
            const gender = p.gender || 'unisex';
            const localMatch = this.products.find(x => x.id === p.id);

            return {
              id: p.id,
              name: p.name,
              sku: p.sku || p.id,
              type: cat,
              category: cat,
              gender: gender,
              cats: gender === 'unisex' ? ['men', 'women', 'unisex', cat] : [gender, cat],
              price: Number(p.price || 0),
              mrp: Number(p.original_price || Math.round(Number(p.price || 0) * 1.6)),
              rating: Number(p.rating || 4.9),
              reviews: Number(p.reviews_count || 16),
              badge: p.badge || '',
              img: primaryImg,
              imgHash: getProductImgHash({ ...p, img: primaryImg }) || localMatch?.imgHash || primaryImg,
              gallery: imgs,
              shape: p.frame_shape || 'Rectangle',
              size: p.frame_size || '50-20-142',
              color: Array.isArray(p.colors) && p.colors.length > 0 ? p.colors[0] : 'Black',
              colors: Array.isArray(p.colors) && p.colors.length > 0 ? p.colors : ['Black'],
              lensOptionsAvailable: p.lens_compatible !== false,
              prescriptionAvailable: p.lens_compatible !== false,
              frameOnlyAvailable: true,
              inStock: p.in_stock !== false,
              description: p.description || `${p.name} handcrafted with optical precision from LENS S WORLD.`,
              features: Array.isArray(p.features) && p.features.length > 0 ? p.features : ["Ultra-Durable Frame", "Prescription Ready", "Premium Quality Finish"],
              featured: isFeat,
              isFeatured: isFeat,
              bestSeller: isFeat,
              isNew: p.badge === 'New',
              createdAt: p.created_at ? new Date(p.created_at).getTime() : Date.now()
            };
          });

        if (dbProds.length > 0) {
          this.products = dbProds;
          this.saveProducts();
          this.notify("products_updated", this.products);
          console.log(`✓ Synchronized ${dbProds.length} products live from Supabase DB`);
        }
      }
    } catch (e) {
      console.warn('Notice fetching Supabase products:', e.message);
    }
  }

  // Look up & Sync any Cashfree Order by ID into Admin
  async syncCashfreeOrder(orderId) {
    try {
      const res = await fetch(`/api/verify-cashfree-order?orderId=${encodeURIComponent(orderId)}`);
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to verify order on Cashfree');
      }
      // Re-fetch orders from Supabase
      await this.fetchOrdersFromSupabase();
      return data;
    } catch (err) {
      console.error('Error syncing Cashfree order:', err);
      throw err;
    }
  }

  // Admin Methods
  updateOrderStatus(orderId, newStatus) {
    const order = this.orders.find(o => o.id === orderId);
    if (order) {
      order.status = newStatus;
      this.saveOrders();
      this.showToast(`Order #${orderId} marked as ${newStatus}`, "success");
      this.notify("admin_order_updated", order);

      // Async update in Supabase
      fetch('/api/save-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(order)
      }).catch(e => console.warn('Supabase status update notice:', e));
    }
  }

  async updateProduct(productId, updatedFields) {
    const idx = this.products.findIndex(p => p.id === productId);
    if (idx > -1) {
      const current = this.products[idx];
      const isFeat = updatedFields.featured !== undefined 
        ? Boolean(updatedFields.featured) 
        : (updatedFields.isFeatured !== undefined ? Boolean(updatedFields.isFeatured) : Boolean(current.featured || current.isFeatured));
      
      const newImg = updatedFields.img || current.img;
      const newGallery = (updatedFields.gallery && updatedFields.gallery.length > 0) 
        ? updatedFields.gallery 
        : (updatedFields.img ? [updatedFields.img] : (current.gallery || [current.img]));

      this.products[idx] = { 
        ...current, 
        ...updatedFields,
        featured: isFeat,
        isFeatured: isFeat,
        bestSeller: isFeat,
        img: newImg,
        imgHash: getProductImgHash({ ...current, ...updatedFields, img: newImg }),
        gallery: newGallery
      };
      this.saveProducts();
      this.showToast("Product updated successfully!", "success");
      this.notify("products_updated", this.products[idx]);

      // Sync updated product to Supabase cloud database
      try {
        await fetch('/api/save-product', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(this.products[idx])
        });
        await this.fetchProductsFromSupabase();
      } catch (err) {
        console.warn('Supabase product update error:', err);
      }
    }
  }

  async addProduct(newProduct) {
    const timestamp = Date.now();
    const isFeat = Boolean(newProduct.featured || newProduct.isFeatured);
    const prodImg = newProduct.img || 'https://chashmah.com/wp-content/uploads/2026/08/1001073265_768x768.webp';
    const prodGallery = (newProduct.gallery && newProduct.gallery.length > 0) ? newProduct.gallery : [prodImg];

    const productWithId = {
      ...newProduct,
      id: newProduct.id || `lens-s-world-${(newProduct.name || 'custom').toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${timestamp}`,
      createdAt: timestamp,
      img: prodImg,
      imgHash: getProductImgHash({ ...newProduct, img: prodImg }),
      gallery: prodGallery,
      featured: isFeat,
      isFeatured: isFeat,
      bestSeller: isFeat,
      isNew: newProduct.isNew !== false,
      inStock: newProduct.inStock !== false,
      rating: Number(newProduct.rating) || 4.9,
      reviews: Number(newProduct.reviews) || 16
    };
    this.products.unshift(productWithId);
    this.saveProducts();
    this.showToast("New product added to catalog!", "success");
    this.notify("products_updated", productWithId);

    // Save product to Supabase cloud database so all devices and phones see it immediately!
    try {
      const res = await fetch('/api/save-product', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productWithId)
      });
      const data = await res.json();
      if (data.success) {
        console.log('✓ Product successfully synced to Supabase Cloud DB:', productWithId.id);
        await this.fetchProductsFromSupabase();
      }
    } catch (err) {
      console.warn('Supabase product add notice:', err);
    }

    return productWithId;
  }

  async deleteProduct(productId) {
    this.products = this.products.filter(p => p.id !== productId);
    try {
      const deleted = new Set(JSON.parse(localStorage.getItem("lsw_deleted_products") || "[]"));
      deleted.add(productId);
      localStorage.setItem("lsw_deleted_products", JSON.stringify(Array.from(deleted)));
    } catch(e) {}
    this.saveProducts();
    this.showToast("Product removed from catalog.", "info");
    this.notify("products_updated", { id: productId, deleted: true });

    // Delete from Supabase cloud database
    try {
      await fetch(`/api/delete-product?id=${encodeURIComponent(productId)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: productId })
      });
      await this.fetchProductsFromSupabase();
    } catch (err) {
      console.warn('Supabase product delete notice:', err);
    }
  }

  bulkDeleteProducts(productIds) {
    const idSet = new Set(productIds);
    this.products = this.products.filter(p => !idSet.has(p.id));
    try {
      const deleted = new Set(JSON.parse(localStorage.getItem("lsw_deleted_products") || "[]"));
      productIds.forEach(id => deleted.add(id));
      localStorage.setItem("lsw_deleted_products", JSON.stringify(Array.from(deleted)));
    } catch(e) {}
    this.saveProducts();
    this.showToast(`Deleted ${productIds.length} products successfully!`, "info");
    this.notify("products_updated");

    // Delete in Supabase cloud database
    productIds.forEach(id => {
      fetch(`/api/delete-product?id=${encodeURIComponent(id)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      }).catch(err => console.warn('Supabase bulk delete notice:', err));
    });
  }

  bulkMoveCategory(productIds, newCategory) {
    const idSet = new Set(productIds);
    let count = 0;
    this.products = this.products.map(p => {
      if (idSet.has(p.id)) {
        count++;
        return { ...p, type: newCategory };
      }
      return p;
    });
    this.saveProducts();
    this.showToast(`Moved ${count} products to "${newCategory}"!`, "success");
    this.notify("products_updated");
  }

  bulkChangeGender(productIds, newGender) {
    const idSet = new Set(productIds);
    const newCats = newGender === 'unisex' ? ['men', 'women', 'unisex'] : [newGender];
    let count = 0;
    this.products = this.products.map(p => {
      if (idSet.has(p.id)) {
        count++;
        return { ...p, gender: newGender, cats: newCats };
      }
      return p;
    });
    this.saveProducts();
    this.showToast(`Updated gender to "${newGender}" for ${count} products!`, "success");
    this.notify("products_updated");
  }

  bulkSetFeatured(productIds, isFeatured = true) {
    const idSet = new Set(productIds);
    let count = 0;
    this.products = this.products.map(p => {
      if (idSet.has(p.id)) {
        count++;
        return { 
          ...p, 
          isFeatured: Boolean(isFeatured), 
          featured: Boolean(isFeatured), 
          bestSeller: Boolean(isFeatured) 
        };
      }
      return p;
    });
    this.saveProducts();
    this.showToast(`${isFeatured ? '⭐ Marked as Featured on Home' : 'Removed from Featured'} for ${count} products!`, "success");
    this.notify("products_updated");
  }

  toggleProductFeatured(productId) {
    const p = this.products.find(item => item.id === productId);
    if (p) {
      const nextVal = !(p.isFeatured || p.featured);
      p.isFeatured = nextVal;
      p.featured = nextVal;
      p.bestSeller = nextVal;
      this.saveProducts();
      this.showToast(`Product "${p.name}" ${nextVal ? 'marked as Featured ⭐' : 'removed from Featured'}!`, "success");
      this.notify("products_updated");
    }
  }

  bulkUpdateProducts(productIds, updatedFields) {
    const idSet = new Set(productIds);
    this.products = this.products.map(p => {
      if (idSet.has(p.id)) {
        return { ...p, ...updatedFields };
      }
      return p;
    });
    this.saveProducts();
    this.showToast(`Updated ${productIds.length} products!`, "success");
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
