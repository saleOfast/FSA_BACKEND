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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdersRepository = exports.Orders = void 0;
const typeorm_1 = require("typeorm");
const postgresdb_1 = require("../postgresdb");
const stores_entity_1 = require("./stores.entity");
const Visit_entity_1 = require("./Visit.entity");
const common_1 = require("../../../core/types/Constent/common");
const User_entity_1 = require("./User.entity");
let Orders = class Orders extends typeorm_1.BaseEntity {
    updateStatusHistory() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.orderStatus) {
                const newStatusEntry = { status: this.orderStatus, timestamp: new Date().toISOString() };
                this.statusHistory = [...this.statusHistory, newStatusEntry];
            }
        });
    }
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: 'order_id' }),
    __metadata("design:type", Number)
], Orders.prototype, "orderId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'emp_id' }),
    __metadata("design:type", Number)
], Orders.prototype, "empId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => User_entity_1.User, user => user.emp_id),
    (0, typeorm_1.JoinColumn)({ name: 'emp_id' }),
    __metadata("design:type", User_entity_1.User)
], Orders.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'store_id' }),
    __metadata("design:type", Number)
], Orders.prototype, "storeId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => stores_entity_1.Stores),
    (0, typeorm_1.JoinColumn)({ name: 'store_id' }),
    __metadata("design:type", stores_entity_1.Stores)
], Orders.prototype, "store", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_call_type', type: 'enum', enum: common_1.CallType, nullable: true }),
    __metadata("design:type", String)
], Orders.prototype, "isCallType", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'visit_id', nullable: true }),
    __metadata("design:type", Number)
], Orders.prototype, "visitId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Visit_entity_1.Visits, { onDelete: "CASCADE", onUpdate: "CASCADE" }),
    (0, typeorm_1.JoinColumn)({ name: 'visit_id' }),
    __metadata("design:type", Visit_entity_1.Visits)
], Orders.prototype, "visit", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', name: 'order_date' }),
    __metadata("design:type", String)
], Orders.prototype, "orderDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'order_amount', type: 'decimal', nullable: true }),
    __metadata("design:type", Number)
], Orders.prototype, "orderAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'products', type: 'json' }),
    __metadata("design:type", Array)
], Orders.prototype, "products", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'collected_amount', nullable: true, type: 'decimal' }),
    __metadata("design:type", Number)
], Orders.prototype, "collectedAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'payment_status', type: 'enum', enum: common_1.PaymentStatus, default: common_1.PaymentStatus.PENDING }),
    __metadata("design:type", String)
], Orders.prototype, "paymentStatus", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'net_amount', nullable: true, type: 'decimal' }),
    __metadata("design:type", Number)
], Orders.prototype, "netAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'total_discount', nullable: true, type: 'decimal' }),
    __metadata("design:type", Number)
], Orders.prototype, "totalDiscountAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'sku_discount_value', nullable: true, type: 'decimal' }),
    __metadata("design:type", Number)
], Orders.prototype, "skuDiscountValue", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'flat_discount_value', nullable: true, type: 'decimal' }),
    __metadata("design:type", Number)
], Orders.prototype, "flatDiscountValue", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'visibility_discount_value', nullable: true, type: 'decimal' }),
    __metadata("design:type", Number)
], Orders.prototype, "visibilityDiscountValue", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'order_discount_value', nullable: true, type: 'decimal' }),
    __metadata("design:type", Number)
], Orders.prototype, "orderValueDiscountValue", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'piece_discount', nullable: true, type: 'decimal' }),
    __metadata("design:type", Number)
], Orders.prototype, "pieceDiscount", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'special_discount_value', nullable: true, type: 'decimal' }),
    __metadata("design:type", Number)
], Orders.prototype, "specialDiscountValue", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'special_discount_id', nullable: true }),
    __metadata("design:type", Number)
], Orders.prototype, "specialDiscountId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'special_discount_amount', nullable: true }),
    __metadata("design:type", Number)
], Orders.prototype, "specialDiscountAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'special_discount_status',
        type: 'enum',
        enum: common_1.SpecialDiscountStatus,
        nullable: true
    }),
    __metadata("design:type", String)
], Orders.prototype, "specialDiscountStatus", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'special_discount_comment', nullable: true }),
    __metadata("design:type", String)
], Orders.prototype, "specialDiscountComment", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'order_status', type: 'enum', enum: common_1.OrderStatus }),
    __metadata("design:type", String)
], Orders.prototype, "orderStatus", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', name: 'status_history', default: () => "'[]'" }),
    __metadata("design:type", Array)
], Orders.prototype, "statusHistory", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', name: 'created_at' }),
    __metadata("design:type", Date)
], Orders.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP', name: 'updated_at' }),
    __metadata("design:type", Date)
], Orders.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.BeforeUpdate)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], Orders.prototype, "updateStatusHistory", null);
Orders = __decorate([
    (0, typeorm_1.Entity)()
], Orders);
exports.Orders = Orders;
const OrdersRepository = () => {
    return postgresdb_1.DbConnections.AppDbConnection.getConnection().getRepository(Orders);
};
exports.OrdersRepository = OrdersRepository;
