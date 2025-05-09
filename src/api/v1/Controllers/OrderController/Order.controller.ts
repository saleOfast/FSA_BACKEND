import { AddScreenshot, CollectionListByStore, CollectionListFilter, CreateOrder, GetDiscount, GetOrderById, IOrders, OrderList, OrderListByStore, OrderListByVisit, OrderListFilter, Products, StatusHistoryEntry, UpdateOrderBySpecialDiscountById, UpdateOrderCollection, UpdateOrderTrackStatusById } from "../../../../core/types/OrderService/OrderService";
import { Orders, OrdersRepository } from "../../../../core/DB/Entities/orders.entity";
import { DiscountType, DurationEnum, OrderStatus, PaymentStatus, STATUSCODES, TimelineEnum, UserRole } from "../../../../core/types/Constent/common";
import { IApiResponse } from "../../../../core/types/Constent/commonService";
import { IUser } from "../../../../core/types/AuthService/AuthService";
import { StoreRepository } from "../../../../core/DB/Entities/stores.entity";
import { ICollectionResponse, IStore } from "../../../../core/types/StoreService/StoreService";
import { dayTrackingFilter, IVisit, UpdateImage } from "../../../../core/types/VisitService/VisitService";
import { VisitRepository } from "../../../../core/DB/Entities/Visit.entity";
import { ProductRepository } from "../../../../core/DB/Entities/products.entity";
import { FindOptionsWhere, In } from "typeorm";
import { IProducts } from "../../../../core/types/ProductService/ProductService";
import { InventoryService } from "../InventoryController/Inventory.controller";
import { endOfDay, startOfDay, subDays } from "date-fns";
import { PaymentRepository } from "../../../../core/DB/Entities/payment.entity";
import { UserRepository } from "../../../../core/DB/Entities/User.entity";
import { monthlyFilter, ReportFilter } from "core/types/AttendanceService/AttendanceService";
import { BeatRepository } from "../../../../core/DB/Entities/beat.entity";
import { IBeat } from "core/types/BeatService/Beat";

class OrderController {
    private orderRepositry = OrdersRepository();
    private storeRepositry = StoreRepository();
    private visitRepositry = VisitRepository();
    private productResposity = ProductRepository();
    private paymentRepositry = PaymentRepository();
    private userRepository = UserRepository();
    private beatRespositry = BeatRepository();


    constructor() { }

    async createOrder(input: CreateOrder, payload: IUser): Promise<IApiResponse> {
        try {
            const { orderId, storeId, orderDate, orderAmount, visitId, isCallType, products, orderStatus, isVisibility, netAmount, pieceDiscount } = input;
            const { emp_id } = payload;
            const store: IStore | null = await this.storeRepositry.findOne({ where: { storeId }, relations: ["storeCat"] });
            if (!store) {
                return { message: "Store Not Found.", status: STATUSCODES.NOT_FOUND }
            }

            // const visit: IVisit | null = await this.visitRepositry.findOne({ where: { visitId } })
            // if (!visit) {
            //     return { message: "Visit Not Found.", status: STATUSCODES.NOT_FOUND }
            // }

            let totalOrderAmount: number = 0;
            const productIds = products.map((item) => item.productId);
            const productList = await this.productResposity.createQueryBuilder("product")
                .where("product.productId IN (:...productIds)", { productIds: [...new Set(productIds)] }) // Use Set to get unique IDs
                .getMany();

            const productMap = new Map(productList.map((product: any) => [product.productId, product]));

            const finalProductList: any = productIds.map((id: any) => productMap.get(id));

            let index: number = 0;
            const processedProductIds = new Set<number>();

            for (let item of finalProductList) {
                if (processedProductIds.has(item.productId)) {
                    continue;
                }
                const matchingProducts: Products[] = products.filter((ele: Products) => ele.productId == item.productId);

                for (let output of matchingProducts) {
                    totalOrderAmount += (((output.noOfCase * item.caseQty) + output.noOfPiece) * item.rlp);
                }
                processedProductIds.add(item.productId);

                index++;
            }

            let OrderValueDiscount: number = 0;
            const flatDiscount = await this.getFlatDiscount(store, orderAmount);
            OrderValueDiscount = flatDiscount.netAmount;
            let visibDiscountValue = 0;
            if (isVisibility) {
                const visibDiscount = await this.getVisibilityDiscount(store, OrderValueDiscount != 0 ? OrderValueDiscount : orderAmount);
                OrderValueDiscount = visibDiscount.netAmount;
                visibDiscountValue = visibDiscount.discountValue;
            }

            let skuDiscountValue = 0;
            let discountOnOrderValue = 0;
            if (!store.isPremiumStore) {
                const skuDiscount = await this.getSkuDiscount(products, OrderValueDiscount != 0 ? OrderValueDiscount : orderAmount);
                OrderValueDiscount = skuDiscount.netAmount; skuDiscountValue = skuDiscount.discountValue;
                const orderValueDiscount = await this.getOrderValueDiscount(store, OrderValueDiscount != 0 ? OrderValueDiscount : orderAmount);
                OrderValueDiscount = orderValueDiscount.netAmount; discountOnOrderValue = orderValueDiscount.discountValue;
            }

            if (pieceDiscount > 0) {
                let dis = OrderValueDiscount != 0 ? OrderValueDiscount : orderAmount
                OrderValueDiscount = dis - pieceDiscount;
                //  discountOnOrderValue = pieceDiscount
            }
            if (orderAmount != totalOrderAmount) {
                return { message: "Order amount is not correct.", status: STATUSCODES.BAD_REQUEST }
            }
            const checkNetPrice: number = OrderValueDiscount != 0 ? OrderValueDiscount : 0;
            // console.log({checkNetPrice,netAmount, pieceDiscount})

            if (checkNetPrice !== netAmount) {
                return { message: "Net amount is not correct.", status: STATUSCODES.BAD_REQUEST }
            }

            if (orderId) {

                const existingOrder = await this.orderRepositry.findOne({ where: { orderId } });

                if (!existingOrder) {
                    return { message: "Order Not Found.", status: STATUSCODES.NOT_FOUND };
                }

                existingOrder.storeId = storeId;
                existingOrder.visitId = visitId;
                existingOrder.isCallType = isCallType
                existingOrder.empId = emp_id;
                existingOrder.orderDate = orderDate;
                existingOrder.orderAmount = orderAmount;
                existingOrder.collectedAmount = 0;
                existingOrder.products = products;
                existingOrder.orderStatus = orderStatus;
                existingOrder.netAmount = netAmount;
                existingOrder.skuDiscountValue = skuDiscountValue;
                existingOrder.visibilityDiscountValue = visibDiscountValue;
                existingOrder.flatDiscountValue = flatDiscount.discountValue;
                existingOrder.orderValueDiscountValue = discountOnOrderValue;
                existingOrder.pieceDiscount = pieceDiscount;
                existingOrder.totalDiscountAmount = Number((skuDiscountValue + visibDiscountValue + flatDiscount.discountValue + discountOnOrderValue).toFixed(2))

                await this.orderRepositry.save(existingOrder);

                return { message: "Success.", status: STATUSCODES.SUCCESS }
            }

            const newOrder = new Orders();
            newOrder.storeId = storeId;
            newOrder.visitId = visitId;
            newOrder.isCallType = isCallType
            newOrder.empId = emp_id;
            newOrder.orderDate = orderDate;
            newOrder.orderAmount = orderAmount;
            newOrder.collectedAmount = 0;
            newOrder.products = products;
            newOrder.orderStatus = orderStatus;
            newOrder.netAmount = netAmount;
            newOrder.skuDiscountValue = skuDiscountValue;
            newOrder.visibilityDiscountValue = visibDiscountValue;
            newOrder.flatDiscountValue = flatDiscount.discountValue;
            newOrder.orderValueDiscountValue = discountOnOrderValue;
            newOrder.pieceDiscount = pieceDiscount;
            newOrder.totalDiscountAmount = Number((skuDiscountValue + visibDiscountValue + flatDiscount.discountValue + discountOnOrderValue).toFixed(2))

            const order = await this.orderRepositry.save(newOrder);
            // const inventoryService = new InventoryService();
            // await inventoryService.saveInventoryByStoreId(products, storeId, emp_id);


            return { message: "Success.", status: STATUSCODES.SUCCESS, data: order }
        } catch (error) {
            throw error;
        }
    }

