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
exports.SizeRepository = exports.Size = void 0;
const typeorm_1 = require("typeorm");
const postgresdb_1 = require("../postgresdb");
let Size = class Size extends typeorm_1.BaseEntity {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: 'size_id' }),
    __metadata("design:type", Number)
], Size.prototype, "sizeId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'emp_id' }),
    __metadata("design:type", Number)
], Size.prototype, "empId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'name', nullable: true }),
    __metadata("design:type", String)
], Size.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_deleted', default: false }),
    __metadata("design:type", Boolean)
], Size.prototype, "isDeleted", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', name: 'created_at' }),
    __metadata("design:type", Date)
], Size.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP', name: 'updated_at' }),
    __metadata("design:type", Date)
], Size.prototype, "updatedAt", void 0);
Size = __decorate([
    (0, typeorm_1.Entity)()
], Size);
exports.Size = Size;
const SizeRepository = () => {
    return postgresdb_1.DbConnections.AppDbConnection.getConnection().getRepository(Size);
};
exports.SizeRepository = SizeRepository;
