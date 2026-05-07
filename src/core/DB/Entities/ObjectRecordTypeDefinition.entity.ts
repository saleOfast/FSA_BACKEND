import { Entity, Column, ManyToOne, JoinColumn } from "typeorm";
import { BaseEntity } from "./Base.entity";
import { ObjectEntity } from "./object.entity";

/** Picklist of record types per object (e.g. Customer → GT, MT) for Record Type Access + field filters. */
@Entity("object_record_type_definitions")
export class ObjectRecordTypeDefinition extends BaseEntity {
  @Column({ type: "varchar", length: 100 })
  recordTypeName: string;

  @Column({ type: "int", default: 0 })
  sortOrder: number;

  @Column({ default: true })
  isActive: boolean;

  @ManyToOne(() => ObjectEntity, (obj) => obj.recordTypeDefinitions, { onDelete: "CASCADE" })
  @JoinColumn({ name: "objectId" })
  object: ObjectEntity;
}