    async getOrderValueDiscount(store: IStore, amount: number): Promise<GetDiscount> {
        try {
            const { orderValueDiscount, isActiveOrderValueDiscount } = store;

            let orderValueDis: number = 0;

            if (isActiveOrderValueDiscount == true && orderValueDiscount) {
                for (let item of orderValueDiscount) {
                    const [min, max] = item.amountRange.split('-').map(Number);
                    const range = { min, max };
                    if (amount > range.min && amount < range.max) {
                        orderValueDis = item.discountType == DiscountType.PERCENTAGE ? (amount * item.value / 100) : item.value
                    }
                }
            }

            return { netAmount: amount - orderValueDis, discountValue: orderValueDis };
        } catch (error) {
            throw new Error(`Error: when calculating the Order value discount in order.`)
        }
    }

    async getFlatDiscount(store: IStore, amount: number): Promise<GetDiscount> {
        try {
            const { flatDiscount } = store;
            let flatDiscountValue: number = 0;

            if (flatDiscount && flatDiscount.isActive == true) {
                flatDiscountValue = flatDiscount.discountType == DiscountType.PERCENTAGE ? (amount * flatDiscount.value / 100) : flatDiscount.value
            }

            return { netAmount: amount - flatDiscountValue, discountValue: flatDiscountValue };
        } catch (error) {
            throw new Error(`Error: when calculating the Flat discount in order.`)
        }
    }

    async getVisibilityDiscount(store: IStore, amount: number): Promise<GetDiscount> {
        try {
            const { visibilityDiscount } = store;
            let visibDiscount: number = 0;

            if (visibilityDiscount) {
                visibDiscount = visibilityDiscount.discountType == DiscountType.PERCENTAGE ? (amount * visibilityDiscount.value / 100) : visibilityDiscount.value
            }

            return { netAmount: amount - visibDiscount, discountValue: visibDiscount };
        } catch (error) {
            throw new Error(`Error: when calculating the visibility discount in order.`);
        }
    }

    async getSkuDiscount(products: Products[], amount: number): Promise<GetDiscount> {
        try {
            const productIds = products.map((item) => item.productId);
            const productList: IProducts[] | null = await this.productResposity.find({ where: { productId: In(productIds) } });

            let totalSkuDiscount: number = 0
            let index: number = 0;
            for (let item of productList) {
                for (let product of products) {
                    if (item.skuDiscount && item.skuDiscount.isActive == true && item.productId === product.productId) {
                        const totalNumberOfPiece = ((product.noOfCase * item.caseQty) + product.noOfPiece);
                        const totalProductAmount = (item.rlp * totalNumberOfPiece);
                        const discountPerItem: number = item.skuDiscount.discountType == DiscountType.PERCENTAGE ? totalProductAmount * item.skuDiscount.value / 100 : item.skuDiscount.discountType == DiscountType.VALUE ? (item.skuDiscount.value * totalNumberOfPiece) : 0;
                        totalSkuDiscount = totalSkuDiscount + discountPerItem;
                    }
                }
                index++
            }
            return { netAmount: amount - totalSkuDiscount, discountValue: totalSkuDiscount };
        } catch (error) {
            throw new Error(`Error: when calculating the sku discount in order.`);
        }
    }

    async getOrderById(input: GetOrderById): Promise<IApiResponse> {
        try {
            const { orderId } = input;
            const order: IOrders | null = await this.orderRepositry.findOne({ where: { orderId: Number(orderId) }, relations: ["store", "visit"] });

            if (!order) {
                return { message: "Order Not Found.", status: STATUSCODES.NOT_FOUND }
            }

            return { message: "Success.", status: STATUSCODES.SUCCESS, data: order }
        } catch (error) {
            throw error;
        }
    }

    async listByStoreId(input: OrderListByStore, payload: any): Promise<IApiResponse> {
        try {
            const { role, emp_id } = payload;
            const { storeId } = input;
            let fitlerQuery: any = {};
            // if (role === UserRole.RSM) {
            //     const ordersIds: any = await this.orderRepositry.createQueryBuilder("orders")
            //         // .leftJoinAndSelect("orders.store", "store")
            //         .leftJoin("orders.user", "user")
            //         .where("user.managerId = :managerId", { managerId: emp_id })
            //         .select("orders.orderId")
            //         .getMany()
            //         .then((orders: IOrders[]) => orders.map(order => order.orderId));


            //     if (ordersIds.length > 0) {
            //         fitlerQuery.orderId = ordersIds;
            //     } else {
            //         return { message: "No visitIds found for admin user.", status: STATUSCODES.NOT_FOUND };
            //     }
            // }

            let queryBuilder: IOrders[] | any = await this.orderRepositry.createQueryBuilder("orders")
                .leftJoinAndSelect("orders.store", "store")
                .leftJoinAndSelect("orders.visit", "visit")
                .select(["orders.orderId", "orders.orderAmount", "orders.orderDate", "visit.visitDate", "orders.orderStatus", "orders.netAmount", "orders.paymentStatus", "orders.collectedAmount", "orders.products"]) // specify the fields you need
                .where("orders.storeId = :storeId", { storeId: Number(storeId) })

            // if(role === UserRole.RSM){
            //     queryBuilder.andWhere("orders.orderId IN (:...orderId)", { orderId: fitlerQuery.orderId });
            // }
            // else if(role === UserRole.SSM){
            //     queryBuilder.andWhere('orders.empId = :empId', {empId: emp_id})
            // }
            const order = await queryBuilder.orderBy("orders.createdAt", "DESC").getMany();
            if (!order) {
                return { message: "Order Not Found.", status: STATUSCODES.NOT_FOUND }
            }

            return { message: "Success.", status: STATUSCODES.SUCCESS, data: order }
        } catch (error) {
            throw error;
        }
    }

    async orderListByVisitId(input: OrderListByVisit): Promise<IApiResponse> {
        try {
            const { visitId, storeId } = input;
            const order: number | null = await this.orderRepositry.count({
                where: { visitId: Number(visitId), storeId: Number(storeId) }
            })
            return { message: "Success.", status: STATUSCODES.SUCCESS, data: order }
        } catch (error) {
            throw error;
        }
    }

    async updateOrderCOllection(input: UpdateOrderCollection): Promise<IApiResponse> {
        try {
            const { collectedAmount, orderId } = input;
            const order = await this.orderRepositry.findOne({
                where: {
                    orderId
                }
            })
            if (!order) {
                return { message: "Order Not Found.", status: STATUSCODES.NOT_FOUND }
            }
            const payment: any | null = await this.paymentRepositry.createQueryBuilder("payment")
                .select("payment.orderId", "orderId")
                .addSelect("SUM(payment.amount)", "collectedAmount")
                .where("payment.orderId = :orderId", { orderId: orderId })
                .groupBy("payment.orderId")
                .getRawOne();
            if (collectedAmount <= Number(payment.netAmount - payment.collectedAmount)) {
                return { message: "Collected amount should be equal or less than to the total Pending amount.", status: STATUSCODES.NOT_FOUND }
            }
            const nOrder = new Orders()
            nOrder.collectedAmount = Number(payment.collectedAmount)
            if (+order.netAmount === +payment.collectedAmount) {
                nOrder.paymentStatus = PaymentStatus.SUCCESS;
            }

            await this.orderRepositry.createQueryBuilder().update(nOrder).where({ orderId }).execute();
            return { message: "Success.", status: STATUSCODES.SUCCESS }
        }
        catch (error) {
            throw error;
        }
    }
    async collectionList(input: OrderList, payload: IUser): Promise<IApiResponse> {
        try {
            const { orderId } = input;
            const { emp_id } = payload;
            const queryFilter: FindOptionsWhere<IOrders> = {
                orderId: Number(orderId),
                // empId: emp_id
            }
            const orders: IOrders | null = await this.orderRepositry.findOne({ where: queryFilter, relations: ["store", "visit"] });


            return { message: "Success.", status: STATUSCODES.SUCCESS, data: orders }
        } catch (error) {
            throw error;
        }
    }



    // async collections(input: CollectionListFilter, payload: IUser): Promise<IApiResponse> {
    //     try {
    //         const { emp_id } = payload;
    //         let { status, pageNumber, pageSize } = input;

