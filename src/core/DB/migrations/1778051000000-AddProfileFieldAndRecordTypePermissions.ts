import { MigrationInterface, QueryRunner } from "typeorm";

export class AddProfileFieldAndRecordTypePermissions1778051000000 implements MigrationInterface {
  name = "AddProfileFieldAndRecordTypePermissions1778051000000";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "profiles" ADD COLUMN IF NOT EXISTS "department" character varying(100)`
    );

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "field_permissions" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "remarks" text,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "createdBy" text,
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedBy" text,
        "fieldName" character varying(200) NOT NULL,
        "recordTypeName" character varying(100) NOT NULL DEFAULT '',
        "mandatory" boolean NOT NULL DEFAULT false,
        "readOnly" boolean NOT NULL DEFAULT false,
        "editable" boolean NOT NULL DEFAULT false,
        "notes" text,
        "profileId" integer,
        "objectId" uuid,
        CONSTRAINT "PK_field_permissions" PRIMARY KEY ("id"),
        CONSTRAINT "FK_field_permissions_profile" FOREIGN KEY ("profileId") REFERENCES "profiles"("profileId") ON DELETE CASCADE ON UPDATE NO ACTION,
        CONSTRAINT "FK_field_permissions_object" FOREIGN KEY ("objectId") REFERENCES "objects"("id") ON DELETE CASCADE ON UPDATE NO ACTION
      )
    `);
    await queryRunner.query(`
      CREATE UNIQUE INDEX IF NOT EXISTS "UQ_field_permissions_natural"
      ON "field_permissions" ("profileId", "objectId", "fieldName", "recordTypeName")
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "record_type_access" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "remarks" text,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "createdBy" text,
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedBy" text,
        "recordTypeName" character varying(100) NOT NULL,
        "canRead" boolean NOT NULL DEFAULT false,
        "canCreate" boolean NOT NULL DEFAULT false,
        "canEdit" boolean NOT NULL DEFAULT false,
        "canDelete" boolean NOT NULL DEFAULT false,
        "profileId" integer,
        "objectId" uuid,
        CONSTRAINT "PK_record_type_access" PRIMARY KEY ("id"),
        CONSTRAINT "FK_record_type_access_profile" FOREIGN KEY ("profileId") REFERENCES "profiles"("profileId") ON DELETE CASCADE ON UPDATE NO ACTION,
        CONSTRAINT "FK_record_type_access_object" FOREIGN KEY ("objectId") REFERENCES "objects"("id") ON DELETE CASCADE ON UPDATE NO ACTION
      )
    `);
    await queryRunner.query(`
      CREATE UNIQUE INDEX IF NOT EXISTS "UQ_record_type_access_natural"
      ON "record_type_access" ("profileId", "objectId", "recordTypeName")
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX IF EXISTS "public"."UQ_record_type_access_natural"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "record_type_access"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "public"."UQ_field_permissions_natural"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "field_permissions"`);
    await queryRunner.query(`ALTER TABLE "profiles" DROP COLUMN IF EXISTS "department"`);
  }
}
