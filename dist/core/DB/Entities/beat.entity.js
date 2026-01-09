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
const User_entity_1 = require("../Entities/User.entity");
const customer_entity_1 = require("../Entities/customer.entity");
const warehouse_entity_1 = require("../Entities/warehouse.entity");
const country_entity_1 = require("./country.entity");
const district_entity_1 = require("./district.entity");
const state_entity_1 = require("./state.entity");
const common_1 = require("../../../core/types/Constent/common");
let Beat = class Beat extends typeorm_1.BaseEntity {
    /* ================= Business ================= */
    get channel() {
        var _a;
        return (_a = this.customer) === null || _a === void 0 ? void 0 : _a.channelType; // GT / MT / HORECA
    }
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: "beat_id" }),
    __metadata("design:type", Number)
], Beat.prototype, "beatId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "beat_code", unique: true }),
    __metadata("design:type", String)
], Beat.prototype, "beatCode", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "beat_name" }),
    __metadata("design:type", String)
], Beat.prototype, "beatName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "customer_id" }),
    __metadata("design:type", Number)
], Beat.prototype, "customerId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => customer_entity_1.Customer),
    (0, typeorm_1.JoinColumn)({ name: "customer_id" }),
    __metadata("design:type", customer_entity_1.Customer)
], Beat.prototype, "customer", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "warehouse_id", nullable: true }),
    __metadata("design:type", Number)
], Beat.prototype, "warehouseId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => warehouse_entity_1.Warehouse, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: "warehouse_id" }),
    __metadata("design:type", warehouse_entity_1.Warehouse)
], Beat.prototype, "warehouse", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "user_id", nullable: true }),
    __metadata("design:type", Number)
], Beat.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => User_entity_1.User, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: "user_id" }),
    __metadata("design:type", User_entity_1.User)
], Beat.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: "enum",
        enum: common_1.BeatType,
        name: "beat_type",
        //   default: BeatType.SALES, // default for existing rows
    }),
    __metadata("design:type", String)
], Beat.prototype, "beatType", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: "enum",
        enum: common_1.VisitFrequency,
        name: "visit_frequency",
    }),
    __metadata("design:type", String)
], Beat.prototype, "visitFrequency", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: "enum",
        enum: common_1.VisitDay,
        array: true,
        nullable: true,
        name: "default_visit_days",
    }),
    __metadata("design:type", Array)
], Beat.prototype, "defaultVisitDays", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: "enum",
        enum: common_1.BeatPriority,
        name: "priority",
    }),
    __metadata("design:type", String)
], Beat.prototype, "priority", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: "enum",
        enum: common_1.BeatStatus,
        default: common_1.BeatStatus.ACTIVE,
        name: "status",
    }),
    __metadata("design:type", String)
], Beat.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "country_id" }),
    __metadata("design:type", Number)
], Beat.prototype, "countryId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => country_entity_1.Country),
    (0, typeorm_1.JoinColumn)({ name: "country_id" }),
    __metadata("design:type", country_entity_1.Country)
], Beat.prototype, "country", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "state_id" }),
    __metadata("design:type", Number)
], Beat.prototype, "stateId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => state_entity_1.State),
    (0, typeorm_1.JoinColumn)({ name: "state_id" }),
    __metadata("design:type", state_entity_1.State)
], Beat.prototype, "state", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "district_id" }),
    __metadata("design:type", Number)
], Beat.prototype, "districtId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => district_entity_1.District),
    (0, typeorm_1.JoinColumn)({ name: "district_id" }),
    __metadata("design:type", district_entity_1.District)
], Beat.prototype, "district", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "area", nullable: true }),
    __metadata("design:type", String)
], Beat.prototype, "area", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "zone", nullable: true }),
    __metadata("design:type", String)
], Beat.prototype, "zone", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "decimal", precision: 9, scale: 6, nullable: true, name: "start_lat" }),
    __metadata("design:type", Number)
], Beat.prototype, "startLat", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "decimal", precision: 9, scale: 6, nullable: true, name: "start_lng" }),
    __metadata("design:type", Number)
], Beat.prototype, "startLng", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "decimal", precision: 9, scale: 6, nullable: true, name: "end_lat" }),
    __metadata("design:type", Number)
], Beat.prototype, "endLat", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "decimal", precision: 9, scale: 6, nullable: true, name: "end_lng" }),
    __metadata("design:type", Number)
], Beat.prototype, "endLng", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "timestamp", nullable: true, name: "planned_start_time" }),
    __metadata("design:type", Date)
], Beat.prototype, "plannedStartTime", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "timestamp", nullable: true, name: "planned_end_time" }),
    __metadata("design:type", Date)
], Beat.prototype, "plannedEndTime", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "created_by" }),
    __metadata("design:type", Number)
], Beat.prototype, "createdBy", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => User_entity_1.User),
    (0, typeorm_1.JoinColumn)({ name: "created_by" }),
    __metadata("design:type", User_entity_1.User)
], Beat.prototype, "createdByUser", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: "created_at" }),
    __metadata("design:type", Date)
], Beat.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: "updated_at" }),
    __metadata("design:type", Date)
], Beat.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_deleted', default: false }),
    __metadata("design:type", Boolean)
], Beat.prototype, "isDeleted", void 0);
Beat = __decorate([
    (0, typeorm_1.Entity)("beat")
], Beat);
exports.Beat = Beat;
const BeatRepository = () => {
    return postgresdb_1.DbConnections.AppDbConnection.getConnection().getRepository(Beat);
};
exports.BeatRepository = BeatRepository;
