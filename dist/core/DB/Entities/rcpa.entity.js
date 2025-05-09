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
exports.RCPARepository = exports.RCPA = void 0;
const typeorm_1 = require("typeorm");
const postgresdb_1 = require("../postgresdb");
const common_1 = require("../../../core/types/Constent/common");
const stores_entity_1 = require("./stores.entity");
const products_entity_1 = require("./products.entity");
const User_entity_1 = require("./User.entity");
const brand_competitor_entity_1 = require("./brand.competitor.entity");
let RCPA = class RCPA extends typeorm_1.BaseEntity {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: 'rcpa_id' }),
    __metadata("design:type", Number)
], RCPA.prototype, "rcpaId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => stores_entity_1.Stores, (store) => store.rcpa, { onDelete: "CASCADE" }),
    (0, typeorm_1.JoinColumn)({ name: 'store_id' }),
    __metadata("design:type", stores_entity_1.Stores)
], RCPA.prototype, "store", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'store_id', nullable: true }) // Store ID column
    ,
    __metadata("design:type", Number)
], RCPA.prototype, "storeId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => User_entity_1.User, (user) => user.rcpa, { onDelete: "CASCADE" }),
    (0, typeorm_1.JoinColumn)({ name: 'added_by', referencedColumnName: 'emp_id' }),
    __metadata("design:type", User_entity_1.User)
], RCPA.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'added_by', nullable: true }),
    __metadata("design:type", Number)
], RCPA.prototype, "addedBy", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => products_entity_1.Products, (product) => product.rcpa, { onDelete: "CASCADE" }),
    (0, typeorm_1.JoinColumn)({ name: 'product_id' }),
    __metadata("design:type", products_entity_1.Products)
], RCPA.prototype, "product", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'product_id' }),
    __metadata("design:type", Number)
], RCPA.prototype, "productId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'quantity_sold', nullable: true }),
    __metadata("design:type", Number)
], RCPA.prototype, "quantitySold", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'stock_level', nullable: true }),
    __metadata("design:type", Number)
], RCPA.prototype, "stockLevel", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'stock_level_competitor', nullable: true }),
    __metadata("design:type", Number)
], RCPA.prototype, "stockLevelCompetitor", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => brand_competitor_entity_1.CompetitorBrand, (brand) => brand.rcpa, { onDelete: "CASCADE" }),
    (0, typeorm_1.JoinColumn)({ name: 'competitor_brand_id', referencedColumnName: 'CompetitorBrandId' }),
    __metadata("design:type", brand_competitor_entity_1.CompetitorBrand)
], RCPA.prototype, "competitorBrand", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'competitor_brand_id', nullable: true }),
    __metadata("design:type", Number)
], RCPA.prototype, "competitorBrandId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: common_1.StockLevelComparison, }),
    __metadata("design:type", String)
], RCPA.prototype, "priceComparison", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'promotional_offers', nullable: true }) // By Competitor
    ,
    __metadata("design:type", String)
], RCPA.prototype, "PromotionalOffers", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'delivery_issues', nullable: true }),
    __metadata("design:type", Boolean)
], RCPA.prototype, "deliveryIssues", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'services_provided', nullable: true }) // By Competitor
    ,
    __metadata("design:type", String)
], RCPA.prototype, "ServicesProvided", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'rating', type: 'int' }),
    __metadata("design:type", Number)
], RCPA.prototype, "rating", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'remarks', nullable: true }),
    __metadata("design:type", String)
], RCPA.prototype, "remarks", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'date', nullable: true }),
    __metadata("design:type", Date)
], RCPA.prototype, "date", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'status', default: true }),
    __metadata("design:type", Boolean)
], RCPA.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', name: 'created_at' }),
    __metadata("design:type", Date)
], RCPA.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP', name: 'updated_at' }),
    __metadata("design:type", Date)
], RCPA.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.DeleteDateColumn)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], RCPA.prototype, "deletedAt", void 0);
RCPA = __decorate([
    (0, typeorm_1.Entity)({ name: 'rcpa' }),
    (0, typeorm_1.Check)(`"rating" BETWEEN 1 AND 5`)
], RCPA);
exports.RCPA = RCPA;
const RCPARepository = () => {
    return postgresdb_1.DbConnections.AppDbConnection.getConnection().getRepository(RCPA);
};
exports.RCPARepository = RCPARepository;
