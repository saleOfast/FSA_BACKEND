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
exports.HeadLeaveRepository = exports.LeaveHead = void 0;
const typeorm_1 = require("typeorm");
const postgresdb_1 = require("../postgresdb");
const LeaveCount_entity_1 = require("./LeaveCount.entity");
let LeaveHead = class LeaveHead extends typeorm_1.BaseEntity {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: 'head_leave_id' }),
    __metadata("design:type", Number)
], LeaveHead.prototype, "head_leave_id", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => LeaveCount_entity_1.LeaveHeadCount, (leaveHeadCount) => leaveHeadCount.headLeave, { nullable: true }),
    __metadata("design:type", Array)
], LeaveHead.prototype, "leave_head_count", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'head_leave_code', nullable: true }),
    __metadata("design:type", String)
], LeaveHead.prototype, "head_leave_code", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'head_leave_short_name', nullable: true }),
    __metadata("design:type", String)
], LeaveHead.prototype, "head_leave_short_name", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'head_leave_name', nullable: true }),
    __metadata("design:type", String)
], LeaveHead.prototype, "head_leave_name", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'status', default: true }),
    __metadata("design:type", Boolean)
], LeaveHead.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamp', default: () => 'now()', name: 'created_at' }),
    __metadata("design:type", Date)
], LeaveHead.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ type: 'timestamp', default: () => 'now()', onUpdate: 'now()', name: 'udpated_at' }),
    __metadata("design:type", Date)
], LeaveHead.prototype, "updated_at", void 0);
__decorate([
    (0, typeorm_1.DeleteDateColumn)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], LeaveHead.prototype, "deleted_at", void 0);
LeaveHead = __decorate([
    (0, typeorm_1.Entity)()
], LeaveHead);
exports.LeaveHead = LeaveHead;
const HeadLeaveRepository = () => {
    return postgresdb_1.DbConnections.AppDbConnection.getConnection().getRepository(LeaveHead);
};
exports.HeadLeaveRepository = HeadLeaveRepository;
