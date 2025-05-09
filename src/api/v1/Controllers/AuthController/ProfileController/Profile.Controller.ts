import { CallType, OrderStatus, PaymentStatus, STATUSCODES, SpecialDiscountStatus, TimelineEnum, UserRole, VisitStatus } from "../../../../../core/types/Constent/common";
import { UserRepository } from "../../../../../core/DB/Entities/User.entity";
import { IApiResponse } from "../../../../../core/types/Constent/commonService";
import { Between, In } from "typeorm";
import { DeleteUserProfile, IUser, IUserProfile, UpdateApprovalStore, UpdateUserProfile } from "../../../../../core/types/AuthService/AuthService";
import { IAttendance } from "../../../../../core/types/AttendanceService/AttendanceService";
import { AttendanceRepository } from "../../../../../core/DB/Entities/attendance.entity";
import { endOfDay, endOfMonth, startOfDay, startOfMonth, subDays, subMonths } from "date-fns";
import { StoreRepository } from "../../../../../core/DB/Entities/stores.entity";
import { OrdersRepository } from "../../../../../core/DB/Entities/orders.entity";
import { VisitRepository } from "../../../../../core/DB/Entities/Visit.entity";
import { TargetRepository } from "../../../../../core/DB/Entities/target.entity";
import { IOrders } from "core/types/OrderService/OrderService";
import { ProductRepository } from "../../../../../core/DB/Entities/products.entity";
import { getSchemeRepository } from "../../../../../core/DB/Entities/scheme.entity";
import { IBeat } from "core/types/BeatService/Beat";
import { BeatRepository } from "../../../../../core/DB/Entities/beat.entity";
class ProfileController {
    private getUserRepositry = UserRepository();
    private getAttendanceRepositry = AttendanceRepository();
    private getStoreRepositry = StoreRepository();
    private getOrderRepositry = OrdersRepository();
    private getVisitRepository = VisitRepository();
    private getTargetRepository = TargetRepository();
    private getProductRepository = ProductRepository();
    private getSchemeRepo = getSchemeRepository();
    private beatRespositry = BeatRepository();

    constructor() { }

    async getProfile(payload: IUser): Promise<IApiResponse> {
        try {
            const { emp_id } = payload;
            const user: IUser | null = await this.getUserRepositry.findOne({ where: { emp_id } });
            if (!user) {
                return { status: STATUSCODES.NOT_FOUND, message: "User Not Found." };
            }
            let manager: IUser | null = null;
            if (user.managerId) {
                manager = await this.getUserRepositry.findOne({ where: { emp_id: user.managerId } });
            }
            // console.log({user, manager})

            // if (!manager) {
            //     return { status: STATUSCODES.NOT_FOUND, message: "Manager Data Not Found." };
            // }
            const mdata: any = { firstname: "", lastname: "" }
            return { status: STATUSCODES.SUCCESS, message: "Success.", data: await this.profileTransformer(user, manager || mdata) }
        } catch (error) {
            throw error;
        }
    }

    async profileTransformer(user: IUser, manager: IUser): Promise<IUserProfile.IProfile> {
        const profile: IUserProfile.IProfile = {
            id: user.emp_id,
            name: `${user.firstname} ${user.lastname}`,
            emailId: user.email,
            contactNumber: user.phone,
            manager: `${manager.firstname || ""} ${manager.lastname || ""}`,
            address: user.address,
            zone: user.zone,
            joiningDate: this.convertTimestamptoDate(user.joining_date),
            isCheckInMarked: await this.checkInAttendance(user.emp_id),
            isCheckOutMarked: await this.checkOutAttendance(user.emp_id),
            role: user.role,
            image: user.image
        }
        return profile;
    }

    async checkInAttendance(empId: number): Promise<boolean> {
        const todayStart = startOfDay(new Date());
        const todayEnd = endOfDay(new Date());
        const attendanceData: IAttendance | null = await this.getAttendanceRepositry.findOne({ where: { empId, checkIn: Between(todayStart, todayEnd) } });
        if (!attendanceData) {
            return false;
        }
        return true
    }

    async checkOutAttendance(empId: number): Promise<boolean> {
        const todayStart = startOfDay(new Date());
        const todayEnd = endOfDay(new Date());
        const attendanceData: IAttendance | null = await this.getAttendanceRepositry.findOne({ where: { empId, checkOut: Between(todayStart, todayEnd) } });
        if (!attendanceData) {
            return false;
        }
        return true
    }

