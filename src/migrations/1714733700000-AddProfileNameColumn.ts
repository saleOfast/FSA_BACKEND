import { MigrationInterface, QueryRunner } from "typeorm";

export class AddProfileNameColumn1714733700000 implements MigrationInterface {
    name = 'AddProfileNameColumn1714733700000';

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Add column with NOT NULL constraint and default value in a single statement
        await queryRunner.query(`
            ALTER TABLE "profiles" 
            ADD COLUMN "profileName" character varying(100) NOT NULL DEFAULT 'Default Profile'`);
            
        // Remove the default after the column is added with values
        await queryRunner.query(`
            ALTER TABLE "profiles" 
            ALTER COLUMN "profileName" DROP DEFAULT`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "profiles" DROP COLUMN "profileName"`);
    }
}
