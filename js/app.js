// LENS S WORLD - Main Application Controller
import { store } from './store.js';
import { UI } from './ui.js';
import { initRouter } from './router.js';
import { LENS_PACKAGES, PRESCRIPTION_POWER_OPTIONS } from './data.js';
import { sendOrderEmail, sendContactInquiryEmail } from './emailService.js';

// Global Event Bridge for Inline Handlers
window.pdpSelectedLens = { id: 'blue-cut', name: 'Blue Cut Digital EyeShield™', price: 999 };

window.updatePdpTotal = function(productId, lensPrice, lensName, lensId) {
  window.pdpSelectedLens = lensPrice > 0 ? { id: lensId || 'custom-lens', name: lensName, price: lensPrice } : null;
  const product = store.products.find(p => p.id === productId);
  if (!product) return;

  const finalTotalEl = document.getElementById('pdp-final-total');
  if (finalTotalEl) finalTotalEl.textContent = UI.formatPrice(product.price + lensPrice);

  const submitBtn = document.getElementById('pdp-submit-btn');
  if (submitBtn) {
    if (lensPrice > 0) {
      submitBtn.textContent = `Add to Cart (${UI.formatPrice(product.price + lensPrice)})`;
      submitBtn.onclick = () => window.AppEvents.addPdpProductWithSelectedLens(productId);
    } else {
      submitBtn.textContent = 'Add to Cart';
      submitBtn.onclick = () => window.AppEvents.addStandardProduct(productId);
    }
  }

  // Update active pill styling
  document.querySelectorAll('.pdp-lens-type-pill').forEach(pill => {
    const radio = pill.querySelector('input[type="radio"]');
    if (radio) {
      if ((radio.value === 'frame' && lensPrice === 0) || (radio.value === 'lenses' && lensPrice > 0)) {
        pill.classList.add('active');
      } else {
        pill.classList.remove('active');
      }
    }
  });
};

window.switchPdpRxMethod = function(method) {
  const uploadBox = document.getElementById('pdp-rx-upload-box');
  const whatsappBox = document.getElementById('pdp-rx-whatsapp-box');
  const manualBox = document.getElementById('pdp-rx-manual-box');
  const zeroBox = document.getElementById('pdp-rx-zero-box');

  if (uploadBox) uploadBox.style.display = method === 'upload' ? 'block' : 'none';
  if (whatsappBox) whatsappBox.style.display = method === 'whatsapp' ? 'block' : 'none';
  if (manualBox) manualBox.style.display = method === 'manual' ? 'block' : 'none';
  if (zeroBox) zeroBox.style.display = method === 'zero' ? 'block' : 'none';

  document.querySelectorAll('.pdp-rx-pill').forEach(pill => {
    const input = pill.querySelector('input');
    if (input) {
      if (input.value === method) {
        pill.classList.add('active');
        input.checked = true;
      } else {
        pill.classList.remove('active');
        input.checked = false;
      }
    }
  });
};

window.selectVisionCard = function(cardEl, productId, lensPrice, lensName, lensId) {
  document.querySelectorAll('.vision-card').forEach(c => c.classList.remove('selected'));
  cardEl.classList.add('selected');
  window.updatePdpTotal(productId, lensPrice, lensName, lensId);
};

window.scrollProductSlider = function(sliderId, direction) {
  const el = document.getElementById(sliderId);
  if (!el) return;
  const scrollAmount = el.clientWidth * 0.85;
  el.scrollBy({ left: direction * scrollAmount, behavior: 'smooth' });
};

window.rxUploadedFile = null;

window.handleRxUpload = function(event) {
  const file = event.target.files[0];
  if (!file) return;

  window.rxUploadedFile = {
    name: file.name,
    size: (file.size / 1024).toFixed(1) + ' KB',
    type: file.type
  };

  const pdpLbl = document.getElementById('pdp-rx-file-lbl');
  if (pdpLbl) pdpLbl.textContent = `✓ Uploaded: ${file.name} (${window.rxUploadedFile.size})`;

  const previewBox = document.getElementById('rx-upload-preview');
  const filenameEl = document.getElementById('rx-upload-filename');
  const thumbEl = document.getElementById('rx-upload-thumb');

  if (file.type.startsWith('image/')) {
    const reader = new FileReader();
    reader.onload = function(e) {
      window.rxUploadedFile.dataUrl = e.target.result;
      if (thumbEl) {
        thumbEl.src = e.target.result;
        thumbEl.style.display = 'block';
      }
    };
    reader.readAsDataURL(file);
  } else {
    if (thumbEl) thumbEl.style.display = 'none';
  }

  if (filenameEl) filenameEl.textContent = `${file.name} (${window.rxUploadedFile.size})`;
  if (previewBox) previewBox.style.display = 'flex';
};

window.switchRxMethod = function(method) {
  const uploadBox = document.getElementById('rx-upload-box');
  const manualBox = document.getElementById('manual-power-box');
  const whatsappBox = document.getElementById('rx-whatsapp-box');
  const zeroBox = document.getElementById('rx-zeropower-box');

  if (uploadBox) uploadBox.style.display = method === 'upload' ? 'block' : 'none';
  if (manualBox) manualBox.style.display = method === 'manual' ? 'block' : 'none';
  if (whatsappBox) whatsappBox.style.display = method === 'whatsapp' ? 'block' : 'none';
  if (zeroBox) zeroBox.style.display = method === 'zeropower' ? 'block' : 'none';

  document.querySelectorAll('.rx-method-pill').forEach(pill => {
    pill.classList.remove('selected');
    if (pill.getAttribute('data-method') === method) pill.classList.add('selected');
  });
};

