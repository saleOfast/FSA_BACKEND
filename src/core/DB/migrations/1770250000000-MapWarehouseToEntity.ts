import { MigrationInterface, QueryRunner } from "typeorm";

/**
 * Maps the warehouses table to match the Warehouse entity schema
 * and safely migrates status enum values.
 */
export class MapWarehouseToEntity1770250000000 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {

    /* ------------------------------------------------------------------
       1. CREATE SUPPORTING ENUMS (SAFE)
    ------------------------------------------------------------------ */

    await queryRunner.query(`
      DO $$ BEGIN
        CREATE TYPE ownership_type_enum AS ENUM ('COMPANY', 'DISTRIBUTOR');
      EXCEPTION WHEN duplicate_object THEN NULL;
      END $$;
    `);

    await queryRunner.query(`
      DO $$ BEGIN
        CREATE TYPE business_role_enum AS ENUM ('PLANT', 'PRIMARY');
      EXCEPTION WHEN duplicate_object THEN NULL;
      END $$;
    `);

    await queryRunner.query(`
      DO $$ BEGIN
        CREATE TYPE franchise_enum AS ENUM ('YES', 'NO');
      EXCEPTION WHEN duplicate_object THEN NULL;
      END $$;
    `);

    await queryRunner.query(`
      DO $$ BEGIN
        CREATE TYPE sez_enum AS ENUM ('YES', 'NO');
      EXCEPTION WHEN duplicate_object THEN NULL;
      END $$;
    `);

    await queryRunner.query(`
      DO $$ BEGIN
        CREATE TYPE customer_zone_enum AS ENUM ('NORTH', 'SOUTH', 'EAST', 'WEST');
      EXCEPTION WHEN duplicate_object THEN NULL;
      END $$;
    `);

    await queryRunner.query(`
      DO $$ BEGIN
        CREATE TYPE warehouses_status_enum AS ENUM ('DRAFT', 'ACTIVE', 'SUSPENDED', 'CLOSED');
      EXCEPTION WHEN duplicate_object THEN NULL;
      END $$;
    `);

    /* ------------------------------------------------------------------
       2. ADD / FIX CORE COLUMNS
    ------------------------------------------------------------------ */

    await queryRunner.query(`
      ALTER TABLE warehouses ADD COLUMN IF NOT EXISTS warehouse_code VARCHAR(30)
    `);

    await queryRunner.query(`
      UPDATE warehouses
      SET warehouse_code = LEFT('WH-' || warehouse_id::text, 30)
      WHERE warehouse_code IS NULL
    `);

    await queryRunner.query(`
      ALTER TABLE warehouses ALTER COLUMN warehouse_code SET NOT NULL
    `);

    await queryRunner.query(`
      ALTER TABLE warehouses DROP CONSTRAINT IF EXISTS uq_warehouse_code
    `);

    await queryRunner.query(`
      ALTER TABLE warehouses ADD CONSTRAINT uq_warehouse_code UNIQUE (warehouse_code)
    `);

    /* ------------------------------------------------------------------
       3. ADD BUSINESS / ADDRESS / FLAGS
    ------------------------------------------------------------------ */

    await queryRunner.query(`ALTER TABLE warehouses ADD COLUMN IF NOT EXISTS active_flag BOOLEAN DEFAULT true`);
    await queryRunner.query(`ALTER TABLE warehouses ADD COLUMN IF NOT EXISTS effective_from DATE`);
    await queryRunner.query(`ALTER TABLE warehouses ADD COLUMN IF NOT EXISTS effective_to DATE`);

    await queryRunner.query(`ALTER TABLE warehouses ADD COLUMN IF NOT EXISTS ownership_type ownership_type_enum`);
    await queryRunner.query(`ALTER TABLE warehouses ADD COLUMN IF NOT EXISTS business_role business_role_enum`);
    await queryRunner.query(`ALTER TABLE warehouses ADD COLUMN IF NOT EXISTS legal_entity_id INTEGER`);
    await queryRunner.query(`ALTER TABLE warehouses ADD COLUMN IF NOT EXISTS parent_partner_id INTEGER`);
    await queryRunner.query(`ALTER TABLE warehouses ADD COLUMN IF NOT EXISTS franchise franchise_enum`);

    await queryRunner.query(`ALTER TABLE warehouses ADD COLUMN IF NOT EXISTS shipping_country_id INTEGER`);
    await queryRunner.query(`ALTER TABLE warehouses ADD COLUMN IF NOT EXISTS shipping_state_id INTEGER`);
    await queryRunner.query(`ALTER TABLE warehouses ADD COLUMN IF NOT EXISTS shipping_district_id INTEGER`);
    await queryRunner.query(`ALTER TABLE warehouses ADD COLUMN IF NOT EXISTS shipping_street TEXT`);
    await queryRunner.query(`ALTER TABLE warehouses ADD COLUMN IF NOT EXISTS shipping_city VARCHAR(100)`);
    await queryRunner.query(`ALTER TABLE warehouses ADD COLUMN IF NOT EXISTS shipping_pin_code VARCHAR(20)`);

