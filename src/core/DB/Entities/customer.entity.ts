import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  Repository,
  ManyToOne,
  JoinColumn,
  DeleteDateColumn
} from "typeorm";
import { DbConnections } from "../postgresdb";
import { ICustomer } from "../../types/CustomerService/CustomerService";
import { User } from "./User.entity";
import { Beat } from "./beat.entity";
import { IUserReference } from "../../types/Profile/Profile.types";

@Entity({ name: "customers" })
export class Customer extends BaseEntity implements ICustomer {
  @PrimaryGeneratedColumn({ name: 'customer_id' })
  customerId!: number;

  @Column({ name: 'parent_id', nullable: true })
  parentId?: number;

  @ManyToOne(() => Customer, { nullable: true })
  @JoinColumn({ name: 'parent_id' })
  parent?: Customer;

  @Column({ name: 'customer_name' })
  customerName!: string;

  @Column({ name: 'customer_type' })
  customerType!: string; // Retailer / Distributor / Wholesaler / Chain Store

  @Column({ name: 'channel_type' })
  channelType!: string; // GT, MT, Ecom, Horeca, retailer

  @Column()
  phone!: string;

  @Column({ nullable: true })
  email?: string;

  @Column({ name: 'account_owner_id', nullable: true })
  accountOwnerId?: number;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'account_owner_id' })
  accountOwner?: User;

  @Column({ name: 'beat_route_id', nullable: true })
  beatRouteId?: number;

  @ManyToOne(() => Beat, { nullable: true })
  @JoinColumn({ name: 'beat_route_id' })
  beatRoute?: Beat;

  @Column({ nullable: true })
  category?: string; // A, A++, B, B++

  // Billing Address
  @Column({ name: 'billing_country', nullable: true })
  billingCountry?: string;

  @Column({ name: 'billing_state', nullable: true })
  billingState?: string;

  @Column({ name: 'billing_district', nullable: true })
  billingDistrict?: string;

  @Column({ name: 'billing_street', nullable: true })
  billingStreet?: string;

  @Column({ name: 'billing_city', nullable: true })
  billingCity?: string;

  @Column({ name: 'billing_pin_code', nullable: true })
  billingPinCode?: string;

  // Shipping Address
  @Column({ name: 'shipping_country' })
  shippingCountry!: string;

  @Column({ name: 'shipping_state' })
  shippingState!: string;

  @Column({ name: 'shipping_district' })
  shippingDistrict!: string;

  @Column({ name: 'shipping_street' })
  shippingStreet!: string;

  @Column({ name: 'shipping_city' })
  shippingCity!: string;

  @Column({ name: 'shipping_pin_code' })
  shippingPinCode!: string;

  // Delivery Details
  @Column({ name: 'delivery_time_slot' })
  deliveryTimeSlot!: string;

  @Column({ name: 'preferred_days', type: 'json', nullable: true })
  preferredDays?: string[]; // Sun, Mon, Tues, etc.

  // KYC Details
  @Column({ name: 'gst_certificate', nullable: true })
  gstCertificate?: string; // Yes/No

  @Column({ name: 'gst_no', nullable: true, unique: true })
  gstNo?: string;

  @Column({ name: 'business_license', nullable: true })
  businessLicense?: string;

  @Column({ name: 'pan_detail', nullable: true, unique: true })
  panDetail?: string;

  @Column({ name: 'tan_detail', nullable: true, unique: true })
  tanDetail?: string;

  @Column({ name: 'agreement_signed', nullable: true })
  agreementSigned?: string; // Yes/No

  @Column({ name: 'cin_no', nullable: true })
  cinNo?: string;

  // Bank Details
  @Column({ name: 'bank_name', nullable: true })
  bankName?: string;

  @Column({ name: 'bank_account_no', nullable: true })
  bankAccountNo?: string;

  @Column({ name: 'ifsc_code', nullable: true })
  ifscCode?: string;

  @Column({ name: 'micr_code', nullable: true })
  micrCode?: string;

  @Column({ name: 'mode_of_payment', nullable: true })
  modeOfPayment?: string;

  @Column({ nullable: true })
  currency?: string;

  // Financial & Transactional Data
  @Column({ name: 'payment_terms' })
  paymentTerms!: string;

  @Column({ name: 'credit_limit', type: 'decimal', nullable: true })
  creditLimit?: number;

  @Column({ name: 'opening_balance', type: 'decimal', nullable: true, default: 0 })
  openingBalance?: number;

  @Column({ name: 'last_payment_date', type: 'date', nullable: true })
  lastPaymentDate?: Date;

  @Column({ name: 'average_monthly_sales', type: 'decimal', nullable: true })
  averageMonthlySales?: number;

  @Column({ name: 'outstanding_amount', type: 'decimal', nullable: true, default: 0 })
  outstandingAmount?: number;

  @Column({ name: 'discount_eligibility', nullable: true })
  discountEligibility?: string;

  // Audit Fields
  @Column({ name: 'created_by', type: 'jsonb', nullable: false })
  createdBy!: IUserReference;

  @CreateDateColumn({ name: 'created_date', type: 'timestamp' })
  createdDate!: Date;

  @Column({ name: 'last_modified_by', type: 'jsonb', nullable: true })
  lastModifiedBy?: IUserReference;

  @UpdateDateColumn({ name: 'last_modified_date', type: 'timestamp', nullable: true })
  lastModifiedDate?: Date;

  @Column({ name: 'is_deleted', default: false })
  isDeleted!: boolean;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deletedAt?: Date;

  // Helper method to set createdBy from a User entity
  setCreatedByUser(user: User) {
    this.createdBy = {
      id: user.emp_id,
      name: `${user.firstname} ${user.lastname || ''}`.trim()
    };
  }

  // Helper method to set modifiedBy from a User entity
  setModifiedByUser(user: User) {
    this.lastModifiedBy = {
      id: user.emp_id,
      name: `${user.firstname} ${user.lastname || ''}`.trim()
    };
  }
}

export const CustomerRepository = (): Repository<Customer> => {
  return DbConnections.AppDbConnection.getConnection().getRepository(Customer);
}

