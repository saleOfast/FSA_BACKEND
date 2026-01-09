-- Migration script to populate beat_code for existing rows in beat table
-- This script generates beat codes for existing beats that don't have one

-- Step 1: Check if beat_code column exists and if there are rows without beat_code
DO $$
DECLARE
    column_exists boolean;
    null_count integer;
BEGIN
    -- Check if column exists
    SELECT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'beat' 
        AND column_name = 'beat_code'
    ) INTO column_exists;
    
    IF column_exists THEN
        -- Count rows with NULL beat_code
        SELECT COUNT(*) INTO null_count
        FROM beat
        WHERE beat_code IS NULL;
        
        RAISE NOTICE 'Found % rows with NULL beat_code', null_count;
        
        -- Populate beat_code for existing rows
        -- Format: BT-{beat_id} (using beat_id to ensure uniqueness)
        UPDATE beat
        SET beat_code = 'BT-' || LPAD(beat_id::text, 6, '0')
        WHERE beat_code IS NULL;
        
        RAISE NOTICE 'Populated beat_code for % rows', null_count;
    ELSE
        RAISE NOTICE 'beat_code column does not exist yet. Run this after TypeORM creates the column.';
    END IF;
END $$;

-- Step 2: After populating, make the column NOT NULL
-- This ensures data integrity going forward
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
        AND column_name = 'beat_code'
    ) INTO column_exists;
    
    IF column_exists THEN
        -- Check if there are any NULL values remaining
        SELECT COUNT(*) INTO null_count
        FROM beat
        WHERE beat_code IS NULL;
        
        IF null_count = 0 THEN
            -- All rows have beat_code, safe to make it NOT NULL
            -- Use EXECUTE format to run ALTER TABLE inside DO block
            EXECUTE format('ALTER TABLE "beat" ALTER COLUMN "beat_code" SET NOT NULL');
            RAISE NOTICE 'Successfully set beat_code to NOT NULL';
        ELSE
            RAISE EXCEPTION 'Cannot set NOT NULL: % rows still have NULL beat_code. Please populate them first.', null_count;
        END IF;
    ELSE
        RAISE NOTICE 'beat_code column does not exist yet. Run this after TypeORM creates the column.';
    END IF;
END $$;

-- Verification query (optional - uncomment to check)
-- SELECT beat_id, beat_name, beat_code 
-- FROM beat 
-- WHERE beat_code IS NULL;

