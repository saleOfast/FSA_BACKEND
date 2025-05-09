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
var ProductCategory_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductCategoryRepository = exports.ProductCategory = void 0;
const typeorm_1 = require("typeorm");
const postgresdb_1 = require("../postgresdb");
let ProductCategory = ProductCategory_1 = class ProductCategory extends typeorm_1.BaseEntity {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: 'product_category_id' }),
    __metadata("design:type", Number)
], ProductCategory.prototype, "productCategoryId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'emp_id' }),
    __metadata("design:type", Number)
], ProductCategory.prototype, "empId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'name' }),
    __metadata("design:type", String)
], ProductCategory.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_active', default: false }),
    __metadata("design:type", Boolean)
], ProductCategory.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "is_deleted", default: false }),
    __metadata("design:type", Boolean)
], ProductCategory.prototype, "isDeleted", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', name: 'created_at' }),
    __metadata("design:type", Date)
], ProductCategory.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP', name: 'updated_at' }),
    __metadata("design:type", Date)
], ProductCategory.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'parent_id', nullable: true }),
    __metadata("design:type", Number)
], ProductCategory.prototype, "parentId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => ProductCategory_1, category => category.children),
    (0, typeorm_1.JoinColumn)({ name: 'parent_id' }),
    __metadata("design:type", ProductCategory)
], ProductCategory.prototype, "parent", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => ProductCategory_1, category => category.parent),
    __metadata("design:type", Array)
], ProductCategory.prototype, "children", void 0);
ProductCategory = ProductCategory_1 = __decorate([
    (0, typeorm_1.Entity)()
], ProductCategory);
exports.ProductCategory = ProductCategory;
const ProductCategoryRepository = () => {
    return postgresdb_1.DbConnections.AppDbConnection.getConnection().getRepository(ProductCategory);
};
exports.ProductCategoryRepository = ProductCategoryRepository;