window.AppEvents = {
  toggleWishlist(productId) {
    store.toggleWishlist(productId);
  },

  removeFromWishlist(productId) {
    store.toggleWishlist(productId);
  },

  addStandardProduct(productId, readingPower = null) {
    const product = store.products.find(p => p.id === productId);
    if (!product) return;
    store.addToCart(product, { readingPower });
  },

  addPdpProductWithSelectedLens(productId) {
    const product = store.products.find(p => p.id === productId);
    if (!product) return;

    const lensChoiceRadio = document.querySelector('input[name="pdp-lens-choice"]:checked');
    const isWithLens = lensChoiceRadio && lensChoiceRadio.value === 'lenses';

    const selectedLens = isWithLens ? (window.pdpSelectedLens || store.lensPackages[1]) : null;
    const rxMethodRadio = document.querySelector('input[name="pdp-rx-method"]:checked');
    const rxMethod = isWithLens ? (rxMethodRadio ? rxMethodRadio.value : 'upload') : null;

    let rxDetails = null;
    if (rxMethod === 'manual') {
      rxDetails = {
        odSphere: document.getElementById('pdp-od-sph')?.value || '0.00',
        odCyl: document.getElementById('pdp-od-cyl')?.value || '0.00',
        osSphere: document.getElementById('pdp-os-sph')?.value || '0.00',
        osCyl: document.getElementById('pdp-os-cyl')?.value || '0.00'
      };
    }

    store.addToCart(product, {
      selectedLens,
      prescriptionMethod: rxMethod,
      prescriptionFile: window.rxUploadedFile,
      prescriptionDetails: rxDetails
    });
  },

  addFrameOnly(productId) {
    const product = store.products.find(p => p.id === productId);
    if (!product) return;
    store.addToCart(product, { selectedLens: null });
  },

  openLensCustomizer(productId) {
    const product = store.products.find(p => p.id === productId);
    if (!product) return;

    window.rxUploadedFile = null;
    const modal = document.getElementById('lens-customizer-modal');
    const container = document.getElementById('lens-customizer-body');
    if (!modal || !container) return;

    let selectedPackage = LENS_PACKAGES[1] || LENS_PACKAGES[0];

    container.innerHTML = `
      <div style="margin-bottom:0.75rem;">
        <div style="display:flex; justify-content:space-between; align-items:flex-start;">
          <div>
            <h4 style="font-size:1.05rem; font-weight:800; color:#000040;">${product.name}</h4>
            <span style="font-size:0.78rem; color:#64748b;">Frame: <strong>${UI.formatPrice(product.price)}</strong></span>
          </div>
          <span style="background:#000040; color:white; font-size:0.7rem; font-weight:700; padding:3px 8px; border-radius:4px;">Prescription Ready</span>
        </div>
      </div>

      <!-- Step 1: Lens Packages -->
      <div style="margin-bottom:1rem;">
        <div style="font-size:0.8rem; font-weight:800; color:#000040; text-transform:uppercase; letter-spacing:0.04em; margin-bottom:0.45rem;">
          Step 1: Select Lens Package
        </div>
        <div style="display:flex; flex-direction:column; gap:0.45rem;">
          ${LENS_PACKAGES.map((lens) => `
            <div class="lens-option-card ${lens.id === selectedPackage.id ? 'selected' : ''}" 
                 style="border:1.5px solid ${lens.id === selectedPackage.id ? '#000040' : '#e2e8f0'}; border-radius:8px; padding:0.6rem 0.85rem; display:flex; justify-content:space-between; align-items:center; cursor:pointer; background:${lens.id === selectedPackage.id ? '#f8fafc' : '#fff'}; transition:all 0.2s ease;"
                 onclick="window.AppEvents.selectLensOption(this, '${lens.id}', ${product.price}, ${lens.price})">
              <div>
                <div style="display:flex; align-items:center; gap:0.45rem;">
                  <input type="radio" name="modal-lens" value="${lens.id}" ${lens.id === selectedPackage.id ? 'checked' : ''} />
                  <strong style="font-size:0.88rem; color:#000040;">${lens.name}</strong>
                </div>
                <p style="font-size:0.74rem; color:#64748b; margin-top:0.15rem; margin-left:1.35rem;">${lens.tagline}</p>
              </div>
              <span style="font-size:0.92rem; font-weight:800; color:#000040; white-space:nowrap;">+${UI.formatPrice(lens.price)}</span>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Step 2: Prescription Choice (Upload / WhatsApp / Manual / Zero Power) -->
      <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:8px; padding:0.85rem; margin-bottom:1rem;">
        <div style="font-size:0.8rem; font-weight:800; color:#000040; text-transform:uppercase; letter-spacing:0.04em; margin-bottom:0.6rem;">
          Step 2: Choose Prescription Method
        </div>
        
        <!-- 4 Clear Selectable Prescription Options -->
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:0.45rem; margin-bottom:0.75rem;">
          <!-- 1. Upload Option -->
          <label class="rx-method-pill selected" data-method="upload" 
                 style="border:1.5px solid #000040; background:#ffffff; border-radius:6px; padding:0.5rem; display:flex; align-items:center; gap:0.4rem; cursor:pointer;" 
                 onclick="window.switchRxMethod('upload')">
            <input type="radio" name="rx-method" value="upload" checked />
            <span style="font-size:0.76rem; font-weight:700; color:#000040;">📤 Upload Slip</span>
          </label>

          <!-- 2. WhatsApp Option -->
          <label class="rx-method-pill" data-method="whatsapp" 
                 style="border:1.5px solid #e2e8f0; background:#ffffff; border-radius:6px; padding:0.5rem; display:flex; align-items:center; gap:0.4rem; cursor:pointer;" 
                 onclick="window.switchRxMethod('whatsapp')">
            <input type="radio" name="rx-method" value="whatsapp" />
            <span style="font-size:0.76rem; font-weight:700; color:#000040;">📲 WhatsApp</span>
          </label>

          <!-- 3. Manual Eye Power -->
          <label class="rx-method-pill" data-method="manual" 
                 style="border:1.5px solid #e2e8f0; background:#ffffff; border-radius:6px; padding:0.5rem; display:flex; align-items:center; gap:0.4rem; cursor:pointer;" 
                 onclick="window.switchRxMethod('manual')">
            <input type="radio" name="rx-method" value="manual" />
            <span style="font-size:0.76rem; font-weight:700; color:#000040;">✍️ Enter Power</span>
          </label>

          <!-- 4. Zero Power -->
          <label class="rx-method-pill" data-method="zeropower" 
                 style="border:1.5px solid #e2e8f0; background:#ffffff; border-radius:6px; padding:0.5rem; display:flex; align-items:center; gap:0.4rem; cursor:pointer;" 
                 onclick="window.switchRxMethod('zeropower')">
            <input type="radio" name="rx-method" value="zeropower" />
            <span style="font-size:0.76rem; font-weight:700; color:#000040;">👓 Zero Power</span>
          </label>
        </div>

        <!-- Option 1 Details: Upload Slip Box -->
        <div id="rx-upload-box" style="background:#ffffff; border:1px dashed #000040; border-radius:6px; padding:0.75rem; text-align:center;">
          <input type="file" id="rx-file-input" accept="image/*,application/pdf" style="display:none;" onchange="window.handleRxUpload(event)" />
          <button type="button" class="btn btn-outline btn-sm" onclick="document.getElementById('rx-file-input').click()" 
                  style="width:100%; font-weight:700; border-color:#000040; color:#000040;">
            📷 Take Photo / Choose File (Gallery/PDF)
          </button>
          <div style="font-size:0.7rem; color:#64748b; margin-top:0.35rem;">Supports JPG, PNG, PDF (Up to 10MB)</div>

          <!-- Uploaded Preview -->
          <div id="rx-upload-preview" style="display:none; align-items:center; gap:0.6rem; background:#f0fdf4; border:1px solid #86efac; border-radius:6px; padding:0.45rem 0.65rem; margin-top:0.6rem; text-align:left;">
            <img id="rx-upload-thumb" src="" alt="Rx Preview" style="width:40px; height:40px; object-fit:cover; border-radius:4px; display:none;" />
            <div style="flex:1; overflow:hidden;">
              <div style="font-size:0.74rem; font-weight:700; color:#166534;">✅ Prescription Attached</div>
              <div id="rx-upload-filename" style="font-size:0.68rem; color:#15803d; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;"></div>
            </div>
            <button type="button" onclick="document.getElementById('rx-file-input').click()" style="font-size:0.7rem; font-weight:700; color:#166534; text-decoration:underline;">Change</button>
          </div>
        </div>

        <!-- Option 2 Details: WhatsApp Box -->
        <div id="rx-whatsapp-box" style="display:none; background:#ffffff; border:1px solid #cbd5e1; border-radius:6px; padding:0.65rem; font-size:0.76rem; color:#334155;">
          <div style="font-weight:700; color:#000040; margin-bottom:0.2rem;">📲 Easiest Option</div>
          Place order now. You can WhatsApp your doctor's slip photo directly to <strong>+91 86686 87897</strong> with your Order ID.
        </div>

        <!-- Option 3 Details: Manual Eye Power Box -->
        <div id="manual-power-box" style="display:none; background:#ffffff; border:1px solid #cbd5e1; border-radius:6px; padding:0.65rem;">
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:0.5rem;">
            <!-- Right Eye -->
            <div style="background:#f1f5f9; padding:0.45rem; border-radius:6px;">
              <strong style="font-size:0.72rem; color:#000040; display:block; margin-bottom:0.25rem;">Right Eye (OD / दायां)</strong>
              <div style="display:grid; grid-template-columns:1fr 1fr; gap:0.25rem;">
                <div>
                  <label style="font-size:0.62rem; color:#64748b; display:block;">SPH</label>
                  <select id="rx-r-sph" style="width:100%; font-size:0.7rem; padding:0.2rem; border-radius:4px; border:1px solid #cbd5e1;">
                    ${PRESCRIPTION_POWER_OPTIONS.spheres.map(s => `<option value="${s}" ${s === '0.00 (Plano)' ? 'selected' : ''}>${s}</option>`).join('')}
                  </select>
                </div>
                <div>
                  <label style="font-size:0.62rem; color:#64748b; display:block;">CYL</label>
                  <select id="rx-r-cyl" style="width:100%; font-size:0.7rem; padding:0.2rem; border-radius:4px; border:1px solid #cbd5e1;">
                    ${PRESCRIPTION_POWER_OPTIONS.cylinders.map(c => `<option value="${c}">${c}</option>`).join('')}
                  </select>
                </div>
              </div>
            </div>

            <!-- Left Eye -->
            <div style="background:#f1f5f9; padding:0.45rem; border-radius:6px;">
              <strong style="font-size:0.72rem; color:#000040; display:block; margin-bottom:0.25rem;">Left Eye (OS / बायां)</strong>
              <div style="display:grid; grid-template-columns:1fr 1fr; gap:0.25rem;">
                <div>
                  <label style="font-size:0.62rem; color:#64748b; display:block;">SPH</label>
                  <select id="rx-l-sph" style="width:100%; font-size:0.7rem; padding:0.2rem; border-radius:4px; border:1px solid #cbd5e1;">
                    ${PRESCRIPTION_POWER_OPTIONS.spheres.map(s => `<option value="${s}" ${s === '0.00 (Plano)' ? 'selected' : ''}>${s}</option>`).join('')}
                  </select>
                </div>
                <div>
                  <label style="font-size:0.62rem; color:#64748b; display:block;">CYL</label>
                  <select id="rx-l-cyl" style="width:100%; font-size:0.7rem; padding:0.2rem; border-radius:4px; border:1px solid #cbd5e1;">
                    ${PRESCRIPTION_POWER_OPTIONS.cylinders.map(c => `<option value="${c}">${c}</option>`).join('')}
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Option 4 Details: Zero Power Box -->
        <div id="rx-zeropower-box" style="display:none; background:#ffffff; border:1px solid #cbd5e1; border-radius:6px; padding:0.65rem; font-size:0.76rem; color:#334155;">
          <div style="font-weight:700; color:#000040; margin-bottom:0.2rem;">👓 Zero Power Protection</div>
          No prescription needed. Your lenses will include Blue Cut and Anti-Glare coating for computer/screen protection.
        </div>
      </div>

      <!-- Live Total & Add to Cart -->
      <button type="button" id="modal-add-cart-btn" class="btn btn-navy" style="width:100%; padding:0.75rem; font-size:0.92rem; font-weight:700; border-radius:var(--radius-pill);" 
              onclick="window.AppEvents.confirmLensSelection('${product.id}')">
        Add to Cart with Lens — ${UI.formatPrice(product.price + selectedPackage.price)}
      </button>
    `;

    modal.classList.add('open');
  },

  selectLensOption(cardEl, lensId, framePrice, lensPrice) {
    document.querySelectorAll('.lens-option-card').forEach(c => {
      c.style.borderColor = '#e2e8f0';
      c.style.background = '#ffffff';
    });
    cardEl.style.borderColor = '#000040';
    cardEl.style.background = '#f8fafc';

    const radio = cardEl.querySelector('input[type="radio"]');
    if (radio) radio.checked = true;

    const btn = document.getElementById('modal-add-cart-btn');
    if (btn) {
      btn.textContent = `Add to Cart with Lens — ${UI.formatPrice(framePrice + lensPrice)}`;
    }
  },

  confirmLensSelection(productId) {
    const product = store.products.find(p => p.id === productId);
    if (!product) return;

    const selectedRadio = document.querySelector('input[name="modal-lens"]:checked');
    const lensId = selectedRadio ? selectedRadio.value : LENS_PACKAGES[1].id;
    const selectedLens = LENS_PACKAGES.find(l => l.id === lensId);

    const rxMethod = document.querySelector('input[name="rx-method"]:checked')?.value || 'upload';

    let prescriptionData = null;
    let prescriptionFile = null;

    if (rxMethod === 'upload' && window.rxUploadedFile) {
      prescriptionFile = window.rxUploadedFile;
    } else if (rxMethod === 'manual') {
      prescriptionData = {
        right: {
          sph: document.getElementById('rx-r-sph')?.value || '0.00',
          cyl: document.getElementById('rx-r-cyl')?.value || '0.00'
        },
        left: {
          sph: document.getElementById('rx-l-sph')?.value || '0.00',
          cyl: document.getElementById('rx-l-cyl')?.value || '0.00'
        }
      };
    }

    store.addToCart(product, {
      selectedLens,
      prescriptionMethod: rxMethod,
      prescriptionData,
      prescriptionFile
    });

    document.getElementById('lens-customizer-modal')?.classList.remove('open');
    UI.openCartDrawer();
  },

  handlePdpAddToCart(productId) {
    const product = store.products.find(p => p.id === productId);
    if (!product) return;

    const lensChoice = document.querySelector('input[name="pdp-lens-choice"]:checked')?.value || 'frame';
    const selectedLens = (lensChoice === 'lenses' && window.pdpSelectedLens && window.pdpSelectedLens.price > 0)
      ? { name: window.pdpSelectedLens.name, price: window.pdpSelectedLens.price }
      : null;

    store.addToCart(product, {
      selectedLens,
      prescriptionMethod: selectedLens ? 'whatsapp' : null
    });

    UI.openCartDrawer();
  },

  handleCheckoutSubmit(event) {
    event.preventDefault();

    const name = document.getElementById('cust-name')?.value || 'Customer';
    const phone = document.getElementById('cust-phone')?.value || '';
    const email = document.getElementById('cust-email')?.value || '';
    const address = document.getElementById('cust-address')?.value || '';
    const city = document.getElementById('cust-city')?.value || '';
    const pincode = document.getElementById('cust-pincode')?.value || '';
    const paymentMode = document.querySelector('input[name="payment-mode"]:checked')?.value || 'UPI';

    const newOrder = store.placeOrder({
      customer: { name, phone, email, address, city, pincode },
      paymentMethod: paymentMode
    });

    // Asynchronously send live email notification via EmailJS
    sendOrderEmail(newOrder).then(sent => {
      if (sent) console.log("✓ Live EmailJS Order confirmation sent!");
    }).catch(e => console.warn("Email notification error", e));

    window.location.hash = `#order-success?id=${newOrder.id}`;
  }
};

