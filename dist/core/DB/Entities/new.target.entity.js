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
exports.TargetRepository = exports.NewTarget = void 0;
const typeorm_1 = require("typeorm");
const postgresdb_1 = require("../postgresdb");
const User_entity_1 = require("./User.entity");
let NewTarget = class NewTarget extends typeorm_1.BaseEntity {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: 'target_id' }),
    __metadata("design:type", Number)
], NewTarget.prototype, "targetId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'emp_id' }),
    __metadata("design:type", Number)
], NewTarget.prototype, "empId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => User_entity_1.User, (user) => user.target, { onDelete: "CASCADE" }),
    (0, typeorm_1.JoinColumn)({ name: 'emp_id', referencedColumnName: 'emp_id' }),
    __metadata("design:type", User_entity_1.User)
], NewTarget.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'store_target', nullable: true }),
    __metadata("design:type", Number)
], NewTarget.prototype, "storeTarget", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'amount_target', nullable: true }),
    __metadata("design:type", Number)
], NewTarget.prototype, "amountTarget", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'collection_target', nullable: true }),
    __metadata("design:type", Number)
], NewTarget.prototype, "collectionTarget", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', name: 'month' }),
    __metadata("design:type", Date)
], NewTarget.prototype, "month", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', name: 'year' }),
    __metadata("design:type", Date)
], NewTarget.prototype, "year", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', name: 'date' }),
    __metadata("design:type", Date)
], NewTarget.prototype, "date", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_active', default: true }),
    __metadata("design:type", Boolean)
], NewTarget.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', name: 'created_at' }),
    __metadata("design:type", Date)
], NewTarget.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP', name: 'updated_at' }),
    __metadata("design:type", Date)
], NewTarget.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.DeleteDateColumn)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], NewTarget.prototype, "deletedAt", void 0);
NewTarget = __decorate([
    (0, typeorm_1.Entity)()
], NewTarget);
exports.NewTarget = NewTarget;
const TargetRepository = () => {
    return postgresdb_1.DbConnections.AppDbConnection.getConnection().getRepository(NewTarget);
};
exports.TargetRepository = TargetRepository;
