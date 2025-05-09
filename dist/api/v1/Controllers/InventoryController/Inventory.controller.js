"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InventoryService = void 0;
const inventory_entity_1 = require("../../../../core/DB/Entities/inventory.entity");
const common_1 = require("../../../../core/types/Constent/common");
class InventoryController {
    constructor() {
        this.inventoryRepository = (0, inventory_entity_1.InventoryRepository)();
    }
    getInventoryByStoreId(input) {
        return __awaiter(this, void 0, void 0, function* () {
            const { storeId } = input;
            try {
                const inventoryProducts = yield this.inventoryRepository.find({
                    where: {
                        storeId: +storeId
                    },
                    relations: ["product", "product.category", "product.brand"]
                });
                return { message: "Success.", status: common_1.STATUSCODES.SUCCESS, data: inventoryProducts };
            }
            catch (error) {
                throw error;
            }
        });
    }
    // async saveInventoryByStoreId(products: Products[], storeId: number, empId: number) {
    //     console.log("?????", products, "s", empId, "empiiiid", storeId)
    //     try {
    //         const inventoryItem = await this.inventoryRepository.find({
    //             where: {
    //                 storeId
    //             }
    //         })
    //         console.log({inventoryItem}, ">>>>>>>>")
    //         const inventoryList: any[] = [];
    //         for (const product of products) {
    //             if (inventoryItem.length === 0 || inventoryItem.findIndex(i => i.productId === product.productId) > -1) {
    //                 inventoryList.push({
    //                     productId: product.productId,
    //                     storeId: storeId,
    //                     empId: empId,
    //                     noOfCase: product.noOfCase,
    //                     noOfPiece: product.noOfPiece
    //                 })
    //             }
    //         }
    //         console.log({inventoryList})
    //         if (inventoryList.length > 0) {
    //             // await this.inventoryRepository.insert(inventoryList);                
    //             await this.inventoryRepository
    //                 .createQueryBuilder()
    //                 .insert()
    //                 .into(Inventory)
    //                 .values(inventoryList)
    //                 .orIgnore()
    //                 .execute();
    //         }
    //     } catch (error) {
    //         console.log("error", error)
    //     }
    // }
    saveInventoryByStoreId(products, storeId, empId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                for (const product of products) {
                    const existingInventoryItem = yield this.inventoryRepository.findOne({
                        where: {
                            storeId: storeId,
                            empId: empId,
                            productId: product.productId
                        }
                    });
                    if (existingInventoryItem) {
                        existingInventoryItem.noOfCase += product.noOfCase;
                        existingInventoryItem.noOfPiece += product.noOfPiece;
                        yield this.inventoryRepository.save(existingInventoryItem);
                    }
                    else {
                        const newInventoryItem = this.inventoryRepository.create({
                            productId: product.productId,
                            storeId: storeId,
                            empId: empId,
                            noOfCase: product.noOfCase,
                            noOfPiece: product.noOfPiece
                        });
                        yield this.inventoryRepository.save(newInventoryItem);
                    }
                }
            }
            catch (error) {
                console.log("error", error);
            }
        });
    }
    // async saveInventoryByStoreId(products: Products[], storeId: number, empId: number) {
    //     try {
    //         for (const product of products) {
    //             // Check if any inventory item exists for the specified storeId and productId
    //             const existingInventoryItem = await this.inventoryRepository.findOne({
    //                 where: {
    //                     storeId: storeId,
    //                     productId: product.productId,
    //                 }
    //             });
    //             if (existingInventoryItem) {
    //                 // If an inventory item exists for the specified storeId and productId,
    //                 // check if it belongs to the same empId
    //                 if (existingInventoryItem.empId === empId) {
    //                     // If the existing item belongs to the same empId, update its values
    //                     existingInventoryItem.noOfCase += product.noOfCase;
    //                     existingInventoryItem.noOfPiece += product.noOfPiece;
    //                     await this.inventoryRepository.save(existingInventoryItem);
    //                 } else {
    //                     // If the existing item belongs to a different empId, insert a new entry
    //                     const newInventoryItem = new Inventory();
    //                     newInventoryItem.productId = product.productId,
    //                     newInventoryItem.storeId = storeId,
    //                     newInventoryItem.empId = empId,
    //                     newInventoryItem.noOfCase = product.noOfCase,
    //                     newInventoryItem.noOfPiece = product.noOfPiece
    //                     await this.inventoryRepository.save(newInventoryItem);
    //                 }
    //             } else {
    //                 // If no inventory item exists for the specified storeId and productId, insert a new entry
    //                 const newInventoryItem = new Inventory();
    //                 newInventoryItem.productId = product.productId,
    //                 newInventoryItem.storeId = storeId,
    //                 newInventoryItem.empId = empId,
    //                 newInventoryItem.noOfCase = product.noOfCase,
    //                 newInventoryItem.noOfPiece = product.noOfPiece
    //                 await this.inventoryRepository.save(newInventoryItem);
    //             }
    //         }
    //     } catch (error) {
    //         console.log("error", error);
    //     }
    // }
    updateInventory(input) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                for (const item of input.inventory) {
                    const { inventoryId, noOfCase, noOfPiece } = item;
                    yield this.inventoryRepository.createQueryBuilder()
                        .update({ noOfCase, noOfPiece })
                        .where({ inventoryId })
                        .execute();
                }
                return { message: "Success.", status: common_1.STATUSCODES.SUCCESS };
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.InventoryService = InventoryController;
