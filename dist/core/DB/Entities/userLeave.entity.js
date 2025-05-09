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
exports.UserLeaveRepository = exports.UserLeave = void 0;
const typeorm_1 = require("typeorm");
const postgresdb_1 = require("../postgresdb");
const User_entity_1 = require("./User.entity");
const LeaveCount_entity_1 = require("./LeaveCount.entity");
const Leave_entity_1 = require("./Leave.entity");
let UserLeave = class UserLeave extends typeorm_1.BaseEntity {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: 'user_leave_id' }),
    __metadata("design:type", Number)
], UserLeave.prototype, "user_leave_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'user_id' }),
    __metadata("design:type", Number)
], UserLeave.prototype, "user_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => User_entity_1.User, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'user_id' }),
    __metadata("design:type", User_entity_1.User)
], UserLeave.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'head_leave_id' }),
    __metadata("design:type", Number)
], UserLeave.prototype, "head_leave_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Leave_entity_1.LeaveHead, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'head_leave_id' }),
    __metadata("design:type", Leave_entity_1.LeaveHead)
], UserLeave.prototype, "LeaveHead", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'head_leave_cnt_id' }),
    __metadata("design:type", Number)
], UserLeave.prototype, "head_leave_cnt_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => LeaveCount_entity_1.LeaveHeadCount, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'head_leave_cnt_id' }),
    __metadata("design:type", LeaveCount_entity_1.LeaveHeadCount)
], UserLeave.prototype, "LeaveHeadCount", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'left_leave', type: 'int', nullable: true }),
    __metadata("design:type", Number)
], UserLeave.prototype, "left_leave", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'extra_leaves', type: 'int', nullable: true }),
    __metadata("design:type", Number)
], UserLeave.prototype, "extra_leaves", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'remarks', type: 'text', nullable: true }),
    __metadata("design:type", String)
], UserLeave.prototype, "remarks", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamp', default: () => 'now()', name: 'created_at' }),
    __metadata("design:type", Date)
], UserLeave.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ type: 'timestamp', default: () => 'now()', onUpdate: 'now()', name: 'updated_at' }),
    __metadata("design:type", Date)
], UserLeave.prototype, "updated_at", void 0);
__decorate([
    (0, typeorm_1.DeleteDateColumn)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], UserLeave.prototype, "deleted_at", void 0);
UserLeave = __decorate([
    (0, typeorm_1.Entity)()
], UserLeave);
exports.UserLeave = UserLeave;
const UserLeaveRepository = () => {
    return postgresdb_1.DbConnections.AppDbConnection.getConnection().getRepository(UserLeave);
};
exports.UserLeaveRepository = UserLeaveRepository;
