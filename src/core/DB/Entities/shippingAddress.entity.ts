import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, CreateDateColumn, UpdateDateColumn, Repository, OneToMany, DeleteDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { DbConnections } from "../postgresdb";

import {Country} from "../Entities/country.entity"
import {State} from "../Entities/state.entity"
import { District } from "./district.entity";
import {Customer} from "./customer.entity"
import {PreferredDays} from "../../types/Constent/common"
import { IItemShippingAddress } from "core/types/ShippingAddressService/shippingAddressService";


@Entity("shipping_address")
export class ItemShippingAddress extends BaseEntity implements IItemShippingAddress {

  // ================= PK =================
  @PrimaryGeneratedColumn({ name: "address_id" })
  addressId: number;

  // ================= Customer =================
  @Column({ name: "customer_id" })
  customerId: number;

  @ManyToOne(() => Customer)
  @JoinColumn({ name: "customer_id" })
  customer: Customer;

  // ================= Shipping Location =================
  @Column({ name: "shipping_country_id" })
  shippingCountryId: number;

  @ManyToOne(() => Country)
  @JoinColumn({ name: "shipping_country_id" })
  shippingCountry: Country;

  @Column({ name: "shipping_state_id" })
  shippingStateId: number;

  @ManyToOne(() => State)
  @JoinColumn({ name: "shipping_state_id" })
  shippingState: State;

  @Column({ name: "shipping_district_id" })
  shippingDistrictId: number;

  @ManyToOne(() => District)
  @JoinColumn({ name: "shipping_district_id" })
  shippingDistrict: District;

  // ================= Address Details =================
  @Column({ name: "shipping_street", type: "text" })
  shippingStreet: string;

  @Column({ name: "shipping_city", type: "varchar", length: 100 })
  shippingCity: string;

  @Column({ name: "shipping_pin_code", type: "varchar", length: 10 })
  shippingPinCode: string;

  // ================= Delivery Details =================
  @Column({ name: "delivery_time_slot", type: "time", nullable: true })
  deliveryTimeSlot: string;

  @Column({
    name: "preferred_days",
    type: "enum",
    enum: PreferredDays,
    nullable: true,
  })
  preferredDays: PreferredDays;

  // ================= Receiver Details =================
  @Column({ name: "receiver_name", type: "varchar", length: 100 })
  receiverName: string;

  @Column({ name: "receiver_contact_no", type: "varchar", length: 15 })
  receiverContactNo: string;

  // ================= Soft Delete =================
  @Column({ name: "is_deleted", type: "boolean", default: false })
  isDeleted: boolean;
}
export const ShippingAddressRepository = (): Repository<ItemShippingAddress> => {
    return DbConnections.AppDbConnection.getConnection().getRepository(ItemShippingAddress);
};
