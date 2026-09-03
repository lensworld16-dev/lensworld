// LENS S WORLD - Main Application Controller
import { store } from './store.js';
import { UI } from './ui.js';
import { initRouter, handleRoute } from './router.js';
import { LENS_PACKAGES, CONTACT_LENS_DISPOSAL_TYPES, PRESCRIPTION_POWER_OPTIONS } from './data.js';
import { sendOrderEmail, sendContactInquiryEmail } from './emailService.js';

// Global Event Bridge for Inline Handlers
window.pdpSelectedLens = { id: 'anti-glare-arc', name: 'Anti-Glare ARC Lens', price: 599 };
window.pdpSelectedDisposal = { id: 'daily', name: 'Daily', multiplier: 1.0, tagline: 'Daily-use contact lens option.' };
window.pdpSelectedSize = 'Medium';
window.pdpSelectedReadingPower = '+1.00';

window.selectPdpSize = function(btn, sz) {
  document.querySelectorAll('.pdp-size-btn').forEach(b => b.classList.remove('selected'));
  if (btn) btn.classList.add('selected');
  window.pdpSelectedSize = sz;
};

window.selectPdpPower = function(btn, pow) {
  document.querySelectorAll('.pdp-power-btn').forEach(b => b.classList.remove('selected'));
  if (btn) btn.classList.add('selected');
  window.pdpSelectedReadingPower = pow;
};

window.updateContactLensTotal = function(productId, multiplier, disposalName) {
  const product = store.products.find(p => p.id === productId);
  if (!product) return;
  const finalPrice = Math.round(product.price * multiplier);
  window.pdpSelectedDisposal = { id: disposalName.toLowerCase(), name: disposalName, multiplier, price: finalPrice };
  const finalTotalEl = document.getElementById('pdp-final-total');
  if (finalTotalEl) finalTotalEl.textContent = UI.formatPrice(finalPrice);
  const submitBtn = document.getElementById('pdp-submit-btn');
  if (submitBtn) {
    submitBtn.textContent = `Add to Cart (${UI.formatPrice(finalPrice)})`;
    submitBtn.onclick = () => window.AppEvents.addContactLensProduct(productId);
  }
};

window.updateLensProductTotal = function(productId, lensPrice, lensName, lensId) {
  window.pdpSelectedLens = { id: lensId, name: lensName, price: lensPrice };
  const product = store.products.find(p => p.id === productId);
  if (!product) return;
  const finalTotalEl = document.getElementById('pdp-final-total');
  if (finalTotalEl) finalTotalEl.textContent = UI.formatPrice(lensPrice);
  const submitBtn = document.getElementById('pdp-submit-btn');
  if (submitBtn) {
    submitBtn.textContent = `Add to Cart (${UI.formatPrice(lensPrice)})`;
    submitBtn.onclick = () => window.AppEvents.addLensOnlyProduct(productId);
  }
};

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
  const quickBox = document.getElementById('pdp-rx-quick-box');
  const uploadBox = document.getElementById('pdp-rx-upload-box');
  const whatsappBox = document.getElementById('pdp-rx-whatsapp-box');
  const manualBox = document.getElementById('pdp-rx-manual-box');
  const zeroBox = document.getElementById('pdp-rx-zero-box');

  if (quickBox) quickBox.style.display = method === 'quick' ? 'block' : 'none';
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

window.pdpSelectedSize = 'Medium';
window.pdpSelectedReadingPower = '+1.00';

