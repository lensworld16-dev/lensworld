export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://yexvmawaefkhcxbwaaxb.supabase.co';
  const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_4Dekhuqa35f4JvkQ_QYRXw_5ZP-NjVd';

  try {
    const couponsMap = {};

    // 1. Try table
    try {
      const response = await fetch(`${supabaseUrl}/rest/v1/coupons?select=*&order=created_at.desc`, {
        headers: {
          'apikey': supabaseAnonKey,
          'Authorization': `Bearer ${supabaseAnonKey}`
        }
      });
      if (response.ok) {
        const rows = await response.json();
        (rows || []).forEach(c => {
          const code = (c.code || c.id || '').toUpperCase();
          if (code) {
            couponsMap[code] = {
              code: code,
              type: c.type || 'flat',
              value: Number(c.value || 0),
              minOrder: Number(c.min_order || 0),
              description: c.description || '',
              isActive: c.is_active !== false
            };
          }
        });
      }
    } catch {}

    // 2. Read from site_config fallback
    try {
      const confRes = await fetch(`${supabaseUrl}/rest/v1/products?id=eq.site_config_coupons`, {
        headers: { 'apikey': supabaseAnonKey, 'Authorization': `Bearer ${supabaseAnonKey}` }
      });
      if (confRes.ok) {
        const rows = await confRes.json();
        if (rows?.[0]?.description) {
          const parsed = JSON.parse(rows[0].description);
          Object.assign(couponsMap, parsed);
        }
      }
    } catch {}

    return res.status(200).json({ success: true, coupons: couponsMap });
  } catch (error) {
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
}
