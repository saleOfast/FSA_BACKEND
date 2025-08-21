-- Test script to verify warehouse user name changes
-- Run this after applying the migration to verify everything works

-- 1. Check if new columns exist
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'warehouses' 
AND column_name IN ('created_by_name', 'last_modified_by_name');

-- 2. Check existing data structure
SELECT warehouse_id, warehouse_name, created_by, created_by_name, 
       last_modified_by, last_modified_by_name, created_date, last_updated_date
FROM warehouses 
LIMIT 5;

-- 3. Check if user relations work
SELECT w.warehouse_id, w.warehouse_name, 
       w.created_by, w.created_by_name,
       u1.firstname as creator_firstname, u1.lastname as creator_lastname,
       w.last_modified_by, w.last_modified_by_name,
       u2.firstname as modifier_firstname, u2.lastname as modifier_lastname
FROM warehouses w
LEFT JOIN users u1 ON w.created_by = u1.emp_id
LEFT JOIN users u2 ON w.last_modified_by = u2.emp_id
LIMIT 5;

-- 4. Verify that names are properly populated
SELECT COUNT(*) as total_warehouses,
       COUNT(created_by_name) as warehouses_with_creator_name,
       COUNT(last_modified_by_name) as warehouses_with_modifier_name
FROM warehouses;

-- 5. Check for any warehouses without names (should be 0 after migration)
SELECT warehouse_id, warehouse_name, created_by, created_by_name, 
       last_modified_by, last_modified_by_name
FROM warehouses 
WHERE created_by_name IS NULL OR last_modified_by_name IS NULL;

-- 6. Test the new combined format (this would be handled by the application)
-- The application should now return data in this format:
-- "createdBy": { "id": 85, "name": "John Doe" }
-- "lastModifiedBy": { "id": 85, "name": "John Doe" }
-- Instead of:
-- "createdBy": 85, "createdByName": "John Doe"
-- "lastModifiedBy": 85, "lastModifiedByName": "John Doe"

-- 7. Verify data integrity
SELECT 
    warehouse_id,
    CASE 
        WHEN created_by IS NOT NULL AND created_by_name IS NOT NULL THEN 'OK'
        WHEN created_by IS NULL AND created_by_name IS NULL THEN 'OK'
        ELSE 'MISMATCH'
    END as created_by_status,
    CASE 
        WHEN last_modified_by IS NOT NULL AND last_modified_by_name IS NOT NULL THEN 'OK'
        WHEN last_modified_by IS NULL AND last_modified_by_name IS NULL THEN 'OK'
        ELSE 'MISMATCH'
    END as last_modified_by_status
FROM warehouses
WHERE (created_by IS NOT NULL AND created_by_name IS NULL) 
   OR (created_by IS NULL AND created_by_name IS NOT NULL)
   OR (last_modified_by IS NOT NULL AND last_modified_by_name IS NULL)
   OR (last_modified_by IS NULL AND last_modified_by_name IS NOT NULL);
