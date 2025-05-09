import { User } from "./User.entity";
import { Visits } from "./Visit.entity";
import { Attendance } from "./attendance.entity";
import { Beat } from "./beat.entity";
import { CollectPayment } from "./collect_payment.entity";
import { Discount } from "./discount.entity";
import { Distributor } from "./distributors.entity";
import { Inventory } from "./inventory.entity";
import { Orders } from "./orders.entity";
import { OutletInventory } from "./outlet_inventory.entity";
import { Products } from "./products.entity";
import { StoreCategory } from "./storeCategory.entity";
import { Stores } from "./stores.entity";

const dbentities = [ User, Attendance, Beat, CollectPayment, Discount, Distributor, Inventory, Orders, OutletInventory, Products, StoreCategory, Stores, Visits ]

export { dbentities }