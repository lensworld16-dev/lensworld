export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,DELETE,OPTIONS');
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

  // GET: Fetch lens packages
  if (req.method === 'GET') {
    try {
      // 1. Try dedicated lens_packages table first
      let resPackages = await fetch(`${supabaseUrl}/rest/v1/lens_packages?select=*&order=created_at.asc`, {
        method: 'GET',
        headers: {
          'apikey': supabaseAnonKey,
          'Authorization': `Bearer ${supabaseAnonKey}`,
          'Content-Type': 'application/json'
        }
      });

      if (resPackages.ok) {
        const data = await resPackages.json();
        if (Array.isArray(data) && data.length > 0) {
          const packages = data.map(p => ({
            id: p.id,
            name: p.name,
            tagline: p.tagline || p.description || '',
            price: Number(p.price || 0),
            mrp: Number(p.mrp || p.original_price || Math.round((Number(p.price) || 0) * 1.8)),
            badge: p.badge || '',
            img: p.img || (Array.isArray(p.images) ? p.images[0] : '/images/anti_glare_arc_lens.jpg'),
            features: Array.isArray(p.features) ? p.features : [],
            description: p.description || p.tagline || ''
          }));
          return res.status(200).json({ success: true, packages });
        }
      }

      // 2. Fallback to products table with category = 'lens-package'
      const fallbackRes = await fetch(`${supabaseUrl}/rest/v1/products?category=eq.lens-package&order=created_at.asc`, {
        method: 'GET',
        headers: {
          'apikey': supabaseAnonKey,
          'Authorization': `Bearer ${supabaseAnonKey}`,
          'Content-Type': 'application/json'
        }
      });

      if (!fallbackRes.ok) {
        const errText = await fallbackRes.text();
        console.error('Supabase fetch lens packages error:', errText);
        return res.status(fallbackRes.status).json({ error: 'Failed to fetch lens packages', details: errText });
      }

      const fallbackData = await fallbackRes.json();
      const packages = (fallbackData || []).map(p => ({
        id: p.id,
        name: p.name,
        tagline: p.tagline || p.description || '',
        price: Number(p.price || 0),
        mrp: Number(p.original_price || p.mrp || Math.round((Number(p.price) || 0) * 1.8)),
        badge: p.badge || '',
        img: (Array.isArray(p.images) && p.images[0]) ? p.images[0] : (p.img || '/images/anti_glare_arc_lens.jpg'),
        features: Array.isArray(p.features) ? p.features : [],
        description: p.description || p.tagline || ''
      }));

      return res.status(200).json({ success: true, packages });
    } catch (error) {
      console.error('Server error in get lens packages:', error);
      return res.status(500).json({ error: error.message || 'Internal server error' });
    }
  }

  // DELETE: Delete lens package
  if (req.method === 'DELETE' || (req.method === 'POST' && req.query?.action === 'delete')) {
    try {
      const id = req.query?.id || req.body?.id;
      if (!id) {
        return res.status(400).json({ error: 'Package ID is required' });
      }

      // Try deleting from dedicated table
      await fetch(`${supabaseUrl}/rest/v1/lens_packages?id=eq.${encodeURIComponent(id)}`, {
        method: 'DELETE',
        headers: {
          'apikey': supabaseAnonKey,
          'Authorization': `Bearer ${supabaseAnonKey}`
        }
      });

      // Also delete from fallback products table
      const fallbackRes = await fetch(`${supabaseUrl}/rest/v1/products?id=eq.${encodeURIComponent(id)}&category=eq.lens-package`, {
        method: 'DELETE',
        headers: {
          'apikey': supabaseAnonKey,
          'Authorization': `Bearer ${supabaseAnonKey}`
        }
      });

      if (!fallbackRes.ok) {
        const errText = await fallbackRes.text();
        console.warn('Notice deleting lens package from fallback:', errText);
      }

      return res.status(200).json({ success: true, message: `Lens package ${id} deleted successfully` });
    } catch (error) {
      console.error('Server error in delete lens package:', error);
      return res.status(500).json({ error: error.message || 'Internal server error' });
    }
  }

  // POST: Save/Upsert lens package
  if (req.method === 'POST') {
    try {
      const pkg = req.body || {};
      if (!pkg.name) {
        return res.status(400).json({ error: 'Lens package name is required' });
      }

      const id = String(pkg.id || pkg.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''));
      const price = Number(pkg.price || 0);
      const mrp = Number(pkg.mrp || Math.round(price * 1.8));
      const tagline = String(pkg.tagline || pkg.description || '');
      const badge = String(pkg.badge || '');
      const img = pkg.img || '/images/anti_glare_arc_lens.jpg';

      // 1. Attempt save to dedicated lens_packages table
      const dedicatedPayload = {
        id,
        name: pkg.name,
        tagline,
        price,
        mrp,
        badge,
        img,
        description: pkg.description || tagline,
        features: Array.isArray(pkg.features) ? pkg.features : [tagline]
      };

      let dedicatedRes = await fetch(`${supabaseUrl}/rest/v1/lens_packages`, {
        method: 'POST',
        headers: {
          'apikey': supabaseAnonKey,
          'Authorization': `Bearer ${supabaseAnonKey}`,
          'Content-Type': 'application/json',
          'Prefer': 'resolution=merge-duplicates,return=representation'
        },
        body: JSON.stringify(dedicatedPayload)
      });

      if (dedicatedRes.ok) {
        const data = await dedicatedRes.json();
        return res.status(200).json({ success: true, package: data?.[0] || dedicatedPayload });
      }

      // 2. Fallback to products table with category = 'lens-package'
      const fallbackPayload = {
        id,
        name: pkg.name,
        category: 'lens-package',
        gender: 'unisex',
        price,
        original_price: mrp,
        badge: badge || null,
        description: tagline,
        features: Array.isArray(pkg.features) ? pkg.features : [tagline],
        images: [img],
        lens_compatible: true,
        in_stock: true,
        stock_quantity: 99
      };

      const fallbackRes = await fetch(`${supabaseUrl}/rest/v1/products`, {
        method: 'POST',
        headers: {
          'apikey': supabaseAnonKey,
          'Authorization': `Bearer ${supabaseAnonKey}`,
          'Content-Type': 'application/json',
          'Prefer': 'resolution=merge-duplicates,return=representation'
        },
        body: JSON.stringify(fallbackPayload)
      });

      if (!fallbackRes.ok) {
        const errText = await fallbackRes.text();
        console.error('Supabase save lens package fallback error:', errText);
        return res.status(fallbackRes.status).json({ error: 'Failed to save lens package in database', details: errText });
      }

      return res.status(200).json({
        success: true,
        package: {
          id,
          name: pkg.name,
          tagline,
          price,
          mrp,
          badge,
          img
        }
      });
    } catch (error) {
      console.error('Server error in save lens package:', error);
      return res.status(500).json({ error: error.message || 'Internal server error' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
