-- Core tables
CREATE TABLE shops (
  fps_id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  taluka TEXT,
  district TEXT,
  pincode TEXT,
  phone TEXT
);

CREATE TABLE families (
  family_id INTEGER PRIMARY KEY,
  head_name TEXT NOT NULL,
  head_age INTEGER NOT NULL,
  head_gender TEXT NOT NULL,
  head_mobile TEXT NOT NULL,
  head_aadhaar_number TEXT UNIQUE NOT NULL,
  ration_card_number TEXT UNIQUE NOT NULL,
  ration_card_type TEXT NOT NULL,
  address TEXT NOT NULL,
  family_members INTEGER NOT NULL
);

CREATE TABLE family_members (
  member_id INTEGER PRIMARY KEY,
  family_id INTEGER REFERENCES families(family_id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  age INTEGER,
  gender TEXT,
  aadhaar_number TEXT UNIQUE NOT NULL,
  status TEXT DEFAULT 'Active',
  relation_to_head TEXT NOT NULL,
  preferred_fps_id TEXT REFERENCES shops(fps_id)
);

CREATE TABLE otps (
  otp_id INTEGER PRIMARY KEY,
  mobile_number TEXT NOT NULL,
  otp_code TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  expires_at DATETIME NOT NULL
);

CREATE TABLE transactions (
  txn_id INTEGER PRIMARY KEY,
  family_id INTEGER REFERENCES families(family_id),
  member_id INTEGER REFERENCES family_members(member_id),
  fps_id TEXT REFERENCES shops(fps_id),
  month INTEGER NOT NULL,
  year INTEGER NOT NULL,
  wheat REAL DEFAULT 0,
  rice REAL DEFAULT 0,
  sugar REAL DEFAULT 0,
  auth_type TEXT DEFAULT 'OTP',
  status TEXT DEFAULT 'Success',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Seed shop and initial data
INSERT INTO shops (fps_id, name, address, taluka, district, pincode, phone)
SELECT '152025300044','Vashivali FPS','At post Vashivali, near sagguru complex gala no-4','Khalapur','Raigad','410220','9123456789'
WHERE NOT EXISTS (SELECT 1 FROM shops WHERE fps_id = '152025300044');

INSERT INTO families (family_id, head_name, head_age, head_gender, head_mobile, head_aadhaar_number, ration_card_number, ration_card_type, address, family_members)
SELECT 1,'Riya Nirmal Biswas',21,'Female','9082069161','111122223333','100100100001','orange','At post Vashivali House no- 8, Tal- Khalpaur, District- Raigad, pincode- 410220',5
WHERE NOT EXISTS (SELECT 1 FROM families WHERE family_id = 1);

INSERT INTO families (family_id, head_name, head_age, head_gender, head_mobile, head_aadhaar_number, ration_card_number, ration_card_type, address, family_members)
SELECT 2,'Shravani Bekawade',30,'Female','8888275225','111122223334','100100100002','yellow','At post Vashivali House no -9, Tal- Khalpaur, District- Raigad, pincode- 410220',3
WHERE NOT EXISTS (SELECT 1 FROM families WHERE family_id = 2);

INSERT INTO families (family_id, head_name, head_age, head_gender, head_mobile, head_aadhaar_number, ration_card_number, ration_card_type, address, family_members)
SELECT 3,'Jagdish Raghunath Shivale',44,'Male','9325720780','123412341234','152025300044','white','At post Vashivali House no- 10, Tal- Khalpaur, District- Raigad, pincode- 410220',4
WHERE NOT EXISTS (SELECT 1 FROM families WHERE family_id = 3);

INSERT INTO family_members (member_id, family_id, name, age, gender, aadhaar_number, status, relation_to_head)
SELECT 1,1,'Riya Nirmal Biswas',21,'Female','111122223333','Active','Head'
WHERE NOT EXISTS (SELECT 1 FROM family_members WHERE member_id = 1);

INSERT INTO family_members (member_id, family_id, name, age, gender, aadhaar_number, status, relation_to_head)
SELECT 2,1,'Nirmal Biswas',50,'Male','111122223335','Active','Father'
WHERE NOT EXISTS (SELECT 1 FROM family_members WHERE member_id = 2);

INSERT INTO family_members (member_id, family_id, name, age, gender, aadhaar_number, status, relation_to_head)
SELECT 3,1,'Rita Nirmal Biswas',48,'Female','111122223336','Active','Mother'
WHERE NOT EXISTS (SELECT 1 FROM family_members WHERE member_id = 3);

INSERT INTO family_members (member_id, family_id, name, age, gender, aadhaar_number, status, relation_to_head)
SELECT 4,1,'Priyanka Nirmal Biswas',18,'Female','111122223337','Active','Sister'
WHERE NOT EXISTS (SELECT 1 FROM family_members WHERE member_id = 4);

INSERT INTO family_members (member_id, family_id, name, age, gender, aadhaar_number, status, relation_to_head)
SELECT 5,1,'Diya Nirmal Biswas',16,'Female','111122223338','Active','Sister'
WHERE NOT EXISTS (SELECT 1 FROM family_members WHERE member_id = 5);

INSERT INTO family_members (member_id, family_id, name, age, gender, aadhaar_number, status, relation_to_head)
SELECT 6,2,'Shravani Bekawade',30,'Female','111122223334','Active','Head'
WHERE NOT EXISTS (SELECT 1 FROM family_members WHERE member_id = 6);

INSERT INTO family_members (member_id, family_id, name, age, gender, aadhaar_number, status, relation_to_head)
SELECT 7,2,'Naresh Bekawade',55,'Male','111122223339','Active','Father'
WHERE NOT EXISTS (SELECT 1 FROM family_members WHERE member_id = 7);

INSERT INTO family_members (member_id, family_id, name, age, gender, aadhaar_number, status, relation_to_head)
SELECT 8,2,'Nirbhay Naresh Bekawade',28,'Male','111122223340','Active','Brother'
WHERE NOT EXISTS (SELECT 1 FROM family_members WHERE member_id = 8);

INSERT INTO family_members (member_id, family_id, name, age, gender, aadhaar_number, status, relation_to_head)
SELECT 9,3,'Jagdish Raghunath Shivale',44,'Male','123412341234','Active','Head'
WHERE NOT EXISTS (SELECT 1 FROM family_members WHERE member_id = 9);

INSERT INTO family_members (member_id, family_id, name, age, gender, aadhaar_number, status, relation_to_head)
SELECT 10,3,'Kanchan Jagdish Shivale',37,'Female','123412341235','Active','Spouse'
WHERE NOT EXISTS (SELECT 1 FROM family_members WHERE member_id = 10);

INSERT INTO family_members (member_id, family_id, name, age, gender, aadhaar_number, status, relation_to_head)
SELECT 11,3,'Raj Jagdish Shivale',12,'Male','123412341236','Active','Son'
WHERE NOT EXISTS (SELECT 1 FROM family_members WHERE member_id = 11);

INSERT INTO family_members (member_id, family_id, name, age, gender, aadhaar_number, status, relation_to_head)
SELECT 12,3,'Tejal Jagdish Shivale',15,'Female','123412341237','Active','Daughter'
WHERE NOT EXISTS (SELECT 1 FROM family_members WHERE member_id = 12);


