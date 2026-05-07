import { MigrationInterface, QueryRunner } from "typeorm";

export class AddObjectFieldDefinitions1778052500000 implements MigrationInterface {
  name = "AddObjectFieldDefinitions1778052500000";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "object_field_definitions" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "remarks" text,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "createdBy" text,
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedBy" text,
        "fieldName" character varying(200) NOT NULL,
        "dataType" character varying(50) NOT NULL,
        "sortOrder" integer NOT NULL DEFAULT 0,
        "notes" text,
        "isActive" boolean NOT NULL DEFAULT true,
        "objectId" uuid,
        CONSTRAINT "PK_object_field_definitions" PRIMARY KEY ("id"),
        CONSTRAINT "FK_object_field_definitions_object" FOREIGN KEY ("objectId") REFERENCES "objects"("id") ON DELETE CASCADE ON UPDATE NO ACTION
      )
    `);
    await queryRunner.query(`
      CREATE UNIQUE INDEX IF NOT EXISTS "UQ_object_field_definitions_object_field"
      ON "object_field_definitions" ("objectId", "fieldName")
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX IF EXISTS "public"."UQ_object_field_definitions_object_field"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "object_field_definitions"`);
  }
}
