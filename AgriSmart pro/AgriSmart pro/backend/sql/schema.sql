-- ===========================================================
-- Drop & Recreate Database
-- ===========================================================
DROP DATABASE IF EXISTS agrismart;

CREATE DATABASE IF NOT EXISTS agrismart 
  DEFAULT CHARACTER SET utf8mb4 
  COLLATE utf8mb4_unicode_ci;
USE agrismart;

-- ===========================================================
-- Optional: Create dedicated MySQL user for local development
-- ===========================================================
DROP USER IF EXISTS 'agrismart_user'@'localhost';
CREATE USER IF NOT EXISTS 'agrismart_user'@'localhost' IDENTIFIED BY 'Password123!';
GRANT ALL PRIVILEGES ON agrismart.* TO 'agrismart_user'@'localhost';
FLUSH PRIVILEGES;

-- ===========================================================
-- Core Tables
-- ===========================================================

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  email VARCHAR(100) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS farms (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  name VARCHAR(100) NOT NULL,
  details TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_farms_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS fields (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  name VARCHAR(100) NOT NULL,
  details TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_fields_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS crops (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  name VARCHAR(100) NOT NULL,
  details TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_crops_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS sensors (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  name VARCHAR(100) NOT NULL,
  details TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_sensors_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS harvests (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  name VARCHAR(100) NOT NULL,
  details TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_harvests_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ===========================================================
-- Create UNIQUE INDEXES safely (if not exists)
-- ===========================================================
DELIMITER //

CREATE PROCEDURE create_unique_indexes_if_not_exists()
BEGIN
  -- Farms
  IF NOT EXISTS (
    SELECT 1 FROM INFORMATION_SCHEMA.STATISTICS 
    WHERE TABLE_SCHEMA = 'agrismart' AND TABLE_NAME = 'farms' AND INDEX_NAME = 'uniq_farms_user_name'
  ) THEN
    CREATE UNIQUE INDEX uniq_farms_user_name ON farms(user_id, name);
  END IF;

  -- Fields
  IF NOT EXISTS (
    SELECT 1 FROM INFORMATION_SCHEMA.STATISTICS 
    WHERE TABLE_SCHEMA = 'agrismart' AND TABLE_NAME = 'fields' AND INDEX_NAME = 'uniq_fields_user_name'
  ) THEN
    CREATE UNIQUE INDEX uniq_fields_user_name ON fields(user_id, name);
  END IF;

  -- Crops
  IF NOT EXISTS (
    SELECT 1 FROM INFORMATION_SCHEMA.STATISTICS 
    WHERE TABLE_SCHEMA = 'agrismart' AND TABLE_NAME = 'crops' AND INDEX_NAME = 'uniq_crops_user_name'
  ) THEN
    CREATE UNIQUE INDEX uniq_crops_user_name ON crops(user_id, name);
  END IF;

  -- Sensors
  IF NOT EXISTS (
    SELECT 1 FROM INFORMATION_SCHEMA.STATISTICS 
    WHERE TABLE_SCHEMA = 'agrismart' AND TABLE_NAME = 'sensors' AND INDEX_NAME = 'uniq_sensors_user_name'
  ) THEN
    CREATE UNIQUE INDEX uniq_sensors_user_name ON sensors(user_id, name);
  END IF;

  -- Harvests
  IF NOT EXISTS (
    SELECT 1 FROM INFORMATION_SCHEMA.STATISTICS 
    WHERE TABLE_SCHEMA = 'agrismart' AND TABLE_NAME = 'harvests' AND INDEX_NAME = 'uniq_harvests_user_name'
  ) THEN
    CREATE UNIQUE INDEX uniq_harvests_user_name ON harvests(user_id, name);
  END IF;
END //

DELIMITER ;

-- Run the procedure once
CALL create_unique_indexes_if_not_exists();

-- Remove the procedure after use (optional cleanup)
DROP PROCEDURE create_unique_indexes_if_not_exists;

-- ===========================================================
-- ✅ Done: Database 'agrismart' ready to use
-- ===========================================================
