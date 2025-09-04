import { Entity, Column, ManyToOne, OneToMany } from "typeorm";
import { BaseEntity } from "././Base.entity";
import { ObjectEntity } from "./object.entity";
import { TabPermission } from "../Entities/TabPermission.entity";

@Entity("tabs")
export class Tab extends BaseEntity {
  @Column({ length: 100 })
  name: string;

  @Column({ type: "uuid", nullable: true })
  pageId?: string; // For custom pages

  @Column({ type: "int", nullable: true })
  orderNumber?: number;

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: false })
  isDeleted: boolean;

  // Relations
  @ManyToOne(() => ObjectEntity, (obj) => obj.tabs, { nullable: true })
  object: ObjectEntity;

  @OneToMany(() => TabPermission, (perm) => perm.tab)
  tabPermissions: TabPermission[];
}