// Application Bootstrapper
document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize State Listeners
  store.subscribe((event) => {
    UI.updateNavBadges();
    if (event === 'cart_updated') {
      UI.renderCartDrawer();
      const hash = window.location.hash || '';
      if (hash.startsWith('#cart')) {
        const mainApp = document.getElementById('app-main');
        if (mainApp) mainApp.innerHTML = UI.renderCartPage();
      } else if (hash.startsWith('#checkout')) {
        const mainApp = document.getElementById('app-main');
        if (mainApp) mainApp.innerHTML = UI.renderCheckoutPage();
      }
    } else if (event === 'wishlist_updated') {
      const hash = window.location.hash || '';
      if (hash.startsWith('#wishlist')) {
        const mainApp = document.getElementById('app-main');
        if (mainApp) mainApp.innerHTML = UI.renderWishlistPage();
      }
    }
  });

  // 2. Setup Cart Drawer Listeners
  document.getElementById('cart-drawer-toggle')?.addEventListener('click', () => {
    UI.renderCartDrawer();
    store.openCartDrawer();
  });

  document.getElementById('cart-drawer-close')?.addEventListener('click', () => {
    store.closeCartDrawer();
  });

  document.getElementById('cart-overlay')?.addEventListener('click', () => {
    store.closeCartDrawer();
  });

  // 3. Setup Mobile Nav Drawer
  const mobileToggle = document.getElementById('mobile-menu-toggle');
  const mobileDrawer = document.getElementById('mobile-nav-drawer');
  const mobileOverlay = document.getElementById('mobile-nav-overlay');
  const mobileClose = document.getElementById('mobile-nav-close');

  const openMobileNav = () => {
    mobileDrawer?.classList.add('open');
    mobileOverlay?.classList.add('open');
  };

  const closeMobileNav = () => {
    mobileDrawer?.classList.remove('open');
    mobileOverlay?.classList.remove('open');
  };

  mobileToggle?.addEventListener('click', openMobileNav);
  mobileClose?.addEventListener('click', closeMobileNav);
  mobileOverlay?.addEventListener('click', closeMobileNav);

  // Close mobile nav on clicking any nav link
  document.querySelectorAll('.mobile-nav-drawer a').forEach(a => {
    a.addEventListener('click', closeMobileNav);
  });

  // 4. Modal Close Handlers
  document.querySelectorAll('.modal-close-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('open'));
    });
  });

  // 5. Initialize SPA Hash Router
  initRouter();
});

