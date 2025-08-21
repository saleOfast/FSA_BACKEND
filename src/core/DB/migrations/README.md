# Database Migrations

This directory contains database migration scripts for the FSA Backend project.

## Warehouse User Names Migration

### Overview
Added new columns to the `warehouses` table to store both user ID and full name for:
- `created_by` / `created_by_name` - User who created the warehouse
- `last_modified_by` / `last_modified_by_name` - User who last modified the warehouse

### Files
- `add_warehouse_user_names.sql` - Migration script to add new columns
- `rollback_warehouse_user_names.sql` - Rollback script to remove new columns

### How to Apply

#### Option 1: Using psql command line
```bash
# Connect to your database
psql -h <host> -U <username> -d <database_name>

# Run the migration
\i src/core/DB/migrations/add_warehouse_user_names.sql
```

#### Option 2: Using pgAdmin or other GUI tool
1. Open the migration file in your database management tool
2. Execute the SQL commands

#### Option 3: Using TypeORM synchronize (if enabled)
If `synchronize: true` is enabled in your database configuration, TypeORM will automatically create the new columns when you restart the application.

### Verification
After running the migration, verify the changes:
```sql
-- Check if new columns exist
\d warehouses

-- Check if existing data was populated
SELECT warehouse_id, warehouse_name, created_by, created_by_name, 
       last_modified_by, last_modified_by_name 
FROM warehouses 
LIMIT 5;
```

### Rollback
If you need to revert the changes:
```bash
psql -h <host> -U <username> -d <database_name>
\i src/core/DB/migrations/rollback_warehouse_user_names.sql
```

### Notes
- The migration includes data population for existing records
- New columns are nullable to maintain backward compatibility
- The application code has been updated to populate both ID and name fields
- Existing functionality will continue to work as before
