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
exports.CollectionRepository = exports.Collection = void 0;
const typeorm_1 = require("typeorm");
const postgresdb_1 = require("../postgresdb");
const stores_entity_1 = require("./stores.entity");
const orders_entity_1 = require("./orders.entity");
let Collection = class Collection extends typeorm_1.BaseEntity {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: 'collection_id' }),
    __metadata("design:type", Number)
], Collection.prototype, "collectionId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'order_id' }),
    __metadata("design:type", Number)
], Collection.prototype, "orderId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => orders_entity_1.Orders),
    (0, typeorm_1.JoinColumn)({ name: 'order_id' }),
    __metadata("design:type", orders_entity_1.Orders)
], Collection.prototype, "orders", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'store_id' }),
    __metadata("design:type", Number)
], Collection.prototype, "storeId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => stores_entity_1.Stores),
    (0, typeorm_1.JoinColumn)({ name: 'store_id' }),
    __metadata("design:type", stores_entity_1.Stores)
], Collection.prototype, "stores", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'order_amount' }),
    __metadata("design:type", Number)
], Collection.prototype, "orderAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'collected_amount' }),
    __metadata("design:type", Number)
], Collection.prototype, "collectedAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'pending_amount' }),
    __metadata("design:type", Number)
], Collection.prototype, "pendingAmount", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', name: 'created_at' }),
    __metadata("design:type", Date)
], Collection.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP', name: 'updated_at' }),
    __metadata("design:type", Date)
], Collection.prototype, "updatedAt", void 0);
Collection = __decorate([
    (0, typeorm_1.Entity)()
], Collection);
exports.Collection = Collection;
const CollectionRepository = () => {
    return postgresdb_1.DbConnections.AppDbConnection.getConnection().getRepository(Collection);
};
exports.CollectionRepository = CollectionRepository;
