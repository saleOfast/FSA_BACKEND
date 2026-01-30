"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dbentities = void 0;
const User_entity_1 = require("./User.entity");
const Visit_entity_1 = require("./Visit.entity");
const attendance_entity_1 = require("./attendance.entity");
const beat_entity_1 = require("./beat.entity");
const collect_payment_entity_1 = require("./collect_payment.entity");
const discount_entity_1 = require("./discount.entity");
const distributors_entity_1 = require("./distributors.entity");
const inventory_entity_1 = require("./inventory.entity");
const orders_entity_1 = require("./orders.entity");
const outlet_inventory_entity_1 = require("./outlet_inventory.entity");
const products_entity_1 = require("./products.entity");
const storeCategory_entity_1 = require("./storeCategory.entity");
const stores_entity_1 = require("./stores.entity");
const warehouse_entity_1 = require("./warehouse.entity");
const sales_return_entity_1 = require("./sales_return.entity");
const customer_entity_1 = require("./customer.entity");
const customerType_entity_1 = require("./customerType.entity");
const object_entity_1 = require("./object.entity");
const ObjectPermission_entity_1 = require("./ObjectPermission.entity");
const Tab_entity_1 = require("./Tab.entity");
const TabPermission_entity_1 = require("./TabPermission.entity");
const systemPermission_entity_1 = require("./systemPermission.entity");
const sku_entity_1 = require("./sku.entity");
const dbentities = [
    User_entity_1.User,
    attendance_entity_1.Attendance,
    beat_entity_1.Beat,
    collect_payment_entity_1.CollectPayment,
    discount_entity_1.Discount,
    distributors_entity_1.Distributor,
    inventory_entity_1.Inventory,
    orders_entity_1.Orders,
    outlet_inventory_entity_1.OutletInventory,
    products_entity_1.Products,
    storeCategory_entity_1.StoreCategory,
    stores_entity_1.Stores,
    Visit_entity_1.Visits,
    warehouse_entity_1.Warehouse,
    sales_return_entity_1.SalesReturn,
    customer_entity_1.Customer,
    customerType_entity_1.CustomerType,
    object_entity_1.ObjectEntity,
    ObjectPermission_entity_1.ObjectPermission,
    Tab_entity_1.Tab,
    TabPermission_entity_1.TabPermission,
    systemPermission_entity_1.SystemPermission,
    sku_entity_1.Sku
];
exports.dbentities = dbentities;
