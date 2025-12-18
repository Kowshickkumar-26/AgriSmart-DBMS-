USE agrismart;

-- ===========================================
-- 1️⃣ USERS  ✅ bcrypt hashes included
-- password for all users = 123456
-- ===========================================
INSERT INTO users (username, email, password_hash) VALUES
('admin',       'admin@agrismart.com',       '$2a$10$WzW7qzF7Ezv2Zf01cYb9GeaNOXWZVbxDaPpZTuoAUYG5X39Tw.a5i'),
('farmer_raj',  'raj@agrismart.com',         '$2a$10$WzW7qzF7Ezv2Zf01cYb9GeaNOXWZVbxDaPpZTuoAUYG5X39Tw.a5i'),
('farmer_kumar','kumar@agrismart.com',       '$2a$10$WzW7qzF7Ezv2Zf01cYb9GeaNOXWZVbxDaPpZTuoAUYG5X39Tw.a5i'),
('farmer_uma',  'uma@agrismart.com',         '$2a$10$WzW7qzF7Ezv2Zf01cYb9GeaNOXWZVbxDaPpZTuoAUYG5X39Tw.a5i'),
('farmer_asha', 'asha@agrismart.com',        '$2a$10$WzW7qzF7Ezv2Zf01cYb9GeaNOXWZVbxDaPpZTuoAUYG5X39Tw.a5i'),
('farmer_siva', 'siva@agrismart.com',        '$2a$10$WzW7qzF7Ezv2Zf01cYb9GeaNOXWZVbxDaPpZTuoAUYG5X39Tw.a5i'),
('farmer_mani', 'mani@agrismart.com',        '$2a$10$WzW7qzF7Ezv2Zf01cYb9GeaNOXWZVbxDaPpZTuoAUYG5X39Tw.a5i'),
('farmer_gopi', 'gopi@agrismart.com',        '$2a$10$WzW7qzF7Ezv2Zf01cYb9GeaNOXWZVbxDaPpZTuoAUYG5X39Tw.a5i'),
('farmer_arun', 'arun@agrismart.com',        '$2a$10$WzW7qzF7Ezv2Zf01cYb9GeaNOXWZVbxDaPpZTuoAUYG5X39Tw.a5i'),
('farmer_vani', 'vani@agrismart.com',        '$2a$10$WzW7qzF7Ezv2Zf01cYb9GeaNOXWZVbxDaPpZTuoAUYG5X39Tw.a5i');

-- ===========================================
-- 2️⃣ FARMS (linked to user_id = 1)
-- ===========================================
INSERT INTO farms (user_id, name, details) VALUES
(1, 'Farm Alpha', 'Salem - 20 acres'),
(1, 'Farm Beta', 'Erode - 15 acres'),
(1, 'Farm Gamma', 'Namakkal - 25 acres'),
(1, 'Farm Delta', 'Coimbatore - 30 acres'),
(1, 'Farm Epsilon', 'Madurai - 18 acres'),
(1, 'Farm Zeta', 'Trichy - 22 acres'),
(1, 'Farm Eta', 'Dharmapuri - 16 acres'),
(1, 'Farm Theta', 'Karur - 27 acres'),
(1, 'Farm Iota', 'Thanjavur - 35 acres'),
(1, 'Farm Kappa', 'Dindigul - 24 acres');

-- ===========================================
-- 3️⃣ FIELDS
-- ===========================================
INSERT INTO fields (user_id, name, details) VALUES
(1, 'Field A1', 'Farm Alpha - 5 acres'),
(1, 'Field A2', 'Farm Alpha - 6 acres'),
(1, 'Field B1', 'Farm Beta - 7 acres'),
(1, 'Field C1', 'Farm Gamma - 10 acres'),
(1, 'Field D1', 'Farm Delta - 12 acres'),
(1, 'Field E1', 'Farm Epsilon - 8 acres'),
(1, 'Field F1', 'Farm Zeta - 9 acres'),
(1, 'Field G1', 'Farm Eta - 6 acres'),
(1, 'Field H1', 'Farm Theta - 11 acres'),
(1, 'Field I1', 'Farm Iota - 15 acres');

-- ===========================================
-- 4️⃣ CROPS
-- ===========================================
INSERT INTO crops (user_id, name, details) VALUES
(1, 'Rice', 'Field A1 - Growth Stage 60%'),
(1, 'Wheat', 'Field B1 - Growth Stage 40%'),
(1, 'Corn', 'Field C1 - Growth Stage 75%'),
(1, 'Sugarcane', 'Field D1 - Growth Stage 30%'),
(1, 'Cotton', 'Field E1 - Growth Stage 55%'),
(1, 'Millet', 'Field F1 - Growth Stage 70%'),
(1, 'Groundnut', 'Field G1 - Growth Stage 45%'),
(1, 'Banana', 'Field H1 - Growth Stage 65%'),
(1, 'Maize', 'Field I1 - Growth Stage 80%'),
(1, 'Turmeric', 'Field A2 - Growth Stage 35%');

-- ===========================================
-- 5️⃣ SENSORS
-- ===========================================
INSERT INTO sensors (user_id, name, details) VALUES
(1, 'Sensor-01', 'Moisture Sensor - Field A1'),
(1, 'Sensor-02', 'Temperature Sensor - Field B1'),
(1, 'Sensor-03', 'Humidity Sensor - Field C1'),
(1, 'Sensor-04', 'Soil pH Sensor - Field D1'),
(1, 'Sensor-05', 'Rainfall Sensor - Field E1'),
(1, 'Sensor-06', 'Light Intensity Sensor - Field F1'),
(1, 'Sensor-07', 'CO2 Sensor - Field G1'),
(1, 'Sensor-08', 'Nutrient Sensor - Field H1'),
(1, 'Sensor-09', 'Wind Speed Sensor - Field I1'),
(1, 'Sensor-10', 'Multi-parameter Sensor - Field A2');

-- ===========================================
-- 6️⃣ HARVESTS
-- ===========================================
INSERT INTO harvests (user_id, name, details) VALUES
(1, 'Batch 101', 'Rice - 200 kg harvested from Field A1'),
(1, 'Batch 102', 'Wheat - 150 kg harvested from Field B1'),
(1, 'Batch 103', 'Corn - 300 kg harvested from Field C1'),
(1, 'Batch 104', 'Sugarcane - 500 kg harvested from Field D1'),
(1, 'Batch 105', 'Cotton - 180 kg harvested from Field E1'),
(1, 'Batch 106', 'Millet - 220 kg harvested from Field F1'),
(1, 'Batch 107', 'Groundnut - 160 kg harvested from Field G1'),
(1, 'Batch 108', 'Banana - 400 kg harvested from Field H1'),
(1, 'Batch 109', 'Maize - 250 kg harvested from Field I1'),
(1, 'Batch 110', 'Turmeric - 350 kg harvested from Field A2');
