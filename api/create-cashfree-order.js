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
    const { 
      orderAmount, 
      customerName, 
      customerPhone, 
      customerEmail, 
      orderId,
      customer,
      items,
      subtotal,
      discount,
      couponApplied,
      shipping,
      gst,
      paymentMethod,
      prescriptionMethod,
      prescriptionFile,
      prescriptionDetails,
      notes
    } = req.body || {};

    if (!orderAmount || (!customerPhone && !customer?.phone)) {
      return res.status(400).json({ error: 'Missing required order amount or customer details' });
    }

    const effectivePhone = customerPhone || customer?.phone;
    const effectiveName = customerName || customer?.name || 'Customer';
    const effectiveEmail = customerEmail || customer?.email || 'order@lenssworld.com';

    const appId = process.env.CASHFREE_APP_ID;
    const secretKey = process.env.CASHFREE_SECRET_KEY;
    const mode = process.env.CASHFREE_MODE || 'sandbox';

    if (!appId || !secretKey) {
      return res.status(500).json({ error: 'Cashfree credentials not configured on server' });
    }

    const cleanPhone = String(effectivePhone).replace(/\D/g, '').slice(-10);
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

    const customerObj = customer || {
      name: effectiveName,
      phone: cleanPhone,
      email: effectiveEmail,
      address: req.body?.address || '',
      city: req.body?.city || '',
      pincode: req.body?.pincode || ''
    };

    // 1. Pre-save full order with delivery address to Supabase BEFORE payment
    const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://yexvmawaefkhcxbwaaxb.supabase.co';
    const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_4Dekhuqa35f4JvkQ_QYRXw_5ZP-NjVd';

    try {
      await fetch(`${supabaseUrl}/rest/v1/orders`, {
        method: 'POST',
        headers: {
          'apikey': supabaseAnonKey,
          'Authorization': `Bearer ${supabaseAnonKey}`,
          'Content-Type': 'application/json',
          'Prefer': 'resolution=merge-duplicates,return=minimal'
        },
        body: JSON.stringify({
          id: sanitizedOrderId,
          status: 'Payment Pending',
          customer: customerObj,
          items: items || [],
          subtotal: Number(subtotal || orderAmount),
          discount: Number(discount || 0),
          coupon_applied: couponApplied || null,
          shipping: Number(shipping || 0),
          gst: Number(gst || 0),
          total: Number(orderAmount),
          payment_method: paymentMethod || 'Cashfree Online',
          payment_status: 'Pending',
          prescription_method: prescriptionMethod || null,
          prescription_file: prescriptionFile || null,
          prescription_details: prescriptionDetails || null,
          notes: notes || `Cashfree Order ${sanitizedOrderId}`
        })
      });
      console.log(`✓ Pre-saved pending order #${sanitizedOrderId} with full address to Supabase`);
    } catch (dbErr) {
      console.warn('Supabase pre-save notice:', dbErr.message);
    }

    // 2. Create Cashfree Order
    const payload = {
      order_id: sanitizedOrderId,
      order_amount: Number(orderAmount),
      order_currency: 'INR',
      customer_details: {
        customer_id: sanitizedCustomerId,
        customer_name: effectiveName.trim(),
        customer_email: (effectiveEmail && effectiveEmail.includes('@')) ? effectiveEmail.trim() : 'order@lenssworld.com',
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
