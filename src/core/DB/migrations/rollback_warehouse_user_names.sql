-- Rollback Migration: Remove user name columns from warehouses table
-- Date: 2024-01-XX
-- Description: Remove created_by_name and last_modified_by_name columns

-- Remove the new columns
ALTER TABLE warehouses 
DROP COLUMN IF EXISTS created_by_name,
DROP COLUMN IF EXISTS last_modified_by_name;
