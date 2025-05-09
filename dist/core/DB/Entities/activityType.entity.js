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
exports.ActivityTypeRepository = exports.ActivityType = void 0;
const typeorm_1 = require("typeorm");
const postgresdb_1 = require("../postgresdb");
let ActivityType = class ActivityType extends typeorm_1.BaseEntity {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: 'activity_type_id' }),
    __metadata("design:type", Number)
], ActivityType.prototype, "activity_type_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'activity_type_code', unique: true }),
    __metadata("design:type", String)
], ActivityType.prototype, "activity_type_code", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'activity_type_name' }),
    __metadata("design:type", String)
], ActivityType.prototype, "activity_type_name", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'status', default: true }),
    __metadata("design:type", Boolean)
], ActivityType.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamp', name: 'createdAt', default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], ActivityType.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ type: 'timestamp', name: 'updatedAt', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], ActivityType.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.DeleteDateColumn)({ type: 'timestamp', name: 'deletedAt', nullable: true }),
    __metadata("design:type", Object)
], ActivityType.prototype, "deletedAt", void 0);
ActivityType = __decorate([
    (0, typeorm_1.Entity)({ name: 'activity_type' })
], ActivityType);
exports.ActivityType = ActivityType;
const ActivityTypeRepository = () => {
    return postgresdb_1.DbConnections.AppDbConnection.getConnection().getRepository(ActivityType);
};
exports.ActivityTypeRepository = ActivityTypeRepository;
