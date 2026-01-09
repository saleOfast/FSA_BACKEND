-- Migration script to populate required columns for existing rows in sku table
-- This script handles: sku_name and product_id

-- Step 1: Populate sku_name for existing rows
DO $$
DECLARE
    column_exists boolean;
    null_count integer;
BEGIN
    SELECT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'sku' AND column_name = 'sku_name'
    ) INTO column_exists;
    
    IF column_exists THEN
        SELECT COUNT(*) INTO null_count FROM sku WHERE sku_name IS NULL;
        IF null_count > 0 THEN
            UPDATE sku SET sku_name = 'SKU ' || sku_id WHERE sku_name IS NULL;
            RAISE NOTICE 'Populated sku_name for % rows', null_count;
        END IF;
    END IF;
END $$;

-- Step 2: Populate product_id for existing rows
DO $$
DECLARE
    column_exists boolean;
    null_count integer;
    first_product_id integer;
BEGIN
    SELECT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'sku' AND column_name = 'product_id'
    ) INTO column_exists;
    
    IF column_exists THEN
        SELECT COUNT(*) INTO null_count FROM sku WHERE product_id IS NULL;
        IF null_count > 0 THEN
            SELECT product_id INTO first_product_id FROM products ORDER BY product_id LIMIT 1;
            IF first_product_id IS NOT NULL THEN
                UPDATE sku SET product_id = first_product_id WHERE product_id IS NULL;
                RAISE NOTICE 'Populated product_id for % rows with product_id: %', null_count, first_product_id;
                RAISE NOTICE 'WARNING: All SKUs were assigned to the same product. Please review and update manually if needed.';
            ELSE
                RAISE NOTICE 'WARNING: No products found. Cannot populate product_id.';
            END IF;
        END IF;
    END IF;
END $$;

-- Verification query (optional - uncomment to check)
-- SELECT sku_id, sku_name, product_id 
-- FROM sku 
-- WHERE sku_name IS NULL OR product_id IS NULL;

