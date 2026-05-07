import { Entity, Column, OneToMany } from "typeorm";
import { BaseEntity } from "./Base.entity";
import { ObjectPermission } from "./ObjectPermission.entity";
import { Tab } from "./Tab.entity";
import { FieldPermission } from "./FieldPermission.entity";
import { RecordTypeAccess } from "./RecordTypeAccess.entity";
import { ObjectFieldDefinition } from "./ObjectFieldDefinition.entity";
import { ObjectRecordTypeDefinition } from "./ObjectRecordTypeDefinition.entity";

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

  @OneToMany(() => FieldPermission, (fp) => fp.object)
  fieldPermissions: FieldPermission[];

  @OneToMany(() => RecordTypeAccess, (r) => r.object)
  recordTypeAccesses: RecordTypeAccess[];

  @OneToMany(() => ObjectFieldDefinition, (d) => d.object)
  fieldDefinitions: ObjectFieldDefinition[];

  @OneToMany(() => ObjectRecordTypeDefinition, (d) => d.object)
  recordTypeDefinitions: ObjectRecordTypeDefinition[];
}
