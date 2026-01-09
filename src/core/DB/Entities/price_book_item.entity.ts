import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,Repository
} from "typeorm";
import { ItemType, UOM, TaxInclusive, Status } from "../../types/Constent/common";
import { PriceBook } from "./priceBook.entity";
import { Sku} from "./sku.entity";
import { DbConnections } from "../postgresdb";
import { IPriceBookItem } from "../../types/PriceBookItemService/PriceBookItmService";


/* ================= ENTITY ================= */

@Entity("price_book_items")
export class PriceBookItem implements IPriceBookItem {
  /* ---------- PK ---------- */
  @PrimaryGeneratedColumn()
  priceBookItemId: number;

  /* ---------- FK: Price Book ---------- */
  @Column()
  priceBookId: number;

    @ManyToOne(() => PriceBook)
    @JoinColumn({ name: "priceBookId" })
    priceBook: PriceBook;


  /* ---------- FK: SKU ---------- */
  @Column({name:"skuId"})
  skuId: number;

  @ManyToOne(() => Sku)
  @JoinColumn({ name: "skuId" })
  sku: Sku;

  /* ---------- Item Type ---------- */
  @Column({
    type: "enum",
    enum: ItemType,
  })
  itemType: ItemType;

  /* ---------- UOM ---------- */
  @Column({
    type: "enum",
    enum: UOM,
  })
  uom: UOM;

  /* ---------- Pricing ---------- */
  @Column({ type: "decimal", precision: 12, scale: 2 })
  basePrice: number;

  @Column({ type: "decimal", precision: 12, scale: 2, nullable: true })
  minPrice: number | null;

  @Column({ type: "decimal", precision: 12, scale: 2, nullable: true })
  maxPrice: number | null;

  /* ---------- Discount Controls ---------- */
  @Column({ type: "boolean", default: false })
  allowDiscount: boolean;

  @Column({ type: "decimal", precision: 5, scale: 2, nullable: true })
  maxDiscountPct: number | null;

  /* ---------- Slab / Volume Pricing ---------- */
  @Column({ type: "decimal", precision: 10, scale: 2, nullable: true })
  slabFromQty: number | null;
  @Column({ type: "decimal", precision: 10, scale: 2, nullable: true })
  slabToQty: number | null;

  /* ---------- Tax ---------- */
  @Column({
    type: "enum",
    enum: TaxInclusive,
    default: TaxInclusive.EXCLUSIVE,
  })
  taxInclusive: TaxInclusive;

  /* ---------- Status ---------- */
  @Column({
    type: "enum",
    enum: Status,
    default: Status.ACTIVE,
  })
  status: Status;

  /* ---------- Audit ---------- */
  @CreateDateColumn({ type: "timestamp" })
  createdAt: Date;

  @Column({ default: false })
isDeleted: boolean;

}


export const PriceBookItemRepository = (): Repository<PriceBookItem> => {
    return DbConnections.AppDbConnection.getConnection().getRepository(PriceBookItem);
}