    //         const orders: IOrderCollectionResponse[] | null = await this.orderRepositry.createQueryBuilder("orders")
    //             .leftJoin("orders.store", "store")
    //             .select("orders.storeId", "storeId")
    //             .addSelect("COUNT(orders.orderId)", "orderCount")
    //             .addSelect("SUM(orders.orderAmount)", "totalAmount")
    //             .addSelect("SUM(orders.collectedAmount)", "totalCollectedAmount")
    //             .addSelect("SUM(orders.netAmount)", "netAmount")
    //             .where("orders.empId = :empId", { empId: emp_id })
    //             .groupBy("orders.storeId")
    //             .getRawMany();
    //             console.log(">.....", orders)
    //         // const orders: IOrderCollectionResponse[] | null = await this.orderRepositry.find({ where: { empId: emp_id }})
    //         let collection: ICollectionResponse[] = [];
    //         for (let item of orders) {
    //             const store: IStore | null = await this.storeRepositry.findOne({ where: { storeId: item.storeId }, relations: ["storeCat"] });
    //             // console.log(Number(item.orderCount) - Number(item.totalCollectedAmount))
    //             collection.push({
    //                 storeId: store!.storeId,
    //                 storeName: store!.storeName,
    //                 storeType: (store as any).storeCat.categoryName as string,
    //                 amount: Number(item.totalAmount) - Number(item.totalCollectedAmount),
    //                 totalOrderAmount: Number(item.totalAmount),
    //                 totalCollectedAmount: Number(item.totalCollectedAmount),
    //                 netAmount: Number((item as any).netAmount),
    //                 status: Number(item.totalAmount) > Number(item.totalCollectedAmount) ? "PENDING" : "PAID"
    //             });
    //         }
    //         if (status) {
    //             collection = collection.filter(e => e.status === status);
    //         }
    //         return { message: "Success.", status: STATUSCODES.SUCCESS, data: collection }
    //     } catch (error) {
    //         throw error;
    //     }
    // }
    // async collections(input: CollectionListFilter, payload: IUser): Promise<IApiResponse> {
    //     try {
    //         const { emp_id, role } = payload;
    //         let { status, pageNumber, pageSize } = input;
    //        let pageNumbers: any = pageNumber || 1;
    //        let pageSizes: any = pageSize || 10;

    //         let fitlerQuery: any = {};
    //         if (role === UserRole.RSM) {
    //             const ordersIds: any = await this.orderRepositry.createQueryBuilder("orders")
    //                 .leftJoin("orders.user", "user")
    //                 .where("user.managerId = :managerId", { managerId: emp_id })
    //                 .select("orders.orderId")
    //                 .getMany()
    //                 .then((orders: IOrders[]) => orders.map(order => order.orderId));

    //             if (ordersIds.length > 0) {
    //                 fitlerQuery.orderId = ordersIds;
    //             } else {
    //                 return { message: "No visitIds found for admin user.", status: STATUSCODES.NOT_FOUND };
    //             }
    //         }

    //         let buildQuery: any = this.orderRepositry.createQueryBuilder("orders")
    //             .leftJoinAndSelect("orders.store", "store")
    //             .select([
    //                 "orders.orderId AS orderId",
    //                 "orders.collectedAmount AS collectedAmount",
    //                 "orders.orderAmount AS orderAmount",
    //                 "orders.netAmount AS netAmount",
    //                 "orders.updatedAt AS updatedAt",
    //                 "store.storeId AS storeId",
    //                 "store.storeName AS storeName",
    //             ]);

    //         if (role === UserRole.RSM) {
    //             buildQuery.where("orders.orderId IN (:...orderId)", { orderId: fitlerQuery.orderId });
    //         } else if (role === UserRole.SSM) {
    //             buildQuery.where("orders.empId = :empId", { empId: emp_id });
    //         }

    //         // Pagination
    //         const totalRecords: any = await buildQuery.getCount();
    //         buildQuery.skip((+pageNumbers - 1) * pageSizes).take(+pageSizes);

    //         const orders: any = await buildQuery.getRawMany();
    //           console.log({orders})
    //         let collection: any = [];
    //         for (let order of orders) {
    //             const totalCollectedAmount = order.collectedAmount;
    //             const totalAmount = order.orderAmount;
    //             const netAmount = order.netAmount;

    //             const store: any = await this.storeRepositry.findOne({
    //                 select: ["storeName", "storeId"],
    //                 where: { storeId: order.storeId }, relations: ["storeCat"]
    //             });

    //             collection.push({
    //                 orderId: order.orderId,
    //                 storeId: store!.storeId,
    //                 storeName: store!.storeName,
    //                 storeType: store.storeCat.categoryName,
    //                 pendingAmount: Number(netAmount) - Number(totalCollectedAmount),
    //                 totalOrderAmount: Number(totalAmount),
    //                 totalCollectedAmount: Number(totalCollectedAmount),
    //                 netAmount: Number(netAmount),
    //                 status: Number(netAmount) > Number(totalCollectedAmount) ? "PENDING" : "PAID"
    //             });
    //         }

    //         if (status) {
    //             collection = collection.filter((e: any) => e.status === status);
    //         }

    //         const response = {
    //             collection,
    //             pagination: {
    //                 pageNumber,
    //                 pageSize,
    //                 totalRecords
    //             }
    //         };

    //         console.log({ response });
    //         return { message: "Success.", status: STATUSCODES.SUCCESS, data: response };
    //     } catch (error) {
    //         throw error;
    //     }
    // }

    async collections(input: CollectionListFilter, payload: IUser): Promise<IApiResponse> {
        try {
            const { emp_id, role } = payload;
            let { status, pageNumber, pageSize } = input;
            let fitlerQuery: any = [];
            if (role === UserRole.RSM) {
                const storeIds: any = await this.beatRespositry.createQueryBuilder("beat")
                    .leftJoin("beat.user", "user")
                    .where("user.managerId = :managerId", { managerId: emp_id })
                    .select("beat.store")
                    .getMany()
                    .then((beats: IBeat[]) => beats.map(beat => beat.store));
                // console.log({storeIds})
                if (storeIds.length > 0) {
                    fitlerQuery = storeIds;
                } else {
                    return { message: "No Store found for user.", status: STATUSCODES.NOT_FOUND };
                }
            } else {
                const stores: any = await this.beatRespositry.createQueryBuilder("beat")
                    .where("beat.empId = :empId", { empId: emp_id })
                    .select("beat.store")
                    .getMany();
                if (stores.length > 0) {
                    fitlerQuery = stores;
                }

            }

            let buildQuery: any = await this.orderRepositry.createQueryBuilder("orders")
                .leftJoinAndSelect("orders.store", "store")
                .select([
                    "orders.orderId",
                    "orders.collectedAmount",
                    "orders.orderAmount",
                    "orders.netAmount",
                    "orders.updatedAt",
                    "orders.createdAt",
                    "store.storeId",
                    "store.storeName",
                ]).addSelect(`CASE 
                    WHEN orders.netAmount > orders.collectedAmount THEN 'PENDING'
                    ELSE 'PAID'
                END` , "status");

            if (role === UserRole.SSM || role === UserRole.RSM || role === UserRole.CHANNEL || role === UserRole.DISTRIBUTOR || role === UserRole.RETAILER) {
                const storeIds = fitlerQuery.map((beat: any) => beat.store).flat();
                buildQuery.where("orders.storeId IN (:...storeIds)", { storeIds: storeIds });
            }
            if (status) {
                buildQuery.andWhere(`CASE 
                    WHEN orders.netAmount > orders.collectedAmount THEN 'PENDING'
                    ELSE 'PAID'
                END = :status`, { status });
            }
            buildQuery.andWhere("orders.orderStatus NOT IN (:...statuses)", { statuses: [OrderStatus.CANCELLED, OrderStatus.ORDERSAVED] })


            buildQuery.andWhere("orders.orderStatus != :orderStatus", { orderStatus: OrderStatus.CANCELLED })
                .orderBy("orders.createdAt", "DESC");
            buildQuery.skip((+pageNumber - 1) * +pageSize).take(+pageSize);
            const orders: any = await buildQuery.getManyAndCount();
            let collection: any = [];
            for (let order of orders[0]) {
                const totalCollectedAmount = order.collectedAmount;
                const totalAmount = order.orderAmount;
                const netAmount = order.netAmount;
                const store: any = await this.storeRepositry.findOne({
                    select: ["storeName", "storeId"],
                    where: { storeId: order.store.storeId }, relations: ["storeCat"]
                });
                collection.push({
                    orderId: order.orderId,
                    storeId: store!.storeId,
                    storeName: store!.storeName,
                    storeType: (store as any).storeCat.categoryName as string,
                    pendingAmount: Number(netAmount) - Number(totalCollectedAmount),
                    totalOrderAmount: Number(totalAmount),
                    totalCollectedAmount: Number(totalCollectedAmount),
                    netAmount: Number(netAmount),
                    status: Number(netAmount) > Number(totalCollectedAmount) ? "PENDING" : "PAID"
                });
            }

            if (status) {
                collection = collection.filter((e: any) => e.status == status);
            }
            const response = {
                collection,
                pagination: {
                    pageNumber: +pageNumber,
                    pageSize: +pageSize,
                    totalRecords: orders.length > 0 ? orders[1] : 0
                }
            }
            return { message: "Success.", status: STATUSCODES.SUCCESS, data: response };
        } catch (error) {
            throw error;
        }
    }

