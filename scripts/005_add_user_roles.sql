-- Add user roles system
-- Create user_roles table
CREATE TABLE IF NOT EXISTS public.user_roles (
  user_id SERIAL PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'distributor', 'citizen')),
  full_name TEXT NOT NULL,
  email TEXT,
  mobile TEXT,
  aadhaar_number TEXT,
  shop_id INTEGER REFERENCES public.shops(shop_id) ON DELETE SET NULL, -- For distributors
  family_id INTEGER REFERENCES public.families(family_id) ON DELETE SET NULL, -- For citizens
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create admin users table (for system administrators)
CREATE TABLE IF NOT EXISTS public.admin_users (
  admin_id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES public.user_roles(user_id) ON DELETE CASCADE,
  department TEXT,
  permissions JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create distributor users table (for shopkeepers/distributors)
CREATE TABLE IF NOT EXISTS public.distributor_users (
  distributor_id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES public.user_roles(user_id) ON DELETE CASCADE,
  shop_id INTEGER NOT NULL REFERENCES public.shops(shop_id) ON DELETE CASCADE,
  license_number TEXT,
  commission_rate DECIMAL(5,2) DEFAULT 0.00,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create citizen users table (for ration card holders)
CREATE TABLE IF NOT EXISTS public.citizen_users (
  citizen_id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES public.user_roles(user_id) ON DELETE CASCADE,
  family_id INTEGER NOT NULL REFERENCES public.families(family_id) ON DELETE CASCADE,
  member_id INTEGER REFERENCES public.family_members(member_id) ON DELETE SET NULL,
  is_head_of_family BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for user roles
CREATE INDEX IF NOT EXISTS idx_user_roles_username ON public.user_roles(username);
CREATE INDEX IF NOT EXISTS idx_user_roles_role ON public.user_roles(role);
CREATE INDEX IF NOT EXISTS idx_user_roles_mobile ON public.user_roles(mobile);
CREATE INDEX IF NOT EXISTS idx_user_roles_aadhaar ON public.user_roles(aadhaar_number);

-- Enable RLS for user roles tables
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.distributor_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.citizen_users ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user roles
CREATE POLICY "Allow public read user_roles" ON public.user_roles FOR SELECT USING (true);
CREATE POLICY "Allow public insert user_roles" ON public.user_roles FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update user_roles" ON public.user_roles FOR UPDATE USING (true);

CREATE POLICY "Allow public read admin_users" ON public.admin_users FOR SELECT USING (true);
CREATE POLICY "Allow public insert admin_users" ON public.admin_users FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public read distributor_users" ON public.distributor_users FOR SELECT USING (true);
CREATE POLICY "Allow public insert distributor_users" ON public.distributor_users FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public read citizen_users" ON public.citizen_users FOR SELECT USING (true);
CREATE POLICY "Allow public insert citizen_users" ON public.citizen_users FOR INSERT WITH CHECK (true);