window.AppEvents = {
  toggleWishlist(productId) {
    store.toggleWishlist(productId);
  },

  removeFromWishlist(productId) {
    store.toggleWishlist(productId);
  },

  addStandardProduct(productId) {
    const product = store.products.find(p => p.id === productId);
    if (!product) return;
    const isReader = product.type === 'reading-glasses';

    const rxMethodRadio = document.querySelector('input[name="pdp-rx-method"]:checked');
    const rxMethod = isReader ? (rxMethodRadio ? rxMethodRadio.value : 'quick') : null;

    let rxDetails = null;
    if (rxMethod === 'manual') {
      rxDetails = {
        right: {
          sph: document.getElementById('pdp-od-sph')?.value || '+1.00',
          cyl: document.getElementById('pdp-od-cyl')?.value || '0.00',
          axis: document.getElementById('pdp-od-axis')?.value || '-'
        },
        left: {
          sph: document.getElementById('pdp-os-sph')?.value || '+1.00',
          cyl: document.getElementById('pdp-os-cyl')?.value || '0.00',
          axis: document.getElementById('pdp-os-axis')?.value || '-'
        },
        odSphere: document.getElementById('pdp-od-sph')?.value || '+1.00',
        odCyl: document.getElementById('pdp-od-cyl')?.value || '0.00',
        odAxis: document.getElementById('pdp-od-axis')?.value || '-',
        osSphere: document.getElementById('pdp-os-sph')?.value || '+1.00',
        osCyl: document.getElementById('pdp-os-cyl')?.value || '0.00',
        osAxis: document.getElementById('pdp-os-axis')?.value || '-'
      };
    }

    store.addToCart(product, { 
      selectedColor: window.pdpSelectedColor || product.color || 'Midnight Black',
      readingPower: isReader ? (window.pdpSelectedReadingPower || '+1.00') : null,
      size: isReader ? (window.pdpSelectedSize || 'Medium') : product.size,
      prescriptionMethod: rxMethod,
      prescriptionFile: window.rxUploadedFile,
      prescriptionDetails: rxDetails
    });
  },

  addPdpProductWithSelectedLens(productId) {
    const product = store.products.find(p => p.id === productId);
    if (!product) return;

    const lensChoiceRadio = document.querySelector('input[name="pdp-lens-choice"]:checked');
    const isWithLens = lensChoiceRadio && lensChoiceRadio.value === 'lenses';

    const selectedLens = isWithLens ? (window.pdpSelectedLens || store.lensPackages[0]) : null;
    const rxMethodRadio = document.querySelector('input[name="pdp-rx-method"]:checked');
    const rxMethod = isWithLens ? (rxMethodRadio ? rxMethodRadio.value : 'upload') : null;

    let rxDetails = null;
    if (rxMethod === 'manual') {
      rxDetails = {
        right: {
          sph: document.getElementById('pdp-od-sph')?.value || '0.00',
          cyl: document.getElementById('pdp-od-cyl')?.value || '0.00',
          axis: document.getElementById('pdp-od-axis')?.value || '-'
        },
        left: {
          sph: document.getElementById('pdp-os-sph')?.value || '0.00',
          cyl: document.getElementById('pdp-os-cyl')?.value || '0.00',
          axis: document.getElementById('pdp-os-axis')?.value || '-'
        },
        odSphere: document.getElementById('pdp-od-sph')?.value || '0.00',
        odCyl: document.getElementById('pdp-od-cyl')?.value || '0.00',
        odAxis: document.getElementById('pdp-od-axis')?.value || '-',
        osSphere: document.getElementById('pdp-os-sph')?.value || '0.00',
        osCyl: document.getElementById('pdp-os-cyl')?.value || '0.00',
        osAxis: document.getElementById('pdp-os-axis')?.value || '-'
      };
    }

    store.addToCart(product, {
      selectedColor: window.pdpSelectedColor || product.color || 'Midnight Black',
      selectedLens,
      prescriptionMethod: rxMethod,
      prescriptionFile: window.rxUploadedFile,
      prescriptionDetails: rxDetails
    });
  },

  addLensOnlyProduct(productId) {
    const product = store.products.find(p => p.id === productId);
    if (!product) return;

    const rxMethodRadio = document.querySelector('input[name="pdp-rx-method"]:checked');
    const rxMethod = rxMethodRadio ? rxMethodRadio.value : 'upload';

    let rxDetails = null;
    if (rxMethod === 'manual') {
      rxDetails = {
        right: {
          sph: document.getElementById('pdp-od-sph')?.value || '0.00',
          cyl: document.getElementById('pdp-od-cyl')?.value || '0.00',
          axis: document.getElementById('pdp-od-axis')?.value || '-'
        },
        left: {
          sph: document.getElementById('pdp-os-sph')?.value || '0.00',
          cyl: document.getElementById('pdp-os-cyl')?.value || '0.00',
          axis: document.getElementById('pdp-os-axis')?.value || '-'
        },
        odSphere: document.getElementById('pdp-od-sph')?.value || '0.00',
        odCyl: document.getElementById('pdp-od-cyl')?.value || '0.00',
        odAxis: document.getElementById('pdp-od-axis')?.value || '-',
        osSphere: document.getElementById('pdp-os-sph')?.value || '0.00',
        osCyl: document.getElementById('pdp-os-cyl')?.value || '0.00',
        osAxis: document.getElementById('pdp-os-axis')?.value || '-'
      };
    }

    store.addToCart({
      ...product,
      name: product.name,
      price: product.price
    }, {
      prescriptionMethod: rxMethod,
      prescriptionFile: window.rxUploadedFile,
      prescriptionDetails: rxDetails
    });
  },

  addContactLensProduct(productId) {
    const product = store.products.find(p => p.id === productId);
    if (!product) return;

    const rxMethodRadio = document.querySelector('input[name="pdp-rx-method"]:checked');
    const rxMethod = rxMethodRadio ? rxMethodRadio.value : 'upload';

    let rxDetails = null;
    if (rxMethod === 'manual') {
      rxDetails = {
        odSphere: document.getElementById('pdp-od-sph')?.value || '-1.50',
        osSphere: document.getElementById('pdp-os-sph')?.value || '-1.50'
      };
    }

    const disposal = window.pdpSelectedDisposal || { id: 'daily', name: 'Daily', multiplier: 1.0, tagline: 'Daily-use contact lens option.' };

    store.addToCart(product, {
      disposalType: disposal,
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

    const isContactLens = product.type === 'contact-lenses';

    if (isContactLens) {
      let selectedDisposal = CONTACT_LENS_DISPOSAL_TYPES[0];
      window.modalSelectedDisposal = selectedDisposal;

      container.innerHTML = `
        <div style="margin-bottom:0.75rem;">
          <div style="display:flex; justify-content:space-between; align-items:flex-start;">
            <div>
              <h4 style="font-size:1.05rem; font-weight:800; color:#000040;">${product.name}</h4>
              <span style="font-size:0.78rem; color:#64748b;">Base Pack: <strong>${UI.formatPrice(product.price)}</strong></span>
            </div>
            <span style="background:#000040; color:white; font-size:0.7rem; font-weight:700; padding:3px 8px; border-radius:4px;">Contact Lens</span>
          </div>
        </div>

        <!-- Step 1: Disposal Type -->
        <div style="margin-bottom:1rem;">
          <div style="font-size:0.8rem; font-weight:800; color:#000040; text-transform:uppercase; letter-spacing:0.04em; margin-bottom:0.45rem;">
            Step 1: Select Disposal Type
          </div>
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:0.45rem;">
            ${CONTACT_LENS_DISPOSAL_TYPES.map((disp) => `
              <div class="lens-option-card ${disp.id === selectedDisposal.id ? 'selected' : ''}" 
                   style="border:1.5px solid ${disp.id === selectedDisposal.id ? '#000040' : '#e2e8f0'}; border-radius:8px; padding:0.6rem 0.85rem; cursor:pointer; background:${disp.id === selectedDisposal.id ? '#f8fafc' : '#fff'}; transition:all 0.2s ease;"
                   onclick="window.AppEvents.selectDisposalOption(this, '${disp.id}', ${product.price}, ${disp.priceMultiplier})">
                <div style="display:flex; justify-content:space-between; align-items:center;">
                  <div style="display:flex; align-items:center; gap:0.35rem;">
                    <input type="radio" name="modal-disposal" value="${disp.id}" ${disp.id === selectedDisposal.id ? 'checked' : ''} />
                    <strong style="font-size:0.88rem; color:#000040;">${disp.name}</strong>
                  </div>
                  <span style="font-size:0.88rem; font-weight:800; color:#000040;">${UI.formatPrice(Math.round(product.price * disp.priceMultiplier))}</span>
                </div>
                <p style="font-size:0.72rem; color:#64748b; margin-top:0.25rem;">${disp.tagline}</p>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Step 2: Prescription Choice -->
        <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:8px; padding:0.85rem; margin-bottom:1rem;">
          <div style="font-size:0.8rem; font-weight:800; color:#000040; text-transform:uppercase; letter-spacing:0.04em; margin-bottom:0.6rem;">
            Step 2: Add Prescription
          </div>
          
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:0.45rem; margin-bottom:0.75rem;">
            <label class="rx-method-pill selected" data-method="upload" 
                   style="border:1.5px solid #000040; background:#ffffff; border-radius:6px; padding:0.5rem; display:flex; align-items:center; gap:0.4rem; cursor:pointer;" 
                   onclick="window.switchRxMethod('upload')">
              <input type="radio" name="rx-method" value="upload" checked />
              <span style="font-size:0.76rem; font-weight:700; color:#000040;">📤 Upload Slip</span>
            </label>

            <label class="rx-method-pill" data-method="whatsapp" 
                   style="border:1.5px solid #e2e8f0; background:#ffffff; border-radius:6px; padding:0.5rem; display:flex; align-items:center; gap:0.4rem; cursor:pointer;" 
                   onclick="window.switchRxMethod('whatsapp')">
              <input type="radio" name="rx-method" value="whatsapp" />
              <span style="font-size:0.76rem; font-weight:700; color:#000040;">📲 WhatsApp Rx</span>
            </label>

            <label class="rx-method-pill" data-method="manual" 
                   style="border:1.5px solid #e2e8f0; background:#ffffff; border-radius:6px; padding:0.5rem; display:flex; align-items:center; gap:0.4rem; cursor:pointer;" 
                   onclick="window.switchRxMethod('manual')">
              <input type="radio" name="rx-method" value="manual" />
              <span style="font-size:0.76rem; font-weight:700; color:#000040;">✍️ Enter Power</span>
            </label>

            <label class="rx-method-pill" data-method="zeropower" 
                   style="border:1.5px solid #e2e8f0; background:#ffffff; border-radius:6px; padding:0.5rem; display:flex; align-items:center; gap:0.4rem; cursor:pointer;" 
                   onclick="window.switchRxMethod('zeropower')">
              <input type="radio" name="rx-method" value="zeropower" />
              <span style="font-size:0.76rem; font-weight:700; color:#000040;">👓 Plano Power</span>
            </label>
          </div>

          <!-- Upload Box -->
          <div id="rx-upload-box" style="background:#ffffff; border:1px dashed #000040; border-radius:6px; padding:0.75rem; text-align:center;">
            <input type="file" id="rx-file-input" accept="image/*,application/pdf" style="display:none;" onchange="window.handleRxUpload(event)" />
            <button type="button" class="btn btn-outline btn-sm" onclick="document.getElementById('rx-file-input').click()" 
                    style="width:100%; font-weight:700; border-color:#000040; color:#000040;">
              📷 Upload Doctor Prescription (Photo/PDF)
            </button>
            <div style="font-size:0.7rem; color:#64748b; margin-top:0.35rem;">Supports JPG, PNG, PDF</div>
            <div id="rx-upload-preview" style="display:none; align-items:center; gap:0.6rem; background:#f0fdf4; border:1px solid #86efac; border-radius:6px; padding:0.45rem 0.65rem; margin-top:0.6rem; text-align:left;">
              <img id="rx-upload-thumb" src="" alt="Rx Preview" style="width:40px; height:40px; object-fit:cover; border-radius:4px; display:none;" />
              <div style="flex:1; overflow:hidden;">
                <div style="font-size:0.74rem; font-weight:700; color:#166534;">✅ Prescription Attached</div>
                <div id="rx-upload-filename" style="font-size:0.68rem; color:#15803d; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;"></div>
              </div>
            </div>
          </div>

          <!-- WhatsApp Box -->
          <div id="rx-whatsapp-box" style="display:none; background:#ffffff; border:1px solid #cbd5e1; border-radius:6px; padding:0.65rem; font-size:0.76rem; color:#334155;">
            ✓ Place your order now. You can WhatsApp your prescription photo after checkout to <strong>+91 86686 87897</strong>.
          </div>

          <!-- Manual Contact Lens Box -->
          <div id="manual-power-box" style="display:none; background:#ffffff; border:1px solid #cbd5e1; border-radius:6px; padding:0.65rem;">
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:0.5rem;">
              <div style="background:#f1f5f9; padding:0.45rem; border-radius:6px;">
                <strong style="font-size:0.72rem; color:#000040; display:block; margin-bottom:0.25rem;">Right Eye</strong>
                <select id="rx-r-sph" style="width:100%; font-size:0.7rem; padding:0.3rem; border-radius:4px; border:1px solid #cbd5e1;">
                  ${PRESCRIPTION_POWER_OPTIONS.contactLensSpheres.map(s => `<option value="${s}" ${s === '-1.50' ? 'selected' : ''}>${s}</option>`).join('')}
                </select>
              </div>
              <div style="background:#f1f5f9; padding:0.45rem; border-radius:6px;">
                <strong style="font-size:0.72rem; color:#000040; display:block; margin-bottom:0.25rem;">Left Eye</strong>
                <select id="rx-l-sph" style="width:100%; font-size:0.7rem; padding:0.3rem; border-radius:4px; border:1px solid #cbd5e1;">
                  ${PRESCRIPTION_POWER_OPTIONS.contactLensSpheres.map(s => `<option value="${s}" ${s === '-1.50' ? 'selected' : ''}>${s}</option>`).join('')}
                </select>
              </div>
            </div>
          </div>

          <!-- Zero Box -->
          <div id="rx-zeropower-box" style="display:none; background:#ffffff; border:1px solid #cbd5e1; border-radius:6px; padding:0.65rem; font-size:0.76rem; color:#334155;">
            ✓ Plano (0.00 zero-power) cosmetic soft lenses will be supplied.
          </div>
        </div>

        <button type="button" id="modal-add-cart-btn" class="btn btn-navy" style="width:100%; padding:0.75rem; font-size:0.92rem; font-weight:700; border-radius:var(--radius-pill);" 
                onclick="window.AppEvents.confirmLensSelection('${product.id}')">
          Add to Cart — ${UI.formatPrice(product.price)}
        </button>
      `;

      modal.classList.add('open');
      return;
    }

    let selectedPackage = LENS_PACKAGES[0];

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
          Step 1: Select Lens Type
        </div>
        <div style="display:flex; flex-direction:column; gap:0.45rem;">
          ${LENS_PACKAGES.map((lens) => `
            <div class="lens-option-card ${lens.id === selectedPackage.id ? 'selected' : ''}" 
                 style="border:1.5px solid ${lens.id === selectedPackage.id ? '#000040' : '#e2e8f0'}; border-radius:8px; padding:0.6rem 0.85rem; display:flex; align-items:center; gap:0.65rem; cursor:pointer; background:${lens.id === selectedPackage.id ? '#f8fafc' : '#fff'}; transition:all 0.2s ease;"
                 onclick="window.AppEvents.selectLensOption(this, '${lens.id}', ${product.price}, ${lens.price})">
              <img src="${lens.img}" alt="${lens.name}" style="width:48px; height:48px; object-fit:cover; border-radius:6px; border:1px solid #cbd5e1; flex-shrink:0;" />
              <div style="flex:1;">
                <div style="display:flex; justify-content:space-between; align-items:center;">
                  <div style="display:flex; align-items:center; gap:0.35rem;">
                    <input type="radio" name="modal-lens" value="${lens.id}" ${lens.id === selectedPackage.id ? 'checked' : ''} />
                    <strong style="font-size:0.88rem; color:#000040;">${lens.name}</strong>
                  </div>
                  <span style="font-size:0.92rem; font-weight:800; color:#000040; white-space:nowrap;">+${UI.formatPrice(lens.price)}</span>
                </div>
                <p style="font-size:0.72rem; color:#64748b; margin-top:0.15rem; margin-left:1.35rem;">${lens.tagline}</p>
              </div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Step 2: Prescription Choice (Upload / WhatsApp / Manual / Zero Power) -->
      <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:8px; padding:0.85rem; margin-bottom:1rem;">
        <div style="font-size:0.8rem; font-weight:800; color:#000040; text-transform:uppercase; letter-spacing:0.04em; margin-bottom:0.6rem;">
          Step 2: Add Prescription
        </div>
        
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:0.45rem; margin-bottom:0.75rem;">
          <label class="rx-method-pill selected" data-method="upload" 
                 style="border:1.5px solid #000040; background:#ffffff; border-radius:6px; padding:0.5rem; display:flex; align-items:center; gap:0.4rem; cursor:pointer;" 
                 onclick="window.switchRxMethod('upload')">
            <input type="radio" name="rx-method" value="upload" checked />
            <span style="font-size:0.76rem; font-weight:700; color:#000040;">📤 Upload Slip</span>
          </label>

          <label class="rx-method-pill" data-method="whatsapp" 
                 style="border:1.5px solid #e2e8f0; background:#ffffff; border-radius:6px; padding:0.5rem; display:flex; align-items:center; gap:0.4rem; cursor:pointer;" 
                 onclick="window.switchRxMethod('whatsapp')">
            <input type="radio" name="rx-method" value="whatsapp" />
            <span style="font-size:0.76rem; font-weight:700; color:#000040;">📲 WhatsApp Rx</span>
          </label>

          <label class="rx-method-pill" data-method="manual" 
                 style="border:1.5px solid #e2e8f0; background:#ffffff; border-radius:6px; padding:0.5rem; display:flex; align-items:center; gap:0.4rem; cursor:pointer;" 
                 onclick="window.switchRxMethod('manual')">
            <input type="radio" name="rx-method" value="manual" />
            <span style="font-size:0.76rem; font-weight:700; color:#000040;">✍️ Enter Power</span>
          </label>

          <label class="rx-method-pill" data-method="zeropower" 
                 style="border:1.5px solid #e2e8f0; background:#ffffff; border-radius:6px; padding:0.5rem; display:flex; align-items:center; gap:0.4rem; cursor:pointer;" 
                 onclick="window.switchRxMethod('zeropower')">
            <input type="radio" name="rx-method" value="zeropower" />
            <span style="font-size:0.76rem; font-weight:700; color:#000040;">👓 Zero Power</span>
          </label>
        </div>

        <!-- Upload Slip Box -->
        <div id="rx-upload-box" style="background:#ffffff; border:1px dashed #000040; border-radius:6px; padding:0.75rem; text-align:center;">
          <input type="file" id="rx-file-input" accept="image/*,application/pdf" style="display:none;" onchange="window.handleRxUpload(event)" />
          <button type="button" class="btn btn-outline btn-sm" onclick="document.getElementById('rx-file-input').click()" 
                  style="width:100%; font-weight:700; border-color:#000040; color:#000040;">
            📷 Attach Photo / Prescription Slip (PDF/JPG)
          </button>
          <div style="font-size:0.7rem; color:#64748b; margin-top:0.35rem;">Supports JPG, PNG, PDF (Up to 10MB)</div>

          <div id="rx-upload-preview" style="display:none; align-items:center; gap:0.6rem; background:#f0fdf4; border:1px solid #86efac; border-radius:6px; padding:0.45rem 0.65rem; margin-top:0.6rem; text-align:left;">
            <img id="rx-upload-thumb" src="" alt="Rx Preview" style="width:40px; height:40px; object-fit:cover; border-radius:4px; display:none;" />
            <div style="flex:1; overflow:hidden;">
              <div style="font-size:0.74rem; font-weight:700; color:#166534;">✅ Prescription Attached</div>
              <div id="rx-upload-filename" style="font-size:0.68rem; color:#15803d; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;"></div>
            </div>
            <button type="button" onclick="document.getElementById('rx-file-input').click()" style="font-size:0.7rem; font-weight:700; color:#166534; text-decoration:underline;">Change</button>
          </div>
        </div>

        <!-- WhatsApp Box -->
        <div id="rx-whatsapp-box" style="display:none; background:#ffffff; border:1px solid #cbd5e1; border-radius:6px; padding:0.65rem; font-size:0.76rem; color:#334155;">
          <div style="font-weight:700; color:#000040; margin-bottom:0.2rem;">📲 Easiest Option</div>
          Place order now. You can WhatsApp your doctor's slip photo directly to <strong>+91 86686 87897</strong> with your Order ID.
        </div>

        <!-- Manual Eye Power Box -->
        <div id="manual-power-box" style="display:none; background:#ffffff; border:1px solid #cbd5e1; border-radius:6px; padding:0.65rem;">
          <div style="display:grid; grid-template-columns:1.2fr 1fr 1fr 1fr; gap:0.35rem; font-weight:700; color:#64748b; margin-bottom:0.35rem; text-align:center; font-size:0.72rem;">
            <span style="text-align:left;">Eye</span><span>SPH</span><span>CYL</span><span>AXIS</span>
          </div>
          <div style="display:grid; grid-template-columns:1.2fr 1fr 1fr 1fr; gap:0.35rem; align-items:center; margin-bottom:0.35rem;">
            <strong style="color:#000040; font-size:0.75rem;">Right Eye</strong>
            <select id="rx-r-sph" style="width:100%; font-size:0.7rem; padding:0.25rem; border-radius:4px; border:1px solid #cbd5e1;">
              ${PRESCRIPTION_POWER_OPTIONS.spheres.map(s => `<option value="${s}" ${s === '0.00 (Plano)' ? 'selected' : ''}>${s}</option>`).join('')}
            </select>
            <select id="rx-r-cyl" style="width:100%; font-size:0.7rem; padding:0.25rem; border-radius:4px; border:1px solid #cbd5e1;">
              ${PRESCRIPTION_POWER_OPTIONS.cylinders.map(c => `<option value="${c}">${c}</option>`).join('')}
            </select>
            <select id="rx-r-axis" style="width:100%; font-size:0.7rem; padding:0.25rem; border-radius:4px; border:1px solid #cbd5e1;">
              <option value="-">-</option>
              ${PRESCRIPTION_POWER_OPTIONS.axis.map(a => `<option value="${a}">${a}</option>`).join('')}
            </select>
          </div>
          <div style="display:grid; grid-template-columns:1.2fr 1fr 1fr 1fr; gap:0.35rem; align-items:center;">
            <strong style="color:#000040; font-size:0.75rem;">Left Eye</strong>
            <select id="rx-l-sph" style="width:100%; font-size:0.7rem; padding:0.25rem; border-radius:4px; border:1px solid #cbd5e1;">
              ${PRESCRIPTION_POWER_OPTIONS.spheres.map(s => `<option value="${s}" ${s === '0.00 (Plano)' ? 'selected' : ''}>${s}</option>`).join('')}
            </select>
            <select id="rx-l-cyl" style="width:100%; font-size:0.7rem; padding:0.25rem; border-radius:4px; border:1px solid #cbd5e1;">
              ${PRESCRIPTION_POWER_OPTIONS.cylinders.map(c => `<option value="${c}">${c}</option>`).join('')}
            </select>
            <select id="rx-l-axis" style="width:100%; font-size:0.7rem; padding:0.25rem; border-radius:4px; border:1px solid #cbd5e1;">
              <option value="-">-</option>
              ${PRESCRIPTION_POWER_OPTIONS.axis.map(a => `<option value="${a}">${a}</option>`).join('')}
            </select>
          </div>
        </div>

        <!-- Zero Power Box -->
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

  selectDisposalOption(cardEl, disposalId, basePrice, multiplier) {
    document.querySelectorAll('.lens-option-card').forEach(c => {
      c.style.borderColor = '#e2e8f0';
      c.style.background = '#ffffff';
    });
    cardEl.style.borderColor = '#000040';
    cardEl.style.background = '#f8fafc';

    const radio = cardEl.querySelector('input[type="radio"]');
    if (radio) radio.checked = true;

    const disp = CONTACT_LENS_DISPOSAL_TYPES.find(d => d.id === disposalId);
    window.modalSelectedDisposal = disp || CONTACT_LENS_DISPOSAL_TYPES[0];

    const btn = document.getElementById('modal-add-cart-btn');
    if (btn) {
      btn.textContent = `Add to Cart — ${UI.formatPrice(Math.round(basePrice * multiplier))}`;
    }
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

    const isContactLens = product.type === 'contact-lenses';
    const rxMethod = document.querySelector('input[name="rx-method"]:checked')?.value || 'upload';

    let prescriptionData = null;
    let prescriptionFile = null;

    if (rxMethod === 'upload' && window.rxUploadedFile) {
      prescriptionFile = window.rxUploadedFile;
    } else if (rxMethod === 'manual') {
      prescriptionData = {
        right: {
          sph: document.getElementById('rx-r-sph')?.value || (isContactLens ? '-1.50' : '0.00'),
          cyl: document.getElementById('rx-r-cyl')?.value || '0.00',
          axis: document.getElementById('rx-r-axis')?.value || '-'
        },
        left: {
          sph: document.getElementById('rx-l-sph')?.value || (isContactLens ? '-1.50' : '0.00'),
          cyl: document.getElementById('rx-l-cyl')?.value || '0.00',
          axis: document.getElementById('rx-l-axis')?.value || '-'
        }
      };
    }

    if (isContactLens) {
      const selectedRadio = document.querySelector('input[name="modal-disposal"]:checked');
      const dispId = selectedRadio ? selectedRadio.value : 'daily';
      const disposal = CONTACT_LENS_DISPOSAL_TYPES.find(d => d.id === dispId) || CONTACT_LENS_DISPOSAL_TYPES[0];

      store.addToCart(product, {
        disposalType: disposal,
        prescriptionMethod: rxMethod,
        prescriptionData,
        prescriptionFile
      });
    } else {
      const selectedRadio = document.querySelector('input[name="modal-lens"]:checked');
      const lensId = selectedRadio ? selectedRadio.value : LENS_PACKAGES[0].id;
      const selectedLens = LENS_PACKAGES.find(l => l.id === lensId) || LENS_PACKAGES[0];

      store.addToCart(product, {
        selectedLens,
        prescriptionMethod: rxMethod,
        prescriptionData,
        prescriptionFile
      });
    }

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

  handlePaymentModeChange(event) {
    const selectedMode = document.querySelector('input[name="payment-mode"]:checked')?.value || 'UPI';
    document.querySelectorAll('.payment-method-card').forEach(card => {
      const radio = card.querySelector('input[type="radio"]');
      if (radio && radio.checked) {
        card.classList.add('active');
      } else {
        card.classList.remove('active');
      }
    });

    const submitBtn = document.getElementById('checkout-submit-btn');
    if (submitBtn) {
      const totals = store.getTotals();
      if (selectedMode === 'Cash on Delivery') {
        submitBtn.innerHTML = `<span>Place COD Order (${UI.formatPrice(totals.grandTotal)}) →</span>`;
      } else {
        submitBtn.innerHTML = `<span>Pay ${UI.formatPrice(totals.grandTotal)} with Cashfree →</span>`;
      }
    }
  },

  async handleCheckoutSubmit(event) {
    event.preventDefault();

    const name = document.getElementById('cust-name')?.value || 'Customer';
    const phone = document.getElementById('cust-phone')?.value || '';
    const email = document.getElementById('cust-email')?.value || '';
    const address = document.getElementById('cust-address')?.value || '';
    const city = document.getElementById('cust-city')?.value || '';
    const pincode = document.getElementById('cust-pincode')?.value || '';
    const paymentMode = document.querySelector('input[name="payment-mode"]:checked')?.value || 'UPI';

    const submitBtn = document.getElementById('checkout-submit-btn');
    const statusMsg = document.getElementById('checkout-status-msg');

    const totals = store.getTotals();

    // 1. If Cash on Delivery, place order directly
    if (paymentMode === 'Cash on Delivery') {
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span>Placing COD Order...</span>';
      }
      const newOrder = store.placeOrder({
        customer: { name, phone, email, address, city, pincode },
        paymentMethod: 'Cash on Delivery',
        paymentStatus: 'Pending'
      });

      // Asynchronously send live email notification via EmailJS
      sendOrderEmail(newOrder).then(sent => {
        if (sent) console.log("✓ Live EmailJS Order confirmation sent!");
      }).catch(e => console.warn("Email notification error", e));

      window.location.hash = `#order-success?id=${newOrder.id}`;
      return;
    }

    // 2. Online Payment (Cashfree UPI / Cards / NetBanking)
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span>Connecting to Cashfree...</span>';
    }
    if (statusMsg) {
      statusMsg.style.display = 'block';
      statusMsg.style.color = '#0f766e';
      statusMsg.style.background = '#f0fdfa';
      statusMsg.textContent = 'Initiating secure Cashfree checkout session...';
    }

    try {
      const tempOrderId = `LSW_${Date.now()}`;
      const fullCustomer = { 
        name: name.trim(), 
        phone: phone.trim(), 
        email: email.trim(), 
        address: address.trim(), 
        city: city.trim(), 
        pincode: pincode.trim() 
      };

      const pendingOrderData = {
        orderId: tempOrderId,
        orderAmount: totals.grandTotal,
        customerName: fullCustomer.name,
        customerPhone: fullCustomer.phone,
        customerEmail: fullCustomer.email,
        customer: fullCustomer,
        items: JSON.parse(JSON.stringify(store.cart)),
        subtotal: totals.subtotal,
        discount: totals.discount,
        couponApplied: store.appliedCoupon,
        shipping: totals.shipping,
        gst: totals.gst,
        total: totals.grandTotal,
        paymentMethod: paymentMode === 'Card' ? 'Cashfree Card/Netbanking' : 'Cashfree UPI'
      };

      // Client storage backup
      try {
        sessionStorage.setItem('lsw_pending_order', JSON.stringify(pendingOrderData));
        localStorage.setItem('lsw_pending_order', JSON.stringify(pendingOrderData));
      } catch (e) {}

      const res = await fetch('/api/create-cashfree-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pendingOrderData)
      });

      const orderData = await res.json();
      if (!res.ok || !orderData.paymentSessionId) {
        throw new Error(orderData.error || 'Failed to initialize Cashfree payment');
      }

      if (statusMsg) statusMsg.textContent = 'Opening Cashfree Payment Modal...';

      // Check for Cashfree SDK
      if (!window.Cashfree) {
        throw new Error('Cashfree SDK is loading. Please check your internet connection.');
      }

      const cashfreeMode = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_CASHFREE_MODE) || 'production';
      const cashfree = window.Cashfree({
        mode: cashfreeMode // 'production' for live payments
      });

      const checkoutOptions = {
        paymentSessionId: orderData.paymentSessionId,
        redirectTarget: '_modal'
      };

      cashfree.checkout(checkoutOptions).then(async (result) => {
        if (result.error) {
          console.warn('Cashfree payment modal error/cancelled:', result.error);
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<span>Pay & Place Order →</span>';
          }
          if (statusMsg) {
            statusMsg.style.color = '#e11d48';
            statusMsg.style.background = '#ffe4e6';
            statusMsg.textContent = result.error.message || 'Payment was cancelled or failed. Please try again.';
          }
          return;
        }

        if (statusMsg) statusMsg.textContent = 'Verifying payment confirmation with Cashfree...';

        // Check payment status with server
        try {
          const verifyRes = await fetch(`/api/verify-cashfree-order?orderId=${encodeURIComponent(tempOrderId)}`);
          const verifyData = await verifyRes.json();

          if (verifyData.isPaid) {
            if (statusMsg) statusMsg.textContent = 'Payment verified! Finalizing order...';

            const newOrder = store.placeOrder({
              id: tempOrderId,
              customer: fullCustomer,
              items: pendingOrderData.items,
              total: totals.grandTotal,
              subtotal: totals.subtotal,
              discount: totals.discount,
              shipping: totals.shipping,
              gst: totals.gst,
              paymentMethod: paymentMode === 'Card' ? 'Cashfree Card/Netbanking' : 'Cashfree UPI',
              paymentStatus: 'Paid',
              cfOrderId: orderData.orderId,
              cfPaymentSessionId: orderData.paymentSessionId
            });

            sendOrderEmail(newOrder).then(sent => {
              if (sent) console.log("✓ Live EmailJS Order confirmation sent!");
            }).catch(e => console.warn("Email notification error", e));

            window.location.hash = `#order-success?id=${newOrder.id}`;
            return;
          }
        } catch (vErr) {
          console.warn('Verification check notice:', vErr);
        }

        if (result.paymentDetails) {
          console.log('Payment Successful:', result.paymentDetails);
          if (statusMsg) statusMsg.textContent = 'Payment successful! Creating order...';

          const newOrder = store.placeOrder({
            id: tempOrderId,
            customer: fullCustomer,
            items: pendingOrderData.items,
            total: totals.grandTotal,
            subtotal: totals.subtotal,
            discount: totals.discount,
            shipping: totals.shipping,
            gst: totals.gst,
            paymentMethod: paymentMode === 'Card' ? 'Cashfree Card/Netbanking' : 'Cashfree UPI',
            paymentStatus: 'Paid',
            cfOrderId: orderData.orderId,
            cfPaymentSessionId: orderData.paymentSessionId
          });

          sendOrderEmail(newOrder).then(sent => {
            if (sent) console.log("✓ Live EmailJS Order confirmation sent!");
          }).catch(e => console.warn("Email notification error", e));

          window.location.hash = `#order-success?id=${newOrder.id}`;
        } else {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<span>Pay & Place Order →</span>';
          }
          if (statusMsg) statusMsg.style.display = 'none';
        }
      }).catch(err => {
        console.error('Checkout error:', err);
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = '<span>Pay & Place Order →</span>';
        }
        if (statusMsg) {
          statusMsg.style.color = '#e11d48';
          statusMsg.style.background = '#ffe4e6';
          statusMsg.textContent = err.message || 'Could not complete checkout.';
        }
      });

    } catch (err) {
      console.error('Cashfree error:', err);
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<span>Pay & Place Order →</span>';
      }
      if (statusMsg) {
        statusMsg.style.color = '#e11d48';
        statusMsg.style.background = '#ffe4e6';
        statusMsg.textContent = err.message || 'Payment initiation failed.';
    }
  }
};

