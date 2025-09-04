import { Entity, Column, ManyToOne } from "typeorm";
import { BaseEntity } from "./Base.entity";
import { Profile } from "./profile.entity";

@Entity("system_permissions")
export class SystemPermission extends BaseEntity {
  @Column({ default: false })
  modifyAllData: boolean;

  @Column({ default: false })
  viewAllData: boolean;

  @Column({ default: false })
  manageUsers: boolean;

  @Column({ default: false })
  viewSetupAndConfiguration: boolean;

  @Column({ default: false })
  importData: boolean;

  // Relations
  @ManyToOne(() => Profile, (profile) => profile.systemPermissions, { onDelete: "CASCADE" })
  profile: Profile;
}
