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
exports.EdetailingRepository = exports.Edetailing = void 0;
const typeorm_1 = require("typeorm");
const postgresdb_1 = require("../postgresdb");
let Edetailing = class Edetailing extends typeorm_1.BaseEntity {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: 'e_detailing_id' }),
    __metadata("design:type", Number)
], Edetailing.prototype, "e_detailing_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'course_name', nullable: true }),
    __metadata("design:type", String)
], Edetailing.prototype, "course_name", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'learning_category', nullable: true }),
    __metadata("design:type", String)
], Edetailing.prototype, "learning_category", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'course_material', nullable: true }),
    __metadata("design:type", String)
], Edetailing.prototype, "course_material", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'product_category', nullable: true }),
    __metadata("design:type", String)
], Edetailing.prototype, "product_category", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'doctor_specialisation', nullable: true }),
    __metadata("design:type", String)
], Edetailing.prototype, "doctor_specialisation", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'expire_date', nullable: true }),
    __metadata("design:type", Date)
], Edetailing.prototype, "expire_date", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'status', default: true }),
    __metadata("design:type", Boolean)
], Edetailing.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamp', default: () => 'now()', name: 'created_at' }),
    __metadata("design:type", Date)
], Edetailing.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ type: 'timestamp', name: 'updated_at', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], Edetailing.prototype, "updated_at", void 0);
__decorate([
    (0, typeorm_1.DeleteDateColumn)({ type: 'timestamp', name: 'deleted_at', nullable: true }),
    __metadata("design:type", Object)
], Edetailing.prototype, "deleted_at", void 0);
Edetailing = __decorate([
    (0, typeorm_1.Entity)()
], Edetailing);
exports.Edetailing = Edetailing;
const EdetailingRepository = () => {
    return postgresdb_1.DbConnections.AppDbConnection.getConnection().getRepository(Edetailing);
};
exports.EdetailingRepository = EdetailingRepository;
