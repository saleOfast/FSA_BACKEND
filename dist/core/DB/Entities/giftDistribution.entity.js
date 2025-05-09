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
exports.GiftsRepository = exports.Gifts = void 0;
const typeorm_1 = require("typeorm");
const postgresdb_1 = require("../postgresdb");
const stores_entity_1 = require("./stores.entity");
const products_entity_1 = require("./products.entity");
const User_entity_1 = require("./User.entity");
let Gifts = class Gifts extends typeorm_1.BaseEntity {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: 'gift_id' }),
    __metadata("design:type", Number)
], Gifts.prototype, "giftId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => stores_entity_1.Stores, (store) => store.gift, { onDelete: "CASCADE" }),
    (0, typeorm_1.JoinColumn)({ name: 'store_id' }),
    __metadata("design:type", stores_entity_1.Stores)
], Gifts.prototype, "store", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'store_id', nullable: true }) // Store ID column
    ,
    __metadata("design:type", Number)
], Gifts.prototype, "storeId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => products_entity_1.Products, (product) => product.gift, { onDelete: "CASCADE" }),
    (0, typeorm_1.JoinColumn)({ name: 'product_id' }),
    __metadata("design:type", products_entity_1.Products)
], Gifts.prototype, "product", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'product_id', nullable: true }),
    __metadata("design:type", Number)
], Gifts.prototype, "productId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'date', nullable: true }),
    __metadata("design:type", Date)
], Gifts.prototype, "date", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => User_entity_1.User, (user) => user.gift, { onDelete: "CASCADE" }),
    (0, typeorm_1.JoinColumn)({ name: 'added_by', referencedColumnName: 'emp_id' }),
    __metadata("design:type", User_entity_1.User)
], Gifts.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'added_by', nullable: true }),
    __metadata("design:type", Number)
], Gifts.prototype, "addedBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'quantity', nullable: true }),
    __metadata("design:type", Number)
], Gifts.prototype, "quantity", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'remarks', nullable: true }),
    __metadata("design:type", String)
], Gifts.prototype, "remarks", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'gift', nullable: true }),
    __metadata("design:type", String)
], Gifts.prototype, "gift", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'status', default: true }),
    __metadata("design:type", Boolean)
], Gifts.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', name: 'created_at' }),
    __metadata("design:type", Date)
], Gifts.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP', name: 'updated_at' }),
    __metadata("design:type", Date)
], Gifts.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.DeleteDateColumn)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], Gifts.prototype, "deletedAt", void 0);
Gifts = __decorate([
    (0, typeorm_1.Entity)({ name: 'gifts' })
], Gifts);
exports.Gifts = Gifts;
const GiftsRepository = () => {
    return postgresdb_1.DbConnections.AppDbConnection.getConnection().getRepository(Gifts);
};
exports.GiftsRepository = GiftsRepository;
