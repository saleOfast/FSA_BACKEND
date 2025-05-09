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
exports.UserTypesRepository = exports.UserTypes = void 0;
const typeorm_1 = require("typeorm");
const postgresdb_1 = require("../postgresdb");
let UserTypes = class UserTypes extends typeorm_1.BaseEntity {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: 'user_type_id' }),
    __metadata("design:type", Number)
], UserTypes.prototype, "userTypeId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'user_type_name' }),
    __metadata("design:type", String)
], UserTypes.prototype, "userTypeName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'user_type_code' }),
    __metadata("design:type", String)
], UserTypes.prototype, "userTypeCode", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'status', default: true }),
    __metadata("design:type", Boolean)
], UserTypes.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', name: 'created_at' }),
    __metadata("design:type", Date)
], UserTypes.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP', name: 'updated_at' }),
    __metadata("design:type", Date)
], UserTypes.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.DeleteDateColumn)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], UserTypes.prototype, "deletedAt", void 0);
UserTypes = __decorate([
    (0, typeorm_1.Entity)({ name: 'user_types' })
], UserTypes);
exports.UserTypes = UserTypes;
const UserTypesRepository = () => {
    return postgresdb_1.DbConnections.AppDbConnection.getConnection().getRepository(UserTypes);
};
exports.UserTypesRepository = UserTypesRepository;
