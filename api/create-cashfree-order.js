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

  try {
    const { orderAmount, customerName, customerPhone, customerEmail, orderId } = req.body || {};

    if (!orderAmount || !customerPhone) {
      return res.status(400).json({ error: 'Missing required order amount or customer details' });
    }

    const appId = process.env.CASHFREE_APP_ID;
    const secretKey = process.env.CASHFREE_SECRET_KEY;
    const mode = process.env.CASHFREE_MODE || 'sandbox';

    if (!appId || !secretKey) {
      return res.status(500).json({ error: 'Cashfree credentials not configured on server' });
    }

    const cleanPhone = String(customerPhone).replace(/\D/g, '').slice(-10);
    const sanitizedOrderId = orderId || `LSW_${Date.now()}_${Math.floor(100 + Math.random() * 900)}`;
    const sanitizedCustomerId = `CUST_${cleanPhone || Date.now()}`;

    const baseUrl = mode === 'production' 
      ? 'https://api.cashfree.com/pg' 
      : 'https://sandbox.cashfree.com/pg';

    // Cashfree PG strictly requires return_url to be HTTPS
    let origin = process.env.APP_URL || req.headers.origin || req.headers.referer || 'https://lenssworld.com';
    origin = origin.replace(/\/+$/, '');
    if (!origin.startsWith('https://')) {
      origin = origin.replace(/^http:\/\//i, 'https://');
      if (!origin.startsWith('https://')) {
        origin = `https://${origin}`;
      }
    }

    const payload = {
      order_id: sanitizedOrderId,
      order_amount: Number(orderAmount),
      order_currency: 'INR',
      customer_details: {
        customer_id: sanitizedCustomerId,
        customer_name: (customerName || 'Customer').trim(),
        customer_email: (customerEmail && customerEmail.includes('@')) ? customerEmail.trim() : 'order@lenssworld.com',
        customer_phone: cleanPhone || '9999999999'
      },
      order_meta: {
        return_url: `${origin}/order-success?order_id=${sanitizedOrderId}&cf_id={order_id}`
      },
      order_note: `LenssWorld Eyewear Order ${sanitizedOrderId}`
    };

    const response = await fetch(`${baseUrl}/orders`, {
      method: 'POST',
      headers: {
        'x-client-id': appId,
        'x-client-secret': secretKey,
        'x-api-version': '2023-08-01',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Cashfree order creation failed:', data);
      return res.status(response.status).json({ 
        error: data.message || 'Failed to create Cashfree order', 
        details: data 
      });
    }

    return res.status(200).json({
      paymentSessionId: data.payment_session_id,
      orderId: data.order_id,
      cfOrderId: data.cf_order_id,
      orderAmount: data.order_amount,
      orderStatus: data.order_status
    });

  } catch (error) {
    console.error('Server error creating Cashfree order:', error);
    return res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
}
