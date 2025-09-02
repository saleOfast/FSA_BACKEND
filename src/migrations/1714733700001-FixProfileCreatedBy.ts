import { MigrationInterface, QueryRunner } from "typeorm";

export class FixProfileCreatedBy1714733700001 implements MigrationInterface {
    name = 'FixProfileCreatedBy1714733700001';

    public async up(queryRunner: QueryRunner): Promise<void> {
        // First, make the column nullable
        await queryRunner.query(`ALTER TABLE "profiles" ALTER COLUMN "createdBy" DROP NOT NULL`);
        
        // Set a default value for existing rows
        await queryRunner.query(`
            UPDATE "profiles" 
            SET "createdBy" = '{"id": 0, "name": "System"}' 
            WHERE "createdBy" IS NULL
        `);
        
        // Now make the column non-nullable again
        await queryRunner.query(`ALTER TABLE "profiles" ALTER COLUMN "createdBy" SET NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Revert the changes if needed
        await queryRunner.query(`ALTER TABLE "profiles" ALTER COLUMN "createdBy" DROP NOT NULL`);
    }
}
