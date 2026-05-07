import { Entity, Column, ManyToOne, JoinColumn } from "typeorm";
import { BaseEntity } from "./Base.entity";
import { ObjectEntity } from "./object.entity";

/** Master list of fields per object — drives Field Permissions UI when user picks a table. */
@Entity("object_field_definitions")
export class ObjectFieldDefinition extends BaseEntity {
  @Column({ type: "varchar", length: 200 })
  fieldName: string;

  @Column({ type: "varchar", length: 50 })
  dataType: string;

  @Column({ type: "int", default: 0 })
  sortOrder: number;

  @Column({ type: "text", nullable: true })
  notes?: string;

  @Column({ default: true })
  isActive: boolean;

  @ManyToOne(() => ObjectEntity, (obj) => obj.fieldDefinitions, { onDelete: "CASCADE" })
  @JoinColumn({ name: "objectId" })
  object: ObjectEntity;
}
