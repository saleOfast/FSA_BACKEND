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
exports.CollectPaymentRepository = exports.CollectPayment = void 0;
const typeorm_1 = require("typeorm");
const postgresdb_1 = require("../postgresdb");
let CollectPayment = class CollectPayment extends typeorm_1.BaseEntity {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: 'collect_payment_id' }),
    __metadata("design:type", Number)
], CollectPayment.prototype, "collectPaymentId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp' }),
    __metadata("design:type", Date)
], CollectPayment.prototype, "date", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'order_id' }),
    __metadata("design:type", Number)
], CollectPayment.prototype, "orderId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'order_amount' }),
    __metadata("design:type", Number)
], CollectPayment.prototype, "orderAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'collect_amount' }),
    __metadata("design:type", Number)
], CollectPayment.prototype, "collectAmount", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', name: 'created_at' }),
    __metadata("design:type", Date)
], CollectPayment.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP', name: 'updated_at' }),
    __metadata("design:type", Date)
], CollectPayment.prototype, "updatedAt", void 0);
CollectPayment = __decorate([
    (0, typeorm_1.Entity)()
], CollectPayment);
exports.CollectPayment = CollectPayment;
const CollectPaymentRepository = () => {
    return postgresdb_1.DbConnections.AppDbConnection.getConnection().getRepository(CollectPayment);
};
exports.CollectPaymentRepository = CollectPaymentRepository;