    async collectionListByStoreId(input: CollectionListByStore, payload: IUser): Promise<IApiResponse> {
        try {
            const { emp_id, role } = payload;
            let { storeId, status } = input;
            let fitlerQuery: any = {};
            // if (role === UserRole.RSM) {
            //     const ordersIds: any = await this.orderRepositry.createQueryBuilder("orders")
            //         // .leftJoinAndSelect("orders.store", "store")
            //         .leftJoin("orders.user", "user")
            //         .where("user.managerId = :managerId", { managerId: emp_id })
            //         .select("orders.orderId")
            //         .getMany()
            //         .then((orders: IOrders[]) => orders.map(order => order.orderId));


            //     if (ordersIds.length > 0) {
            //         fitlerQuery.orderId = ordersIds;
            //     } else {
            //         return { message: "No visitIds found for admin user.", status: STATUSCODES.NOT_FOUND };
            //     }
            // }
            let buildQuery: any = this.orderRepositry.createQueryBuilder("orders")
                .leftJoinAndSelect("orders.store", "store")
                .where("store.storeId = :storeId", { storeId })
                .andWhere("orders.orderStatus NOT IN (:...statuses)", { statuses: [OrderStatus.CANCELLED, OrderStatus.ORDERSAVED] })


            // if (role === UserRole.RSM) {
            //     buildQuery.andWhere("orders.orderId IN (:...orderId)", { orderId: fitlerQuery.orderId });
            // } else if (role === UserRole.SSM) {
            //     buildQuery.andWhere("orders.empId = :empId", { empId: emp_id });
            // }

            // Execute the query
            const orders = await buildQuery.getMany();

            let collection: ICollectionResponse[] = [];

            for (let order of orders) {
                const totalCollectedAmount = order.collectedAmount;
                const totalAmount = order.orderAmount;
                const netAmount = order.netAmount;

                let stores: any = order?.store;
                const store: IStore | null = await this.storeRepositry.findOne({ where: { storeId: stores.storeId }, relations: ["storeCat"] });
                collection.push({
                    orderId: order.orderId,
                    storeId: store!.storeId,
                    storeName: store!.storeName,
                    storeType: (store as any).storeCat.categoryName as string,
                    pendingAmount: Number(netAmount) - Number(totalCollectedAmount),
                    totalOrderAmount: Number(totalAmount),
                    totalCollectedAmount: Number(totalCollectedAmount),
                    netAmount: Number(netAmount),
                    status: Number(netAmount) > Number(totalCollectedAmount) ? "PENDING" : "PAID"
                });
            }
            if (status) {
                collection = collection.filter(e => e.status === status);
            }

            return { message: "Success.", status: STATUSCODES.SUCCESS, data: collection };
        } catch (error) {
            throw error;
        }
    }

    async getAllOrders(input: OrderListFilter, payload: IUser): Promise<IApiResponse> {
        try {
            let { duration, pageNumber, pageSize, orderStatus, isCallType } = input;
            const { emp_id, role } = payload;
            let startDate: Date | undefined;
            let endDate: Date | undefined;
            duration = duration ? duration : DurationEnum.ALL;
            // let fitlerQuery: any = {};
            console.log({ role }, ">>>>>")
            let fitlerQuery: any = [];
            if (role === UserRole.RSM) {
                const storeIds: any = await this.beatRespositry.createQueryBuilder("beat")
                    .leftJoin("beat.user", "user")
                    .where("user.managerId = :managerId", { managerId: emp_id })
                    .select("beat.store")
                    .getMany()
                    .then((beats: IBeat[]) => beats.map(beat => beat.store));
                // console.log({storeIds})
                if (storeIds.length > 0) {
                    fitlerQuery = storeIds;
                } else {
                    return { message: "No Store found for user.", status: STATUSCODES.NOT_FOUND };
                }
            } else if (role === UserRole.SSM || role === UserRole.DISTRIBUTOR || role === UserRole.CHANNEL || role === UserRole.RETAILER) {
                const stores: any = await this.beatRespositry.createQueryBuilder("beat")
                    .where("beat.empId = :empId", { empId: emp_id })
                    .select("beat.store")
                    .getMany();
                if (stores.length > 0) {
                    fitlerQuery = stores;
                }

            }
            if (duration == DurationEnum.WEEK) {
                const today = new Date();
                const sevenDaysAgo = subDays(today, 6);
                startDate = startOfDay(sevenDaysAgo);
                endDate = endOfDay(today);

            } else if (duration == DurationEnum.TODAY) {
                startDate = startOfDay(new Date());
                endDate = endOfDay(new Date());
            }

            const queryBuilder = this.orderRepositry.createQueryBuilder("orders")
                .leftJoinAndSelect("orders.store", "store")
                .leftJoinAndSelect("store.storeCat", "storeCat")
                .leftJoinAndSelect("orders.visit", "visit")
                .orderBy("orders.createdAt", "DESC");

            if (role === UserRole.SSM || role === UserRole.RSM || role === UserRole.CHANNEL || role === UserRole.DISTRIBUTOR || role === UserRole.RETAILER) {
                const storeIds = fitlerQuery.map((beat: any) => beat.store).flat();
                queryBuilder.where("orders.storeId IN (:...storeIds)", { storeIds: storeIds });
            }

            if (orderStatus && orderStatus !== "all") {
                queryBuilder.andWhere("orders.orderStatus = :orderStatus", { orderStatus })
            }

            if (startDate && endDate) {
                queryBuilder.andWhere("orders.createdAt BETWEEN :startDate AND :endDate", { startDate, endDate });
            }
            queryBuilder.orderBy("orders.createdAt", "DESC");
            queryBuilder.skip((+pageNumber - 1) * +pageSize).take(+pageSize);
            const orders = await queryBuilder.getManyAndCount();
            const response = {
                orders: orders.length > 0 ? orders[0] : [],
                pagination: {
                    pageNumber: +pageNumber,
                    pageSize: +pageSize,
                    totalRecords: orders.length > 0 ? orders[1] : 0
                }
            }

            return { message: "Success.", status: STATUSCODES.SUCCESS, data: response }
        } catch (error) {
            throw error;
        }
    }

    async updateOrderTrackStatus(input: UpdateOrderTrackStatusById): Promise<IApiResponse> {
        try {
            const { orderId, orderStatus } = input;
            const order: IOrders | null = await OrdersRepository().findOne({ where: { orderId } });

            if (!order) {
                return { message: "Order Not Found.", status: STATUSCODES.NOT_FOUND };
            }

            const previousStatus: OrderStatus = order.orderStatus;
            await OrdersRepository().update(orderId, { orderStatus });
            const newStatusEntry: StatusHistoryEntry = {
                status: orderStatus,
                timestamp: new Date().toISOString()
            };
            const updatedStatusHistory: StatusHistoryEntry[] = [...order.statusHistory, newStatusEntry];
            await OrdersRepository().update(orderId, { statusHistory: updatedStatusHistory });
            if (orderStatus === OrderStatus.DELIVERED) {
                const inventoryService = new InventoryService();
                await inventoryService.saveInventoryByStoreId(order.products, order.storeId, order.empId);
            }
            return { message: "Success.", status: STATUSCODES.SUCCESS };
        } catch (error) {
            throw error;
        }
    }

    async updateOrderBySpecialDiscount(input: UpdateOrderBySpecialDiscountById): Promise<IApiResponse> {
        try {
            const { orderId, specialDiscountValue, specialDiscountStatus } = input;
            const order: IOrders | null = await OrdersRepository().findOne({ where: { orderId } });
            if (!order) {
                return { message: "Order Not Found.", status: STATUSCODES.NOT_FOUND };
            }
            await OrdersRepository().update(orderId, { specialDiscountValue, specialDiscountStatus });

            return { message: "Success.", status: STATUSCODES.SUCCESS };
        } catch (error) {
            throw error;
        }
    }

