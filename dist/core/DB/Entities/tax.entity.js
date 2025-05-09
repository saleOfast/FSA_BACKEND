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
exports.TaxesRepository = exports.Taxes = void 0;
const typeorm_1 = require("typeorm");
const postgresdb_1 = require("../postgresdb");
const User_entity_1 = require("./User.entity");
let Taxes = class Taxes extends typeorm_1.BaseEntity {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: 'tax_id' }),
    __metadata("design:type", Number)
], Taxes.prototype, "taxId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'tax_name' }),
    __metadata("design:type", String)
], Taxes.prototype, "taxName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'tax_amount' }),
    __metadata("design:type", Number)
], Taxes.prototype, "taxAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'description' }),
    __metadata("design:type", String)
], Taxes.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => User_entity_1.User, (user) => user.taxes, { onDelete: "CASCADE" }),
    (0, typeorm_1.JoinColumn)({ name: 'added_by', referencedColumnName: 'emp_id' }),
    __metadata("design:type", User_entity_1.User)
], Taxes.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'added_by' }),
    __metadata("design:type", Number)
], Taxes.prototype, "addedBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'status', default: true }),
    __metadata("design:type", Boolean)
], Taxes.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', name: 'created_at' }),
    __metadata("design:type", Date)
], Taxes.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP', name: 'updated_at' }),
    __metadata("design:type", Date)
], Taxes.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.DeleteDateColumn)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], Taxes.prototype, "deletedAt", void 0);
Taxes = __decorate([
    (0, typeorm_1.Entity)({ name: 'taxes' })
], Taxes);
exports.Taxes = Taxes;
const TaxesRepository = () => {
    return postgresdb_1.DbConnections.AppDbConnection.getConnection().getRepository(Taxes);
};
exports.TaxesRepository = TaxesRepository;
