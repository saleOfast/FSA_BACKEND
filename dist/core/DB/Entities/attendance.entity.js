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
exports.AttendanceRepository = exports.Attendance = void 0;
const typeorm_1 = require("typeorm");
const postgresdb_1 = require("../postgresdb");
const User_entity_1 = require("./User.entity");
let Attendance = class Attendance extends typeorm_1.BaseEntity {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: 'attendance_id' }),
    __metadata("design:type", Number)
], Attendance.prototype, "attendanceId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'emp_id' }),
    __metadata("design:type", Number)
], Attendance.prototype, "empId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => User_entity_1.User, user => user.emp_id),
    (0, typeorm_1.JoinColumn)({ name: 'emp_id' }),
    __metadata("design:type", User_entity_1.User)
], Attendance.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', name: 'check_in', nullable: false }),
    __metadata("design:type", Date)
], Attendance.prototype, "checkIn", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', name: 'check_out', nullable: true }),
    __metadata("design:type", Date)
], Attendance.prototype, "checkOut", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'interval' }),
    __metadata("design:type", String)
], Attendance.prototype, "duration", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamp', default: () => 'now()', name: 'created_at' }),
    __metadata("design:type", Date)
], Attendance.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ type: 'timestamp', default: () => 'now()', onUpdate: 'now()', name: 'udpated_at' }),
    __metadata("design:type", Date)
], Attendance.prototype, "updatedAt", void 0);
Attendance = __decorate([
    (0, typeorm_1.Entity)()
], Attendance);
exports.Attendance = Attendance;
const AttendanceRepository = () => {
    return postgresdb_1.DbConnections.AppDbConnection.getConnection().getRepository(Attendance);
};
exports.AttendanceRepository = AttendanceRepository;
