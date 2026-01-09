import 'reflect-metadata';
import { AppDataSource } from '../core/DB/data-source';
import { writeFileSync } from 'fs';
import { join } from 'path';

/**
 * Script to generate initial migration SQL from current database schema
 * This captures the current state of the database so it can be recreated
 */
async function generateInitialMigration() {
	try {
		console.log('Connecting to database...');
		await AppDataSource.initialize();
		
		console.log('Generating schema SQL...');
		const queryRunner = AppDataSource.createQueryRunner();
		
		// Get all table names
		const tables = await queryRunner.getTables();
		
		let migrationSQL = `-- Initial Schema Migration
-- Generated from current database state
-- This migration recreates the entire database schema

`;

		// Generate CREATE TABLE statements for each table
		for (const table of tables) {
			if (table.name === 'typeorm_migrations') continue; // Skip migrations table
			
			migrationSQL += `-- Table: ${table.name}\n`;
			migrationSQL += `CREATE TABLE IF NOT EXISTS "${table.name}" (\n`;
			
			const columns: string[] = [];
			for (const column of table.columns) {
				let colDef = `  "${column.name}" ${column.type}`;
				
				if (column.isPrimary) {
					if (column.generationStrategy === 'increment') {
						colDef += ' SERIAL PRIMARY KEY';
					} else if (column.generationStrategy === 'uuid') {
						colDef += ' UUID PRIMARY KEY DEFAULT uuid_generate_v4()';
					} else {
						colDef += ' PRIMARY KEY';
					}
				} else {
					if (!column.isNullable && !column.isPrimary) {
						colDef += ' NOT NULL';
					}
					if (column.default !== undefined && column.default !== null) {
						colDef += ` DEFAULT ${column.default}`;
					}
				}
				
				columns.push(colDef);
			}
			
			migrationSQL += columns.join(',\n');
			migrationSQL += '\n);\n\n';
			
			// Add indexes
			for (const index of table.indices) {
				if (!index.isUnique) {
					migrationSQL += `CREATE INDEX IF NOT EXISTS "${index.name}" ON "${table.name}" (${index.columnNames.map(c => `"${c}"`).join(', ')});\n`;
				}
			}
			
			// Add foreign keys
			for (const fk of table.foreignKeys) {
				migrationSQL += `ALTER TABLE "${table.name}" ADD CONSTRAINT "${fk.name}" FOREIGN KEY (${fk.columnNames.map(c => `"${c}"`).join(', ')}) REFERENCES "${fk.referencedTableName}"(${fk.referencedColumnNames.map(c => `"${c}"`).join(', ')}) ON DELETE ${fk.onDelete || 'NO ACTION'} ON UPDATE ${fk.onUpdate || 'NO ACTION'};\n`;
			}
			
			migrationSQL += '\n';
		}
		
		// Write to file
		const outputPath = join(__dirname, '../core/DB/migrations/initial-schema.sql');
		writeFileSync(outputPath, migrationSQL);
		
		console.log(`✅ Initial schema SQL generated at: ${outputPath}`);
		console.log(`📝 Review the SQL file and use it to populate your migration`);
		
		await queryRunner.release();
		await AppDataSource.destroy();
	} catch (error) {
		console.error('Error generating migration:', error);
		process.exit(1);
	}
}

generateInitialMigration();

