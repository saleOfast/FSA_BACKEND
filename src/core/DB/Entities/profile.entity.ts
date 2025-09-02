import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToOne
} from "typeorm";
import { User } from "./User.entity";
import { IProfile, IUserReference } from "../../types/Profile/Profile.types";

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

  @CreateDateColumn({ type: "timestamp" })
  createdDate!: Date;

  @Column({ type: 'jsonb', nullable: false })
  createdBy!: IUserReference;

  @UpdateDateColumn({ type: 'timestamp', nullable: true })
  modifiedDate?: Date;

  @Column({ type: 'jsonb', nullable: true })
  modifiedBy?: IUserReference;

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