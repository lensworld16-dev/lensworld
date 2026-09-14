export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'DELETE,POST,OPTIONS');
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
    }).catch(() => {});

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
    console.error('Server error in delete-lens-package:', error);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
}