    convertTimestamptoDate(date: Date): string {
        const inputDate = new Date(date);
        const day = inputDate.getDate().toString().padStart(2, '0');
        const month = (inputDate.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
        const year = inputDate.getFullYear();
        const formattedDateString = `${day}-${month}-${year}`;
        return formattedDateString;
    }

    async updateImage(payload: IUser, input: UpdateUserProfile): Promise<IApiResponse> {
        try {
            const { emp_id } = payload;
            const { image, empId } = input;
            await this.getUserRepositry.createQueryBuilder().update({ image }).where({ emp_id: Number(empId) }).execute();
            return { message: "Success.", status: STATUSCODES.SUCCESS }
        } catch (error) {
            throw error;
        }
    }

    async deleteProfile(payload: IUser, input: DeleteUserProfile): Promise<IApiResponse> {
        try {
            const { emp_id } = payload;
            const { empId } = input
            await this.getUserRepositry.createQueryBuilder().update({ image: null }).where({ emp_id: Number(empId) }).execute();
            return { message: "Success.", status: STATUSCODES.SUCCESS }
        } catch (error) {
            throw error;
        }
    }

    async dashboard(input: any, payload: IUser): Promise<IApiResponse> {
        try {
            const { emp_id } = payload;
            const today = new Date();
            const currentYear = today.getFullYear();
            const { timePeriod = [TimelineEnum.YEAR, currentYear] } = input;
            const quarters: any = {
                1: {
                    start: new Date(Date.UTC(currentYear, 3, 1)).toISOString(),
                    end: new Date(Date.UTC(currentYear, 5, 30, 23, 59, 59)).toISOString()
                },
                2: {
                    start: new Date(Date.UTC(currentYear, 6, 1)).toISOString(),
                    end: new Date(Date.UTC(currentYear, 8, 30, 23, 59, 59)).toISOString()
                },
                3: {
                    start: new Date(Date.UTC(currentYear, 9, 1)).toISOString(),
                    end: new Date(Date.UTC(currentYear, 11, 31, 23, 59, 59)).toISOString()
                },
                4: {
                    start: new Date(Date.UTC(currentYear + 1, 0, 1)).toISOString(),
                    end: new Date(Date.UTC(currentYear + 1, 2, 31, 23, 59, 59)).toISOString()
                }
            };

            let startTimeline: any = null, endTimeline: any = null
            let startPreTimeline: any = null, endPreTimeline: any = null

            if (timePeriod[0] === TimelineEnum.MONTH && timePeriod[1]) {
                const monthNames = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"];
                const monthIndex = monthNames.indexOf(timePeriod[1].toLowerCase());
                startTimeline = new Date(Date.UTC(currentYear, monthIndex, 1)).toISOString();
                endTimeline = new Date(Date.UTC(currentYear, monthIndex + 1, 0, 23, 59, 59, 999)).toISOString();

                if (monthIndex === 0) {
                    startPreTimeline = new Date(Date.UTC(currentYear - 1, 11, 1)).toISOString();
                    endPreTimeline = new Date(Date.UTC(currentYear - 1, 12, 0, 23, 59, 59, 999)).toISOString();
                } else {
                    startPreTimeline = new Date(Date.UTC(currentYear, monthIndex - 1, 1)).toISOString();
                    endPreTimeline = new Date(Date.UTC(currentYear, monthIndex, 0, 23, 59, 59, 999)).toISOString();
                }


            } else if (timePeriod[0] === TimelineEnum.YEAR && timePeriod[1]) {
                startTimeline = new Date(Date.UTC(timePeriod[1], 0, 1)).toISOString();
                endTimeline = new Date(Date.UTC(timePeriod[1], 11, 31, 23, 59, 59, 999)).toISOString();

                startPreTimeline = new Date(Date.UTC(timePeriod[1] - 1, 0, 1)).toISOString();
                endPreTimeline = new Date(Date.UTC(timePeriod[1] - 1, 11, 31, 23, 59, 59, 999)).toISOString();

            } else if (timePeriod[0] === TimelineEnum.QUARTER && timePeriod[1]) {
                const selectedQuarter: any = quarters[timePeriod[1].toUpperCase().replace("Q", "")];
                startTimeline = selectedQuarter.start
                endTimeline = selectedQuarter.end

                if (timePeriod[1] === "Q4") {
                    startPreTimeline = new Date(Date.UTC(currentYear, 9, 1)).toISOString(),
                        endPreTimeline = new Date(Date.UTC(currentYear, 11, 31, 23, 59, 59)).toISOString()
                } else if (timePeriod[1] === "Q1") {
                    startPreTimeline = new Date(Date.UTC(currentYear, 0, 1)).toISOString(),
                        endPreTimeline = new Date(Date.UTC(currentYear, 2, 31, 23, 59, 59)).toISOString()
                } else {
                    const selectedPreQuarter: any = quarters[timePeriod[1].toUpperCase().replace("Q", "") - 1];
                    startPreTimeline = selectedPreQuarter.start
                    endPreTimeline = selectedPreQuarter.end
                }


            }

            const targetQueryBuilder = this.getTargetRepository.createQueryBuilder('target')
                .select(['target.emp_id',
                    'SUM(target.store_target) AS total_store_target',
                    'SUM(target.amount_target) AS total_amount_target'
                ])
                .andWhere('target.emp_id = :emp_id', { emp_id })
                .andWhere('target.is_active = :isActive', { isActive: true })
                .andWhere('target.is_deleted = :isDeleted', { isDeleted: false })
                .groupBy("target.emp_id");
            if (timePeriod.length > 0 && startTimeline && endTimeline) {
                targetQueryBuilder.andWhere('target.month >= :startDate', { startDate: startTimeline })
                    .andWhere('target.month <= :endDate', { endDate: endTimeline });
            }
            const currentMonthTarget = await targetQueryBuilder.getRawOne();
            if (currentMonthTarget && currentMonthTarget.total_store_target !== null && currentMonthTarget.total_amount_target !== null) {
                const storeTarget = +currentMonthTarget.total_store_target; // Convert to number
                const valueTarget = +currentMonthTarget.total_amount_target; // Convert to number
                await this.getUserRepositry.createQueryBuilder()
                    .update({ storeTarget, valueTarget })
                    .where({ emp_id })
                    .execute();
            } else {
                console.error("Invalid or missing data in currentMonthTarget.");
            }

            let fitlerQuery: any = [];
            const storesIds: any = await this.beatRespositry.createQueryBuilder("beat")
                .where("beat.empId = :empId", { empId: emp_id })
                .select("beat.store")
                .getMany();
            if (storesIds.length > 0) {
                fitlerQuery = storesIds;
            }
            const storeIds = fitlerQuery.map((beat: any) => beat.store).flat();

            const ordersQueryBuilder = this.getOrderRepositry.createQueryBuilder("orders")
                .select("orders.empId", "empId")
                .addSelect("SUM(orders.orderAmount)", "totalAmount")
                .addSelect("SUM(orders.collectedAmount)", "totalCollectedAmount")
                .leftJoin("orders.user", "user")
                .addSelect("user.valueTarget", "valueTarget")
                .addSelect("user.storeTarget", "storeTarget")
                .where("orders.storeId IN (:...storeIds)", { storeIds: storeIds })
                .andWhere("orders.orderStatus NOT IN (:...statuses)", { statuses: [OrderStatus.CANCELLED, OrderStatus.ORDERSAVED] })
                .groupBy("orders.empId")
                .addGroupBy("user.valueTarget")
                .addGroupBy('user.storeTarget');

            // Conditionally add date range filter for orders
            if (timePeriod.length > 0 && startTimeline && endTimeline) {
                ordersQueryBuilder.andWhere('orders.createdAt >= :startDate', { startDate: startTimeline })
                    .andWhere('orders.createdAt <= :endDate', { endDate: endTimeline });
            }
            const orders = await ordersQueryBuilder.getRawOne();
            //--------------------------------------------------------------------------------------------------
            const preOrdersQueryBuilder = this.getOrderRepositry.createQueryBuilder("orders")
                .select("orders.empId", "empId")
                .addSelect("SUM(orders.orderAmount)", "totalAmount")
                .addSelect("SUM(orders.collectedAmount)", "totalCollectedAmount")
                .where("orders.storeId IN (:...storeIds)", { storeIds: storeIds })
                .andWhere("orders.orderStatus NOT IN (:...statuses)", { statuses: [OrderStatus.CANCELLED, OrderStatus.ORDERSAVED] })
                .groupBy("orders.empId")

            // Conditionally add date range filter for orders
            if (timePeriod.length > 0 && startPreTimeline && endPreTimeline) {
                preOrdersQueryBuilder.andWhere('orders.createdAt >= :startDate', { startDate: startPreTimeline })
                    .andWhere('orders.createdAt <= :endDate', { endDate: endPreTimeline });
            }
            const preSales = await preOrdersQueryBuilder.getRawOne();
            // ============================================================================
            const storesQueryBuilder = this.getStoreRepositry.createQueryBuilder('stores')
                .select("COUNT(stores.storeId)", "totalStoreCount") // Total count
                .where("stores.storeId IN (:...storeIds)", { storeIds: storeIds });

            if (timePeriod.length > 0 && startTimeline && endTimeline) {
                storesQueryBuilder.andWhere('stores.createdAt >= :startDate', { startDate: startTimeline })
                    .andWhere('stores.createdAt <= :endDate', { endDate: endTimeline });
            }

            const stores = await storesQueryBuilder.getRawOne();
            // ===============================================================================================
            let orderCountQueryBuilder = await this.getOrderRepositry.createQueryBuilder('orders')
                .select("COUNT(orders.orderId)", "totalOrderCount")
                .where("orders.storeId IN (:...storeIds)", { storeIds: storeIds })
                .andWhere("orders.orderStatus NOT IN (:...statuses)", { statuses: [OrderStatus.CANCELLED, OrderStatus.ORDERSAVED] })


            if (timePeriod.length > 0 && startTimeline && endTimeline) {
                orderCountQueryBuilder.andWhere("orders.createdAt >= :startDate", { startDate: startTimeline })
                    .andWhere("orders.createdAt <= :endDate", { endDate: endTimeline })
            }
            let currOrderCount = await orderCountQueryBuilder.getCount();
            // ---------------------------------------------------------------------------------------------
            let preOrderCountQueryBuilder = await this.getOrderRepositry.createQueryBuilder('orders')
                .select("COUNT(orders.orderId)", "totalOrderCount")
                .where("orders.storeId IN (:...storeIds)", { storeIds: storeIds })
                .andWhere("orders.orderStatus NOT IN (:...statuses)", { statuses: [OrderStatus.CANCELLED, OrderStatus.ORDERSAVED] })


            if (timePeriod.length > 0 && startPreTimeline && endPreTimeline) {
                preOrderCountQueryBuilder.andWhere("orders.createdAt >= :startDate", { startDate: startPreTimeline })
                    .andWhere("orders.createdAt <= :endDate", { endDate: endPreTimeline })
            }
            let preOrderCount = await preOrderCountQueryBuilder.getCount()
            // ===========================================================================================

            let currStoreCount = (await this.getStoreRepositry.find({ where: { storeId: In(storeIds), createdAt: Between(startTimeline, endTimeline) } })).length;
            let preStoreCount = (await this.getStoreRepositry.find({ where: { storeId: In(storeIds), createdAt: Between(startPreTimeline, endPreTimeline) } })).length;

            const orderSubquery = this.getOrderRepositry.createQueryBuilder("orders")
                .select("orders.storeId", "storeId")
                // .where("orders.orderStatus != :orderStatus", { orderStatus: OrderStatus.CANCELLED })
                .getQuery();

            let unBilledStoreCount = (await this.getStoreRepositry.createQueryBuilder('stores')
                .leftJoinAndSelect("stores.storeCat", "storeCat")
                .where("stores.storeId IN (:...storeIds)", { storeIds: storeIds })
                .andWhere(`stores.storeId NOT IN (${orderSubquery})`)
                .getMany()).length;

            const todayVisitCount = await this.getVisitRepository.count({
                where: {
                    visitDate: Between(startOfDay(new Date()), endOfDay(new Date()))
                }
            })
            const focusedProductCount = await this.getProductRepository.count({
                where: { isFocused: true }
            })

            const currTargetQueryBuilder = this.getTargetRepository.createQueryBuilder('target')
                .select([
                    'target'
                ])
                .where('target.empId = :empId', { empId: emp_id })
                .andWhere('target.is_active = :isActive', { isActive: true })
                .andWhere('target.createdAt >= :startDate', { startDate: startTimeline })
                .andWhere('target.createdAt <= :endDate', { endDate: endTimeline });


            const currTarget = await currTargetQueryBuilder.getMany();
            const targets = currTarget.map((data: any) => data.target);

            const allTargets = targets.flat(); // Assuming targets is an array of arrays
            const totalStoreTarget = allTargets.reduce((acc: number, item: any) => acc + Number(item?.storeTarget || 0), 0);
            const totalCollectionTarget = allTargets.reduce((acc: number, item: any) => acc + Number(item?.collectionTarget || 0), 0);
            const totalOrderTarget = allTargets.reduce((acc: number, item: any) => acc + Number(item?.orderTarget || 0), 0);
            //  SKU
            let topSKUQueryBuilder: any = await this.getOrderRepositry.createQueryBuilder("orders")
                .select("unnested.product->>'productName' AS productName")
                .addSelect("brand.name AS brandName")
                .addSelect("SUM(CAST(unnested.product->>'rlp' AS NUMERIC) * (COALESCE(CAST(unnested.product->>'noOfPiece' AS NUMERIC), 0) + (COALESCE(CAST(unnested.product->>'caseQty' AS NUMERIC), 0) * COALESCE(CAST(unnested.product->>'noOfCase' AS NUMERIC), 0)))) AS total_sales")
                .leftJoin(
                    qb => qb
                        .select("jsonb_array_elements(orders.products::jsonb) AS product")
                        .from("orders", "orders"),
                    "unnested",
                    "true"
                )
                .leftJoin(
                    "Brand",
                    "brand",
                    "CAST(unnested.product->>'brandId' AS INTEGER) = brand.brandId"
                ).where('orders.empId = :empId', { empId: emp_id })
                .andWhere("orders.orderStatus != :orderStatus", { orderStatus: OrderStatus.CANCELLED });
            // if (role === UserRole.RSM) {
            //     topSKUQueryBuilder = topSKUQueryBuilder.where("orders.empId IN (:...empIds)", { empIds })
            // }
            let topSKU = await topSKUQueryBuilder.groupBy("unnested.product->>'productName'")
                .addGroupBy("brand.name")
                .orderBy("total_sales", "DESC")
                .limit(5)
                .getRawMany();

            // ---------------------------------------- Bottom SKU--------------------------------------------
            let bottomSKUQueryBuilder: any = await this.getOrderRepositry.createQueryBuilder("orders")
                .select("unnested.product->>'productName' AS productName")
                .addSelect("brand.name AS brandName")
                .addSelect("SUM(CAST(unnested.product->>'rlp' AS NUMERIC) * (COALESCE(CAST(unnested.product->>'noOfPiece' AS NUMERIC), 0) + (COALESCE(CAST(unnested.product->>'caseQty' AS NUMERIC), 0) * COALESCE(CAST(unnested.product->>'noOfCase' AS NUMERIC), 0)))) AS total_sales")
                .leftJoin(
                    qb => qb
                        .select("jsonb_array_elements(orders.products::jsonb) AS product")
                        .from("orders", "orders"),
                    "unnested",
                    "true"
                )
                .leftJoin(
                    "Brand",
                    "brand",
                    "CAST(unnested.product->>'brandId' AS INTEGER) = brand.brandId"
                ).where('orders.empId = :empId', { empId: emp_id })
                .andWhere("orders.orderStatus != :orderStatus", { orderStatus: OrderStatus.CANCELLED });
            // if (role === UserRole.RSM) {
            //     bottomSKUQueryBuilder.where("orders.empId IN (:...empIds)", { empIds })
            // }
            let bottomSKU = await bottomSKUQueryBuilder.groupBy("unnested.product->>'productName'")
                .addGroupBy("brand.name")
                .orderBy("total_sales", "ASC")
                .limit(5)
                .getRawMany();

            // order count with pending payment
            let orderCountWithPayment = await this.getOrderRepositry.createQueryBuilder('orders')
                .select("COUNT(orders.orderId)", "totalOrderCount")
                .where("orders.empId = :empId", { empId: emp_id })
                .andWhere("orders.paymentStatus = :paymentStatus", { paymentStatus: PaymentStatus.PENDING })
                .andWhere("orders.orderStatus != :orderStatus", { orderStatus: OrderStatus.CANCELLED })


            if (timePeriod.length > 0 && startTimeline && endTimeline) {
                orderCountWithPayment.andWhere("orders.createdAt >= :startDate", { startDate: startTimeline })
                    .andWhere("orders.createdAt <= :endDate", { endDate: endTimeline })
            }
            let currOrderCountWithPendingPayment = await orderCountWithPayment.getCount();
            // ---------------------------------------------------------------------------------------------
            let preOrderCountWithPayment = await this.getOrderRepositry.createQueryBuilder('orders')
                .select("COUNT(orders.orderId)", "totalOrderCount")
                .where("orders.empId = :empId", { empId: emp_id })
                .andWhere("orders.paymentStatus = :paymentStatus", { paymentStatus: PaymentStatus.PENDING })
                .andWhere("orders.orderStatus != :orderStatus", { orderStatus: OrderStatus.CANCELLED })


            if (timePeriod.length > 0 && startPreTimeline && endPreTimeline) {
                preOrderCountWithPayment.andWhere("orders.createdAt >= :startDate", { startDate: startPreTimeline })
                    .andWhere("orders.createdAt <= :endDate", { endDate: endPreTimeline })
            }
            let preOrderCountWithPendingPayment = await preOrderCountWithPayment.getCount();

            // Order Value Sales
            const ordersPaymentQueryBuilder = this.getOrderRepositry.createQueryBuilder("orders")
                .select("orders.empId", "empId")
                .addSelect("SUM(orders.orderAmount)", "totalAmount")
                .addSelect("SUM(orders.collectedAmount)", "totalCollectedAmount")
                .leftJoin("orders.user", "user")
                .addSelect("user.valueTarget", "valueTarget")
                .addSelect("user.storeTarget", "storeTarget")
                .where("orders.empId = :empId", { empId: emp_id })
                .andWhere("orders.paymentStatus = :paymentStatus", { paymentStatus: PaymentStatus.PENDING })
                .andWhere("orders.orderStatus != :orderStatus", { orderStatus: OrderStatus.CANCELLED })
                .groupBy("orders.empId")
                .addGroupBy("user.valueTarget")
                .addGroupBy('user.storeTarget');

            // Conditionally add date range filter for orders
            if (timePeriod.length > 0 && startTimeline && endTimeline) {
                ordersPaymentQueryBuilder.andWhere('orders.createdAt >= :startDate', { startDate: startTimeline })
                    .andWhere('orders.createdAt <= :endDate', { endDate: endTimeline });
            }
            const ordersWithPendingPayment = await ordersPaymentQueryBuilder.getRawOne();
            //--------------------------------------------------------------------------------------------------
            const preOrdersPaymentQueryBuilder = this.getOrderRepositry.createQueryBuilder("orders")
                .select("orders.empId", "empId")
                .addSelect("SUM(orders.orderAmount)", "totalAmount")
                .addSelect("SUM(orders.collectedAmount)", "totalCollectedAmount")
                .where("orders.empId = :empId", { empId: emp_id })
                .andWhere("orders.paymentStatus = :paymentStatus", { paymentStatus: PaymentStatus.PENDING })
                .andWhere("orders.orderStatus != :orderStatus", { orderStatus: OrderStatus.CANCELLED })
                .groupBy("orders.empId")

            // Conditionally add date range filter for orders
            if (timePeriod.length > 0 && startPreTimeline && endPreTimeline) {
                preOrdersPaymentQueryBuilder.andWhere('orders.createdAt >= :startDate', { startDate: startPreTimeline })
                    .andWhere('orders.createdAt <= :endDate', { endDate: endPreTimeline });
            }
            const preSalesWithPendingPayment = await preOrdersPaymentQueryBuilder.getRawOne();
            const reponse = {
                valueTarget: {
                    target: totalOrderTarget ? +totalOrderTarget : 0,
                    achieved: orders ? +orders.totalAmount : 0
                },
                storeTarget: {
                    target: totalStoreTarget ? +totalStoreTarget : 0,
                    achieved: stores ? +stores.totalStoreCount : 0
                },
                collectionTarget: {
                    target: totalCollectionTarget ? +totalCollectionTarget : 0,
                    achieved: orders ? +orders.totalCollectedAmount : 0
                },
                orderVsCollection: {
                    ordered: orders ? +orders.totalAmount : 0,
                    collected: orders ? +orders.totalCollectedAmount : 0
                },
                sales: {
                    currSales: orders ? +orders.totalAmount : 0,
                    preSales: preSales ? +preSales.totalAmount : 0
                },
                collection: {
                    currCollection: orders ? +orders.totalCollectedAmount : 0,
                    preCollection: preSales ? +preSales.totalCollectedAmount : 0
                },
                orderCount: {
                    currOrderCount: currOrderCount ?? 0,
                    preOrderCount: preOrderCount ?? 0
                },
                storeCount: {
                    currStoreCount: currStoreCount ?? 0,
                    preStoreCount: preStoreCount ?? 0
                },
                // monthWiseStoreCount: formattedResults,
                newStoreCount: currStoreCount ? currStoreCount : 0,
                unBilledStoreCount: unBilledStoreCount ? unBilledStoreCount : 0,
                todayVisitCount: todayVisitCount,
                focusedProductCount: focusedProductCount ?? 0,
                // bottomSKU,
                // topSKU,
                orderCountWithpayment: {
                    currOrderCountWithPendingPayment: currOrderCountWithPendingPayment ?? 0,
                    preOrderCountWithPendingPayment: preOrderCountWithPendingPayment ?? 0
                },
                orderValueWithPayment: {
                    ordersWithPendingPayment: ordersWithPendingPayment ?? 0,
                    preSalesWithPendingPayment: preSalesWithPendingPayment ?? 0
                }
                // orderCount: orderCount ?? 0
            }
            return { message: "Success.", status: STATUSCODES.SUCCESS, data: reponse }
        } catch (error) {
            throw error;
        }
    }

    async retailorDashboard(input: any, payload: IUser): Promise<IApiResponse> {
        try {
            const { emp_id } = payload;
            const today = new Date();
            const currentYear = today.getFullYear();
            const { timePeriod = [TimelineEnum.YEAR, currentYear] } = input;
            const quarters: any = {
                1: {
                    start: new Date(Date.UTC(currentYear, 3, 1)).toISOString(),
                    end: new Date(Date.UTC(currentYear, 5, 30, 23, 59, 59)).toISOString()
                },
                2: {
                    start: new Date(Date.UTC(currentYear, 6, 1)).toISOString(),
                    end: new Date(Date.UTC(currentYear, 8, 30, 23, 59, 59)).toISOString()
                },
                3: {
                    start: new Date(Date.UTC(currentYear, 9, 1)).toISOString(),
                    end: new Date(Date.UTC(currentYear, 11, 31, 23, 59, 59)).toISOString()
                },
                4: {
                    start: new Date(Date.UTC(currentYear + 1, 0, 1)).toISOString(),
                    end: new Date(Date.UTC(currentYear + 1, 2, 31, 23, 59, 59)).toISOString()
                }
            };

            let startTimeline: any = null, endTimeline: any = null
            let startPreTimeline: any = null, endPreTimeline: any = null

            if (timePeriod[0] === TimelineEnum.MONTH && timePeriod[1]) {
                const monthNames = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"];
                const monthIndex = monthNames.indexOf(timePeriod[1].toLowerCase());
                startTimeline = new Date(Date.UTC(currentYear, monthIndex, 1)).toISOString();
                endTimeline = new Date(Date.UTC(currentYear, monthIndex + 1, 0, 23, 59, 59, 999)).toISOString();

                if (monthIndex === 0) {
                    startPreTimeline = new Date(Date.UTC(currentYear - 1, 11, 1)).toISOString();
                    endPreTimeline = new Date(Date.UTC(currentYear - 1, 12, 0, 23, 59, 59, 999)).toISOString();
                } else {
                    startPreTimeline = new Date(Date.UTC(currentYear, monthIndex - 1, 1)).toISOString();
                    endPreTimeline = new Date(Date.UTC(currentYear, monthIndex, 0, 23, 59, 59, 999)).toISOString();
                }


            } else if (timePeriod[0] === TimelineEnum.YEAR && timePeriod[1]) {
                startTimeline = new Date(Date.UTC(timePeriod[1], 0, 1)).toISOString();
                endTimeline = new Date(Date.UTC(timePeriod[1], 11, 31, 23, 59, 59, 999)).toISOString();

                startPreTimeline = new Date(Date.UTC(timePeriod[1] - 1, 0, 1)).toISOString();
                endPreTimeline = new Date(Date.UTC(timePeriod[1] - 1, 11, 31, 23, 59, 59, 999)).toISOString();

            } else if (timePeriod[0] === TimelineEnum.QUARTER && timePeriod[1]) {
                const selectedQuarter: any = quarters[timePeriod[1].toUpperCase().replace("Q", "")];
                startTimeline = selectedQuarter.start
                endTimeline = selectedQuarter.end

                if (timePeriod[1] === "Q4") {
                    startPreTimeline = new Date(Date.UTC(currentYear, 9, 1)).toISOString(),
                        endPreTimeline = new Date(Date.UTC(currentYear, 11, 31, 23, 59, 59)).toISOString()
                } else if (timePeriod[1] === "Q1") {
                    startPreTimeline = new Date(Date.UTC(currentYear, 0, 1)).toISOString(),
                        endPreTimeline = new Date(Date.UTC(currentYear, 2, 31, 23, 59, 59)).toISOString()
                } else {
                    const selectedPreQuarter: any = quarters[timePeriod[1].toUpperCase().replace("Q", "") - 1];
                    startPreTimeline = selectedPreQuarter.start
                    endPreTimeline = selectedPreQuarter.end
                }


            }

            const targetQueryBuilder = this.getTargetRepository.createQueryBuilder('target')
                .select(['target.emp_id',
                    'SUM(target.store_target) AS total_store_target',
                    'SUM(target.amount_target) AS total_amount_target'
                ])
                .andWhere('target.emp_id = :emp_id', { emp_id })
                .andWhere('target.is_active = :isActive', { isActive: true })
                .andWhere('target.is_deleted = :isDeleted', { isDeleted: false })
                .groupBy("target.emp_id");
            if (timePeriod.length > 0 && startTimeline && endTimeline) {
                targetQueryBuilder.andWhere('target.month >= :startDate', { startDate: startTimeline })
                    .andWhere('target.month <= :endDate', { endDate: endTimeline });
            }
            const currentMonthTarget = await targetQueryBuilder.getRawOne();
            if (currentMonthTarget && currentMonthTarget.total_store_target !== null && currentMonthTarget.total_amount_target !== null) {
                const storeTarget = +currentMonthTarget.total_store_target; // Convert to number
                const valueTarget = +currentMonthTarget.total_amount_target; // Convert to number
                await this.getUserRepositry.createQueryBuilder()
                    .update({ storeTarget, valueTarget })
                    .where({ emp_id })
                    .execute();
            } else {
                console.error("Invalid or missing data in currentMonthTarget.");
            }
            const ordersQueryBuilder = this.getOrderRepositry.createQueryBuilder("orders")
                .select("orders.empId", "empId")
                .addSelect("SUM(orders.netAmount)", "totalAmount")
                .addSelect("SUM(orders.collectedAmount)", "totalCollectedAmount")
                .leftJoin("orders.user", "user")
                .addSelect("user.valueTarget", "valueTarget")
                .addSelect("user.storeTarget", "storeTarget")
                .where("orders.empId = :empId", { empId: emp_id })
                .andWhere("orders.orderStatus != :orderStatus", { orderStatus: OrderStatus.CANCELLED })
                .groupBy("orders.empId")
                .addGroupBy("user.valueTarget")
                .addGroupBy('user.storeTarget');

            // Conditionally add date range filter for orders
            if (timePeriod.length > 0 && startTimeline && endTimeline) {
                ordersQueryBuilder.andWhere('orders.createdAt >= :startDate', { startDate: startTimeline })
                    .andWhere('orders.createdAt <= :endDate', { endDate: endTimeline });
            }
            const orders = await ordersQueryBuilder.getRawOne();
            //--------------------------------------------------------------------------------------------------
            const preOrdersQueryBuilder = this.getOrderRepositry.createQueryBuilder("orders")
                .select("orders.empId", "empId")
                .addSelect("SUM(orders.netAmount)", "totalAmount")
                .addSelect("SUM(orders.collectedAmount)", "totalCollectedAmount")
                .where("orders.empId = :empId", { empId: emp_id })
                .andWhere("orders.orderStatus != :orderStatus", { orderStatus: OrderStatus.CANCELLED })
                .groupBy("orders.empId")

            // Conditionally add date range filter for orders
            if (timePeriod.length > 0 && startPreTimeline && endPreTimeline) {
                preOrdersQueryBuilder.andWhere('orders.createdAt >= :startDate', { startDate: startPreTimeline })
                    .andWhere('orders.createdAt <= :endDate', { endDate: endPreTimeline });
            }
            const preSales = await preOrdersQueryBuilder.getRawOne();
            // ============================================================================
       
            // ===============================================================================================
            let orderCountQueryBuilder = await this.getOrderRepositry.createQueryBuilder('orders')
                .select("COUNT(orders.orderId)", "totalOrderCount")
                .where("orders.empId = :empId", { empId: emp_id })
                .andWhere("orders.orderStatus != :orderStatus", { orderStatus: OrderStatus.CANCELLED })


            if (timePeriod.length > 0 && startTimeline && endTimeline) {
                orderCountQueryBuilder.andWhere("orders.createdAt >= :startDate", { startDate: startTimeline })
                    .andWhere("orders.createdAt <= :endDate", { endDate: endTimeline })
            }
            let currOrderCount = await orderCountQueryBuilder.getCount();
            // ---------------------------------------------------------------------------------------------
            let preOrderCountQueryBuilder = await this.getOrderRepositry.createQueryBuilder('orders')
                .select("COUNT(orders.orderId)", "totalOrderCount")
                .where("orders.empId = :empId", { empId: emp_id })
                .andWhere("orders.orderStatus != :orderStatus", { orderStatus: OrderStatus.CANCELLED })


            if (timePeriod.length > 0 && startPreTimeline && endPreTimeline) {
                preOrderCountQueryBuilder.andWhere("orders.createdAt >= :startDate", { startDate: startPreTimeline })
                    .andWhere("orders.createdAt <= :endDate", { endDate: endPreTimeline })
            }
            let preOrderCount = await preOrderCountQueryBuilder.getCount()
            // ===========================================================================================

          

            const currTargetQueryBuilder = this.getTargetRepository.createQueryBuilder('target')
                .select([
                    'target'
                ])
                .where('target.empId = :empId', { empId: emp_id })
                .andWhere('target.is_active = :isActive', { isActive: true })
                .andWhere('target.createdAt >= :startDate', { startDate: startTimeline })
                .andWhere('target.createdAt <= :endDate', { endDate: endTimeline });


            const currTarget = await currTargetQueryBuilder.getMany();
            const targets = currTarget.map((data: any) => data.target);

            const allTargets = targets.flat(); // Assuming targets is an array of arrays
            // const totalStoreTarget = allTargets.reduce((acc: number, item: any) => acc + Number(item?.storeTarget || 0), 0);
            // const totalCollectionTarget = allTargets.reduce((acc: number, item: any) => acc + Number(item?.collectionTarget || 0), 0);
            const totalOrderTarget = allTargets.reduce((acc: number, item: any) => acc + Number(item?.orderTarget || 0), 0);
            //  SKU
            let topSKUQueryBuilder: any = await this.getOrderRepositry.createQueryBuilder("orders")
                .select("unnested.product->>'productName' AS productName")
                .addSelect("brand.name AS brandName")
                .addSelect("SUM(CAST(unnested.product->>'rlp' AS NUMERIC) * (COALESCE(CAST(unnested.product->>'noOfPiece' AS NUMERIC), 0) + (COALESCE(CAST(unnested.product->>'caseQty' AS NUMERIC), 0) * COALESCE(CAST(unnested.product->>'noOfCase' AS NUMERIC), 0)))) AS total_sales")
                .leftJoin(
                    qb => qb
                        .select("jsonb_array_elements(orders.products::jsonb) AS product")
                        .from("orders", "orders"),
                    "unnested",
                    "true"
                )
                .leftJoin(
                    "Brand",
                    "brand",
                    "CAST(unnested.product->>'brandId' AS INTEGER) = brand.brandId"
                ).where('orders.empId = :empId', { empId: emp_id })
                .andWhere("orders.orderStatus != :orderStatus", { orderStatus: OrderStatus.CANCELLED });
            
            let topSKU = await topSKUQueryBuilder.groupBy("unnested.product->>'productName'")
                .addGroupBy("brand.name")
                .orderBy("total_sales", "DESC")
                .limit(5)
                .getRawMany();

            // ---------------------------------------- Bottom SKU--------------------------------------------
            let bottomSKUQueryBuilder: any = await this.getOrderRepositry.createQueryBuilder("orders")
                .select("unnested.product->>'productName' AS productName")
                .addSelect("brand.name AS brandName")
                .addSelect("SUM(CAST(unnested.product->>'rlp' AS NUMERIC) * (COALESCE(CAST(unnested.product->>'noOfPiece' AS NUMERIC), 0) + (COALESCE(CAST(unnested.product->>'caseQty' AS NUMERIC), 0) * COALESCE(CAST(unnested.product->>'noOfCase' AS NUMERIC), 0)))) AS total_sales")
                .leftJoin(
                    qb => qb
                        .select("jsonb_array_elements(orders.products::jsonb) AS product")
                        .from("orders", "orders"),
                    "unnested",
                    "true"
                )
                .leftJoin(
                    "Brand",
                    "brand",
                    "CAST(unnested.product->>'brandId' AS INTEGER) = brand.brandId"
                ).where('orders.empId = :empId', { empId: emp_id })
                .andWhere("orders.orderStatus != :orderStatus", { orderStatus: OrderStatus.CANCELLED });
            
            let bottomSKU = await bottomSKUQueryBuilder.groupBy("unnested.product->>'productName'")
                .addGroupBy("brand.name")
                .orderBy("total_sales", "ASC")
                .limit(5)
                .getRawMany();

            // order count with pending payment
            let orderCountWithPayment = await this.getOrderRepositry.createQueryBuilder('orders')
                .select("COUNT(orders.orderId)", "totalOrderCount")
                .where("orders.empId = :empId", { empId: emp_id })
                .andWhere("orders.paymentStatus = :paymentStatus", { paymentStatus: PaymentStatus.PENDING })
                .andWhere("orders.orderStatus != :orderStatus", { orderStatus: OrderStatus.CANCELLED })

            if (timePeriod.length > 0 && startTimeline && endTimeline) {
                orderCountWithPayment.andWhere("orders.createdAt >= :startDate", { startDate: startTimeline })
                    .andWhere("orders.createdAt <= :endDate", { endDate: endTimeline })
            }
            let currOrderCountWithPendingPayment = await orderCountWithPayment.getCount();
            // ---------------------------------------------------------------------------------------------
            let preOrderCountWithPayment = await this.getOrderRepositry.createQueryBuilder('orders')
                .select("COUNT(orders.orderId)", "totalOrderCount")
                .where("orders.empId = :empId", { empId: emp_id })
                .andWhere("orders.paymentStatus = :paymentStatus", { paymentStatus: PaymentStatus.PENDING })
                .andWhere("orders.orderStatus != :orderStatus", { orderStatus: OrderStatus.CANCELLED })

            if (timePeriod.length > 0 && startPreTimeline && endPreTimeline) {
                preOrderCountWithPayment.andWhere("orders.createdAt >= :startDate", { startDate: startPreTimeline })
                    .andWhere("orders.createdAt <= :endDate", { endDate: endPreTimeline })
            }
            let preOrderCountWithPendingPayment = await preOrderCountWithPayment.getCount();

            // Order Value Sales
            const ordersPaymentQueryBuilder = this.getOrderRepositry.createQueryBuilder("orders")
                .select("orders.empId", "empId")
                .addSelect("SUM(orders.netAmount) - SUM(orders.collectedAmount)", "totalAmount")
                .leftJoin("orders.user", "user")
                .where("orders.empId = :empId", { empId: emp_id })
                // .andWhere("orders.paymentStatus = :paymentStatus", { paymentStatus: PaymentStatus.PENDING })
                .andWhere("orders.orderStatus != :orderStatus", { orderStatus: OrderStatus.CANCELLED })
                .groupBy("orders.empId")
                .addGroupBy("user.valueTarget")
                .addGroupBy('user.storeTarget');

            // Conditionally add date range filter for orders
            if (timePeriod.length > 0 && startTimeline && endTimeline) {
                ordersPaymentQueryBuilder.andWhere('orders.createdAt >= :startDate', { startDate: startTimeline })
                    .andWhere('orders.createdAt <= :endDate', { endDate: endTimeline });
            }
            const ordersWithPendingPayment = await ordersPaymentQueryBuilder.getRawOne();
            //--------------------------------------------------------------------------------------------------
            const preOrdersPaymentQueryBuilder = this.getOrderRepositry.createQueryBuilder("orders")
                .select("orders.empId", "empId")
                .addSelect("SUM(orders.netAmount)", "totalAmount")
                .addSelect("SUM(orders.collectedAmount)", "totalCollectedAmount")
                .where("orders.empId = :empId", { empId: emp_id })
                .andWhere("orders.paymentStatus = :paymentStatus", { paymentStatus: PaymentStatus.PENDING })
                .andWhere("orders.orderStatus != :orderStatus", { orderStatus: OrderStatus.CANCELLED })
                .groupBy("orders.empId")

            // Conditionally add date range filter for orders
            if (timePeriod.length > 0 && startPreTimeline && endPreTimeline) {
                preOrdersPaymentQueryBuilder.andWhere('orders.createdAt >= :startDate', { startDate: startPreTimeline })
                    .andWhere('orders.createdAt <= :endDate', { endDate: endPreTimeline });
            }
            const preSalesWithPendingPayment = await preOrdersPaymentQueryBuilder.getRawOne();
            const reponse = {
                valueTarget: {
                    target: totalOrderTarget ? +totalOrderTarget : 0,
                    achieved: orders ? +orders.totalAmount : 0
                },
                sales: {
                    currSales: orders ? +orders.totalAmount : 0,
                    preSales: preSales ? +preSales.totalAmount : 0
                },
                orderCount: {
                    currOrderCount: currOrderCount ?? 0,
                    preOrderCount: preOrderCount ?? 0
                },
                sku: {
                    topSKU: topSKU ?? [],
                    bottomSKU: bottomSKU ?? []
                },
                orderCountWithPendingPayment: {
                    currOrder: currOrderCountWithPendingPayment ?? 0,
                    preOrder: preOrderCountWithPendingPayment ?? 0
                },
                orderValueWithPendingPayment: {
                    currSales: ordersWithPendingPayment ?? 0,
                    preSales: preSalesWithPendingPayment ?? 0
                }
            }
            return { message: "Success.", status: STATUSCODES.SUCCESS, data: reponse }
        } catch (error) {
            throw error;
        }
    }

    async adminDashboard(payload: IUser, input: any): Promise<IApiResponse> {
        try {
            const { emp_id, role } = payload;
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
            let startPreTimeline: any = null, endPreTimeline: any = null

            if (timePeriod[0] === TimelineEnum.MONTH && timePeriod[1]) {
                const monthNames = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"];
                const monthIndex = monthNames.indexOf(timePeriod[1].toLowerCase());
                startTimeline = new Date(Date.UTC(currentYr, monthIndex, 1)).toISOString();
                endTimeline = new Date(Date.UTC(currentYr, monthIndex + 1, 0, 23, 59, 59, 999)).toISOString();

                if (monthIndex === 0) {
                    startPreTimeline = new Date(Date.UTC(currentYr - 1, 11, 1)).toISOString();
                    endPreTimeline = new Date(Date.UTC(currentYr - 1, 12, 0, 23, 59, 59, 999)).toISOString();
                } else {
                    startPreTimeline = new Date(Date.UTC(currentYr, monthIndex - 1, 1)).toISOString();
                    endPreTimeline = new Date(Date.UTC(currentYr, monthIndex, 0, 23, 59, 59, 999)).toISOString();
                }


            } else if (timePeriod[0] === TimelineEnum.YEAR && timePeriod[1]) {
                startTimeline = new Date(Date.UTC(timePeriod[1], 0, 1)).toISOString();
                endTimeline = new Date(Date.UTC(timePeriod[1], 11, 31, 23, 59, 59, 999)).toISOString();

                startPreTimeline = new Date(Date.UTC(timePeriod[1] - 1, 0, 1)).toISOString();
                endPreTimeline = new Date(Date.UTC(timePeriod[1] - 1, 11, 31, 23, 59, 59, 999)).toISOString();

            } else if (timePeriod[0] === TimelineEnum.QUARTER && timePeriod[1]) {
                const selectedQuarter: any = quarters[timePeriod[1].toUpperCase().replace("Q", "")];
                startTimeline = selectedQuarter.start
                endTimeline = selectedQuarter.end

                if (timePeriod[1] === "Q4") {
                    startPreTimeline = new Date(Date.UTC(currentYr, 9, 1)).toISOString(),
                        endPreTimeline = new Date(Date.UTC(currentYr, 11, 31, 23, 59, 59)).toISOString()
                } else if (timePeriod[1] === "Q1") {
                    startPreTimeline = new Date(Date.UTC(currentYr, 0, 1)).toISOString(),
                        endPreTimeline = new Date(Date.UTC(currentYr, 2, 31, 23, 59, 59)).toISOString()
                } else {
                    const selectedPreQuarter: any = quarters[timePeriod[1].toUpperCase().replace("Q", "") - 1];
                    startPreTimeline = selectedPreQuarter.start
                    endPreTimeline = selectedPreQuarter.end
                }


            }
            let empIds = []
            if (role === UserRole.RSM) {
                const userLists: IUser[] | null = await this.getUserRepositry.find({ where: { managerId: emp_id } });
                empIds = userLists.map((data: any) => data.emp_id);
            }

            let fitlerQuery: any = [];
            const storesIds: any = await this.beatRespositry.createQueryBuilder("beat")
                .where("beat.empId = :empId", { empId: emp_id })
                .select("beat.store")
                .getMany();
            if (storesIds.length > 0) {
                fitlerQuery = storesIds;
            }
            const storeIds = fitlerQuery.map((beat: any) => beat.store).flat();
            // const empName = userLists.map((data: any) => data.firstname).join(',')
            const orderSubquery = this.getOrderRepositry.createQueryBuilder("orders")
                .select("orders.storeId", "storeId")
                // .where("orders.orderStatus != :orderStatus", { orderStatus: OrderStatus.CANCELLED })
                .getQuery();

            let unBilledQueryBuilder: any = await this.getStoreRepositry.createQueryBuilder('stores')
                .leftJoinAndSelect('stores.user', 'user')  // Added this line assuming there is a relation between stores and user
                .select([
                    'stores.storeId AS store_id',
                    'stores.storeName AS store_name',
                    'stores.createdAt AS created_at',
                    'user.firstname AS firstname',
                    'user.lastname AS lastname'
                ])
                .where(`stores.storeId NOT IN (${orderSubquery})`);

            if (role === UserRole.RSM) {
                unBilledQueryBuilder = unBilledQueryBuilder.where("stores.storeId IN (:...storeIds)", { storeIds: storeIds });
            }
            const unBilledStore: any = await unBilledQueryBuilder.limit(6).getRawMany();

            let PendingApprovalQueryBuilder = await this.getOrderRepositry.createQueryBuilder('orders')
                .leftJoinAndSelect('orders.user', 'user')
                .leftJoinAndSelect('orders.store', 'stores')   // Added this line assuming there is a relation between stores and user
                .select([
                    'stores.storeName AS store_name',
                    'user.firstname AS firstname',
                    'user.lastname AS lastname',
                    'orders.orderId AS order_id',
                    'orders.specialDiscountValue AS specialdiscountvalue',
                    'orders.specialDiscountStatus AS discount_status',
                    'orders.orderAmount As orderAmount'
                ])
                .where('orders.specialDiscountValue IS NOT NULL')
                .andWhere('orders.specialDiscountStatus IN (:...statuses)', { statuses: ['PENDING'] })
                .andWhere("orders.orderStatus != :orderStatus", { orderStatus: OrderStatus.CANCELLED })
                .andWhere("orders.orderStatus != :orderStatus", { orderStatus: OrderStatus.ORDERSAVED });

            if (role === UserRole.RSM) {
                PendingApprovalQueryBuilder = PendingApprovalQueryBuilder.andWhere("orders.storeId IN (:...storeIds)", { storeIds: storeIds });
            }
            const PendingApprovalStores: any = await PendingApprovalQueryBuilder.limit(6).getRawMany();
            const performer: any = [];
            let topPerformerQueryBuilder: any = await this.getOrderRepositry.createQueryBuilder("orders")
                .select("orders.empId", "empId")
                .addSelect("user.firstname", "firstname")
                .addSelect("user.lastname", "lastname")
                .addSelect("user.role", "role")
                .addSelect("SUM(orders.orderAmount) AS totalAmount")
                .leftJoin("User", "user", "orders.empId = user.emp_id")
                .where("user.role = :role", { role: "SSM" })
                .andWhere("orders.orderStatus NOT IN (:...statuses)", { statuses: [OrderStatus.CANCELLED, OrderStatus.ORDERSAVED] })


            if (role === UserRole.RSM) {
                topPerformerQueryBuilder = topPerformerQueryBuilder.andWhere("orders.storeId IN (:...storeIds)", { storeIds: storeIds });
            }
            const topPerformer: any = await topPerformerQueryBuilder.groupBy("orders.empId")
                .addGroupBy("user.firstname")
                .addGroupBy("user.lastname")
                .addGroupBy("user.role")
                .orderBy("SUM(orders.orderAmount)", "DESC")
                .limit(5)
                .getRawMany();

            let bottomPerformer: any = [];
            let employeeCountQueryBuilder = await this.getOrderRepositry.createQueryBuilder("orders")
                .select("COUNT(DISTINCT orders.empId)", "employeeCount")
                .where("orders.orderStatus != :orderStatus", { orderStatus: OrderStatus.CANCELLED })
            if (role === UserRole.RSM) {
                employeeCountQueryBuilder = employeeCountQueryBuilder.where("orders.storeId IN (:...storeIds)", { storeIds: storeIds });
            }
            let employeeCount = await employeeCountQueryBuilder.getRawOne();
            if (employeeCount && Number(employeeCount.employeeCount) > 5) {
                let bottomPerformerQueryBuilder = await this.getOrderRepositry.createQueryBuilder("orders")
                    .select("orders.empId", "empId")
                    .addSelect("user.firstname", "firstname")
                    .addSelect("user.lastname", "lastname")
                    .addSelect("user.role", "role")
                    .addSelect("SUM(orders.orderAmount) AS totalAmount")
                    .leftJoin("User", "user", "orders.empId = user.emp_id")
                    .where("user.role = :role", { role: "SSM" })
                    .andWhere("orders.orderStatus NOT IN (:...statuses)", { statuses: [OrderStatus.CANCELLED, OrderStatus.ORDERSAVED] })

                if (role === UserRole.RSM) {
                    bottomPerformerQueryBuilder = bottomPerformerQueryBuilder.andWhere("orders.storeId IN (:...storeIds)", { storeIds: storeIds });
                }
                bottomPerformer = await bottomPerformerQueryBuilder.groupBy("orders.empId")
                    .addGroupBy("user.firstname")
                    .addGroupBy("user.lastname")
                    .addGroupBy("user.role")
                    .orderBy("SUM(orders.orderAmount)", "ASC")
                    .limit(5)
                    .getRawMany();
            }
            performer.push({
                topPerformer,
                bottomPerformer
            })
            let topSKUQueryBuilder: any = await this.getOrderRepositry.createQueryBuilder("orders")
                .select("unnested.product->>'productName' AS productName")
                .addSelect("brand.name AS brandName")
                .addSelect("SUM(CAST(unnested.product->>'rlp' AS NUMERIC) * (COALESCE(CAST(unnested.product->>'noOfPiece' AS NUMERIC), 0) + (COALESCE(CAST(unnested.product->>'caseQty' AS NUMERIC), 0) * COALESCE(CAST(unnested.product->>'noOfCase' AS NUMERIC), 0)))) AS total_sales")
                .leftJoin(
                    qb => qb
                        .select("jsonb_array_elements(orders.products::jsonb) AS product")
                        .from("orders", "orders")
                        .where("orders.orderStatus != :orderStatus", { orderStatus: OrderStatus.CANCELLED }),
                    "unnested",
                    "true"
                )
                .leftJoin(
                    "Brand",
                    "brand",
                    "CAST(unnested.product->>'brandId' AS INTEGER) = brand.brandId"
                ).where("orders.orderStatus NOT IN (:...statuses)", { statuses: [OrderStatus.CANCELLED, OrderStatus.ORDERSAVED] })

            if (role === UserRole.RSM) {
                topSKUQueryBuilder = topSKUQueryBuilder.andWhere("orders.storeId IN (:...storeIds)", { storeIds: storeIds });
            }
            let topSKU = await topSKUQueryBuilder.groupBy("unnested.product->>'productName'")
                .addGroupBy("brand.name")
                .orderBy("total_sales", "DESC")
                .limit(5)
                .getRawMany();

            // ---------------------------------------- Bottom SKU--------------------------------------------
            let bottomSKUQueryBuilder: any = await this.getOrderRepositry.createQueryBuilder("orders")
                .select("unnested.product->>'productName' AS productName")
                .addSelect("brand.name AS brandName")
                .addSelect("SUM(CAST(unnested.product->>'rlp' AS NUMERIC) * (COALESCE(CAST(unnested.product->>'noOfPiece' AS NUMERIC), 0) + (COALESCE(CAST(unnested.product->>'caseQty' AS NUMERIC), 0) * COALESCE(CAST(unnested.product->>'noOfCase' AS NUMERIC), 0)))) AS total_sales")
                .leftJoin(
                    qb => qb
                        .select("jsonb_array_elements(orders.products::jsonb) AS product")
                        .from("orders", "orders")
                        .where("orders.orderStatus != :orderStatus", { orderStatus: OrderStatus.CANCELLED }),
                    "unnested",
                    "true"
                )
                .leftJoin(
                    "Brand",
                    "brand",
                    "CAST(unnested.product->>'brandId' AS INTEGER) = brand.brandId"
                ).where("orders.orderStatus NOT IN (:...statuses)", { statuses: [OrderStatus.CANCELLED, OrderStatus.ORDERSAVED] })

            if (role === UserRole.RSM) {
                bottomSKUQueryBuilder.andWhere("orders.storeId IN (:...storeIds)", { storeIds: storeIds });
            }
            let bottomSKU = await bottomSKUQueryBuilder.groupBy("unnested.product->>'productName'")
                .addGroupBy("brand.name")
                .orderBy("total_sales", "ASC")
                .limit(5)
                .getRawMany();
            // =========================Stores Count================================-
            let currStoreCountQueryBuilder = await this.getStoreRepositry.createQueryBuilder('stores')
                .select("COUNT(stores.storeId)", "totalStoreCount")
                .where("stores.createdAt >= :startDate", { startDate: startTimeline })
                .andWhere("stores.createdAt <= :endDate", { endDate: endTimeline })

            if (role === UserRole.RSM) {
                currStoreCountQueryBuilder.andWhere("stores.storeId IN (:...storeIds)", { storeIds: storeIds });
            }
            let currStoreCount = await currStoreCountQueryBuilder.getCount();
            // --------------------------------------------------------------------------------------------
            let preStoreCountQueryBuilder = await this.getStoreRepositry.createQueryBuilder('stores')
                .select("COUNT(stores.storeId)", "totalStoreCount")
                .where("stores.createdAt >= :startDate", { startDate: startPreTimeline })
                .andWhere("stores.createdAt <= :endDate", { endDate: endPreTimeline })

            if (role === UserRole.RSM) {
                preStoreCountQueryBuilder.andWhere("stores.storeId IN (:...storeIds)", { storeIds: storeIds });
            }
            let preStoreCount = await preStoreCountQueryBuilder.getCount();
            //   ============================================================================================================


            let currOrderCountQueryBuilder = await this.getOrderRepositry.createQueryBuilder('orders')
                .select("COUNT(orders.orderId)", "totalOrderCount")
                .where("orders.createdAt >= :startDate", { startDate: startTimeline })
                .andWhere("orders.createdAt <= :endDate", { endDate: endTimeline })
                .andWhere("orders.orderStatus NOT IN (:...statuses)", { statuses: [OrderStatus.CANCELLED, OrderStatus.ORDERSAVED] })

            if (role === UserRole.RSM) {
                currOrderCountQueryBuilder.andWhere("orders.storeId IN (:...storeIds)", { storeIds: storeIds });
            }
            let currOrderCount = await currOrderCountQueryBuilder.getCount();
            // ------------------------------------------------------------------------------------------------------
            let preOrderCountQueryBuilder = await this.getOrderRepositry.createQueryBuilder('orders')
                .select("COUNT(orders.orderId)", "totalOrderCount")
                .where("orders.createdAt >= :startDate", { startDate: startPreTimeline })
                .andWhere("orders.createdAt <= :endDate", { endDate: endPreTimeline })
                .andWhere("orders.orderStatus NOT IN (:...statuses)", { statuses: [OrderStatus.CANCELLED, OrderStatus.ORDERSAVED] })

            if (role === UserRole.RSM) {
                preOrderCountQueryBuilder.andWhere("orders.storeId IN (:...storeIds)", { storeIds: storeIds });
            }
            let preOrderCount = await preOrderCountQueryBuilder.getCount();
            // ============================================= Sales ==================================================
            let currSalesQueryBuilder = await this.getOrderRepositry.createQueryBuilder('orders')
                .select("SUM(orders.orderAmount)", "totalOrderAmount")
                .addSelect("SUM(orders.collectedAmount)", "totalCollectedAmount")
                .where("orders.createdAt >= :startDate", { startDate: startTimeline })
                .andWhere("orders.createdAt <= :endDate", { endDate: endTimeline })
                .andWhere("orders.orderStatus NOT IN (:...statuses)", { statuses: [OrderStatus.CANCELLED, OrderStatus.ORDERSAVED] })

            if (role === UserRole.RSM) {
                currSalesQueryBuilder.andWhere("orders.storeId IN (:...storeIds)", { storeIds: storeIds });
            }
            let currSales = await currSalesQueryBuilder.getRawOne();
            // ----------------------------------------------------------------------------------------------------------
            let preSalesQueryBuilder = await this.getOrderRepositry.createQueryBuilder('orders')
                .select("SUM(orders.orderAmount)", "totalOrderAmount")
                .addSelect("SUM(orders.collectedAmount)", "totalCollectedAmount")
                .where("orders.createdAt >= :startDate", { startDate: startPreTimeline })
                .andWhere("orders.createdAt <= :endDate", { endDate: endPreTimeline })
                .andWhere("orders.orderStatus NOT IN (:...statuses)", { statuses: [OrderStatus.CANCELLED, OrderStatus.ORDERSAVED] })

            if (role === UserRole.RSM) {
                preSalesQueryBuilder.andWhere("orders.storeId IN (:...storeIds)", { storeIds: storeIds });
            }
            let preSales = await preSalesQueryBuilder.getRawOne();

            // ===============================================================================================

            const currTargetQueryBuilder = this.getTargetRepository.createQueryBuilder('target')
                .select([
                    'target'
                ])
            if (role === UserRole.RSM) {
                currTargetQueryBuilder.where("target.empId IN (:...empIds)", { empIds })
            }
            currTargetQueryBuilder.andWhere('target.is_active = :isActive', { isActive: true })
                .andWhere('target.createdAt >= :startDate', { startDate: startTimeline })
                .andWhere('target.createdAt <= :endDate', { endDate: endTimeline });


            const currTarget = await currTargetQueryBuilder.groupBy("target.targetId").getMany();
            const targets = currTarget.map((data: any) => data.target);

            const allTargets = targets.flat(); // Assuming targets is an array of arrays
            const totalStoreTarget = allTargets.reduce((acc: number, item: any) => acc + Number(item?.storeTarget || 0), 0);
            const totalCollectionTarget = allTargets.reduce((acc: number, item: any) => acc + Number(item?.collectionTarget || 0), 0);
            const totalOrderTarget = allTargets.reduce((acc: number, item: any) => acc + Number(item?.orderTarget || 0), 0);
            // console.log({empIds, role, totalStoreTarget, totalCollectionTarget, totalOrderTarget });

            const response = {
                unBilledStore,
                PendingApprovalStores,
                topPerformer,
                bottomPerformer,
                topSKU,
                sku: {
                    topSKU: topSKU ?? [],
                    bottomSKU: bottomSKU ?? []
                },
                sales: {
                    currSales: currSales ? +currSales.totalOrderAmount : 0,
                    preSales: preSales ? +preSales.totalOrderAmount : 0
                },
                collection: {
                    currCollection: currSales ? +currSales.totalCollectedAmount : 0,
                    preCollection: preSales ? +preSales.totalCollectedAmount : 0
                },
                orderCount: {
                    currOrderCount: currOrderCount ?? 0,
                    preOrderCount: preOrderCount ?? 0
                },
                storeCount: {
                    currStoreCount: currStoreCount ?? 0,
                    preStoreCount: preStoreCount ?? 0
                },
                storeTarget: {
                    currStoreTarget: totalStoreTarget ? +totalStoreTarget : 0,
                },
                salesTarget: {
                    currSalesTarget: totalOrderTarget ? +totalOrderTarget : 0,
                },
                collectionTarget: {
                    currCollectionTarget: totalCollectionTarget ? +totalCollectionTarget : 0,
                },
            }
            return { message: "Success.", status: STATUSCODES.SUCCESS, data: response }
        } catch (error) {
            throw error;
        }
    }

    async revenueChart(payload: IUser): Promise<IApiResponse> {
        const { emp_id, role } = payload;
        try {
            const queries: any = [];
            const currentDate = new Date();
            const userLists: IUser[] | null = await this.getUserRepositry.find({ where: { managerId: emp_id } });
            const empIds = userLists.map((data: any) => data.emp_id);
            for (let i = 1; i < 8; i++) {
                const dayStart = new Date(currentDate);
                dayStart.setDate(currentDate.getDate() - i);
                dayStart.setUTCHours(0, 0, 0, 0);
                const dayEnd = new Date(dayStart);
                dayEnd.setUTCHours(23, 59, 59, 999);
                const previousDayStart = new Date(dayStart);
                previousDayStart.setDate(dayStart.getDate() - 7);
                previousDayStart.setUTCHours(0, 0, 0, 0);
                const previousDayEnd = new Date(dayEnd);
                previousDayEnd.setDate(dayEnd.getDate() - 7);
                previousDayEnd.setUTCHours(23, 59, 59, 999);

                // Create concurrent queries for current week and last week
                let fitlerQuery: any = [];
                const storesIds: any = await this.beatRespositry.createQueryBuilder("beat")
                    .where("beat.empId = :empId", { empId: emp_id })
                    .select("beat.store")
                    .getMany();
                    console.log({storesIds})
                if (storesIds.length > 0) {
                    fitlerQuery = storesIds;
                }
                const storeIds = fitlerQuery.map((beat: any) => beat.store).flat();

                let currentQueryBuilder = await this.getOrderRepositry.createQueryBuilder("orders")
                    .select("SUM(orders.orderAmount)", "totalAmount")
                    .where("orders.createdAt BETWEEN :dayStart AND :dayEnd", { dayStart: dayStart.toISOString(), dayEnd: dayEnd.toISOString() })
                    .andWhere("orders.orderStatus NOT IN (:...statuses)", { statuses: [OrderStatus.CANCELLED, OrderStatus.ORDERSAVED] })

                if (role === UserRole.RSM) {
                    currentQueryBuilder = currentQueryBuilder.andWhere("orders.storeId IN (:...storeIds)", { storeIds: storeIds });
                }
                queries.push(
                    await currentQueryBuilder.getRawOne()
                        .then(dailyAmount => ({
                            date: dayStart.toISOString().split('T')[0],  // Format as YYYY-MM-DD
                            totalAmount: dailyAmount.totalAmount || 0
                        }))
                );

                let lastQueryBuilder = await this.getOrderRepositry.createQueryBuilder("orders")
                    .select("SUM(orders.orderAmount)", "totalAmount")
                    .where("orders.createdAt BETWEEN :previousDayStart AND :previousDayEnd", { previousDayStart: previousDayStart.toISOString(), previousDayEnd: previousDayEnd.toISOString() })
                    .andWhere("orders.orderStatus NOT IN (:...statuses)", { statuses: [OrderStatus.CANCELLED, OrderStatus.ORDERSAVED] })

                if (role === UserRole.RSM) {
                    lastQueryBuilder = lastQueryBuilder.andWhere("orders.storeId IN (:...storeIds)", { storeIds: storeIds });
                }
                queries.push(
                    await lastQueryBuilder.getRawOne()
                        .then(dailyAmount => ({
                            date: dayStart.toISOString().split('T')[0],  // Format as YYYY-MM-DD
                            totalAmount: dailyAmount.totalAmount || 0
                        }))
                );
            }
            const results = await Promise.all(queries);

            const RevenueCurrentWeekResults = results.filter((_, index) => index % 2 === 0);
            const RevenueLastWeekResults = results.filter((_, index) => index % 2 !== 0);
            return { message: "Success.", status: STATUSCODES.SUCCESS, data: { RevenueCurrentWeekResults, RevenueLastWeekResults } }
        } catch (error) {
            throw error;
        }
    }

    async updateApprovalStore(payload: IUser, input: UpdateApprovalStore): Promise<IApiResponse> {
        try {
            const { emp_id } = payload;
            const { specialDiscountStatus, orderId, specialDiscountComment } = input;
            await this.getOrderRepositry.createQueryBuilder().update({ specialDiscountStatus, specialDiscountComment }).where({ orderId }).execute();
            const order: IOrders | null = await OrdersRepository().findOne({ where: { orderId } });
            if (!order) {
                return { message: "Order Not Found.", status: STATUSCODES.NOT_FOUND };
            }
            let specialDiscount: number = 0;
            if (order!.specialDiscountStatus === SpecialDiscountStatus.APPROVED) {
                specialDiscount = order!.netAmount * Number(order!.specialDiscountValue) / 100;
                await OrdersRepository().update(orderId, { specialDiscountAmount: specialDiscount, totalDiscountAmount: Number(order!.totalDiscountAmount) + specialDiscount, netAmount: Number((order!.netAmount - specialDiscount).toFixed(2)) });
            }
            return { message: "Updated.", status: STATUSCODES.SUCCESS }
        } catch (error) {
            throw error;
        }
    }

    async homeTodayAchievement(payload: IUser): Promise<IApiResponse> {
        try {
            const { emp_id } = payload;
            const d = Between(startOfDay(new Date()), endOfDay(new Date()))
            const today = new Date();
            const currentYear = today.getUTCFullYear();
            const monthIndex = today.getUTCMonth(); // 0-based index (January = 0, December = 11)
            const dayIndex = today.getUTCDate();

            const startTimeline = new Date(Date.UTC(currentYear, monthIndex, dayIndex)).toISOString();
            const endTimeline = new Date(Date.UTC(currentYear, monthIndex, dayIndex, 23, 59, 59, 999)).toISOString();

            // const plannedStores = await this.getVisitRepository.count({
            //     where: {
            //         visitDate: Between(startOfDay(new Date()), endOfDay(new Date())),
            //         empId: emp_id
            //     }
            // })
            const plannedStores = await this.getVisitRepository
                .createQueryBuilder('visits')
                .where('visits.visitDate BETWEEN :startTimeline AND :endTimeline', { startTimeline, endTimeline })
                .andWhere('visits.empId = :empId', { empId: emp_id })
                .getCount();
            const visitedStores = await this.getVisitRepository.createQueryBuilder('visits')
                .where('visits.status = :status', { status: VisitStatus.COMPLETE })
                .andWhere('visits.visitDate BETWEEN :startTimeline AND :endTimeline', { startTimeline, endTimeline })
                .andWhere('visits.empId = :empId', { empId: emp_id })
                .getCount();

            const newStores = await this.getStoreRepositry
                .createQueryBuilder('stores')
                .where('stores.createdAt BETWEEN :startTimeline AND :endTimeline', { startTimeline, endTimeline })
                .andWhere('stores.empId = :empId', { empId: emp_id })
                .getCount();
            // const totalOrder = await this.getOrderRepositry.count({
            //     where: {
            //         createdAt: Between(startOfDay(new Date()), endOfDay(new Date())),
            //         empId: emp_id
            //     }
            // })
            const totalOrder = await this.getOrderRepositry
                .createQueryBuilder('orders')
                .where('orders.createdAt BETWEEN :startTimeline AND :endTimeline', { startTimeline, endTimeline })
                .andWhere('orders.empId = :empId', { empId: emp_id })
                .andWhere("orders.orderStatus NOT IN (:...statuses)", { statuses: [OrderStatus.CANCELLED, OrderStatus.ORDERSAVED] })
                .getCount();
            const visitOrder = await this.getOrderRepositry
                .createQueryBuilder('orders')
                .where('orders.isCallType = :callType', { callType: CallType.PHYSICAL })
                .andWhere('orders.createdAt BETWEEN :startTimeline AND :endTimeline', { startTimeline, endTimeline })
                .andWhere('orders.empId = :empId', { empId: emp_id })
                .andWhere("orders.orderStatus NOT IN (:...statuses)", { statuses: [OrderStatus.CANCELLED, OrderStatus.ORDERSAVED] })
                .getCount();

            const phoneOrder = await this.getOrderRepositry
                .createQueryBuilder('orders')
                .where('orders.isCallType = :callType', { callType: CallType.TELEVISIT })
                .andWhere('orders.createdAt BETWEEN :startTimeline AND :endTimeline', { startTimeline, endTimeline })
                .andWhere('orders.empId = :empId', { empId: emp_id })
                .andWhere("orders.orderStatus NOT IN (:...statuses)", { statuses: [OrderStatus.CANCELLED, OrderStatus.ORDERSAVED] })
                .getCount()
            const data = {
                plannedStores: +plannedStores,
                visitedStores: +visitedStores,
                newStores: +newStores,
                totalOrder: +totalOrder,
                visitOrder: +visitOrder,
                phoneOrder: +phoneOrder
            }
            return { message: "Success.", status: STATUSCODES.SUCCESS, data: data }
        } catch (error) {
            throw error;
        }
    }

    async homeTodayOrderValue(payload: IUser): Promise<IApiResponse> {
        try {
            const { emp_id } = payload;
            const today = new Date();
            const currentYear = today.getUTCFullYear();
            const monthIndex = today.getUTCMonth(); // 0-based index (January = 0, December = 11)
            const dayIndex = today.getUTCDate();

            const startTimeline = new Date(Date.UTC(currentYear, monthIndex, dayIndex)).toISOString();
            const endTimeline = new Date(Date.UTC(currentYear, monthIndex, dayIndex, 23, 59, 59, 999)).toISOString();
            let order = await this.getOrderRepositry
                .createQueryBuilder("orders")
                .select("orders.empId", "empId")
                .addSelect("COALESCE(SUM(orders.orderAmount), 0)", "totalAmount") // Use COALESCE to return 0 if NULL
                .where("orders.empId = :empId", { empId: emp_id })
                .andWhere("orders.orderStatus NOT IN (:...statuses)", { statuses: [OrderStatus.CANCELLED, OrderStatus.ORDERSAVED] })

            if (startTimeline && endTimeline) {
                order.andWhere("orders.createdAt BETWEEN :startTimeline AND :endTimeline", { startTimeline, endTimeline });
            }
            const totalOrder = await order.groupBy("orders.empId")
                .getRawOne();


            // Build the query using QueryBuilder
            let vOrder = this.getOrderRepositry
                .createQueryBuilder("orders")
                .select("orders.empId", "empId")
                .addSelect("COALESCE(SUM(orders.orderAmount), 0)", "totalAmount")
                .where("orders.empId = :empId", { empId: emp_id })
                .andWhere("orders.isCallType = :isCallType", { isCallType: CallType.PHYSICAL })
                .andWhere("orders.orderStatus NOT IN (:...statuses)", { statuses: [OrderStatus.CANCELLED, OrderStatus.ORDERSAVED] })

            // Add a date range filter if both startTimeline and endTimeline are provided
            if (startTimeline && endTimeline) {
                vOrder.andWhere("orders.createdAt BETWEEN :startTimeline AND :endTimeline", { startTimeline, endTimeline });
            }

            // Execute the query and group by empId
            const visitOrder = await vOrder
                .groupBy("orders.empId")
                .getRawOne();

            let pOrder = this.getOrderRepositry
                .createQueryBuilder("orders")
                .select("orders.empId", "empId")
                .addSelect("COALESCE(SUM(orders.orderAmount), 0)", "totalAmount") // Set to 0 if no data is found
                .where("orders.empId = :empId", { empId: emp_id })
                .andWhere("orders.isCallType = :isCallType", { isCallType: CallType.TELEVISIT })
                .andWhere("orders.orderStatus != :orderStatus", { orderStatus: OrderStatus.CANCELLED });
            if (startTimeline && endTimeline) {
                pOrder.andWhere("orders.createdAt BETWEEN :startTimeline AND :endTimeline", { startTimeline, endTimeline });
            }

            const phoneOrder = await pOrder
                .groupBy("orders.empId")
                .getRawOne();

            const data = {
                totalOrder: totalOrder?.totalAmount ?? 0,
                visitOrder: visitOrder?.totalAmount ?? 0,
                phoneOrder: phoneOrder?.totalAmount ?? 0
            }

            return { message: "Success.", status: STATUSCODES.SUCCESS, data: data }
        } catch (error) {
            throw error;
        }
    }

    async homeCurrentMonthAchievement(payload: IUser): Promise<IApiResponse> {
        try {
            const { emp_id } = payload;
            const today = new Date();
            const currentYear = today.getFullYear();
            // const monthNames = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"];
            const monthIndex = today.getMonth();
            let startTimeline = new Date(Date.UTC(currentYear, monthIndex, 1)).toISOString();
            let endTimeline = new Date(Date.UTC(currentYear, monthIndex + 1, 0, 23, 59, 59, 999)).toISOString();

            const currTargetQueryBuilder = this.getTargetRepository.createQueryBuilder('target')
                .select([
                    'target'
                ])
                .where('target.empId = :empId', { empId: emp_id })
                .andWhere('target.is_active = :isActive', { isActive: true })
            // .andWhere('target.createdAt >= :startDate', { startDate: startTimeline })
            // .andWhere('target.createdAt <= :endDate', { endDate: endTimeline });


            const currTarget = await currTargetQueryBuilder.getMany();
            const targets = currTarget.map((data: any) => data.target);

            const allTargets = targets.flat(); // Assuming targets is an array of arrays
            const totalStoreTarget = allTargets.reduce((acc: number, item: any) => acc + Number(item?.storeTarget || 0), 0);
            const totalCollectionTarget = allTargets.reduce((acc: number, item: any) => acc + Number(item?.collectionTarget || 0), 0);
            const totalOrderTarget = allTargets.reduce((acc: number, item: any) => acc + Number(item?.orderTarget || 0), 0);

            const ordersQueryBuilder = this.getOrderRepositry.createQueryBuilder("orders")
                .select("orders.empId", "empId")
                .addSelect("SUM(orders.orderAmount)", "totalAmount")
                .addSelect("SUM(orders.collectedAmount)", "totalCollectedAmount")
                .where("orders.empId = :empId", { empId: emp_id })
                .andWhere("orders.orderStatus NOT IN (:...statuses)", { statuses: [OrderStatus.CANCELLED, OrderStatus.ORDERSAVED] })
                .groupBy("orders.empId")

            // Conditionally add date range filter for orders
            if (startTimeline && endTimeline) {
                ordersQueryBuilder.andWhere('orders.createdAt >= :startDate', { startDate: startTimeline })
                    .andWhere('orders.createdAt <= :endDate', { endDate: endTimeline });
            }
            const orders = await ordersQueryBuilder.getRawOne();

            const storesQueryBuilder = this.getStoreRepositry.createQueryBuilder('stores')
                .select("stores.empId", "empId")
                .addSelect("COUNT(stores.storeId)", "totalStoreCount")
                .where("stores.empId = :empId", { empId: emp_id })
                .groupBy("stores.empId");

            if (startTimeline && endTimeline) {
                storesQueryBuilder.andWhere('stores.createdAt >= :startDate', { startDate: startTimeline })
                    .andWhere('stores.createdAt <= :endDate', { endDate: endTimeline });
            }
            const stores = await storesQueryBuilder.getRawOne();
            const response = {
                valueTarget: {
                    target: totalOrderTarget ? +totalOrderTarget : 0,
                    achieved: orders ? +orders.totalAmount : 0
                },
                storeTarget: {
                    target: totalStoreTarget ? +totalStoreTarget : 0,
                    achieved: stores ? +stores.totalStoreCount : 0
                },
                collectionTarget: {
                    target: totalCollectionTarget ? +totalCollectionTarget : 0,
                    achieved: orders ? +orders.totalCollectedAmount : 0
                },
            }
            return { message: "Success...", status: STATUSCODES.SUCCESS, data: response }
        } catch (error) {
            throw error;
        }
    }
}

export { ProfileController as profileService }

