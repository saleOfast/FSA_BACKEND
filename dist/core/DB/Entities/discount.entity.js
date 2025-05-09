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
exports.DiscountRepository = exports.Discount = void 0;
const typeorm_1 = require("typeorm");
const postgresdb_1 = require("../postgresdb");
let Discount = class Discount extends typeorm_1.BaseEntity {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: 'discount_id' }),
    __metadata("design:type", Number)
], Discount.prototype, "discountId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_premium' }),
    __metadata("design:type", Boolean)
], Discount.prototype, "isPremium", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_visibility' }),
    __metadata("design:type", Boolean)
], Discount.prototype, "isVisibility", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_billed' }),
    __metadata("design:type", Boolean)
], Discount.prototype, "isBilled", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_order_value' }),
    __metadata("design:type", Boolean)
], Discount.prototype, "isOrderValue", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Discount.prototype, "amount", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', name: 'created_at' }),
    __metadata("design:type", Date)
], Discount.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP', name: 'updated_at' }),
    __metadata("design:type", Date)
], Discount.prototype, "updatedAt", void 0);
Discount = __decorate([
    (0, typeorm_1.Entity)()
], Discount);
exports.Discount = Discount;
const DiscountRepository = () => {
    return postgresdb_1.DbConnections.AppDbConnection.getConnection().getRepository(Discount);
};
exports.DiscountRepository = DiscountRepository;
