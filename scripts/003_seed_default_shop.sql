-- Seed default shop (Vashivali)
INSERT INTO public.shops (shop_name, owner_name, address, village, taluka, district, mobile, license_number, status)
VALUES 
  ('Vashivali Ration Shop', 'Ramesh Patil', 'Main Road, Vashivali', 'Vashivali', 'Khalapur', 'Raigad', '9876543210', 'RGD-KHL-001', 'Active')
ON CONFLICT DO NOTHING;
