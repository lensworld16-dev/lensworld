export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,DELETE,OPTIONS');
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
    let id = req.query?.id;
    if (!id && req.body) {
      id = typeof req.body === 'string' ? JSON.parse(req.body).id : req.body.id;
    }

    if (!id) {
      return res.status(400).json({ error: 'Product ID is required for deletion' });
    }

    const response = await fetch(`${supabaseUrl}/rest/v1/products?id=eq.${encodeURIComponent(id)}`, {
      method: 'DELETE',
      headers: {
        'apikey': supabaseAnonKey,
        'Authorization': `Bearer ${supabaseAnonKey}`
      }
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('Supabase delete product error:', errText);
      return res.status(response.status).json({ error: 'Failed to delete product from database', details: errText });
    }

    return res.status(200).json({ success: true, message: `Product ${id} deleted successfully` });
  } catch (error) {
    console.error('Server error in delete-product:', error);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
}
