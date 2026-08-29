// LENS S WORLD - Clean UI Components & View Renderer
import { STORE_INFO, CATEGORIES, GENDER_CATEGORIES, LENS_PACKAGES, COUPONS, ORDER_STATUSES } from './data.js';
import { store } from './store.js';
import { getWhatsAppUrl, getProductEnquiryUrl, formatOrderForWhatsApp } from './whatsapp.js';

export const UI = {
  // Format Price INR
  formatPrice(val) {
    return `₹${Number(val || 0).toLocaleString('en-IN')}`;
  },

  // Calculate discount percentage
  getDiscount(price, mrp) {
    if (!mrp || mrp <= price) return null;
    return Math.round(((mrp - price) / mrp) * 100);
  },

  // Update Nav badges
  updateNavBadges() {
    const totals = store.getTotals();
    const cartCountEl = document.getElementById("nav-cart-count");
    if (cartCountEl) cartCountEl.textContent = totals.cartCount;

    const mobileCartCountEl = document.getElementById("mobile-cart-count");
    if (mobileCartCountEl) {
      mobileCartCountEl.textContent = totals.cartCount;
      mobileCartCountEl.style.display = totals.cartCount > 0 ? 'flex' : 'none';
    }

    const wishlistCountEl = document.getElementById("nav-wishlist-count");
    if (wishlistCountEl) wishlistCountEl.textContent = store.wishlist.length;

    const mobileWishlistCountEl = document.getElementById("mobile-wishlist-count");
    if (mobileWishlistCountEl) {
      mobileWishlistCountEl.textContent = store.wishlist.length;
      mobileWishlistCountEl.style.display = store.wishlist.length > 0 ? 'flex' : 'none';
    }
  },

  // Render Clean Product Card (Edge-to-Edge Full Cover Image)
  renderProductCard(product) {
    const isWishlisted = store.isInWishlist(product.id);
    const discount = this.getDiscount(product.price, product.mrp);

    return `
      <div class="product-card" data-product-id="${product.id}">
        <!-- Full-Cover Product Image with Floating Badges -->
        <div class="product-thumb" onclick="window.location.hash='#product/${product.id}'">
          <img src="${product.img}" alt="${product.name}" loading="lazy" />
          <span class="product-badge-pill">${product.isNew ? 'New' : (discount ? `${discount}% off` : 'New')}</span>
          <button type="button" class="wishlist-toggle-btn ${isWishlisted ? 'active' : ''}" 
                  onclick="event.stopPropagation(); window.AppEvents.toggleWishlist('${product.id}')" 
                  title="Wishlist">
            <svg style="width:17px; height:17px;" fill="${isWishlisted ? '#ef4444' : 'none'}" stroke="${isWishlisted ? '#ef4444' : '#64748b'}" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
            </svg>
          </button>
        </div>

        <!-- Product Details Section -->
        <div class="product-details">
          <h3 class="product-title" onclick="window.location.hash='#product/${product.id}'">${product.name}</h3>

          <div class="product-price-row">
            ${product.mrp ? `<span class="price-mrp">${this.formatPrice(product.mrp)}</span>` : ''}
            <span class="price-current">${this.formatPrice(product.price)}</span>
          </div>

          <button type="button" class="btn-pill-cart" 
                  onclick="${product.lensOptionsAvailable ? `window.AppEvents.openLensCustomizer('${product.id}')` : `window.AppEvents.addStandardProduct('${product.id}')`}">
            Add to cart
          </button>
        </div>
      </div>
    `;
  },

  // Render Home Page
  renderHomePage() {
    const newArrivals = store.products.filter(p => p.isNew === true || (p.badge && p.badge.toLowerCase().includes('new')));
    const trending = store.products.filter(p => p.isTrending === true || p.trending === true || (p.badge && p.badge.toLowerCase().includes('trend')));
    const eyeglasses = store.products.filter(p => p.type === 'eyeglasses');
    const sunglasses = store.products.filter(p => p.type === 'sunglasses');
    const readers = store.products.filter(p => p.type === 'reading-glasses' || p.type === 'contact-lenses' || p.type === 'accessories');

    return `
      <!-- Top Story Circles Carousel (Exact Categories: Eyeglasses, Sunglasses, Power Specs, Contact Lens, Readers, Lens, Accessories) -->
      <section class="story-circles-section">
        <div class="container">
          <div class="story-circles-wrap">
            <a href="#shop?category=eyeglasses" class="story-circle-item">
              <div class="story-circle-avatar">
                <img src="${store.getCatImg('story_eyeglasses', 'https://chashmah.com/wp-content/uploads/2026/08/1001073249_cropped_768x768.webp')}" alt="Eyeglasses" />
              </div>
              <span class="story-circle-label">Eyeglasses</span>
            </a>

            <a href="#shop?category=sunglasses" class="story-circle-item">
              <div class="story-circle-avatar">
                <img src="${store.getCatImg('story_sunglasses', 'https://chashmah.com/wp-content/uploads/2026/08/1001073284_768x768.webp')}" alt="Sunglasses" />
              </div>
              <span class="story-circle-label">Sunglasses</span>
            </a>

            <a href="#shop?category=power-specs" class="story-circle-item">
              <div class="story-circle-avatar">
                <img src="${store.getCatImg('story_power_specs', 'https://chashmah.com/wp-content/uploads/2026/08/1001073289_768x768.webp')}" alt="Power Specs" />
              </div>
              <span class="story-circle-label">Power Specs</span>
            </a>

            <a href="#shop?category=contact-lenses" class="story-circle-item">
              <div class="story-circle-avatar">
                <img src="${store.getCatImg('story_contact_lenses', 'https://images.unsplash.com/photo-1587593810167-a84920ea0781?auto=format&fit=crop&w=600&q=80')}" alt="Contact Lens" />
              </div>
              <span class="story-circle-label">Contact Lens</span>
            </a>

            <a href="#shop?category=reading-glasses" class="story-circle-item">
              <div class="story-circle-avatar">
                <img src="${store.getCatImg('story_readers', 'https://chashmah.com/wp-content/uploads/2026/08/1001073293_768x768.webp')}" alt="Readers" />
              </div>
              <span class="story-circle-label">Readers</span>
            </a>

            <a href="#shop?category=lenses" class="story-circle-item">
              <div class="story-circle-avatar">
                <img src="${store.getCatImg('story_lenses', 'https://chashmah.com/wp-content/uploads/2026/08/modern-Silver-rimless-eyeglasses-for-Sikh-LDX178-4.webp')}" alt="Lens" />
              </div>
              <span class="story-circle-label">Lens</span>
            </a>

            <a href="#shop?category=accessories" class="story-circle-item">
              <div class="story-circle-avatar">
                <img src="${store.getCatImg('story_accessories', 'https://chashmah.com/wp-content/uploads/2026/08/1001073223_768x768.webp')}" alt="Accessories" />
              </div>
              <span class="story-circle-label">Accessories</span>
            </a>
          </div>

          <!-- 2-Column Mobile Featured Banner Cards (Real Indian Eyewear Campaign Models) -->
          <div class="mobile-featured-banners">
            <a href="#shop" class="mobile-banner-card">
              <img src="${store.getCatImg('banner_new_arrival', 'https://chashmah.com/wp-content/uploads/2024/05/IMG20240502181046.webp')}" alt="New Arrival" />
              <div class="banner-label">New Arrival</div>
            </a>
            <a href="#shop" class="mobile-banner-card">
              <img src="${store.getCatImg('banner_trending', 'https://chashmah.com/wp-content/uploads/2024/05/IMG20240514142320.webp')}" alt="Trending Styles" />
              <div class="banner-label">Trending Styles</div>
            </a>
          </div>
        </div>
      </section>

      <!-- New Arrivals Highlight Slider (If flagged in Admin) -->
      ${newArrivals.length > 0 ? `
        <section class="demographic-section" style="padding-top:0.5rem;">
          <div class="container">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.65rem;">
              <span style="font-size:0.92rem; font-weight:800; color:#000040; text-transform:uppercase; letter-spacing:0.04em;">✨ New Arrivals</span>
              <a href="#shop" style="font-size:0.82rem; font-weight:700; color:#000040;">View All (${newArrivals.length}) →</a>
            </div>
            <div class="products-grid">
              ${newArrivals.slice(0, 4).map(p => this.renderProductCard(p)).join('')}
            </div>
          </div>
        </section>
      ` : ''}

      <!-- Trending Styles Highlight Slider (If flagged in Admin) -->
      ${trending.length > 0 ? `
        <section class="demographic-section" style="padding-top:0;">
          <div class="container">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.65rem;">
              <span style="font-size:0.92rem; font-weight:800; color:#000040; text-transform:uppercase; letter-spacing:0.04em;">🔥 Trending Styles</span>
              <a href="#shop" style="font-size:0.82rem; font-weight:700; color:#000040;">View All (${trending.length}) →</a>
            </div>
            <div class="products-grid">
              ${trending.slice(0, 4).map(p => this.renderProductCard(p)).join('')}
            </div>
          </div>
        </section>
      ` : ''}

      <!-- Eyeglasses 4-Demographic Grid (Real Indian Eyewear Campaign Models) -->
      <section class="demographic-section">
        <div class="container">
          <h2 class="demographic-header">Eyeglasses</h2>
          <div class="demographic-grid">
            <a href="#shop?category=eyeglasses&gender=men" class="demo-card">
              <div class="demo-thumb-box contain-img">
                <img src="${store.getCatImg('eye_men', 'https://chashmah.com/wp-content/uploads/2026/08/1001073265_768x768.webp')}" alt="Men Eyeglasses" />
              </div>
              <span class="demo-label">Men</span>
            </a>

            <a href="#shop?category=eyeglasses&gender=women" class="demo-card">
              <div class="demo-thumb-box contain-img">
                <img src="${store.getCatImg('eye_women', 'https://chashmah.com/wp-content/uploads/2026/08/1001073249_cropped_768x768.webp')}" alt="Women Eyeglasses" />
              </div>
              <span class="demo-label">Women</span>
            </a>

            <a href="#shop?category=eyeglasses&gender=kids" class="demo-card">
              <div class="demo-thumb-box contain-img">
                <img src="${store.getCatImg('eye_kids', 'https://chashmah.com/wp-content/uploads/2026/06/Glass-Grey-Classic-Eyeglasses-175804-4.webp')}" alt="Kids Eyeglasses" />
              </div>
              <span class="demo-label">Kids</span>
            </a>

            <a href="#shop?category=eyeglasses" class="demo-card">
              <div class="demo-thumb-box contain-img">
                <img src="${store.getCatImg('eye_essentials', 'https://chashmah.com/wp-content/uploads/2024/05/IMG20240502181046.webp')}" alt="Essentials" />
                <span class="demo-badge" style="background:#111827;">50% off</span>
              </div>
              <span class="demo-label">Essentials</span>
            </a>
          </div>
        </div>
      </section>

      <!-- Eyeglasses Section Products -->
      <section class="demographic-section" style="padding-top:0;">
        <div class="container">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.65rem;">
            <span style="font-size:0.92rem; font-weight:800; color:#000040; text-transform:uppercase; letter-spacing:0.04em;">Featured Eyeglasses</span>
            <a href="#shop?category=eyeglasses" style="font-size:0.82rem; font-weight:700; color:#000040;">View All →</a>
          </div>
          <div class="products-grid">
            ${eyeglasses.map(p => this.renderProductCard(p)).join('')}
          </div>
        </div>
      </section>

      <!-- Sunglasses 4-Demographic Grid (Real Indian Eyewear Campaign Models) -->
      <section class="demographic-section">
        <div class="container">
          <h2 class="demographic-header">Sunglasses</h2>
          <div class="demographic-grid">
            <a href="#shop?category=sunglasses&gender=men" class="demo-card">
              <div class="demo-thumb-box contain-img">
                <img src="${store.getCatImg('sun_men', 'https://chashmah.com/wp-content/uploads/2026/08/1001073284_768x768.webp')}" alt="Men Sunglasses" />
              </div>
              <span class="demo-label">Men</span>
            </a>

            <a href="#shop?category=sunglasses&gender=women" class="demo-card">
              <div class="demo-thumb-box contain-img">
                <img src="${store.getCatImg('sun_women', 'https://chashmah.com/wp-content/uploads/2026/08/1001073289_768x768.webp')}" alt="Women Sunglasses" />
              </div>
              <span class="demo-label">Women</span>
            </a>

            <a href="#shop?category=sunglasses&gender=kids" class="demo-card">
              <div class="demo-thumb-box contain-img">
                <img src="${store.getCatImg('sun_kids', 'https://chashmah.com/wp-content/uploads/2026/01/Hexxa-Brown-Turban-fit-Sunglasses-GG003-4.webp')}" alt="Kids Sunglasses" />
              </div>
              <span class="demo-label">Kids</span>
            </a>

            <a href="#shop?category=sunglasses" class="demo-card">
              <div class="demo-thumb-box contain-img">
                <img src="${store.getCatImg('sun_essentials', 'https://chashmah.com/wp-content/uploads/2025/09/Golden-Green-Turban-Fit-Sunglasses-101-5.webp')}" alt="Essentials Sunglasses" />
                <span class="demo-badge" style="background:#111827;">60% off</span>
              </div>
              <span class="demo-label">Essentials</span>
            </a>
          </div>
        </div>
      </section>

      <!-- Sunglasses Section Products -->
      <section class="demographic-section" style="padding-top:0;">
        <div class="container">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.65rem;">
            <span style="font-size:0.92rem; font-weight:800; color:#000040; text-transform:uppercase; letter-spacing:0.04em;">Featured Sunglasses</span>
            <a href="#shop?category=sunglasses" style="font-size:0.82rem; font-weight:700; color:#000040;">View All →</a>
          </div>
          <div class="products-grid">
            ${sunglasses.map(p => this.renderProductCard(p)).join('')}
          </div>
        </div>
      </section>

      <!-- LENS S WORLD Specials (Real Optical Specs & Frames) -->
      <section class="demographic-section">
        <div class="container">
          <h2 class="demographic-header">LENS S WORLD Specials</h2>
          <div class="demographic-grid">
            <a href="#lenses-guide" class="demo-card">
              <div class="demo-thumb-box contain-img">
                <img src="https://chashmah.com/wp-content/uploads/2025/06/Black-Switch-Clip-on-Eyeglasses-80101-new.webp" alt="Zero Power" />
              </div>
              <span class="demo-label">Zero Power</span>
            </a>

            <a href="#lenses-guide" class="demo-card">
              <div class="demo-thumb-box contain-img">
                <img src="https://chashmah.com/wp-content/uploads/2026/08/modern-Silver-rimless-eyeglasses-for-Sikh-LDX178-4.webp" alt="Progressive" />
              </div>
              <span class="demo-label">Progressive</span>
            </a>

            <a href="#lenses-guide" class="demo-card">
              <div class="demo-thumb-box contain-img">
                <img src="https://chashmah.com/wp-content/uploads/2025/09/Airlite-Silver-Turban-Fit-Eyeglasses-147-1.webp" alt="One Power" />
              </div>
              <span class="demo-label">One Power</span>
            </a>

            <a href="#shop?category=reading-glasses" class="demo-card">
              <div class="demo-thumb-box contain-img">
                <img src="https://chashmah.com/wp-content/uploads/2025/02/Black-Silver-Turban-Frame-88810-2.webp" alt="Power Readers" />
                <span class="demo-badge" style="background:#111827;">Exclusive</span>
              </div>
              <span class="demo-label">Power Reader</span>
            </a>
          </div>
        </div>
      </section>

      <!-- Reading Glasses & Contact Lenses / Accessories Products -->
      <section class="demographic-section" style="padding-top:0;">
        <div class="container">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.65rem;">
            <span style="font-size:0.92rem; font-weight:800; color:#000040; text-transform:uppercase; letter-spacing:0.04em;">Readers & Daily Wear</span>
            <a href="#shop?category=reading-glasses" style="font-size:0.82rem; font-weight:700; color:#000040;">View All →</a>
          </div>
          <div class="products-grid">
            ${readers.map(p => this.renderProductCard(p)).join('')}
          </div>
        </div>
      </section>

      <!-- Lens Guide Highlight Section (Ultra-Sleek & Space Efficient on Mobile) -->
      <section class="lens-guide-section">
        <div class="container">
          <div class="lens-guide-header">
            <span class="lens-guide-tag">Precision Optics</span>
            <h2 class="lens-guide-title">Lenses Guide & Packages</h2>
            <p class="lens-guide-subtitle">Choose the ideal lens technology for your work, driving, or screen routine.</p>
          </div>

          <div class="lens-guide-grid">
            ${LENS_PACKAGES.map(lp => `
              <div class="lens-package-card">
                <div class="lens-card-top">
                  <span class="lens-package-badge">${lp.badge}</span>
                  <div class="lens-package-price">${this.formatPrice(lp.price)}</div>
                </div>
                <h4 class="lens-package-title">${lp.name}</h4>
                <p class="lens-package-tagline">${lp.tagline}</p>
                <a href="#shop?category=eyeglasses" class="lens-package-btn">Choose with Frame →</a>
              </div>
            `).join('')}
          </div>
        </div>
      </section>

      <!-- Trust Badges Strip (4 Clean Cards) -->
      <section class="trust-section" style="border-top:1px solid var(--border-color);">
        <div class="container">
          <div class="trust-grid">
            <div class="trust-card">
              <svg class="w-5 h-5 trust-card-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/></svg>
              <div class="trust-card-text">
                <span class="trust-card-title">4.9 out of 5.0</span>
                <span class="trust-card-desc">Overall Store Rating</span>
              </div>
            </div>

            <div class="trust-card">
              <svg class="w-5 h-5 trust-card-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
              <div class="trust-card-text">
                <span class="trust-card-title">500+ Happy Eyes</span>
                <span class="trust-card-desc">Fitted across India</span>
              </div>
            </div>

            <div class="trust-card">
              <svg class="w-5 h-5 trust-card-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
              <div class="trust-card-text">
                <span class="trust-card-title">Premium Quality</span>
                <span class="trust-card-desc">Digital surfaced optics</span>
              </div>
            </div>

            <div class="trust-card">
              <svg class="w-5 h-5 trust-card-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg>
              <div class="trust-card-text">
                <span class="trust-card-title">Optometrist Support</span>
                <span class="trust-card-desc">Live WhatsApp guidance</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    `;
  },

  // Render Shop Page with 6 Categories & 3 Genders
  renderShopPage(filter = {}) {
    const { category = 'all', gender = 'all', sort = 'latest' } = filter;

    let filtered = [...store.products];

    if (category && category !== 'all') {
      if (category === 'lenses-guide') {
        window.location.hash = '#lenses-guide';
        return '';
      }
      if (category === 'power-specs') {
        filtered = filtered.filter(p => p.type === 'power-specs' || p.type === 'reading-glasses');
      } else if (category === 'reading-glasses') {
        filtered = filtered.filter(p => p.type === 'reading-glasses' || p.type === 'power-specs');
      } else {
        filtered = filtered.filter(p => p.type === category);
      }
    }

    if (gender && gender !== 'all') {
      filtered = filtered.filter(p => p.gender === gender || (p.cats && p.cats.includes(gender)));
    }

    if (sort === 'price_low') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sort === 'price_high') {
      filtered.sort((a, b) => b.price - a.price);
    } else if (sort === 'rating') {
      filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }

    const currentCategoryObj = CATEGORIES.find(c => c.key === category) || { label: 'All Eyewear' };
    const bannerImg = category === 'sunglasses' 
      ? 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=1200&q=80'
      : 'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?auto=format&fit=crop&w=1200&q=80';

    return `
      <div class="container section" style="padding-top:1rem;">
        <!-- Category Banner -->
        <div class="shop-cat-banner">
          <img src="${bannerImg}" alt="${currentCategoryObj.label}" />
          <h1 class="shop-cat-banner-title">${currentCategoryObj.label}</h1>
        </div>

        <!-- Filter & Sort Toolbar (Screenshot Match) -->
        <div class="shop-mobile-toolbar">
          <div class="toolbar-item" onclick="const p=document.getElementById('collapsible-filter'); p.classList.toggle('open');">
            <svg style="width:17px; height:17px;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"/></svg>
            <span>FILTER ${gender !== 'all' ? `(${gender})` : ''}</span>
          </div>
          <div class="toolbar-item">
            <select onchange="window.location.hash='#shop?category=${category}&gender=${gender}&sort=' + this.value">
              <option value="latest" ${sort === 'latest' ? 'selected' : ''}>Sort by latest ▼</option>
              <option value="price_low" ${sort === 'price_low' ? 'selected' : ''}>Price: Low to High</option>
              <option value="price_high" ${sort === 'price_high' ? 'selected' : ''}>Price: High to Low</option>
              <option value="rating" ${sort === 'rating' ? 'selected' : ''}>Top Rated</option>
            </select>
          </div>
        </div>

        <!-- Collapsible Filter Panel (Clean and Compact) -->
        <div id="collapsible-filter" class="collapsible-filter-panel">
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:0.75rem;">
            <div>
              <label style="font-size:0.78rem; font-weight:700; color:#000045; display:block; margin-bottom:0.3rem;">Category:</label>
              <select style="width:100%; padding:0.45rem; border-radius:6px; border:1px solid #cbd5e1; font-size:0.85rem;"
                      onchange="window.location.hash='#shop?category=' + this.value + '&gender=${gender}&sort=${sort}'">
                ${CATEGORIES.map(c => `<option value="${c.key}" ${category === c.key ? 'selected' : ''}>${c.label}</option>`).join('')}
              </select>
            </div>
            <div>
              <label style="font-size:0.78rem; font-weight:700; color:#000045; display:block; margin-bottom:0.3rem;">Gender:</label>
              <select style="width:100%; padding:0.45rem; border-radius:6px; border:1px solid #cbd5e1; font-size:0.85rem;"
                      onchange="window.location.hash='#shop?category=${category}&gender=' + this.value + '&sort=${sort}'">
                <option value="all" ${gender === 'all' ? 'selected' : ''}>All</option>
                ${GENDER_CATEGORIES.map(g => `<option value="${g.key}" ${gender === g.key ? 'selected' : ''}>${g.label}</option>`).join('')}
              </select>
            </div>
          </div>
        </div>

        <div style="font-size:0.82rem; color:var(--text-muted); margin-bottom:0.85rem;">
          Showing <strong>${filtered.length}</strong> items in <strong>${currentCategoryObj.label}</strong>
        </div>

        ${filtered.length > 0 ? `
          <div class="products-grid">
            ${filtered.map(p => this.renderProductCard(p)).join('')}
          </div>
        ` : `
          <div style="background:white; border-radius:var(--radius-md); border:1px solid var(--border-color); padding:3.5rem 1.5rem; text-align:center; margin: 1.5rem 0;">
            <svg style="width:44px; height:44px; color:#94a3b8; margin:0 auto 0.75rem;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            <h3 style="font-size:1.15rem; font-weight:700; color:#000045; margin-bottom:0.35rem;">No Products Found</h3>
            <p style="color:var(--text-muted); font-size:0.85rem; max-width:320px; margin:0 auto;">No items match this category or filter. Try viewing all products or selecting another category.</p>
            <button type="button" class="btn btn-navy btn-sm" style="margin-top:1.25rem;" onclick="window.location.hash='#shop'">View All Eyewear</button>
          </div>
        `}
      </div>
    `;
  },

  // Render Systematic Product Detail Page (Clean, Highly Visible, No EMI)
  renderProductDetailPage(productId) {
    const product = store.products.find(p => p.id === productId);
    if (!product) {
      return `
        <div class="container section" style="text-align:center; padding: 4rem 1rem;">
          <h2 style="font-size:1.5rem; font-weight:800; color:#000040;">Product Not Found</h2>
          <p style="color:#64748b; margin:0.75rem 0 1.5rem;">The frame or product you are looking for is no longer available.</p>
          <a href="#shop" class="btn btn-navy">Back to Shop</a>
        </div>
      `;
    }

    const isWishlisted = store.isInWishlist(product.id);
    const discount = this.getDiscount(product.price, product.mrp);
    const gallery = (product.gallery && product.gallery.length > 0 && product.gallery[0] === product.img) ? product.gallery : [product.img];

    const sizeParts = (product.size || '52-18-140').toString().split(/[^0-9]+/).filter(Boolean);
    const lensWidth = sizeParts[0] || '52';
    const bridgeWidth = sizeParts[1] || '18';
    const templeLength = sizeParts[2] || '140';
    const weight = (product.weight || '18g').toString().replace(/[^0-9a-zA-Z]/g, '') || '18g';

    return `
      <div class="container pdp-container">
        <!-- Breadcrumb Trail -->
        <nav class="pdp-breadcrumb">
          <a href="#home">Home</a> &nbsp;›&nbsp; 
          <a href="#shop">Shop</a> &nbsp;›&nbsp; 
          <a href="#shop?category=${product.type}">${product.type.charAt(0).toUpperCase() + product.type.slice(1)}</a> &nbsp;›&nbsp; 
          <span>${product.name}</span>
        </nav>

        <div class="pdp-layout-grid">
          <!-- Left Column: Sticky Gallery & Trust Cards -->
          <div class="pdp-gallery-col">
            <!-- Main Hero Image View -->
            <div class="pdp-main-image-card">
              <img id="detail-img-view" src="${product.img || gallery[0]}" alt="${product.name}" onerror="this.onerror=null; this.src='https://chashmah.com/wp-content/uploads/2026/08/1001073265_768x768.webp';" />
              ${discount ? `<span class="pdp-floating-badge">${discount}% OFF</span>` : ''}
              <button type="button" class="pdp-floating-wishlist ${isWishlisted ? 'active' : ''}" 
                      onclick="window.AppEvents.toggleWishlist('${product.id}')" title="Wishlist">
                <svg style="width:20px; height:20px;" fill="${isWishlisted ? '#ef4444' : 'none'}" stroke="${isWishlisted ? '#ef4444' : '#000040'}" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                </svg>
              </button>
            </div>

            <!-- Thumbnail Selector Strip (Only if multiple different images exist) -->
            ${gallery.length > 1 ? `
              <div class="pdp-thumb-strip">
                ${gallery.map((img, i) => `
                  <div class="pdp-thumb-item ${i === 0 ? 'active' : ''}" 
                       onclick="document.querySelectorAll('.pdp-thumb-item').forEach(el=>el.classList.remove('active')); this.classList.add('active'); document.getElementById('detail-img-view').src='${img}';">
                    <img src="${img}" alt="Thumbnail ${i+1}" />
                  </div>
                `).join('')}
              </div>
            ` : ''}
          </div>

          <!-- Right Column: Product Details & Purchase Actions (Compact & Systematic) -->
          <div class="pdp-info-col">
            <div class="pdp-main-card">
              <!-- Top Metadata & Title -->
              <div class="pdp-header-info">
                <div class="pdp-meta-row">
                  <span class="pdp-brand-tag">LENS S WORLD</span>
                  <span class="pdp-sku-tag">${product.sku || product.id}</span>
                  <span class="pdp-stock-status">✓ In Stock</span>
                  <span class="pdp-rating-pill"><span style="color:#f59e0b;">★</span> 4.9 (68)</span>
                </div>
                <h1 class="pdp-main-title">${product.name}</h1>
              </div>

              <!-- Price Box -->
              <div class="pdp-price-block">
                <div class="pdp-price-primary">
                  <span class="pdp-current-price">${this.formatPrice(product.price)}</span>
                  ${product.mrp ? `<span class="pdp-mrp-price">${this.formatPrice(product.mrp)}</span>` : ''}
                  ${discount ? `<span class="pdp-discount-tag">${discount}% OFF</span>` : ''}
                </div>
                <div class="pdp-tax-note">Inclusive of all taxes & standard lens fitting • Free Case & Cloth</div>
              </div>

              <!-- Trust Micro-Badges Strip -->
              <div class="pdp-micro-trust-row">
                <span class="pdp-trust-chip">🚚 Free Express Delivery</span>
                <span class="pdp-trust-chip">🛡️ 1 Year Warranty</span>
                <span class="pdp-trust-chip">👓 100% Rx Precision</span>
              </div>

              <!-- Frame Dimensions & Specs (Eyewear only) -->
              ${(product.type === 'eyeglasses' || product.type === 'sunglasses' || product.type === 'reading-glasses') ? `
                <div class="pdp-compact-section">
                  <div class="pdp-section-lbl">📐 Frame Dimensions & Fit</div>
                  <div class="pdp-dim-grid">
                    <div class="pdp-dim-item">
                      <strong class="pdp-dim-val">${lensWidth} mm</strong>
                      <span class="pdp-dim-lbl">Lens Width</span>
                    </div>
                    <div class="pdp-dim-item">
                      <strong class="pdp-dim-val">${bridgeWidth} mm</strong>
                      <span class="pdp-dim-lbl">Bridge</span>
                    </div>
                    <div class="pdp-dim-item">
                      <strong class="pdp-dim-val">${templeLength} mm</strong>
                      <span class="pdp-dim-lbl">Temple</span>
                    </div>
                    <div class="pdp-dim-item">
                      <strong class="pdp-dim-val">${weight}</strong>
                      <span class="pdp-dim-lbl">Weight</span>
                    </div>
                  </div>
                </div>
              ` : ''}

              <!-- Check Pincode Delivery -->
              <div class="pdp-compact-section">
                <div class="pdp-section-lbl">📍 Check Delivery & COD Availability</div>
                <div class="pdp-pincode-input-wrap">
                  <input type="text" id="pincode-input" class="pdp-pincode-input" placeholder="Enter 6-digit Pincode" maxlength="6" />
                  <button type="button" class="pdp-pincode-btn" 
                          onclick="const v=document.getElementById('pincode-input').value; if(v.length===6){ document.getElementById('pincode-msg').innerHTML='<span style=\\'color:#16a34a; font-weight:700;\\'>✓ Delivery in 2-4 days • COD Available</span>'; } else { document.getElementById('pincode-msg').innerHTML='<span style=\\'color:#dc2626; font-weight:600;\\'>Enter valid 6-digit pincode</span>'; }">
                    CHECK
                  </button>
                </div>
                <div id="pincode-msg" style="font-size:0.75rem; margin-top:0.25rem;"></div>
              </div>

              <!-- Lens Choice & Options -->
              <div class="pdp-compact-section">
                ${product.lensOptionsAvailable ? `
                  <div class="pdp-section-lbl">👓 Select Purchase Option</div>

                  <div class="pdp-lens-type-selector">
                    <label class="pdp-lens-type-pill active">
                      <input type="radio" name="pdp-lens-choice" value="frame" checked 
                             onchange="document.getElementById('vision-type-section').style.display='none'; window.updatePdpTotal('${product.id}', 0, 'Frame Only');" />
                      <div class="pill-content">
                        <div class="pill-title-row">
                          <span class="pill-name">Frame Only</span>
                          <span class="pill-price">${this.formatPrice(product.price)}</span>
                        </div>
                        <span class="pill-desc">Standard zero-power demo lenses</span>
                      </div>
                    </label>

                    <label class="pdp-lens-type-pill">
                      <input type="radio" name="pdp-lens-choice" value="lenses" 
                             onchange="document.getElementById('vision-type-section').style.display='block'; window.updatePdpTotal('${product.id}', 599, 'Anti-Glare ARC');" />
                      <div class="pill-content">
                        <div class="pill-title-row">
                          <span class="pill-name">Buy with Lenses</span>
                          <span class="pill-price">+₹599</span>
                        </div>
                        <span class="pill-desc">Power / Blue-Cut / Bifocal ready</span>
                      </div>
                    </label>
                  </div>

                  <!-- Interactive Vision Packages Grid & Inline Prescription -->
                  <div id="vision-type-section" style="display:none; margin-top:0.75rem; border-top:1px solid #eaedf1; padding-top:0.65rem;">
                    <div style="font-size:0.76rem; font-weight:800; color:#000040; text-transform:uppercase; margin-bottom:0.45rem;">
                      Select Lens Coating & Technology:
                    </div>

                    <div class="pdp-vision-grid">
                      ${store.lensPackages.map((lp, idx) => `
                        <div class="pdp-vision-card ${idx === 1 ? 'selected' : ''}" 
                             onclick="document.querySelectorAll('.pdp-vision-card').forEach(c=>c.classList.remove('selected')); this.classList.add('selected'); window.updatePdpTotal('${product.id}', ${lp.price}, '${lp.name}', '${lp.id}');">
                          <div class="pdp-vision-card-header">
                            <span class="pdp-vision-name">${lp.name}</span>
                            <span class="pdp-vision-badge">+${UI.formatPrice(lp.price)}</span>
                          </div>
                          <p class="pdp-vision-tagline">${lp.tagline}</p>
                        </div>
                      `).join('')}
                    </div>

                    <!-- Inline Prescription Method Selection -->
                    <div style="margin-top:0.85rem; background:#f8fafc; border:1px solid #e2e8f0; border-radius:10px; padding:0.75rem;">
                      <div style="font-size:0.74rem; font-weight:800; color:#000040; text-transform:uppercase; margin-bottom:0.45rem;">
                        Prescription Method:
                      </div>

                      <div style="display:grid; grid-template-columns:1fr 1fr; gap:0.4rem; margin-bottom:0.6rem;">
                        <label class="pdp-rx-pill active" onclick="window.switchPdpRxMethod('upload')">
                          <input type="radio" name="pdp-rx-method" value="upload" checked style="display:none;" />
                          <span style="font-size:0.74rem; font-weight:700;">📤 Upload Slip</span>
                        </label>
                        <label class="pdp-rx-pill" onclick="window.switchPdpRxMethod('whatsapp')">
                          <input type="radio" name="pdp-rx-method" value="whatsapp" style="display:none;" />
                          <span style="font-size:0.74rem; font-weight:700;">📲 WhatsApp Rx</span>
                        </label>
                        <label class="pdp-rx-pill" onclick="window.switchPdpRxMethod('manual')">
                          <input type="radio" name="pdp-rx-method" value="manual" style="display:none;" />
                          <span style="font-size:0.74rem; font-weight:700;">✍️ Enter Power</span>
                        </label>
                        <label class="pdp-rx-pill" onclick="window.switchPdpRxMethod('zero')">
                          <input type="radio" name="pdp-rx-method" value="zero" style="display:none;" />
                          <span style="font-size:0.74rem; font-weight:700;">👓 Zero Power</span>
                        </label>
                      </div>

                      <!-- Prescription Upload Box -->
                      <div id="pdp-rx-upload-box" style="border:1.5px dashed #cbd5e1; border-radius:8px; padding:0.6rem; text-align:center; background:#fff; cursor:pointer;">
                        <input type="file" id="pdp-rx-file" accept="image/*,application/pdf" style="display:none;" onchange="window.handleRxUpload(event)" />
                        <label for="pdp-rx-file" style="cursor:pointer; display:block;">
                          <span style="font-size:0.76rem; font-weight:700; color:#000040;" id="pdp-rx-file-lbl">📁 Attach Photo / Prescription Slip</span>
                          <span style="font-size:0.68rem; color:#64748b; display:block; margin-top:2px;">Camera photo or doctor slip (PDF/JPG)</span>
                        </label>
                      </div>

                      <!-- Prescription WhatsApp Box -->
                      <div id="pdp-rx-whatsapp-box" style="display:none; background:#ecfdf5; border:1px solid #a7f3d0; border-radius:8px; padding:0.55rem 0.75rem; font-size:0.74rem; color:#065f46;">
                        ✓ Place your order now. You can WhatsApp your prescription photo after checkout.
                      </div>

                      <!-- Prescription Manual Values Box -->
                      <div id="pdp-rx-manual-box" style="display:none; background:#fff; border:1px solid #e2e8f0; border-radius:8px; padding:0.6rem; font-size:0.72rem;">
                        <div style="display:grid; grid-template-columns:1fr 1fr 1fr; gap:0.4rem; font-weight:700; color:#64748b; margin-bottom:0.3rem;">
                          <span>Eye</span><span>SPH</span><span>CYL</span>
                        </div>
                        <div style="display:grid; grid-template-columns:1fr 1fr 1fr; gap:0.4rem; align-items:center; margin-bottom:0.3rem;">
                          <strong style="color:#000040;">Right (OD)</strong>
                          <select id="pdp-od-sph" style="padding:0.25rem; border:1px solid #cbd5e1; border-radius:4px; font-size:0.72rem;">
                            <option value="0.00">0.00</option>
                            <option value="-0.50">-0.50</option>
                            <option value="-1.00">-1.00</option>
                            <option value="-1.50">-1.50</option>
                            <option value="-2.00">-2.00</option>
                            <option value="+1.00">+1.00</option>
                            <option value="+1.50">+1.50</option>
                            <option value="+2.00">+2.00</option>
                          </select>
                          <select id="pdp-od-cyl" style="padding:0.25rem; border:1px solid #cbd5e1; border-radius:4px; font-size:0.72rem;">
                            <option value="0.00">0.00</option>
                            <option value="-0.50">-0.50</option>
                            <option value="-1.00">-1.00</option>
                          </select>
                        </div>
                        <div style="display:grid; grid-template-columns:1fr 1fr 1fr; gap:0.4rem; align-items:center;">
                          <strong style="color:#000040;">Left (OS)</strong>
                          <select id="pdp-os-sph" style="padding:0.25rem; border:1px solid #cbd5e1; border-radius:4px; font-size:0.72rem;">
                            <option value="0.00">0.00</option>
                            <option value="-0.50">-0.50</option>
                            <option value="-1.00">-1.00</option>
                            <option value="-1.50">-1.50</option>
                            <option value="-2.00">-2.00</option>
                            <option value="+1.00">+1.00</option>
                            <option value="+1.50">+1.50</option>
                            <option value="+2.00">+2.00</option>
                          </select>
                          <select id="pdp-os-cyl" style="padding:0.25rem; border:1px solid #cbd5e1; border-radius:4px; font-size:0.72rem;">
                            <option value="0.00">0.00</option>
                            <option value="-0.50">-0.50</option>
                            <option value="-1.00">-1.00</option>
                          </select>
                        </div>
                      </div>

                      <!-- Prescription Zero Box -->
                      <div id="pdp-rx-zero-box" style="display:none; background:#f0fdf4; border:1px solid #bbf7d0; border-radius:8px; padding:0.55rem 0.75rem; font-size:0.74rem; color:#166534;">
                        ✓ Zero power anti-blue light or zero-power coating lenses will be fitted.
                      </div>
                    </div>
                  </div>
                ` : `
                  <div class="pdp-section-lbl">🛍️ Purchase Option</div>
                  <div style="font-size:0.8rem; color:#475569;">
                    Ready to dispatch • 100% Genuine Quality
                  </div>
                `}

                <!-- Final Total & Purchase Buttons -->
                <div class="pdp-total-summary-row">
                  <div>
                    <span style="font-size:0.72rem; color:#64748b; display:block;">Total Payable:</span>
                    <span id="pdp-final-total" style="font-size:1.25rem; font-weight:800; color:#000040;">${this.formatPrice(product.price)}</span>
                  </div>
                  <div class="pdp-action-btn-group">
                    <button type="button" class="btn btn-navy btn-pdp-main" id="pdp-submit-btn" 
                            onclick="window.AppEvents.addStandardProduct('${product.id}')">
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>

              <!-- Product Description & Specs Accordion -->
              <div class="pdp-compact-section" style="border-bottom:none; margin-bottom:0; padding-bottom:0;">
                <div class="pdp-section-lbl">✨ Product Overview & Features</div>
                <p class="pdp-overview-text">${product.description}</p>
                ${product.features ? `
                  <div class="pdp-features-grid">
                    ${product.features.map(f => `
                      <div class="pdp-feature-item">
                        <span class="pdp-check-icon">✓</span>
                        <span>${f}</span>
                      </div>
                    `).join('')}
                  </div>
                ` : ''}
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  // Render Cart Drawer
  renderCartDrawer() {
    const container = document.getElementById("cart-drawer-items");
    const footer = document.getElementById("cart-drawer-footer");
    if (!container || !footer) return;

    if (store.cart.length === 0) {
      container.innerHTML = `
        <div style="text-align:center; padding:3.5rem 1rem;">
          <div style="font-size:2.5rem; margin-bottom:0.65rem;">🛍️</div>
          <h4 style="color:#000040; font-size:1.05rem; font-weight:800; margin-bottom:0.25rem;">Your Cart is Empty</h4>
          <p style="color:#64748b; font-size:0.82rem; margin-bottom:1.25rem;">Add some stylish eyeglasses or sunglasses to get started!</p>
          <button type="button" class="btn btn-navy btn-sm" onclick="store.closeCartDrawer(); window.location.hash='#shop';">Browse Eyewear</button>
        </div>
      `;
      footer.style.display = 'none';
      return;
    }

    footer.style.display = 'block';

    container.innerHTML = store.cart.map(item => {
      const itemUnitPrice = item.price + (item.selectedLens?.price || 0);
      const fallbackImg = 'https://chashmah.com/wp-content/uploads/2026/08/1001073265_768x768.webp';
      const imgSrc = item.img || fallbackImg;

      return `
        <div class="cart-item-row">
          <div class="cart-item-img-box">
            <img src="${imgSrc}" onerror="this.onerror=null; this.src='${fallbackImg}';" alt="${item.name}" class="cart-item-img" />
          </div>
          <div class="cart-item-info">
            <div class="cart-item-top-row">
              <h4 class="cart-item-title" title="${item.name}">${item.name}</h4>
              <button type="button" class="cart-delete-btn" onclick="store.removeFromCart('${item.cartItemId}')" title="Remove item">✕</button>
            </div>
            ${item.selectedLens ? `<div class="cart-item-lens">👓 ${item.selectedLens.name} (+${this.formatPrice(item.selectedLens.price)})</div>` : '<div class="cart-item-lens" style="color:#64748b;">Frame Only</div>'}
            
            <div class="cart-item-bottom">
              <div class="qty-stepper">
                <button type="button" onclick="store.updateCartQty('${item.cartItemId}', ${item.qty - 1})">-</button>
                <span>${item.qty}</span>
                <button type="button" onclick="store.updateCartQty('${item.cartItemId}', ${item.qty + 1})">+</button>
              </div>

              <strong class="cart-item-price">${this.formatPrice(itemUnitPrice * item.qty)}</strong>
            </div>
          </div>
        </div>
      `;
    }).join('');

    const totals = store.getTotals();
    footer.innerHTML = `
      <div class="cart-coupon-wrap">
        <input type="text" id="cart-coupon-code" placeholder="Coupon Code (e.g. LENS10)" class="cart-coupon-input" value="${store.appliedCoupon || ''}" />
        ${store.appliedCoupon ? `
          <button type="button" class="btn btn-outline btn-sm" onclick="store.removeCoupon()" style="padding:0.4rem 0.75rem; font-size:0.78rem;">Remove</button>
        ` : `
          <button type="button" class="btn btn-navy btn-sm" onclick="store.applyCoupon(document.getElementById('cart-coupon-code').value)" style="padding:0.4rem 0.85rem; font-size:0.78rem;">Apply</button>
        `}
      </div>

      <div class="cart-price-breakdown">
        <div class="price-row">
          <span>Subtotal</span>
          <span>${this.formatPrice(totals.subtotal)}</span>
        </div>
        ${totals.discount > 0 ? `
          <div class="price-row" style="color:#16a34a;">
            <span>Discount (${store.appliedCoupon})</span>
            <span>-${this.formatPrice(totals.discount)}</span>
          </div>
        ` : ''}
        <div class="price-row">
          <span>Delivery</span>
          <span style="color:#16a34a; font-weight:700;">${totals.shipping === 0 ? 'FREE' : this.formatPrice(totals.shipping)}</span>
        </div>
        <div class="price-row total">
          <span>Total Payable</span>
          <span>${this.formatPrice(totals.grandTotal)}</span>
        </div>
      </div>

      <div class="cart-drawer-action-row">
        <button type="button" class="btn btn-outline btn-cart-action" onclick="store.closeCartDrawer(); window.location.hash='#cart';">View Cart</button>
        <button type="button" class="btn btn-navy btn-cart-action" onclick="store.closeCartDrawer(); window.location.hash='#checkout';">Checkout →</button>
      </div>
    `;
  },

  // Render Full Wishlist Page
  renderWishlistPage() {
    const wishlistedProducts = store.products.filter(p => store.wishlist.includes(p.id));

    if (wishlistedProducts.length === 0) {
      return `
        <div class="container section" style="text-align:center; padding:4.5rem 1rem; max-width:600px; margin:0 auto;">
          <div style="font-size:3.5rem; margin-bottom:1rem;">❤️</div>
          <h2 style="font-size:1.45rem; font-weight:800; color:#000040; margin-bottom:0.35rem;">Your Wishlist is Empty</h2>
          <p style="color:#64748b; font-size:0.88rem; margin-bottom:1.5rem;">Save your favorite eyeglasses & sunglasses by clicking the heart icon on any product.</p>
          <a href="#shop" class="btn btn-navy" style="padding:0.7rem 2rem; font-size:0.9rem; font-weight:700;">Explore Eyewear Catalog →</a>
        </div>
      `;
    }

    return `
      <div class="container section" style="padding-top:1.5rem;">
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:0.5rem; margin-bottom:1.5rem; border-bottom:1px solid #e2e8f0; padding-bottom:0.75rem;">
          <div>
            <h1 style="font-size:1.4rem; font-weight:800; color:#000040; margin:0;">❤️ My Saved Wishlist (${wishlistedProducts.length})</h1>
            <small style="color:#64748b; font-size:0.75rem;">Your favorite frames saved across sessions</small>
          </div>
          <a href="#shop" class="btn btn-outline btn-sm" style="border-color:#cbd5e1; color:#000040;">+ Browse More Eyewear</a>
        </div>

        <div class="product-grid">
          ${wishlistedProducts.map(p => this.renderProductCard(p)).join('')}
        </div>
      </div>
    `;
  },

  // Render Full Cart Page
  renderCartPage() {
    const totals = store.getTotals();

    if (store.cart.length === 0) {
      return `
        <div class="container section" style="text-align:center; padding:4rem 1rem;">
          <h2>No products in the cart.</h2>
          <a href="#shop" class="btn btn-navy" style="margin-top:1rem;">Return to Shop</a>
        </div>
      `;
    }

    return `
      <div class="container section">
        <h1 style="font-size:1.5rem; font-weight:800; color:#000040; margin-bottom:1.25rem;">Cart (${totals.cartCount})</h1>

        <div class="cart-layout-grid">
          <div class="checkout-card">
            ${store.cart.map(item => `
              <div class="cart-item-row">
                <img src="${item.img}" alt="${item.name}" class="cart-item-img" />
                <div class="cart-item-info">
                  <h4 class="cart-item-title">${item.name}</h4>
                  ${item.selectedLens ? `<div class="cart-item-lens">Lens: ${item.selectedLens.name} (+${this.formatPrice(item.selectedLens.price)})</div>` : ''}
                  
                  <div class="cart-item-bottom">
                    <div class="qty-stepper">
                      <button type="button" onclick="store.updateCartQty('${item.cartItemId}', ${item.qty - 1})">-</button>
                      <span>${item.qty}</span>
                      <button type="button" onclick="store.updateCartQty('${item.cartItemId}', ${item.qty + 1})">+</button>
                    </div>

                    <strong>${this.formatPrice((item.price + (item.selectedLens?.price || 0)) * item.qty)}</strong>

                    <button type="button" onclick="store.removeFromCart('${item.cartItemId}')" style="color:#ef4444; font-size:0.75rem; background:none; border:none; cursor:pointer;">Remove</button>
                  </div>
                </div>
              </div>
            `).join('')}
          </div>

          <div class="checkout-card">
            <h3 style="font-size:1.1rem; font-weight:800; color:#000040; margin-bottom:1rem; border-bottom:1px solid #eaedf1; padding-bottom:0.5rem;">Cart Totals</h3>
            <div class="price-row">
              <span>Subtotal</span>
              <span>${this.formatPrice(totals.subtotal)}</span>
            </div>
            ${totals.discount > 0 ? `
              <div class="price-row" style="color:#16a34a;">
                <span>Discount</span>
                <span>-${this.formatPrice(totals.discount)}</span>
              </div>
            ` : ''}
            <div class="price-row">
              <span>Shipping</span>
              <span style="color:#16a34a; font-weight:700;">${totals.shipping === 0 ? 'FREE' : this.formatPrice(totals.shipping)}</span>
            </div>
            <div class="price-row total" style="border-top:1px solid #eaedf1; padding-top:0.5rem; margin-top:0.5rem;">
              <span>Total</span>
              <span style="font-size:1.2rem; font-weight:800; color:#000040;">${this.formatPrice(totals.grandTotal)}</span>
            </div>

            <a href="#checkout" class="btn btn-navy" style="width:100%; margin-top:1rem; height:42px;">Proceed to Checkout →</a>
          </div>
        </div>
      </div>
    `;
  },

  // Render Checkout Page (Clean, Compact & Easy)
  renderCheckoutPage() {
    const totals = store.getTotals();
    if (store.cart.length === 0) {
      return `
        <div class="section" style="text-align:center; padding:3rem 1rem; max-width:500px; margin:0 auto;">
          <div style="font-size:2.5rem; margin-bottom:0.75rem;">🛒</div>
          <h2 style="color:#000040; font-size:1.35rem; font-weight:800; margin-bottom:0.35rem;">Your Cart is Empty</h2>
          <p style="color:#64748b; font-size:0.85rem; margin-bottom:1.25rem;">Choose your favorite frames & sunglasses to proceed.</p>
          <a href="#shop" class="btn btn-navy btn-sm" style="padding:0.6rem 1.5rem;">Explore Catalog →</a>
        </div>
      `;
    }

    return `
      <div class="section" style="padding:0.5rem 0.75rem 2.5rem; max-width:860px; margin:0 auto;">
        
        <!-- Super Compact Minimal Header -->
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.75rem; border-bottom:1px solid #f1f5f9; padding-bottom:0.4rem;">
          <h1 style="font-size:1.05rem; font-weight:800; color:#000040; margin:0; display:flex; align-items:center; gap:0.3rem;">
            <span>⚡</span> Checkout
          </h1>
          <div style="font-size:0.68rem; color:#059669; font-weight:700; background:#ecfdf5; padding:2px 8px; border-radius:20px;">
            🛡️ Safe • Free Shipping
          </div>
        </div>

        <form onsubmit="window.AppEvents.handleCheckoutSubmit(event)">
          <div style="display:grid; grid-template-columns:1.2fr 1fr; gap:1.25rem; align-items:start;" class="checkout-layout-grid">
            
            <!-- Left Side: Simple Details -->
            <div style="display:flex; flex-direction:column; gap:1rem;">
              
              <!-- Contact & Delivery -->
              <div style="background:#fff; border:1px solid #e2e8f0; border-radius:12px; padding:1.1rem; box-shadow:0 1px 4px rgba(0,0,0,0.03);">
                <div style="font-size:0.88rem; font-weight:800; color:#000040; margin-bottom:0.75rem; display:flex; align-items:center; gap:0.4rem;">
                  <span>📍</span> Delivery & Contact Details
                </div>

                <div style="display:grid; grid-template-columns:1fr 1fr; gap:0.65rem; margin-bottom:0.65rem;">
                  <div>
                    <label style="font-size:0.72rem; font-weight:700; color:#475569; display:block; margin-bottom:0.2rem;">Full Name *</label>
                    <input type="text" id="cust-name" placeholder="Rahul Sharma" required style="width:100%; padding:0.5rem 0.65rem; border:1px solid #cbd5e1; border-radius:6px; font-size:0.82rem;" />
                  </div>
                  <div>
                    <label style="font-size:0.72rem; font-weight:700; color:#475569; display:block; margin-bottom:0.2rem;">WhatsApp Mobile *</label>
                    <input type="tel" id="cust-phone" placeholder="9876543210" required style="width:100%; padding:0.5rem 0.65rem; border:1px solid #cbd5e1; border-radius:6px; font-size:0.82rem;" />
                  </div>
                </div>

                <div style="margin-bottom:0.65rem;">
                  <label style="font-size:0.72rem; font-weight:700; color:#475569; display:block; margin-bottom:0.2rem;">Email ID * (For order confirmation)</label>
                  <input type="email" id="cust-email" placeholder="rahul@gmail.com" required style="width:100%; padding:0.5rem 0.65rem; border:1px solid #cbd5e1; border-radius:6px; font-size:0.82rem;" />
                </div>

                <div style="margin-bottom:0.65rem;">
                  <label style="font-size:0.72rem; font-weight:700; color:#475569; display:block; margin-bottom:0.2rem;">Street Address / House No. *</label>
                  <input type="text" id="cust-address" placeholder="Flat No., Street, Landmark..." required style="width:100%; padding:0.5rem 0.65rem; border:1px solid #cbd5e1; border-radius:6px; font-size:0.82rem;" />
                </div>

                <div style="display:grid; grid-template-columns:1.2fr 1fr; gap:0.65rem;">
                  <div>
                    <label style="font-size:0.72rem; font-weight:700; color:#475569; display:block; margin-bottom:0.2rem;">City *</label>
                    <input type="text" id="cust-city" placeholder="Mumbai" required style="width:100%; padding:0.5rem 0.65rem; border:1px solid #cbd5e1; border-radius:6px; font-size:0.82rem;" />
                  </div>
                  <div>
                    <label style="font-size:0.72rem; font-weight:700; color:#475569; display:block; margin-bottom:0.2rem;">Pincode *</label>
                    <input type="text" id="cust-pincode" placeholder="400001" required style="width:100%; padding:0.5rem 0.65rem; border:1px solid #cbd5e1; border-radius:6px; font-size:0.82rem;" />
                  </div>
                </div>
              </div>

              <!-- Payment Method (Super Simple) -->
              <div style="background:#fff; border:1px solid #e2e8f0; border-radius:12px; padding:1.1rem; box-shadow:0 1px 4px rgba(0,0,0,0.03);">
                <div style="font-size:0.88rem; font-weight:800; color:#000040; margin-bottom:0.65rem; display:flex; align-items:center; gap:0.4rem;">
                  <span>💳</span> Payment Option
                </div>

                <div style="display:flex; flex-direction:column; gap:0.5rem;">
                  <label style="display:flex; align-items:center; justify-content:space-between; padding:0.6rem 0.85rem; border:1.5px solid #000040; border-radius:8px; cursor:pointer; background:#f8fafc; font-size:0.82rem;">
                    <div style="display:flex; align-items:center; gap:0.5rem;">
                      <input type="radio" name="payment-mode" value="UPI" checked style="accent-color:#000040;" />
                      <strong style="color:#000040;">⚡ Instant UPI / GPay / PhonePe / QR</strong>
                    </div>
                    <span style="font-size:0.68rem; color:#059669; font-weight:700; background:#ecfdf5; padding:2px 6px; border-radius:4px;">Fast</span>
                  </label>

                  <label style="display:flex; align-items:center; justify-content:space-between; padding:0.6rem 0.85rem; border:1px solid #cbd5e1; border-radius:8px; cursor:pointer; background:#fff; font-size:0.82rem;">
                    <div style="display:flex; align-items:center; gap:0.5rem;">
                      <input type="radio" name="payment-mode" value="Cash on Delivery" style="accent-color:#000040;" />
                      <span style="color:#334155; font-weight:600;">💵 Cash on Delivery (COD)</span>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            <!-- Right Side: Order Summary & Pay -->
            <div style="position:sticky; top:75px;">
              <div style="background:#fff; border:1px solid #e2e8f0; border-radius:12px; padding:1.1rem; box-shadow:0 2px 8px rgba(0,0,0,0.04);">
                
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.75rem; border-bottom:1px solid #f1f5f9; padding-bottom:0.45rem;">
                  <strong style="font-size:0.88rem; color:#000040;">Order Summary (${totals.cartCount})</strong>
                  <a href="#cart" style="font-size:0.72rem; color:#0284c7; font-weight:600; text-decoration:none;">Edit Cart</a>
                </div>

                <!-- Items list -->
                <div style="display:flex; flex-direction:column; gap:0.5rem; margin-bottom:0.85rem; max-height:160px; overflow-y:auto; padding-right:2px;">
                  ${store.cart.map(item => `
                    <div style="display:flex; align-items:center; gap:0.5rem; font-size:0.78rem;">
                      <img src="${item.img}" style="width:36px; height:36px; border-radius:6px; object-fit:contain; border:1px solid #e2e8f0; background:#f8fafc;" alt="${item.name}" />
                      <div style="flex:1; min-width:0;">
                        <div style="font-weight:700; color:#000040; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${item.name}</div>
                        <small style="color:#64748b; font-size:0.68rem;">${item.selectedLens ? item.selectedLens.name : 'Frame'} • Qty ${item.qty}</small>
                      </div>
                      <strong style="color:#000040; font-size:0.82rem;">${this.formatPrice((item.price + (item.selectedLens?.price || 0)) * item.qty)}</strong>
                    </div>
                  `).join('')}
                </div>

                <!-- Coupon -->
                <div style="display:flex; gap:0.3rem; margin-bottom:0.85rem;">
                  <input type="text" id="checkout-coupon-input" placeholder="Coupon (LENS10)" value="${store.appliedCoupon || ''}" style="flex:1; padding:0.4rem 0.5rem; border:1px solid #cbd5e1; border-radius:6px; font-size:0.75rem; text-transform:uppercase; font-weight:700;" />
                  <button type="button" onclick="const code = document.getElementById('checkout-coupon-input').value; store.applyCoupon(code); const m = document.getElementById('app-main'); if(m) m.innerHTML = UI.renderCheckoutPage();" class="btn btn-navy btn-sm" style="padding:0 0.65rem; font-size:0.72rem; height:28px;">Apply</button>
                </div>
                ${store.appliedCoupon ? `
                  <div style="font-size:0.7rem; color:#16a34a; font-weight:700; margin-top:-0.5rem; margin-bottom:0.6rem; display:flex; justify-content:space-between;">
                    <span>✓ "${store.appliedCoupon}" applied</span>
                    <a href="javascript:void(0)" onclick="store.removeCoupon(); const m = document.getElementById('app-main'); if(m) m.innerHTML = UI.renderCheckoutPage();" style="color:#ef4444;">Remove</a>
                  </div>
                ` : ''}

                <!-- Totals -->
                <div style="display:flex; flex-direction:column; gap:0.25rem; font-size:0.78rem; color:#475569; border-top:1px solid #f1f5f9; padding-top:0.5rem;">
                  <div style="display:flex; justify-content:space-between;">
                    <span>Subtotal:</span>
                    <span style="font-weight:700; color:#1e293b;">${this.formatPrice(totals.subtotal)}</span>
                  </div>
                  ${totals.discount > 0 ? `
                    <div style="display:flex; justify-content:space-between; color:#16a34a;">
                      <span>Discount:</span>
                      <span style="font-weight:700;">-${this.formatPrice(totals.discount)}</span>
                    </div>
                  ` : ''}
                  <div style="display:flex; justify-content:space-between;">
                    <span>Shipping:</span>
                    <span style="font-weight:700; color:#16a34a;">${totals.shipping === 0 ? 'FREE' : this.formatPrice(totals.shipping)}</span>
                  </div>
                  <div style="display:flex; justify-content:space-between; border-top:1.5px solid #000040; padding-top:0.4rem; margin-top:0.2rem; font-size:1rem; font-weight:800; color:#000040;">
                    <span>Total:</span>
                    <span>${this.formatPrice(totals.grandTotal)}</span>
                  </div>
                </div>

                <!-- Submit Button -->
                <button type="submit" class="btn btn-navy" style="width:100%; margin-top:0.85rem; height:42px; font-size:0.88rem; font-weight:800; border-radius:8px;">
                  Confirm & Place Order →
                </button>

                <div style="margin-top:0.6rem; text-align:center; font-size:0.68rem; color:#94a3b8;">
                  🔒 256-Bit SSL Encrypted • Instant Email & WhatsApp
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    `;
  },

  // Render Order Success & Printable Official Receipt (Clean & Compact)
  renderOrderSuccessPage(orderId) {
    const order = store.orders.find(o => o.id === orderId) || store.orders[0] || {
      id: orderId || 'LSW-1001',
      createdAt: new Date().toISOString(),
      customer: { name: 'Customer', phone: '9876543210', email: '', address: 'Main Road', city: 'Mumbai', pincode: '400001' },
      items: store.products.slice(0, 1).map(p => ({ ...p, qty: 1, selectedLens: { name: 'Anti-Glare (ARC)', price: 499 } })),
      total: 1498,
      paymentMethod: 'UPI'
    };

    const whatsappUrl = `https://wa.me/${STORE_INFO.whatsappNumber}?text=${encodeURIComponent(formatOrderForWhatsApp(order))}`;
    const orderDate = new Date(order.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });

    return `
      <div class="section" style="padding:1.5rem 1rem 3rem; max-width:680px; margin:0 auto;">
        
        <!-- Success Banner -->
        <div class="no-print" style="text-align:center; margin-bottom:1.25rem;">
          <div style="width:48px; height:48px; border-radius:50%; background:#dcfce7; color:#16a34a; display:inline-flex; align-items:center; justify-content:center; font-size:1.5rem; font-weight:800; margin-bottom:0.5rem; box-shadow:0 4px 12px rgba(22,163,74,0.15);">✓</div>
          <h1 style="font-size:1.35rem; font-weight:800; color:#000040; margin:0 0 0.25rem 0;">Order #${order.id} Confirmed!</h1>
          <p style="color:#64748b; font-size:0.82rem; margin:0 0 1rem 0;">Order details & tracking link sent to your WhatsApp & Email.</p>

          <!-- Quick Action Buttons -->
          <div style="display:flex; justify-content:center; gap:0.5rem; flex-wrap:wrap; margin-bottom:0.75rem;">
            <a href="${whatsappUrl}" target="_blank" class="btn btn-sm" style="background:#25d366; color:#fff; border-radius:8px; padding:0.45rem 0.9rem; font-size:0.78rem; font-weight:700; display:inline-flex; align-items:center; gap:0.3rem;">
              💬 WhatsApp Order Slip
            </a>
            <button type="button" class="btn btn-outline btn-sm" onclick="window.print()" style="border-radius:8px; padding:0.45rem 0.9rem; font-size:0.78rem; font-weight:700; border-color:#cbd5e1; color:#000040;">
              🖨️ Print Receipt
            </button>
            <a href="#track?id=${order.id}" class="btn btn-outline btn-sm" style="border-radius:8px; padding:0.45rem 0.9rem; font-size:0.78rem; font-weight:700; border-color:#cbd5e1; color:#000040;">
              🚚 Track Order
            </a>
          </div>
          <a href="#shop" style="font-size:0.78rem; color:#0284c7; font-weight:700; text-decoration:none;">← Continue Shopping</a>
        </div>

        <!-- Official Compact Invoice / Receipt Card -->
        <div style="background:#fff; border:1px solid #e2e8f0; border-radius:16px; padding:1.25rem; box-shadow:0 2px 10px rgba(0,0,0,0.04);">
          
          <!-- Receipt Header -->
          <div style="display:flex; justify-content:space-between; align-items:flex-start; border-bottom:1.5px solid #f1f5f9; padding-bottom:0.75rem; margin-bottom:0.85rem;">
            <div>
              <img src="images/lenss_world_logo_with_name-removebg-preview.png" alt="LENS S WORLD" style="height:32px; object-fit:contain; margin-bottom:0.15rem;" />
              <div style="font-size:0.7rem; color:#64748b;">WhatsApp: +91 86686 87897</div>
            </div>
            <div style="text-align:right;">
              <span style="background:#000040; color:#fff; font-size:0.65rem; font-weight:800; padding:2px 7px; border-radius:4px; letter-spacing:0.04em;">TAX INVOICE</span>
              <div style="font-size:0.85rem; font-weight:800; color:#000040; margin-top:0.2rem;">#${order.id}</div>
              <small style="font-size:0.68rem; color:#94a3b8;">${orderDate}</small>
            </div>
          </div>

          <!-- Customer & Payment Details (2 Columns) -->
          <div style="display:grid; grid-template-columns:1.2fr 1fr; gap:0.75rem; background:#f8fafc; padding:0.75rem 0.85rem; border-radius:10px; margin-bottom:0.85rem; font-size:0.78rem;">
            <div>
              <span style="font-size:0.68rem; font-weight:800; color:#64748b; text-transform:uppercase; display:block;">Deliver To:</span>
              <strong style="color:#000040; font-size:0.84rem;">${order.customer?.name || 'Customer'}</strong>
              <div style="color:#334155;">📱 ${order.customer?.phone || '-'}</div>
              ${order.customer?.email ? `<div style="color:#334155; font-size:0.72rem;">✉️ ${order.customer.email}</div>` : ''}
              <div style="color:#475569; font-size:0.72rem; line-height:1.25; margin-top:2px;">📍 ${order.customer?.address || ''}, ${order.customer?.city || ''} ${order.customer?.pincode || ''}</div>
            </div>
            <div style="text-align:right;">
              <span style="font-size:0.68rem; font-weight:800; color:#64748b; text-transform:uppercase; display:block;">Payment:</span>
              <strong style="color:#000040; font-size:0.82rem;">${order.paymentMethod || 'Instant UPI'}</strong>
              <div style="margin-top:0.25rem;">
                <span style="background:${order.paymentMethod === 'Cash on Delivery' ? '#fef3c7' : '#ecfdf5'}; color:${order.paymentMethod === 'Cash on Delivery' ? '#b45309' : '#059669'}; font-size:0.68rem; font-weight:800; padding:2px 7px; border-radius:12px; display:inline-block;">
                  ${order.paymentMethod === 'Cash on Delivery' ? 'Cash on Delivery' : '✓ Payment Confirmed'}
                </span>
              </div>
            </div>
          </div>

          <!-- Itemized List -->
          <div style="margin-bottom:0.85rem;">
            <div style="font-size:0.7rem; font-weight:800; color:#64748b; text-transform:uppercase; margin-bottom:0.4rem; padding-bottom:0.25rem; border-bottom:1px solid #f1f5f9;">
              Items Ordered
            </div>
            ${(order.items || []).map(it => {
              const unitRate = it.price + (it.selectedLens?.price || 0);
              return `
                <div style="display:flex; justify-content:space-between; align-items:center; padding:0.4rem 0; border-bottom:1px dashed #f1f5f9; font-size:0.78rem;">
                  <div style="flex:1; padding-right:0.5rem;">
                    <strong style="color:#000040; font-size:0.82rem;">${it.name}</strong>
                    <div style="font-size:0.7rem; color:#64748b;">
                      ${it.selectedLens ? `👓 Lens: ${it.selectedLens.name}` : 'Frame Only'} • Qty: ${it.qty}
                    </div>
                  </div>
                  <div style="text-align:right; font-weight:800; color:#000040; font-size:0.84rem;">
                    ${this.formatPrice(unitRate * it.qty)}
                  </div>
                </div>
              `;
            }).join('')}
          </div>

          <!-- Total Calculation Summary -->
          <div style="border-top:1px solid #e2e8f0; padding-top:0.5rem; display:flex; flex-direction:column; gap:0.25rem; font-size:0.78rem; color:#475569;">
            <div style="display:flex; justify-content:space-between;">
              <span>Subtotal:</span>
              <span style="font-weight:700; color:#1e293b;">${this.formatPrice(order.subtotal || order.total || 0)}</span>
            </div>
            ${order.discount > 0 ? `
              <div style="display:flex; justify-content:space-between; color:#16a34a;">
                <span>Discount:</span>
                <span style="font-weight:700;">-${this.formatPrice(order.discount)}</span>
              </div>
            ` : ''}
            <div style="display:flex; justify-content:space-between;">
              <span>Express Delivery:</span>
              <span style="font-weight:700; color:#16a34a;">FREE</span>
            </div>
            <div style="display:flex; justify-content:space-between; border-top:1.5px solid #000040; padding-top:0.4rem; margin-top:0.25rem; font-size:0.95rem; font-weight:800; color:#000040;">
              <span>Total Paid:</span>
              <span>${this.formatPrice(order.total || order.grandTotal || 0)}</span>
            </div>
          </div>

          <!-- Compact Footer Guarantee -->
          <div style="margin-top:0.85rem; padding-top:0.5rem; border-top:1px dashed #e2e8f0; text-align:center; font-size:0.68rem; color:#64748b;">
            🛡️ <strong>1-Year Optical Guarantee</strong> • 100% Genuine Lenses • For support WhatsApp +91 86686 87897
          </div>
        </div>
      </div>
    `;
  },

  // Render Real-Time Track Order Page
  renderTrackOrderPage(searchQuery = '') {
    const cleanQuery = (searchQuery || '').trim();
    let matchedOrder = null;

    if (cleanQuery) {
      matchedOrder = store.orders.find(o => 
        o.id.toLowerCase() === cleanQuery.toLowerCase() || 
        (o.customer?.phone && o.customer.phone.includes(cleanQuery))
      );
    } else if (store.orders.length > 0) {
      matchedOrder = store.orders[0];
    }

    const orderStatuses = [
      { key: 'Placed', label: 'Order Placed', desc: 'Order confirmed & invoice generated', icon: '📝' },
      { key: 'Prescription Verified', label: 'Prescription Verified', desc: 'Power verified by optical team', icon: '🔍' },
      { key: 'In Lab Fitting', label: 'Lab Lens Fitting', desc: 'Laser lens edging & frame alignment', icon: '🔬' },
      { key: 'Dispatched', label: 'Quality Passed & Dispatched', desc: 'Handed over to courier partner', icon: '🚚' },
      { key: 'Delivered', label: 'Delivered', desc: 'Safely delivered with care kit', icon: '🏡' }
    ];

    const currentStatus = matchedOrder ? (matchedOrder.status || 'Placed') : 'Placed';
    let currentIdx = orderStatuses.findIndex(s => s.key === currentStatus);
    if (currentIdx === -1) currentIdx = 0;

    return `
      <div class="container-narrow section" style="padding-top:1.5rem;">
        <div class="section-header" style="text-align:center; margin-bottom:1.5rem;">
          <span class="section-tag" style="background:#000040; color:#fff;">Live Logistics</span>
          <h1 class="section-title" style="font-size:1.6rem; color:#000040;">🚚 Track Your Order</h1>
          <p class="section-subtitle">Check real-time optical lab status & dispatch progress of your eyewear.</p>
        </div>

        <!-- Search Order Box -->
        <div class="checkout-card" style="margin-bottom:1.5rem;">
          <form onsubmit="event.preventDefault(); const q = document.getElementById('track-search-input').value.trim(); window.location.hash = '#track?id=' + encodeURIComponent(q);" style="display:flex; gap:0.5rem; flex-wrap:wrap;">
            <input type="text" id="track-search-input" value="${cleanQuery || matchedOrder?.id || ''}" placeholder="Enter Order ID (e.g. LSW-1082) or Phone No..." class="checkout-input" style="flex:1; min-width:200px;" required />
            <button type="submit" class="btn btn-navy" style="height:40px; padding:0 1.25rem; font-weight:700;">Track Order →</button>
          </form>
        </div>

        ${matchedOrder ? `
          <div class="checkout-card" style="margin-bottom:1.5rem;">
            <div style="display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:0.75rem; border-bottom:1px solid #eaedf1; padding-bottom:0.75rem; margin-bottom:1rem;">
              <div>
                <span style="font-size:0.72rem; color:#64748b; font-weight:700; text-transform:uppercase;">ORDER NUMBER</span>
                <h3 style="font-size:1.25rem; font-weight:800; color:#000040; margin:0.15rem 0;">#${matchedOrder.id}</h3>
                <small style="color:#64748b;">Placed on ${new Date(matchedOrder.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</small>
              </div>
              <div style="text-align:right;">
                <span class="admin-tag-pill" style="background:#000040; color:#fff; font-size:0.8rem; padding:4px 10px;">
                  Status: ${matchedOrder.status || 'Placed'}
                </span>
                <div style="font-size:0.88rem; font-weight:800; color:#000040; margin-top:0.35rem;">${this.formatPrice(matchedOrder.total || matchedOrder.grandTotal || 0)}</div>
              </div>
            </div>

            <!-- Visual Step-by-Step Progress Timeline -->
            <div class="tracking-timeline">
              ${orderStatuses.map((st, idx) => {
                const isPassed = idx < currentIdx;
                const isCurrent = idx === currentIdx;
                const isFuture = idx > currentIdx;

                return `
                  <div class="timeline-step ${isPassed ? 'completed' : ''} ${isCurrent ? 'active' : ''} ${isFuture ? 'pending' : ''}">
                    <div class="step-indicator">
                      ${isPassed ? '✓' : st.icon}
                    </div>
                    <div class="step-content">
                      <strong class="step-title">${st.label}</strong>
                      <span class="step-desc">${st.desc}</span>
                    </div>
                  </div>
                `;
              }).join('')}
            </div>

            <!-- Customer & Itemized Summary in Track -->
            <div style="border-top:1px solid #eaedf1; padding-top:1rem; margin-top:1.5rem; display:grid; grid-template-columns:1fr 1fr; gap:1rem;">
              <div>
                <span style="font-size:0.72rem; font-weight:800; color:#64748b; text-transform:uppercase;">Delivery Destination</span>
                <strong style="display:block; color:#000040; font-size:0.84rem; margin-top:0.2rem;">${matchedOrder.customer?.name || 'Customer'}</strong>
                <div style="font-size:0.75rem; color:#475569;">📍 ${matchedOrder.customer?.address || ''}, ${matchedOrder.customer?.city || ''} ${matchedOrder.customer?.pincode || ''}</div>
              </div>

              <div style="text-align:right;">
                <span style="font-size:0.72rem; font-weight:800; color:#64748b; text-transform:uppercase;">Need Instant Update?</span>
                <div style="margin-top:0.35rem;">
                  <a href="https://wa.me/${STORE_INFO.whatsappNumber}?text=${encodeURIComponent(`Hello LENS S WORLD! 👋 Tracking update query for Order #${matchedOrder.id}...`)}" target="_blank" class="btn btn-navy btn-sm" style="background:#25d366; border-color:#25d366; color:#fff;">
                    💬 WhatsApp Support
                  </a>
                </div>
              </div>
            </div>
          </div>
        ` : `
          <div class="checkout-card" style="text-align:center; padding:2.5rem 1rem;">
            <div style="font-size:2.5rem; margin-bottom:0.5rem;">🔍</div>
            <h3 style="font-size:1.15rem; font-weight:800; color:#000040;">No order found for "${cleanQuery}"</h3>
            <p style="font-size:0.85rem; color:#64748b; max-width:400px; margin:0.25rem auto 1.25rem;">
              Please double check your Order ID (e.g. LSW-1082) or registered WhatsApp mobile number.
            </p>
            <a href="#shop" class="btn btn-navy btn-sm">Explore Eyewear Catalog</a>
          </div>
        `}
      </div>
    `;
  },

  // Render Lenses Guide Page
  renderLensGuidePage() {
    return `
      <div class="container section">
        <div class="section-header">
          <span class="section-tag">Eyewear Education</span>
          <h1 class="section-title">Lenses Guide</h1>
          <p class="section-subtitle">Learn about our Blue UV, Transition, and Progressive lenses</p>
        </div>

        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(280px, 1fr)); gap:1.5rem;">
          <div style="background:white; border-radius:var(--radius-md); border:1px solid var(--border-color); padding:1.5rem;">
            <h3 style="font-size:1.15rem; font-weight:600; margin-bottom:0.5rem; color:var(--text-dark);">Blue UV Computer Lenses</h3>
            <p style="font-size:0.88rem; color:var(--text-muted); line-height:1.6;">
              Filters out harmful high-energy blue-violet rays emitted by computers, phones, and indoor LED lighting to reduce eye strain.
            </p>
          </div>

          <div style="background:white; border-radius:var(--radius-md); border:1px solid var(--border-color); padding:1.5rem;">
            <h3 style="font-size:1.15rem; font-weight:600; margin-bottom:0.5rem; color:var(--text-dark);">Photochromic Transitions</h3>
            <p style="font-size:0.88rem; color:var(--text-muted); line-height:1.6;">
              Smart 2-in-1 lenses that remain clear indoors and darken into sunglasses outdoors within 30 seconds of UV exposure.
            </p>
          </div>

          <div style="background:white; border-radius:var(--radius-md); border:1px solid var(--border-color); padding:1.5rem;">
            <h3 style="font-size:1.15rem; font-weight:600; margin-bottom:0.5rem; color:var(--text-dark);">Digital HD Progressives</h3>
            <p style="font-size:0.88rem; color:var(--text-muted); line-height:1.6;">
              Seamless multifocal lenses combining distance, computer, and reading vision without any visible line across the lens.
            </p>
          </div>
        </div>
      </div>
    `;
  },

  // Render Admin Password Login Screen
  renderAdminLogin() {
    return `
      <div class="container-narrow section" style="padding-top:3.5rem; padding-bottom:4.5rem; max-width:440px;">
        <div class="checkout-card" style="text-align:center; padding:2.5rem 1.75rem; box-shadow:0 8px 30px rgba(0,0,64,0.08); border-radius:16px; border:1.5px solid #eaedf1;">
          <img src="images/lenss_world_logo_with_name-removebg-preview.png" alt="LENS S WORLD" style="height:46px; object-fit:contain; margin:0 auto 1.25rem;" />
          <h2 style="font-size:1.3rem; font-weight:800; color:#000040; margin-bottom:0.35rem;">Owner Portal Login</h2>
          <p style="font-size:0.82rem; color:#64748b; margin-bottom:1.5rem;">Enter your secure master password to access store management.</p>

          <form onsubmit="window.handleAdminLogin(event)" style="display:flex; flex-direction:column; gap:0.85rem;">
            <div style="text-align:left;">
              <label style="font-size:0.76rem; font-weight:700; color:#000040; display:block; margin-bottom:0.35rem;">Password</label>
              <input type="password" id="admin-pass-input" placeholder="Enter owner password..." class="checkout-input" style="height:42px; font-size:0.9rem;" required autofocus />
            </div>
            <button type="submit" class="btn btn-navy" style="height:42px; font-weight:700; width:100%; font-size:0.88rem;">
              Unlock Control Panel →
            </button>
          </form>
          <div style="margin-top:1.25rem;">
            <a href="#home" style="font-size:0.8rem; color:#64748b; font-weight:600;">← Back to Store Front</a>
          </div>
        </div>
      </div>
    `;
  },

  // Render Admin Dashboard (Owner Portal with Auth Guard)
  renderAdminDashboard(activeTab = 'orders') {
    if (!window.isAdminAuthenticated) {
      return this.renderAdminLogin();
    }

    const totalRevenue = store.orders.reduce((sum, o) => sum + (o.total || 0), 0);

    return `
      <div class="admin-container" style="padding-top:0.75rem;">
        <!-- Admin Top Header (Super Compact 1-Line) -->
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:0.5rem; margin-bottom:0.85rem; border-bottom:1px solid #e2e8f0; padding-bottom:0.6rem;">
          <div style="display:flex; align-items:center; gap:0.5rem;">
            <img src="images/lenss_world_logo_with_name-removebg-preview.png" alt="LENS S WORLD" style="height:26px; object-fit:contain;" />
            <span style="background:#000040; color:#fff; font-size:0.65rem; font-weight:800; padding:2px 7px; border-radius:4px; letter-spacing:0.04em;">ADMIN</span>
          </div>
          <div style="display:flex; gap:0.35rem; align-items:center;">
            <a href="#home" class="btn btn-outline btn-sm" style="border-radius:6px; font-size:0.72rem; padding:0.3rem 0.65rem; border-color:#cbd5e1; color:#000040;">← Store</a>
            <button type="button" class="btn btn-navy btn-sm" onclick="window.openProductModal()" style="border-radius:6px; font-size:0.72rem; padding:0.3rem 0.65rem;">+ Product</button>
            <button type="button" class="btn btn-outline btn-sm" onclick="window.handleAdminLogout()" style="border-radius:6px; font-size:0.72rem; padding:0.3rem 0.55rem; border-color:#ef4444; color:#ef4444;" title="Logout">🚪</button>
          </div>
        </div>

        <!-- KPI Metrics Grid (Simple & Clean) -->
        <div class="admin-kpi-grid">
          <div class="admin-kpi-card" style="cursor:pointer;" onclick="window.location.hash='#admin?tab=orders'">
            <div class="kpi-icon-box" style="background:#f0fdf4; color:#16a34a;">📦</div>
            <div>
              <span class="kpi-label">Customer Orders</span>
              <h3 class="kpi-value">${store.orders.length}</h3>
            </div>
          </div>

          <div class="admin-kpi-card" style="cursor:pointer;" onclick="window.location.hash='#admin?tab=products'">
            <div class="kpi-icon-box" style="background:#eff6ff; color:#2563eb;">👓</div>
            <div>
              <span class="kpi-label">Catalog Products</span>
              <h3 class="kpi-value">${store.products.length}</h3>
            </div>
          </div>

          <div class="admin-kpi-card">
            <div class="kpi-icon-box" style="background:#faf5ff; color:#9333ea;">💰</div>
            <div>
              <span class="kpi-label">Total Revenue</span>
              <h3 class="kpi-value">${this.formatPrice(totalRevenue)}</h3>
            </div>
          </div>

          <div class="admin-kpi-card" style="cursor:pointer;" onclick="window.location.hash='#admin?tab=category_images'">
            <div class="kpi-icon-box" style="background:#fff7ed; color:#ea580c;">🖼️</div>
            <div>
              <span class="kpi-label">Category Photos</span>
              <h3 class="kpi-value">14 Models</h3>
            </div>
          </div>
        </div>

        <!-- Admin Navigation Tabs (Prioritized by Daily Usage) -->
        <div class="admin-tabs-nav">
          <button type="button" class="admin-tab-btn ${activeTab === 'orders' ? 'active' : ''}" onclick="window.location.hash='#admin?tab=orders'">
            📦 Orders & Slips (${store.orders.length})
          </button>
          <button type="button" class="admin-tab-btn ${activeTab === 'products' ? 'active' : ''}" onclick="window.location.hash='#admin?tab=products'">
            👓 Products (${store.products.length})
          </button>
          <button type="button" class="admin-tab-btn ${activeTab === 'category_images' ? 'active' : ''}" onclick="window.location.hash='#admin?tab=category_images'">
            🖼️ Category & Model Photos
          </button>
          <button type="button" class="admin-tab-btn ${activeTab === 'coupons' ? 'active' : ''}" onclick="window.location.hash='#admin?tab=coupons'">
            🎟️ Coupons (${Object.keys(store.coupons).length})
          </button>
          <button type="button" class="admin-tab-btn ${activeTab === 'lenses' ? 'active' : ''}" onclick="window.location.hash='#admin?tab=lenses'">
            💎 Lens Packages (${store.lensPackages.length})
          </button>
          <button type="button" class="admin-tab-btn ${activeTab === 'categories' ? 'active' : ''}" onclick="window.location.hash='#admin?tab=categories'">
            📁 Categories (${store.categories.length})
          </button>
          <button type="button" class="admin-tab-btn ${activeTab === 'settings' ? 'active' : ''}" onclick="window.location.hash='#admin?tab=settings'">
            ⚙️ Store Settings
          </button>
        </div>

        <!-- Tab 1: Products Catalog -->
        ${activeTab === 'products' ? `
          <div class="admin-section-box">
            <div class="admin-toolbar-row">
              <div class="admin-search-wrap">
                <input type="text" id="admin-product-search" placeholder="🔍 Search product by name, SKU or category..." class="admin-input" onkeyup="window.filterAdminProducts()" />
              </div>
              <div style="display:flex; gap:0.5rem; align-items:center;">
                <select id="admin-category-filter" class="admin-select" onchange="window.filterAdminProducts()" style="min-width:140px;">
                  <option value="all">All Categories (${store.products.length})</option>
                  ${store.categories.filter(c => c.key !== 'all').map(c => `
                    <option value="${c.key}">${c.label} (${store.products.filter(p => p.type === c.key).length})</option>
                  `).join('')}
                </select>
                <button type="button" class="btn btn-navy btn-sm" onclick="window.openProductModal()" style="height:34px; padding:0 0.85rem; white-space:nowrap;">+ Add Product</button>
              </div>
            </div>

            <div class="admin-table-responsive">
              <table class="admin-table" id="admin-products-table">
                <thead>
                  <tr>
                    <th>Product & SKU</th>
                    <th>Category</th>
                    <th>Gender</th>
                    <th>Price</th>
                    <th>MRP</th>
                    <th>Stock</th>
                    <th>Lens / Power</th>
                    <th style="text-align:right;">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  ${store.products.map(p => `
                    <tr data-name="${p.name.toLowerCase()}" data-category="${p.type}" data-sku="${(p.sku||'').toLowerCase()}">
                      <td>
                        <div class="admin-prod-cell">
                          <img src="${p.img}" alt="${p.name}" class="admin-prod-thumb" onerror="this.onerror=null; this.src='https://chashmah.com/wp-content/uploads/2026/08/1001073265_768x768.webp';" />
                          <div>
                            <strong style="color:#000040; font-size:0.84rem; display:block;">${p.name}</strong>
                            <span style="color:#64748b; font-size:0.72rem;">SKU: ${p.sku || p.id}</span>
                          </div>
                        </div>
                      </td>
                      <td data-label="Category"><span class="admin-tag-pill">${p.type}</span></td>
                      <td data-label="Gender"><span style="font-size:0.78rem; font-weight:600; text-transform:capitalize;">${p.gender || 'Unisex'}</span></td>
                      <td data-label="Price"><strong style="color:#000040; font-size:0.84rem;">${this.formatPrice(p.price)}</strong></td>
                      <td data-label="MRP"><span style="color:#94a3b8; font-size:0.75rem; text-decoration:line-through;">${p.mrp ? this.formatPrice(p.mrp) : '-'}</span></td>
                      <td data-label="Stock">
                        <label class="admin-switch" title="Toggle In-Stock">
                          <input type="checkbox" ${p.inStock !== false ? 'checked' : ''} onchange="window.toggleProductStock('${p.id}', this.checked)" />
                          <span class="admin-slider"></span>
                        </label>
                      </td>
                      <td data-label="Rx Status">
                        <span style="font-size:0.74rem; font-weight:700; color:${p.lensOptionsAvailable ? '#16a34a' : '#64748b'};">
                          ${p.lensOptionsAvailable ? '✓ Rx Ready' : 'Frame Only'}
                        </span>
                      </td>
                      <td style="text-align:right; white-space:nowrap;">
                        <button type="button" class="admin-action-btn edit" onclick="window.openProductModal('${p.id}')" title="Edit Product">✏️ Edit</button>
                        <button type="button" class="admin-action-btn delete" onclick="window.deleteProductAdmin('${p.id}')" title="Delete Product">🗑️</button>
                      </td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>
        ` : ''}

        <!-- Tab 2: Categories Management -->
        ${activeTab === 'categories' ? `
          <div class="admin-section-box">
            <div class="admin-box-header">
              <h3>📁 Store Categories & Collections</h3>
              <p>Create, manage, or delete eyewear categories on your store.</p>
            </div>

            <!-- Add Category Form -->
            <form onsubmit="window.saveCategoryForm(event)" class="admin-inline-form">
              <div style="flex:1;">
                <label class="admin-lbl">Category Name</label>
                <input type="text" id="cat-label-input" placeholder="e.g. Computer Glasses" class="admin-input" required />
              </div>
              <div style="flex:1;">
                <label class="admin-lbl">URL Slug (Key)</label>
                <input type="text" id="cat-key-input" placeholder="e.g. computer-glasses" class="admin-input" required />
              </div>
              <button type="submit" class="btn btn-navy btn-sm" style="height:34px; padding:0 1rem; align-self:flex-end;">+ Add Category</button>
            </form>

            <div class="admin-categories-grid" style="margin-top:1.25rem;">
              ${store.categories.map(c => {
                const prodCount = c.key === 'all' ? store.products.length : store.products.filter(p => p.type === c.key).length;
                return `
                  <div class="admin-item-card">
                    <div>
                      <div style="display:flex; align-items:center; gap:0.4rem; margin-bottom:0.15rem;">
                        <strong style="color:#000040; font-size:0.9rem;">${c.label}</strong>
                        <span class="admin-tag-pill" style="font-size:0.65rem;">${prodCount} Items</span>
                      </div>
                      <code style="font-size:0.72rem; color:#64748b;">Key: ${c.key}</code>
                    </div>
                    ${c.key !== 'all' ? `
                      <button type="button" class="admin-action-btn delete" onclick="window.deleteCategoryAdmin('${c.key}')" title="Delete Category">Delete</button>
                    ` : `<span style="font-size:0.72rem; color:#94a3b8; font-weight:700;">System All</span>`}
                  </div>
                `;
              }).join('')}
            </div>
          </div>
        ` : ''}

        <!-- Tab 3: Lens Packages & Prices -->
        ${activeTab === 'lenses' ? `
          <div class="admin-section-box">
            <div class="admin-box-header">
              <h3>💎 Prescription Lens Packages & Add-on Pricing</h3>
              <p>Configure Anti-Glare, Blue Cut, Photochromic Transition, and Progressive lens prices.</p>
            </div>

            <!-- Add / Edit Lens Form -->
            <form onsubmit="window.saveLensPackageForm(event)" class="admin-inline-form">
              <input type="hidden" id="lens-id-input" value="" />
              <div style="flex:1.2;">
                <label class="admin-lbl">Lens Package Name</label>
                <input type="text" id="lens-name-input" placeholder="e.g. Ultra Thin High-Index 1.67" class="admin-input" required />
              </div>
              <div style="flex:1;">
                <label class="admin-lbl">Tagline / Summary</label>
                <input type="text" id="lens-tagline-input" placeholder="e.g. Slim profile for high powers" class="admin-input" required />
              </div>
              <div style="width:130px;">
                <label class="admin-lbl">Add-on Price (₹)</label>
                <input type="number" id="lens-price-input" placeholder="1299" class="admin-input" required />
              </div>
              <div style="width:130px;">
                <label class="admin-lbl">Badge Text</label>
                <input type="text" id="lens-badge-input" placeholder="Popular" class="admin-input" />
              </div>
              <button type="submit" class="btn btn-navy btn-sm" style="height:34px; padding:0 1rem; align-self:flex-end;">Save Package</button>
            </form>

            <div class="admin-lens-grid" style="margin-top:1.25rem;">
              ${store.lensPackages.map(l => `
                <div class="admin-item-card">
                  <div>
                    <div style="display:flex; align-items:center; gap:0.4rem; margin-bottom:0.2rem;">
                      <strong style="color:#000040; font-size:0.9rem;">${l.name}</strong>
                      <span class="admin-tag-pill" style="background:#000040; color:#fff; font-size:0.7rem;">+${UI.formatPrice(l.price)}</span>
                      ${l.badge ? `<span class="admin-tag-pill">${l.badge}</span>` : ''}
                    </div>
                    <small style="color:#64748b; font-size:0.72rem; line-height:1.25; display:block;">${l.tagline}</small>
                  </div>
                  <div style="display:flex; gap:0.3rem;">
                    <button type="button" class="admin-action-btn edit" onclick="window.editLensPackageAdmin('${l.id}')">✏️ Edit</button>
                    <button type="button" class="admin-action-btn delete" onclick="window.deleteLensPackageAdmin('${l.id}')">🗑️</button>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}

        <!-- Tab 1: Orders Management & Prescription Viewer -->
        ${activeTab === 'orders' ? `
          <div class="admin-section-box">
            <div class="admin-box-header" style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:0.5rem;">
              <div>
                <h3 style="font-size:1.15rem; font-weight:800; color:#000040; margin:0 0 0.2rem 0;">📦 Customer Orders (${store.orders.length})</h3>
                <p style="color:#64748b; font-size:0.8rem; margin:0;">Track customer orders, view full delivery addresses, and chat on WhatsApp with 1-click.</p>
              </div>
              <span style="background:#ecfdf5; color:#059669; font-size:0.75rem; font-weight:800; padding:4px 10px; border-radius:20px;">
                ⚡ Live Orders
              </span>
            </div>

            <!-- Modern Clean Order Cards List -->
            <div style="display:flex; flex-direction:column; gap:1rem; margin-top:1.1rem;">
              ${store.orders.length === 0 ? `
                <div style="text-align:center; padding:3rem 1rem; color:#64748b; background:#f8fafc; border-radius:12px; border:1px dashed #cbd5e1;">
                  <div style="font-size:2rem; margin-bottom:0.5rem;">📦</div>
                  <strong style="color:#000040;">No customer orders yet</strong>
                  <p style="font-size:0.8rem; margin:0.25rem 0 0 0;">New orders placed on the website will appear here instantly.</p>
                </div>
              ` : store.orders.map(o => {
                const fullAddress = [o.customer?.address, o.customer?.city, o.customer?.pincode ? `PIN: ${o.customer.pincode}` : ''].filter(Boolean).join(', ');
                const orderDate = new Date(o.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });

                return `
                  <div class="admin-order-card" style="background:#fff; border:1.5px solid #e2e8f0; border-radius:14px; padding:1.15rem; box-shadow:0 2px 8px rgba(0,0,0,0.03);">
                    
                    <!-- Card Top Header -->
                    <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:0.5rem; border-bottom:1px solid #f1f5f9; padding-bottom:0.75rem; margin-bottom:0.85rem;">
                      <div style="display:flex; align-items:center; gap:0.65rem;">
                        <strong style="font-size:1rem; font-weight:800; color:#000040;">#${o.id}</strong>
                        <span style="font-size:0.72rem; color:#64748b;">📅 ${orderDate}</span>
                      </div>
                      <div style="display:flex; align-items:center; gap:0.5rem;">
                        <span style="background:${o.paymentMethod === 'Cash on Delivery' ? '#fef3c7' : '#ecfdf5'}; color:${o.paymentMethod === 'Cash on Delivery' ? '#b45309' : '#059669'}; font-size:0.72rem; font-weight:800; padding:3px 9px; border-radius:20px;">
                          ${o.paymentMethod === 'Cash on Delivery' ? '💵 Cash on Delivery' : '⚡ Instant UPI (Paid)'}
                        </span>
                        <strong style="font-size:1.05rem; font-weight:800; color:#000040;">${this.formatPrice(o.total || o.grandTotal || 0)}</strong>
                      </div>
                    </div>

                    <!-- Card Body Grid (2 Columns: Customer Info & Items) -->
                    <div style="display:grid; grid-template-columns:1.2fr 1fr; gap:1rem; margin-bottom:0.85rem;" class="admin-order-body-grid">
                      
                      <!-- Left: Full Customer Details & Complete Address -->
                      <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:10px; padding:0.85rem; font-size:0.8rem;">
                        <span style="font-size:0.68rem; font-weight:800; color:#64748b; text-transform:uppercase; display:block; margin-bottom:0.35rem;">Customer & Full Delivery Address:</span>
                        
                        <div style="font-size:0.92rem; font-weight:800; color:#000040; margin-bottom:0.25rem;">
                          👤 ${o.customer?.name || 'Customer'}
                        </div>
                        
                        <div style="color:#000040; font-weight:700; margin-bottom:0.2rem;">
                          📱 Phone: <a href="tel:${o.customer?.phone}" style="color:#0284c7; text-decoration:none;">${o.customer?.phone || 'N/A'}</a>
                        </div>
                        
                        ${o.customer?.email ? `
                          <div style="color:#475569; font-size:0.75rem; margin-bottom:0.35rem;">
                            ✉️ Email: <span style="color:#000040; font-weight:600;">${o.customer.email}</span>
                          </div>
                        ` : ''}
                        
                        <div style="background:#fff; border:1px solid #cbd5e1; border-radius:6px; padding:0.5rem 0.65rem; margin-top:0.4rem; color:#1e293b; font-size:0.78rem; line-height:1.35;">
                          <strong style="color:#000040; display:block; font-size:0.72rem; text-transform:uppercase; color:#64748b; margin-bottom:2px;">📍 Complete Shipping Address:</strong>
                          ${fullAddress || 'Address not provided'}
                        </div>
                      </div>

                      <!-- Right: Ordered Items & Prescription Status -->
                      <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:10px; padding:0.85rem; font-size:0.8rem; display:flex; flex-direction:column; justify-content:space-between;">
                        <div>
                          <span style="font-size:0.68rem; font-weight:800; color:#64748b; text-transform:uppercase; display:block; margin-bottom:0.35rem;">Ordered Products:</span>
                          
                          <div style="display:flex; flex-direction:column; gap:0.4rem;">
                            ${(o.items || []).map(it => `
                              <div style="padding-bottom:0.35rem; border-bottom:1px dashed #e2e8f0;">
                                <strong style="color:#000040; font-size:0.82rem;">${it.name}</strong> × <span style="font-weight:700;">${it.qty}</span>
                                ${it.selectedLens ? `<div style="color:#0284c7; font-size:0.72rem; font-weight:600;">👓 Lens: ${it.selectedLens.name}</div>` : '<div style="color:#64748b; font-size:0.7rem;">Frame Only</div>'}
                              </div>
                            `).join('')}
                          </div>
                        </div>

                        <!-- Prescription Slip Status -->
                        <div style="margin-top:0.5rem; padding-top:0.4rem; border-top:1px solid #e2e8f0;">
                          <span style="font-size:0.68rem; font-weight:800; color:#64748b; text-transform:uppercase; display:block; margin-bottom:2px;">Prescription:</span>
                          ${o.prescriptionFile ? `
                            <button type="button" class="btn btn-navy btn-sm" onclick="window.viewPrescriptionSlipModal('${o.id}')" style="height:26px; padding:0 0.65rem; font-size:0.72rem;">
                              📎 View Doctor Rx Slip
                            </button>
                          ` : (o.prescriptionDetails ? `
                            <span style="font-size:0.75rem; color:#16a34a; font-weight:700;">Manual Power Entered</span>
                          ` : `
                            <span style="font-size:0.72rem; color:#64748b;">Zero Power / Plain Demo</span>
                          `)}
                        </div>
                      </div>
                    </div>

                    <!-- Card Footer: Status Selector & 1-Click WhatsApp -->
                    <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:0.5rem; border-top:1px solid #f1f5f9; padding-top:0.65rem;">
                      <div style="display:flex; align-items:center; gap:0.5rem;">
                        <span style="font-size:0.75rem; font-weight:700; color:#475569;">Update Status:</span>
                        <select class="admin-select" onchange="window.updateOrderStatusAdmin('${o.id}', this.value)" style="height:32px; font-size:0.78rem; font-weight:700; min-width:150px; border-radius:6px;">
                          <option value="Placed" ${o.status === 'Placed' ? 'selected' : ''}>Placed</option>
                          <option value="Prescription Verified" ${o.status === 'Prescription Verified' ? 'selected' : ''}>Rx Verified</option>
                          <option value="In Lab Fitting" ${o.status === 'In Lab Fitting' ? 'selected' : ''}>In Lab Fitting</option>
                          <option value="Dispatched" ${o.status === 'Dispatched' ? 'selected' : ''}>Dispatched</option>
                          <option value="Delivered" ${o.status === 'Delivered' ? 'selected' : ''}>Delivered</option>
                          <option value="Cancelled" ${o.status === 'Cancelled' ? 'selected' : ''}>Cancelled</option>
                        </select>
                      </div>

                      <a href="https://wa.me/${o.customer?.phone?.replace(/[^0-9]/g,'') || STORE_INFO.whatsappNumber}?text=${encodeURIComponent(`Hello ${o.customer?.name || ''}! 👋 Regarding your LENS S WORLD Order #${o.id} (${this.formatPrice(o.total || 0)})...`)}" 
                         target="_blank" class="btn btn-sm" style="background:#25d366; color:#fff; font-weight:800; font-size:0.78rem; border-radius:8px; padding:0.4rem 0.9rem; display:inline-flex; align-items:center; gap:0.35rem; text-decoration:none;">
                        💬 WhatsApp Customer
                      </a>
                    </div>

                  </div>
                `;
              }).join('')}
            </div>
          </div>
        ` : ''}

        <!-- Tab 5: Coupons -->
        ${activeTab === 'coupons' ? `
          <div class="admin-section-box">
            <div class="admin-box-header">
              <h3>🎟️ Discount Coupons & Promo Codes</h3>
              <p>Create special promotional discount codes for customers to apply in cart.</p>
            </div>

            <form onsubmit="window.saveCouponForm(event)" class="admin-inline-form">
              <div style="flex:1;">
                <label class="admin-lbl">Coupon Code</label>
                <input type="text" id="coupon-code-input" placeholder="e.g. SUMMER20" class="admin-input" style="text-transform:uppercase;" required />
              </div>
              <div style="width:140px;">
                <label class="admin-lbl">Discount Type</label>
                <select id="coupon-type-input" class="admin-select">
                  <option value="percent">Percent (%)</option>
                  <option value="flat">Flat (₹)</option>
                </select>
              </div>
              <div style="width:120px;">
                <label class="admin-lbl">Discount Value</label>
                <input type="number" id="coupon-val-input" placeholder="10" class="admin-input" required />
              </div>
              <div style="width:130px;">
                <label class="admin-lbl">Min Order (₹)</label>
                <input type="number" id="coupon-min-input" placeholder="999" class="admin-input" value="499" />
              </div>
              <button type="submit" class="btn btn-navy btn-sm" style="height:34px; padding:0 1rem; align-self:flex-end;">+ Add Coupon</button>
            </form>

            <div class="admin-table-responsive" style="margin-top:1.25rem;">
              <table class="admin-table">
                <thead>
                  <tr>
                    <th>Coupon Code</th>
                    <th>Discount</th>
                    <th>Min Order</th>
                    <th>Description</th>
                    <th style="text-align:right;">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  ${Object.entries(store.coupons).map(([code, cp]) => `
                    <tr>
                      <td><strong style="color:#000040; letter-spacing:0.04em;">${code}</strong></td>
                      <td><span class="admin-tag-pill" style="background:#16a34a; color:#fff;">${cp.type === 'percent' ? `${cp.value}% OFF` : `₹${cp.value} OFF`}</span></td>
                      <td>₹${cp.minOrder || 0}</td>
                      <td><small style="color:#64748b;">${cp.description || 'Valid storewide'}</small></td>
                      <td style="text-align:right;">
                        <button type="button" class="admin-action-btn delete" onclick="window.deleteCouponAdmin('${code}')">Delete</button>
                      </td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>
        ` : ''}

        <!-- Tab 6: Store Settings -->
        ${activeTab === 'settings' ? `
          <div class="admin-section-box">
            <div class="admin-box-header">
              <h3>⚙️ Store Settings & Branding</h3>
              <p>Configure store name, WhatsApp contact number, support email, and free shipping rules.</p>
            </div>

            <form onsubmit="window.saveStoreSettingsForm(event)" class="admin-settings-grid">
              <div>
                <label class="admin-lbl">Store Brand Title</label>
                <input type="text" id="setting-name" value="${store.storeSettings.name || 'LENS S WORLD'}" class="admin-input" required />
              </div>

              <div>
                <label class="admin-lbl">Hindi / Secondary Brand Subtitle</label>
                <input type="text" id="setting-subtitle" value="${store.storeSettings.brandSubtitle || 'चश्मा & Eyewear'}" class="admin-input" />
              </div>

              <div>
                <label class="admin-lbl">WhatsApp Business Number (digits only, e.g. 918668687897)</label>
                <input type="text" id="setting-whatsapp" value="${store.storeSettings.whatsappNumber || '918668687897'}" class="admin-input" required />
              </div>

              <div>
                <label class="admin-lbl">Support Contact Email</label>
                <input type="email" id="setting-email" value="${store.storeSettings.email || 'lensworld16@gmail.com'}" class="admin-input" required />
              </div>

              <div>
                <label class="admin-lbl">Top Header Announcement Bar Text</label>
                <input type="text" id="setting-tagline" value="${store.storeSettings.subTagline || 'Buy stylish eyeglasses & sunglasses online'}" class="admin-input" />
              </div>

              <div>
                <label class="admin-lbl">Free Shipping Minimum Order Amount (₹)</label>
                <input type="number" id="setting-freeship" value="${store.storeSettings.freeShippingAbove || 499}" class="admin-input" />
              </div>

              <div style="grid-column:1/-1; display:flex; justify-content:space-between; align-items:center; border-top:1px solid #eaedf1; padding-top:1rem; margin-top:0.35rem;">
                <button type="button" class="btn btn-outline btn-sm" style="color:#ef4444; border-color:#ef4444; height:32px; padding:0 0.75rem;" onclick="if(confirm('Reset all catalog & orders to factory defaults?')){ store.resetToDefault(); window.location.reload(); }">
                  ⚠️ Reset to Default Data
                </button>
                <button type="submit" class="btn btn-navy btn-sm" style="height:34px; padding:0 1.25rem;">Save All Settings</button>
              </div>
            </form>
          </div>
        ` : ''}

        <!-- Tab 6: Category & Demographic Banner Photos -->
        ${activeTab === 'category_images' ? `
          <div class="admin-section-box">
            <div class="admin-box-header">
              <h3>🖼️ Category Story Circles & Demographic Model Photos</h3>
              <p>Change the model pictures, story circle icons, and demographic banners displayed on the store front anytime.</p>
            </div>

            <form onsubmit="window.saveCategoryImagesForm(event)" style="display:flex; flex-direction:column; gap:1.5rem; margin-top:1rem;">
              
              <!-- Section A: Top Circular Stories -->
              <div>
                <h4 style="color:#000040; font-size:0.95rem; margin-bottom:0.75rem; border-bottom:1px solid #e2e8f0; padding-bottom:0.4rem;">
                  1. Top Circular Story Icons (Header)
                </h4>
                <div class="admin-grid-3">
                  ${[
                    { id: 'story_eyeglasses', label: 'Eyeglasses Circle' },
                    { id: 'story_sunglasses', label: 'Sunglasses Circle' },
                    { id: 'story_power_specs', label: 'Power Specs Circle' },
                    { id: 'story_contact_lenses', label: 'Contact Lens Circle' },
                    { id: 'story_readers', label: 'Readers Circle' },
                    { id: 'story_lenses', label: 'Lens Circle' },
                    { id: 'story_accessories', label: 'Accessories Circle' }
                  ].map(c => `
                    <div class="admin-card-inner" style="background:#fff; border:1px solid #e2e8f0; border-radius:10px; padding:0.85rem;">
                      <label class="admin-lbl" style="font-weight:700; color:#000040; margin-bottom:0.4rem; display:block;">${c.label}</label>
                      <div style="display:flex; gap:0.75rem; align-items:center;">
                        <img id="prev_${c.id}" src="${store.getCatImg(c.id)}" style="width:52px; height:52px; border-radius:50%; object-fit:cover; border:2px solid #000040; flex-shrink:0; background:#f8fafc;" />
                        <div style="flex:1;">
                          <input type="hidden" id="catimg_${c.id}" value="${store.getCatImg(c.id)}" />
                          <label class="btn btn-outline btn-sm" style="display:inline-flex; align-items:center; gap:0.3rem; font-size:0.72rem; cursor:pointer; width:100%; justify-content:center; padding:0.35rem 0.5rem; border-color:#cbd5e1; color:#000040;">
                            📁 Pick from Gallery
                            <input type="file" accept="image/*" style="display:none;" onchange="window.handleCategoryFileUpload(event, 'catimg_${c.id}', 'prev_${c.id}')" />
                          </label>
                        </div>
                      </div>
                    </div>
                  `).join('')}
                </div>
              </div>

              <!-- Section B: Eyeglasses Demographic Model Photos -->
              <div>
                <h4 style="color:#000040; font-size:0.95rem; margin-bottom:0.75rem; border-bottom:1px solid #e2e8f0; padding-bottom:0.4rem;">
                  2. Eyeglasses Demographic Grid (Men, Women, Kids, Essentials)
                </h4>
                <div class="admin-grid-4">
                  ${[
                    { id: 'eye_men', label: '👨 Men Eyeglasses' },
                    { id: 'eye_women', label: '👩 Women Eyeglasses' },
                    { id: 'eye_kids', label: '🧒 Kids Eyeglasses' },
                    { id: 'eye_essentials', label: '⭐ Essentials Eyeglasses' }
                  ].map(c => `
                    <div class="admin-card-inner" style="background:#fff; border:1px solid #e2e8f0; border-radius:10px; padding:0.85rem; text-align:center;">
                      <label class="admin-lbl" style="font-weight:700; color:#000040; margin-bottom:0.4rem; display:block;">${c.label}</label>
                      <div style="margin-bottom:0.5rem;">
                        <img id="prev_${c.id}" src="${store.getCatImg(c.id)}" style="width:100%; height:120px; border-radius:8px; object-fit:cover; border:1px solid #cbd5e1; background:#f8fafc;" />
                      </div>
                      <input type="hidden" id="catimg_${c.id}" value="${store.getCatImg(c.id)}" />
                      <label class="btn btn-outline btn-sm" style="display:inline-flex; align-items:center; gap:0.3rem; font-size:0.75rem; cursor:pointer; width:100%; justify-content:center; padding:0.4rem 0.5rem; border-color:#cbd5e1; color:#000040;">
                        📁 Upload from Gallery
                        <input type="file" accept="image/*" style="display:none;" onchange="window.handleCategoryFileUpload(event, 'catimg_${c.id}', 'prev_${c.id}')" />
                      </label>
                    </div>
                  `).join('')}
                </div>
              </div>

              <!-- Section C: Sunglasses Demographic Model Photos -->
              <div>
                <h4 style="color:#000040; font-size:0.95rem; margin-bottom:0.75rem; border-bottom:1px solid #e2e8f0; padding-bottom:0.4rem;">
                  3. Sunglasses Demographic Grid (Men, Women, Kids, Essentials)
                </h4>
                <div class="admin-grid-4">
                  ${[
                    { id: 'sun_men', label: '🕶️ Men Sunglasses' },
                    { id: 'sun_women', label: '🕶️ Women Sunglasses' },
                    { id: 'sun_kids', label: '🧒 Kids Sunglasses' },
                    { id: 'sun_essentials', label: '⭐ Essentials Sunglasses' }
                  ].map(c => `
                    <div class="admin-card-inner" style="background:#fff; border:1px solid #e2e8f0; border-radius:10px; padding:0.85rem; text-align:center;">
                      <label class="admin-lbl" style="font-weight:700; color:#000040; margin-bottom:0.4rem; display:block;">${c.label}</label>
                      <div style="margin-bottom:0.5rem;">
                        <img id="prev_${c.id}" src="${store.getCatImg(c.id)}" style="width:100%; height:120px; border-radius:8px; object-fit:cover; border:1px solid #cbd5e1; background:#f8fafc;" />
                      </div>
                      <input type="hidden" id="catimg_${c.id}" value="${store.getCatImg(c.id)}" />
                      <label class="btn btn-outline btn-sm" style="display:inline-flex; align-items:center; gap:0.3rem; font-size:0.75rem; cursor:pointer; width:100%; justify-content:center; padding:0.4rem 0.5rem; border-color:#cbd5e1; color:#000040;">
                        📁 Upload from Gallery
                        <input type="file" accept="image/*" style="display:none;" onchange="window.handleCategoryFileUpload(event, 'catimg_${c.id}', 'prev_${c.id}')" />
                      </label>
                    </div>
                  `).join('')}
                </div>
              </div>

              <!-- Action Bar -->
              <div style="display:flex; justify-content:flex-end; gap:0.75rem; border-top:1px solid #e2e8f0; padding-top:1rem;">
                <button type="button" class="btn btn-outline btn-sm" onclick="if(confirm('Restore all default model & category images?')){ localStorage.removeItem('lsw_category_images'); window.location.reload(); }">
                  ↺ Restore Default Images
                </button>
                <button type="submit" class="btn btn-navy btn-sm" style="height:36px; padding:0 1.5rem;">
                  💾 Save All Category Photos
                </button>
              </div>
            </form>
          </div>
        ` : ''}

        <!-- Add / Edit Product Modal Container -->
        <div id="admin-product-modal" class="modal-overlay" style="display:none;">
          <div class="modal-card">
            <div class="modal-header">
              <h3 id="product-modal-title" style="font-size:1.1rem; font-weight:800; color:#000040;">Add New Product</h3>
              <button type="button" class="modal-close-btn" onclick="document.getElementById('admin-product-modal').style.display='none'">×</button>
            </div>
            <form onsubmit="window.saveProductForm(event)" class="modal-body-scroll" style="display:flex; flex-direction:column; gap:0.85rem;">
              <input type="hidden" id="p-edit-id" value="" />

              <div class="admin-grid-2">
                <div>
                  <label class="admin-lbl">Product Name *</label>
                  <input type="text" id="p-name" placeholder="e.g. LENS S WORLD Retro Aviator Gold" class="admin-input" required />
                </div>
                <div>
                  <label class="admin-lbl">SKU Code</label>
                  <input type="text" id="p-sku" placeholder="LSW-EYE-009" class="admin-input" />
                </div>
              </div>

              <div class="admin-grid-3">
                <div>
                  <label class="admin-lbl">Category *</label>
                  <select id="p-type" class="admin-select">
                    ${store.categories.filter(c => c.key !== 'all').map(c => `<option value="${c.key}">${c.label}</option>`).join('')}
                  </select>
                </div>
                <div>
                  <label class="admin-lbl">Gender</label>
                  <select id="p-gender" class="admin-select">
                    <option value="unisex">Unisex</option>
                    <option value="men">Men</option>
                    <option value="women">Women</option>
                    <option value="kids">Kids</option>
                  </select>
                </div>
                <div>
                  <label class="admin-lbl">Badge / Tag</label>
                  <input type="text" id="p-badge" placeholder="New / 40% off" class="admin-input" />
                </div>
              </div>

              <div class="admin-grid-2">
                <div>
                  <label class="admin-lbl">Selling Price (₹) *</label>
                  <input type="number" id="p-price" placeholder="1499" class="admin-input" required />
                </div>
                <div>
                  <label class="admin-lbl">MRP (Strikethrough ₹)</label>
                  <input type="number" id="p-mrp" placeholder="2499" class="admin-input" />
                </div>
              </div>

              <div>
                <label class="admin-lbl">Product Image (URL or File Upload)</label>
                <div style="display:flex; gap:0.5rem; margin-bottom:0.4rem;">
                  <input type="text" id="p-img" placeholder="https://... or upload below" class="admin-input" style="flex:1;" />
                  <input type="file" id="p-file-input" accept="image/*" style="display:none;" onchange="window.previewProductImageUpload(event)" />
                  <button type="button" class="btn btn-outline btn-sm" onclick="document.getElementById('p-file-input').click()">📁 Upload Photo</button>
                </div>
                <div id="p-img-preview-box" style="width:100%; height:120px; border:1px dashed #cbd5e1; border-radius:8px; display:flex; align-items:center; justify-content:center; overflow:hidden; background:#f8fafc;">
                  <img id="p-preview-thumb" src="" style="max-height:100%; max-width:100%; object-fit:contain; display:none;" />
                  <span id="p-preview-text" style="color:#94a3b8; font-size:0.8rem;">Image preview will appear here</span>
                </div>
              </div>

              <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap:0.5rem;">
                <label class="admin-checkbox-label">
                  <input type="checkbox" id="p-featured" checked />
                  <span>⭐ Featured</span>
                </label>
                <label class="admin-checkbox-label">
                  <input type="checkbox" id="p-is-new" checked />
                  <span>✨ New Arrival</span>
                </label>
                <label class="admin-checkbox-label">
                  <input type="checkbox" id="p-is-trending" checked />
                  <span>🔥 Trending</span>
                </label>
                <label class="admin-checkbox-label">
                  <input type="checkbox" id="p-rx-enabled" checked />
                  <span>👓 Buy with Lenses</span>
                </label>
                <label class="admin-checkbox-label">
                  <input type="checkbox" id="p-instock" checked />
                  <span>✓ In Stock</span>
                </label>
              </div>

              <div style="border-top:1px solid #eaedf1; padding-top:0.75rem;">
                <div class="admin-lbl" style="color:#000040; margin-bottom:0.4rem;">📐 Frame Dimensions & Specifications</div>
                <div class="admin-grid-dim">
                  <div>
                    <label class="admin-lbl">Lens Width (mm)</label>
                    <input type="number" id="p-lens-width" placeholder="50" class="admin-input" />
                  </div>
                  <div>
                    <label class="admin-lbl">Bridge (mm)</label>
                    <input type="number" id="p-bridge-width" placeholder="20" class="admin-input" />
                  </div>
                  <div>
                    <label class="admin-lbl">Temple (mm)</label>
                    <input type="number" id="p-temple-length" placeholder="142" class="admin-input" />
                  </div>
                  <div>
                    <label class="admin-lbl">Weight</label>
                    <input type="text" id="p-weight" placeholder="17g" class="admin-input" />
                  </div>
                  <div>
                    <label class="admin-lbl">Frame Shape</label>
                    <select id="p-shape" class="admin-select">
                      <option value="Rectangle">Rectangle</option>
                      <option value="Round">Round</option>
                      <option value="Square">Square</option>
                      <option value="Aviator">Aviator</option>
                      <option value="Cat-Eye">Cat-Eye</option>
                      <option value="Wayfarer">Wayfarer</option>
                      <option value="Geometric">Geometric / Hexagonal</option>
                      <option value="Oval">Oval</option>
                      <option value="Clubmaster">Clubmaster / Browline</option>
                      <option value="Rimless">Rimless / Semi-Rimless</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <label class="admin-lbl">Description</label>
                <textarea id="p-desc" rows="2" class="admin-input" placeholder="Premium optical frame with durable hinges..."></textarea>
              </div>

              <div style="display:flex; justify-content:flex-end; gap:0.65rem; border-top:1px solid #eaedf1; padding-top:1rem;">
                <button type="button" class="btn btn-outline" onclick="document.getElementById('admin-product-modal').style.display='none'">Cancel</button>
                <button type="submit" class="btn btn-navy">Save Product</button>
              </div>
            </form>
          </div>
        </div>

        <!-- Prescription Slip Viewer Modal -->
        <div id="admin-slip-modal" class="modal-overlay" style="display:none;">
          <div class="modal-card" style="max-width:550px; text-align:center;">
            <div class="modal-header">
              <h3 style="font-size:1.1rem; font-weight:700; color:#000040;">Customer Prescription Slip</h3>
              <button type="button" class="modal-close-btn" onclick="document.getElementById('admin-slip-modal').style.display='none'">×</button>
            </div>
            <div style="padding:1.25rem;">
              <img id="admin-slip-img" src="" style="max-width:100%; max-height:450px; object-fit:contain; border-radius:8px; border:1px solid #e2e8f0; margin-bottom:1rem;" />
              <div id="admin-slip-info" style="font-size:0.85rem; color:#475569; margin-bottom:1rem;"></div>
              <a id="admin-slip-download" href="" download="prescription-slip" class="btn btn-navy btn-sm">⬇️ Download Full Resolution</a>
            </div>
          </div>
        </div>
      </div>
    `;
  }
};
