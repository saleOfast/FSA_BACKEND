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
exports.ProductRepository = exports.Products = void 0;
const typeorm_1 = require("typeorm");
const postgresdb_1 = require("../postgresdb");
const brand_entity_1 = require("./brand.entity");
const productCategory_entity_1 = require("./productCategory.entity");
const samples_entity_1 = require("./samples.entity");
const activities_entity_1 = require("./activities.entity");
const sessions_entity_1 = require("./sessions.entity");
const feedback_entity_1 = require("./feedback.entity");
const rcpa_entity_1 = require("./rcpa.entity");
const giftDistribution_entity_1 = require("./giftDistribution.entity");
let Products = class Products extends typeorm_1.BaseEntity {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: 'product_id' }),
    __metadata("design:type", Number)
], Products.prototype, "productId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'emp_id' }),
    __metadata("design:type", Number)
], Products.prototype, "empId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'product_name' }),
    __metadata("design:type", String)
], Products.prototype, "productName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'brand_id' }),
    __metadata("design:type", Number)
], Products.prototype, "brandId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => brand_entity_1.Brand),
    (0, typeorm_1.JoinColumn)({ name: 'brand_id' }),
    __metadata("design:type", brand_entity_1.Brand)
], Products.prototype, "brand", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'category_id' }),
    __metadata("design:type", Number)
], Products.prototype, "categoryId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => productCategory_entity_1.ProductCategory),
    (0, typeorm_1.JoinColumn)({ name: 'category_id' }),
    __metadata("design:type", productCategory_entity_1.ProductCategory)
], Products.prototype, "category", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Products.prototype, "mrp", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], Products.prototype, "rlp", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'case_qty' }),
    __metadata("design:type", Number)
], Products.prototype, "caseQty", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'sku_discount', type: 'json', nullable: true }),
    __metadata("design:type", Object)
], Products.prototype, "skuDiscount", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_focused', default: false }),
    __metadata("design:type", Boolean)
], Products.prototype, "isFocused", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_active', default: false }),
    __metadata("design:type", Boolean)
], Products.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_deleted', default: false }),
    __metadata("design:type", Boolean)
], Products.prototype, "isDeleted", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', name: 'created_at' }),
    __metadata("design:type", Date)
], Products.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP', name: 'updated_at' }),
    __metadata("design:type", Date)
], Products.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Products.prototype, "image", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'colour', nullable: true }),
    __metadata("design:type", String)
], Products.prototype, "colour", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => sessions_entity_1.Sessions, (session) => session.store),
    __metadata("design:type", Array)
], Products.prototype, "sessions", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => feedback_entity_1.FeedBack, (session) => session.store),
    __metadata("design:type", Array)
], Products.prototype, "feedBack", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => samples_entity_1.Samples, (samples) => samples.product),
    __metadata("design:type", Array)
], Products.prototype, "samples", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => giftDistribution_entity_1.Gifts, (gifts) => gifts.product),
    __metadata("design:type", Array)
], Products.prototype, "gift", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => activities_entity_1.Activities, (activities) => activities.product),
    __metadata("design:type", Array)
], Products.prototype, "activities", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => rcpa_entity_1.RCPA, (rcpa) => rcpa.product),
    __metadata("design:type", Array)
], Products.prototype, "rcpa", void 0);
Products = __decorate([
    (0, typeorm_1.Entity)()
], Products);
exports.Products = Products;
const ProductRepository = () => {
    return postgresdb_1.DbConnections.AppDbConnection.getConnection().getRepository(Products);
};
exports.ProductRepository = ProductRepository;
