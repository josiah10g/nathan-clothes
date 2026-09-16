-- Nathan's Clothes: Full E-Commerce Migration with Bank Transfer & Order Tracking
-- 1. App Roles & Enums
DO $$ BEGIN
  CREATE TYPE public.app_role AS ENUM ('admin', 'user');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- 2. User Roles Table
CREATE TABLE IF NOT EXISTS public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role public.app_role NOT NULL DEFAULT 'user',
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security helper
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role
  );
$$;

-- First admin claim bootstrap
CREATE OR REPLACE FUNCTION public.claim_first_admin()
RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  admin_count integer;
  current_user_id uuid := auth.uid();
BEGIN
  IF current_user_id IS NULL THEN
    RETURN false;
  END IF;
  SELECT count(*) INTO admin_count FROM public.user_roles WHERE role = 'admin';
  IF admin_count > 0 THEN
    RETURN false;
  END IF;
  INSERT INTO public.user_roles (user_id, role) VALUES (current_user_id, 'admin');
  RETURN true;
END;
$$;

CREATE OR REPLACE FUNCTION public.admin_exists()
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE role = 'admin');
$$;

-- Grant admin by email RPC (callable only by existing admins)
CREATE OR REPLACE FUNCTION public.grant_admin_by_email(_email text)
RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  target_user_id uuid;
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;
  SELECT id INTO target_user_id FROM auth.users WHERE email = _email LIMIT 1;
  IF target_user_id IS NULL THEN
    RAISE EXCEPTION 'User not found';
  END IF;
  INSERT INTO public.user_roles (user_id, role)
  VALUES (target_user_id, 'admin')
  ON CONFLICT (user_id, role) DO NOTHING;
  RETURN true;
END;
$$;

GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;

DROP POLICY IF EXISTS "read own roles" ON public.user_roles;
CREATE POLICY "read own roles" ON public.user_roles
  FOR SELECT TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

-- 3. Products Table
CREATE TABLE IF NOT EXISTS public.products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  brand text NOT NULL DEFAULT 'Nathan Clothes',
  category text NOT NULL,
  description text NOT NULL DEFAULT '',
  specifications text NOT NULL DEFAULT '',
  price numeric(12,2) NOT NULL DEFAULT 0.00,
  price_cents integer NOT NULL DEFAULT 0,
  image_url text NOT NULL DEFAULT '',
  colorway text NOT NULL DEFAULT 'Black',
  sizes text[] NOT NULL DEFAULT ARRAY['S','M','L','XL','XXL'],
  in_stock boolean NOT NULL DEFAULT true,
  stock integer NOT NULL DEFAULT 25,
  featured boolean NOT NULL DEFAULT false,
  active boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Ensure newly required columns exist if products table was created earlier
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS brand text NOT NULL DEFAULT 'Nathan Clothes';
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS specifications text NOT NULL DEFAULT '';
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS price numeric(12,2) NOT NULL DEFAULT 0.00;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS in_stock boolean NOT NULL DEFAULT true;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS sort_order integer NOT NULL DEFAULT 0;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT now();

-- Backfill price from price_cents if needed
UPDATE public.products SET price = round((price_cents::numeric / 100.0), 2) WHERE price = 0.00 AND price_cents > 0;
UPDATE public.products SET price_cents = round(price * 100) WHERE price_cents = 0 AND price > 0;

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
GRANT SELECT ON public.products TO anon, authenticated;
GRANT ALL ON public.products TO authenticated, service_role;

DROP POLICY IF EXISTS "Anyone can view products" ON public.products;
DROP POLICY IF EXISTS "public read active products" ON public.products;
CREATE POLICY "Anyone can view products" ON public.products
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins manage products" ON public.products;
DROP POLICY IF EXISTS "admins manage products" ON public.products;
CREATE POLICY "Admins manage products" ON public.products
  FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- 4. Store Settings Table (single row)
CREATE TABLE IF NOT EXISTS public.store_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  bank_name text NOT NULL DEFAULT 'Standard Chartered Bank',
  account_name text NOT NULL DEFAULT 'Nathan Clothes Limited',
  account_number text NOT NULL DEFAULT '0123456789',
  payment_instructions text NOT NULL DEFAULT 'Please transfer the exact total to the account above. Use your order reference as the transaction narration and upload the payment receipt below.',
  contact_phone text NOT NULL DEFAULT '+1 (555) 019-2834',
  whatsapp_number text NOT NULL DEFAULT '15550192834',
  contact_email text NOT NULL DEFAULT 'support@nathanclothes.com',
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.store_settings ENABLE ROW LEVEL SECURITY;
GRANT SELECT ON public.store_settings TO anon, authenticated;
GRANT ALL ON public.store_settings TO authenticated, service_role;

