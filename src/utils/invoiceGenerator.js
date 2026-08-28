// Professional Printable GST Tax Invoice Generator

export function printGSTInvoice(order) {
  const itemsHtml = (order.items || []).map((item, idx) => {
    const itemTotal = (item.price + (item.selectedLens?.price || 0)) * item.qty;
    const lensDetails = item.selectedLens 
      ? `<div style="font-size: 11px; color: #4b5563; margin-top: 2px;">+ Lens Package: ${item.selectedLens.name} (₹${item.selectedLens.price})</div>` 
      : (item.readingPower ? `<div style="font-size: 11px; color: #4b5563;">Power: ${item.readingPower}</div>` : '');
    const colorDetails = item.selectedColor ? `<span style="font-size: 11px; color: #6b7280;">Color: ${item.selectedColor}</span>` : '';

    return `
      <tr>
        <td style="padding: 10px 12px; border-bottom: 1px solid #e5e7eb; font-size: 13px; text-align: center;">${idx + 1}</td>
        <td style="padding: 10px 12px; border-bottom: 1px solid #e5e7eb; font-size: 13px;">
          <strong>${item.name}</strong> ${colorDetails}
          ${lensDetails}
          <div style="font-size: 11px; color: #9ca3af;">SKU: ${item.sku || 'LSW-STD'} | HSN: 9003</div>
        </td>
        <td style="padding: 10px 12px; border-bottom: 1px solid #e5e7eb; font-size: 13px; text-align: center;">${item.qty}</td>
        <td style="padding: 10px 12px; border-bottom: 1px solid #e5e7eb; font-size: 13px; text-align: right;">₹${item.price.toLocaleString('en-IN')}</td>
        <td style="padding: 10px 12px; border-bottom: 1px solid #e5e7eb; font-size: 13px; text-align: right; font-weight: 600;">₹${itemTotal.toLocaleString('en-IN')}</td>
      </tr>
    `;
  }).join('');

  const invoiceHtml = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <title>Tax Invoice - ${order.id} | LENS S WORLD</title>
      <style>
        * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; }
        body { background: #f9fafb; color: #111827; padding: 30px 20px; }
        .invoice-box { max-width: 800px; margin: auto; background: #ffffff; padding: 35px; border-radius: 12px; border: 1px solid #e5e7eb; box-shadow: 0 4px 15px rgba(0,0,0,0.05); }
        .header-table { width: 100%; margin-bottom: 25px; border-bottom: 2px solid #0f766e; padding-bottom: 20px; }
        .logo-title { font-size: 26px; font-weight: 800; color: #0f766e; letter-spacing: 0.5px; }
        .tagline { font-size: 11px; text-transform: uppercase; letter-spacing: 2px; color: #6b7280; margin-top: 2px; }
        .invoice-title { font-size: 22px; font-weight: 700; color: #1f2937; text-align: right; }
        .invoice-badge { display: inline-block; background: #ecfdf5; color: #065f46; font-size: 12px; font-weight: 600; padding: 3px 8px; border-radius: 6px; margin-top: 4px; }
        .info-grid { width: 100%; margin-bottom: 25px; }
        .info-grid td { vertical-align: top; width: 50%; font-size: 13px; line-height: 1.6; }
        .section-label { font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #9ca3af; font-weight: 700; margin-bottom: 6px; }
        .items-table { width: 100%; border-collapse: collapse; margin-bottom: 25px; }
        .items-table th { background: #f3f4f6; color: #374151; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; padding: 10px 12px; border-bottom: 1px solid #d1d5db; }
        .summary-table { width: 320px; margin-left: auto; border-collapse: collapse; font-size: 13px; }
        .summary-table td { padding: 6px 10px; }
        .summary-table .grand-total { font-size: 16px; font-weight: 800; color: #0f766e; border-top: 2px solid #0f766e; border-bottom: 2px solid #0f766e; padding: 10px 10px; }
        .footer { margin-top: 35px; border-top: 1px dashed #d1d5db; padding-top: 20px; text-align: center; font-size: 12px; color: #6b7280; line-height: 1.5; }
        .auth-seal { text-align: right; margin-top: 25px; font-size: 12px; color: #4b5563; }
        @media print {
          body { padding: 0; background: #fff; }
          .invoice-box { border: none; box-shadow: none; padding: 15px; }
        }
      </style>
    </head>
    <body>
      <div class="invoice-box">
        <table class="header-table">
          <tr>
            <td>
              <div class="logo-title">LENS S WORLD</div>
              <div class="tagline">Nayi Nazar, Naya Style</div>
              <div style="font-size: 12px; color: #4b5563; margin-top: 6px;">
                Email: lensworld16@gmail.com | Phone: +91 86686 87897<br/>
                Serving optical customers across India
              </div>
            </td>
            <td style="text-align: right; vertical-align: top;">
              <div class="invoice-title">TAX INVOICE</div>
              <div style="font-size: 13px; color: #4b5563; margin-top: 4px;"><strong>Invoice #:</strong> ${order.id}</div>
              <div style="font-size: 12px; color: #6b7280;"><strong>Date:</strong> ${new Date(order.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}</div>
              <div class="invoice-badge">${order.paymentStatus === 'Paid' ? 'PAID' : 'PAYMENT: ' + (order.paymentMethod || 'COD').toUpperCase()}</div>
            </td>
          </tr>
        </table>

        <table class="info-grid">
          <tr>
            <td>
              <div class="section-label">Billed & Shipped To</div>
              <strong>${order.customer?.name || 'Valued Customer'}</strong><br/>
              Phone: ${order.customer?.phone || '-'}<br/>
              Email: ${order.customer?.email || '-'}<br/>
              Address: ${order.customer?.address || '-'}, ${order.customer?.city || ''}<br/>
              State / PIN: ${order.customer?.state || ''} - ${order.customer?.pincode || ''}
            </td>
            <td style="padding-left: 20px;">
              <div class="section-label">Order Details & Prescription</div>
              <strong>Order Status:</strong> ${order.status || 'Placed'}<br/>
              <strong>Payment Mode:</strong> ${order.paymentMethod || 'Cash on Delivery'}<br/>
              <strong>Prescription Attached:</strong> ${order.prescriptionFile?.name || (order.prescriptionMethod === 'upload' ? 'Prescription Photo' : order.prescriptionMethod === 'later' ? 'Via WhatsApp' : 'Standard / Plano')}<br/>
              ${order.prescriptionDetails ? `<strong>Power (OD/OS):</strong> ${JSON.stringify(order.prescriptionDetails)}` : ''}
            </td>
          </tr>
        </table>

        <table class="items-table">
          <thead>
            <tr>
              <th style="width: 40px; text-align: center;">#</th>
              <th style="text-align: left;">Item Description</th>
              <th style="width: 60px; text-align: center;">Qty</th>
              <th style="width: 100px; text-align: right;">Unit Price</th>
              <th style="width: 110px; text-align: right;">Amount (INR)</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>

        <table class="summary-table">
          <tr>
            <td style="color: #6b7280;">Subtotal:</td>
            <td style="text-align: right; font-weight: 600;">₹${order.subtotal?.toLocaleString('en-IN')}</td>
          </tr>
          ${order.discount > 0 ? `
          <tr>
            <td style="color: #059669;">Discount (${order.couponApplied || 'Coupon'}):</td>
            <td style="text-align: right; color: #059669; font-weight: 600;">-₹${order.discount.toLocaleString('en-IN')}</td>
          </tr>
          ` : ''}
          <tr>
            <td style="color: #6b7280;">Shipping & Handling:</td>
            <td style="text-align: right; font-weight: 600;">${order.shipping === 0 ? '<span style="color: #059669;">FREE</span>' : '₹' + order.shipping}</td>
          </tr>
          <tr>
            <td style="color: #6b7280;">GST (Integrated 12%):</td>
            <td style="text-align: right; font-weight: 600;">₹${order.gst?.toLocaleString('en-IN')}</td>
          </tr>
          <tr class="grand-total">
            <td>Grand Total:</td>
            <td style="text-align: right;">₹${order.total?.toLocaleString('en-IN')}</td>
          </tr>
        </table>

        <div class="auth-seal">
          <div>For <strong>LENS S WORLD</strong></div>
          <div style="margin-top: 30px; font-size: 11px; color: #9ca3af;">Authorized Signatory</div>
        </div>

        <div class="footer">
          <p><strong>Thank you for choosing LENS S WORLD — Nayi Nazar, Naya Style.</strong></p>
          <p>For warranty, returns, lens prescription queries, reach us at <strong>lensworld16@gmail.com</strong> or WhatsApp <strong>+91 86686 87897</strong>.</p>
          <p style="font-size: 10px; color: #9ca3af; margin-top: 6px;">This is a computer-generated GST tax invoice and does not require a physical signature for digital orders.</p>
        </div>
      </div>

      <script>
        window.onload = function() {
          setTimeout(function() {
            window.print();
          }, 400);
        };
      </script>
    </body>
    </html>
  `;

  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(invoiceHtml);
    printWindow.document.close();
  } else {
    alert("Please allow popups to open and print the GST Tax Invoice.");
  }
}
