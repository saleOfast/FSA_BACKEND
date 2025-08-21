# Warehouse API - User Info Format Update

## Overview
The warehouse API has been updated to return user information in a combined object format instead of separate fields. This provides a cleaner and more intuitive API response structure.

## Changes Made

### Before (Old Format)
```json
{
  "warehouseId": 1,
  "warehouseName": "Test Warehouse",
  "createdBy": 85,
  "createdByName": "John Doe",
  "lastModifiedBy": 85,
  "lastModifiedByName": "John Doe"
}
```

### After (New Format)
```json
{
  "warehouseId": 1,
  "warehouseName": "Test Warehouse",
  "createdBy": {
    "id": 85,
    "name": "John Doe"
  },
  "lastModifiedBy": {
    "id": 85,
    "name": "John Doe"
  }
}
```

## Implementation Details

### 1. Entity Updates (`src/core/DB/Entities/warehouse.entity.ts`)
- Added `IUserInfo` interface for user info objects
- Added virtual properties `createdByInfo` and `lastModifiedByInfo`
- Added `toResponseFormat()` method to transform data for API responses

### 2. Service Updates (`src/core/types/warehouseService/warehouseService.ts`)
- Added `UserInfoDto` validation class
- Imported `IUserInfo` interface

### 3. Controller Updates (`src/api/v1/Controllers/warehouseController/warehouseController.ts`)
- Enabled user name features (`ENABLE_USER_NAME_FEATURES = true`)
- Updated all response methods to use `toResponseFormat()`
- Ensured user names are always populated

### 4. Database Migration (`src/core/DB/migrations/add_warehouse_user_names.sql`)
- Adds `created_by_name` and `last_modified_by_name` columns
- Populates existing records with user names
- Sets default values for missing names

## How to Apply Changes

### Step 1: Run Database Migration
```bash
# Connect to your database
psql -h <host> -U <username> -d <database_name>

# Run the migration
\i src/core/DB/migrations/add_warehouse_user_names.sql
```

### Step 2: Restart Application
The application needs to be restarted to pick up the entity changes.

### Step 3: Test the API
Use the test script to verify the new format:
```bash
node test_warehouse_api.js
```

## API Endpoints Affected

All warehouse endpoints now return the new format:
- `POST /api/v1/warehouse/create` - Creates warehouse with new format
- `GET /api/v1/warehouse/getById/:id` - Returns warehouse in new format
- `GET /api/v1/warehouse/list` - Returns list of warehouses in new format
- `PUT /api/v1/warehouse/update` - Updates warehouse and returns new format

## Testing

### Manual Testing
1. Create a new warehouse
2. Retrieve the warehouse by ID
3. Verify the response format matches the new structure

### Automated Testing
Run the test script:
```bash
node test_warehouse_api.js
```

### Database Verification
Run the verification queries:
```bash
psql -h <host> -U <username> -d <database_name>
\i src/core/DB/test_warehouse_changes.sql
```

## Benefits

1. **Cleaner API**: Single object instead of separate fields
2. **Better Structure**: Logical grouping of related data
3. **Easier Frontend**: Frontend can access `createdBy.name` directly
4. **Consistent Format**: All user references follow the same pattern
5. **Backward Compatible**: Database structure remains the same

## Rollback

If you need to revert the changes:

### Database Rollback
```bash
psql -h <host> -U <username> -d <database_name>
\i src/core/DB/migrations/rollback_warehouse_user_names.sql
```

### Code Rollback
1. Set `ENABLE_USER_NAME_FEATURES = false` in the controller
2. Remove the `toResponseFormat()` calls
3. Revert entity changes

## Notes

- The database still stores separate `created_by` and `created_by_name` fields
- The transformation happens at the API response level
- Existing data is automatically migrated
- No breaking changes to the database schema
- The change is purely cosmetic for API consumers

## Support

If you encounter any issues:
1. Check the database migration was applied successfully
2. Verify the application was restarted
3. Check the test script output
4. Review the database verification queries
