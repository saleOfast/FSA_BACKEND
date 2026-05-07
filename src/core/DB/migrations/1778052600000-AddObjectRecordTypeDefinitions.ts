import { MigrationInterface, QueryRunner } from "typeorm";

export class AddObjectRecordTypeDefinitions1778052600000 implements MigrationInterface {
  name = "AddObjectRecordTypeDefinitions1778052600000";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "object_record_type_definitions" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "remarks" text,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "createdBy" text,
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedBy" text,
        "recordTypeName" character varying(100) NOT NULL,
        "sortOrder" integer NOT NULL DEFAULT 0,
        "isActive" boolean NOT NULL DEFAULT true,
        "objectId" uuid,
        CONSTRAINT "PK_object_record_type_definitions" PRIMARY KEY ("id"),
        CONSTRAINT "FK_object_record_type_definitions_object" FOREIGN KEY ("objectId") REFERENCES "objects"("id") ON DELETE CASCADE ON UPDATE NO ACTION
      )
    `);
    await queryRunner.query(`
      CREATE UNIQUE INDEX IF NOT EXISTS "UQ_object_record_type_definitions_object_name"
      ON "object_record_type_definitions" ("objectId", "recordTypeName")
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX IF EXISTS "public"."UQ_object_record_type_definitions_object_name"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "object_record_type_definitions"`);
  }
}
