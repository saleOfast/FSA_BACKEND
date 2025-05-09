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
exports.VisitRepository = exports.Visits = void 0;
const common_1 = require("../../types/Constent/common");
const typeorm_1 = require("typeorm");
const postgresdb_1 = require("../postgresdb");
const User_entity_1 = require("./User.entity");
const stores_entity_1 = require("./stores.entity");
let Visits = class Visits extends typeorm_1.BaseEntity {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: 'visit_id' }),
    __metadata("design:type", Number)
], Visits.prototype, "visitId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'emp_id' }),
    __metadata("design:type", Number)
], Visits.prototype, "empId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => User_entity_1.User, user => user.emp_id),
    (0, typeorm_1.JoinColumn)({ name: 'emp_id' }),
    __metadata("design:type", User_entity_1.User)
], Visits.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Visits.prototype, "beat", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'store', type: 'json' }),
    __metadata("design:type", Array)
], Visits.prototype, "store", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => stores_entity_1.Stores, (store) => store.visits, { onDelete: "CASCADE" }),
    (0, typeorm_1.JoinColumn)({ name: 'store_id' }),
    __metadata("design:type", stores_entity_1.Stores)
], Visits.prototype, "stores", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'store_id' }),
    __metadata("design:type", Number)
], Visits.prototype, "storeId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'visit_date' }),
    __metadata("design:type", Date)
], Visits.prototype, "visitDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'check_in', nullable: true }),
    __metadata("design:type", String)
], Visits.prototype, "checkIn", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'check_in_lat', nullable: true }),
    __metadata("design:type", String)
], Visits.prototype, "checkInLat", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'check_in_long', nullable: true }),
    __metadata("design:type", String)
], Visits.prototype, "checkInLong", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'check_out', nullable: true }),
    __metadata("design:type", String)
], Visits.prototype, "checkOut", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, name: 'check_out_lat' }),
    __metadata("design:type", String)
], Visits.prototype, "checkOutLat", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'check_out_long', nullable: true }),
    __metadata("design:type", String)
], Visits.prototype, "checkOutLong", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'interval', nullable: true }),
    __metadata("design:type", String)
], Visits.prototype, "duration", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'no_order_reason', nullable: true }),
    __metadata("design:type", String)
], Visits.prototype, "noOrderReason", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: common_1.CallType,
        default: common_1.CallType.TELEVISIT,
        name: 'is_call_type'
    }),
    __metadata("design:type", String)
], Visits.prototype, "isCallType", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: common_1.VisitStatus,
        default: common_1.VisitStatus.PENDING
    }),
    __metadata("design:type", String)
], Visits.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'image', nullable: true }),
    __metadata("design:type", String)
], Visits.prototype, "image", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', name: 'activity', nullable: true, default: () => "'[]'" }),
    __metadata("design:type", Array)
], Visits.prototype, "activity", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', name: 'created_at' }),
    __metadata("design:type", Date)
], Visits.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP', name: 'updated_at' }),
    __metadata("design:type", Date)
], Visits.prototype, "updatedAt", void 0);
Visits = __decorate([
    (0, typeorm_1.Entity)()
], Visits);
exports.Visits = Visits;
const VisitRepository = () => {
    return postgresdb_1.DbConnections.AppDbConnection.getConnection().getRepository(Visits);
};
exports.VisitRepository = VisitRepository;
