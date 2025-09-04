import { Entity, Column, ManyToOne } from "typeorm";
import { BaseEntity } from "./Base.entity";
import { Tab } from "./Tab.entity";
import { Profile } from "./profile.entity";

@Entity("tab_permissions")
export class TabPermission extends BaseEntity {
  @Column({ default: false })
  isVisible: boolean;

  @Column({ default: false })
  isAvailable: boolean;

  // Relations
  @ManyToOne(() => Tab, (tab) => tab.tabPermissions, { onDelete: "CASCADE" })
  tab: Tab;

  @ManyToOne(() => Profile, (profile) => profile.tabPermissions, { onDelete: "CASCADE" })
  profile: Profile;
}
