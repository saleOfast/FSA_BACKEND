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
exports.StoreCategoryRepository = exports.StoreCategory = void 0;
const typeorm_1 = require("typeorm");
const postgresdb_1 = require("../postgresdb");
let StoreCategory = class StoreCategory extends typeorm_1.BaseEntity {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: 'store_category_id' }),
    __metadata("design:type", Number)
], StoreCategory.prototype, "storeCategoryId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'category_name' }),
    __metadata("design:type", String)
], StoreCategory.prototype, "categoryName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'emp_id' }),
    __metadata("design:type", Number)
], StoreCategory.prototype, "empId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_deleted', default: false }),
    __metadata("design:type", Boolean)
], StoreCategory.prototype, "isDeleted", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', name: 'created_at' }),
    __metadata("design:type", Date)
], StoreCategory.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP', name: 'updated_at' }),
    __metadata("design:type", Date)
], StoreCategory.prototype, "updatedAt", void 0);
StoreCategory = __decorate([
    (0, typeorm_1.Entity)()
], StoreCategory);
exports.StoreCategory = StoreCategory;
const StoreCategoryRepository = () => {
    return postgresdb_1.DbConnections.AppDbConnection.getConnection().getRepository(StoreCategory);
};
exports.StoreCategoryRepository = StoreCategoryRepository;
