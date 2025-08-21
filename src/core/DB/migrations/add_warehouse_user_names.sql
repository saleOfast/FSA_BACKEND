-- Migration: Add user name columns to warehouses table
-- Date: 2024-01-XX
-- Description: Add created_by_name and last_modified_by_name columns to store both user ID and name

-- Add new columns for storing user names
ALTER TABLE warehouses 
ADD COLUMN IF NOT EXISTS created_by_name VARCHAR(255),
ADD COLUMN IF NOT EXISTS last_modified_by_name VARCHAR(255);

-- Add comments for documentation
COMMENT ON COLUMN warehouses.created_by_name IS 'Full name of the user who created the warehouse';
COMMENT ON COLUMN warehouses.last_modified_by_name IS 'Full name of the user who last modified the warehouse';

-- Update existing records to populate the name fields based on existing user IDs
-- This will populate the name fields for existing warehouses
UPDATE warehouses 
SET created_by_name = (
    SELECT CONCAT(u.firstname, ' ', COALESCE(u.lastname, '')) 
    FROM users u 
    WHERE u.emp_id = warehouses.created_by
),
last_modified_by_name = (
    SELECT CONCAT(u.firstname, ' ', COALESCE(u.lastname, '')) 
    FROM users u 
    WHERE u.emp_id = warehouses.last_modified_by
)
WHERE created_by IS NOT NULL OR last_modified_by IS NOT NULL;

-- Trim any extra spaces from the concatenated names
UPDATE warehouses 
SET created_by_name = TRIM(created_by_name),
    last_modified_by_name = TRIM(last_modified_by_name);

-- Set default values for any remaining NULL names
UPDATE warehouses 
SET created_by_name = 'Unknown User'
WHERE created_by_name IS NULL AND created_by IS NOT NULL;

UPDATE warehouses 
SET last_modified_by_name = 'Unknown User'
WHERE last_modified_by_name IS NULL AND last_modified_by IS NOT NULL;

-- Verify the migration
SELECT 
    COUNT(*) as total_warehouses,
    COUNT(created_by_name) as warehouses_with_creator_name,
    COUNT(last_modified_by_name) as warehouses_with_modifier_name
FROM warehouses;
