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
exports.TaxesRepository = exports.Taxes = void 0;
const typeorm_1 = require("typeorm");
const postgresdb_1 = require("../postgresdb");
const country_entity_1 = require("./country.entity");
const common_1 = require("../../types/Constent/common");
const state_entity_1 = require("./state.entity");
let Taxes = class Taxes extends typeorm_1.BaseEntity {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: 'tax_id' }) // renamed
    ,
    __metadata("design:type", Number)
], Taxes.prototype, "taxId", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: "enum",
        enum: common_1.TaxClassification,
    }),
    __metadata("design:type", String)
], Taxes.prototype, "taxClassification", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 20, nullable: true }),
    __metadata("design:type", String)
], Taxes.prototype, "hsnCode", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 20, nullable: true }),
    __metadata("design:type", String)
], Taxes.prototype, "sacCode", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: "enum",
        enum: common_1.TaxComponent,
    }),
    __metadata("design:type", String)
], Taxes.prototype, "taxComponent", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "numeric", precision: 5, scale: 2 }),
    __metadata("design:type", Number)
], Taxes.prototype, "taxPercentage", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: "enum",
        enum: common_1.SupplyType,
    }),
    __metadata("design:type", String)
], Taxes.prototype, "supplyType", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => country_entity_1.Country, { nullable: false }),
    (0, typeorm_1.JoinColumn)({ name: "country_id" }),
    __metadata("design:type", country_entity_1.Country)
], Taxes.prototype, "country", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => state_entity_1.State, { nullable: false }),
    (0, typeorm_1.JoinColumn)({ name: "state_id" }),
    __metadata("design:type", state_entity_1.State)
], Taxes.prototype, "state", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: "enum",
        enum: common_1.YesNo,
        default: common_1.YesNo.NO,
    }),
    __metadata("design:type", String)
], Taxes.prototype, "isSez", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: "enum",
        enum: common_1.YesNo,
        default: common_1.YesNo.NO,
    }),
    __metadata("design:type", String)
], Taxes.prototype, "isExport", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: "enum",
        enum: common_1.YesNo,
        default: common_1.YesNo.NO,
    }),
    __metadata("design:type", String)
], Taxes.prototype, "isRcm", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: "enum",
        enum: common_1.YesNo,
        default: common_1.YesNo.YES,
    }),
    __metadata("design:type", String)
], Taxes.prototype, "isTaxable", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "date" }),
    __metadata("design:type", Date)
], Taxes.prototype, "effectiveFrom", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "date", nullable: true }),
    __metadata("design:type", Object)
], Taxes.prototype, "effectiveTo", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "int", default: 1 }),
    __metadata("design:type", Number)
], Taxes.prototype, "priority", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: "enum",
        enum: common_1.YesNo,
        default: common_1.YesNo.YES,
    }),
    __metadata("design:type", String)
], Taxes.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', name: 'created_at' }),
    __metadata("design:type", Date)
], Taxes.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP', name: 'updated_at' }),
    __metadata("design:type", Date)
], Taxes.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "is_deleted", default: false }),
    __metadata("design:type", Boolean)
], Taxes.prototype, "isDeleted", void 0);
Taxes = __decorate([
    (0, typeorm_1.Entity)({ name: 'taxes' })
], Taxes);
exports.Taxes = Taxes;
const TaxesRepository = () => {
    return postgresdb_1.DbConnections.AppDbConnection.getConnection().getRepository(Taxes);
};
exports.TaxesRepository = TaxesRepository;
