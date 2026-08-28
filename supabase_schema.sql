-- ========================================================
-- LENS S WORLD - SUPABASE DATABASE SCHEMA
-- Run this complete SQL script in your Supabase SQL Editor:
-- Supabase Dashboard -> SQL Editor -> New Query -> Paste & Run
-- ========================================================

-- 1. ORDERS TABLE
CREATE TABLE IF NOT EXISTS public.orders (
    id TEXT PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    status TEXT DEFAULT 'New Order',
    customer JSONB NOT NULL DEFAULT '{}'::jsonb,
    items JSONB NOT NULL DEFAULT '[]'::jsonb,
    subtotal NUMERIC NOT NULL DEFAULT 0,
    discount NUMERIC DEFAULT 0,
    coupon_applied TEXT,
    shipping NUMERIC DEFAULT 0,
    gst NUMERIC DEFAULT 0,
    total NUMERIC NOT NULL DEFAULT 0,
    payment_method TEXT DEFAULT 'COD',
    payment_status TEXT DEFAULT 'Pending',
    prescription_method TEXT,
    prescription_file JSONB,
    prescription_details JSONB,
    notes TEXT
);

-- 2. PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS public.products (
    id TEXT PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    gender TEXT DEFAULT 'unisex',
    price NUMERIC NOT NULL DEFAULT 0,
    original_price NUMERIC,
    rating NUMERIC DEFAULT 4.8,
    reviews_count INT DEFAULT 0,
    badge TEXT,
    frame_shape TEXT,
    frame_material TEXT,
    frame_size TEXT,
    lens_compatible BOOLEAN DEFAULT true,
    colors JSONB DEFAULT '[]'::jsonb,
    images JSONB DEFAULT '[]'::jsonb,
    description TEXT,
    features JSONB DEFAULT '[]'::jsonb,
    sku TEXT,
    in_stock BOOLEAN DEFAULT true,
    stock_quantity INT DEFAULT 20
);

-- 3. CONTACT INQUIRIES TABLE
CREATE TABLE IF NOT EXISTS public.inquiries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    message TEXT NOT NULL,
    status TEXT DEFAULT 'New'
);

-- 4. COUPONS TABLE
CREATE TABLE IF NOT EXISTS public.coupons (
    id TEXT PRIMARY KEY,
    code TEXT UNIQUE NOT NULL,
    type TEXT NOT NULL, -- 'percent' or 'flat'
    value NUMERIC NOT NULL,
    min_order NUMERIC DEFAULT 0,
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================================================
-- ENABLE ROW LEVEL SECURITY (RLS) & POLICIES
-- ========================================================

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;

-- Orders Policies: Anyone can create an order and read orders
DROP POLICY IF EXISTS "Public can insert orders" ON public.orders;
CREATE POLICY "Public can insert orders" ON public.orders FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Public can view orders" ON public.orders;
CREATE POLICY "Public can view orders" ON public.orders FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can update orders" ON public.orders;
CREATE POLICY "Public can update orders" ON public.orders FOR UPDATE USING (true);

-- Products Policies: Anyone can view, manage products
DROP POLICY IF EXISTS "Public can view products" ON public.products;
CREATE POLICY "Public can view products" ON public.products FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can insert products" ON public.products;
CREATE POLICY "Public can insert products" ON public.products FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Public can update products" ON public.products;
CREATE POLICY "Public can update products" ON public.products FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Public can delete products" ON public.products;
CREATE POLICY "Public can delete products" ON public.products FOR DELETE USING (true);

-- Inquiries Policies
DROP POLICY IF EXISTS "Public can insert inquiries" ON public.inquiries;
CREATE POLICY "Public can insert inquiries" ON public.inquiries FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Public can view inquiries" ON public.inquiries;
CREATE POLICY "Public can view inquiries" ON public.inquiries FOR SELECT USING (true);

-- Coupons Policies
DROP POLICY IF EXISTS "Public can view coupons" ON public.coupons;
CREATE POLICY "Public can view coupons" ON public.coupons FOR SELECT USING (true);

-- ========================================================
-- INSERT DEFAULT COUPONS
-- ========================================================
INSERT INTO public.coupons (id, code, type, value, min_order, description, is_active)
VALUES 
    ('FLAT200', 'FLAT200', 'flat', 200, 1499, 'Flat ₹200 off on orders above ₹1,499', true),
    ('LENS10', 'LENS10', 'percent', 10, 999, '10% instant discount on orders above ₹999', true),
    ('FREESHIP', 'FREESHIP', 'flat', 99, 0, 'Free Express Shipping Across India', true),
    ('SUMMER50', 'SUMMER50', 'percent', 50, 2499, '50% off on premium frames (Min ₹2,499)', true)
ON CONFLICT (id) DO NOTHING;
