import { CollectionRepository } from "core/DB/Entities/collection.entity";
import { Products } from "../../../../core/types/OrderService/OrderService";

class CollectionController {
    private collectionRepository = CollectionRepository();

    constructor() { }

    async saveCollection(products: Products[], storeId: number, empId: number) {
        try {


        } catch (error) {
            console.log("error", error)
        }
    }


}

export { CollectionController as CollectionService }