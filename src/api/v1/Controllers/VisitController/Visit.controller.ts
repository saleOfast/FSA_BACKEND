import { IApiResponse } from "../../../../core/types/Constent/commonService";
import { VisitRepository, Visits } from "../../../../core/DB/Entities/Visit.entity";
import { IUser } from "../../../../core/types/AuthService/AuthService";
import { CheckInRequest, CheckOutRequest, CreateVisit, GetVisitById, IVisit, IVisitList, UpdateActivityById, UpdateImage, UpdateVisitByNoOrder, VisitListFilter } from "../../../../core/types/VisitService/VisitService";
import { CallType, DurationEnum, STATUSCODES, UserRole, VisitStatus } from "../../../../core/types/Constent/common";
import { endOfDay, startOfDay, subDays } from "date-fns";
import { Between, In } from "typeorm";
import { IStore } from "../../../../core/types/StoreService/StoreService";
import { StoreRepository } from "../../../../core/DB/Entities/stores.entity";
import { BeatRepository } from "../../../../core/DB/Entities/beat.entity";
import { IBeat } from "../../../../core/types/BeatService/Beat";
import { AttendanceRepository } from "../../../../core/DB/Entities/attendance.entity";
import { UserRepository } from "../../../../core/DB/Entities/User.entity";
import { StoreCategory } from "core/DB/Entities/storeCategory.entity";

class VisitController {
    private visitRepositry = VisitRepository();
    private storeRepositry = StoreRepository();
    private beatRepositry = BeatRepository();
    private attendance = AttendanceRepository();
    private userRepository = UserRepository();
    constructor() { }

    async createVisit(input: CreateVisit, payload: IUser): Promise<IApiResponse> {
        try {
            const { store, visitDate, beat, emp_id } = input;
            // const { emp_id } = payload;
            for (const id of store) {
                const newVisit = new Visits();
                newVisit.store = store;
                newVisit.storeId = id;
                newVisit.empId = emp_id;
                newVisit.visitDate = visitDate;
                newVisit.beat = beat;

                await this.visitRepositry.save(newVisit);
            }
            // const newVisit = new Visits();
            // newVisit.store = store;
            // newVisit.storeId = storeId;
            // newVisit.empId = emp_id;
            // newVisit.visitDate = visitDate;
            // newVisit.beat = beat;

            // await this.visitRepositry.save(newVisit);

            return { message: "Success.", status: STATUSCODES.SUCCESS }
        } catch (error) {
            throw error;
        }
    }

