# Beat Table Migration Guide

## Overview
This guide explains all the fixes applied to resolve TypeORM synchronize errors when adding NOT NULL columns to the `beat` table that already contains data.

## Problem
TypeORM synchronize was failing because it tried to add NOT NULL columns to a table with existing rows. PostgreSQL cannot add NOT NULL columns to tables with existing data without providing default values.

## Solution Applied
All required columns in the `beat` entity have been made temporarily nullable to allow TypeORM to add them. Migration scripts have been created to populate existing rows with appropriate default values.

## Columns Fixed

### 1. `beat_code` (string, unique)
- **Status**: Made nullable temporarily
- **Migration**: `populate_beat_code.sql`
- **Default**: `BT-{beat_id}` (e.g., BT-000001)

### 2. `customer_id` (integer, foreign key)
- **Status**: Made nullable temporarily
- **Migration**: `populate_beat_customer_id.sql`
- **Default**: First available customer in the database

### 3. `beat_type` (enum: SALES, DELIVERY, COLLECTION)
- **Status**: Made nullable temporarily
- **Migration**: `populate_beat_type.sql`
- **Default**: `SALES`

### 4. `visit_frequency` (enum: DAILY, WEEKLY, FORTNIGHTLY, MONTHLY)
- **Status**: Made nullable temporarily
- **Migration**: `populate_beat_type.sql`
- **Default**: `WEEKLY`

### 5. `priority` (enum: HIGH, MEDIUM, LOW)
- **Status**: Made nullable temporarily
- **Migration**: `populate_beat_type.sql`
- **Default**: `MEDIUM`

### 6. `beat_name` (string)
- **Status**: Made nullable temporarily
- **Migration**: `populate_all_beat_columns.sql`
- **Default**: `Beat {beat_id}`

### 7. `country_id` (integer, foreign key)
- **Status**: Made nullable temporarily
- **Migration**: `populate_all_beat_columns.sql`
- **Default**: First available country

### 8. `state_id` (integer, foreign key)
- **Status**: Made nullable temporarily
- **Migration**: `populate_all_beat_columns.sql`
- **Default**: First available state

### 9. `district_id` (integer, foreign key)
- **Status**: Made nullable temporarily
- **Migration**: `populate_all_beat_columns.sql`
- **Default**: First available district

### 10. `created_by` (integer, foreign key to user)
- **Status**: Made nullable temporarily
- **Migration**: `populate_all_beat_columns.sql`
- **Default**: First available user

## Migration Steps

### Step 1: Start the Application
The application should now start successfully with all columns nullable.

### Step 2: Run Migration Scripts
Run the migration scripts in order:

```bash
# 1. Populate enum columns (beat_type, visit_frequency, priority)
psql -h <host> -U <username> -d <database_name> -f src/core/DB/migrations/populate_beat_type.sql

# 2. Populate beat_code
psql -h <host> -U <username> -d <database_name> -f src/core/DB/migrations/populate_beat_code.sql

# 3. Populate customer_id
psql -h <host> -U <username> -d <database_name> -f src/core/DB/migrations/populate_beat_customer_id.sql

# 4. Populate remaining columns (beat_name, country_id, state_id, district_id, created_by)
psql -h <host> -U <username> -d <database_name> -f src/core/DB/migrations/populate_all_beat_columns.sql
```

### Step 3: Review and Update Data
After running migrations, review the populated data:
- Check if default assignments are appropriate
- Update beats with correct customer assignments
- Update location fields (country, state, district) if needed
- Verify beat codes are unique and follow your naming convention

### Step 4: (Optional) Make Columns NOT NULL
If you want to enforce NOT NULL constraints:

1. Uncomment the NOT NULL sections in each migration script
2. Run the scripts again
3. Update the entity file to remove `nullable: true` from the columns

**Note**: Only do this after ensuring all rows have valid, non-null values.

## Entity File Changes

The `beat.entity.ts` file has been updated with `nullable: true` on all previously NOT NULL columns. After migrations are complete and data is verified, you can remove `nullable: true` to restore NOT NULL constraints.

## Important Notes

1. **Default Values**: The migration scripts use default values (first available record, etc.). You should review and update these manually if needed.

2. **Foreign Keys**: Foreign key columns (customer_id, country_id, etc.) require that the referenced tables have at least one record. Ensure your database has seed data before running migrations.

3. **Data Integrity**: After migrations, verify data integrity:
   ```sql
   SELECT beat_id, beat_name, beat_code, customer_id, 
          country_id, state_id, district_id, created_by,
          beat_type, visit_frequency, priority
   FROM beat
   WHERE beat_code IS NULL 
      OR customer_id IS NULL 
      OR country_id IS NULL 
      OR state_id IS NULL 
      OR district_id IS NULL 
      OR created_by IS NULL
      OR beat_type IS NULL
      OR visit_frequency IS NULL
      OR priority IS NULL;
   ```

4. **TypeORM Synchronize**: Consider disabling synchronize in production and using proper migrations instead.

## Rollback

If you need to rollback:
1. The columns are nullable, so existing data won't be lost
2. You can manually set columns back to NULL if needed
3. The entity changes can be reverted by removing `nullable: true`

## Support

If you encounter issues:
1. Check PostgreSQL logs for detailed error messages
2. Verify that referenced tables (customers, countries, states, districts, users) have data
3. Ensure migration scripts run in the correct order
4. Review the verification queries in each migration script