// Global Cashfree Order Verification on Redirect / Return
window.verifyCashfreeOrderOnSuccess = async function(orderId) {
  if (!orderId) return false;
  try {
    console.log('Verifying Cashfree order status for:', orderId);
    const res = await fetch(`/api/verify-cashfree-order?orderId=${encodeURIComponent(orderId)}`);
    const data = await res.json();

    if (data.isPaid || data.orderStatus === 'PAID') {
      let pending = null;
      try {
        const saved = sessionStorage.getItem('lsw_pending_order') || localStorage.getItem('lsw_pending_order');
        if (saved) pending = JSON.parse(saved);
      } catch (e) {}

      const customer = data.dbOrder?.customer || pending?.customer || {
        name: data.customer?.customer_name || 'Customer',
        phone: data.customer?.customer_phone || '',
        email: data.customer?.customer_email || ''
      };

      const items = data.dbOrder?.items || pending?.items || [];
      const total = Number(data.orderAmount || data.dbOrder?.total || pending?.total || 0);

      const confirmedOrder = store.placeOrder({
        id: orderId,
        customer,
        items,
        total,
        paymentMethod: 'Cashfree Online',
        paymentStatus: 'Paid',
        cfOrderId: data.cfOrderId || null
      });

      sendOrderEmail(confirmedOrder).catch(e => console.warn(e));

      // Clean up pending backup
      try {
        sessionStorage.removeItem('lsw_pending_order');
        localStorage.removeItem('lsw_pending_order');
      } catch (e) {}

      const mainApp = document.getElementById('app-main');
      if (mainApp) {
        mainApp.innerHTML = UI.renderOrderSuccessPage(orderId);
      }
      return true;
    }
  } catch (err) {
    console.error('Failed to verify on success return:', err);
  }
  return false;
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
    } else if (event === 'products_updated') {
      const hash = window.location.hash || '';
      if (!hash.startsWith('#admin')) {
        handleRoute();
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
  const gen = document.getElementById('admin-gender-filter')?.value || 'all';

  document.querySelectorAll('#admin-products-table tbody tr').forEach(row => {
    const name = row.getAttribute('data-name') || '';
    const category = row.getAttribute('data-category') || '';
    const gender = row.getAttribute('data-gender') || '';
    const sku = row.getAttribute('data-sku') || '';

    const matchesQuery = name.includes(query) || sku.includes(query);
    const matchesCat = (cat === 'all' || category === cat);
    const matchesGen = (gen === 'all' || gender === gen || (gender === 'unisex' && gen !== 'kids'));

    if (matchesQuery && matchesCat && matchesGen) {
      row.style.display = '';
    } else {
      row.style.display = 'none';
    }
  });
};

window.toggleSelectAllProducts = function(checked) {
  const visibleRows = document.querySelectorAll('#admin-products-table tbody tr');
  visibleRows.forEach(row => {
    if (row.style.display !== 'none') {
      const cb = row.querySelector('.admin-prod-checkbox');
      if (cb) cb.checked = checked;
    }
  });
  window.onProductSelectChange();
};

window.onProductSelectChange = function() {
  const checkboxes = document.querySelectorAll('.admin-prod-checkbox:checked');
  const count = checkboxes.length;
  const bulkBar = document.getElementById('admin-bulk-actions-bar');
  const countLabel = document.getElementById('admin-selected-count-label');
  const selectAllCb = document.getElementById('admin-select-all-prods');

  if (countLabel) countLabel.textContent = `${count} item${count === 1 ? '' : 's'} selected`;

  if (bulkBar) {
    if (count > 0) {
      bulkBar.style.display = 'flex';
    } else {
      bulkBar.style.display = 'none';
    }
  }

  const allVisible = document.querySelectorAll('#admin-products-table tbody tr:not([style*="display: none"]) .admin-prod-checkbox');
  if (selectAllCb) {
    selectAllCb.checked = (allVisible.length > 0 && checkboxes.length === allVisible.length);
  }
};

window.getSelectedProductIds = function() {
  const checkboxes = document.querySelectorAll('.admin-prod-checkbox:checked');
  return Array.from(checkboxes).map(cb => cb.value);
};

window.clearProductSelection = function() {
  const checkboxes = document.querySelectorAll('.admin-prod-checkbox');
  checkboxes.forEach(cb => cb.checked = false);
  const selectAllCb = document.getElementById('admin-select-all-prods');
  if (selectAllCb) selectAllCb.checked = false;
  window.onProductSelectChange();
};

window.applyBulkCategory = function() {
  const selectedIds = window.getSelectedProductIds();
  if (selectedIds.length === 0) {
    store.showToast("Please select at least one product.", "warning");
    return;
  }
  const newCat = document.getElementById('admin-bulk-category-select')?.value;
  if (!newCat) {
    store.showToast("Please select a target category.", "warning");
    return;
  }
  store.bulkMoveCategory(selectedIds, newCat);
  const mainApp = document.getElementById('app-main');
  if (mainApp) mainApp.innerHTML = UI.renderAdminDashboard('products');
};

window.applyBulkGender = function() {
  const selectedIds = window.getSelectedProductIds();
  if (selectedIds.length === 0) {
    store.showToast("Please select at least one product.", "warning");
    return;
  }
  const newGen = document.getElementById('admin-bulk-gender-select')?.value;
  if (!newGen) {
    store.showToast("Please select a target gender.", "warning");
    return;
  }
  store.bulkChangeGender(selectedIds, newGen);
  const mainApp = document.getElementById('app-main');
  if (mainApp) mainApp.innerHTML = UI.renderAdminDashboard('products');
};

window.applyBulkFeatured = function(isFeatured = true) {
  const selectedIds = window.getSelectedProductIds();
  if (selectedIds.length === 0) {
    store.showToast("Please select at least one product.", "warning");
    return;
  }
  store.bulkSetFeatured(selectedIds, isFeatured);
  const mainApp = document.getElementById('app-main');
  if (mainApp) mainApp.innerHTML = UI.renderAdminDashboard('products');
};

window.toggleFeaturedAdmin = function(productId) {
  store.toggleProductFeatured(productId);
  const mainApp = document.getElementById('app-main');
  if (mainApp) mainApp.innerHTML = UI.renderAdminDashboard('products');
};

window.bulkDeleteProductsAdmin = function() {
  const selectedIds = window.getSelectedProductIds();
  if (selectedIds.length === 0) {
    store.showToast("Please select at least one product.", "warning");
    return;
  }
  if (confirm(`Are you sure you want to permanently delete ${selectedIds.length} selected products?`)) {
    store.bulkDeleteProducts(selectedIds);
    const mainApp = document.getElementById('app-main');
    if (mainApp) mainApp.innerHTML = UI.renderAdminDashboard('products');
  }
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

    // Color Variants in Edit Mode
    const hasVariantsCheckbox = document.getElementById('p-has-color-variants');
    const colorPickerContainer = document.getElementById('p-color-variants-picker');
    const colorCheckboxes = document.querySelectorAll('input[name="p-colors"]');
    const prodColors = product.colors || (product.color ? [product.color] : []);

    if (hasVariantsCheckbox) {
      hasVariantsCheckbox.checked = prodColors.length > 0;
      if (colorPickerContainer) colorPickerContainer.style.display = prodColors.length > 0 ? 'block' : 'none';
    }
    colorCheckboxes.forEach(cb => {
      cb.checked = prodColors.some(c => c.toLowerCase() === cb.value.toLowerCase());
    });

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

    // Default Color Variants in Add Mode
    const hasVariantsCheckbox = document.getElementById('p-has-color-variants');
    const colorPickerContainer = document.getElementById('p-color-variants-picker');
    const colorCheckboxes = document.querySelectorAll('input[name="p-colors"]');
    if (hasVariantsCheckbox) {
      hasVariantsCheckbox.checked = true;
      if (colorPickerContainer) colorPickerContainer.style.display = 'block';
    }
    colorCheckboxes.forEach(cb => {
      cb.checked = ['Black', 'Brown', 'Blue', 'Red', 'Pink', 'White'].includes(cb.value);
    });

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
    const rawDataUrl = e.target.result;
    // Auto-compress large photos via HTML5 Canvas to prevent localStorage quota crash
    const img = new Image();
    img.onload = function() {
      const maxDim = 800;
      let width = img.width;
      let height = img.height;
      if (width > height) {
        if (width > maxDim) {
          height = Math.round((height * maxDim) / width);
          width = maxDim;
        }
      } else {
        if (height > maxDim) {
          width = Math.round((width * maxDim) / height);
          height = maxDim;
        }
      }
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);
      const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.82);

      document.getElementById('p-img').value = compressedDataUrl;
      const previewImg = document.getElementById('p-preview-thumb');
      const previewText = document.getElementById('p-preview-text');
      previewImg.src = compressedDataUrl;
      previewImg.style.display = 'block';
      previewText.style.display = 'none';
    };
    img.onerror = function() {
      document.getElementById('p-img').value = rawDataUrl;
    };
    img.src = rawDataUrl;
  };
  reader.readAsDataURL(file);
};