// ==========================================================================
// Admin Portal Handlers (Owner Management)
// ==========================================================================
window.filterAdminProducts = function() {
  const query = (document.getElementById('admin-product-search')?.value || '').toLowerCase();
  const cat = document.getElementById('admin-category-filter')?.value || 'all';

  document.querySelectorAll('#admin-products-table tbody tr').forEach(row => {
    const name = row.getAttribute('data-name') || '';
    const category = row.getAttribute('data-category') || '';
    const sku = row.getAttribute('data-sku') || '';

    const matchesQuery = name.includes(query) || sku.includes(query);
    const matchesCat = (cat === 'all' || category === cat);

    if (matchesQuery && matchesCat) {
      row.style.display = '';
    } else {
      row.style.display = 'none';
    }
  });
};

window.openProductModal = function(productId = null) {
  const modal = document.getElementById('admin-product-modal');
  if (!modal) return;

  const titleEl = document.getElementById('product-modal-title');
  const editIdEl = document.getElementById('p-edit-id');
  const nameEl = document.getElementById('p-name');
  const skuEl = document.getElementById('p-sku');
  const typeEl = document.getElementById('p-type');
  const genderEl = document.getElementById('p-gender');
  const badgeEl = document.getElementById('p-badge');
  const priceEl = document.getElementById('p-price');
  const mrpEl = document.getElementById('p-mrp');
  const imgEl = document.getElementById('p-img');
  const featuredEl = document.getElementById('p-featured');
  const isNewEl = document.getElementById('p-is-new');
  const isTrendingEl = document.getElementById('p-is-trending');
  const rxEnabledEl = document.getElementById('p-rx-enabled');
  const inStockEl = document.getElementById('p-instock');
  const lensWidthEl = document.getElementById('p-lens-width');
  const bridgeWidthEl = document.getElementById('p-bridge-width');
  const templeLengthEl = document.getElementById('p-temple-length');
  const shapeEl = document.getElementById('p-shape');
  const weightEl = document.getElementById('p-weight');
  const descEl = document.getElementById('p-desc');
  const previewImg = document.getElementById('p-preview-thumb');
  const previewText = document.getElementById('p-preview-text');

  if (productId) {
    const product = store.products.find(p => p.id === productId);
    if (!product) return;
    titleEl.textContent = 'Edit Product — ' + product.name;
    editIdEl.value = product.id;
    nameEl.value = product.name || '';
    skuEl.value = product.sku || '';
    typeEl.value = product.type || 'eyeglasses';
    genderEl.value = product.gender || 'unisex';
    badgeEl.value = product.badge || (product.isNew ? 'New' : (product.isTrending ? 'Trending' : ''));
    priceEl.value = product.price || '';
    mrpEl.value = product.mrp || '';
    imgEl.value = product.img || '';
    if (featuredEl) featuredEl.checked = product.featured !== false;
    if (isNewEl) isNewEl.checked = product.isNew === true || (product.badge || '').toLowerCase().includes('new');
    if (isTrendingEl) isTrendingEl.checked = product.isTrending === true || product.trending === true || (product.badge || '').toLowerCase().includes('trend');
    rxEnabledEl.checked = product.lensOptionsAvailable !== false;
    inStockEl.checked = product.inStock !== false;

    // Parse Dimensions
    const sizeParts = (product.size || '50-20-142').toString().split(/[^0-9]+/).filter(Boolean);
    if (lensWidthEl) lensWidthEl.value = sizeParts[0] || '50';
    if (bridgeWidthEl) bridgeWidthEl.value = sizeParts[1] || '20';
    if (templeLengthEl) templeLengthEl.value = sizeParts[2] || '142';
    shapeEl.value = product.shape || 'Rectangle';
    weightEl.value = product.weight || '17g';
    descEl.value = product.description || '';

    if (product.img) {
      previewImg.src = product.img;
      previewImg.style.display = 'block';
      previewText.style.display = 'none';
    }
  } else {
    titleEl.textContent = 'Add New Product';
    editIdEl.value = '';
    nameEl.value = '';
    skuEl.value = `LSW-${Math.floor(100 + Math.random() * 900)}`;
    typeEl.value = 'eyeglasses';
    genderEl.value = 'unisex';
    badgeEl.value = 'New';
    priceEl.value = '';
    mrpEl.value = '';
    imgEl.value = '';
    if (featuredEl) featuredEl.checked = true;
    if (isNewEl) isNewEl.checked = true;
    if (isTrendingEl) isTrendingEl.checked = false;
    rxEnabledEl.checked = true;
    inStockEl.checked = true;
    if (lensWidthEl) lensWidthEl.value = '50';
    if (bridgeWidthEl) bridgeWidthEl.value = '20';
    if (templeLengthEl) templeLengthEl.value = '142';
    shapeEl.value = 'Rectangle';
    weightEl.value = '17g';
    descEl.value = 'High-definition optical frame with certified lenses.';
    previewImg.style.display = 'none';
    previewText.style.display = 'block';
  }

  modal.style.display = 'flex';
};

