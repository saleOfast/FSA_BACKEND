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
exports.JointWorkRepository = exports.JointWork = void 0;
const typeorm_1 = require("typeorm");
const postgresdb_1 = require("../postgresdb");
const activities_entity_1 = require("./activities.entity");
const User_entity_1 = require("./User.entity");
let JointWork = class JointWork extends typeorm_1.BaseEntity {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: 'joint_work_id' }),
    __metadata("design:type", Number)
], JointWork.prototype, "jwId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => User_entity_1.User, (user) => user.jointWorks, { onDelete: "CASCADE" }) // Many joint works can belong to one user
    ,
    (0, typeorm_1.JoinColumn)({ name: 'emp_id' }),
    __metadata("design:type", User_entity_1.User)
], JointWork.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => activities_entity_1.Activities, (activity) => activity.jointWorks, { onDelete: "CASCADE" }),
    (0, typeorm_1.JoinColumn)({ name: 'activity_id' }) // Correct placement of @JoinColumn
    ,
    __metadata("design:type", activities_entity_1.Activities)
], JointWork.prototype, "activity", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'status', default: true }),
    __metadata("design:type", Boolean)
], JointWork.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'emp_id' }),
    __metadata("design:type", Number)
], JointWork.prototype, "emp_id", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', name: 'created_at' }),
    __metadata("design:type", Date)
], JointWork.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP', name: 'updated_at' }),
    __metadata("design:type", Date)
], JointWork.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.DeleteDateColumn)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], JointWork.prototype, "deletedAt", void 0);
JointWork = __decorate([
    (0, typeorm_1.Entity)({ name: 'joint_work' }) // Table name should be different from 'activities'
], JointWork);
exports.JointWork = JointWork;
const JointWorkRepository = () => {
    return postgresdb_1.DbConnections.AppDbConnection.getConnection().getRepository(JointWork);
};
exports.JointWorkRepository = JointWorkRepository;
