import { OrderStatus, STATUSCODES, TimelineEnum, UserRole } from "../../../../core/types/Constent/common";
import { IApiResponse } from "../../../../core/types/Constent/commonService";
import { IUser, TargetSummaryFilter } from "../../../../core/types/AuthService/AuthService";
import { CreateTarget, DeleteTarget, GetAllTarget, GetTarget, ITarget, UpsertTarget } from "../../../../core/types/TargetService/TargetService";
import { NewTarget, TargetRepository } from "../../../../core/DB/Entities/new.target.entity";
import { UserRepository } from "../../../../core/DB/Entities/User.entity";
import { OrdersRepository } from "../../../../core/DB/Entities/orders.entity";
import { StoreRepository } from "../../../../core/DB/Entities/stores.entity";
import moment from "moment";
import { Between } from "typeorm";
class TargetController {
    private target = TargetRepository();
    private userRepositry = UserRepository();
    private getOrderRepositry = OrdersRepository();
    private getStoreRepositry = StoreRepository();
    constructor() { }

    async add(input: CreateTarget, payload: IUser): Promise<IApiResponse> {
        try {
            const { emp_id, month, year } = input;
            const monthDate = new Date(year, month - 1, 1);
            const yearDate = new Date(year, 0, 1);

            const targetData = await this.target.findOne({ where: { empId: Number(emp_id), month: new Date(monthDate), year: new Date(yearDate) } })
            if (targetData) {
                return { message: "User target already exist", status: STATUSCODES.NOT_FOUND }
            }
            await this.target.save({ ...input, date: monthDate });
            return { message: "Success.", status: STATUSCODES.SUCCESS }
        } catch (error) {
            throw error;
        }
    }

    async getTargetByEmpId(input: GetAllTarget): Promise<IApiResponse> {
        try {
            const { emp_id, year } = input;
            const parsedYear = parseInt(year, 10);
            const financialYear = !isNaN(parsedYear) ? parsedYear : new Date().getFullYear();

            const startOfYear = moment(`${financialYear}-04-01`).startOf('day').toDate();
            const endOfYear = moment(`${financialYear + 1}-03-31`).endOf('day').toDate();

            const Target = await this.target.find({ where: { empId: Number(emp_id), year: Between(startOfYear, endOfYear) } })

            const startMonth = 4;
            const monthsOfYear = Array.from({ length: 12 }, (_, i) => ({
                month: moment().month((startMonth + i - 1) % 12).format("MMM"),
                year: (i + startMonth - 1 < 12) ? financialYear : financialYear + 1,
                storeTarget: 0,
                amountTarget: 0,
                collectionTarget: 0,
            }));
            Target.forEach(record => {
                const month = moment(record.month).month()
                const monthIndex = (month - startMonth + 12) % 12;
                monthsOfYear[monthIndex].storeTarget = record.storeTarget;
                monthsOfYear[monthIndex].amountTarget = record.amountTarget;
                monthsOfYear[monthIndex].collectionTarget = record.collectionTarget;
            });
            return { message: "Success", status: STATUSCODES.SUCCESS, data: monthsOfYear }
        } catch (error) {
            throw error;
        }
    }

    async getTargetById(payload: IUser, input: GetTarget): Promise<IApiResponse> {
        try {
            const { targetId } = input;
            const target = await this.target.findOne({ where: { targetId: Number(targetId) } });
            if (!target) {
                return { message: "Not Found.", status: STATUSCODES.NOT_FOUND }
            }
            return { message: "Success.", status: STATUSCODES.SUCCESS, data: target }
        } catch (error) {
            throw error;
        }
    }

