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
exports.CollectAmountRepository = exports.CollectAmount = void 0;
const typeorm_1 = require("typeorm");
const postgresdb_1 = require("../postgresdb");
let CollectAmount = class CollectAmount extends typeorm_1.BaseEntity {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: 'collect_amount_id' }),
    __metadata("design:type", Number)
], CollectAmount.prototype, "collectAmountId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'order_id' }),
    __metadata("design:type", Number)
], CollectAmount.prototype, "orderId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'collect_amount' }),
    __metadata("design:type", Number)
], CollectAmount.prototype, "collectAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'pending_amount' }),
    __metadata("design:type", Number)
], CollectAmount.prototype, "pendingAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'total_collected_amount' }),
    __metadata("design:type", Number)
], CollectAmount.prototype, "totalCollectedAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'total_pending_amount' }),
    __metadata("design:type", Number)
], CollectAmount.prototype, "totalPendingAmount", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', name: 'created_at' }),
    __metadata("design:type", Date)
], CollectAmount.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP', name: 'updated_at' }),
    __metadata("design:type", Date)
], CollectAmount.prototype, "updatedAt", void 0);
CollectAmount = __decorate([
    (0, typeorm_1.Entity)()
], CollectAmount);
exports.CollectAmount = CollectAmount;
const CollectAmountRepository = () => {
    return postgresdb_1.DbConnections.AppDbConnection.getConnection().getRepository(CollectAmount);
};
exports.CollectAmountRepository = CollectAmountRepository;
