# Using Migrations in Local Development

Yes, you can use migrations in your local environment! Here's how:

## Option 1: Enable Migrations via Environment Variable (Recommended)

Add this to your `.env` file:

```env
USE_MIGRATIONS=true
LOCAL_IS_SYNCHRONIZE=false
```

This will:
- Disable `synchronize` (auto-sync)
- Enable migrations support
- Use the same migration workflow as production

## Option 2: Keep Synchronize for Local, Use Migrations for Production

If you want to keep auto-sync for local development but use migrations for production:

**Local (.env):**
```env
USE_MIGRATIONS=false
LOCAL_IS_SYNCHRONIZE=true
```

**Production (.env):**
```env
USE_MIGRATIONS=true
IS_SYNCHRONIZE=false
```

## Workflow for Local Development with Migrations

1. **Make changes to your entities** (add columns, tables, etc.)

2. **Generate a migration:**
   ```bash
   npm run migration:generate src/core/DB/migrations/YourMigrationName
   ```

3. **Review the generated migration file** in `src/core/DB/migrations/`

4. **Run the migration:**
   ```bash
   npm run migration:run
   ```

5. **Start your app:**
   ```bash
   npm run dev
   ```

## Auto-Run Migrations on App Start (Optional)

If you want migrations to run automatically when your app starts, you can set `migrationsRun: true` in `postgresdb.ts`. However, it's recommended to run migrations manually for better control.

## Benefits of Using Migrations in Local

✅ **Consistent workflow** - Same process for local and production  
✅ **Version control** - Track all schema changes in git  
✅ **Safer changes** - Review migrations before applying  
✅ **Rollback capability** - Easy to revert changes  
✅ **Team collaboration** - Everyone uses the same schema

## Quick Start

1. Set `USE_MIGRATIONS=true` in your `.env`
2. Set `LOCAL_IS_SYNCHRONIZE=false` in your `.env`
3. Generate your first migration: `npm run migration:generate src/core/DB/migrations/InitialMigration`
4. Run it: `npm run migration:run`
5. Start developing!

## Troubleshooting

**Migration fails?**
- Make sure your database is running
- Check your `.env` database credentials
- Verify `NODE_ENV=local` is set correctly

**Want to reset?**
- Drop your local database
- Delete migration files
- Generate a fresh initial migration

