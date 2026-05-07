import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany 
} from "typeorm";
import { User } from "./User.entity";
import { IProfile, IUserReference } from "../../types/Profile/Profile.types";
import { ObjectPermission } from "./ObjectPermission.entity";
import { TabPermission } from "./TabPermission.entity";
import { SystemPermission } from "./systemPermission.entity";
import { FieldPermission } from "./FieldPermission.entity";
import { RecordTypeAccess } from "./RecordTypeAccess.entity";


@Entity({ name: "profiles" })
export class Profile implements IProfile {
  @PrimaryGeneratedColumn()
  profileId!: number;

  @Column({ type: "varchar", length: 100 })
  profileName!: string;

  @Column({ type: "varchar", length: 50 })
  userLicence!: string;

  @Column({ type: "text", nullable: true })
  remarks?: string;

  @Column({ type: "varchar", length: 100, nullable: true })
  department?: string;

  @Column({ type: "boolean", default: false })
  isDeleted!: boolean;

  @CreateDateColumn({ name: 'createdDate', type: "timestamp" })
  createdDate!: Date;

  @OneToMany(() => User, (user) => user.profile)
  users: User[];

  @Column({ type: 'jsonb', nullable: false })
  createdBy!: IUserReference;

  @UpdateDateColumn({ type: 'timestamp', nullable: true })
  modifiedDate?: Date;

  @Column({ type: 'jsonb', nullable: true })
  modifiedBy?: IUserReference;

   // Relations
   @OneToMany(() => ObjectPermission, (perm) => perm.profile)
   objectPermissions: ObjectPermission[];
 
   @OneToMany(() => TabPermission, (perm) => perm.profile)
   tabPermissions: TabPermission[];
 
   @OneToMany(() => SystemPermission, (perm) => perm.profile)
   systemPermissions: SystemPermission[];

   @OneToMany(() => FieldPermission, (perm) => perm.profile)
   fieldPermissions: FieldPermission[];

   @OneToMany(() => RecordTypeAccess, (perm) => perm.profile)
   recordTypeAccesses: RecordTypeAccess[];

  // Helper method to set createdBy from a User entity
  setCreatedByUser(user: User) {
    this.createdBy = {
      id: user.emp_id,
      name: `${user.firstname} ${user.lastname || ''}`.trim()
    };
  }

  // Helper method to set modifiedBy from a User entity
  setModifiedByUser(user: User) {
    this.modifiedBy = {
      id: user.emp_id,
      name: `${user.firstname} ${user.lastname || ''}`.trim()
    };
  }
}