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
exports.DistributorRepository = exports.Distributor = void 0;
const typeorm_1 = require("typeorm");
const postgresdb_1 = require("../postgresdb");
let Distributor = class Distributor extends typeorm_1.BaseEntity {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: 'distributor_id' }),
    __metadata("design:type", Number)
], Distributor.prototype, "distributorId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'distributor_name' }),
    __metadata("design:type", String)
], Distributor.prototype, "distributorName", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Distributor.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Distributor.prototype, "address", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false, name: 'is_active' }),
    __metadata("design:type", Boolean)
], Distributor.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', name: 'created_at' }),
    __metadata("design:type", Date)
], Distributor.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP', name: 'updated_at' }),
    __metadata("design:type", Date)
], Distributor.prototype, "updatedAt", void 0);
Distributor = __decorate([
    (0, typeorm_1.Entity)({ name: 'Distributor' })
], Distributor);
exports.Distributor = Distributor;
const DistributorRepository = () => {
    return postgresdb_1.DbConnections.AppDbConnection.getConnection().getRepository(Distributor);
};
exports.DistributorRepository = DistributorRepository;
