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
exports.UserRepository = exports.User = void 0;
const common_1 = require("../../types/Constent/common");
const typeorm_1 = require("typeorm");
const postgresdb_1 = require("../postgresdb");
const userType_entity_1 = require("./userType.entity");
const activities_entity_1 = require("./activities.entity");
const sessions_entity_1 = require("./sessions.entity");
const feedback_entity_1 = require("./feedback.entity");
const samples_entity_1 = require("./samples.entity");
const activities_jointWork_entity_1 = require("./activities.jointWork.entity");
const workplace_entity_1 = require("./workplace.entity");
const holidays_entity_1 = require("./holidays.entity");
const rcpa_entity_1 = require("./rcpa.entity");
const tax_entity_1 = require("./tax.entity");
const giftDistribution_entity_1 = require("./giftDistribution.entity");
const new_target_entity_1 = require("./new.target.entity");
let User = class User extends typeorm_1.BaseEntity {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], User.prototype, "emp_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'user_type_id', nullable: true }),
    __metadata("design:type", String)
], User.prototype, "userTypeId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => userType_entity_1.UserTypes, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'user_type_id' }),
    __metadata("design:type", userType_entity_1.UserTypes)
], User.prototype, "userType", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], User.prototype, "firstname", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], User.prototype, "lastname", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], User.prototype, "orgName", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], User.prototype, "age", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], User.prototype, "address", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], User.prototype, "city", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], User.prototype, "state", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], User.prototype, "pincode", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], User.prototype, "phone", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], User.prototype, "zone", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Date)
], User.prototype, "joining_date", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Date)
], User.prototype, "dob", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], User.prototype, "password", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], User.prototype, "image", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'manager_id' }),
    __metadata("design:type", Number)
], User.prototype, "managerId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'availability', nullable: true }),
    __metadata("design:type", Number)
], User.prototype, "availability", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'patient_volume', nullable: true }),
    __metadata("design:type", Number)
], User.prototype, "patientVolume", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'value_target', nullable: true }),
    __metadata("design:type", Number)
], User.prototype, "valueTarget", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'store_target', nullable: true }),
    __metadata("design:type", Number)
], User.prototype, "storeTarget", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'learning_role', nullable: true }),
    __metadata("design:type", String)
], User.prototype, "learningRole", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: common_1.UserRole,
        default: common_1.UserRole.SSM, // Set default role to USER  
    }),
    __metadata("design:type", String)
], User.prototype, "role", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_deleted', default: false }),
    __metadata("design:type", Boolean)
], User.prototype, "isDeleted", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', name: 'created_at' }),
    __metadata("design:type", Date)
], User.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP', name: 'updated_at' }),
    __metadata("design:type", Date)
], User.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.DeleteDateColumn)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], User.prototype, "deleted_at", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => activities_entity_1.Activities, (activity) => activity.user),
    __metadata("design:type", Array)
], User.prototype, "activities", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => tax_entity_1.Taxes, (tax) => tax.user),
    __metadata("design:type", Array)
], User.prototype, "taxes", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => workplace_entity_1.Workplace, (workplace) => workplace.user),
    __metadata("design:type", Array)
], User.prototype, "workplace", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => sessions_entity_1.Sessions, (sessions) => sessions.user),
    __metadata("design:type", Array)
], User.prototype, "sessions", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => feedback_entity_1.FeedBack, (feedback) => feedback.user),
    __metadata("design:type", Array)
], User.prototype, "feedback", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => samples_entity_1.Samples, (samples) => samples.user),
    __metadata("design:type", Array)
], User.prototype, "samples", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => giftDistribution_entity_1.Gifts, (samples) => samples.user),
    __metadata("design:type", Array)
], User.prototype, "gift", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => holidays_entity_1.Holiday, (holiday) => holiday.user),
    __metadata("design:type", Array)
], User.prototype, "holiday", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => activities_jointWork_entity_1.JointWork, (jointWork) => jointWork.user),
    __metadata("design:type", activities_jointWork_entity_1.JointWork)
], User.prototype, "jointWorks", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => rcpa_entity_1.RCPA, (rcpa) => rcpa.user),
    __metadata("design:type", Array)
], User.prototype, "rcpa", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => new_target_entity_1.NewTarget, (target) => target.user),
    __metadata("design:type", Array)
], User.prototype, "target", void 0);
User = __decorate([
    (0, typeorm_1.Entity)({ name: "users" })
], User);
exports.User = User;
const UserRepository = () => {
    const connection = postgresdb_1.DbConnections.AppDbConnection.getConnection();
    return connection.getRepository(User);
};
exports.UserRepository = UserRepository;
