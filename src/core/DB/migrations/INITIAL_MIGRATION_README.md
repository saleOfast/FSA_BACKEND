# Initial Schema Migration

## Overview

The `1767714228665-InitialSchema.ts` migration file captures your current database schema state. This migration allows you to recreate your entire database schema from scratch on a fresh database.

## What This Migration Does

✅ **Creates all tables** based on your entity definitions  
✅ **Creates all indexes** defined in your entities  
✅ **Creates all foreign keys** and relationships  
✅ **Skips existing tables** - Safe to run on databases that already have tables  
✅ **Rollback support** - Can drop all tables if needed

## Current Status

- **Migration File**: `1767714228665-InitialSchema.ts`
- **Status**: Created but not yet executed
- **Database State**: Your current database already has all tables (created via synchronize)

## How to Use

### For Fresh Database Setup

1. **Create a new database:**
   ```sql
   CREATE DATABASE your_database_name;
   ```

2. **Update your `.env` file** with the new database credentials

3. **Run the migration:**
   ```bash
   npm run migration:run
   ```

   This will create all tables, indexes, and foreign keys.

4. **Run seed data (optional):**
   ```bash
   npm run seed
   ```

### For Existing Database

Since your database already exists with all tables:

1. **Mark the migration as executed** (without actually running it):
   ```bash
   # This will skip the migration since tables already exist
   npm run migration:run
   ```

   The migration will detect existing tables and skip them, but mark the migration as executed in the `typeorm_migrations` table.

2. **Future migrations** will then be incremental changes.

## Verification

Check migration status:
```bash
npm run migration:show
```

You should see:
```
[X] InitialSchema1767714228665  (after running)
```

## Important Notes

⚠️ **This migration is idempotent** - It checks if tables exist before creating them, so it's safe to run multiple times.

⚠️ **For production**, always test migrations on a staging environment first.

⚠️ **Backup your database** before running migrations in production.

## Next Steps

1. ✅ Initial migration created
2. ⏭️ Run migration to mark it as executed: `npm run migration:run`
3. ⏭️ Future schema changes will generate new incremental migrations
4. ⏭️ Disable `synchronize` in production and use migrations only

## Rollback

If you need to rollback this migration:

```bash
npm run migration:revert
```

**Warning**: This will drop all tables! Make sure you have a backup.

