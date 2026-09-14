export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'DELETE,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://yexvmawaefkhcxbwaaxb.supabase.co';
  const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_4Dekhuqa35f4JvkQ_QYRXw_5ZP-NjVd';

  try {
    const code = (req.query?.code || req.body?.code || req.query?.id || '').trim().toUpperCase();
    if (!code) {
      return res.status(400).json({ error: 'Coupon code is required' });
    }

    // 1. Delete from table
    try {
      await fetch(`${supabaseUrl}/rest/v1/coupons?code=eq.${encodeURIComponent(code)}`, {
        method: 'DELETE',
        headers: {
          'apikey': supabaseAnonKey,
          'Authorization': `Bearer ${supabaseAnonKey}`
        }
      });
    } catch {}

    // 2. Delete from site_config fallback
    try {
      const confRes = await fetch(`${supabaseUrl}/rest/v1/products?id=eq.site_config_coupons`, {
        headers: { 'apikey': supabaseAnonKey, 'Authorization': `Bearer ${supabaseAnonKey}` }
      });
      if (confRes.ok) {
        const rows = await confRes.json();
        if (rows?.[0]?.description) {
          const map = JSON.parse(rows[0].description);
          if (map[code]) {
            delete map[code];
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
                description: JSON.stringify(map),
                features: ['site-config'],
                in_stock: true
              })
            });
          }
        }
      }
    } catch {}

    return res.status(200).json({ success: true, message: `Coupon ${code} deleted` });
  } catch (error) {
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
}