    async visitList(payload: IUser, input: VisitListFilter): Promise<IApiResponse> {
        try {
            const { emp_id, role } = payload;
            let { duration, beatId, pageNumber, pageSize, status } = input;
            duration = duration ? duration : DurationEnum.TODAY;

            let fitlerQuery: any = {};

            if (role === UserRole.RSM) {
                const visitIds: any = await this.visitRepositry.createQueryBuilder("visits")
                    .leftJoin("visits.user", "user")
                    .where("user.managerId = :managerId", { managerId: emp_id })
                    .select("visits.visitId")
                    .getMany()
                    .then((visits: IVisit[]) => visits.map(visit => visit.visitId));

                if (visitIds.length > 0) {
                    fitlerQuery.visitId = In(visitIds);
                } else {
                    return { message: "No visitIds found for admin user.", status: STATUSCODES.NOT_FOUND };
                }
            } else if (role === UserRole.SSM || role === UserRole.RETAILER) {
                fitlerQuery = {
                    empId: emp_id
                };
            }


            if (duration == DurationEnum.WEEK) {
                const today = new Date();
                const sevenDaysAgo = subDays(today, 6);
                const startDate = startOfDay(sevenDaysAgo);
                const endDate = endOfDay(today);
                fitlerQuery.visitDate = Between(startDate, endDate)

            } else if (duration == DurationEnum.TODAY) {
                const startDate = startOfDay(new Date());
                const endDate = endOfDay(new Date());
                fitlerQuery.visitDate = Between(startDate, endDate)
            }

            if (beatId) {
                fitlerQuery.beat = +beatId;
            }
            if (status) {
                fitlerQuery.status = VisitStatus.COMPLETE
            }
            const visits: [IVisit[], number] | null = await this.visitRepositry.findAndCount({
                where: fitlerQuery,
                order: {
                    status: 'ASC',
                    createdAt: 'DESC'
                },
                skip: (+pageNumber - 1) * +pageSize,
                take: +pageSize
            });
            if (!visits.length) {
                return { message: "Success.", status: STATUSCODES.SUCCESS, data: visits }
            }
            fitlerQuery.status = VisitStatus.COMPLETE
            const count: number | null = await this.visitRepositry.count({
                where: fitlerQuery,
            });

            let visitList: IVisitList[] = [];
            for (let visit of visits[0]) {
                const storeDetails: IStore | null = await this.storeRepositry.findOne({ where: { storeId: visit.storeId }, relations: ["storeCat"] });
                if (!storeDetails) {
                    return { message: `Store not find for vist: ${visit.visitId} and StoreId: ${visit.storeId}`, status: STATUSCODES.NOT_FOUND }
                }

                const beatDetails: IBeat | null = await this.beatRepositry.findOne({ where: { beatId: visit.beat } });
                // if (!beatDetails) {
                //     return { message: `Beat not find for vist: ${visit.visitId} and StoreId: ${visit.storeId}`, status: STATUSCODES.NOT_FOUND }
                // }

                let visitData: IVisitList = {
                    visitId: visit.visitId,
                    empId: visit.empId,
                    visitDate: visit.visitDate,
                    visitStatus: visit.status,
                    noOrderReason: visit.noOrderReason,
                    beatDetails: {
                        beatId: visit.beat ?? null,
                        beatName: beatDetails?.beatName ?? ""
                    },
                    storeDetails: storeDetails,
                    checkIn: visit.checkIn,
                    checkOut: visit.checkOut,
                    status: visit.status,
                    callType: visit.isCallType,
                }
                visitList.push(visitData);
            }

            const response = {
                visitList: visitList,
                pagination: {
                    pageNumber: +pageNumber,
                    pageSize: +pageSize,
                    totalRecords: visits.length > 0 ? visits[1] : 0,
                    completedVisitCount: count
                }
            }

            return { message: "Success.", status: STATUSCODES.SUCCESS, data: response }
        } catch (error) {
            throw error;
        }
    }

    async getVisitById(payload: IUser, input: GetVisitById): Promise<IApiResponse> {
        try {
            const { emp_id, role } = payload;
            const { visitId } = input;
            let fitlerQuery
            if (role === UserRole.SSM || role === UserRole.RETAILER) {
                fitlerQuery = {
                    empId: emp_id,
                    visitId: Number(visitId)
                }
            } else {
                fitlerQuery = {
                    visitId: Number(visitId)
                }
            }
            const visit: IVisit | null = await this.visitRepositry.findOne({ where: fitlerQuery });

            if (!visit) {
                return { message: "Not Found.", status: STATUSCODES.NOT_FOUND }
            }
            const storeDetails: IStore | null = await this.storeRepositry.findOne({ where: { storeId: visit.storeId }, relations: ["storeCat"] });
            if (!storeDetails) {
                return { message: `Store not find for vist: ${visit.visitId} and StoreId: ${visit.storeId}`, status: STATUSCODES.NOT_FOUND }
            }

            const beatDetails: IBeat | null = await this.beatRepositry.findOne({ where: { beatId: visit.beat } });
            if (!beatDetails) {
                return { message: `Beat not find for vist: ${visit.visitId} and StoreId: ${visit.storeId}`, status: STATUSCODES.NOT_FOUND }
            }

            let visitData: IVisitList = {
                visitId: visit.visitId,
                empId: visit.empId,
                visitDate: visit.visitDate,
                visitStatus: visit.status,
                beatDetails: {
                    beatId: visit.beat,
                    beatName: beatDetails.beatName
                },
                storeDetails: storeDetails,
                checkOut: visit.checkOut,
                checkIn: visit.checkIn,
                status: visit.status,
                callType: visit.isCallType,
                image: visit.image,
                noOrderReason: visit.noOrderReason
            }

            return { message: "Success.", status: STATUSCODES.SUCCESS, data: visitData }
        } catch (error) {
            throw error;
        }
    }