DROP POLICY IF EXISTS "Anyone can view store settings" ON public.store_settings;
CREATE POLICY "Anyone can view store settings" ON public.store_settings
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins manage store settings" ON public.store_settings;
CREATE POLICY "Admins manage store settings" ON public.store_settings
  FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Seed single row if missing
INSERT INTO public.store_settings (id)
VALUES ('00000000-0000-0000-0000-000000000001')
ON CONFLICT (id) DO NOTHING;

-- 5. Orders Table
CREATE TABLE IF NOT EXISTS public.orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reference text UNIQUE,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  customer_name text NOT NULL DEFAULT '',
  full_name text NOT NULL DEFAULT '',
  phone text NOT NULL DEFAULT '',
  email text NOT NULL DEFAULT '',
  address text NOT NULL DEFAULT '',
  city text NOT NULL DEFAULT '',
  postal_code text NOT NULL DEFAULT '',
  country text NOT NULL DEFAULT '',
  notes text DEFAULT '',
  items jsonb NOT NULL DEFAULT '[]'::jsonb,
  total numeric(12,2) NOT NULL DEFAULT 0.00,
  total_cents integer NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'pending',
  payment_status text NOT NULL DEFAULT 'pending',
  receipt_path text DEFAULT '',
  receipt_uploaded_at timestamptz,
  admin_note text DEFAULT '',
  reviewed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Ensure all columns exist
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS reference text UNIQUE;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS customer_name text NOT NULL DEFAULT '';
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS notes text DEFAULT '';
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS items jsonb NOT NULL DEFAULT '[]'::jsonb;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS total numeric(12,2) NOT NULL DEFAULT 0.00;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS payment_status text NOT NULL DEFAULT 'pending';
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS receipt_path text DEFAULT '';
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS receipt_uploaded_at timestamptz;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS admin_note text DEFAULT '';
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS reviewed_at timestamptz;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT now();
ALTER TABLE public.orders ALTER COLUMN user_id DROP NOT NULL;

-- Backfill reference for existing orders if empty
UPDATE public.orders
SET reference = 'CK-' || upper(substring(replace(id::text, '-', ''), 1, 8))
WHERE reference IS NULL;

-- Synchronize total and total_cents
UPDATE public.orders SET total = round((total_cents::numeric / 100.0), 2) WHERE total = 0.00 AND total_cents > 0;
UPDATE public.orders SET total_cents = round(total * 100) WHERE total_cents = 0 AND total > 0;
UPDATE public.orders SET customer_name = full_name WHERE customer_name = '' AND full_name <> '';
UPDATE public.orders SET full_name = customer_name WHERE full_name = '' AND customer_name <> '';

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.orders TO anon, authenticated;
GRANT ALL ON public.orders TO service_role;

DROP POLICY IF EXISTS "Anyone can create orders" ON public.orders;
DROP POLICY IF EXISTS "create own orders" ON public.orders;
CREATE POLICY "Anyone can create orders" ON public.orders
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Users view own orders" ON public.orders;
DROP POLICY IF EXISTS "read own orders" ON public.orders;
CREATE POLICY "Users view own orders" ON public.orders
  FOR SELECT TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins manage orders" ON public.orders;
DROP POLICY IF EXISTS "admins update orders" ON public.orders;
CREATE POLICY "Admins manage orders" ON public.orders
  FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- 6. Storage Buckets (product-images & payment-receipts)
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

INSERT INTO storage.buckets (id, name, public)
VALUES ('payment-receipts', 'payment-receipts', false)
ON CONFLICT (id) DO UPDATE SET public = false;

-- Storage policies:
DROP POLICY IF EXISTS "Public read product images" ON storage.objects;
CREATE POLICY "Public read product images" ON storage.objects
  FOR SELECT USING (bucket_id = 'product-images');

