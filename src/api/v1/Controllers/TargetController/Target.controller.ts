import { OrderStatus, STATUSCODES, TimelineEnum, UserRole } from "../../../../core/types/Constent/common";
import { IApiResponse } from "../../../../core/types/Constent/commonService";
import { IUser, TargetSummaryFilter } from "../../../../core/types/AuthService/AuthService";
import { CreateTarget, DeleteTarget, GetAllTarget, GetTarget, ITarget, UpdateTarget } from "../../../../core/types/TargetService/TargetService";
import { Target, TargetRepository } from "../../../../core/DB/Entities/target.entity";
import { UserRepository } from "../../../../core/DB/Entities/User.entity";
import { OrdersRepository } from "../../../../core/DB/Entities/orders.entity";
import { StoreRepository } from "../../../../core/DB/Entities/stores.entity";
class TargetController {
    private target = TargetRepository();
    private userRepositry = UserRepository();
    private getOrderRepositry = OrdersRepository();
    private getStoreRepositry = StoreRepository();
    constructor() { }

    // async add(input: CreateTarget, payload: IUser): Promise<IApiResponse> {
    //     try {
    //         const { storeTarget = 1, amountTarget = 1, month = "2024-04-01T00:00:00.000Z", year = "2024-04-01T00:00:00.000Z", target, SSMId } = input;
    //         const { emp_id } = payload;
    //         const targetData: ITarget | null = await this.target.findOne({ where: { empId: Number(SSMId) } })
    //         if (targetData) {
    //             return { message: "User target already exist", status: STATUSCODES.NOT_FOUND }
    //         }


    //         const newTarget = new Target();
    //         newTarget.amountTarget = amountTarget;
    //         newTarget.storeTarget = storeTarget;
    //         newTarget.amountTarget = amountTarget;
    //         newTarget.month = new Date(month);
    //         newTarget.year = new Date(year);
    //         newTarget.empId = SSMId;
    //         newTarget.target = target;
    //         newTarget.managerId = emp_id

    //         await this.target.save(newTarget);
    //         // await this.userRepositry.createQueryBuilder().update({storeTarget, valueTarget:amountTarget}).where({ emp_id }).execute();

    //         return { message: "Success.", status: STATUSCODES.SUCCESS }
    //     } catch (error) {
    //         throw error;
    //     }
    // }

    // async add(inputs: CreateTarget[], payload: IUser): Promise<IApiResponse> {
    //     try {
    //         const { emp_id } = payload;
    //         console.log({inputs})
    //         const targetsToInsert = inputs.map(input => {
    //             const { storeTarget=2, amountTarget=100, collectionTarget=100, month="2024-04-01T00:00:00.000Z", year="2024-04-01T00:00:00.000Z", SSMId, target } = input;
    //             const convertToISOString = (month: any, year: any): any => {
    //                 // Construct a date with the provided month and year
    //                 const date = new Date(`${month} ${year}`);
    //                 // Return the ISO string representation of the date
    //                 return date.toISOString();
    //             };

    //             const newTarget = new Target();
    //             newTarget.amountTarget = +amountTarget;
    //             newTarget.storeTarget = +storeTarget;
    //             newTarget.collectionTarget = +collectionTarget;
    //             newTarget.target = target;
    //             newTarget.month = convertToISOString(month as Date, year as Date);
    //             newTarget.year = convertToISOString(month as Date, year as Date);;
    //             newTarget.empId = SSMId;
    //             newTarget.managerId = emp_id
    //             return newTarget;
    //         });

    //         await Promise.all(targetsToInsert.map(target => this.target.save(target)));



    //         return { message: "Success.", status: STATUSCODES.SUCCESS }
    //     } catch (error) {
    //         throw error;
    //     }
    // }
    