    async updateImage(payload: IUser, input: UpdateImage): Promise<IApiResponse> {
        try {
            const { image, visitId } = input;

            const visit = await this.visitRepositry.findOne({ where: { visitId } });

            if (!visit) {
                return { message: "Visit not found.", status: STATUSCODES.NOT_FOUND }
            }

            await this.visitRepositry.createQueryBuilder().update({ image }).where({ visitId }).execute();

            return { message: "Success.", status: STATUSCODES.SUCCESS }
        } catch (error) {
            throw error;
        }
    }

    async checkIn(payload: IUser, input: CheckInRequest): Promise<IApiResponse> {
        try {
            const { emp_id, role } = payload;
            const { visitId, checkIn, checkInLat, checkInLong, action } = input;

            const visit = await this.visitRepositry.findOne({ where: { visitId } });

            if (!visit) {
                return { message: "Visit not found.", status: STATUSCODES.NOT_FOUND }
            }

            // const attendance: any | undefined = await this.attendance
            //     .createQueryBuilder("attendance")
            //     .where("attendance.empId = :empId", { empId: emp_id })
            //     .orderBy("attendance.createdAt", "DESC")
            //     .take(1)
            //     .getOne();

            // if (!attendance && role === UserRole.SSM) {
            //     return { message: "Please mark you attendance.", status: STATUSCODES.BAD_REQUEST }
            // }

            // const checkInDate = attendance.checkIn;
            // const checkOutDate = attendance.checkOut;
            const newDate = new Date();

            // if (checkInDate.getDate() != newDate.getDate() && role === UserRole.SSM) {
            //     return { message: "Please mark you attendance.", status: STATUSCODES.CONFLICT }
            // }


            // if(checkOutDate?.getDate() === newDate.getDate() && role === UserRole.SSM) {
            //     return { message: "You can't access because you had already checked out.", status: STATUSCODES.CONFLICT }
            // }
            const activity: any = {
                action,
                time: checkIn,
                lat: checkInLat,
                long: checkInLong
            };
            // console.log({visit, activity})

            const updatedActivity: any[] = [...visit.activity || [], activity];

            await this.visitRepositry.createQueryBuilder()
                .update()
                .set({
                    checkIn,
                    checkInLat,
                    checkInLong,
                    activity: updatedActivity,
                    status: VisitStatus.COMPLETE,
                    //    visitStatus: VisitStatus.COMPLETE
                })
                .where({ visitId })
                .execute();

            return { message: "Success.dhfjfjd", status: STATUSCODES.SUCCESS }
        } catch (error) {
            throw error;
        }
    }

    async checkOut(payload: IUser, input: CheckOutRequest): Promise<IApiResponse> {
        try {
            const { emp_id } = payload;
            const { visitId, checkOut, checkOutLat, checkOutLong, image } = input;

            const visit: IVisit | null = await this.visitRepositry.findOne({ where: { visitId } });

            if (!visit) {
                return { message: "Visit not found.", status: STATUSCODES.NOT_FOUND }
            }

            const store: IStore | null = await this.storeRepositry.findOne({ where: { storeId: visit.storeId } });

            if (!store) {
                return { message: "Store Not Found.", status: STATUSCODES.NOT_FOUND }
            }

            const storeLatLong: { latitude: string, longitude: string } = {
                latitude: store.lat!,
                longitude: store.long!
            }

            const visitLatLong: { latitude: string, longitude: string } = {
                latitude: visit.checkInLat!,
                longitude: visit.checkInLong!
            }

            const distanse: number = this.haversineDistance(storeLatLong, visitLatLong);

            console.log(distanse, 'distanse==========');
            let callType: CallType = CallType.TELEVISIT;
            if (distanse < 100) {
                callType = CallType.PHYSICAL
            }

            await this.visitRepositry.createQueryBuilder().update({ checkOut, checkOutLat, checkOutLong, status: VisitStatus.COMPLETE, image, isCallType: callType }).where({ visitId, empId: emp_id }).execute();

            return { message: "Success.", status: STATUSCODES.SUCCESS }
        } catch (error) {
            throw error;
        }
    }

