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
exports.HeadLeaveCountRepository = exports.LeaveHeadCount = void 0;
const typeorm_1 = require("typeorm");
const postgresdb_1 = require("../postgresdb");
const Leave_entity_1 = require("./Leave.entity");
// import { HeadLeave } from "./HeadLeave"; // Assuming there's a HeadLeave entity
let LeaveHeadCount = class LeaveHeadCount extends typeorm_1.BaseEntity {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: 'head_leave_cnt_id' }),
    __metadata("design:type", Number)
], LeaveHeadCount.prototype, "headLeaveCntId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'head_leave_id' }),
    __metadata("design:type", Number)
], LeaveHeadCount.prototype, "headLeaveId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Leave_entity_1.LeaveHead, { nullable: false }) // Assuming relation with HeadLeave
    ,
    (0, typeorm_1.JoinColumn)({ name: 'head_leave_id' }),
    __metadata("design:type", Leave_entity_1.LeaveHead)
], LeaveHeadCount.prototype, "headLeave", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'status', default: true }),
    __metadata("design:type", Boolean)
], LeaveHeadCount.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'financial_start', type: 'date' }),
    __metadata("design:type", Date)
], LeaveHeadCount.prototype, "financialStart", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'financial_end', type: 'date' }),
    __metadata("design:type", Date)
], LeaveHeadCount.prototype, "financialEnd", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'total_head_leave', type: 'int' }),
    __metadata("design:type", Number)
], LeaveHeadCount.prototype, "totalHeadLeave", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamp', default: () => 'now()', name: 'created_at' }),
    __metadata("design:type", Date)
], LeaveHeadCount.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ type: 'timestamp', default: () => 'now()', onUpdate: 'now()', name: 'updated_at' }),
    __metadata("design:type", Date)
], LeaveHeadCount.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.DeleteDateColumn)({ type: 'timestamp', nullable: true, name: 'deleted_at' }),
    __metadata("design:type", Date)
], LeaveHeadCount.prototype, "deletedAt", void 0);
LeaveHeadCount = __decorate([
    (0, typeorm_1.Entity)({ name: 'leave_head_count' }) // Explicit table name
], LeaveHeadCount);
exports.LeaveHeadCount = LeaveHeadCount;
const HeadLeaveCountRepository = () => {
    return postgresdb_1.DbConnections.AppDbConnection.getConnection().getRepository(LeaveHeadCount);
};
exports.HeadLeaveCountRepository = HeadLeaveCountRepository;
