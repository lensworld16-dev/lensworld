// LENS S WORLD - WhatsApp Direct Ordering & Chat Helpers
import { STORE_INFO } from './data.js';

/**
 * Returns direct WhatsApp click-to-chat URL with prefilled text
 */
export function getWhatsAppUrl(message = "Hello LENS S WORLD, I would like to enquire about eyewear.") {
  return `https://wa.me/${STORE_INFO.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

/**
 * Generates WhatsApp URL for a specific product enquiry
 */
export function getProductEnquiryUrl(product) {
  const message = `Hello LENS S WORLD! 👋\nI am interested in:\n\n*${product.name}*\nPrice: ₹${product.price.toLocaleString('en-IN')}\nSKU: ${product.sku || product.id}\nLink: ${window.location.origin}/#product/${product.id}\n\nPlease share more details and availability!`;
  return getWhatsAppUrl(message);
}

/**
 * Formats full structured bill & order summary for WhatsApp
 */
export function formatOrderForWhatsApp(order) {
  const itemsText = (order.items || []).map((item, idx) => {
    const colorInfo = item.selectedColor ? ` [${item.selectedColor}]` : "";
    const lensInfo = item.selectedLens ? `\n   ├ Lens: ${item.selectedLens.name} (+₹${item.selectedLens.price})` : " [Frame Only]";
    const powerInfo = item.readingPower ? `\n   ├ Reading Power: ${item.readingPower}` : "";
    
    let rxInfo = "";
    if (item.prescriptionData) {
      rxInfo = `\n   ├ Eye Power: Right(Sph ${item.prescriptionData.right?.sph}, Cyl ${item.prescriptionData.right?.cyl}) | Left(Sph ${item.prescriptionData.left?.sph}, Cyl ${item.prescriptionData.left?.cyl})`;
    } else if (item.prescriptionMethod === 'upload') {
      rxInfo = `\n   ├ Prescription: Uploaded Slip (${item.prescriptionFile?.name || 'Photo Attached'})`;
    } else if (item.prescriptionMethod === 'whatsapp') {
      rxInfo = `\n   ├ Prescription: Will Send Photo on WhatsApp`;
    } else if (item.prescriptionMethod === 'zeropower') {
      rxInfo = `\n   ├ Prescription: Zero Power (Computer Shield)`;
    }
    
    return `${idx + 1}. *${item.name}* x${item.qty} — ₹${((item.price + (item.selectedLens?.price || 0)) * item.qty).toLocaleString('en-IN')}${colorInfo}${lensInfo}${powerInfo}${rxInfo}`;
  }).join("\n\n");

  const lines = [
    `👓 *NEW ORDER — LENS S WORLD* 👓`,
    `━━━━━━━━━━━━━━━━━━━━`,
    `*Order ID:* #${order.id}`,
    `*Date:* ${new Date(order.createdAt).toLocaleString('en-IN')}`,
    `*Customer:* ${order.customer?.name || "Customer"}`,
    `*Phone:* ${order.customer?.phone || "-"}`,
    `*Email:* ${order.customer?.email || "-"}`,
    `*Address:* ${order.customer?.address || "-"}, ${order.customer?.city || "-"}, ${order.customer?.state || "-"} - ${order.customer?.pincode || "-"}`,
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
