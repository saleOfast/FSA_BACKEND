import { Entity, Column, ManyToOne } from "typeorm";
import { BaseEntity } from "./Base.entity";
import { Tab } from "./Tab.entity";
import { Profile } from "./profile.entity";

@Entity("tab_permissions")
export class TabPermission extends BaseEntity {
  /** DB column legacy name; maps to UI "Read Only" for the tab */
  @Column({ name: "isVisible", default: false })
  readOnly: boolean;

  /** DB column legacy name; maps to UI "Default On" (tab shown by default) */
  @Column({ name: "isAvailable", default: false })
  defaultOn: boolean;

  // Relations
  @ManyToOne(() => Tab, (tab) => tab.tabPermissions, { onDelete: "CASCADE" })
  tab: Tab;

  @ManyToOne(() => Profile, (profile) => profile.tabPermissions, { onDelete: "CASCADE" })
  profile: Profile;
}