    async upsertTarget(payload: IUser, input: UpsertTarget): Promise<IApiResponse> {
        try {
            const { emp_id, month, year, amountTarget, storeTarget, collectionTarget } = input;
            const empId = Number(emp_id);
            const monthDate = new Date(year, month, 1);
            const yearDate = new Date(year, 0, 1);

            const existingTarget = await this.target.findOne({
                where: { empId: empId, month: monthDate, year: yearDate },
            });

            const currentDate = new Date();
            const inputDate = new Date(year, month);

            if (existingTarget) {
                // Update existing

                if (existingTarget.month != null && existingTarget.year != null) {
                    const currentDate = new Date();
                    const existingTargetYear = existingTarget.year.getFullYear();
                    const existingTargetMonth = existingTarget.month.getMonth();
                    const targetDate = new Date(existingTargetYear, existingTargetMonth); // JS months are 0-indexed
                    if (
                        targetDate.getFullYear() < currentDate.getFullYear() ||
                        (targetDate.getFullYear() === currentDate.getFullYear() && targetDate.getMonth() < currentDate.getMonth())
                    ) {
                        return { status: STATUSCODES.CONFLICT, message: "Cannot edit target of past date." };
                    }
                }

                if (
                    inputDate.getFullYear() < currentDate.getFullYear() ||
                    (inputDate.getFullYear() === currentDate.getFullYear() && inputDate.getMonth() < currentDate.getMonth())
                ) {
                    return { status: STATUSCODES.CONFLICT, message: "Cannot modify target of past date." };
                }

                await this.target.update({ empId: empId, month: monthDate, year: yearDate }, { storeTarget: storeTarget, amountTarget: amountTarget, collectionTarget: collectionTarget });
                return { message: "Target updated.", status: STATUSCODES.SUCCESS };
            } else {
                // Create new
                await this.target.save({ ...input, date: monthDate });
                return { message: "Target created.", status: STATUSCODES.SUCCESS };
            }
        } catch (error) {
            throw error;
        }
    }

    async delete(payload: IUser, input: any): Promise<IApiResponse> {
        try {
            const { targetId } = input;
            const existingTarget = await this.target.findOne({
                where: { targetId: targetId },
            });
            if (!existingTarget) {
                return { status: STATUSCODES.CONFLICT, message: "Target does not exist." };
            }
            await this.target.softDelete({ targetId: targetId });

            return { message: "Updated.", status: STATUSCODES.SUCCESS }
        } catch (error) {
            throw error;
        }
    }

    async getYearlyTargetByEmployee(input: GetAllTarget): Promise<IApiResponse> {
        try {
            const { emp_id, year } = input;
            const parsedYear = parseInt(year, 10);
            const financialYear = !isNaN(parsedYear) ? parsedYear : new Date().getFullYear();

            const startOfYear = moment(`${financialYear}-04-01`).startOf('day').toDate();
            const endOfYear = moment(`${financialYear + 1}-03-31`).endOf('day').toDate();

            const query = this.target.createQueryBuilder('target')
                .leftJoinAndSelect('target.user', 'user')
                .select('target.empId', 'empId')
                .addSelect('user.firstname', 'firstname')
                .addSelect('user.lastname', 'lastname')
                .addSelect(`CONCAT(user.firstname, ' ', user.lastname)`, 'name')
                .addSelect('COALESCE(SUM(target.storeTarget), 0)', 'totalStoreTarget')
                .addSelect('COALESCE(SUM(target.amountTarget), 0)', 'totalAmountTarget')
                .addSelect('COALESCE(SUM(target.collectionTarget), 0)', 'totalCollectionTarget')
                .where('target.month BETWEEN :start AND :end', { start: startOfYear, end: endOfYear })
                .groupBy('target.empId')
                .addGroupBy('user.firstname')
                .addGroupBy('user.lastname')
                .orderBy('user.firstname');

            if (emp_id) {
                query.andWhere('target.empId = :empId', { empId: emp_id });
            }
            const data = await query.getRawMany();
            return { message: "Success", status: STATUSCODES.SUCCESS, data: data, };
        } catch (error) {
            throw error;
        }
    }