window.previewProductImageUpload = function(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    const dataUrl = e.target.result;
    document.getElementById('p-img').value = dataUrl;
    const previewImg = document.getElementById('p-preview-thumb');
    const previewText = document.getElementById('p-preview-text');
    previewImg.src = dataUrl;
    previewImg.style.display = 'block';
    previewText.style.display = 'none';
  };
  reader.readAsDataURL(file);
};

window.saveProductForm = function(event) {
  event.preventDefault();

  const editId = document.getElementById('p-edit-id').value;
  const name = document.getElementById('p-name').value.trim();
  const sku = document.getElementById('p-sku').value.trim();
  const type = document.getElementById('p-type').value;
  const gender = document.getElementById('p-gender').value;
  const badge = document.getElementById('p-badge').value.trim();
  const price = parseFloat(document.getElementById('p-price').value);
  const mrp = parseFloat(document.getElementById('p-mrp').value) || (price * 1.5);
  const img = document.getElementById('p-img').value.trim() || 'https://chashmah.com/wp-content/uploads/2026/08/1001073265_768x768.webp';
  const featured = document.getElementById('p-featured')?.checked !== false;
  const isNew = document.getElementById('p-is-new')?.checked === true;
  const isTrending = document.getElementById('p-is-trending')?.checked === true;
  const lensOptionsAvailable = document.getElementById('p-rx-enabled').checked;
  const inStock = document.getElementById('p-instock').checked;
  
  const lensWidth = document.getElementById('p-lens-width')?.value.trim() || '50';
  const bridgeWidth = document.getElementById('p-bridge-width')?.value.trim() || '20';
  const templeLength = document.getElementById('p-temple-length')?.value.trim() || '142';
  const size = `${lensWidth}-${bridgeWidth}-${templeLength}`;
  
  const shape = document.getElementById('p-shape').value.trim() || 'Rectangle';
  const weight = document.getElementById('p-weight').value.trim() || '17g';
  const description = document.getElementById('p-desc').value.trim();

  const productData = {
    name,
    sku,
    type,
    gender,
    badge: badge || (isNew ? 'New' : (isTrending ? 'Trending' : '')),
    featured,
    isNew,
    isTrending,
    trending: isTrending,
    price,
    mrp,
    img,
    gallery: [img],
    lensOptionsAvailable,
    inStock,
    size,
    shape,
    weight,
    description,
    features: ["Ultra-Durable Frame", "Prescription Ready", "Premium Quality Finish"]
  };

  if (editId) {
    store.updateProduct(editId, productData);
  } else {
    store.addProduct(productData);
  }

  document.getElementById('admin-product-modal').style.display = 'none';
  const mainApp = document.getElementById('app-main');
  if (mainApp) mainApp.innerHTML = UI.renderAdminDashboard('products');
};

