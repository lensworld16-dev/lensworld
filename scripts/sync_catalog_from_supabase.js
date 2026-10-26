import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

async function syncCatalog() {
  const url = 'https://yexvmawaefkhcxbwaaxb.supabase.co/rest/v1/products?category=not.in.(lens-package,site-config)&select=*&order=created_at.desc';
  const key = 'sb_publishable_4Dekhuqa35f4JvkQ_QYRXw_5ZP-NjVd';
  
  console.log('Fetching live catalog from Supabase...');
  const res = await fetch(url, {
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json'
    }
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch from Supabase: ${res.statusText}`);
  }

  const sbProds = await res.json();
  console.log(`Fetched ${sbProds.length} products from Supabase.`);

  const dataJsPath = path.join(rootDir, 'js', 'data.js');
  const dataJsContent = fs.readFileSync(dataJsPath, 'utf-8');

  const { INITIAL_PRODUCTS, getProductImgHash } = await import('../js/data.js');
  const initMap = new Map(INITIAL_PRODUCTS.map(p => [p.id, p]));

  // Build the unified list of products reflecting true Supabase state
  const syncedList = sbProds.map(p => {
    const orig = initMap.get(p.id) || {};
    const imgs = Array.isArray(p.images) && p.images.length > 0 
      ? p.images 
      : [p.img || orig.img || 'https://chashmah.com/wp-content/uploads/2026/08/1001073265_768x768.webp'];
    const primaryImg = imgs[0];
    const isFeat = Boolean(p.badge === 'Bestseller' || p.badge === 'Featured' || p.badge === 'Trending' || p.is_featured || p.featured || orig.featured);
    const cat = p.category || p.type || orig.type || 'eyeglasses';
    const gender = p.gender || orig.gender || 'unisex';

    const item = {
      ...orig,
      id: p.id,
      name: p.name,
      sku: p.sku || orig.sku || p.id,
      type: cat,
      category: cat,
      gender: gender,
      cats: gender === 'unisex' ? ['men', 'women', 'unisex', cat] : [gender, cat],
      price: Number(p.price || 0),
      mrp: Number(p.original_price || (orig.mrp && orig.price === p.price ? orig.mrp : Math.round(Number(p.price || 0) * 1.6))),
      rating: Number(p.rating || orig.rating || 4.9),
      reviews: Number(p.reviews_count || orig.reviews || 16),
      badge: p.badge || orig.badge || '',
      img: primaryImg,
      gallery: imgs,
      shape: p.frame_shape || orig.shape || 'Rectangle',
      size: p.frame_size || orig.size || '50-20-142',
      color: Array.isArray(p.colors) && p.colors.length > 0 ? p.colors[0] : (orig.color || 'Black'),
      colors: Array.isArray(p.colors) && p.colors.length > 0 ? p.colors : (orig.colors || ['Black']),
      lensOptionsAvailable: p.lens_compatible !== false && orig.lensOptionsAvailable !== false,
      prescriptionAvailable: p.lens_compatible !== false && orig.prescriptionAvailable !== false,
      frameOnlyAvailable: true,
      inStock: p.in_stock !== false,
      description: p.description || orig.description || `${p.name} handcrafted with optical precision from LENS S WORLD.`,
      features: Array.isArray(p.features) && p.features.length > 0 ? p.features : (orig.features || ["Ultra-Durable Frame", "Prescription Ready", "Premium Quality Finish"]),
      featured: isFeat,
      isFeatured: isFeat,
      bestSeller: isFeat,
      isNew: p.badge === 'New' || orig.isNew || false
    };

    item.imgHash = getProductImgHash ? (getProductImgHash(item) || orig.imgHash || primaryImg) : (orig.imgHash || primaryImg);
    return item;
  });

  // Replace INITIAL_PRODUCTS in js/data.js
  const startMarker = 'export const INITIAL_PRODUCTS = [';
  const endMarker = 'export const COUPONS = {';

  const startIdx = dataJsContent.indexOf(startMarker);
  const endIdx = dataJsContent.indexOf(endMarker, startIdx);

  if (startIdx === -1 || endIdx === -1) {
    throw new Error('Markers for INITIAL_PRODUCTS not found in js/data.js');
  }

  const formattedProducts = JSON.stringify(syncedList, null, 2);
  const newDataJsContent = dataJsContent.substring(0, startIdx) +
    `export const INITIAL_PRODUCTS = ${formattedProducts};\n\n` +
    dataJsContent.substring(endIdx);

  fs.writeFileSync(dataJsPath, newDataJsContent, 'utf-8');
  console.log(`✓ Successfully updated js/data.js with ${syncedList.length} products synced from Supabase.`);

  // Also update src/data/productsData.js if it exists
  const reactDataPath = path.join(rootDir, 'src', 'data', 'productsData.js');
  if (fs.existsSync(reactDataPath)) {
    const reactContent = fs.readFileSync(reactDataPath, 'utf-8');
    const rStartMarker = 'export const PRODUCTS_DATA = [';
    const rEndMarker = 'export const CATEGORIES = [';
    const rStartIdx = reactContent.indexOf(rStartMarker);
    const rEndIdx = reactContent.indexOf(rEndMarker, rStartIdx);
    if (rStartIdx !== -1 && rEndIdx !== -1) {
      const newReactContent = reactContent.substring(0, rStartIdx) +
        `export const PRODUCTS_DATA = ${formattedProducts};\n\n` +
        reactContent.substring(rEndIdx);
      fs.writeFileSync(reactDataPath, newReactContent, 'utf-8');
      console.log(`✓ Successfully updated src/data/productsData.js with ${syncedList.length} products.`);
    }
  }
}

syncCatalog().catch(err => {
  console.error('Error syncing catalog:', err);
  process.exit(1);
});
