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

  // GET: Fetch products
  if (req.method === 'GET') {
    try {
      const response = await fetch(`${supabaseUrl}/rest/v1/products?category=not.in.(lens-package,site-config)&select=*&order=created_at.desc`, {
        method: 'GET',
        headers: {
          'apikey': supabaseAnonKey,
          'Authorization': `Bearer ${supabaseAnonKey}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errText = await response.text();
        console.error('Supabase fetch products error:', errText);
        return res.status(response.status).json({ error: 'Failed to fetch products', details: errText });
      }

      const products = await response.json();
      return res.status(200).json({ success: true, products });
    } catch (error) {
      console.error('Server error in get products:', error);
      return res.status(500).json({ error: error.message || 'Internal server error' });
    }
  }

  // DELETE: Delete product
  if (req.method === 'DELETE' || (req.method === 'POST' && req.query?.action === 'delete')) {
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
      console.error('Server error in delete product:', error);
      return res.status(500).json({ error: error.message || 'Internal server error' });
    }
  }

  // POST: Save/Upsert product
  if (req.method === 'POST') {
    try {
      const product = req.body || {};
      if (!product.id || !product.name) {
        return res.status(400).json({ error: 'Product ID and Name are required' });
      }

      const images = Array.isArray(product.gallery) && product.gallery.length > 0
        ? product.gallery
        : (Array.isArray(product.images) && product.images.length > 0
          ? product.images
          : [product.img || 'https://chashmah.com/wp-content/uploads/2026/08/1001073265_768x768.webp']);

      const payload = {
        id: String(product.id),
        name: String(product.name),
        category: String(product.category || product.type || 'eyeglasses'),
        gender: String(product.gender || 'unisex'),
        price: Number(product.price || 0),
        original_price: Number(product.mrp || product.original_price || Math.round((Number(product.price) || 0) * 1.6)),
        rating: Number(product.rating || 4.9),
        reviews_count: Number(product.reviews || product.reviews_count || 16),
        badge: product.badge || (product.isNew ? 'New' : (product.featured ? 'Bestseller' : null)),
        frame_shape: product.shape || product.frame_shape || 'Rectangle',
        frame_material: product.frame_material || 'Premium Optical Acetate',
        frame_size: product.size || product.frame_size || '50-20-142',
        lens_compatible: product.lensOptionsAvailable !== false && product.lens_compatible !== false,
        colors: Array.isArray(product.colors) && product.colors.length > 0 ? product.colors : [product.color || 'Black'],
        images: images,
        description: product.description || `${product.name} handcrafted with optical precision from LENS S WORLD.`,
        features: Array.isArray(product.features) && product.features.length > 0 
          ? product.features 
          : ["Ultra-Durable Frame", "Prescription Ready", "Premium Quality Finish"],
        sku: product.sku || `LSW-${Math.floor(100 + Math.random() * 900)}`,
        in_stock: product.inStock !== false && product.in_stock !== false,
        stock_quantity: Number(product.stock_quantity || 25)
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
        console.error('Supabase save product error:', errText);
        return res.status(response.status).json({ error: 'Failed to save product in database', details: errText });
      }

      const data = await response.json();
      return res.status(200).json({ success: true, product: data?.[0] || payload });
    } catch (error) {
      console.error('Server error in save product:', error);
      return res.status(500).json({ error: error.message || 'Internal server error' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
