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
exports.ActivitiesRepository = exports.Activities = void 0;
const typeorm_1 = require("typeorm");
const postgresdb_1 = require("../postgresdb");
const common_1 = require("../../../core/types/Constent/common");
const activities_jointWork_entity_1 = require("./activities.jointWork.entity");
const stores_entity_1 = require("./stores.entity");
const products_entity_1 = require("./products.entity");
const User_entity_1 = require("./User.entity");
let Activities = class Activities extends typeorm_1.BaseEntity {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: 'activity_id' }),
    __metadata("design:type", Number)
], Activities.prototype, "activityId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => stores_entity_1.Stores, (store) => store.activities, { onDelete: "CASCADE" }),
    (0, typeorm_1.JoinColumn)({ name: 'store_id' }) // Creates the store_id foreign key column
    ,
    __metadata("design:type", stores_entity_1.Stores)
], Activities.prototype, "store", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'store_id', nullable: true }) // Store ID column
    ,
    __metadata("design:type", Number)
], Activities.prototype, "storeId", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, name: 'activity_type', enum: common_1.ActivityTypeEnum }),
    __metadata("design:type", String)
], Activities.prototype, "activityType", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'date' }),
    __metadata("design:type", Date)
], Activities.prototype, "date", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'interval', name: 'duration', nullable: true }),
    __metadata("design:type", String)
], Activities.prototype, "duration", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => User_entity_1.User, (user) => user.activities, { onDelete: "CASCADE" }),
    (0, typeorm_1.JoinColumn)({ name: 'added_by', referencedColumnName: 'emp_id' }),
    __metadata("design:type", User_entity_1.User)
], Activities.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'added_by' }),
    __metadata("design:type", Number)
], Activities.prototype, "addedBy", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => products_entity_1.Products, (product) => product.activities, { onDelete: "CASCADE" }),
    (0, typeorm_1.JoinColumn)({ name: 'product_id' }),
    __metadata("design:type", products_entity_1.Products)
], Activities.prototype, "product", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'product_id' }),
    __metadata("design:type", Number)
], Activities.prototype, "productId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'remarks' }),
    __metadata("design:type", String)
], Activities.prototype, "remarks", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'status', default: true }),
    __metadata("design:type", Boolean)
], Activities.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', name: 'created_at' }),
    __metadata("design:type", Date)
], Activities.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP', name: 'updated_at' }),
    __metadata("design:type", Date)
], Activities.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.DeleteDateColumn)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], Activities.prototype, "deletedAt", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => activities_jointWork_entity_1.JointWork, (jointWork) => jointWork.activity),
    __metadata("design:type", Array)
], Activities.prototype, "jointWorks", void 0);
Activities = __decorate([
    (0, typeorm_1.Entity)({ name: 'activities' })
], Activities);
exports.Activities = Activities;
const ActivitiesRepository = () => {
    return postgresdb_1.DbConnections.AppDbConnection.getConnection().getRepository(Activities);
};
exports.ActivitiesRepository = ActivitiesRepository;
