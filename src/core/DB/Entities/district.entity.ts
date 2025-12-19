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
import { IDistrict } from "../../types/DistrictService/DistrictService";
import { State } from "./state.entity";
import { Country } from "./country.entity";

@Entity({ name: "districts" })
export class District extends BaseEntity implements IDistrict {
  @PrimaryGeneratedColumn({ name: 'district_id' })
  districtId!: number;

  @Column({ name: 'district_name' })
  districtName!: string;

  @Column({ name: 'state_id' })
  stateId!: number;

  @Column({ name: 'country_id' })
  countryId!: number;

  @ManyToOne(() => State, { nullable: false })
  @JoinColumn({ name: 'state_id' })
  state!: State;

  @ManyToOne(() => Country, { nullable: false })
  @JoinColumn({ name: 'country_id' })
  country!: Country;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt!: Date;
}

export const DistrictRepository = (): Repository<District> => {
  return DbConnections.AppDbConnection.getConnection().getRepository(District);
}

