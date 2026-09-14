export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://yexvmawaefkhcxbwaaxb.supabase.co';
  const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_4Dekhuqa35f4JvkQ_QYRXw_5ZP-NjVd';

  // GET: Fetch config
  if (req.method === 'GET') {
    try {
      const key = req.query?.key;
      const url = key 
        ? `${supabaseUrl}/rest/v1/products?id=eq.site_config_${encodeURIComponent(key)}`
        : `${supabaseUrl}/rest/v1/products?category=eq.site-config`;

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'apikey': supabaseAnonKey,
          'Authorization': `Bearer ${supabaseAnonKey}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errText = await response.text();
        console.error('Supabase get-site-config error:', errText);
        return res.status(response.status).json({ error: 'Failed to fetch config from Supabase', details: errText });
      }

      const rows = await response.json();
      if (key) {
        if (Array.isArray(rows) && rows.length > 0) {
          let parsed = null;
          try { parsed = JSON.parse(rows[0].description); } catch { parsed = rows[0].description; }
          return res.status(200).json({ success: true, key, data: parsed });
        }
        return res.status(200).json({ success: true, key, data: null });
      }

      // Return map of all configs
      const configs = {};
      (rows || []).forEach(r => {
        const configKey = r.id?.replace(/^site_config_/, '');
        if (configKey) {
          try { configs[configKey] = JSON.parse(r.description); } catch { configs[configKey] = r.description; }
        }
      });

      return res.status(200).json({ success: true, configs });
    } catch (error) {
      console.error('Server error in get-site-config:', error);
      return res.status(500).json({ error: error.message || 'Internal server error' });
    }
  }

  // POST: Save config
  if (req.method === 'POST') {
    try {
      const { key, data } = req.body || {};
      if (!key) {
        return res.status(400).json({ error: 'Config key is required' });
      }

      const payload = {
        id: `site_config_${key}`,
        name: `Site Configuration: ${key}`,
        category: 'site-config',
        gender: 'unisex',
        price: 0,
        description: typeof data === 'string' ? data : JSON.stringify(data),
        features: ['site-config'],
        in_stock: true
      };

      const response = await fetch(`${supabaseUrl}/rest/v1/products`, {
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
        console.error('Supabase save-site-config error:', errText);
        return res.status(response.status).json({ error: 'Failed to save config in Supabase', details: errText });
      }

      return res.status(200).json({ success: true, key, data });
    } catch (error) {
      console.error('Server error in save-site-config:', error);
      return res.status(500).json({ error: error.message || 'Internal server error' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