window.saveProductForm = function(event) {
  event.preventDefault();

  const editId = document.getElementById('p-edit-id').value;
  const name = document.getElementById('p-name').value.trim();
  const sku = document.getElementById('p-sku').value.trim() || `LSW-${Math.floor(100 + Math.random() * 900)}`;
  const type = document.getElementById('p-type').value;
  const gender = document.getElementById('p-gender').value;
  const badge = document.getElementById('p-badge').value.trim();
  const price = parseFloat(document.getElementById('p-price').value);
  const mrp = parseFloat(document.getElementById('p-mrp').value) || Math.round(price * 1.6);
  const img = document.getElementById('p-img').value.trim() || 'https://chashmah.com/wp-content/uploads/2026/08/1001073265_768x768.webp';
  const featured = document.getElementById('p-featured')?.checked !== false;
  const isNew = document.getElementById('p-is-new')?.checked === true;
  const isTrending = document.getElementById('p-is-trending')?.checked === true;
  const lensOptionsAvailable = document.getElementById('p-rx-enabled')?.checked !== false;
  const inStock = document.getElementById('p-instock')?.checked !== false;
  
  const lensWidth = document.getElementById('p-lens-width')?.value.trim() || '50';
  const bridgeWidth = document.getElementById('p-bridge-width')?.value.trim() || '20';
  const templeLength = document.getElementById('p-temple-length')?.value.trim() || '142';
  const size = `${lensWidth}-${bridgeWidth}-${templeLength}`;
  
  const shape = document.getElementById('p-shape')?.value.trim() || 'Rectangle';
  const weight = document.getElementById('p-weight')?.value.trim() || '17g';
  const description = document.getElementById('p-desc')?.value.trim() || `${name} handcrafted with optical precision from LENS S WORLD.`;

  // Handle Color Variants
  const hasVariants = document.getElementById('p-has-color-variants')?.checked !== false;
  let colors = [];
  if (hasVariants) {
    const checkedBoxes = document.querySelectorAll('input[name="p-colors"]:checked');
    colors = Array.from(checkedBoxes).map(cb => cb.value);
  }
  const color = colors.length > 0 ? colors[0] : 'Black';

  const productData = {
    name,
    sku,
    type,
    category: type,
    gender,
    cats: gender === 'unisex' ? ['men', 'women', 'unisex'] : [gender],
    badge: badge || (isNew ? 'New' : (isTrending ? 'Trending' : '')),
    featured,
    isFeatured: featured,
    bestSeller: featured,
    isNew,
    isTrending,
    trending: isTrending,
    price,
    mrp,
    img,
    gallery: [img],
    lensOptionsAvailable,
    prescriptionAvailable: lensOptionsAvailable,
    frameOnlyAvailable: true,
    inStock,
    color,
    colors: colors.length > 0 ? colors : [color],
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

window.filterHomeShowcase = function(cat, btn) {
  document.querySelectorAll('.home-tab-chip').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  const grid = document.getElementById('home-showcase-grid');
  if (!grid) return;
  const prods = window.__recentAndFeaturedProds || [];
  const filtered = cat === 'all' ? prods : prods.filter(p => p.type === cat || (p.cats && p.cats.includes(cat)));
  if (filtered.length === 0) {
    grid.innerHTML = `<div style="grid-column:1/-1; padding:2.5rem 1rem; text-align:center; color:#64748b; font-size:0.85rem; background:#ffffff; border-radius:10px; border:1px dashed #cbd5e1;">No products found in this category yet.</div>`;
  } else {
    grid.innerHTML = filtered.slice(0, 4).map(p => UI.renderProductCard(p)).join('');
  }
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
    // Circles (Eyeglasses, Sunglasses, Power Specs, Contact Lens, Readers, Lens, Accessories)
    story_eyeglasses: getVal('catimg_story_eyeglasses'),
    story_sunglasses: getVal('catimg_story_sunglasses'),
    story_power_specs: getVal('catimg_story_power_specs'),
    story_contact_lenses: getVal('catimg_story_contact_lenses'),
    story_readers: getVal('catimg_story_readers'),
    story_lenses: getVal('catimg_story_lenses'),
    story_accessories: getVal('catimg_story_accessories'),

    // Eyeglasses
    eye_men: getVal('catimg_eye_men'),
    eye_women: getVal('catimg_eye_women'),
    eye_kids: getVal('catimg_eye_kids'),
    eye_unisex: getVal('catimg_eye_unisex'),
    eye_couple: getVal('catimg_eye_couple'),

    // Sunglasses
    sun_men: getVal('catimg_sun_men'),
    sun_women: getVal('catimg_sun_women'),
    sun_kids: getVal('catimg_sun_kids'),
    sun_unisex: getVal('catimg_sun_unisex'),
    sun_couple: getVal('catimg_sun_couple'),
    sun_clipon: getVal('catimg_sun_clipon'),
    sun_sports: getVal('catimg_sun_sports')
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