    await queryRunner.query(`ALTER TABLE warehouses ADD COLUMN IF NOT EXISTS gst_no VARCHAR(20)`);
    await queryRunner.query(`ALTER TABLE warehouses ADD COLUMN IF NOT EXISTS vat_registration_no VARCHAR(50)`);
    await queryRunner.query(`ALTER TABLE warehouses ADD COLUMN IF NOT EXISTS tax_registration_type VARCHAR(50)`);
    await queryRunner.query(`ALTER TABLE warehouses ADD COLUMN IF NOT EXISTS sez sez_enum`);
    await queryRunner.query(`ALTER TABLE warehouses ADD COLUMN IF NOT EXISTS custom_zone customer_zone_enum`);

    await queryRunner.query(`ALTER TABLE warehouses ADD COLUMN IF NOT EXISTS allows_sales BOOLEAN DEFAULT true`);
    await queryRunner.query(`ALTER TABLE warehouses ADD COLUMN IF NOT EXISTS allows_purchase BOOLEAN DEFAULT true`);
    await queryRunner.query(`ALTER TABLE warehouses ADD COLUMN IF NOT EXISTS allows_returns BOOLEAN DEFAULT true`);
    await queryRunner.query(`ALTER TABLE warehouses ADD COLUMN IF NOT EXISTS supports_batch BOOLEAN DEFAULT false`);
    await queryRunner.query(`ALTER TABLE warehouses ADD COLUMN IF NOT EXISTS supports_expiry BOOLEAN DEFAULT false`);
    await queryRunner.query(`ALTER TABLE warehouses ADD COLUMN IF NOT EXISTS supports_serial BOOLEAN DEFAULT false`);
    await queryRunner.query(`ALTER TABLE warehouses ADD COLUMN IF NOT EXISTS temperature_controlled BOOLEAN DEFAULT false`);
    await queryRunner.query(`ALTER TABLE warehouses ADD COLUMN IF NOT EXISTS cross_docking_flag BOOLEAN DEFAULT false`);
    await queryRunner.query(`ALTER TABLE warehouses ADD COLUMN IF NOT EXISTS consignment_flag BOOLEAN DEFAULT false`);

    await queryRunner.query(`ALTER TABLE warehouses ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP`);
    await queryRunner.query(`ALTER TABLE warehouses ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP`);

    /* ------------------------------------------------------------------
       4. 🔥 STATUS ENUM MIGRATION (CRITICAL FIX)
       Final enum set: DRAFT, ACTIVE, SUSPENDED, CLOSED
    ------------------------------------------------------------------ */
/* ------------------------------------------------------------------
   4. 🔥 STATUS ENUM MIGRATION (FIXED)
------------------------------------------------------------------ */

// Step 1: Detach column
await queryRunner.query(`
  ALTER TABLE warehouses
  ALTER COLUMN status TYPE TEXT
`);

// Step 2: Normalize old values
await queryRunner.query(`
  UPDATE warehouses SET status = 'CLOSED' WHERE status = 'INACTIVE'
`);

await queryRunner.query(`
  UPDATE warehouses SET status = 'DRAFT' WHERE status IS NULL
`);

// Step 3: Extend CORRECT enum
await queryRunner.query(`
  ALTER TYPE warehouses_status_enum ADD VALUE IF NOT EXISTS 'DRAFT'
`);

await queryRunner.query(`
  ALTER TYPE warehouses_status_enum ADD VALUE IF NOT EXISTS 'SUSPENDED'
`);

await queryRunner.query(`
  ALTER TYPE warehouses_status_enum ADD VALUE IF NOT EXISTS 'CLOSED'
`);

// Step 4: Re-bind column
await queryRunner.query(`
  ALTER TABLE warehouses
  ALTER COLUMN status
  TYPE warehouses_status_enum
  USING status::warehouses_status_enum
`);

await queryRunner.query(`
  ALTER TABLE warehouses
  ALTER COLUMN status SET DEFAULT 'DRAFT'
`);

    await queryRunner.query(`
      DO $$ BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_warehouses_shipping_country') THEN
          ALTER TABLE warehouses
          ADD CONSTRAINT fk_warehouses_shipping_country
          FOREIGN KEY (shipping_country_id) REFERENCES countries(country_id);
        END IF;
      END $$;
    `);

    await queryRunner.query(`
      DO $$ BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_warehouses_shipping_state') THEN
          ALTER TABLE warehouses
          ADD CONSTRAINT fk_warehouses_shipping_state
          FOREIGN KEY (shipping_state_id) REFERENCES states(state_id);
        END IF;
      END $$;
    `);

    await queryRunner.query(`
      DO $$ BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_warehouses_shipping_district') THEN
          ALTER TABLE warehouses
          ADD CONSTRAINT fk_warehouses_shipping_district
          FOREIGN KEY (shipping_district_id) REFERENCES districts(district_id);
        END IF;
      END $$;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE warehouses DROP CONSTRAINT IF EXISTS uq_warehouse_code`);
    await queryRunner.query(`ALTER TABLE warehouses DROP CONSTRAINT IF EXISTS fk_warehouses_shipping_country`);
    await queryRunner.query(`ALTER TABLE warehouses DROP CONSTRAINT IF EXISTS fk_warehouses_shipping_state`);
    await queryRunner.query(`ALTER TABLE warehouses DROP CONSTRAINT IF EXISTS fk_warehouses_shipping_district`);
    // Enum rollback intentionally skipped (Postgres limitation)
  }
}
