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
export function formatOrderForWhatsApp(order) {
  const itemsText = (order.items || []).map((item, idx) => {
    const lensInfo = item.selectedLens ? ` [Lens: ${item.selectedLens.name} (+₹${item.selectedLens.price})]` : " [Frame Only]";
    const powerInfo = item.readingPower ? ` [Power: ${item.readingPower}]` : "";
    const colorInfo = item.selectedColor ? ` [Color: ${item.selectedColor}]` : "";
    return `${idx + 1}. *${item.name}* x${item.qty} — ₹${((item.price + (item.selectedLens?.price || 0)) * item.qty).toLocaleString('en-IN')}${colorInfo}${lensInfo}${powerInfo}`;
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
