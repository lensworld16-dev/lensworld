// EmailJS Integration for LENS S WORLD (Orders & Inquiries)

const EMAILJS_PUBLIC_KEY = 'wjj5-89cV_SUBugf_';
const EMAILJS_TEMPLATE_ID = 'template_pu3ckdf';
const EMAILJS_SERVICE_ID = 'service_31uyi8l';

/**
 * Send Contact / Inquiry Email
 */
export async function sendContactInquiryEmail(formData) {
  if (!window.emailjs || !EMAILJS_SERVICE_ID) return false;

  try {
    const params = {
      from_name: formData.name,
      from_phone: formData.phone,
      from_email: formData.email || 'Not provided',
      message: formData.message,
      store_name: 'LENS S WORLD'
    };

    const res = await window.emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, params, EMAILJS_PUBLIC_KEY);
    return res.status === 200;
  } catch (err) {
    console.error("Email send error:", err);
    return false;
  }
}

/**
 * Send New Order Email
 */
export async function sendOrderEmail(order) {
  if (!window.emailjs || !EMAILJS_SERVICE_ID) {
    console.warn("EmailJS not ready or Service ID missing");
    return false;
  }

  try {
    const itemsList = (order.items || [])
      .map(i => `${i.name}${i.selectedLens ? ` (${i.selectedLens.name})` : ''} - Qty: ${i.qty} - ₹${((i.price + (i.selectedLens?.price || 0)) * i.qty).toLocaleString('en-IN')}`)
      .join('\n');

    const ordersArray = (order.items || []).map(i => ({
      name: `${i.name}${i.selectedLens ? ` (${i.selectedLens.name})` : ''}`,
      units: i.qty,
      price: `${((i.price + (i.selectedLens?.price || 0)) * i.qty).toLocaleString('en-IN')}`
    }));

    const fullOrderSummary = `
👓 LENS S WORLD — Order #${order.id}
Customer: ${order.customer?.name || 'Customer'}
Phone: ${order.customer?.phone || 'N/A'}
Email: ${order.customer?.email || 'N/A'}
Address: ${order.customer?.address || ''}, ${order.customer?.city || ''} ${order.customer?.pincode || ''}

Items:
${itemsList}

Total: ₹${(order.total || 0).toLocaleString('en-IN')} (${order.paymentMethod || 'UPI'})
Date: ${new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
    `.trim();

    const params = {
      // Direct recipient variables
      to_email: order.customer?.email || '',
      email: order.customer?.email || '',
      user_email: order.customer?.email || '',
      customer_email: order.customer?.email || '',
      reply_to: 'lensworld16@gmail.com',
      from_name: 'LENS S WORLD',
      to_name: order.customer?.name || 'Customer',
      name: order.customer?.name || 'Customer',
      user_name: order.customer?.name || 'Customer',

      // Order specific variables
      order_id: order.id,
      orders: ordersArray,
      cost: {
        shipping: order.shipping === 0 ? 'FREE' : `${order.shipping}`,
        subtotal: `${(order.subtotal || order.total || 0).toLocaleString('en-IN')}`,
        total: `${(order.total || 0).toLocaleString('en-IN')}`
      },

      customer_phone: order.customer?.phone || '',
      delivery_address: `${order.customer?.address || ''}, ${order.customer?.city || ''} - ${order.customer?.pincode || ''}`,
      order_items: itemsList,
      order_total: `₹${(order.total || 0).toLocaleString('en-IN')}`,
      payment_method: order.paymentMethod || 'COD',
      message: fullOrderSummary
    };

    console.log("Sending order confirmation email via EmailJS with params:", params);
    const res = await window.emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, params, EMAILJS_PUBLIC_KEY);
    console.log("✓ EmailJS response:", res);
    return res.status === 200;
  } catch (err) {
    console.error("Order email sending failed:", err);
    return false;
  }
}
