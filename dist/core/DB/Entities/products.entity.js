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
const productCategory_entity_1 = require("./productCategory.entity");
const sessions_entity_1 = require("./sessions.entity");
const tax_entity_1 = require("./tax.entity");
const scheme_entity_1 = require("./scheme.entity");
const discount_entity_1 = require("./discount.entity");
let Products = class Products extends typeorm_1.BaseEntity {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: 'product_id' }),
    __metadata("design:type", Number)
], Products.prototype, "productId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'product_type', type: 'enum', enum: ['FG', 'POSM'], nullable: true }),
    __metadata("design:type", String)
], Products.prototype, "productType", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'product_name' }),
    __metadata("design:type", String)
], Products.prototype, "productName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'product_code', nullable: true, unique: true }),
    __metadata("design:type", String)
], Products.prototype, "productCode", void 0);
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
    (0, typeorm_1.Column)({ name: 'sub_category_id', nullable: true }),
    __metadata("design:type", Number)
], Products.prototype, "subCategoryId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => productCategory_entity_1.ProductCategory, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'sub_category_id' }),
    __metadata("design:type", productCategory_entity_1.ProductCategory)
], Products.prototype, "subCategory", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Products.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'status', type: 'enum', enum: ['Active', 'Inactive'], default: 'Active' }),
    __metadata("design:type", String)
], Products.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'launch_date', type: 'date', nullable: true }),
    __metadata("design:type", Date
    // Discontinue Date - DATE
    )
], Products.prototype, "launchDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'discontinue_date', type: 'date', nullable: true }),
    __metadata("design:type", Date
    // Vol. - Pick List (Default unit of measure e.g., 'Piece', 'Pack')
    )
], Products.prototype, "discontinueDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'vol', nullable: true }),
    __metadata("design:type", String)
], Products.prototype, "vol", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'tax_category_id', nullable: true }),
    __metadata("design:type", Number)
], Products.prototype, "taxCategoryId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => tax_entity_1.Taxes, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'tax_category_id' }),
    __metadata("design:type", tax_entity_1.Taxes)
], Products.prototype, "taxCategory", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'hsn_code', nullable: true }),
    __metadata("design:type", String)
], Products.prototype, "hsnCode", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'image', type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], Products.prototype, "image", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', name: 'created_date' }),
    __metadata("design:type", Date)
], Products.prototype, "createdDate", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP', name: 'updated_date' }),
    __metadata("design:type", Date)
], Products.prototype, "updatedDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'market_segment', nullable: true }),
    __metadata("design:type", String)
], Products.prototype, "marketSegment", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'product_life_cycle_stage', nullable: true }),
    __metadata("design:type", String)
], Products.prototype, "productLifeCycleStage", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'storage_condition', nullable: true }),
    __metadata("design:type", String)
], Products.prototype, "storageCondition", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'scheme_id', nullable: true }),
    __metadata("design:type", Number)
], Products.prototype, "schemeId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => scheme_entity_1.Scheme, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'scheme_id' }),
    __metadata("design:type", scheme_entity_1.Scheme)
], Products.prototype, "scheme", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'discount_id', nullable: true }),
    __metadata("design:type", Number)
], Products.prototype, "discountId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => discount_entity_1.Discount, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'discount_id' }),
    __metadata("design:type", discount_entity_1.Discount)
], Products.prototype, "discount", void 0);
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
    (0, typeorm_1.OneToMany)(() => sessions_entity_1.Sessions, (session) => session.store),
    __metadata("design:type", Array)
], Products.prototype, "sessions", void 0);
Products = __decorate([
    (0, typeorm_1.Entity)()
], Products);
exports.Products = Products;
const ProductRepository = () => {
    return postgresdb_1.DbConnections.AppDbConnection.getConnection().getRepository(Products);
};
exports.ProductRepository = ProductRepository;
