import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  Repository,
} from "typeorm";
import { DbConnections } from "../postgresdb";
import { Profile } from "./profile.entity";
import { User } from  "./User.entity";
import { IUserReference } from "../../types/Profile/Profile.types";

@Entity({ name: "role" })
export class Role extends BaseEntity {
  @PrimaryGeneratedColumn({ name: "role_id" })
  roleId!: number;

  @Column({ name: "name", length: 100 })
  name!: string;

  @Column({ name: "profile_id", nullable: true })
  profileId!: number;

  @ManyToOne(() => Profile, { nullable: true })
  @JoinColumn({ name: "profile_id" })
  profile?: Profile;

  @Column({ name: "parent_role_id", nullable: true })
  parentRoleId?: number | null;

  @ManyToOne(() => Role, (r) => r.children, { nullable: true })
  @JoinColumn({ name: "parent_role_id" })
  parent?: Role;

  @OneToMany(() => Role, (r) => r.parent)
  children?: Role[];

  @Column({ type: "text", nullable: true })
  description?: string;

  @Column({ name: "is_deleted", default: false })
  isDeleted!: boolean;

  @Column({ name: "is_active", default: true })
  isActive!: boolean;

@Column({
  name: "created_by",
  type: "jsonb",
  nullable: true
})
createdBy?: IUserReference;

@Column({
  name: "modified_by",
  type: "jsonb",
  nullable: true
})
modifiedBy?: IUserReference;

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt!: Date;

  @OneToMany(() => User, (u) => u.role)
  users?: User[];


}

export const RoleRepository = (): Repository<Role> => {
  return DbConnections.AppDbConnection.getConnection().getRepository(Role);
};