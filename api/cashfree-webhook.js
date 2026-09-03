export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://yexvmawaefkhcxbwaaxb.supabase.co';
  const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_4Dekhuqa35f4JvkQ_QYRXw_5ZP-NjVd';

  try {
    const event = req.body || {};
    console.log('Received Cashfree webhook event:', event.type || event.event);

    const orderData = event.data?.order || event.order || {};
    const paymentData = event.data?.payment || event.payment || {};
    const orderId = orderData.order_id || event.order_id;
    const paymentStatus = paymentData.payment_status || orderData.order_status || event.txStatus;

    if (orderId && (paymentStatus === 'SUCCESS' || paymentStatus === 'PAID')) {
      console.log(`Cashfree webhook: Updating order #${orderId} to PAID in Supabase`);

      await fetch(`${supabaseUrl}/rest/v1/orders?id=eq.${orderId}`, {
        method: 'PATCH',
        headers: {
          'apikey': supabaseAnonKey,
          'Authorization': `Bearer ${supabaseAnonKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          status: 'Payment Confirmed',
          payment_status: 'Paid'
        })
      });
    }

    return res.status(200).json({ received: true });
  } catch (error) {
    console.error('Error handling Cashfree webhook:', error);
    return res.status(500).json({ error: error.message });
  }
}
