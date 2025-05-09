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
exports.PolicyTypeHeadRepository = exports.PolicyTypeHead = void 0;
const typeorm_1 = require("typeorm");
const postgresdb_1 = require("../postgresdb");
const policyHead_entity_1 = require("./policyHead.entity");
const common_1 = require("../../../core/types/Constent/common");
let PolicyTypeHead = class PolicyTypeHead extends typeorm_1.BaseEntity {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], PolicyTypeHead.prototype, "policy_type_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true }),
    __metadata("design:type", String)
], PolicyTypeHead.prototype, "policy_type_name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'integer', nullable: true }),
    __metadata("design:type", Number)
], PolicyTypeHead.prototype, "policy_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => policyHead_entity_1.PolicyHead, policyHead => policyHead.policy_id),
    (0, typeorm_1.JoinColumn)({ name: "policy_id" }),
    __metadata("design:type", policyHead_entity_1.PolicyHead)
], PolicyTypeHead.prototype, "policy", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true }),
    __metadata("design:type", Date)
], PolicyTypeHead.prototype, "from_date", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true }),
    __metadata("design:type", Date)
], PolicyTypeHead.prototype, "to_date", void 0);
__decorate([
    (0, typeorm_1.Column)({
        nullable: true,
        type: 'enum',
        enum: common_1.ExpenseReportClaimType,
    }),
    __metadata("design:type", String)
], PolicyTypeHead.prototype, "claim_type", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'float', nullable: true }),
    __metadata("design:type", Number)
], PolicyTypeHead.prototype, "cost_per_km", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], PolicyTypeHead.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], PolicyTypeHead.prototype, "updated_at", void 0);
__decorate([
    (0, typeorm_1.DeleteDateColumn)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], PolicyTypeHead.prototype, "deleted_at", void 0);
PolicyTypeHead = __decorate([
    (0, typeorm_1.Entity)({ name: "policy_type_head" })
], PolicyTypeHead);
exports.PolicyTypeHead = PolicyTypeHead;
const PolicyTypeHeadRepository = () => {
    const connection = postgresdb_1.DbConnections.AppDbConnection.getConnection();
    return connection.getRepository(PolicyTypeHead);
};
exports.PolicyTypeHeadRepository = PolicyTypeHeadRepository;
