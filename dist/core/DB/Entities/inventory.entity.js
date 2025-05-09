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
exports.InventoryRepository = exports.Inventory = void 0;
const typeorm_1 = require("typeorm");
const postgresdb_1 = require("../postgresdb");
const products_entity_1 = require("./products.entity");
let Inventory = class Inventory extends typeorm_1.BaseEntity {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: 'inventory_id' }),
    __metadata("design:type", Number)
], Inventory.prototype, "inventoryId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'emp_id' }),
    __metadata("design:type", Number)
], Inventory.prototype, "empId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "store_id" }),
    __metadata("design:type", Number)
], Inventory.prototype, "storeId", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => products_entity_1.Products),
    (0, typeorm_1.JoinColumn)({ name: 'product_id' }),
    __metadata("design:type", products_entity_1.Products)
], Inventory.prototype, "product", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "product_id", unique: false }),
    __metadata("design:type", Number)
], Inventory.prototype, "productId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "no_of_case", default: 0 }),
    __metadata("design:type", Number)
], Inventory.prototype, "noOfCase", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "no_of_piece", default: 0 }),
    __metadata("design:type", Number)
], Inventory.prototype, "noOfPiece", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', name: 'created_at' }),
    __metadata("design:type", Date)
], Inventory.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP', name: 'udpated_at' }),
    __metadata("design:type", Date)
], Inventory.prototype, "updatedAt", void 0);
Inventory = __decorate([
    (0, typeorm_1.Entity)()
    // @Index(["storeId", "productId"], { unique: true })
], Inventory);
exports.Inventory = Inventory;
const InventoryRepository = () => {
    return postgresdb_1.DbConnections.AppDbConnection.getConnection().getRepository(Inventory);
};
exports.InventoryRepository = InventoryRepository;