    async getYearlyTargetById(input: any): Promise<IApiResponse> {
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
                const financialYear = year || new Date().getFullYear();

                const startOfYear = moment(`${financialYear}-04-01`).startOf('day').toDate();
                const endOfYear = moment(`${financialYear + 1}-03-31`).endOf('day').toDate();

                targets = this.target.createQueryBuilder('target')
                    .leftJoinAndSelect('target.user', 'user')
                    .select('target.empId', 'empId')
                    .addSelect('user.firstname', 'firstname')
                    .addSelect('user.lastname', 'lastname')
                    .addSelect(`CONCAT(user.firstname, ' ', user.lastname)`, 'name')
                    .addSelect('COALESCE(SUM(target.storeTarget), 0)', 'storeTarget')
                    .addSelect('COALESCE(SUM(target.amountTarget), 0)', 'amountTarget')
                    .addSelect('COALESCE(SUM(target.collectionTarget), 0)', 'totalCollectionTarget')
                    .where('target.month BETWEEN :start AND :end', { start: startOfYear, end: endOfYear })
                    .groupBy('target.empId')
                    .addGroupBy('user.firstname')
                    .addGroupBy('user.lastname')
                    .orderBy('user.firstname')
                    .getRawOne() || { amountTarget: 0, storeTarget: 0 };
                // targets = await this.target.createQueryBuilder('target')
                //     .select("COALESCE(SUM(target.amountTarget), 0)", "amountTarget")
                //     .addSelect("COALESCE(SUM(target.storeTarget), 0)", "storeTarget")
                //     .where("target.empId = :empId", { empId: Number(empId) })
                //     .andWhere("target.createdAt >= :startDate", { startDate: startDateOfYear })
                //     .andWhere("target.createdAt <= :endDate", { endDate: endDateOfYear })
                //     .groupBy("target.empId")
                //     .getRawOne() || { amountTarget: 0, storeTarget: 0 };
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

    async list(payload: IUser, input: any): Promise<IApiResponse> {

        const { year, roles } = input;
        const parsedYear = parseInt(year, 10);
        const financialYear = !isNaN(parsedYear) ? parsedYear : new Date().getFullYear();

        const startDate = moment(`${financialYear}-04-01`).startOf('day').toDate();
        const endDate = moment(`${financialYear + 1}-03-31`).endOf('day').toDate();

        const formatTimeline = (start: Date, end: Date) => {
            const format = (d: Date) => moment(d).format('MMM-YY');
            return `${format(start)} To ${format(end)}`;
        };

        const formattedTimeline = formatTimeline(startDate, endDate);
        let whereCondition: any = {};
        // Step 1: Fetch users with applicable roles
        if (roles && roles.length > 0) {
            whereCondition.role = roles;
        }

        const users = await this.userRepositry.find({ where: whereCondition });
        const resultData = [];

        for (const user of users) {
            const empId = user.emp_id;

            // Step 2: Fetch target totals for the user
            const targetStats = await this.target.createQueryBuilder('target')
                .select('COALESCE(SUM(target.storeTarget), 0)', 'storeTarget')
                .addSelect('COALESCE(SUM(target.amountTarget), 0)', 'amountTarget')
                .addSelect('COALESCE(SUM(target.collectionTarget), 0)', 'collectionTarget')
                .where('target.empId = :empId', { empId: empId })
                .andWhere('target.date BETWEEN :start AND :end', { start: startDate, end: endDate })
                .getRawOne();

            // Step 3: Aggregate order data
            const orderStats = await this.getOrderRepositry.createQueryBuilder("orders")
                .select("COALESCE(SUM(orders.orderAmount), 0)", "achievedAmount")
                .addSelect("COALESCE(SUM(orders.collectedAmount), 0)", "achievedCollection")
                .where("orders.empId = :empId", { empId: empId })
                .andWhere("orders.createdAt BETWEEN :start AND :end", { start: startDate, end: endDate })
                .andWhere("orders.orderStatus NOT IN (:...statuses)", {
                    statuses: [OrderStatus.CANCELLED, OrderStatus.ORDERSAVED]
                })
                .getRawOne();

            // Step 4: Count stores
            const storeStats = await this.getStoreRepositry.createQueryBuilder("stores")
                .select("stores.empId", "empId")
                .select("COUNT(stores.storeId)", "achievedStore")
                .where("stores.empId = :empId", { empId: empId })
                // .andWhere("stores.createdAt BETWEEN :start AND :end", { start: startDate, end: endDate })
                .getRawOne();

            resultData.push({
                empId: empId,
                firstname: user.firstname,
                lastname: user.lastname,
                role: user.role,
                timeline: formattedTimeline,
                storeTarget: +targetStats.storeTarget,
                amountTarget: +targetStats.amountTarget,
                collectionTarget: +targetStats.collectionTarget,
                achievedAmount: +orderStats.achievedAmount,
                achievedCollection: +orderStats.achievedCollection,
                achievedStore: +storeStats.achievedStore
            });
        }

        return { message: "Success", status: STATUSCODES.SUCCESS, data: resultData };
    }
}

export { TargetController as TargetService }