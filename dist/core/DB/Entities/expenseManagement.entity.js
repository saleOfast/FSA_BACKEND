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
exports.ExpenseManagementRepository = exports.ExpenseManagement = void 0;
const common_1 = require("../../types/Constent/common");
const typeorm_1 = require("typeorm");
const postgresdb_1 = require("../postgresdb");
const User_entity_1 = require("./User.entity");
const policyHead_entity_1 = require("./policyHead.entity");
const policyHeadType_entity_1 = require("./policyHeadType.entity");
let ExpenseManagement = class ExpenseManagement extends typeorm_1.BaseEntity {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], ExpenseManagement.prototype, "expence_id", void 0);
__decorate([
    (0, typeorm_1.Column)({
        nullable: true,
        type: 'enum',
        enum: common_1.ExpenseReportClaimType,
    }),
    __metadata("design:type", String)
], ExpenseManagement.prototype, "claim_type", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true, default: null }),
    __metadata("design:type", Date)
], ExpenseManagement.prototype, "from_date", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true, default: null }),
    __metadata("design:type", Date)
], ExpenseManagement.prototype, "to_date", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'integer', nullable: true }),
    __metadata("design:type", Number)
], ExpenseManagement.prototype, "policy_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => policyHead_entity_1.PolicyHead),
    (0, typeorm_1.JoinColumn)({ name: "policy_id" }),
    __metadata("design:type", policyHead_entity_1.PolicyHead)
], ExpenseManagement.prototype, "policy", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'integer', nullable: true }),
    __metadata("design:type", Number)
], ExpenseManagement.prototype, "policy_type_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => policyHeadType_entity_1.PolicyTypeHead),
    (0, typeorm_1.JoinColumn)({ name: "policy_type_id" }),
    __metadata("design:type", policyHeadType_entity_1.PolicyTypeHead)
], ExpenseManagement.prototype, "policyType", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'integer', nullable: true }),
    __metadata("design:type", Number)
], ExpenseManagement.prototype, "manager_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => User_entity_1.User, user => user, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: "manager_id" }) // Specifies the foreign key column in the ExpenseManagement table
    ,
    __metadata("design:type", User_entity_1.User)
], ExpenseManagement.prototype, "manager", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'integer', nullable: true }),
    __metadata("design:type", Number)
], ExpenseManagement.prototype, "emp_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => User_entity_1.User),
    (0, typeorm_1.JoinColumn)({ name: "emp_id" }),
    __metadata("design:type", User_entity_1.User)
], ExpenseManagement.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true }),
    __metadata("design:type", String)
], ExpenseManagement.prototype, "from_location", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true }),
    __metadata("design:type", String)
], ExpenseManagement.prototype, "to_location", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'float', nullable: true }),
    __metadata("design:type", Number)
], ExpenseManagement.prototype, "kms", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'float', nullable: true }),
    __metadata("design:type", Number)
], ExpenseManagement.prototype, "total_expence", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], ExpenseManagement.prototype, "detail", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true }),
    __metadata("design:type", String)
], ExpenseManagement.prototype, "remark", void 0);
__decorate([
    (0, typeorm_1.Column)({
        // nullable: true,
        type: 'enum',
        default: common_1.ExpenseReportStatus.PENDING,
        enum: common_1.ExpenseReportStatus,
    }),
    __metadata("design:type", String)
], ExpenseManagement.prototype, "report_status", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], ExpenseManagement.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], ExpenseManagement.prototype, "updated_at", void 0);
__decorate([
    (0, typeorm_1.DeleteDateColumn)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], ExpenseManagement.prototype, "deleted_at", void 0);
ExpenseManagement = __decorate([
    (0, typeorm_1.Entity)({ name: "expense_reports" })
], ExpenseManagement);
exports.ExpenseManagement = ExpenseManagement;
const ExpenseManagementRepository = () => {
    const connection = postgresdb_1.DbConnections.AppDbConnection.getConnection();
    return connection.getRepository(ExpenseManagement);
};
exports.ExpenseManagementRepository = ExpenseManagementRepository;