window.deleteProductAdmin = function(productId) {
  if (confirm('Are you sure you want to delete this product?')) {
    store.deleteProduct(productId);
    const mainApp = document.getElementById('app-main');
    if (mainApp) mainApp.innerHTML = UI.renderAdminDashboard('products');
  }
};

window.toggleProductStock = function(productId, inStock) {
  store.updateProduct(productId, { inStock });
};

// Categories Handlers
window.saveCategoryForm = function(event) {
  event.preventDefault();
  const label = document.getElementById('cat-label-input').value.trim();
  const key = document.getElementById('cat-key-input').value.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-');

  if (store.addCategory({ key, label })) {
    const mainApp = document.getElementById('app-main');
    if (mainApp) mainApp.innerHTML = UI.renderAdminDashboard('categories');
  }
};

window.deleteCategoryAdmin = function(key) {
  if (confirm(`Are you sure you want to delete category "${key}"?`)) {
    store.deleteCategory(key);
    const mainApp = document.getElementById('app-main');
    if (mainApp) mainApp.innerHTML = UI.renderAdminDashboard('categories');
  }
};

// Lens Packages Handlers
window.editLensPackageAdmin = function(lensId) {
  const pkg = store.lensPackages.find(l => l.id === lensId);
  if (!pkg) return;
  document.getElementById('lens-id-input').value = pkg.id;
  document.getElementById('lens-name-input').value = pkg.name;
  document.getElementById('lens-tagline-input').value = pkg.tagline;
  document.getElementById('lens-price-input').value = pkg.price;
  document.getElementById('lens-badge-input').value = pkg.badge || '';
  window.scrollTo({ top: 300, behavior: 'smooth' });
};

