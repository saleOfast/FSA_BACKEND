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
exports.BeatRepository = exports.Beat = void 0;
const typeorm_1 = require("typeorm");
const postgresdb_1 = require("../postgresdb");
const User_entity_1 = require("./User.entity");
let Beat = class Beat extends typeorm_1.BaseEntity {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: 'beat_id' }),
    __metadata("design:type", Number)
], Beat.prototype, "beatId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'emp_id' }),
    __metadata("design:type", Number)
], Beat.prototype, "empId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => User_entity_1.User, user => user.emp_id),
    (0, typeorm_1.JoinColumn)({ name: 'emp_id' }),
    __metadata("design:type", User_entity_1.User)
], Beat.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'beat_name' }),
    __metadata("design:type", String)
], Beat.prototype, "beatName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'store', type: 'json' }),
    __metadata("design:type", Array)
], Beat.prototype, "store", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'area', nullable: true }),
    __metadata("design:type", String)
], Beat.prototype, "area", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'country', nullable: true }),
    __metadata("design:type", String)
], Beat.prototype, "country", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'state', nullable: true }),
    __metadata("design:type", String)
], Beat.prototype, "state", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'district', nullable: true }),
    __metadata("design:type", String)
], Beat.prototype, "district", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'city', nullable: true }),
    __metadata("design:type", String)
], Beat.prototype, "city", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_enable', default: true }),
    __metadata("design:type", Boolean)
], Beat.prototype, "IsEnable", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "is_deleted", default: false }),
    __metadata("design:type", Boolean)
], Beat.prototype, "isDeleted", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', name: 'created_at' }),
    __metadata("design:type", Date)
], Beat.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP', name: 'updated_at' }),
    __metadata("design:type", Date)
], Beat.prototype, "updatedAt", void 0);
Beat = __decorate([
    (0, typeorm_1.Entity)()
], Beat);
exports.Beat = Beat;
const BeatRepository = () => {
    return postgresdb_1.DbConnections.AppDbConnection.getConnection().getRepository(Beat);
};
exports.BeatRepository = BeatRepository;
