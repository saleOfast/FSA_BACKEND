import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Repository
} from "typeorm";
import { DbConnections } from "../postgresdb";
import { ICountry } from "../../types/CountryService/CountryService";

@Entity({ name: "countries" })
export class Country extends BaseEntity implements ICountry {
  @PrimaryGeneratedColumn({ name: 'country_id' })
  countryId!: number;

  @Column({ name: 'country_name' })
  countryName!: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt!: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp', nullable: true })
  deletedAt?: Date;
}

export const CountryRepository = (): Repository<Country> => {
  return DbConnections.AppDbConnection.getConnection().getRepository(Country);
}

