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
exports.StoreRepository = exports.Stores = void 0;
const typeorm_1 = require("typeorm");
const postgresdb_1 = require("../postgresdb");
const storeCategory_entity_1 = require("./storeCategory.entity");
const User_entity_1 = require("./User.entity");
const activities_entity_1 = require("./activities.entity");
const sessions_entity_1 = require("./sessions.entity");
const feedback_entity_1 = require("./feedback.entity");
const samples_entity_1 = require("./samples.entity");
const workplace_entity_1 = require("./workplace.entity");
const Visit_entity_1 = require("./Visit.entity");
const rcpa_entity_1 = require("./rcpa.entity");
const giftDistribution_entity_1 = require("./giftDistribution.entity");
let Stores = class Stores extends typeorm_1.BaseEntity {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: 'store_id' }),
    __metadata("design:type", Number)
], Stores.prototype, "storeId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => User_entity_1.User, user => user.emp_id),
    (0, typeorm_1.JoinColumn)({ name: 'emp_id' }),
    __metadata("design:type", User_entity_1.User)
], Stores.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'emp_id' }),
    __metadata("design:type", Number)
], Stores.prototype, "empId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'retailor_id' }),
    __metadata("design:type", Number)
], Stores.prototype, "retailorId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'store_name' }),
    __metadata("design:type", String)
], Stores.prototype, "storeName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'uid', nullable: true }),
    __metadata("design:type", String)
], Stores.prototype, "uid", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'store_type', nullable: true }),
    __metadata("design:type", Number)
], Stores.prototype, "storeType", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => storeCategory_entity_1.StoreCategory, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'store_type' }),
    __metadata("design:type", storeCategory_entity_1.StoreCategory)
], Stores.prototype, "storeCat", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'lat', nullable: true }),
    __metadata("design:type", String)
], Stores.prototype, "lat", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'long', nullable: true }),
    __metadata("design:type", String)
], Stores.prototype, "long", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'address_line1' }),
    __metadata("design:type", String)
], Stores.prototype, "addressLine1", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'address_line2' }),
    __metadata("design:type", String)
], Stores.prototype, "addressLine2", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'town_city' }),
    __metadata("design:type", String)
], Stores.prototype, "townCity", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Stores.prototype, "state", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Stores.prototype, "district", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Stores.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'pin_code' }),
    __metadata("design:type", String)
], Stores.prototype, "pinCode", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'owner_name' }),
    __metadata("design:type", String)
], Stores.prototype, "ownerName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'mobile_number' }),
    __metadata("design:type", String)
], Stores.prototype, "mobileNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'alter_mobile', nullable: true }),
    __metadata("design:type", String)
], Stores.prototype, "alterMobile", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'opening_time', nullable: true }),
    __metadata("design:type", String)
], Stores.prototype, "openingTime", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'closing_time', nullable: true }),
    __metadata("design:type", String)
], Stores.prototype, "closingTime", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'opening_time_am_pm', nullable: true }),
    __metadata("design:type", String)
], Stores.prototype, "openingTimeAmPm", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'closing_time_am_pm', nullable: true }),
    __metadata("design:type", String)
], Stores.prototype, "closingTimeAmPm", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'payment_mode', nullable: true }),
    __metadata("design:type", String)
], Stores.prototype, "paymentMode", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false, name: 'is_premium_store' }),
    __metadata("design:type", Boolean)
], Stores.prototype, "isPremiumStore", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'flat_discount', type: 'json', nullable: true }),
    __metadata("design:type", Object)
], Stores.prototype, "flatDiscount", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'visibility_discount', type: 'json', nullable: true }),
    __metadata("design:type", Object)
], Stores.prototype, "visibilityDiscount", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'order_value_discount', type: 'json', nullable: true }),
    __metadata("design:type", Array)
], Stores.prototype, "orderValueDiscount", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_active_order_value_discount', type: 'boolean', nullable: true }),
    __metadata("design:type", Boolean)
], Stores.prototype, "isActiveOrderValueDiscount", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false, name: 'is_active' }),
    __metadata("design:type", Boolean)
], Stores.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'qualification', nullable: true }),
    __metadata("design:type", String)
], Stores.prototype, "qualification", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'doctor_code', nullable: true }),
    __metadata("design:type", String)
], Stores.prototype, "doctorCode", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'chem_reg_number', nullable: true }),
    __metadata("design:type", String)
], Stores.prototype, "RegistrationNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'speciality', nullable: true }),
    __metadata("design:type", String)
], Stores.prototype, "speciality", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'language_known', nullable: true }),
    __metadata("design:type", String)
], Stores.prototype, "language_known", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'territory', nullable: true }),
    __metadata("design:type", String)
], Stores.prototype, "territory", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'orgName', nullable: true }),
    __metadata("design:type", String)
], Stores.prototype, "orgName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'DOB', nullable: true }),
    __metadata("design:type", String)
], Stores.prototype, "DOB", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'clinic_name', nullable: true }),
    __metadata("design:type", String)
], Stores.prototype, "clinicName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'date_of_wedding', nullable: true }),
    __metadata("design:type", String)
], Stores.prototype, "dateOfWedding", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'availability', nullable: true }),
    __metadata("design:type", Number)
], Stores.prototype, "availability", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'patient_volume', nullable: true }),
    __metadata("design:type", Number)
], Stores.prototype, "patientVolume", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_deleted', default: false }),
    __metadata("design:type", Boolean)
], Stores.prototype, "isDeleted", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', name: 'created_at' }),
    __metadata("design:type", Date)
], Stores.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP', name: 'updated_at' }),
    __metadata("design:type", Date)
], Stores.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.DeleteDateColumn)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], Stores.prototype, "deleted_at", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => activities_entity_1.Activities, (activity) => activity.store),
    __metadata("design:type", Array)
], Stores.prototype, "activities", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => workplace_entity_1.Workplace, (workplace) => workplace.store),
    __metadata("design:type", Array)
], Stores.prototype, "workplace", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => sessions_entity_1.Sessions, (session) => session.store),
    __metadata("design:type", Array)
], Stores.prototype, "sessions", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => feedback_entity_1.FeedBack, (feedback) => feedback.store),
    __metadata("design:type", Array)
], Stores.prototype, "feedback", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => samples_entity_1.Samples, (samples) => samples.store),
    __metadata("design:type", Array)
], Stores.prototype, "samples", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => giftDistribution_entity_1.Gifts, (gifts) => gifts.store),
    __metadata("design:type", Array)
], Stores.prototype, "gift", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Visit_entity_1.Visits, (visits) => visits.stores),
    __metadata("design:type", Array)
], Stores.prototype, "visits", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => rcpa_entity_1.RCPA, (rcpa) => rcpa.store),
    __metadata("design:type", Array)
], Stores.prototype, "rcpa", void 0);
Stores = __decorate([
    (0, typeorm_1.Entity)({ name: 'stores' })
], Stores);
exports.Stores = Stores;
const StoreRepository = () => {
    return postgresdb_1.DbConnections.AppDbConnection.getConnection().getRepository(Stores);
};
exports.StoreRepository = StoreRepository;
