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
exports.DARRepository = exports.Dar = void 0;
const typeorm_1 = require("typeorm");
const postgresdb_1 = require("../postgresdb");
const User_entity_1 = require("./User.entity");
let Dar = class Dar extends typeorm_1.BaseEntity {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: 'dar_id' }),
    __metadata("design:type", Number)
], Dar.prototype, "dar_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'activity_type', nullable: true }),
    __metadata("design:type", String)
], Dar.prototype, "activity_type", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'related_to', nullable: true }),
    __metadata("design:type", String)
], Dar.prototype, "related_to", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'remarks', nullable: true }),
    __metadata("design:type", String)
], Dar.prototype, "remarks", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'manager_id', nullable: true }),
    __metadata("design:type", Number)
], Dar.prototype, "manager_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => User_entity_1.User, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'manager_id' }),
    __metadata("design:type", User_entity_1.User)
], Dar.prototype, "manager", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'emp_id' }),
    __metadata("design:type", Number)
], Dar.prototype, "emp_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => User_entity_1.User, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'emp_id' }),
    __metadata("design:type", User_entity_1.User)
], Dar.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'activity_related', nullable: true }),
    __metadata("design:type", String)
], Dar.prototype, "activity_related", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'date', nullable: true }),
    __metadata("design:type", Date)
], Dar.prototype, "date", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'subject', nullable: true }),
    __metadata("design:type", String)
], Dar.prototype, "subject", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'next_action_on', nullable: true }),
    __metadata("design:type", String)
], Dar.prototype, "next_action_on", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'status', nullable: true }),
    __metadata("design:type", String)
], Dar.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamp', name: 'createdat', default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], Dar.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ type: 'timestamp', name: 'updatedat', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], Dar.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.DeleteDateColumn)({ type: 'timestamp', name: 'deletedat', nullable: true }),
    __metadata("design:type", Object)
], Dar.prototype, "deletedAt", void 0);
Dar = __decorate([
    (0, typeorm_1.Entity)({ name: 'dar' })
], Dar);
exports.Dar = Dar;
const DARRepository = () => {
    return postgresdb_1.DbConnections.AppDbConnection.getConnection().getRepository(Dar);
};
exports.DARRepository = DARRepository;
