import { Entity, Column, ManyToOne, JoinColumn } from "typeorm";
import { BaseEntity } from "./Base.entity";
import { ObjectEntity } from "./object.entity";
import { Profile } from "./profile.entity";

@Entity("field_permissions")
export class FieldPermission extends BaseEntity {
  @Column({ type: "varchar", length: 200 })
  fieldName: string;

  /** Empty string when not scoped to a record type */
  @Column({ type: "varchar", length: 100, default: "" })
  recordTypeName: string;

  @Column({ default: false })
  mandatory: boolean;

  @Column({ default: false })
  readOnly: boolean;

  @Column({ default: false })
  editable: boolean;

  @Column({ type: "text", nullable: true })
  notes?: string;

  @ManyToOne(() => Profile, (profile) => profile.fieldPermissions, { onDelete: "CASCADE" })
  @JoinColumn({ name: "profileId" })
  profile: Profile;

  @ManyToOne(() => ObjectEntity, (obj) => obj.fieldPermissions, { onDelete: "CASCADE" })
  @JoinColumn({ name: "objectId" })
  object: ObjectEntity;
}