    async getAllPendingApproval(payload: IUser): Promise<IApiResponse> {
        try {
            const { role, emp_id } = payload;
            const userLists: IUser[] | null = await this.userRepository.find({ where: { managerId: emp_id } });
            const empIds = userLists.map((data: any) => data.emp_id);
            let PendingApprovalQueryBuilder = (await this.orderRepositry.createQueryBuilder('orders')
                .leftJoinAndSelect('orders.user', 'user')
                .leftJoinAndSelect('orders.store', 'stores')   // Added this line assuming there is a relation between stores and user
                .select([
                    'stores.storeName AS store_name',
                    'user.firstname AS firstname',
                    'user.lastname AS lastname',
                    'orders.orderId AS order_id',
                    'orders.specialDiscountValue AS specialdiscountvalue',
                    'orders.specialDiscountStatus AS discount_status'
                ])
                .where('orders.specialDiscountValue IS NOT NULL')
                .andWhere('orders.specialDiscountStatus IN (:...statuses)', { statuses: ['PENDING'] })
                .andWhere("orders.orderStatus NOT IN (:...statuses)", { statuses: [OrderStatus.CANCELLED, OrderStatus.ORDERSAVED] })

            );
            if (role === UserRole.RSM) {
                PendingApprovalQueryBuilder = PendingApprovalQueryBuilder.andWhere("stores.empId IN (:...empIds)", { empIds })
            }
            if (role === UserRole.SSM || role === UserRole.RETAILER) {
                PendingApprovalQueryBuilder.andWhere("stores.empId = :empId", { empId: emp_id })
            }
            const PendingApprovalOrders: any = await PendingApprovalQueryBuilder.limit(6).getRawMany();
            // console.log({PendingApprovalOrders})
            return { message: "Success.", status: STATUSCODES.SUCCESS, data: PendingApprovalOrders };
        } catch (error) {
            throw error;
        }
    }

    // async getPendingCollectionReport(payload: IUser): Promise<IApiResponse> {
    //     try {
    //         const { role, emp_id } = payload;
    //         const userLists: IUser[] | null = await this.userRepository.find({ where: { managerId: emp_id } });
    //         const empIds = userLists.map((data: any) => data.emp_id);
    //         let queryBuilder = (await this.orderRepositry.createQueryBuilder('orders')
    //             .leftJoinAndSelect('orders.user', 'user')
    //             .leftJoinAndSelect('orders.store', 'stores')
    //             .select('stores.storeName', 'storeName')
    //             .addSelect('stores.paymentMode', 'dues')
    //             .addSelect('user.firstname', 'firstname')
    //             .addSelect('user.lastname', 'lastname')
    //             .addSelect('user.emp_id', 'empId')
    //             .addSelect('orders.orderId', 'orderId')
    //             .addSelect('orders.createdAt', 'createdAt')
    //             .addSelect('orders.orderAmount - orders.collectedAmount ', 'pendingAmount')
    //             .where('orders.orderAmount IS NOT NULL')
    //             .andWhere('orders.orderAmount - orders.collectedAmount >= :value', { value: 0 })
    //             .andWhere('orders.paymentStatus = :paymentStatus', { paymentStatus: PaymentStatus.PENDING })
    //             .andWhere("orders.orderStatus NOT IN (:...statuses)", { statuses: [OrderStatus.CANCELLED, OrderStatus.ORDERSAVED] })


    //         );
    //         if (role === UserRole.RSM) {
    //             queryBuilder.andWhere("stores.empId IN (:...empIds)", { empIds })
    //         }
    //         if (role === UserRole.SSM ||role === UserRole.RETAILER ) {
    //             queryBuilder.andWhere("stores.empId = :empId", {empId: emp_id })
    //         }
    //         const pendingCollectionReport: any = await queryBuilder.orderBy("orders.orderAmount - orders.collectedAmount", "DESC").getRawMany();
    //         return { message: "Success.", status: STATUSCODES.SUCCESS, data: pendingCollectionReport };
    //     } catch (error) {
    //         throw error;
    //     }
    // }

    async getPendingCollectionReport(payload: IUser): Promise<IApiResponse> {
        try {
            const { role, emp_id } = payload;
            const userLists: IUser[] | null = await this.userRepository.find({ where: { managerId: emp_id } });
            const empIds = userLists.map((data: any) => data.emp_id);

            let queryBuilder = this.orderRepositry.createQueryBuilder('orders')
                .leftJoinAndSelect('orders.user', 'user')
                .leftJoinAndSelect('orders.store', 'stores')
                .select('stores.storeName', 'storeName')
                .addSelect('stores.storeId', 'storeId')
                .addSelect('stores.paymentMode', 'paymentMode')
                .addSelect('user.firstname', 'firstname')
                .addSelect('user.lastname', 'lastname')
                .addSelect('user.emp_id', 'empId')
                .addSelect('orders.orderId', 'orderId')
                .addSelect('orders.createdAt', 'createdAt')
                .addSelect('orders.orderAmount - orders.collectedAmount', 'pendingAmount')
                .where('orders.orderAmount IS NOT NULL')
                .andWhere('orders.orderAmount - orders.collectedAmount >= :value', { value: 0 })
                .andWhere('orders.paymentStatus = :paymentStatus', { paymentStatus: PaymentStatus.PENDING })
                .andWhere("orders.orderStatus NOT IN (:...statuses)", { statuses: [OrderStatus.CANCELLED, OrderStatus.ORDERSAVED] });

            // Filter based on user role
            if (role === UserRole.RSM) {
                queryBuilder.andWhere("stores.empId IN (:...empIds)", { empIds });
            }
            if (role === UserRole.SSM || role === UserRole.RETAILER) {
                queryBuilder.andWhere("stores.empId = :empId", { empId: emp_id });
            }

            // Execute the query and get the report
            const pendingCollectionReport: any = await queryBuilder
                .orderBy("orders.orderAmount - orders.collectedAmount", "DESC")
                .getRawMany();

            return { message: "Success.", status: STATUSCODES.SUCCESS, data: pendingCollectionReport };
        } catch (error) {
            throw error;
        }
    }

    async getPendingApprovalReport(payload: IUser): Promise<IApiResponse> {
        try {
            const { role, emp_id } = payload;
            const userLists: IUser[] | null = await this.userRepository.find({ where: { managerId: emp_id } });
            const empIds = userLists.map((data: any) => data.emp_id);
            let PendingApprovalQueryBuilder = (await this.orderRepositry.createQueryBuilder('orders')
                .leftJoinAndSelect('orders.user', 'user')
                .leftJoinAndSelect('orders.store', 'stores')
                .select('stores.storeName', 'storeName')
                .addSelect('user.firstname', 'firstname')
                .addSelect('user.lastname', 'lastname')
                .addSelect('user.emp_id', 'empId')
                .addSelect('orders.orderId', 'orderId')
                .addSelect('orders.orderAmount', 'orderAmount')
                .addSelect('orders.specialDiscountValue', 'specialDiscountValue')
                .addSelect('orders.createdAt', 'createdAt')
                .addSelect('orders.specialDiscountStatus', 'specialDiscountStatus')
                .where('orders.specialDiscountValue IS NOT NULL')
                .andWhere('orders.specialDiscountStatus IN (:...statuses)', { statuses: ['PENDING'] })
                // .andWhere("orders.orderStatus NOT IN (:...statuses)", { statuses: [OrderStatus.CANCELLED] })



            );
            if (role === UserRole.RSM) {
                PendingApprovalQueryBuilder = PendingApprovalQueryBuilder.andWhere("stores.empId IN (:...empIds)", { empIds })
            }
            if (role === UserRole.SSM || role === UserRole.RETAILER) {
                PendingApprovalQueryBuilder.andWhere("stores.empId = :empId", { empId: emp_id })
            }
            const PendingApprovalReport: any = await PendingApprovalQueryBuilder.getRawMany();
            return { message: "Success.", status: STATUSCODES.SUCCESS, data: PendingApprovalReport };
        } catch (error) {
            throw error;
        }
    }

