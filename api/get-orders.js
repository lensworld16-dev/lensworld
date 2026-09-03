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

  const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://yexvmawaefkhcxbwaaxb.supabase.co';
  const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_4Dekhuqa35f4JvkQ_QYRXw_5ZP-NjVd';

  try {
    const response = await fetch(`${supabaseUrl}/rest/v1/orders?select=*&order=created_at.desc`, {
      method: 'GET',
      headers: {
        'apikey': supabaseAnonKey,
        'Authorization': `Bearer ${supabaseAnonKey}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('Supabase fetch orders error:', errText);
      return res.status(response.status).json({ error: 'Failed to fetch orders from database', details: errText });
    }

    const orders = await response.json();
    return res.status(200).json({ success: true, orders });
  } catch (error) {
    console.error('Server error in get-orders:', error);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
}