window.saveLensPackageForm = function(event) {
  event.preventDefault();
  const id = document.getElementById('lens-id-input').value;
  const name = document.getElementById('lens-name-input').value.trim();
  const tagline = document.getElementById('lens-tagline-input').value.trim();
  const price = parseFloat(document.getElementById('lens-price-input').value);
  const badge = document.getElementById('lens-badge-input').value.trim();

  const pkgData = { name, tagline, price, badge, mrp: Math.round(price * 1.8) };

  if (id) {
    store.updateLensPackage(id, pkgData);
  } else {
    store.addLensPackage(pkgData);
  }

  const mainApp = document.getElementById('app-main');
  if (mainApp) mainApp.innerHTML = UI.renderAdminDashboard('lenses');
};

window.deleteLensPackageAdmin = function(lensId) {
  if (confirm('Delete this lens package?')) {
    store.deleteLensPackage(lensId);
    const mainApp = document.getElementById('app-main');
    if (mainApp) mainApp.innerHTML = UI.renderAdminDashboard('lenses');
  }
};

// Coupons Handlers
window.saveCouponForm = function(event) {
  event.preventDefault();
  const code = document.getElementById('coupon-code-input').value.trim().toUpperCase();
  const type = document.getElementById('coupon-type-input').value;
  const value = parseFloat(document.getElementById('coupon-val-input').value);
  const minOrder = parseFloat(document.getElementById('coupon-min-input').value) || 0;

  store.addCoupon(code, {
    code,
    type,
    value,
    minOrder,
    description: `${value}${type === 'percent' ? '% off' : ' Flat off'} on orders above ₹${minOrder}`
  });

  const mainApp = document.getElementById('app-main');
  if (mainApp) mainApp.innerHTML = UI.renderAdminDashboard('coupons');
};

window.deleteCouponAdmin = function(code) {
  if (confirm(`Remove coupon code "${code}"?`)) {
    store.deleteCoupon(code);
    const mainApp = document.getElementById('app-main');
    if (mainApp) mainApp.innerHTML = UI.renderAdminDashboard('coupons');
  }
};

// Orders Handlers
window.updateOrderStatusAdmin = function(orderId, newStatus) {
  store.updateOrderStatus(orderId, newStatus);
};

