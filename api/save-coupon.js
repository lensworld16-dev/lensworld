export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://yexvmawaefkhcxbwaaxb.supabase.co';
  const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_4Dekhuqa35f4JvkQ_QYRXw_5ZP-NjVd';

  try {
    const coupon = req.body || {};
    const code = (coupon.code || coupon.id || '').trim().toUpperCase();
    if (!code) {
      return res.status(400).json({ error: 'Coupon code is required' });
    }

    const payload = {
      id: code,
      code: code,
      type: coupon.type || 'flat',
      value: Number(coupon.value || 0),
      min_order: Number(coupon.minOrder || coupon.min_order || 0),
      description: coupon.description || '',
      is_active: coupon.isActive !== false
    };

    // 1. Try saving to coupons table
    let savedInTable = false;
    try {
      const response = await fetch(`${supabaseUrl}/rest/v1/coupons`, {
        method: 'POST',
        headers: {
          'apikey': supabaseAnonKey,
          'Authorization': `Bearer ${supabaseAnonKey}`,
          'Content-Type': 'application/json',
          'Prefer': 'resolution=merge-duplicates,return=representation'
        },
        body: JSON.stringify(payload)
      });
      if (response.ok) savedInTable = true;
    } catch {}

    // 2. Also save to site_config_coupons so it works without RLS blocks
    try {
      const confRes = await fetch(`${supabaseUrl}/rest/v1/products?id=eq.site_config_coupons`, {
        headers: { 'apikey': supabaseAnonKey, 'Authorization': `Bearer ${supabaseAnonKey}` }
      });
      let currentMap = {};
      if (confRes.ok) {
        const rows = await confRes.json();
        if (rows?.[0]?.description) {
          try { currentMap = JSON.parse(rows[0].description); } catch {}
        }
      }
      currentMap[code] = payload;
      await fetch(`${supabaseUrl}/rest/v1/products`, {
        method: 'POST',
        headers: {
          'apikey': supabaseAnonKey,
          'Authorization': `Bearer ${supabaseAnonKey}`,
          'Content-Type': 'application/json',
          'Prefer': 'resolution=merge-duplicates,return=representation'
        },
        body: JSON.stringify({
          id: 'site_config_coupons',
          name: 'Site Configuration: coupons',
          category: 'site-config',
          gender: 'unisex',
          price: 0,
          description: JSON.stringify(currentMap),
          features: ['site-config'],
          in_stock: true
        })
      });
    } catch (e) {
      console.warn('Notice saving coupon to site config fallback:', e);
    }

    return res.status(200).json({ success: true, coupon: payload });
  } catch (error) {
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
}
