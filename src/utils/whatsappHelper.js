// WhatsApp Integration Utilities for LENS S WORLD

export const STORE_PHONE = "+91 86686 87897";
export const STORE_WHATSAPP_NUMBER = "918668687897";
export const STORE_EMAIL = "lensworld16@gmail.com";
export const STORE_INSTAGRAM = "https://www.instagram.com/lens_s_world?igsi=MTc1ZTdnY2Ridmdv";
export const STORE_FACEBOOK = "https://www.facebook.com/share/1E3qwjjHXF/";

/**
 * Generates direct WhatsApp click-to-chat URL
 */
export function getWhatsAppUrl(message = "Hello LENS S WORLD, I need help.") {
  return `https://wa.me/${STORE_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

/**
 * Formats full order summary for WhatsApp notification to the owner
 */
  const itemsText = (order.items || []).map((item, idx) => {
    let itemExtra = "";
    let unitPrice = item.price;
    if (item.disposalType) {
      unitPrice = Math.round(item.price * (item.disposalType.priceMultiplier || 1.0));
      itemExtra += ` [Disposal: ${item.disposalType.name}]`;
      if (item.prescriptionDetails) {
        itemExtra += ` [OD: ${item.prescriptionDetails.odSphere || '-'}, OS: ${item.prescriptionDetails.osSphere || '-'}]`;
      }
    } else if (item.selectedLens) {
      unitPrice = item.price + item.selectedLens.price;
      itemExtra += ` [Lens: ${item.selectedLens.name} (+₹${item.selectedLens.price})]`;
      if (item.prescriptionDetails) {
        itemExtra += ` [OD: ${item.prescriptionDetails.odSphere || '-'} Cyl: ${item.prescriptionDetails.odCyl || '0'}, OS: ${item.prescriptionDetails.osSphere || '-'} Cyl: ${item.prescriptionDetails.osCyl || '0'}]`;
      }
    } else if (item.type === 'eyeglasses' || item.type === 'sunglasses') {
      itemExtra += " [Frame Only]";
    }

    if (item.readingPower) itemExtra += ` [Power: ${item.readingPower}]`;
    if (item.selectedColor && !item.disposalType) itemExtra += ` [Color: ${item.selectedColor}]`;

    return `${idx + 1}. *${item.name}* x${item.qty} — ₹${(unitPrice * item.qty).toLocaleString('en-IN')}${itemExtra}`;
  }).join("\n");

  const lines = [
    `👓 *NEW ORDER — LENS S WORLD* 👓`,
    `━━━━━━━━━━━━━━━━━━━━`,
    `*Order ID:* #${order.id}`,
    `*Date:* ${new Date(order.createdAt).toLocaleString('en-IN')}`,
    `*Customer:* ${order.customer?.name || "Customer"}`,
    `*Phone:* ${order.customer?.phone || "-"}`,
    `*Email:* ${order.customer?.email || "-"}`,
    `*Delivery Address:* ${order.customer?.address || "-"}, ${order.customer?.city || "-"}, ${order.customer?.state || "-"} - ${order.customer?.pincode || "-"}`,
    `━━━━━━━━━━━━━━━━━━━━`,
    `*ORDER ITEMS:*`,
    itemsText,
    `━━━━━━━━━━━━━━━━━━━━`,
    `*Subtotal:* ₹${order.subtotal?.toLocaleString('en-IN')}`,
    order.discount > 0 ? `*Discount (${order.couponApplied || 'Coupon'}):* -₹${order.discount}` : null,
    `*Shipping:* ${order.shipping === 0 ? "FREE" : "₹" + order.shipping}`,
    `*GST (12%):* ₹${order.gst?.toLocaleString('en-IN')}`,
    `*GRAND TOTAL:* ₹${order.total?.toLocaleString('en-IN')}`,
    `━━━━━━━━━━━━━━━━━━━━`,
    `*Payment Mode:* ${order.paymentMethod} (${order.paymentStatus || 'Pending'})`,
    order.prescriptionMethod ? `*Prescription Type:* ${order.prescriptionMethod.toUpperCase()}` : null,
    order.prescriptionFile ? `*Prescription Attached:* ${order.prescriptionFile.name || 'File Uploaded'}` : null,
    order.notes ? `*Customer Notes:* ${order.notes}` : null,
    `━━━━━━━━━━━━━━━━━━━━`,
    `_LENS S WORLD — Nayi Nazar, Naya Style_`
  ];

  return lines.filter(Boolean).join("\n");
}
