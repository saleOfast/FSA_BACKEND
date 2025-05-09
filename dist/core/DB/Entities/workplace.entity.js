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
exports.WorkplaceRepository = exports.Workplace = void 0;
const typeorm_1 = require("typeorm");
const postgresdb_1 = require("../postgresdb");
const common_1 = require("../../types/Constent/common");
const stores_entity_1 = require("./stores.entity");
const User_entity_1 = require("./User.entity");
let Workplace = class Workplace extends typeorm_1.BaseEntity {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: 'workplace_id' }),
    __metadata("design:type", Number)
], Workplace.prototype, "workplaceId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => stores_entity_1.Stores, (store) => store.workplace, { onDelete: "CASCADE" }),
    (0, typeorm_1.JoinColumn)({ name: 'store_id' }),
    __metadata("design:type", stores_entity_1.Stores)
], Workplace.prototype, "store", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'store_id', nullable: true }),
    __metadata("design:type", Number)
], Workplace.prototype, "storeId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => User_entity_1.User, (user) => user.workplace, { onDelete: "CASCADE" }),
    (0, typeorm_1.JoinColumn)({ name: 'added_by', referencedColumnName: 'emp_id' }),
    __metadata("design:type", User_entity_1.User)
], Workplace.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'added_by' }),
    __metadata("design:type", Number)
], Workplace.prototype, "addedBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, name: 'workplace_type', enum: common_1.WorkplaceTypeEnum, default: common_1.WorkplaceTypeEnum.OTHERS }),
    __metadata("design:type", String)
], Workplace.prototype, "workplaceType", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, name: 'practice_type', enum: common_1.PracticeTypeEnum, }),
    __metadata("design:type", String)
], Workplace.prototype, "practiceType", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'orgName', nullable: true }),
    __metadata("design:type", String)
], Workplace.prototype, "orgName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'town_city' }),
    __metadata("design:type", String)
], Workplace.prototype, "townCity", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'territory', nullable: true }),
    __metadata("design:type", String)
], Workplace.prototype, "territory", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'patient_volume', nullable: true }),
    __metadata("design:type", Number)
], Workplace.prototype, "patientVolume", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'availability', nullable: true }),
    __metadata("design:type", Number)
], Workplace.prototype, "availability", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'status', default: true }),
    __metadata("design:type", Boolean)
], Workplace.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', name: 'created_at' }),
    __metadata("design:type", Date)
], Workplace.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP', name: 'updated_at' }),
    __metadata("design:type", Date)
], Workplace.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.DeleteDateColumn)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], Workplace.prototype, "deletedAt", void 0);
Workplace = __decorate([
    (0, typeorm_1.Entity)({ name: 'workplace' })
], Workplace);
exports.Workplace = Workplace;
const WorkplaceRepository = () => {
    return postgresdb_1.DbConnections.AppDbConnection.getConnection().getRepository(Workplace);
};
exports.WorkplaceRepository = WorkplaceRepository;
