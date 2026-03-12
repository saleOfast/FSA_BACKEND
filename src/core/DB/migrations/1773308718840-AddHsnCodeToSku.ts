import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddHsnCodeToSku1773308718840 implements MigrationInterface {
    name = 'AddHsnCodeToSku1773308718840'

   
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn(
            "sku",
            new TableColumn({
                name: "hsn_code",
                type: "varchar",
                length: "20",
                isNullable: true
            })
        );
    }

            public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn("sku", "hsn_code");
    }

}
