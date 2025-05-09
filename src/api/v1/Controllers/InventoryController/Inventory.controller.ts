import { InventoryRepository } from "../../../../core/DB/Entities/inventory.entity";
import { STATUSCODES } from "../../../../core/types/Constent/common";
import { GetInventoryList, UpdateInventoryDto } from "../../../../core/types/InventoryService/InventoryService";
import { Products } from "../../../../core/types/OrderService/OrderService";

class InventoryController {
    private inventoryRepository = InventoryRepository();

    constructor() { }

    async getInventoryByStoreId(input: GetInventoryList) {
        const { storeId } = input;
        try {
            const inventoryProducts = await this.inventoryRepository.find({
                where: {
                    storeId: +storeId
                },
                relations: ["product", "product.category", "product.brand"]

            })
            return { message: "Success.", status: STATUSCODES.SUCCESS, data: inventoryProducts }
        } catch (error) {
            throw error
        }
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
    async saveInventoryByStoreId(products: Products[], storeId: number, empId: number) {
        try {
            for (const product of products) {
                const existingInventoryItem = await this.inventoryRepository.findOne({
                    where: {
                        storeId: storeId,
                        empId: empId,
                        productId: product.productId
                    }
                });
                if (existingInventoryItem) {
                    existingInventoryItem.noOfCase += product.noOfCase;
                    existingInventoryItem.noOfPiece += product.noOfPiece;
                    await this.inventoryRepository.save(existingInventoryItem);
                } else {
                    const newInventoryItem = this.inventoryRepository.create({
                        productId: product.productId,
                        storeId: storeId,
                        empId: empId,
                        noOfCase: product.noOfCase,
                        noOfPiece: product.noOfPiece
                    });
                    await this.inventoryRepository.save(newInventoryItem);
                }
            }
        } catch (error) {
            console.log("error", error);
        }
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



    async updateInventory(input: UpdateInventoryDto) {
        try {
            for (const item of input.inventory) {
                const { inventoryId, noOfCase, noOfPiece } = item;
                await this.inventoryRepository.createQueryBuilder()
                    .update({ noOfCase, noOfPiece })
                    .where({ inventoryId })
                    .execute();
            }
            return { message: "Success.", status: STATUSCODES.SUCCESS }
        } catch (error) {
            throw error;
        }
    }
}

export { InventoryController as InventoryService }