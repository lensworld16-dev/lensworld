export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
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
    console.error('Server error in get-lens-packages:', error);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
}