    haversineDistance(coords1: any, coords2: any): number {
        function toRad(x: number) {
            return x * Math.PI / 180;
        }

        var R = 6371e3; // Earth radius in meters
        var dLat = toRad(coords2.latitude - coords1.latitude);
        var dLon = toRad(coords2.longitude - coords1.longitude);
        var lat1 = toRad(coords1.latitude);
        var lat2 = toRad(coords2.latitude);

        var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return R * c;
    }

    async dayTrackingReport(payload: IUser, input: any): Promise<IApiResponse> {
        const { role, emp_id } = payload;
        const { timePeriod } = input;

        let startTimeline: any = null, endTimeline: any = null
        const today = new Date();
        startTimeline = new Date(timePeriod)
        startTimeline.setUTCHours(0, 0, 0, 0)

        endTimeline = new Date(timePeriod)
        endTimeline.setUTCHours(23, 59, 59, 999)

        // console.log({startTimeline, endTimeline, timePeriod})

        try {
            const userLists: IUser[] | null = await this.userRepository.find({ where: { managerId: emp_id } });
            const empIds = userLists.map((data: any) => data.emp_id);
            // const userLists: IUser[] | null = await this.usersRespositry.find({ select: ["emp_id"] });
            // let empIds = userLists.map((data: any) => data.emp_id);

            let queryBuilder = (await this.visitRepositry
                .createQueryBuilder('visits')
                .leftJoin("visits.user", "user")
                .select("user.firstname", "firstname")
                .addSelect("user.lastname", "lastname")
                .addSelect("visits.activity", "activity")
                .addSelect("user.emp_id", "empId")
                .where("visits.checkIn >= :startDate", { startDate: startTimeline.toISOString() })
                .andWhere("visits.checkIn <= :endDate", { endDate: endTimeline.toISOString() }));
            // .orderBy('visits.checkIn', 'ASC')
            // .getRawMany();
            // console.log(dayTracking)
            if (role === UserRole.RSM) {
                queryBuilder.andWhere("visits.empId IN (:...empIds)", { empIds })
            }
            if (role === UserRole.SSM || role === UserRole.RETAILER) {
                queryBuilder.andWhere("visits.empId = :empId", { empId: emp_id })
            }
            const dayTracking = await queryBuilder.orderBy('visits.checkIn', 'ASC')
                .getRawMany();
            return { status: STATUSCODES.SUCCESS, message: "Success.", data: dayTracking };
        } catch (error) {
            throw error;
        }
    }

    async updateOrderBySpecialDiscount(input: UpdateVisitByNoOrder): Promise<IApiResponse> {
        try {
            const { visitId, noOrderReason = '' } = input;
            const visit: IVisit | null = await VisitRepository().findOne({ where: { visitId } });
            if (!visit) {
                return { message: "Visit Not Found.", status: STATUSCODES.NOT_FOUND };
            }
            await VisitRepository().update(visitId, { noOrderReason });

            return { message: "Success.", status: STATUSCODES.SUCCESS };
        } catch (error) {
            throw error;
        }
    }

    async getPastNoOrder(payload: IUser, input: any): Promise<IApiResponse> {
        try {
            const { role, emp_id } = payload;
            const { empId, storeId } = input;
            let queryBuilder = (await this.visitRepositry.createQueryBuilder('visits')
                .select([
                    'visits.updated_at AS date',
                    'visits.noOrderReason AS reason',
                ])
                .where('visits.noOrderReason IS NOT NULL')
                .andWhere('visits.storeId =:storeId', { storeId: Number(storeId) })
                .andWhere('visits.empId =:empId', { empId: Number(empId) })
            );

            const pastNoOrder: any = await queryBuilder.getRawMany();

            return { message: "Success.", status: STATUSCODES.SUCCESS, data: pastNoOrder };
        } catch (error) {
            throw error;
        }
    }