window.viewPrescriptionSlipModal = function(orderId) {
  const order = store.orders.find(o => o.id === orderId);
  if (!order || !order.prescriptionFile) {
    store.showToast('No uploaded prescription image found for this order.', 'info');
    return;
  }

  const modal = document.getElementById('admin-slip-modal');
  const imgEl = document.getElementById('admin-slip-img');
  const infoEl = document.getElementById('admin-slip-info');
  const dlEl = document.getElementById('admin-slip-download');

  const file = order.prescriptionFile;
  const src = file.dataUrl || file.url || '';

  imgEl.src = src;
  infoEl.innerHTML = `<strong>Order:</strong> ${order.id} | <strong>File:</strong> ${file.name || 'prescription'} (${file.size || ''})`;
  dlEl.href = src;
  dlEl.download = `Prescription-${order.id}-${file.name || 'slip.png'}`;

  modal.style.display = 'flex';
};

// Settings Handlers
window.saveStoreSettingsForm = function(event) {
  event.preventDefault();
  const name = document.getElementById('setting-name').value.trim();
  const brandSubtitle = document.getElementById('setting-subtitle').value.trim();
  const whatsappNumber = document.getElementById('setting-whatsapp').value.trim().replace(/[^0-9]/g, '');
  const email = document.getElementById('setting-email').value.trim();
  const subTagline = document.getElementById('setting-tagline').value.trim();
  const freeShippingAbove = parseFloat(document.getElementById('setting-freeship').value) || 499;

  store.updateStoreSettings({
    name,
    brandSubtitle,
    whatsappNumber,
    phone: `+${whatsappNumber}`,
    email,
    subTagline,
    freeShippingAbove
  });

  const mainApp = document.getElementById('app-main');
  if (mainApp) mainApp.innerHTML = UI.renderAdminDashboard('settings');
};

// Save Category & Demographic Banner Photos Handler
window.saveCategoryImagesForm = function(event) {
  event.preventDefault();

  const getVal = (id, fallback = '') => {
    const el = document.getElementById(id);
    return el ? el.value.trim() : fallback;
  };

  const updatedImages = {
    // Circles
    story_new_arrival: getVal('catimg_story_new_arrival'),
    story_eyeglasses: getVal('catimg_story_eyeglasses'),
    story_sunglasses: getVal('catimg_story_sunglasses'),
    story_power_specs: getVal('catimg_story_power_specs'),
    story_readers: getVal('catimg_story_readers'),
    story_accessories: getVal('catimg_story_accessories'),

    // Eyeglasses
    eye_men: getVal('catimg_eye_men'),
    eye_women: getVal('catimg_eye_women'),
    eye_kids: getVal('catimg_eye_kids'),
    eye_essentials: getVal('catimg_eye_essentials'),

    // Sunglasses
    sun_men: getVal('catimg_sun_men'),
    sun_women: getVal('catimg_sun_women'),
    sun_kids: getVal('catimg_sun_kids'),
    sun_essentials: getVal('catimg_sun_essentials')
  };

  store.saveCategoryImages(updatedImages);
  store.showToast('✓ Category & Model Photos Saved Successfully!', 'success');

  const mainApp = document.getElementById('app-main');
  if (mainApp) mainApp.innerHTML = UI.renderAdminDashboard('category_images');
};

// Direct Gallery / File Upload for Category & Demographic Photos
window.handleCategoryFileUpload = function(event, inputId, previewImgId) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    const dataUrl = e.target.result;
    const inputEl = document.getElementById(inputId);
    const prevEl = document.getElementById(previewImgId);
    if (inputEl) inputEl.value = dataUrl;
    if (prevEl) prevEl.src = dataUrl;
    store.showToast('✓ Photo loaded from device! Click "Save" below to apply.', 'info');
  };
  reader.readAsDataURL(file);
};

// Global showToast helper
window.showToast = function(message, type = 'success') {
  if (store && typeof store.showToast === 'function') {
    store.showToast(message, type);
  }
};

// Admin Password Protection Handlers
window.isAdminAuthenticated = false;

window.handleAdminLogin = function(event) {
  if (event) event.preventDefault();
  const input = document.getElementById('admin-pass-input');
  const pass = input ? input.value.trim() : '';

  if (pass === 'Aajkalparso@3' || pass === 'adminworld.' || pass === 'Aajkalparso') {
    window.isAdminAuthenticated = true;
    store.showToast('✓ Welcome to LENS S WORLD Owner Portal!', 'success');
    
    // Extract tab from URL if present
    const hash = window.location.hash || '';
    let tab = 'orders';
    if (hash.includes('tab=')) {
      tab = hash.split('tab=')[1] || 'orders';
    }
    
    const mainApp = document.getElementById('app-main');
    if (mainApp) mainApp.innerHTML = UI.renderAdminDashboard(tab);
  } else {
    store.showToast('❌ Incorrect Password! Access Denied.', 'error');
    if (input) {
      input.value = '';
      input.focus();
    }
  }
};

window.handleAdminLogout = function() {
  window.isAdminAuthenticated = false;
  store.showToast('Logged out of Admin Portal', 'info');
  window.location.hash = '#home';
};

// Global Helper Exports
window.store = store;
window.UI = UI;
window.removeFromCart = (cartItemId) => store.removeFromCart(cartItemId);
window.updateCartQty = (cartItemId, newQty) => store.updateCartQty(cartItemId, newQty);

