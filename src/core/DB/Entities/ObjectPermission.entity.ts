  import { Entity, Column, ManyToOne } from "typeorm";
  import { BaseEntity } from "./Base.entity";
  import { ObjectEntity } from "./object.entity";
  import { Profile } from "./profile.entity";

  @Entity("object_permissions")
  export class ObjectPermission extends BaseEntity {
    @Column({ default: false })
    canCreate: boolean;

    @Column({ default: false })
    canRead: boolean;

    @Column({ default: false })
    canEdit: boolean;

    @Column({ default: false })
    canDelete: boolean;

    @Column({ default: false })
    canViewAll: boolean;

    @Column({ default: false })
    canModifyAll: boolean;

    // Relations
    @ManyToOne(() => Profile, (profile) => profile.objectPermissions, { onDelete: "CASCADE" })
    profile: Profile;

    @ManyToOne(() => ObjectEntity, (obj) => obj.permissions, { onDelete: "CASCADE" })
    object: ObjectEntity;
  }
