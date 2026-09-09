export default async function handler(req, res) {
  // CORS support
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://yexvmawaefkhcxbwaaxb.supabase.co';
  const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_4Dekhuqa35f4JvkQ_QYRXw_5ZP-NjVd';

  try {
    const order = req.body || {};
    if (!order.id) {
      return res.status(400).json({ error: 'Order ID is required' });
    }

    const itemsList = Array.isArray(order.items) ? order.items : [];
    const rxIt = itemsList.find(it => it.prescriptionMethod || it.prescriptionFile || it.prescriptionDetails || it.prescriptionData || it.readingPower);
    const resMethod = order.prescriptionMethod || rxIt?.prescriptionMethod || null;
    const resFile = order.prescriptionFile || rxIt?.prescriptionFile || null;
    const resDetails = order.prescriptionDetails || rxIt?.prescriptionDetails || rxIt?.prescriptionData || (rxIt?.readingPower ? { readingPower: rxIt.readingPower } : null);

    const payload = {
      id: order.id,
      status: order.status || (order.paymentStatus === 'Paid' ? 'Payment Confirmed' : (resFile || resDetails ? 'Prescription Verification' : 'Placed')),
      customer: order.customer || {},
      items: itemsList,
      subtotal: Number(order.subtotal || 0),
      discount: Number(order.discount || 0),
      coupon_applied: order.couponApplied || null,
      shipping: Number(order.shipping || 0),
      gst: Number(order.gst || 0),
      total: Number(order.total || order.grandTotal || 0),
      payment_method: order.paymentMethod || 'Cash on Delivery',
      payment_status: order.paymentStatus || (order.paymentMethod === 'Cash on Delivery' ? 'Pending' : 'Paid'),
      prescription_method: resMethod,
      prescription_file: resFile,
      prescription_details: resDetails,
      notes: order.notes || ''
    };

    const response = await fetch(`${supabaseUrl}/rest/v1/orders`, {
      method: 'POST',
      headers: {
        'apikey': supabaseAnonKey,
        'Authorization': `Bearer ${supabaseAnonKey}`,
        'Content-Type': 'application/json',
        'Prefer': 'resolution=merge-duplicates,return=representation'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errText = await response.text();
      console.warn('Supabase save-order response notice:', errText);
      return res.status(response.status).json({ error: 'Failed to save order in database', details: errText });
    }

    const data = await response.json();
    return res.status(200).json({ success: true, order: data?.[0] || payload });
  } catch (error) {
    console.error('Server error in save-order:', error);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
}
