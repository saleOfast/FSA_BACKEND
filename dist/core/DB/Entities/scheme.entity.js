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
exports.getSchemeRepository = exports.Scheme = void 0;
const typeorm_1 = require("typeorm");
const postgresdb_1 = require("../postgresdb");
const customer_entity_1 = require("./customer.entity");
const products_entity_1 = require("./products.entity");
const sku_entity_1 = require("./sku.entity");
const warehouse_entity_1 = require("./warehouse.entity");
const posm_entity_1 = require("./posm.entity");
const customerType_entity_1 = require("./customerType.entity");
const common_1 = require("../../types/Constent/common");
let Scheme = class Scheme extends typeorm_1.BaseEntity {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: "scheme_id" }),
    __metadata("design:type", Number)
], Scheme.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "scheme_name" }),
    __metadata("design:type", String)
], Scheme.prototype, "schemeName", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "enum", enum: common_1.SchemeType, name: "scheme_type" }),
    __metadata("design:type", String)
], Scheme.prototype, "schemeType", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "enum", enum: common_1.SchemeNature, name: "scheme_nature" }),
    __metadata("design:type", String)
], Scheme.prototype, "schemeNature", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "date", name: "start_date" }),
    __metadata("design:type", Date)
], Scheme.prototype, "startDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "date", name: "end_date" }),
    __metadata("design:type", Date)
], Scheme.prototype, "endDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "enum", enum: common_1.SchemeStatus, default: common_1.SchemeStatus.ACTIVE }),
    __metadata("design:type", String)
], Scheme.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "priority", nullable: true }),
    __metadata("design:type", Number)
], Scheme.prototype, "priority", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "auto_apply", default: true }),
    __metadata("design:type", Boolean)
], Scheme.prototype, "autoApply", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => customer_entity_1.Customer, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: "customer_id" }),
    __metadata("design:type", customer_entity_1.Customer)
], Scheme.prototype, "customer", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => customerType_entity_1.CustomerType, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: "customer_type_id" }),
    __metadata("design:type", customerType_entity_1.CustomerType)
], Scheme.prototype, "customerType", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => products_entity_1.Products, (products) => products.scheme),
    __metadata("design:type", Array)
], Scheme.prototype, "products", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => sku_entity_1.Sku, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: "sku_id" }),
    __metadata("design:type", sku_entity_1.Sku)
], Scheme.prototype, "sku", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => warehouse_entity_1.Warehouse, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: "warehouse_id" }),
    __metadata("design:type", warehouse_entity_1.Warehouse)
], Scheme.prototype, "warehouse", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => posm_entity_1.Posm, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: "posm_id" }),
    __metadata("design:type", posm_entity_1.Posm)
], Scheme.prototype, "posm", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "beat_id" }),
    __metadata("design:type", Number)
], Scheme.prototype, "beatId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "min_qty", type: "int", nullable: true }),
    __metadata("design:type", Number)
], Scheme.prototype, "minQty", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "min_value", type: "decimal", precision: 10, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], Scheme.prototype, "minValue", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "slab_from", type: "int", nullable: true }),
    __metadata("design:type", Number)
], Scheme.prototype, "slabFrom", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "slab_to", type: "int", nullable: true }),
    __metadata("design:type", Number)
], Scheme.prototype, "slabTo", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "enum", enum: common_1.BenefitType, name: "benefit_type" }),
    __metadata("design:type", String)
], Scheme.prototype, "benefitType", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "benefit_qty", type: "int", nullable: true }),
    __metadata("design:type", Number)
], Scheme.prototype, "benefitQty", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "benefit_limit", type: "int", nullable: true }),
    __metadata("design:type", Number)
], Scheme.prototype, "BenefitLimit", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "is_claimable", default: false }),
    __metadata("design:type", Boolean)
], Scheme.prototype, "isClaimable", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "enum", enum: common_1.ClaimPeriod, nullable: true, name: "claim_period" }),
    __metadata("design:type", String)
], Scheme.prototype, "claimPeriod", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "created_by" }),
    __metadata("design:type", Number)
], Scheme.prototype, "createdBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "is_enable", default: true }),
    __metadata("design:type", Boolean)
], Scheme.prototype, "isEnable", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "is_deleted", default: false }),
    __metadata("design:type", Boolean)
], Scheme.prototype, "isDeleted", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({
        type: "timestamp",
        default: () => "CURRENT_TIMESTAMP",
        name: "created_at",
    }),
    __metadata("design:type", Date)
], Scheme.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({
        type: "timestamp",
        default: () => "CURRENT_TIMESTAMP",
        onUpdate: "CURRENT_TIMESTAMP",
        name: "updated_at",
    }),
    __metadata("design:type", Date)
], Scheme.prototype, "updatedAt", void 0);
Scheme = __decorate([
    (0, typeorm_1.Entity)()
], Scheme);
exports.Scheme = Scheme;
const getSchemeRepository = () => {
    return postgresdb_1.DbConnections.AppDbConnection.getConnection().getRepository(Scheme);
};
exports.getSchemeRepository = getSchemeRepository;