    async list(payload: IUser, input: any): Promise<IApiResponse> {
        const { emp_id, role } = payload;
        // const currentYear = new Date().getFullYear();
        const today = new Date();
        let currentYear = today.getFullYear();
        currentYear = today.getMonth() < 3 ? currentYear - 1 : currentYear;
        const { timePeriod = [TimelineEnum.YEAR, currentYear] } = input;
        console.log({ timePeriod }, "????")

        let empIds: any = []
        if (role === UserRole.RSM) {
            const userLists: IUser[] | null = await this.userRepositry.find({ where: { managerId: emp_id } });
            empIds = userLists.map((data: any) => data.emp_id);
        }


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
        if (timePeriod[0] === TimelineEnum.YEAR && timePeriod[1]) {
            startTimeline = new Date(Date.UTC(timePeriod[1], 0, 1)).toISOString();
            endTimeline = new Date(Date.UTC(timePeriod[1], 11, 31, 23, 59, 59, 999)).toISOString();

        }
        else if (timePeriod[0] === TimelineEnum.QUARTER && timePeriod[1]) {
            const selectedQuarter: any = quarters[timePeriod[1].toUpperCase().replace("Q", "")];
            startTimeline = selectedQuarter.start
            endTimeline = selectedQuarter.end
        }
        const targetData: any[] = [];

        const formatDate = (date: any) => {
            const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            const month = months[date.getUTCMonth()];
            const year = date.getUTCFullYear().toString().slice(-2);  // Get last two digits of the year
            return `${month}-${year}`;
        };
        let formattedStart: any = null, formattedEnd: any = null
        if (timePeriod[0] === TimelineEnum.QUARTER) {
            const startDate = new Date(startTimeline);
            const endDate = new Date(endTimeline);

            formattedStart = formatDate(startDate);
            formattedEnd = formatDate(endDate);
        } else {
            if (timePeriod[0] === TimelineEnum.YEAR) {
                formattedStart = formatDate(new Date(Date.UTC(+timePeriod[1], 3, 1)));
                formattedEnd = formatDate(new Date(Date.UTC(+timePeriod[1] + 1, 2, 31, 23, 59, 59, 999)));

            } else {
                formattedStart = formatDate(new Date(Date.UTC(+currentYear, 3, 1)));
                formattedEnd = formatDate(new Date(Date.UTC(+currentYear + 1, 2, 31, 23, 59, 59, 999)));
            }
        }
        // console.log({ formattedStart, formattedEnd })
        try {
            let queryBuilder = this.target.createQueryBuilder('target')
                .where('target.isDeleted = :isDeleted', { isDeleted: false })

            if (timePeriod[0] === TimelineEnum.YEAR) {
                queryBuilder.andWhere("target.createdAt >= :startDate", { startDate: startTimeline })
                    .andWhere("target.createdAt <= :endDate", { endDate: endTimeline })
            }

            queryBuilder.orderBy('target.updatedAt', 'DESC')
                .addOrderBy('target.createdAt', 'DESC');

            if (role === UserRole.RSM) {
                queryBuilder = queryBuilder.andWhere('target.empId IN (:...empIds)', { empIds });
            }
            if (role === UserRole.RETAILER || role === UserRole.SSM) {
                queryBuilder = queryBuilder.andWhere('target.empId =:empId', { empId: emp_id });
            }


            const targetList: ITarget[] = await queryBuilder.getMany();
            for (const targetLists of targetList) {

                const orderTargetAchieved = await this.getOrderRepositry.createQueryBuilder("orders")
                    .select("orders.empId", "empId")
                    .addSelect("SUM(orders.orderAmount)", "totalAmount")
                    .addSelect("SUM(orders.collectedAmount)", "totalCollectedAmount")
                    .leftJoin("orders.user", "user")
                    .addSelect("user.valueTarget", "valueTarget")
                    .addSelect("user.firstname", "firstname")
                    .addSelect("user.lastname", "lastname")
                    .addSelect("user.storeTarget", "storeTarget")

                    .where("orders.empId = :empId", { empId: targetLists.empId })
                    .andWhere("orders.createdAt >= :startDate", { startDate: startTimeline })
                    .andWhere("orders.createdAt <= :endDate", { endDate: endTimeline })
                    .andWhere("orders.orderStatus NOT IN (:...statuses)", { statuses: [OrderStatus.CANCELLED, OrderStatus.ORDERSAVED] })
                    .groupBy("orders.empId")
                    .addGroupBy("user.firstname")
                    .addGroupBy("user.lastname")
                    .addGroupBy("user.valueTarget")
                    .addGroupBy("user.storeTarget")
                    .getRawOne();

                const storesTargetAchieved = await this.getStoreRepositry.createQueryBuilder('stores')
                    .select("stores.empId", "empId")
                    .addSelect("COALESCE(COUNT(stores.storeId), 0)", "totalStoreCount")
                    .where("stores.empId = :empId", { empId: targetLists.empId })
                    .andWhere("stores.createdAt >= :startDate", { startDate: startTimeline })
                    .andWhere("stores.createdAt <= :endDate", { endDate: endTimeline })
                    .groupBy("stores.empId")
                    .getRawOne();


                let targetUser: any;
                // if (!orderTargetAchieved && !storesTargetAchieved) {
                targetUser = await this.userRepositry.findOne({
                    select: ["firstname", "lastname"],
                    where: { emp_id: targetLists.empId },
                });
                // }

                targetData.push({
                    month: targetLists.month,
                    timeline: `${formattedStart} To ${formattedEnd}`,
                    target: {
                        targetId: targetLists.targetId,
                        empId: orderTargetAchieved?.empId ?? targetUser?.empId ?? targetLists.empId,
                        firstname: targetUser?.firstname ?? orderTargetAchieved?.firstname ?? '',
                        lastname: targetUser?.lastname ?? orderTargetAchieved?.lastname ?? '',
                        totalAmount: orderTargetAchieved?.totalAmount ?? 0,
                        totalCollectedAmount: orderTargetAchieved?.totalCollectedAmount ?? 0,
                        allTarget: targetLists?.target ?? [],
                    },
                    achievedStores: storesTargetAchieved ? +storesTargetAchieved.totalStoreCount : 0
                });
            }
            return { message: "Success.", status: STATUSCODES.SUCCESS, data: targetData };
        } catch (error) {
            throw error
        }
    }

