import { MigrationInterface, QueryRunner } from "typeorm";

export class AddBeatRelation1774429032463 implements MigrationInterface {
    name = 'AddBeatRelation1774429032463'

    public async up(queryRunner: QueryRunner): Promise<void> {

        // ✅ Add column safely (no duplicate error)
        await queryRunner.query(`
          ALTER TABLE "states"
          ADD COLUMN IF NOT EXISTS "is_deleted" boolean NOT NULL DEFAULT false
        `);

        // ✅ Make beat_id nullable (required for SET NULL)
        await queryRunner.query(`
          ALTER TABLE "scheme"
          ALTER COLUMN "beat_id" DROP NOT NULL
        `);

        // ❌ DO NOT add FK again (already exists in DB)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {

        // ⚠️ Only revert what we changed

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