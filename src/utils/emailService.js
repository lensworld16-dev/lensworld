import emailjs from '@emailjs/browser';

const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || 'wjj5-89cV_SUBugf_';
const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || '';
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || '';

/**
 * Send Contact Inquiry Email via EmailJS
 */
export async function sendContactEmail(formData) {
  if (!EMAILJS_PUBLIC_KEY || !EMAILJS_SERVICE_ID || !EMAILJS_TEMPLATE_ID) {
    console.warn("EmailJS Service ID or Template ID is not yet configured.");
    return false;
  }

  try {
    const templateParams = {
      from_name: formData.name,
      from_phone: formData.phone,
      from_email: formData.email || 'Not provided',
      message: formData.message,
      store_name: 'LENS S WORLD'
    };

    const response = await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      templateParams,
      EMAILJS_PUBLIC_KEY
    );

    return response.status === 200;
  } catch (error) {
    console.error("EmailJS Send Error:", error);
    return false;
  }
}

/**
 * Send New Order Notification Email via EmailJS
 */
export async function sendOrderNotificationEmail(order) {
  if (!EMAILJS_PUBLIC_KEY || !EMAILJS_SERVICE_ID || !EMAILJS_TEMPLATE_ID) {
    return false;
  }

  try {
    const itemsList = (order.items || [])
      .map(i => `${i.name} (Qty: ${i.qty}) - ₹${((i.price + (i.selectedLens?.price || 0)) * i.qty).toLocaleString('en-IN')}`)
      .join(', ');

    const templateParams = {
      order_id: order.id,
      customer_name: order.customer?.name || 'Customer',
      customer_phone: order.customer?.phone || '',
      customer_email: order.customer?.email || '',
      delivery_address: `${order.customer?.address || ''}, ${order.customer?.city || ''}, ${order.customer?.state || ''} - ${order.customer?.pincode || ''}`,
      order_items: itemsList,
      order_total: `₹${(order.total || 0).toLocaleString('en-IN')}`,
      payment_method: order.paymentMethod || 'COD'
    };

    await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      templateParams,
      EMAILJS_PUBLIC_KEY
    );
    return true;
  } catch (error) {
    console.error("EmailJS Order Email Error:", error);
    return false;
  }
}