    async getTargetById(payload: IUser, input: GetTarget): Promise<IApiResponse> {
        try {
            const { targetId } = input;

            const target: ITarget | null = await this.target.findOne({ where: { targetId: Number(targetId) } });

            if (!target) {
                return { message: "Not Found.", status: STATUSCODES.NOT_FOUND }
            }

            return { message: "Success.", status: STATUSCODES.SUCCESS, data: target }
        } catch (error) {
            throw error;
        }
    }


    async update(payload: IUser, input: UpdateTarget): Promise<IApiResponse> {
        try {
            const { storeTarget = 1, amountTarget = 100, collectionTarget = 100, targetId, SSMId, month = "july", year = 2024, target } = input;

            const convertToISOString = (month: any, year: any): any => {
                // Construct a date with the provided month and year
                const date = new Date(`${month} ${year}`);
                // Return the ISO string representation of the date
                return date.toISOString();
            };
            const months = convertToISOString(month as Date, year as Date);
            await this.target.createQueryBuilder().update({
                storeTarget: storeTarget,
                amountTarget: amountTarget,
                collectionTarget: Number(collectionTarget),
                empId: SSMId,
                month: months,
                target: target,
                year: months
            }).where({ targetId }).execute();

            return { message: "Updated.", status: STATUSCODES.SUCCESS }
        } catch (error) {
            throw error;
        }
    }

    async delete(payload: IUser, input: DeleteTarget): Promise<IApiResponse> {
        try {
            const { emp_id } = payload;
            const { targetId } = input;

            await this.target.createQueryBuilder().update({ isDeleted: true }).where({ targetId: targetId }).execute();
            return { message: "Deleted Successfully.", status: STATUSCODES.SUCCESS }
        } catch (error) {
            throw error;
        }
    }

