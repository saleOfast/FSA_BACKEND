-- Migration script to populate required columns for existing rows in scheme table
-- This script handles: scheme_name, scheme_type, scheme_nature, start_date, end_date, benefit_type, created_by

-- Step 1: Populate scheme_name for existing rows
DO $$
DECLARE
    column_exists boolean;
    null_count integer;
BEGIN
    SELECT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'scheme' AND column_name = 'scheme_name'
    ) INTO column_exists;
    
    IF column_exists THEN
        SELECT COUNT(*) INTO null_count FROM scheme WHERE scheme_name IS NULL;
        IF null_count > 0 THEN
            UPDATE scheme SET scheme_name = 'Scheme ' || id WHERE scheme_name IS NULL;
            RAISE NOTICE 'Populated scheme_name for % rows', null_count;
        END IF;
    END IF;
END $$;

-- Step 2: Populate scheme_type for existing rows
DO $$
DECLARE
    column_exists boolean;
    null_count integer;
BEGIN
    SELECT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'scheme' AND column_name = 'scheme_type'
    ) INTO column_exists;
    
    IF column_exists THEN
        SELECT COUNT(*) INTO null_count FROM scheme WHERE scheme_type IS NULL;
        IF null_count > 0 THEN
            -- Use first available enum value: QTY_BASED
            UPDATE scheme SET scheme_type = 'QTY_BASED'::scheme_scheme_type_enum WHERE scheme_type IS NULL;
            RAISE NOTICE 'Populated scheme_type for % rows with default: QTY_BASED', null_count;
            RAISE NOTICE 'WARNING: All schemes were assigned to QTY_BASED type. Please review and update manually if needed.';
        END IF;
    END IF;
END $$;

-- Step 3: Populate scheme_nature for existing rows
DO $$
DECLARE
    column_exists boolean;
    null_count integer;
BEGIN
    SELECT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'scheme' AND column_name = 'scheme_nature'
    ) INTO column_exists;
    
    IF column_exists THEN
        SELECT COUNT(*) INTO null_count FROM scheme WHERE scheme_nature IS NULL;
        IF null_count > 0 THEN
            -- Use first available enum value: PRIMARY
            UPDATE scheme SET scheme_nature = 'PRIMARY'::scheme_scheme_nature_enum WHERE scheme_nature IS NULL;
            RAISE NOTICE 'Populated scheme_nature for % rows with default: PRIMARY', null_count;
            RAISE NOTICE 'WARNING: All schemes were assigned to PRIMARY nature. Please review and update manually if needed.';
        END IF;
    END IF;
END $$;

-- Step 4: Populate start_date for existing rows
DO $$
DECLARE
    column_exists boolean;
    null_count integer;
BEGIN
    SELECT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'scheme' AND column_name = 'start_date'
    ) INTO column_exists;
    
    IF column_exists THEN
        SELECT COUNT(*) INTO null_count FROM scheme WHERE start_date IS NULL;
        IF null_count > 0 THEN
            UPDATE scheme SET start_date = CURRENT_DATE WHERE start_date IS NULL;
            RAISE NOTICE 'Populated start_date for % rows with current date', null_count;
        END IF;
    END IF;
END $$;

-- Step 5: Populate end_date for existing rows
DO $$
DECLARE
    column_exists boolean;
    null_count integer;
BEGIN
    SELECT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'scheme' AND column_name = 'end_date'
    ) INTO column_exists;
    
    IF column_exists THEN
        SELECT COUNT(*) INTO null_count FROM scheme WHERE end_date IS NULL;
        IF null_count > 0 THEN
            -- Set end_date to 1 year from current date as default
            UPDATE scheme SET end_date = CURRENT_DATE + INTERVAL '1 year' WHERE end_date IS NULL;
            RAISE NOTICE 'Populated end_date for % rows with date 1 year from now', null_count;
        END IF;
    END IF;
END $$;

-- Step 6: Populate benefit_type for existing rows
DO $$
DECLARE
    column_exists boolean;
    null_count integer;
BEGIN
    SELECT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'scheme' AND column_name = 'benefit_type'
    ) INTO column_exists;
    
    IF column_exists THEN
        SELECT COUNT(*) INTO null_count FROM scheme WHERE benefit_type IS NULL;
        IF null_count > 0 THEN
            -- Use first available enum value: FREE_SKU
            UPDATE scheme SET benefit_type = 'FREE_SKU'::scheme_benefit_type_enum WHERE benefit_type IS NULL;
            RAISE NOTICE 'Populated benefit_type for % rows with default: FREE_SKU', null_count;
            RAISE NOTICE 'WARNING: All schemes were assigned to FREE_SKU benefit type. Please review and update manually if needed.';
        END IF;
    END IF;
END $$;

-- Step 7: Populate created_by for existing rows
DO $$
DECLARE
    column_exists boolean;
    null_count integer;
    first_user_id integer;
BEGIN
    SELECT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'scheme' AND column_name = 'created_by'
    ) INTO column_exists;
    
    IF column_exists THEN
        SELECT COUNT(*) INTO null_count FROM scheme WHERE created_by IS NULL;
        IF null_count > 0 THEN
            SELECT emp_id INTO first_user_id FROM "user" ORDER BY emp_id LIMIT 1;
            IF first_user_id IS NOT NULL THEN
                UPDATE scheme SET created_by = first_user_id WHERE created_by IS NULL;
                RAISE NOTICE 'Populated created_by for % rows with user_id: %', null_count, first_user_id;
            ELSE
                RAISE NOTICE 'WARNING: No users found. Cannot populate created_by.';
            END IF;
        END IF;
    END IF;
END $$;

-- Step 8: Populate beat_id for existing rows (optional - only if you want to assign beats)
-- Note: beat_id is nullable, so this step is optional
-- Uncomment if you want to assign existing schemes to beats
/*
DO $$
DECLARE
    column_exists boolean;
    null_count integer;
    first_beat_id integer;
BEGIN
    SELECT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'scheme' AND column_name = 'beat_id'
    ) INTO column_exists;
    
    IF column_exists THEN
        SELECT COUNT(*) INTO null_count FROM scheme WHERE beat_id IS NULL;
        IF null_count > 0 THEN
            SELECT beat_id INTO first_beat_id FROM beat ORDER BY beat_id LIMIT 1;
            IF first_beat_id IS NOT NULL THEN
                UPDATE scheme SET beat_id = first_beat_id WHERE beat_id IS NULL;
                RAISE NOTICE 'Populated beat_id for % rows with beat_id: %', null_count, first_beat_id;
                RAISE NOTICE 'WARNING: All schemes were assigned to the same beat. Please review and update manually if needed.';
            ELSE
                RAISE NOTICE 'WARNING: No beats found. Cannot populate beat_id.';
            END IF;
        END IF;
    END IF;
END $$;
*/

-- Verification query (optional - uncomment to check)
-- SELECT id, scheme_name, scheme_type, scheme_nature, start_date, end_date, benefit_type, created_by, beat_id
-- FROM scheme 
-- WHERE scheme_name IS NULL 
--    OR scheme_type IS NULL 
--    OR scheme_nature IS NULL 
--    OR start_date IS NULL 
--    OR end_date IS NULL 
--    OR benefit_type IS NULL 
--    OR created_by IS NULL;

