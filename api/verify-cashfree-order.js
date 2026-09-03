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

    const isPaid = data.order_status === 'PAID';
    let dbOrder = null;

    const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://yexvmawaefkhcxbwaaxb.supabase.co';
    const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_4Dekhuqa35f4JvkQ_QYRXw_5ZP-NjVd';

    try {
      if (isPaid) {
        // 1. Update status in Supabase
        await fetch(`${supabaseUrl}/rest/v1/orders?id=eq.${data.order_id}`, {
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

      // 2. Fetch latest order from Supabase
      const dbRes = await fetch(`${supabaseUrl}/rest/v1/orders?id=eq.${data.order_id}&select=*`, {
        method: 'GET',
        headers: {
          'apikey': supabaseAnonKey,
          'Authorization': `Bearer ${supabaseAnonKey}`,
          'Content-Type': 'application/json'
        }
      });

      if (dbRes.ok) {
        const list = await dbRes.json();
        dbOrder = list?.[0] || null;
      }

      // 3. If not in DB yet (e.g. older order or placed before sync), create record now!
      if (!dbOrder && isPaid) {
        const fallbackOrder = {
          id: data.order_id,
          status: 'Payment Confirmed',
          customer: {
            name: data.customer_details?.customer_name || 'Customer',
            phone: data.customer_details?.customer_phone || '',
            email: data.customer_details?.customer_email || ''
          },
          items: [],
          total: Number(data.order_amount || 0),
          subtotal: Number(data.order_amount || 0),
          payment_method: 'Cashfree Online',
          payment_status: 'Paid',
          notes: 'Recovered via Cashfree verification'
        };

        await fetch(`${supabaseUrl}/rest/v1/orders`, {
          method: 'POST',
          headers: {
            'apikey': supabaseAnonKey,
            'Authorization': `Bearer ${supabaseAnonKey}`,
            'Content-Type': 'application/json',
            'Prefer': 'resolution=merge-duplicates,return=representation'
          },
          body: JSON.stringify(fallbackOrder)
        });
        dbOrder = fallbackOrder;
      }

    } catch (dbErr) {
      console.warn('Supabase sync in verify-cashfree notice:', dbErr.message);
    }

    return res.status(200).json({
      orderId: data.order_id,
      cfOrderId: data.cf_order_id,
      orderStatus: data.order_status,
      orderAmount: data.order_amount,
      orderCurrency: data.order_currency,
      isPaid: isPaid,
      customer: data.customer_details,
      dbOrder: dbOrder
    });

  } catch (error) {
    console.error('Server error verifying Cashfree order:', error);
    return res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
}
