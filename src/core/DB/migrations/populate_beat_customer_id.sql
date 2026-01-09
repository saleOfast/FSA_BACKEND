-- Migration script to populate customer_id for existing rows in beat table
-- This script assigns existing beats to the first available customer

-- Step 1: Check if customer_id column exists and populate it for existing rows
DO $$
DECLARE
    column_exists boolean;
    null_count integer;
    first_customer_id integer;
BEGIN
    -- Check if column exists
    SELECT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'beat' 
        AND column_name = 'customer_id'
    ) INTO column_exists;
    
    IF column_exists THEN
        -- Count rows with NULL customer_id
        SELECT COUNT(*) INTO null_count
        FROM beat
        WHERE customer_id IS NULL;
        
        RAISE NOTICE 'Found % rows with NULL customer_id', null_count;
        
        IF null_count > 0 THEN
            -- Get the first available customer_id
            SELECT customer_id INTO first_customer_id
            FROM customers
            ORDER BY customer_id
            LIMIT 1;
            
            IF first_customer_id IS NOT NULL THEN
                -- Populate customer_id for existing rows with the first customer
                -- Note: You may want to manually review and assign appropriate customers
                UPDATE beat
                SET customer_id = first_customer_id
                WHERE customer_id IS NULL;
                
                RAISE NOTICE 'Populated customer_id for % rows with customer_id: %', null_count, first_customer_id;
                RAISE NOTICE 'WARNING: All beats were assigned to the same customer. Please review and update manually if needed.';
            ELSE
                RAISE NOTICE 'No customers found in the database. Cannot populate customer_id.';
                RAISE NOTICE 'Please create at least one customer, then run this script again.';
            END IF;
        ELSE
            RAISE NOTICE 'All rows already have customer_id assigned.';
        END IF;
    ELSE
        RAISE NOTICE 'customer_id column does not exist yet. Run this after TypeORM creates the column.';
    END IF;
END $$;

-- Step 2: After populating, optionally make the column NOT NULL
-- Uncomment the following block when you're ready to enforce NOT NULL constraint
-- Note: Only do this after ensuring all rows have valid customer_id values

/*
DO $$
DECLARE
    null_count integer;
    column_exists boolean;
BEGIN
    -- Check if column exists
    SELECT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'beat' 
        AND column_name = 'customer_id'
    ) INTO column_exists;
    
    IF column_exists THEN
        -- Check if there are any NULL values remaining
        SELECT COUNT(*) INTO null_count
        FROM beat
        WHERE customer_id IS NULL;
        
        IF null_count = 0 THEN
            -- All rows have customer_id, safe to make it NOT NULL
            EXECUTE format('ALTER TABLE "beat" ALTER COLUMN "customer_id" SET NOT NULL');
            RAISE NOTICE 'Successfully set customer_id to NOT NULL';
        ELSE
            RAISE EXCEPTION 'Cannot set NOT NULL: % rows still have NULL customer_id. Please populate them first.', null_count;
        END IF;
    END IF;
END $$;
*/

-- Verification query (optional - uncomment to check)
-- SELECT beat_id, beat_name, customer_id 
-- FROM beat 
-- WHERE customer_id IS NULL;

