-- Migration script to populate required columns for existing rows in inventory table
-- This script handles: sku_id and product_id

-- Step 1: Populate sku_id for existing rows
DO $$
DECLARE
    column_exists boolean;
    null_count integer;
    first_sku_id integer;
BEGIN
    SELECT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'inventory' AND column_name = 'sku_id'
    ) INTO column_exists;
    
    IF column_exists THEN
        SELECT COUNT(*) INTO null_count FROM inventory WHERE sku_id IS NULL;
        IF null_count > 0 THEN
            SELECT sku_id INTO first_sku_id FROM sku ORDER BY sku_id LIMIT 1;
            IF first_sku_id IS NOT NULL THEN
                UPDATE inventory SET sku_id = first_sku_id WHERE sku_id IS NULL;
                RAISE NOTICE 'Populated sku_id for % rows with sku_id: %', null_count, first_sku_id;
                RAISE NOTICE 'WARNING: All inventory items were assigned to the same SKU. Please review and update manually if needed.';
            ELSE
                RAISE NOTICE 'WARNING: No SKUs found. Cannot populate sku_id.';
            END IF;
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
        WHERE table_name = 'inventory' AND column_name = 'product_id'
    ) INTO column_exists;
    
    IF column_exists THEN
        SELECT COUNT(*) INTO null_count FROM inventory WHERE product_id IS NULL;
        IF null_count > 0 THEN
            -- Try to get product_id from sku table first (if sku_id exists)
            UPDATE inventory 
            SET product_id = (
                SELECT product_id FROM sku 
                WHERE sku.sku_id = inventory.sku_id 
                LIMIT 1
            )
            WHERE product_id IS NULL AND sku_id IS NOT NULL;
            
            -- For remaining rows without sku_id, use first available product
            SELECT COUNT(*) INTO null_count FROM inventory WHERE product_id IS NULL;
            IF null_count > 0 THEN
                SELECT product_id INTO first_product_id FROM products ORDER BY product_id LIMIT 1;
                IF first_product_id IS NOT NULL THEN
                    UPDATE inventory SET product_id = first_product_id WHERE product_id IS NULL;
                    RAISE NOTICE 'Populated product_id for % remaining rows with product_id: %', null_count, first_product_id;
                ELSE
                    RAISE NOTICE 'WARNING: No products found. Cannot populate product_id.';
                END IF;
            END IF;
            
            RAISE NOTICE 'Populated product_id for existing inventory rows';
        END IF;
    END IF;
END $$;

-- Verification query (optional - uncomment to check)
-- SELECT inventory_id, inventory_name, sku_id, product_id 
-- FROM inventory 
-- WHERE sku_id IS NULL OR product_id IS NULL;

