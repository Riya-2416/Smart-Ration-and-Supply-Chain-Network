-- Load family data from CSV
-- Note: This assumes the CSV data will be loaded via the application API
-- The actual CSV loading will be done through the ingestion system

-- Create a function to initialize monthly balance for a family
CREATE OR REPLACE FUNCTION public.initialize_monthly_balance(
  p_family_id INTEGER,
  p_month INTEGER,
  p_year INTEGER
) RETURNS VOID AS $$
DECLARE
  v_family RECORD;
  v_entitlement RECORD;
BEGIN
  -- Get family details
  SELECT * INTO v_family FROM public.families WHERE family_id = p_family_id;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Family not found: %', p_family_id;
  END IF;
  
  -- Get entitlement based on card type and family size
  SELECT * INTO v_entitlement 
  FROM public.entitlements 
  WHERE ration_card_type = v_family.ration_card_type
    AND v_family.family_members_count BETWEEN family_size_min AND family_size_max
  LIMIT 1;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'No entitlement found for card type % and family size %', 
      v_family.ration_card_type, v_family.family_members_count;
  END IF;
  
  -- Insert or update monthly balance
  INSERT INTO public.monthly_balances (
    family_id, month, year, 
    rice_remaining, wheat_remaining, sugar_remaining, kerosene_remaining
  ) VALUES (
    p_family_id, p_month, p_year,
    v_entitlement.rice_kg, v_entitlement.wheat_kg, 
    v_entitlement.sugar_kg, v_entitlement.kerosene_liters
  )
  ON CONFLICT (family_id, month, year) 
  DO UPDATE SET
    rice_remaining = v_entitlement.rice_kg,
    wheat_remaining = v_entitlement.wheat_kg,
    sugar_remaining = v_entitlement.sugar_kg,
    kerosene_remaining = v_entitlement.kerosene_liters,
    updated_at = NOW();
END;
$$ LANGUAGE plpgsql;

-- Create a function to record distribution and update balance
CREATE OR REPLACE FUNCTION public.record_distribution(
  p_family_id INTEGER,
  p_shop_id INTEGER,
  p_member_id INTEGER,
  p_rice_kg DECIMAL,
  p_wheat_kg DECIMAL,
  p_sugar_kg DECIMAL,
  p_kerosene_liters DECIMAL,
  p_total_amount DECIMAL,
  p_payment_method TEXT,
  p_transaction_hash TEXT
) RETURNS INTEGER AS $$
DECLARE
  v_distribution_id INTEGER;
  v_month INTEGER;
  v_year INTEGER;
  v_balance RECORD;
BEGIN
  -- Get current month and year
  v_month := EXTRACT(MONTH FROM NOW());
  v_year := EXTRACT(YEAR FROM NOW());
  
  -- Check if monthly balance exists, if not initialize it
  SELECT * INTO v_balance 
  FROM public.monthly_balances 
  WHERE family_id = p_family_id AND month = v_month AND year = v_year;
  
  IF NOT FOUND THEN
    PERFORM public.initialize_monthly_balance(p_family_id, v_month, v_year);
    SELECT * INTO v_balance 
    FROM public.monthly_balances 
    WHERE family_id = p_family_id AND month = v_month AND year = v_year;
  END IF;
  
  -- Check if sufficient balance
  IF v_balance.rice_remaining < p_rice_kg THEN
    RAISE EXCEPTION 'Insufficient rice balance. Available: %, Requested: %', 
      v_balance.rice_remaining, p_rice_kg;
  END IF;
  
  IF v_balance.wheat_remaining < p_wheat_kg THEN
    RAISE EXCEPTION 'Insufficient wheat balance. Available: %, Requested: %', 
      v_balance.wheat_remaining, p_wheat_kg;
  END IF;
  
  IF v_balance.sugar_remaining < p_sugar_kg THEN
    RAISE EXCEPTION 'Insufficient sugar balance. Available: %, Requested: %', 
      v_balance.sugar_remaining, p_sugar_kg;
  END IF;
  
  IF v_balance.kerosene_remaining < p_kerosene_liters THEN
    RAISE EXCEPTION 'Insufficient kerosene balance. Available: %, Requested: %', 
      v_balance.kerosene_remaining, p_kerosene_liters;
  END IF;
  
  -- Insert distribution record
  INSERT INTO public.distributions (
    family_id, shop_id, member_id,
    rice_kg, wheat_kg, sugar_kg, kerosene_liters,
    total_amount, payment_method, transaction_hash
  ) VALUES (
    p_family_id, p_shop_id, p_member_id,
    p_rice_kg, p_wheat_kg, p_sugar_kg, p_kerosene_liters,
    p_total_amount, p_payment_method, p_transaction_hash
  ) RETURNING distribution_id INTO v_distribution_id;
  
  -- Update monthly balance
  UPDATE public.monthly_balances
  SET 
    rice_remaining = rice_remaining - p_rice_kg,
    wheat_remaining = wheat_remaining - p_wheat_kg,
    sugar_remaining = sugar_remaining - p_sugar_kg,
    kerosene_remaining = kerosene_remaining - p_kerosene_liters,
    updated_at = NOW()
  WHERE family_id = p_family_id AND month = v_month AND year = v_year;
  
  RETURN v_distribution_id;
END;
$$ LANGUAGE plpgsql;