    async getPictureByStoreId(payload: IUser, input: any): Promise<IApiResponse> {
        try {
            const { role, emp_id } = payload;
            const { storeId } = input;
            let queryBuilder = (await this.visitRepositry.createQueryBuilder('visits')
                .select([
                    'visits.image AS image',
                    'visits.updatedAt AS date',
                ])
                .where('visits.storeId =:storeId', { storeId: Number(storeId) })

            );

            const pictures: any = await queryBuilder.orderBy("visits.updatedAt", "DESC").getRawMany();

            return { message: "Success.", status: STATUSCODES.SUCCESS, data: pictures };
        } catch (error) {
            throw error;
        }
    }

    // async updateActivity(input: UpdateActivityById): Promise<IApiResponse> {
    //     try {
    //         const { visitId, action, lat, long, time } = input;
    //         const visit: IVisit | null = await VisitRepository().findOne({ where: { visitId } });

    //         if (!visit) {
    //             return { message: "Order Not Found.", status: STATUSCODES.NOT_FOUND };
    //         }

    //         // const previousStatus: OrderStatus = order.orderStatus;
    //         // await VisitRepository().update(visitId, { orderStatus });
    //         const activity: any = {
    //             action,
    //             time,
    //             lat,
    //             long
    //         };
    //         const updatedActivity: any[] = [...visit.activity, activity];
    //         await VisitRepository().update(visitId, { activity: updatedActivity });

    //         return { message: "Success.", status: STATUSCODES.SUCCESS };
    //     } catch (error) {
    //         throw error;
    //     }
    // }

    async createMultipleVisits(inputs: CreateVisit[], payload: IUser): Promise<IApiResponse> {
        try {
            const { emp_id } = payload;

            // Iterate over each visit input
            for (const input of inputs) {
                const { store, visitDate, beat, emp_id } = input;

                // Process each store in the input
                for (const id of store) {
                    const newVisit = new Visits();
                    newVisit.store = store;
                    newVisit.storeId = id;
                    newVisit.empId = emp_id;
                    newVisit.visitDate = visitDate;
                    newVisit.beat = beat;

                    // Save the new visit record to the database
                    await this.visitRepositry.save(newVisit);
                }
            }

            return { message: "All visits created successfully.", status: STATUSCODES.SUCCESS };
        }
        catch (error) {
            throw error;
        }
    }


    async visitReport(): Promise<IApiResponse> {
        try {
            const visits = await this.visitRepositry.find({
                relations: { stores: { storeCat: true }, user: true },
            });

            if (!visits || visits.length === 0) {
                return { message: "Not Found", status: STATUSCODES.NOT_FOUND };
            }

            const mrVisitMap = new Map<string, {
                name: string;
                doctor: number;
                chemist: number;
                stockist: number;
                total: number;
            }>();

            let grandDoctor = 0;
            let grandChemist = 0;
            let grandStockist = 0;
            let grandTotal = 0;

            for (const visit of visits) {
                const mrId = String(visit?.user?.emp_id);
                const mrName = visit?.user?.firstname + ' ' + visit?.user?.lastname;
                const categoryName = visit.stores?.storeCat?.categoryName?.toLowerCase() || '';

                if (!mrVisitMap.has(mrId)) {
                    mrVisitMap.set(mrId, {
                        name: mrName,
                        doctor: 0,
                        chemist: 0,
                        stockist: 0,
                        total: 0,
                    });
                }

                const mrData = mrVisitMap.get(mrId)!;

                if (categoryName.startsWith('doctor')) {
                    mrData.doctor += 1;
                    grandDoctor += 1;
                } else if (categoryName.startsWith('chemist')) {
                    mrData.chemist += 1;
                    grandChemist += 1;
                } else if (categoryName.startsWith('stockist')) {
                    mrData.stockist += 1;
                    grandStockist += 1;
                }

                mrData.total += 1;
                grandTotal += 1;
            }

            const data = Array.from(mrVisitMap.values());

            return {
                message: "Success.",
                status: STATUSCODES.SUCCESS,
                data: {
                    mrWise: data,
                    grandTotal: {
                        doctor: grandDoctor,
                        chemist: grandChemist,
                        stockist: grandStockist,
                        total: grandTotal,
                    },
                },
            };
        } catch (error) {
            throw error;
        }
    }

}

export { VisitController as VisitService }