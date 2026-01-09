-- Migration script to fix foreign key constraint issue between scheme and sku tables
-- This script updates the foreign key constraint to allow TypeORM synchronize to work properly

-- Step 1: Drop the existing foreign key constraint(s) from sku to scheme
-- Find and drop all foreign key constraints from sku.scheme_id to scheme.scheme_id
DO $$
DECLARE
    constraint_name text;
BEGIN
    -- Find the constraint name dynamically
    SELECT tc.constraint_name INTO constraint_name
    FROM information_schema.table_constraints AS tc
    JOIN information_schema.key_column_usage AS kcu
        ON tc.constraint_name = kcu.constraint_name
    JOIN information_schema.constraint_column_usage AS ccu
        ON ccu.constraint_name = tc.constraint_name
    WHERE tc.constraint_type = 'FOREIGN KEY'
        AND tc.table_name = 'sku'
        AND kcu.column_name = 'scheme_id'
        AND ccu.table_name = 'scheme'
        AND ccu.column_name = 'scheme_id'
    LIMIT 1;
    
    -- Drop the constraint if it exists
    IF constraint_name IS NOT NULL THEN
        EXECUTE format('ALTER TABLE "sku" DROP CONSTRAINT IF EXISTS %I', constraint_name);
        RAISE NOTICE 'Dropped constraint: %', constraint_name;
    ELSE
        RAISE NOTICE 'No foreign key constraint found from sku.scheme_id to scheme.scheme_id';
    END IF;
END $$;

-- Step 2: Recreate the foreign key constraint with proper cascade options
-- This allows TypeORM to modify the primary key on scheme table if needed
ALTER TABLE "sku" 
ADD CONSTRAINT "FK_sku_scheme_id" 
FOREIGN KEY ("scheme_id") 
REFERENCES "scheme"("scheme_id") 
ON DELETE SET NULL 
ON UPDATE CASCADE;

-- Verification query (optional - uncomment to check)
-- SELECT 
--     tc.constraint_name, 
--     tc.table_name, 
--     kcu.column_name,
--     ccu.table_name AS foreign_table_name,
--     ccu.column_name AS foreign_column_name,
--     rc.delete_rule,
--     rc.update_rule
-- FROM information_schema.table_constraints AS tc 
-- JOIN information_schema.key_column_usage AS kcu
--   ON tc.constraint_name = kcu.constraint_name
-- JOIN information_schema.constraint_column_usage AS ccu
--   ON ccu.constraint_name = tc.constraint_name
-- JOIN information_schema.referential_constraints AS rc
--   ON rc.constraint_name = tc.constraint_name
-- WHERE tc.constraint_type = 'FOREIGN KEY' 
--   AND tc.table_name = 'sku'
--   AND ccu.table_name = 'scheme';