    async getStoreRevenueReport(payload: IUser, input: any): Promise<IApiResponse> {
        try {
            const { role, emp_id } = payload;
            const currentYr = new Date().getFullYear();
            const { timePeriod = [TimelineEnum.YEAR, currentYr] } = input;
            // const today = new Date();
            const quarters: any = {
                1: {
                    start: new Date(Date.UTC(currentYr, 3, 1)).toISOString(),
                    end: new Date(Date.UTC(currentYr, 5, 30, 23, 59, 59)).toISOString()
                },
                2: {
                    start: new Date(Date.UTC(currentYr, 6, 1)).toISOString(),
                    end: new Date(Date.UTC(currentYr, 8, 30, 23, 59, 59)).toISOString()
                },
                3: {
                    start: new Date(Date.UTC(currentYr, 9, 1)).toISOString(),
                    end: new Date(Date.UTC(currentYr, 11, 31, 23, 59, 59)).toISOString()
                },
                4: {
                    start: new Date(Date.UTC(currentYr + 1, 0, 1)).toISOString(),
                    end: new Date(Date.UTC(currentYr + 1, 2, 31, 23, 59, 59)).toISOString()
                }
            };

            let startTimeline: any = null, endTimeline: any = null

            if (timePeriod[0] === TimelineEnum.MONTH && timePeriod[1]) {
                const monthNames = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"];
                const monthIndex = monthNames.indexOf(timePeriod[1].toLowerCase());
                startTimeline = new Date(Date.UTC(currentYr, monthIndex, 1)).toISOString();
                endTimeline = new Date(Date.UTC(currentYr, monthIndex + 1, 0, 23, 59, 59, 999)).toISOString();

            } else if (timePeriod[0] === TimelineEnum.YEAR && timePeriod[1]) {
                startTimeline = new Date(Date.UTC(timePeriod[1], 0, 1)).toISOString();
                endTimeline = new Date(Date.UTC(timePeriod[1], 11, 31, 23, 59, 59, 999)).toISOString();

            } else if (timePeriod[0] === TimelineEnum.QUARTER && timePeriod[1]) {
                const selectedQuarter: any = quarters[timePeriod[1].toUpperCase().replace("Q", "")];
                startTimeline = selectedQuarter.start
                endTimeline = selectedQuarter.end
            }
            const userLists: IUser[] | null = await this.userRepository.find({ where: { managerId: emp_id } });
            const empIds = userLists.map((data: any) => data.emp_id);
            let queryBuilder = (await this.orderRepositry.createQueryBuilder('orders')
                .leftJoinAndSelect('orders.store', 'stores')
                .select('stores.storeName', 'storeName')
                .addSelect("SUM(orders.orderAmount)", "revenue")
                .addSelect("SUM(orders.collectedAmount)", "collection")
                .where("orders.createdAt BETWEEN :startTimeline AND :endTimeline", { startTimeline, endTimeline })
                .andWhere("orders.orderStatus NOT IN (:...statuses)", { statuses: [OrderStatus.CANCELLED, OrderStatus.ORDERSAVED] })


            );
            if (role === UserRole.RSM) {
                queryBuilder.andWhere("stores.empId IN (:...empIds)", { empIds })
            }
            if (role === UserRole.SSM || role === UserRole.RETAILER) {
                queryBuilder.andWhere("stores.empId = :empId", { empId: emp_id })
            }
            const storeRevenueReport: any = await queryBuilder.orderBy("revenue", "DESC").groupBy('stores.storeName').getRawMany();
            return { message: "Success.", status: STATUSCODES.SUCCESS, data: storeRevenueReport };
        } catch (error) {
            throw error;
        }
    }
    async getSkuRevenueReport(payload: IUser, input: any): Promise<IApiResponse> {
        try {
            const { role, emp_id } = payload;
            const currentYr = new Date().getFullYear();
            const { timePeriod = [TimelineEnum.YEAR, currentYr] } = input;
            // const today = new Date();
            const quarters: any = {
                1: {
                    start: new Date(Date.UTC(currentYr, 3, 1)).toISOString(),
                    end: new Date(Date.UTC(currentYr, 5, 30, 23, 59, 59)).toISOString()
                },
                2: {
                    start: new Date(Date.UTC(currentYr, 6, 1)).toISOString(),
                    end: new Date(Date.UTC(currentYr, 8, 30, 23, 59, 59)).toISOString()
                },
                3: {
                    start: new Date(Date.UTC(currentYr, 9, 1)).toISOString(),
                    end: new Date(Date.UTC(currentYr, 11, 31, 23, 59, 59)).toISOString()
                },
                4: {
                    start: new Date(Date.UTC(currentYr + 1, 0, 1)).toISOString(),
                    end: new Date(Date.UTC(currentYr + 1, 2, 31, 23, 59, 59)).toISOString()
                }
            };

            let startTimeline: any = null, endTimeline: any = null

            if (timePeriod[0] === TimelineEnum.MONTH && timePeriod[1]) {
                const monthNames = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"];
                const monthIndex = monthNames.indexOf(timePeriod[1].toLowerCase());
                startTimeline = new Date(Date.UTC(currentYr, monthIndex, 1)).toISOString();
                endTimeline = new Date(Date.UTC(currentYr, monthIndex + 1, 0, 23, 59, 59, 999)).toISOString();

            } else if (timePeriod[0] === TimelineEnum.YEAR && timePeriod[1]) {
                startTimeline = new Date(Date.UTC(timePeriod[1], 0, 1)).toISOString();
                endTimeline = new Date(Date.UTC(timePeriod[1], 11, 31, 23, 59, 59, 999)).toISOString();

            } else if (timePeriod[0] === TimelineEnum.QUARTER && timePeriod[1]) {
                const selectedQuarter: any = quarters[timePeriod[1].toUpperCase().replace("Q", "")];
                startTimeline = selectedQuarter.start
                endTimeline = selectedQuarter.end
            }
            const userLists: IUser[] | null = await this.userRepository.find({ where: { managerId: emp_id } });
            const empIds = userLists.map((data: any) => data.emp_id);
            let queryBuilder: any = null;
            if (role === UserRole.SSM || role === UserRole.RETAILER) {
                queryBuilder = await this.orderRepositry.createQueryBuilder("orders")
                    .select("unnested.product->>'productName' AS productName")
                    .addSelect("SUM((CAST(unnested.product->>'rlp' AS NUMERIC) * COALESCE(CAST(unnested.product->>'noOfPiece' AS NUMERIC), 0)) + (COALESCE(CAST(unnested.product->>'caseQty' AS NUMERIC), 0) * COALESCE(CAST(unnested.product->>'noOfCase' AS NUMERIC), 0) * COALESCE(CAST(unnested.product->>'rlp' AS NUMERIC), 0))) AS revenue")
                    .leftJoin(
                        qb => qb
                            .select("jsonb_array_elements(orders.products::jsonb) AS product")
                            .from("orders", "orders")
                            .where("orders.empId = :empId", { empId: emp_id }),
                        "unnested",
                        "true"
                    ).where("orders.createdAt BETWEEN :startTimeline AND :endTimeline", { startTimeline, endTimeline })
                    .andWhere("orders.orderStatus NOT IN (:...statuses)", { statuses: [OrderStatus.CANCELLED, OrderStatus.ORDERSAVED] })
                    .andWhere("orders.empId = :empId", { empId: emp_id })
            }

            if (role === UserRole.RSM) {
                queryBuilder = await this.orderRepositry.createQueryBuilder("orders")
                    .select("unnested.product->>'productName' AS productName")
                    .addSelect("SUM((CAST(unnested.product->>'rlp' AS NUMERIC) * COALESCE(CAST(unnested.product->>'noOfPiece' AS NUMERIC), 0)) + (COALESCE(CAST(unnested.product->>'caseQty' AS NUMERIC), 0) * COALESCE(CAST(unnested.product->>'noOfCase' AS NUMERIC), 0) * COALESCE(CAST(unnested.product->>'rlp' AS NUMERIC), 0))) AS revenue")
                    .leftJoin(
                        qb => qb
                            .select("jsonb_array_elements(orders.products::jsonb) AS product")
                            .from("orders", "orders")
                            .where("orders.empId IN (:...empIds)", { empIds }),
                        "unnested",
                        "true"
                    ).where("orders.createdAt BETWEEN :startTimeline AND :endTimeline", { startTimeline, endTimeline })
                    .andWhere("orders.orderStatus NOT IN (:...statuses)", { statuses: [OrderStatus.CANCELLED, OrderStatus.ORDERSAVED] })
                    .andWhere("orders.empId IN (:...empIds)", { empIds })
            }

            if (role === UserRole.ADMIN || role === UserRole.SUPER_ADMIN) {
                queryBuilder = await this.orderRepositry.createQueryBuilder("orders")
                    .select("unnested.product->>'productName' AS productName")
                    .addSelect("SUM((CAST(unnested.product->>'rlp' AS NUMERIC) * COALESCE(CAST(unnested.product->>'noOfPiece' AS NUMERIC), 0)) + (COALESCE(CAST(unnested.product->>'caseQty' AS NUMERIC), 0) * COALESCE(CAST(unnested.product->>'noOfCase' AS NUMERIC), 0) * COALESCE(CAST(unnested.product->>'rlp' AS NUMERIC), 0))) AS revenue")
                    .leftJoin(
                        qb => qb
                            .select("jsonb_array_elements(orders.products::jsonb) AS product")
                            .from("orders", "orders"),
                        "unnested",
                        "true"
                    ).where("orders.createdAt BETWEEN :startTimeline AND :endTimeline", { startTimeline, endTimeline })
                    .andWhere("orders.orderStatus NOT IN (:...statuses)", { statuses: [OrderStatus.CANCELLED, OrderStatus.ORDERSAVED] })
            }
            // if (role === UserRole.SSM || role === UserRole.RETAILER ) {
            //     queryBuilder.andWhere("orders.empId = :empId", {empId: emp_id })
            // }
            let skuRevenueReport = await queryBuilder.groupBy("unnested.product->>'productName'")
                .orderBy("revenue", "DESC")
                .getRawMany();

            return { message: "Success.", status: STATUSCODES.SUCCESS, data: skuRevenueReport };
        } catch (error) {
            throw error;
        }
    }

