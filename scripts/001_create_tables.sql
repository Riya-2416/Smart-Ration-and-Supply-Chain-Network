-- Create families table
CREATE TABLE IF NOT EXISTS public.families (
  family_id INTEGER PRIMARY KEY,
  head_name TEXT NOT NULL,
  head_age INTEGER,
  head_gender TEXT,
  head_mobile TEXT NOT NULL,
  head_aadhaar_number TEXT NOT NULL UNIQUE,
  ration_card_number TEXT NOT NULL UNIQUE,
  ration_card_type TEXT NOT NULL CHECK (ration_card_type IN ('white', 'yellow', 'orange', 'pink', 'AAY', 'BPL', 'APL')),
  address TEXT NOT NULL,
  family_members_count INTEGER NOT NULL DEFAULT 1,
  village TEXT DEFAULT 'Vashivali',
  taluka TEXT DEFAULT 'Khalapur',
  district TEXT DEFAULT 'Raigad',
  pincode TEXT DEFAULT '410220',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create family_members table
CREATE TABLE IF NOT EXISTS public.family_members (
  member_id INTEGER PRIMARY KEY,
  family_id INTEGER NOT NULL REFERENCES public.families(family_id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  age INTEGER,
  gender TEXT,
  aadhaar_number TEXT NOT NULL UNIQUE,
  status TEXT DEFAULT 'Active' CHECK (status IN ('Active', 'Inactive')),
  relation_to_head TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create shops table
CREATE TABLE IF NOT EXISTS public.shops (
  shop_id SERIAL PRIMARY KEY,
  shop_name TEXT NOT NULL,
  owner_name TEXT NOT NULL,
  address TEXT NOT NULL,
  village TEXT NOT NULL,
  taluka TEXT NOT NULL,
  district TEXT NOT NULL,
  mobile TEXT NOT NULL,
  license_number TEXT UNIQUE,
  status TEXT DEFAULT 'Active' CHECK (status IN ('Active', 'Inactive')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create entitlements table (monthly quotas based on card type and family size)
CREATE TABLE IF NOT EXISTS public.entitlements (
  entitlement_id SERIAL PRIMARY KEY,
  ration_card_type TEXT NOT NULL,
  family_size_min INTEGER NOT NULL,
  family_size_max INTEGER NOT NULL,
  rice_kg DECIMAL(10, 2) NOT NULL DEFAULT 0,
  wheat_kg DECIMAL(10, 2) NOT NULL DEFAULT 0,
  sugar_kg DECIMAL(10, 2) NOT NULL DEFAULT 0,
  kerosene_liters DECIMAL(10, 2) NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create monthly_balances table (tracks remaining quota for each family per month)
CREATE TABLE IF NOT EXISTS public.monthly_balances (
  balance_id SERIAL PRIMARY KEY,
  family_id INTEGER NOT NULL REFERENCES public.families(family_id) ON DELETE CASCADE,
  month INTEGER NOT NULL CHECK (month BETWEEN 1 AND 12),
  year INTEGER NOT NULL,
  rice_remaining DECIMAL(10, 2) NOT NULL DEFAULT 0,
  wheat_remaining DECIMAL(10, 2) NOT NULL DEFAULT 0,
  sugar_remaining DECIMAL(10, 2) NOT NULL DEFAULT 0,
  kerosene_remaining DECIMAL(10, 2) NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(family_id, month, year)
);

-- Create bookings table (optional pre-booking system)
CREATE TABLE IF NOT EXISTS public.bookings (
  booking_id SERIAL PRIMARY KEY,
  family_id INTEGER NOT NULL REFERENCES public.families(family_id) ON DELETE CASCADE,
  shop_id INTEGER NOT NULL REFERENCES public.shops(shop_id) ON DELETE CASCADE,
  member_id INTEGER REFERENCES public.family_members(member_id) ON DELETE SET NULL,
  booking_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  pickup_date DATE,
  status TEXT DEFAULT 'Pending' CHECK (status IN ('Pending', 'Confirmed', 'Completed', 'Cancelled')),
  rice_kg DECIMAL(10, 2) DEFAULT 0,
  wheat_kg DECIMAL(10, 2) DEFAULT 0,
  sugar_kg DECIMAL(10, 2) DEFAULT 0,
  kerosene_liters DECIMAL(10, 2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create distributions table (actual ration distribution records)
CREATE TABLE IF NOT EXISTS public.distributions (
  distribution_id SERIAL PRIMARY KEY,
  family_id INTEGER NOT NULL REFERENCES public.families(family_id) ON DELETE CASCADE,
  shop_id INTEGER NOT NULL REFERENCES public.shops(shop_id) ON DELETE CASCADE,
  member_id INTEGER REFERENCES public.family_members(member_id) ON DELETE SET NULL,
  booking_id INTEGER REFERENCES public.bookings(booking_id) ON DELETE SET NULL,
  distribution_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  rice_kg DECIMAL(10, 2) DEFAULT 0,
  wheat_kg DECIMAL(10, 2) DEFAULT 0,
  sugar_kg DECIMAL(10, 2) DEFAULT 0,
  kerosene_liters DECIMAL(10, 2) DEFAULT 0,
  total_amount DECIMAL(10, 2) DEFAULT 0,
  payment_method TEXT DEFAULT 'Cash',
  transaction_hash TEXT,
  receipt_sent BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Monthly entitlements per family per month (explicit snapshot separate from balances)
CREATE TABLE IF NOT EXISTS public.monthly_entitlements (
  id SERIAL PRIMARY KEY,
  family_id INTEGER NOT NULL REFERENCES public.families(family_id) ON DELETE CASCADE,
  month INTEGER NOT NULL CHECK (month BETWEEN 1 AND 12),
  year INTEGER NOT NULL,
  rice_kg DECIMAL(10, 2) NOT NULL DEFAULT 0,
  wheat_kg DECIMAL(10, 2) NOT NULL DEFAULT 0,
  sugar_kg DECIMAL(10, 2) NOT NULL DEFAULT 0,
  kerosene_liters DECIMAL(10, 2) NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(family_id, month, year)
);

-- OTP store (server-side) for real-time authentication
CREATE TABLE IF NOT EXISTS public.auth_otp (
  identifier TEXT PRIMARY KEY, -- aadhaar or mobile
  otp_hash TEXT NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Authentication logs (OTP/Biometric at shop or login)
CREATE TABLE IF NOT EXISTS public.auth_logs (
  auth_id SERIAL PRIMARY KEY,
  family_id INTEGER,
  member_id INTEGER,
  shop_id INTEGER,
  booking_id INTEGER,
  auth_type TEXT, -- OTP, BIOMETRIC
  auth_status TEXT, -- SUCCESS, FAILED
  otp_code TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Undistributed/shortage reasons log
CREATE TABLE IF NOT EXISTS public.undistributed_logs (
  id SERIAL PRIMARY KEY,
  distribution_id INTEGER,
  family_id INTEGER,
  item_code TEXT,
  expected_qty DECIMAL(10,2),
  given_qty DECIMAL(10,2),
  reason_code TEXT,
  reason_text TEXT,
  logged_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_families_aadhaar ON public.families(head_aadhaar_number);
CREATE INDEX IF NOT EXISTS idx_families_mobile ON public.families(head_mobile);
CREATE INDEX IF NOT EXISTS idx_families_ration_card ON public.families(ration_card_number);
CREATE INDEX IF NOT EXISTS idx_members_aadhaar ON public.family_members(aadhaar_number);
CREATE INDEX IF NOT EXISTS idx_members_family ON public.family_members(family_id);
CREATE INDEX IF NOT EXISTS idx_monthly_balances_family ON public.monthly_balances(family_id, month, year);
CREATE INDEX IF NOT EXISTS idx_distributions_family ON public.distributions(family_id);
CREATE INDEX IF NOT EXISTS idx_distributions_date ON public.distributions(distribution_date);

CREATE INDEX IF NOT EXISTS idx_monthly_entitlements_family ON public.monthly_entitlements(family_id, month, year);

-- Enable Row Level Security
ALTER TABLE public.families ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.family_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shops ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.entitlements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.monthly_balances ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.distributions ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Allow public read access for now (we'll refine based on auth requirements)
-- For families
CREATE POLICY "Allow public read families" ON public.families FOR SELECT USING (true);
CREATE POLICY "Allow public insert families" ON public.families FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update families" ON public.families FOR UPDATE USING (true);

-- For family_members
CREATE POLICY "Allow public read members" ON public.family_members FOR SELECT USING (true);
CREATE POLICY "Allow public insert members" ON public.family_members FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update members" ON public.family_members FOR UPDATE USING (true);

-- For shops
CREATE POLICY "Allow public read shops" ON public.shops FOR SELECT USING (true);
CREATE POLICY "Allow public insert shops" ON public.shops FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update shops" ON public.shops FOR UPDATE USING (true);

-- For entitlements
CREATE POLICY "Allow public read entitlements" ON public.entitlements FOR SELECT USING (true);
CREATE POLICY "Allow public insert entitlements" ON public.entitlements FOR INSERT WITH CHECK (true);

-- For monthly_balances
CREATE POLICY "Allow public read balances" ON public.monthly_balances FOR SELECT USING (true);
CREATE POLICY "Allow public insert balances" ON public.monthly_balances FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update balances" ON public.monthly_balances FOR UPDATE USING (true);

-- For bookings
CREATE POLICY "Allow public read bookings" ON public.bookings FOR SELECT USING (true);
CREATE POLICY "Allow public insert bookings" ON public.bookings FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update bookings" ON public.bookings FOR UPDATE USING (true);

-- For distributions
CREATE POLICY "Allow public read distributions" ON public.distributions FOR SELECT USING (true);
CREATE POLICY "Allow public insert distributions" ON public.distributions FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update distributions" ON public.distributions FOR UPDATE USING (true);
