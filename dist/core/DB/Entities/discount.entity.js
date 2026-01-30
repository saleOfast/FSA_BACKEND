"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DiscountRepository = exports.Discount = exports.DiscountValueType = exports.PktType = exports.ApprovalStatus = exports.DiscountStatus = exports.DiscountCategory = exports.DiscountType = void 0;
const typeorm_1 = require("typeorm");
const postgresdb_1 = require("../postgresdb");
const customerType_entity_1 = require("./customerType.entity");
const customer_entity_1 = require("./customer.entity");
const sku_entity_1 = require("./sku.entity");
const country_entity_1 = require("./country.entity");
const state_entity_1 = require("./state.entity");
const district_entity_1 = require("./district.entity");
const beat_entity_1 = require("./beat.entity");
var DiscountType;
(function (DiscountType) {
    DiscountType["FLAT"] = "Flat";
    DiscountType["PERCENTAGE"] = "%age";
    DiscountType["SLAB"] = "Slab";
    DiscountType["BILL_LEVEL"] = "Bill Level";
    DiscountType["SKU_LEVEL"] = "SKU Level";
    DiscountType["PRODUCT_LEVEL"] = "Product Level";
})(DiscountType = exports.DiscountType || (exports.DiscountType = {}));
var DiscountCategory;
(function (DiscountCategory) {
    DiscountCategory["TRADE_DISCOUNT"] = "Trade discount (Distributor / Retailer margin)";
    DiscountCategory["CASH_DISCOUNT"] = "Cash discount (early payment)";
    DiscountCategory["SPECIAL_CUSTOMER"] = "Special customer discount";
    DiscountCategory["VOLUME_BASED"] = "Volume-based discount (\u20B9 or %)";
    DiscountCategory["TERRITORY_CHANNEL"] = "Territory / channel-specific discount";
    DiscountCategory["LOYALTY"] = "Loyalty";
    DiscountCategory["SEASONAL"] = "Seasonal";
    DiscountCategory["FESTIVAL"] = "Festival";
})(DiscountCategory = exports.DiscountCategory || (exports.DiscountCategory = {}));
var DiscountStatus;
(function (DiscountStatus) {
    DiscountStatus["ACTIVE"] = "Active";
    DiscountStatus["INACTIVE"] = "Inactive";
})(DiscountStatus = exports.DiscountStatus || (exports.DiscountStatus = {}));
var ApprovalStatus;
(function (ApprovalStatus) {
    ApprovalStatus["APPROVED"] = "Approved";
    ApprovalStatus["REJECTED"] = "Rejected";
})(ApprovalStatus = exports.ApprovalStatus || (exports.ApprovalStatus = {}));
var PktType;
(function (PktType) {
    PktType["BOX"] = "Box";
    PktType["PIECES"] = "Pieces";
    PktType["BAGS"] = "Bags";
})(PktType = exports.PktType || (exports.PktType = {}));
var DiscountValueType;
(function (DiscountValueType) {
    DiscountValueType["PERCENTAGE"] = "Percentage";
    DiscountValueType["AMOUNT"] = "Amount";
})(DiscountValueType = exports.DiscountValueType || (exports.DiscountValueType = {}));
let Discount = class Discount extends typeorm_1.BaseEntity {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: 'discount_id' }),
    __metadata("design:type", Number)
], Discount.prototype, "discountId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'discount_name' }),
    __metadata("design:type", String)
], Discount.prototype, "discountName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'discount_type', type: 'enum', enum: DiscountType }),
    __metadata("design:type", String)
], Discount.prototype, "discountType", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'discount_category', type: 'enum', enum: DiscountCategory }),
    __metadata("design:type", String)
], Discount.prototype, "discountCategory", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'customer_type_id', nullable: true }),
    __metadata("design:type", Number)
], Discount.prototype, "customerTypeId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => customerType_entity_1.CustomerType, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'customer_type_id' }),
    __metadata("design:type", customerType_entity_1.CustomerType)
], Discount.prototype, "customerType", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'customer_id', nullable: true }),
    __metadata("design:type", Number)
], Discount.prototype, "customerId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => customer_entity_1.Customer, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'customer_id' }),
    __metadata("design:type", customer_entity_1.Customer)
], Discount.prototype, "customer", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'sku_id', nullable: true }),
    __metadata("design:type", Number)
], Discount.prototype, "skuId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => sku_entity_1.Sku, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'sku_id' }),
    __metadata("design:type", sku_entity_1.Sku)
], Discount.prototype, "sku", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'country_id', nullable: true }),
    __metadata("design:type", Number)
], Discount.prototype, "countryId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => country_entity_1.Country, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'country_id' }),
    __metadata("design:type", country_entity_1.Country)
], Discount.prototype, "country", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'state_id', nullable: true }),
    __metadata("design:type", Number)
], Discount.prototype, "stateId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => state_entity_1.State, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'state_id' }),
    __metadata("design:type", state_entity_1.State)
], Discount.prototype, "state", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'district_id', nullable: true }),
    __metadata("design:type", Number)
], Discount.prototype, "districtId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => district_entity_1.District, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'district_id' }),
    __metadata("design:type", district_entity_1.District)
], Discount.prototype, "district", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'beat_id', nullable: true }),
    __metadata("design:type", Number)
], Discount.prototype, "beatId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => beat_entity_1.Beat, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'beat_id' }),
    __metadata("design:type", beat_entity_1.Beat)
], Discount.prototype, "beat", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'valid_from', type: 'date', nullable: true }),
    __metadata("design:type", Date)
], Discount.prototype, "validFrom", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'valid_till', type: 'date', nullable: true }),
    __metadata("design:type", Date)
], Discount.prototype, "validTill", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: DiscountStatus, default: DiscountStatus.ACTIVE }),
    __metadata("design:type", String)
], Discount.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'approval_status', type: 'enum', enum: ApprovalStatus, default: ApprovalStatus.APPROVED }),
    __metadata("design:type", String)
], Discount.prototype, "approvalStatus", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'pkt_type', type: 'enum', enum: PktType, nullable: true }),
    __metadata("design:type", String)
], Discount.prototype, "pktType", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'min_qty', type: 'decimal', precision: 10, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], Discount.prototype, "minQty", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'max_qty', type: 'decimal', precision: 10, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], Discount.prototype, "maxQty", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'minimum_order_value', type: 'decimal', precision: 10, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], Discount.prototype, "minimumOrderValue", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'discount_value_type', type: 'enum', enum: DiscountValueType }),
    __metadata("design:type", String)
], Discount.prototype, "discountValueType", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'discount_value', type: 'decimal', precision: 10, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], Discount.prototype, "discountValue", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'discount_percentage', type: 'decimal', precision: 10, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], Discount.prototype, "discountPercentage", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', name: 'created_at' }),
    __metadata("design:type", Date)
], Discount.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP', name: 'updated_at' }),
    __metadata("design:type", Date)
], Discount.prototype, "updatedAt", void 0);
Discount = __decorate([
    (0, typeorm_1.Entity)({ name: "discounts" })
], Discount);
exports.Discount = Discount;
const DiscountRepository = () => {
    return postgresdb_1.DbConnections.AppDbConnection.getConnection().getRepository(Discount);
};
exports.DiscountRepository = DiscountRepository;
