import { Entity, Column, OneToMany } from "typeorm";
import { BaseEntity } from "./Base.entity";
import { ObjectPermission } from "./ObjectPermission.entity";
import { Tab } from "./Tab.entity";

@Entity("objects")
export class ObjectEntity extends BaseEntity {
  @Column({ length: 100 })
  name: string;

  @Column({ type: "text", nullable: true })
  helpText?: string;

  @Column({ default: false })
  allowReports: boolean;

  @Column({ default: false })
  allowActivity: boolean;

  @OneToMany(() => ObjectPermission, (permission) => permission.object)
  permissions: ObjectPermission[];

  @Column({ default: false })
  trackFieldHistory: boolean;

  @Column({ type: "text", nullable: true })
  dataType: string; // Auto Number, Text, etc.

  @Column({ type: "varchar", length: 50, nullable: true })
  displayFormat?: string;

  @Column({ type: "int", nullable: true })
  startingNumber?: number;

  @Column({ type: "int", nullable: true })
  lastAutoNumber?: number;

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: false })
  isDeleted: boolean;

  @Column({ default: false })
  isTabCreated: boolean;

  // Relations
  @OneToMany(() => ObjectPermission, (perm) => perm.object)
  objectPermissions: ObjectPermission[];

  @OneToMany(() => Tab, (tab) => tab.object)
  tabs: Tab[];
}
