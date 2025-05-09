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
exports.CompetitorBrandRepository = exports.CompetitorBrand = void 0;
const typeorm_1 = require("typeorm");
const postgresdb_1 = require("../postgresdb");
const rcpa_entity_1 = require("./rcpa.entity");
let CompetitorBrand = class CompetitorBrand extends typeorm_1.BaseEntity {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: 'competitor_brand_id' }),
    __metadata("design:type", Number)
], CompetitorBrand.prototype, "CompetitorBrandId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'emp_id' }),
    __metadata("design:type", Number)
], CompetitorBrand.prototype, "empId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'name' }),
    __metadata("design:type", String)
], CompetitorBrand.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_deleted', default: false }),
    __metadata("design:type", Boolean)
], CompetitorBrand.prototype, "isDeleted", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', name: 'created_at' }),
    __metadata("design:type", Date)
], CompetitorBrand.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP', name: 'updated_at' }),
    __metadata("design:type", Date)
], CompetitorBrand.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => rcpa_entity_1.RCPA, (rcpa) => rcpa.competitorBrand),
    __metadata("design:type", Array)
], CompetitorBrand.prototype, "rcpa", void 0);
CompetitorBrand = __decorate([
    (0, typeorm_1.Entity)()
], CompetitorBrand);
exports.CompetitorBrand = CompetitorBrand;
const CompetitorBrandRepository = () => {
    return postgresdb_1.DbConnections.AppDbConnection.getConnection().getRepository(CompetitorBrand);
};
exports.CompetitorBrandRepository = CompetitorBrandRepository;
