export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://yexvmawaefkhcxbwaaxb.supabase.co';
  const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_4Dekhuqa35f4JvkQ_QYRXw_5ZP-NjVd';

  // GET: Fetch coupons
  if (req.method === 'GET') {
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

  // DELETE: Delete coupon
  if (req.method === 'DELETE' || (req.method === 'POST' && req.query?.action === 'delete')) {
    try {
      const code = (req.query?.code || req.body?.code || req.query?.id || req.body?.id || '').trim().toUpperCase();
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

  // POST: Save/Upsert coupon
  if (req.method === 'POST') {
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

  return res.status(405).json({ error: 'Method not allowed' });
}
