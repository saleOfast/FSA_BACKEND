import { MigrationInterface, QueryRunner, Table, TableColumn, TableIndex, TableForeignKey } from "typeorm";
import { AppDataSource } from "../data-source";

/**
 * Initial Schema Migration
 * 
 * This migration captures the current database schema state.
 * It creates all tables, indexes, and foreign keys based on entity definitions.
 * 
 * NOTE: Since your database already exists and matches your entities,
 * this migration will skip existing tables. When setting up a fresh database,
 * this migration will create all tables from scratch.
 */
export class InitialSchema1767714228665 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Initialize DataSource to get entity metadata
        if (!AppDataSource.isInitialized) {
            await AppDataSource.initialize();
        }

        // Get all entity metadatas
        const entityMetadatas = AppDataSource.entityMetadatas;
        
        console.log(`📊 Found ${entityMetadatas.length} entities to process...`);

        // Step 1: Create all tables first (without foreign keys)
        const tablesCreated: string[] = [];
        const foreignKeysToCreate: Array<{tableName: string, fk: TableForeignKey}> = [];
        const enumDefaultsToAdd: Array<{tableName: string, columnName: string, defaultValue: string}> = [];
        const jsonDefaultsToAdd: Array<{tableName: string, columnName: string, defaultValue: string}> = [];
        
        for (const metadata of entityMetadatas) {
            const tableName = metadata.tableName;
            
            // Check if table already exists
            const tableExists = await queryRunner.hasTable(tableName);
            if (tableExists) {
                console.log(`⏭️  Table "${tableName}" already exists, skipping...`);
                continue;
            }

            try {
                // Get the driver to normalize types properly
                const driver = queryRunner.connection.driver;
                
                // Convert entity metadata to Table schema
                const columns = metadata.columns.map(col => {
                    const column = new TableColumn();
                    column.name = col.databaseName;
                    
                    // Get proper database type from column metadata
                    // TypeORM stores the type as a string in most cases
                    let colType: string = '';
                    
                    if (typeof col.type === 'string') {
                        colType = col.type;
                    } else {
                        // For constructor types, extract the name and map to PostgreSQL types
                        const typeName = (col.type as any)?.name || String(col.type);
                        const typeMap: Record<string, string> = {
                            'Number': 'integer',
                            'String': 'varchar',
                            'Boolean': 'boolean',
                            'Date': 'timestamp',
                            'Float': 'float',
                            'Double': 'double precision',
                        };
                        colType = typeMap[typeName] || 'varchar';
                    }
                    
                    // Special handling for primary generated columns
                    if (col.isPrimary && col.generationStrategy === 'increment' && !colType) {
                        colType = 'integer';
                    } else if (col.isPrimary && col.generationStrategy === 'uuid' && !colType) {
                        colType = 'uuid';
                    }
                    
                    // Ensure we always have a type
                    if (!colType || colType === 'undefined' || colType === 'null') {
                        colType = 'varchar';
                    }
                    
                    // Remove length from type string if present (length is a separate property)
                    const lengthMatch = colType.match(/^(\w+)\((\d+)\)$/);
                    if (lengthMatch) {
                        colType = lengthMatch[1];
                        // Length is already set from col.length below, so we don't need to set it here
                    }
                    
                    // Check if this is an enum type column
                    const isEnumColumn = col.enum && col.enum.length > 0;
                    // Check if this is a JSON type column
                    const isJsonColumn = colType === 'json' || colType === 'jsonb' || 
                                        (typeof col.type === 'string' && (col.type === 'json' || col.type === 'jsonb'));
                    
                    column.type = colType;
                    column.isPrimary = col.isPrimary;
                    column.isNullable = col.isNullable;
                    
                    // Check if column is unique by looking at indices
                    column.isUnique = metadata.indices.some(idx => 
                        idx.isUnique && idx.columns.length === 1 && idx.columns[0].databaseName === col.databaseName
                    );
                    
                    // Handle default values - convert functions to SQL strings
                    if (col.default !== undefined && col.default !== null) {
                        if (typeof col.default === 'function') {
                            // For functions like () => 'CURRENT_TIMESTAMP', extract the SQL
                            const defaultStr = String(col.default);
                            if (defaultStr.includes('CURRENT_TIMESTAMP')) {
                                column.default = 'CURRENT_TIMESTAMP';
                            } else if (defaultStr.includes('uuid_generate_v4')) {
                                column.default = 'uuid_generate_v4()';
                            } else {
                                // Try to extract the value from the function
                                // Handle JSON defaults like () => "'[]'" or () => "'{}'"
                                const jsonMatch = defaultStr.match(/['"]([^'"]+)['"]/);
                                if (jsonMatch) {
                                    const extractedValue = jsonMatch[1];
                                    // For JSON columns, defer default to ALTER TABLE (TypeORM doesn't handle them properly)
                                    if (isJsonColumn) {
                                        // Store JSON default to add later via ALTER TABLE
                                        jsonDefaultsToAdd.push({
                                            tableName: tableName,
                                            columnName: col.databaseName,
                                            defaultValue: extractedValue
                                        });
                                        // Don't set default in column definition
                                        column.default = undefined;
                                    } else {
                                        column.default = extractedValue;
                                    }
                                } else {
                                    column.default = undefined;
                                }
                            }
                        } else {
                            // For enum columns, don't set default in TableColumn (TypeORM doesn't quote them properly)
                            // We'll add enum defaults manually after table creation
                            if (isEnumColumn) {
                                // Store enum default to add later via ALTER TABLE
                                enumDefaultsToAdd.push({
                                    tableName: tableName,
                                    columnName: col.databaseName,
                                    defaultValue: String(col.default)
                                });
                                // Don't set default in column definition
                                column.default = undefined;
                            } else {
                                // For other types, pass the default as-is
                                const defaultVal = col.default;
                                // Numbers, booleans, and SQL expressions can be passed as-is
                                if (typeof defaultVal === 'number' || typeof defaultVal === 'boolean') {
                                    column.default = defaultVal;
                                } else {
                                    // String defaults
                                    column.default = String(defaultVal);
                                }
                            }
                        }
                    }
                    
                    // Store enum info for later use
                    if (isEnumColumn && col.enum) {
                        column.enum = col.enum.map(e => String(e));
                    }
                    
                    column.length = col.length;
                    column.precision = col.precision;
                    column.scale = col.scale;
                    column.isGenerated = col.isGenerated;
                    column.generationStrategy = col.generationStrategy;
                    
                    // Convert enum to string array
                    column.enum = col.enum ? col.enum.map(e => String(e)) : undefined;
                    
                    return column;
                });

                const table = new Table({
                    name: tableName,
                    columns: columns,
                });

                await queryRunner.createTable(table, true);
                tablesCreated.push(tableName);
                
                // Create indexes
                for (const indexMetadata of metadata.indices) {
                    const index = new TableIndex({
                        name: indexMetadata.name,
                        columnNames: indexMetadata.columns.map(c => c.databaseName),
                        isUnique: indexMetadata.isUnique,
                    });
                    await queryRunner.createIndex(tableName, index);
                }

                // Store foreign keys to create later
                for (const fkMetadata of metadata.foreignKeys) {
                    const fk = new TableForeignKey({
                        name: fkMetadata.name,
                        columnNames: fkMetadata.columns.map(c => c.databaseName),
                        referencedTableName: fkMetadata.referencedTablePath,
                        referencedColumnNames: fkMetadata.referencedColumns.map(c => c.databaseName),
                        onDelete: fkMetadata.onDelete,
                        onUpdate: fkMetadata.onUpdate,
                    });
                    foreignKeysToCreate.push({ tableName, fk });
                }

                console.log(`✅ Created table: "${tableName}"`);
            } catch (error) {
                console.error(`❌ Error creating table "${tableName}":`, error);
                throw error; // Stop on error to maintain transaction integrity
            }
        }

        // Step 2: Add enum and JSON defaults (must be done before foreign keys)
        console.log(`\n📝 Adding ${enumDefaultsToAdd.length} enum defaults...`);
        for (const { tableName, columnName, defaultValue } of enumDefaultsToAdd) {
            try {
                // Use ALTER TABLE to add enum default with proper quoting
                await queryRunner.query(
                    `ALTER TABLE "${tableName}" ALTER COLUMN "${columnName}" SET DEFAULT '${defaultValue.replace(/'/g, "''")}'`
                );
                console.log(`✅ Added enum default to "${tableName}"."${columnName}": '${defaultValue}'`);
            } catch (error) {
                console.error(`❌ Error adding enum default to "${tableName}"."${columnName}":`, error);
                // Continue with other defaults
            }
        }

        console.log(`\n📝 Adding ${jsonDefaultsToAdd.length} JSON defaults...`);
        for (const { tableName, columnName, defaultValue } of jsonDefaultsToAdd) {
            try {
                // Use ALTER TABLE to add JSON default with proper quoting
                // JSON defaults must be quoted strings in PostgreSQL
                await queryRunner.query(
                    `ALTER TABLE "${tableName}" ALTER COLUMN "${columnName}" SET DEFAULT '${defaultValue.replace(/'/g, "''")}'::json`
                );
                console.log(`✅ Added JSON default to "${tableName}"."${columnName}": '${defaultValue}'`);
            } catch (error) {
                console.error(`❌ Error adding JSON default to "${tableName}"."${columnName}":`, error);
                // Continue with other defaults
            }
        }

        // Step 3: Create all foreign keys after all tables exist
        console.log(`\n🔗 Creating ${foreignKeysToCreate.length} foreign keys...`);
        for (const { tableName, fk } of foreignKeysToCreate) {
            try {
                // Check if referenced table exists
                const refTableExists = await queryRunner.hasTable(fk.referencedTableName);
                if (!refTableExists) {
                    console.log(`⚠️  Skipping FK "${fk.name}" - referenced table "${fk.referencedTableName}" does not exist`);
                    continue;
                }
                
                await queryRunner.createForeignKey(tableName, fk);
                console.log(`✅ Created foreign key: "${fk.name}" on "${tableName}"`);
            } catch (error) {
                console.error(`❌ Error creating foreign key "${fk.name}" on "${tableName}":`, error);
                // Continue with other foreign keys
            }
        }

        console.log('✅ Initial schema migration completed successfully!');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Initialize DataSource to get entity metadata
        if (!AppDataSource.isInitialized) {
            await AppDataSource.initialize();
        }

        // Get all entity metadatas in reverse order (to handle foreign key dependencies)
        const entityMetadatas = [...AppDataSource.entityMetadatas].reverse();
        
        console.log(`🗑️  Dropping ${entityMetadatas.length} tables...`);

        // Drop tables in reverse order to handle foreign key dependencies
        for (const metadata of entityMetadatas) {
            const tableName = metadata.tableName;
            
            // Skip migrations table
            if (tableName === 'typeorm_migrations') {
                continue;
            }
            
            const tableExists = await queryRunner.hasTable(tableName);
            if (tableExists) {
                try {
                    await queryRunner.dropTable(tableName, true, true, true);
                    console.log(`✅ Dropped table: "${tableName}"`);
                } catch (error) {
                    console.error(`❌ Error dropping table "${tableName}":`, error);
                    // Continue with other tables even if one fails
                }
            }
        }

        console.log('✅ Schema rollback completed!');
    }

}
