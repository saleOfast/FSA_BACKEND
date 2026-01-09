# TypeORM Migrations Guide

This project now uses TypeORM migrations for database schema management.

## Setup

Migrations are configured and ready to use. The migration configuration is in `src/core/DB/data-source.ts`.

## Available Commands

### Generate a new migration from entity changes
```bash
npm run migration:generate src/core/DB/migrations/MigrationName
```
This will compare your entities with the database and generate a migration file.

### Create an empty migration file
```bash
npm run migration:create src/core/DB/migrations/MigrationName
```
Use this when you need to write custom SQL or complex migrations manually.

### Run pending migrations
```bash
npm run migration:run
```
Applies all pending migrations to the database.

### Revert the last migration
```bash
npm run migration:revert
```
Reverts the most recently executed migration.

### Show migration status
```bash
npm run migration:show
```
Shows which migrations have been executed and which are pending.

## Workflow

### For Local Development:
1. Make changes to your entity files
2. Generate migration: `npm run migration:generate src/core/DB/migrations/YourMigrationName`
3. Review the generated migration file
4. Run migration: `npm run migration:run`

### For Production/Staging:
1. Ensure `synchronize: false` in your environment config
2. Run migrations: `npm run migration:run`
3. Verify migration status: `npm run migration:show`

## Important Notes

- **Never edit existing migration files** - Create new migrations instead
- **Always review generated migrations** before running them
- **Test migrations in development** before applying to production
- **Keep migrations small and focused** - One logical change per migration
- **Backup your database** before running migrations in production

## Migration File Naming

Migration files are automatically named with a timestamp:
- Format: `TIMESTAMP-MigrationName.ts`
- Example: `1234567890123-AddUserEmailColumn.ts`

## Troubleshooting

### Migration fails to run
- Check database connection settings in `.env`
- Ensure you're using the correct environment (NODE_ENV)
- Verify migration files are compiled (run `npm run build`)

### Need to reset migrations
If you need to start fresh (development only):
1. Drop and recreate your database
2. Delete all migration files
3. Generate a new initial migration

## Best Practices

1. **Version Control**: Always commit migration files to git
2. **Order Matters**: Migrations run in chronological order
3. **Rollback Strategy**: Always test rollback before deploying
4. **Data Migrations**: Use separate migrations for data changes
5. **Review Changes**: Always review generated SQL before applying