    async getMonthlyProgressReport(payload: IUser, input: monthlyFilter): Promise<IApiResponse> {
        try {
            const { role, emp_id } = payload;
            const { timePeriod } = input;
            const date = new Date(timePeriod);

            const year = date.getUTCFullYear(); // Extract the year
            const monthIndex = date.getUTCMonth();
            let startTimeline: any = null, endTimeline: any = null

            // const monthIndex = new Date().getMonth()
            startTimeline = new Date(Date.UTC(year, monthIndex, 1, 0, 0, 0, 0)).toISOString();
            endTimeline = new Date(Date.UTC(year, monthIndex + 1, 0, 23, 59, 59, 999)).toISOString();
            const userLists: IUser[] | null = await this.userRepository.find({ where: { managerId: emp_id } });
            const empIds = userLists.map((data: any) => data.emp_id);
            let queryBuilder = this.orderRepositry.createQueryBuilder('orders')
                .leftJoinAndSelect('orders.store', 'stores')
                .leftJoinAndSelect('orders.user', 'user')
                .select("COALESCE(COUNT(stores.storeId), 0)", "newStore")
                .addSelect('user.firstname', 'firstname')
                .addSelect('user.lastname', 'lastname')
                .addSelect('user.emp_id', 'empId')
                .addSelect('SUM(orders.orderAmount)', 'sale')
                .addSelect('SUM(orders.collectedAmount)', 'collection')
                .addSelect('COUNT(orders.orderId)', 'orderCount')
                .where('orders.createdAt >= :startDate', { startDate: startTimeline })
                .andWhere('orders.createdAt <= :endDate', { endDate: endTimeline })
                .andWhere('user.role = :role', { role: UserRole.SSM })
                .orWhere('user.role = :role', { role: UserRole.RETAILER })
                .andWhere("orders.orderStatus NOT IN (:...statuses)", { statuses: [OrderStatus.CANCELLED, OrderStatus.ORDERSAVED] })



            if (role === UserRole.RSM) {
                queryBuilder.andWhere("orders.empId IN (:...empIds)", { empIds });
            }
            if (role === UserRole.SSM || role === UserRole.RETAILER) {
                queryBuilder.andWhere("orders.empId = :empId", { empId: emp_id })
            }
            const monthlyProgressReport: any = await queryBuilder
                .groupBy("user.emp_id")  // Group by the truncated date
                .getRawMany();
            return { message: "Success.", status: STATUSCODES.SUCCESS, data: monthlyProgressReport };
        } catch (error) {
            throw error;
        }
    }
    // Retailor

    async getMonthlyOrderReportforRetailor(payload: IUser, input: monthlyFilter): Promise<IApiResponse> {
        try {
            const { role, emp_id } = payload;
            const { timePeriod } = input;
            const date = new Date(timePeriod);

            const year = date.getUTCFullYear(); // Extract the year
            const monthIndex = date.getUTCMonth();
            let startTimeline: any = null, endTimeline: any = null

            // const monthIndex = new Date().getMonth()
            startTimeline = new Date(Date.UTC(year, monthIndex, 1, 0, 0, 0, 0)).toISOString();
            endTimeline = new Date(Date.UTC(year, monthIndex + 1, 0, 23, 59, 59, 999)).toISOString();

            let queryBuilder = this.orderRepositry.createQueryBuilder('orders')
                .select("DATE(orders.createdAt) AS orderDate") // Extract the date part
                .addSelect('SUM(orders.orderAmount)', 'sale') // Total sales
                .addSelect('COUNT(orders.orderId)', 'orderCount') // Total order count
                .where('orders.createdAt >= :startDate', { startDate: startTimeline }) // Filter by start date
                .andWhere('orders.createdAt <= :endDate', { endDate: endTimeline }) // Filter by end date
                .andWhere('orders.empId = :empId', { empId: emp_id })
                .andWhere("orders.orderStatus != :orderStatus", { orderStatus: OrderStatus.CANCELLED })
                .groupBy('orderDate') // Group by the extracted date
                .orderBy('orderDate', 'ASC'); // Order the results by date
            const monthlyProgressReport: any = await queryBuilder.getRawMany();
            return { message: "Success.", status: STATUSCODES.SUCCESS, data: monthlyProgressReport };
        } catch (error) {
            throw error;
        }
    }
    async getUnbilledStoreReport(payload: IUser): Promise<IApiResponse> {
        try {
            const { role, emp_id } = payload;
            const userLists: IUser[] | null = await this.userRepository.find({ where: { managerId: emp_id } });
            const empIds = userLists.map((data: any) => data.emp_id);
            const orderSubquery = this.orderRepositry.createQueryBuilder("orders")
                .select("orders.storeId", "storeId")
                .getQuery();
            let unBilledQueryBuilder: any = await this.storeRepositry.createQueryBuilder('stores')
                .leftJoinAndSelect('stores.user', 'user')  // Added this line assuming there is a relation between stores and user
                .select('stores.storeName', 'storeName')
                .addSelect('stores.createdAt', 'createdAt')
                .addSelect('user.firstname', 'firstname')
                .addSelect('user.lastname', 'lastname')
                .addSelect('user.emp_id', 'empId')
                .where(`stores.storeId NOT IN (${orderSubquery})`)
                .andWhere('user.firstname IS NOT NULL')
            // .andWhere("orders.orderStatus != :orderStatus", { orderStatus: OrderStatus.CANCELLED })


            if (role === UserRole.RSM) {
                unBilledQueryBuilder = unBilledQueryBuilder.andWhere("stores.empId IN (:...empIds)", { empIds })
            }
            if (role === UserRole.SSM || role === UserRole.RETAILER) {
                unBilledQueryBuilder.andWhere("stores.empId = :empId", { empId: emp_id })
            }
            const unBilledStore: any = await unBilledQueryBuilder.getRawMany();
            return { message: "Success.", status: STATUSCODES.SUCCESS, data: unBilledStore };
        } catch (error) {
            throw error;
        }
    }

