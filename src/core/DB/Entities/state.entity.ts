import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  Repository,
  ManyToOne,
  JoinColumn
} from "typeorm";
import { DbConnections } from "../postgresdb";
import { IState } from "../../types/StateService/StateService";
import { Country } from "./country.entity";

@Entity({ name: "states" })
export class State extends BaseEntity implements IState {
  @PrimaryGeneratedColumn({ name: 'state_id' })
  stateId!: number;

  @Column({ name: 'state_name' })
  stateName!: string;

  @Column({ name: 'country_id' })
  countryId!: number;

  @ManyToOne(() => Country, { nullable: false })
  @JoinColumn({ name: 'country_id' })
  country!: Country;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt!: Date;

  @Column({name:'is_deleted', type: 'boolean', default: false})
  isDeleted!: boolean;
}

export const StateRepository = (): Repository<State> => {
  return DbConnections.AppDbConnection.getConnection().getRepository(State);
}

