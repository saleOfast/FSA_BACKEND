-- Comprehensive migration script to populate all required columns for existing beats
-- This script handles: beat_name, country_id, state_id, district_id, created_by

-- Step 1: Populate beat_name for existing rows
DO $$
DECLARE
    column_exists boolean;
    null_count integer;
BEGIN
    SELECT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'beat' AND column_name = 'beat_name'
    ) INTO column_exists;
    
    IF column_exists THEN
        SELECT COUNT(*) INTO null_count FROM beat WHERE beat_name IS NULL;
        IF null_count > 0 THEN
            UPDATE beat SET beat_name = 'Beat ' || beat_id WHERE beat_name IS NULL;
            RAISE NOTICE 'Populated beat_name for % rows', null_count;
        END IF;
    END IF;
END $$;

-- Step 2: Populate country_id for existing rows
DO $$
DECLARE
    column_exists boolean;
    null_count integer;
    first_country_id integer;
BEGIN
    SELECT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'beat' AND column_name = 'country_id'
    ) INTO column_exists;
    
    IF column_exists THEN
        SELECT COUNT(*) INTO null_count FROM beat WHERE country_id IS NULL;
        IF null_count > 0 THEN
            SELECT country_id INTO first_country_id FROM country ORDER BY country_id LIMIT 1;
            IF first_country_id IS NOT NULL THEN
                UPDATE beat SET country_id = first_country_id WHERE country_id IS NULL;
                RAISE NOTICE 'Populated country_id for % rows with country_id: %', null_count, first_country_id;
            ELSE
                RAISE NOTICE 'WARNING: No countries found. Cannot populate country_id.';
            END IF;
        END IF;
    END IF;
END $$;

-- Step 3: Populate state_id for existing rows
DO $$
DECLARE
    column_exists boolean;
    null_count integer;
    first_state_id integer;
BEGIN
    SELECT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'beat' AND column_name = 'state_id'
    ) INTO column_exists;
    
    IF column_exists THEN
        SELECT COUNT(*) INTO null_count FROM beat WHERE state_id IS NULL;
        IF null_count > 0 THEN
            SELECT state_id INTO first_state_id FROM state ORDER BY state_id LIMIT 1;
            IF first_state_id IS NOT NULL THEN
                UPDATE beat SET state_id = first_state_id WHERE state_id IS NULL;
                RAISE NOTICE 'Populated state_id for % rows with state_id: %', null_count, first_state_id;
            ELSE
                RAISE NOTICE 'WARNING: No states found. Cannot populate state_id.';
            END IF;
        END IF;
    END IF;
END $$;

-- Step 4: Populate district_id for existing rows
DO $$
DECLARE
    column_exists boolean;
    null_count integer;
    first_district_id integer;
BEGIN
    SELECT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'beat' AND column_name = 'district_id'
    ) INTO column_exists;
    
    IF column_exists THEN
        SELECT COUNT(*) INTO null_count FROM beat WHERE district_id IS NULL;
        IF null_count > 0 THEN
            SELECT district_id INTO first_district_id FROM district ORDER BY district_id LIMIT 1;
            IF first_district_id IS NOT NULL THEN
                UPDATE beat SET district_id = first_district_id WHERE district_id IS NULL;
                RAISE NOTICE 'Populated district_id for % rows with district_id: %', null_count, first_district_id;
            ELSE
                RAISE NOTICE 'WARNING: No districts found. Cannot populate district_id.';
            END IF;
        END IF;
    END IF;
END $$;

-- Step 5: Populate created_by for existing rows
DO $$
DECLARE
    column_exists boolean;
    null_count integer;
    first_user_id integer;
BEGIN
    SELECT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'beat' AND column_name = 'created_by'
    ) INTO column_exists;
    
    IF column_exists THEN
        SELECT COUNT(*) INTO null_count FROM beat WHERE created_by IS NULL;
        IF null_count > 0 THEN
            SELECT emp_id INTO first_user_id FROM "user" ORDER BY emp_id LIMIT 1;
            IF first_user_id IS NOT NULL THEN
                UPDATE beat SET created_by = first_user_id WHERE created_by IS NULL;
                RAISE NOTICE 'Populated created_by for % rows with user_id: %', null_count, first_user_id;
            ELSE
                RAISE NOTICE 'WARNING: No users found. Cannot populate created_by.';
            END IF;
        END IF;
    END IF;
END $$;

-- Verification query (optional - uncomment to check)
-- SELECT beat_id, beat_name, country_id, state_id, district_id, created_by 
-- FROM beat 
-- WHERE beat_name IS NULL 
--    OR country_id IS NULL 
--    OR state_id IS NULL 
--    OR district_id IS NULL 
--    OR created_by IS NULL;

