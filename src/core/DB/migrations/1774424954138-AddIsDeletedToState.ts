import { MigrationInterface, QueryRunner } from "typeorm";

export class AddIsDeletedToState1774424954138 implements MigrationInterface {
    name = 'AddIsDeletedToState1774424954138'

    public async up(queryRunner: QueryRunner): Promise<void> {

        // ✅ Safe column creation
        await queryRunner.query(`
            ALTER TABLE "states"
            ADD COLUMN IF NOT EXISTS "is_deleted" boolean NOT NULL DEFAULT false
        `);

        // ❌ REMOVE this (already exists)
        // product_id FK — DO NOT ADD AGAIN

        // ✅ Fix beat_id relation (only if needed)
        await queryRunner.query(`
            ALTER TABLE "scheme"
            ALTER COLUMN "beat_id" DROP NOT NULL
        `);

        await queryRunner.query(`
            ALTER TABLE "scheme"
            ADD CONSTRAINT "FK_91afa6c5d730e2abc1cad0d2d3e"
            FOREIGN KEY ("beat_id")
            REFERENCES "beat"("beat_id")
            ON DELETE SET NULL
            ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {

        await queryRunner.query(`
            ALTER TABLE "scheme"
            DROP CONSTRAINT "FK_91afa6c5d730e2abc1cad0d2d3e"
        `);

        await queryRunner.query(`
            ALTER TABLE "scheme"
            ALTER COLUMN "beat_id" SET NOT NULL
        `);

        await queryRunner.query(`
            ALTER TABLE "states"
            DROP COLUMN "is_deleted"
        `);
    }
}