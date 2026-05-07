import { MigrationInterface, QueryRunner } from "typeorm";

export class AddObjectField1777957697226 implements MigrationInterface {
    name = 'AddObjectField1777957697226'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "field_permissions" DROP CONSTRAINT "FK_field_permissions_profile"`);
        await queryRunner.query(`ALTER TABLE "field_permissions" DROP CONSTRAINT "FK_field_permissions_object"`);
        await queryRunner.query(`ALTER TABLE "record_type_access" DROP CONSTRAINT "FK_record_type_access_profile"`);
        await queryRunner.query(`ALTER TABLE "record_type_access" DROP CONSTRAINT "FK_record_type_access_object"`);
        await queryRunner.query(`DROP INDEX "public"."UQ_field_permissions_natural"`);
        await queryRunner.query(`DROP INDEX "public"."UQ_record_type_access_natural"`);
        await queryRunner.query(`CREATE TABLE "object_field_definitions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "remarks" text, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "createdBy" text, "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedBy" text, "fieldName" character varying(200) NOT NULL, "dataType" character varying(50) NOT NULL, "sortOrder" integer NOT NULL DEFAULT '0', "notes" text, "isActive" boolean NOT NULL DEFAULT true, "objectId" uuid, CONSTRAINT "PK_ea5e92972b6da11d95c4ca044a9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "object_record_type_definitions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "remarks" text, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "createdBy" text, "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedBy" text, "recordTypeName" character varying(100) NOT NULL, "sortOrder" integer NOT NULL DEFAULT '0', "isActive" boolean NOT NULL DEFAULT true, "objectId" uuid, CONSTRAINT "PK_2eb5cd8252f272009b759afbd0a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "field_permissions" ADD CONSTRAINT "FK_082ce8ee60e01d9b25d19d6d113" FOREIGN KEY ("profileId") REFERENCES "profiles"("profileId") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "field_permissions" ADD CONSTRAINT "FK_cbbb7360f6652103d7af2bcc5f3" FOREIGN KEY ("objectId") REFERENCES "objects"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "record_type_access" ADD CONSTRAINT "FK_27c8ceaa0971faf6b68f5f98045" FOREIGN KEY ("profileId") REFERENCES "profiles"("profileId") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "record_type_access" ADD CONSTRAINT "FK_47e0a92c0032e9407d360727308" FOREIGN KEY ("objectId") REFERENCES "objects"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "object_field_definitions" ADD CONSTRAINT "FK_b2c87070ac88ec09800d3d7d521" FOREIGN KEY ("objectId") REFERENCES "objects"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "object_record_type_definitions" ADD CONSTRAINT "FK_8f9454f452607f6cbb943527837" FOREIGN KEY ("objectId") REFERENCES "objects"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "object_record_type_definitions" DROP CONSTRAINT "FK_8f9454f452607f6cbb943527837"`);
        await queryRunner.query(`ALTER TABLE "object_field_definitions" DROP CONSTRAINT "FK_b2c87070ac88ec09800d3d7d521"`);
        await queryRunner.query(`ALTER TABLE "record_type_access" DROP CONSTRAINT "FK_47e0a92c0032e9407d360727308"`);
        await queryRunner.query(`ALTER TABLE "record_type_access" DROP CONSTRAINT "FK_27c8ceaa0971faf6b68f5f98045"`);
        await queryRunner.query(`ALTER TABLE "field_permissions" DROP CONSTRAINT "FK_cbbb7360f6652103d7af2bcc5f3"`);
        await queryRunner.query(`ALTER TABLE "field_permissions" DROP CONSTRAINT "FK_082ce8ee60e01d9b25d19d6d113"`);
        await queryRunner.query(`DROP TABLE "object_record_type_definitions"`);
        await queryRunner.query(`DROP TABLE "object_field_definitions"`);
        await queryRunner.query(`CREATE UNIQUE INDEX "UQ_record_type_access_natural" ON "record_type_access" ("objectId", "profileId", "recordTypeName") `);
        await queryRunner.query(`CREATE UNIQUE INDEX "UQ_field_permissions_natural" ON "field_permissions" ("fieldName", "objectId", "profileId", "recordTypeName") `);
        await queryRunner.query(`ALTER TABLE "record_type_access" ADD CONSTRAINT "FK_record_type_access_object" FOREIGN KEY ("objectId") REFERENCES "objects"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "record_type_access" ADD CONSTRAINT "FK_record_type_access_profile" FOREIGN KEY ("profileId") REFERENCES "profiles"("profileId") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "field_permissions" ADD CONSTRAINT "FK_field_permissions_object" FOREIGN KEY ("objectId") REFERENCES "objects"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "field_permissions" ADD CONSTRAINT "FK_field_permissions_profile" FOREIGN KEY ("profileId") REFERENCES "profiles"("profileId") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
