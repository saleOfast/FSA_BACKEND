import { Entity, Column, ManyToOne, JoinColumn } from "typeorm";
import { BaseEntity } from "./Base.entity";
import { ObjectEntity } from "./object.entity";
import { Profile } from "./profile.entity";

@Entity("record_type_access")
export class RecordTypeAccess extends BaseEntity {
  @Column({ type: "varchar", length: 100 })
  recordTypeName: string;

  @Column({ default: false })
  canRead: boolean;

  @Column({ default: false })
  canCreate: boolean;

  @Column({ default: false })
  canEdit: boolean;

  @Column({ default: false })
  canDelete: boolean;

  @ManyToOne(() => Profile, (profile) => profile.recordTypeAccesses, { onDelete: "CASCADE" })
  @JoinColumn({ name: "profileId" })
  profile: Profile;

  @ManyToOne(() => ObjectEntity, (obj) => obj.recordTypeAccesses, { onDelete: "CASCADE" })
  @JoinColumn({ name: "objectId" })
  object: ObjectEntity;
}
