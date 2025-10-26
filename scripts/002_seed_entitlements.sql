-- Seed entitlements (monthly quotas based on card type and family size)
-- AAY (Antyodaya Anna Yojana) - Poorest of the poor
INSERT INTO entitlements (ration_card_type, family_size_min, family_size_max, rice_kg, wheat_kg, sugar_kg, kerosene_liters)
VALUES 
  ('AAY', 1, 2, 35, 0, 1, 2),
  ('AAY', 3, 4, 35, 0, 1, 3),
  ('AAY', 5, 100, 35, 0, 1, 4);

-- BPL (Below Poverty Line)
INSERT INTO entitlements (ration_card_type, family_size_min, family_size_max, rice_kg, wheat_kg, sugar_kg, kerosene_liters)
VALUES 
  ('BPL', 1, 2, 10, 5, 1, 2),
  ('BPL', 3, 4, 15, 10, 1, 3),
  ('BPL', 5, 100, 20, 15, 1, 4);

-- APL (Above Poverty Line)
INSERT INTO entitlements (ration_card_type, family_size_min, family_size_max, rice_kg, wheat_kg, sugar_kg, kerosene_liters)
VALUES 
  ('APL', 1, 2, 5, 5, 0.5, 1),
  ('APL', 3, 4, 10, 10, 0.5, 2),
  ('APL', 5, 100, 15, 15, 0.5, 3);

-- White card (similar to APL in Maharashtra)
INSERT INTO entitlements (ration_card_type, family_size_min, family_size_max, rice_kg, wheat_kg, sugar_kg, kerosene_liters)
VALUES 
  ('white', 1, 2, 5, 5, 0.5, 1),
  ('white', 3, 4, 10, 10, 0.5, 2),
  ('white', 5, 100, 15, 15, 0.5, 3);

-- Orange card (middle-income in some states; treat like APL here)
INSERT INTO entitlements (ration_card_type, family_size_min, family_size_max, rice_kg, wheat_kg, sugar_kg, kerosene_liters)
VALUES 
  ('orange', 1, 2, 5, 5, 0.5, 1),
  ('orange', 3, 4, 10, 10, 0.5, 2),
  ('orange', 5, 100, 15, 15, 0.5, 3);

-- Yellow card (BPL equivalent)
INSERT INTO entitlements (ration_card_type, family_size_min, family_size_max, rice_kg, wheat_kg, sugar_kg, kerosene_liters)
VALUES 
  ('yellow', 1, 2, 10, 5, 1, 2),
  ('yellow', 3, 4, 15, 10, 1, 3),
  ('yellow', 5, 100, 20, 15, 1, 4);

-- Pink card (AAY equivalent)
INSERT INTO entitlements (ration_card_type, family_size_min, family_size_max, rice_kg, wheat_kg, sugar_kg, kerosene_liters)
VALUES 
  ('pink', 1, 2, 35, 0, 1, 2),
  ('pink', 3, 4, 35, 0, 1, 3),
  ('pink', 5, 100, 35, 0, 1, 4);