DROP POLICY IF EXISTS "Admins upload product images" ON storage.objects;
CREATE POLICY "Admins upload product images" ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (bucket_id = 'product-images' AND public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins delete product images" ON storage.objects;
CREATE POLICY "Admins delete product images" ON storage.objects
  FOR DELETE TO authenticated USING (bucket_id = 'product-images' AND public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Anyone can upload payment receipts" ON storage.objects;
CREATE POLICY "Anyone can upload payment receipts" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'payment-receipts');

DROP POLICY IF EXISTS "Admins and owners read receipts" ON storage.objects;
CREATE POLICY "Admins and owners read receipts" ON storage.objects
  FOR SELECT TO authenticated USING (
    bucket_id = 'payment-receipts' AND (
      public.has_role(auth.uid(), 'admin') OR
      auth.uid()::text = (storage.foldername(name))[1]
    )
  );

-- 7. RPCs: Guest Order Tracking & Receipt Upload
CREATE OR REPLACE FUNCTION public.track_order(_reference text, _phone text)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  result jsonb;
BEGIN
  SELECT to_jsonb(o) INTO result
  FROM public.orders o
  WHERE lower(trim(o.reference)) = lower(trim(_reference))
    AND regexp_replace(o.phone, '[^0-9]', '', 'g') = regexp_replace(_phone, '[^0-9]', '', 'g')
  LIMIT 1;

  IF result IS NULL THEN
    RETURN jsonb_build_object('error', 'Order not found with provided reference and phone number');
  END IF;

  RETURN result;
END;
$$;
GRANT EXECUTE ON FUNCTION public.track_order(text, text) TO anon, authenticated;

CREATE OR REPLACE FUNCTION public.attach_receipt(_reference text, _phone text, _path text)
RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  matched_id uuid;
BEGIN
  SELECT id INTO matched_id
  FROM public.orders
  WHERE lower(trim(reference)) = lower(trim(_reference))
    AND regexp_replace(phone, '[^0-9]', '', 'g') = regexp_replace(_phone, '[^0-9]', '', 'g')
  LIMIT 1;

  IF matched_id IS NULL THEN
    RETURN false;
  END IF;

  UPDATE public.orders
  SET receipt_path = _path,
      receipt_uploaded_at = now(),
      payment_status = 'pending',
      updated_at = now()
  WHERE id = matched_id;

  RETURN true;
END;
$$;
GRANT EXECUTE ON FUNCTION public.attach_receipt(text, text, text) TO anon, authenticated;

-- Default sample products if none exist
INSERT INTO public.products (slug, name, brand, category, description, specifications, price, price_cents, image_url, colorway, sizes, stock, in_stock, featured, active, sort_order)
VALUES
('shadow-web-hoodie', 'Shadow Web Hoodie', 'Nathan Clothes', 'hoodies', 'Heavyweight 400 GSM oversized hoodie in deep black with a hand-drawn spiderweb print across the chest. Boxy fit, double-stitched seams, custom drawstrings.', '100% Combed Cotton, 400 GSM French Terry, Machine wash cold, dry flat.', 129.00, 12900, '/images/shadow-web-hoodie.jpg', 'Black', ARRAY['S','M','L','XL','XXL'], 30, true, true, true, 1),
('eclipse-hoodie', 'Eclipse Hoodie', 'Nathan Clothes', 'hoodies', 'Cream heavyweight hoodie with an embroidered compass star. Soft brushed interior, dropped shoulders, 100% cotton.', '100% Brushed Cotton, 380 GSM, Double-lined hood, Ribbed cuffs and hem.', 129.00, 12900, '/images/eclipse-hoodie.jpg', 'Cream', ARRAY['S','M','L','XL'], 24, true, true, true, 2),
('void-flame-joggers', 'Void Flame Joggers', 'Nathan Clothes', 'bottoms', 'Tapered black joggers with a smoke-grey flame print running the leg. Elastic cuffs, deep side pockets, 350 GSM fleece.', '100% Cotton Fleece, 350 GSM, Deep zip pockets, Custom flat drawstrings.', 99.00, 9900, '/images/void-flame-pants.jpg', 'Black', ARRAY['S','M','L','XL'], 20, true, true, true, 3),
('starfall-tee', 'Starfall Tee', 'Nathan Clothes', 'tees', 'Midnight black oversized tee with a fine-line starburst mark. 100% combed cotton, garment washed for a broken-in feel.', '100% Combed Cotton, 260 GSM, Reinforced collar, Pre-shrunk.', 54.00, 5400, '/images/starfall-tee.jpg', 'Black', ARRAY['S','M','L','XL','XXL'], 40, true, true, true, 4),
('web-realm-tee', 'Web Realm Tee', 'Nathan Clothes', 'tees', 'Acid-washed grey tee with a full spiderweb back print. Vintage hand-feel, boxy oversized cut.', '100% Vintage Acid Wash Cotton, 240 GSM, Boxy cut, Screen printed back.', 59.00, 5900, '/images/web-realm-tee.jpg', 'Washed Grey', ARRAY['S','M','L','XL'], 26, true, false, true, 5),
('dark-crown-tee', 'Dark Crown Tee', 'Nathan Clothes', 'tees', 'Rich brown heavyweight tee with a cream crown graphic. Ribbed collar, oversized fit, 240 GSM.', '100% Heavyweight Cotton, 240 GSM, Soft hand-feel water-based print.', 59.00, 5900, '/images/dark-crown-tee.jpg', 'Brown', ARRAY['S','M','L','XL'], 18, true, false, true, 6)
ON CONFLICT (slug) DO UPDATE SET
  brand = EXCLUDED.brand,
  specifications = EXCLUDED.specifications,
  price = EXCLUDED.price,
  image_url = EXCLUDED.image_url,
  in_stock = EXCLUDED.in_stock,
  sort_order = EXCLUDED.sort_order;
