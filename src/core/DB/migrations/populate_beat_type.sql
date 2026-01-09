-- Migration script to populate enum columns for existing rows in beat table
-- This script assigns default values to: beat_type, visit_frequency, and priority

-- Step 1: Populate beat_type for existing rows
DO $$
DECLARE
    column_exists boolean;
    null_count integer;
BEGIN
    SELECT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'beat' AND column_name = 'beat_type'
    ) INTO column_exists;
    
    IF column_exists THEN
        SELECT COUNT(*) INTO null_count FROM beat WHERE beat_type IS NULL;
        RAISE NOTICE 'Found % rows with NULL beat_type', null_count;
        
        IF null_count > 0 THEN
            UPDATE beat SET beat_type = 'SALES'::beat_beat_type_enum WHERE beat_type IS NULL;
            RAISE NOTICE 'Populated beat_type for % rows with default: SALES', null_count;
        END IF;
    END IF;
END $$;

-- Step 2: Populate visit_frequency for existing rows
DO $$
DECLARE
    column_exists boolean;
    null_count integer;
BEGIN
    SELECT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'beat' AND column_name = 'visit_frequency'
    ) INTO column_exists;
    
    IF column_exists THEN
        SELECT COUNT(*) INTO null_count FROM beat WHERE visit_frequency IS NULL;
        RAISE NOTICE 'Found % rows with NULL visit_frequency', null_count;
        
        IF null_count > 0 THEN
            UPDATE beat SET visit_frequency = 'WEEKLY'::beat_visit_frequency_enum WHERE visit_frequency IS NULL;
            RAISE NOTICE 'Populated visit_frequency for % rows with default: WEEKLY', null_count;
        END IF;
    END IF;
END $$;

-- Step 3: Populate priority for existing rows
DO $$
DECLARE
    column_exists boolean;
    null_count integer;
BEGIN
    SELECT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'beat' AND column_name = 'priority'
    ) INTO column_exists;
    
    IF column_exists THEN
        SELECT COUNT(*) INTO null_count FROM beat WHERE priority IS NULL;
        RAISE NOTICE 'Found % rows with NULL priority', null_count;
        
        IF null_count > 0 THEN
            UPDATE beat SET priority = 'MEDIUM'::beat_priority_enum WHERE priority IS NULL;
            RAISE NOTICE 'Populated priority for % rows with default: MEDIUM', null_count;
        END IF;
    END IF;
END $$;

-- Step 4: After populating, optionally make columns NOT NULL
-- Uncomment the following blocks when you're ready to enforce NOT NULL constraints

/*
-- Make beat_type NOT NULL
DO $$
DECLARE null_count integer;
BEGIN
    SELECT COUNT(*) INTO null_count FROM beat WHERE beat_type IS NULL;
    IF null_count = 0 THEN
        EXECUTE format('ALTER TABLE "beat" ALTER COLUMN "beat_type" SET NOT NULL');
        RAISE NOTICE 'Set beat_type to NOT NULL';
    ELSE
        RAISE EXCEPTION 'Cannot set NOT NULL: % rows still have NULL beat_type', null_count;
    END IF;
END $$;

-- Make visit_frequency NOT NULL
DO $$
DECLARE null_count integer;
BEGIN
    SELECT COUNT(*) INTO null_count FROM beat WHERE visit_frequency IS NULL;
    IF null_count = 0 THEN
        EXECUTE format('ALTER TABLE "beat" ALTER COLUMN "visit_frequency" SET NOT NULL');
        RAISE NOTICE 'Set visit_frequency to NOT NULL';
    ELSE
        RAISE EXCEPTION 'Cannot set NOT NULL: % rows still have NULL visit_frequency', null_count;
    END IF;
END $$;

-- Make priority NOT NULL
DO $$
DECLARE null_count integer;
BEGIN
    SELECT COUNT(*) INTO null_count FROM beat WHERE priority IS NULL;
    IF null_count = 0 THEN
        EXECUTE format('ALTER TABLE "beat" ALTER COLUMN "priority" SET NOT NULL');
        RAISE NOTICE 'Set priority to NOT NULL';
    ELSE
        RAISE EXCEPTION 'Cannot set NOT NULL: % rows still have NULL priority', null_count;
    END IF;
END $$;
*/

-- Verification queries (optional - uncomment to check)
-- SELECT beat_id, beat_name, beat_type, visit_frequency, priority 
-- FROM beat 
-- WHERE beat_type IS NULL OR visit_frequency IS NULL OR priority IS NULL;