    async getYearlyTargetById(payload: IUser, input: any): Promise<IApiResponse> {
        try {

            const { year, empId } = input;

            const startDateOfYear = new Date(Date.UTC(year, 0, 1)); // January 1st of the input year at 00:00:00.000 UTC
            const endDateOfYear = new Date(Date.UTC(year, 11, 31, 23, 59, 59, 999)); // December 31st of the input year at 23:59:59.999 UTC

            let storeTargetAchieved: any = {}, targets: any = {}, amountTargetAchieved: any = {}


            try {
                // Fetch order data
                amountTargetAchieved = await this.getOrderRepositry.createQueryBuilder("orders")
                    .select("COALESCE(SUM(orders.orderAmount), 0)", "totalAmount")
                    .leftJoin("orders.user", "user")
                    .where("orders.empId = :empId", { empId: Number(empId) })
                    .andWhere("orders.createdAt >= :startDate", { startDate: startDateOfYear })
                    .andWhere("orders.createdAt <= :endDate", { endDate: endDateOfYear })
                    .andWhere("orders.orderStatus NOT IN (:...statuses)", { statuses: [OrderStatus.CANCELLED, OrderStatus.ORDERSAVED] })
                    .groupBy("orders.empId")
                    .getRawOne() || { totalAmount: 0 };
            } catch (error) {
                console.error("Error fetching order data:", error);
                amountTargetAchieved = { totalAmount: 0 }; // Default value
            }

            try {
                // Fetch store target data
                storeTargetAchieved = await this.getStoreRepositry.createQueryBuilder('stores')
                    .select("COALESCE(COUNT(stores.storeId), 0)", "totalStoreCount")
                    .where("stores.empId = :empId", { empId: Number(empId) })
                    .andWhere("stores.createdAt >= :startDate", { startDate: startDateOfYear })
                    .andWhere("stores.createdAt <= :endDate", { endDate: endDateOfYear })
                    .groupBy("stores.empId")
                    .getRawOne() || { totalStoreCount: 0 };
            } catch (error) {
                console.error("Error fetching store target data:", error);
                storeTargetAchieved = { totalStoreCount: 0 }; // Default value
            }

            try {
                // Fetch target data for the specific target ID
                targets = await this.target.createQueryBuilder('target')
                    .select("COALESCE(SUM(target.amountTarget), 0)", "amountTarget")
                    .addSelect("COALESCE(SUM(target.storeTarget), 0)", "storeTarget")
                    .where("target.empId = :empId", { empId: Number(empId) })
                    .andWhere("target.createdAt >= :startDate", { startDate: startDateOfYear })
                    .andWhere("target.createdAt <= :endDate", { endDate: endDateOfYear })
                    .groupBy("target.empId")
                    .getRawOne() || { amountTarget: 0, storeTarget: 0 };
            } catch (error) {
                console.error("Error fetching target data:", error);
                targets = { amountTarget: 0, storeTarget: 0 }; // Default values
            }

            const amountData = (Number(amountTargetAchieved?.totalAmount) / Number(targets.amountTarget)) * 100;
            const storeData = (Number(storeTargetAchieved?.totalStoreCount) / Number(targets.storeTarget)) * 100;

            const targetData = {
                amountData: !isNaN(amountData) ? amountData?.toFixed(2) ?? "" : 0,
                storeData: !isNaN(storeData) ? storeData?.toFixed(2) ?? "" : 0,
                achievedAmount: amountTargetAchieved.totalAmount ?? 0,
                targetAmount: targets.amountTarget ?? 0,
                achievedStore: storeTargetAchieved.totalStoreCount ?? 0,
                targetStore: targets.storeTarget ?? 0
            };
            return { message: "Success.", status: STATUSCODES.SUCCESS, data: targetData };
        } catch (error) {
            throw error;
        }
    }

    async getAllTargetById(input: GetAllTarget): Promise<IApiResponse> {
        try {
            const { emp_id } = input;
            // const { targetId } = input;

            const target = await this.target.createQueryBuilder("target")
                .select('target.target', 'targetData')
                .addSelect('target.targetId', 'targetId')
                .addSelect('target.empId', 'empId')
                .where("target.emp_id = :emp_id", { emp_id })
                .getRawOne();
            return { message: "Success", status: STATUSCODES.SUCCESS, data: target }
        } catch (error) {
            throw error;
        }
    }
    
    // async getAllTargetById(input: GetAllTarget): Promise<IApiResponse> {
    //     try {
    //         const { emp_id, financialYear } = input;
    //         const startOfYear = moment(`${financialYear}-04-01`).startOf('day');
    //         const endOfYear = moment(`${parseInt(financialYear) + 1}-03-31`).endOf('day');

    //         const target = await this.target.createQueryBuilder("target")
    //             .select('target.target', 'targetData')
    //             .addSelect('target.targetId', 'targetId')
    //             .addSelect('target.empId', 'empId')
    //             .andWhere("target.createdAt >= :startDate", { startDate: startOfYear.toDate() })
    //             .andWhere("target.createdAt <= :endDate", { endDate: endOfYear.toDate() })
    //             .andWhere("target.emp_id = :emp_id", { emp_id })
    //             .getRawOne();

    //         const startMonth = 4;
    //         const monthsOfYear = Array.from({ length: 12 }, (_, i) => ({
    //             month: moment().month((startMonth + i - 1) % 12).format("MMM"),
    //             year: (i + startMonth - 1 < 12) ? financialYear : parseInt(financialYear) + 1,
    //             targetData: {}
    //         }));
    //         target.forEach(record => {
    //             const month = moment(record.createdAt).month()
    //             const monthIndex = (month - startMonth + 12) % 12;
    //             monthsOfYear[monthIndex].targetData = record;
    //         });
    //         return { message: "Success", status: STATUSCODES.SUCCESS, data: target }
    //     } catch (error) {
    //         throw error;
    //     }
    // }
}

export { TargetController as TargetService }