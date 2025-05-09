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
exports.TargetRepository = exports.Target = void 0;
const typeorm_1 = require("typeorm");
const postgresdb_1 = require("../postgresdb");
let Target = class Target extends typeorm_1.BaseEntity {
    forEach(callback) {
        // Assuming `this` is an array or iterable collection of targets
        const targets = [this]; // Placeholder, modify based on actual implementation
        targets.forEach(callback);
    }
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: 'target_id' }),
    __metadata("design:type", Number)
], Target.prototype, "targetId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'emp_id' }),
    __metadata("design:type", Number)
], Target.prototype, "empId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', nullable: true }),
    __metadata("design:type", Array)
], Target.prototype, "target", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'manager_id', nullable: true }),
    __metadata("design:type", Number)
], Target.prototype, "managerId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'store_target', nullable: true }),
    __metadata("design:type", Number)
], Target.prototype, "storeTarget", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'amount_target', nullable: true }),
    __metadata("design:type", Number)
], Target.prototype, "amountTarget", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'collection_target', nullable: true }),
    __metadata("design:type", Number)
], Target.prototype, "collectionTarget", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', name: 'month' }),
    __metadata("design:type", Date)
], Target.prototype, "month", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', name: 'year' }),
    __metadata("design:type", Date)
], Target.prototype, "year", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_active', default: true }),
    __metadata("design:type", Boolean)
], Target.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_deleted', default: false }),
    __metadata("design:type", Boolean)
], Target.prototype, "isDeleted", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', name: 'created_at' }),
    __metadata("design:type", Date)
], Target.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP', name: 'updated_at' }),
    __metadata("design:type", Date)
], Target.prototype, "updatedAt", void 0);
Target = __decorate([
    (0, typeorm_1.Entity)()
], Target);
exports.Target = Target;
const TargetRepository = () => {
    return postgresdb_1.DbConnections.AppDbConnection.getConnection().getRepository(Target);
};
exports.TargetRepository = TargetRepository;
