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
exports.PaymentRepository = exports.Payment = void 0;
const typeorm_1 = require("typeorm");
const postgresdb_1 = require("../postgresdb");
const orders_entity_1 = require("./orders.entity");
let Payment = class Payment extends typeorm_1.BaseEntity {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: 'payment_id' }),
    __metadata("design:type", Number)
], Payment.prototype, "paymentId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'emp_id' }),
    __metadata("design:type", Number)
], Payment.prototype, "empId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'order_id' }),
    __metadata("design:type", Number)
], Payment.prototype, "orderId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => orders_entity_1.Orders),
    (0, typeorm_1.JoinColumn)({ name: 'order_id' }),
    __metadata("design:type", orders_entity_1.Orders)
], Payment.prototype, "order", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', name: "payment_date" }),
    __metadata("design:type", String)
], Payment.prototype, "paymentDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'transaction_id', nullable: true }),
    __metadata("design:type", String)
], Payment.prototype, "transactionId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'status', default: true }),
    __metadata("design:type", String)
], Payment.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'payment_mode', nullable: true }),
    __metadata("design:type", String)
], Payment.prototype, "paymentMode", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'amount', nullable: true }),
    __metadata("design:type", Number)
], Payment.prototype, "amount", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'payment_ref_img', nullable: true }),
    __metadata("design:type", String)
], Payment.prototype, "paymentRefImg", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', name: 'created_at' }),
    __metadata("design:type", Date)
], Payment.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP', name: 'updated_at' }),
    __metadata("design:type", Date)
], Payment.prototype, "updatedAt", void 0);
Payment = __decorate([
    (0, typeorm_1.Entity)()
], Payment);
exports.Payment = Payment;
const PaymentRepository = () => {
    return postgresdb_1.DbConnections.AppDbConnection.getConnection().getRepository(Payment);
};
exports.PaymentRepository = PaymentRepository;
