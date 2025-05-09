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
exports.LeaveApplicationRepository = exports.LeaveApplication = void 0;
const typeorm_1 = require("typeorm");
const postgresdb_1 = require("../postgresdb");
const User_entity_1 = require("./User.entity"); // Make sure to import the User entity
const LeaveCount_entity_1 = require("./LeaveCount.entity"); // Make sure to import the HeadLeaveCount entity
const Leave_entity_1 = require("./Leave.entity");
let LeaveApplication = class LeaveApplication extends typeorm_1.BaseEntity {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: 'leave_app_id' }),
    __metadata("design:type", Number)
], LeaveApplication.prototype, "leave_app_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'manager_id', nullable: true }),
    __metadata("design:type", Object)
], LeaveApplication.prototype, "manager_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'emp_id' }),
    __metadata("design:type", Number)
], LeaveApplication.prototype, "emp_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => User_entity_1.User, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'manager_id' }),
    __metadata("design:type", User_entity_1.User)
], LeaveApplication.prototype, "manager", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => User_entity_1.User, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'emp_id' }),
    __metadata("design:type", User_entity_1.User)
], LeaveApplication.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'head_leave_id' }),
    __metadata("design:type", Number)
], LeaveApplication.prototype, "head_leave_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Leave_entity_1.LeaveHead, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'head_leave_id' }),
    __metadata("design:type", Leave_entity_1.LeaveHead)
], LeaveApplication.prototype, "LeaveHead", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'head_leave_cnt_id' }),
    __metadata("design:type", Number)
], LeaveApplication.prototype, "head_leave_cnt_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => LeaveCount_entity_1.LeaveHeadCount, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'head_leave_cnt_id' }),
    __metadata("design:type", LeaveCount_entity_1.LeaveHeadCount)
], LeaveApplication.prototype, "LeaveHeadCount", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'leave_type', type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], LeaveApplication.prototype, "leave_type", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'reason', type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], LeaveApplication.prototype, "reason", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'no_of_days', type: 'int', nullable: true }),
    __metadata("design:type", Number)
], LeaveApplication.prototype, "no_of_days", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'from_date', type: 'date', nullable: true }),
    __metadata("design:type", Date)
], LeaveApplication.prototype, "from_date", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'to_date', type: 'date', nullable: true }),
    __metadata("design:type", Date)
], LeaveApplication.prototype, "to_date", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'leave_app_status', type: 'enum', enum: ['pending', 'approved', 'rejected'], default: 'pending', nullable: true }),
    __metadata("design:type", String)
], LeaveApplication.prototype, "leave_app_status", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'remarks', type: 'text', nullable: true }),
    __metadata("design:type", String)
], LeaveApplication.prototype, "remarks", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamp', default: () => 'now()', name: 'created_at' }),
    __metadata("design:type", Date)
], LeaveApplication.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ type: 'timestamp', default: () => 'now()', onUpdate: 'now()', name: 'updated_at' }),
    __metadata("design:type", Date)
], LeaveApplication.prototype, "updated_at", void 0);
__decorate([
    (0, typeorm_1.DeleteDateColumn)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], LeaveApplication.prototype, "deleted_at", void 0);
LeaveApplication = __decorate([
    (0, typeorm_1.Entity)()
], LeaveApplication);
exports.LeaveApplication = LeaveApplication;
const LeaveApplicationRepository = () => {
    return postgresdb_1.DbConnections.AppDbConnection.getConnection().getRepository(LeaveApplication);
};
exports.LeaveApplicationRepository = LeaveApplicationRepository;
