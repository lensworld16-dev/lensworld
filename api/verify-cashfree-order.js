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

  try {
    const orderId = req.query?.orderId || req.body?.orderId;

    if (!orderId) {
      return res.status(400).json({ error: 'Missing orderId parameter' });
    }

    const appId = process.env.CASHFREE_APP_ID;
    const secretKey = process.env.CASHFREE_SECRET_KEY;
    const mode = process.env.CASHFREE_MODE || 'sandbox';

    if (!appId || !secretKey) {
      return res.status(500).json({ error: 'Cashfree credentials not configured' });
    }

    const baseUrl = mode === 'production' 
      ? 'https://api.cashfree.com/pg' 
      : 'https://sandbox.cashfree.com/pg';

    const response = await fetch(`${baseUrl}/orders/${orderId}`, {
      method: 'GET',
      headers: {
        'x-client-id': appId,
        'x-client-secret': secretKey,
        'x-api-version': '2023-08-01',
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({ 
        error: data.message || 'Failed to verify Cashfree order',
        details: data 
      });
    }

    return res.status(200).json({
      orderId: data.order_id,
      cfOrderId: data.cf_order_id,
      orderStatus: data.order_status,
      orderAmount: data.order_amount,
      orderCurrency: data.order_currency,
      isPaid: data.order_status === 'PAID'
    });

  } catch (error) {
    console.error('Server error verifying Cashfree order:', error);
    return res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
}