    async getEmployeePreformanceReport(payload: IUser, input: any): Promise<IApiResponse> {
        try {
            const { role, emp_id } = payload;
            const currentYr = new Date().getFullYear();
            const { timePeriod = [TimelineEnum.YEAR, currentYr] } = input;
            // const today = new Date();
            const quarters: any = {
                1: {
                    start: new Date(Date.UTC(currentYr, 3, 1)).toISOString(),
                    end: new Date(Date.UTC(currentYr, 5, 30, 23, 59, 59)).toISOString()
                },
                2: {
                    start: new Date(Date.UTC(currentYr, 6, 1)).toISOString(),
                    end: new Date(Date.UTC(currentYr, 8, 30, 23, 59, 59)).toISOString()
                },
                3: {
                    start: new Date(Date.UTC(currentYr, 9, 1)).toISOString(),
                    end: new Date(Date.UTC(currentYr, 11, 31, 23, 59, 59)).toISOString()
                },
                4: {
                    start: new Date(Date.UTC(currentYr + 1, 0, 1)).toISOString(),
                    end: new Date(Date.UTC(currentYr + 1, 2, 31, 23, 59, 59)).toISOString()
                }
            };

            let startTimeline: any = null, endTimeline: any = null

            if (timePeriod[0] === TimelineEnum.MONTH && timePeriod[1]) {
                const monthNames = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"];
                const monthIndex = monthNames.indexOf(timePeriod[1].toLowerCase());
                startTimeline = new Date(Date.UTC(currentYr, monthIndex, 1)).toISOString();
                endTimeline = new Date(Date.UTC(currentYr, monthIndex + 1, 0, 23, 59, 59, 999)).toISOString();

            } else if (timePeriod[0] === TimelineEnum.YEAR && timePeriod[1]) {
                startTimeline = new Date(Date.UTC(timePeriod[1], 0, 1)).toISOString();
                endTimeline = new Date(Date.UTC(timePeriod[1], 11, 31, 23, 59, 59, 999)).toISOString();

            } else if (timePeriod[0] === TimelineEnum.QUARTER && timePeriod[1]) {
                const selectedQuarter: any = quarters[timePeriod[1].toUpperCase().replace("Q", "")];
                startTimeline = selectedQuarter.start
                endTimeline = selectedQuarter.end
            }
            const userLists: IUser[] | null = await this.userRepository.find({ where: { managerId: emp_id } });
            const empIds = userLists.map((data: any) => data.emp_id);
            let queryBuilder = (await this.orderRepositry.createQueryBuilder('orders')
                .leftJoinAndSelect('orders.store', 'stores')
                .leftJoinAndSelect('orders.user', 'user')
                .select("COUNT(stores.storeId)", "newStore")
                .addSelect('user.firstname', 'firstname')
                .addSelect('user.lastname', 'lastname')
                .addSelect('user.emp_id', 'empId')
                .addSelect('user.role', 'role')
                .addSelect('user.managerId', 'managerId')
                .addSelect('SUM(orders.orderAmount)', 'sale')
                .addSelect('SUM(orders.collectedAmount)', 'collection')
                .addSelect('COUNT(orders.orderId)', 'orderCount')
                .where('orders.createdAt >= :startDate', { startDate: startTimeline })
                .andWhere('orders.createdAt <= :endDate', { endDate: endTimeline })
                .andWhere("orders.orderStatus != :orderStatus", { orderStatus: OrderStatus.CANCELLED })
                .andWhere("orders.orderStatus NOT IN (:...statuses)", { statuses: [OrderStatus.CANCELLED, OrderStatus.ORDERSAVED] })

            );
            if (role === UserRole.RSM) {
                queryBuilder.andWhere("user.emp_id IN (:...empIds)", { empIds })
            }
            if (role === UserRole.SSM || role === UserRole.RETAILER) {
                queryBuilder.andWhere("user.emp_id = :emp_id", { emp_id })
            }
            const storeRevenueReport: any = await queryBuilder.orderBy("sale", "DESC").groupBy('user.emp_id').getRawMany();
            const adminRole: any = storeRevenueReport.find((data: any) => data.role === UserRole.ADMIN)
            const reportData: any[] = [];
            for (const user of storeRevenueReport) {
                const managerDetails: IUser | null = await this.userRepository.findOne({
                    select: ["emp_id"],
                    where: {
                        emp_id: user.managerId
                    },
                });
                const managerData = await this.userRepository.findOne({
                    select: ["firstname", "lastname"],
                    where: { emp_id: managerDetails ? user.managerId : adminRole.emp_id },
                });
                let usersData: any = {
                    name: `${user.firstname} ${user.lastname}`,
                    empId: user.empId,
                    role: user.role,
                    manager: managerData ? `${managerData.firstname} ${managerData.lastname}` : 'Unknown',
                    sale: user.sale ?? 0,
                    collection: user.collection ?? 0,
                    orderCount: user.orderCount ?? 0,
                    newStore: user.newStore ?? 0
                }
                reportData.push(usersData);
            }
            return { message: "Success.", status: STATUSCODES.SUCCESS, data: reportData };
        } catch (error) {
            throw error;
        }
    }
    async getMonthlyNoOrderReport(payload: IUser, input: dayTrackingFilter): Promise<IApiResponse> {
        try {
            const { role, emp_id } = payload;
            const { timePeriod } = input; // Expected format: "YYYY-MM"
            const [year, month] = timePeriod.split("-").map(Number); // Extract year and month as numbers

            const startTimeline = new Date(Date.UTC(year, month - 1, 1, 0, 0, 0, 0)).toISOString(); // First day of the month
            const endTimeline = new Date(Date.UTC(year, month, 0, 23, 59, 59, 999)).toISOString(); // Last day of the month

            // console.log({ startTimeline, endTimeline });

            const userLists: IUser[] | null = await this.userRepository.find({ where: { managerId: emp_id } });
            const empIds = userLists.map((data: any) => data.emp_id);
            let queryBuilder = this.visitRepositry.createQueryBuilder('visits')
                .leftJoinAndSelect('visits.user', 'user')
                .select("visits.storeId", "storeId")
                .addSelect('user.firstname', 'firstname')
                .addSelect('user.lastname', 'lastname')
                .addSelect('user.emp_id', 'empId')
                .addSelect('visits.visitId', 'visitId')
                .addSelect('visits.updatedAt', 'updatedAt')
                .addSelect('visits.no_order_reason', 'noOrderReason')
                .where('visits.updatedAt >= :startDate', { startDate: startTimeline })
                .andWhere('visits.updatedAt <= :endDate', { endDate: endTimeline })
                .andWhere('user.role = :role', { role: UserRole.SSM })



            if (role === UserRole.RSM) {
                queryBuilder.andWhere("visits.empId IN (:...empIds)", { empIds });
            }
            if (role === UserRole.SSM || role === UserRole.RETAILER) {
                queryBuilder.andWhere("visits.empId = :empId", { empId: emp_id })
            }
            queryBuilder.orderBy("visits.updated_at", "ASC");

            const monthlyProgressReport: any = await queryBuilder.getRawMany();
            let visitList: any[] = [];
            for (let visit of monthlyProgressReport) {
                const storeDetails: IStore | null = await this.storeRepositry.findOne({ where: { storeId: visit.storeId }, select: ['storeName'] });
                if (!storeDetails) {
                    return { message: `Store not find for vist: ${visit.visitId} and StoreId: ${visit.storeId}`, status: STATUSCODES.NOT_FOUND }
                }

                let visitData: any = {
                    firstname: visit.firstname,
                    lastname: visit.lastname,
                    empId: visit.empId,
                    noOrderReason: visit.noOrderReason,
                    storeName: storeDetails.storeName,
                    updatedAt: visit.updatedAt
                }
                visitList.push(visitData);
            }
            return { message: "Success.", status: STATUSCODES.SUCCESS, data: visitList };
        } catch (error) {
            throw error;
        }
    }
    // async addScreenshot(payload: IUser, input: AddScreenshot): Promise<IApiResponse> {
    //     try {
    //         const { screenshot, orderId } = input;

    //         const order = await this.orderRepositry.findOne({ where: { orderId } });

    //         if (!order) {
    //             return { message: "Visit not found.", status: STATUSCODES.NOT_FOUND }
    //         }

    //         await this.orderRepositry.createQueryBuilder().update({ screenshot }).where({ orderId }).execute();

    //         return { message: "Success.", status: STATUSCODES.SUCCESS }
    //     } catch (error) {
    //         throw error;
    //     }
    // }

    async getPendingCollectionByStoreId(payload: IUser): Promise<IApiResponse> {
        try {
            const queryBuilder = this.orderRepositry.createQueryBuilder('orders')
                .leftJoin('orders.store', 'store')
                .select('store.storeId', 'storeId')
                .addSelect('store.storeName', 'storeName')
                .addSelect('SUM(orders.orderAmount - orders.collectedAmount)', 'totalPendingAmount')
                .where('orders.orderAmount IS NOT NULL')
                .andWhere('orders.orderAmount - orders.collectedAmount >= :value', { value: 0 })
                .andWhere('orders.paymentStatus = :paymentStatus', { paymentStatus: PaymentStatus.PENDING })
                .andWhere('orders.orderStatus NOT IN (:...statuses)', { statuses: [OrderStatus.CANCELLED, OrderStatus.ORDERSAVED] })
                .groupBy('store.storeId')
                .addGroupBy('store.storeName')
                .orderBy('"totalPendingAmount"', 'DESC');
            const result = await queryBuilder.getRawMany();

            const formatted = result.map(item => ({
                storeId: Number(item.storeId),
                storeName: item.storeName,
                totalPendingAmount: Number(item.totalPendingAmount),
            }));

            return { message: 'Success.', status: STATUSCODES.SUCCESS, data: formatted };
        } catch (error) {
            throw error;
        }
    }

}

export { OrderController as OrderService }