import { IApiResponse } from "../../../../core/types/Constent/commonService";
import { Attendance, AttendanceRepository } from "../../../../core/DB/Entities/attendance.entity";
import { STATUSCODES, TimelineEnum, UserRole } from "../../../../core/types/Constent/common";
import { GetAttendanceList, IAttendance, MarkAttendance } from "../../../../core/types/AttendanceService/AttendanceService";
import { IUser } from "../../../../core/types/AuthService/AuthService";
import { UserRepository } from "../../../../core/DB/Entities/User.entity";
import { endOfDay, endOfMonth, startOfDay, startOfMonth } from "date-fns";
import { Between, IsNull } from "typeorm";


class AttendanceService {
    private attendanceRepositry = AttendanceRepository();
    private userRespositry = UserRepository()

    constructor() { }

    // async markAttendance(input: MarkAttendance, payload: IUser): Promise<IApiResponse> {
    //     try {
    //         const { inTime, outTime } = input;
    //         const { emp_id } = payload;

    //         const user = await this.userRespositry.findOne({ where: { emp_id } });

    //         if (!user) {
    //             return { status: STATUSCODES.NOT_FOUND, message: "User Not Found." }
    //         }

    //         // let isAlreadyMarked: boolean = true;
    //         const todayStart = startOfDay(new Date());
    //         const todayEnd = endOfDay(new Date());
    //         const checkAttendance: IAttendance | null = await this.attendanceRepositry.findOne({ where: { empId: emp_id, createdAt: Between(todayStart, todayEnd) } });
    //         // if (!checkAttendance) {
    //         //     isAlreadyMarked = false
    //         // }

    //         // if (inTime && checkAttendance?.checkIn ) {
    //         //     return { message: "You Already Checked In.", status: STATUSCODES.CONFLICT }
    //         // }

    //         // if (outTime && checkAttendance?.checkOut && checkAttendance.checkIn) {
    //         //     return { message: "You Already Checked In and out. You can't mark attendance again for today", status: STATUSCODES.CONFLICT }
    //         // }

    //         if (inTime && !outTime) {
    //             const attendance = new Attendance();
    //             attendance.empId = emp_id;
    //             attendance.checkIn = inTime;
    //             attendance.duration = "0"
    //             await this.attendanceRepositry.save(attendance);
    //         } else if (outTime && !inTime) {
    //             if (!checkAttendance) {
    //                 throw new Error("Something Went Wrong.")
    //             }
    //             const duration: string = this.getInterval(checkAttendance.checkIn, outTime);
    //             await this.attendanceRepositry.createQueryBuilder().update({ checkOut: outTime, duration }).where({ attendanceId: checkAttendance?.attendanceId }).execute();

    //         } else {
    //             return { message: "Invalid Request.", status: STATUSCODES.BAD_REQUEST }
    //         }
    //         const data: { inTime?: Date, outTime?: Date } = {
    //             inTime: inTime ? inTime : checkAttendance?.checkIn,
    //             outTime: outTime
    //         }
    //         return { message: "Attendace Marked.", status: STATUSCODES.SUCCESS, data }
    //     } catch (error) {
    //         throw error;
    //     }
    // }
    async markAttendance(input: MarkAttendance, payload: IUser): Promise<IApiResponse> {
        try {
            const { inTime, outTime } = input;
            const { emp_id } = payload;
            const user = await this.userRespositry.findOne({ where: { emp_id } });
            if (!user) {
                return { status: STATUSCODES.NOT_FOUND, message: "User Not Found." };
            }
            let isAlreadyMarked: boolean = true;
            const todayStart = startOfDay(new Date());
            const todayEnd = endOfDay(new Date());
            const existingCheckOuts: IAttendance[] = await this.attendanceRepositry.find({
                where: { empId: emp_id, checkOut: IsNull(), createdAt: Between(todayStart, todayEnd) },
                order: {
                    createdAt: 'DESC'
                },
                take: 1
            });

            //   if (!checkAttendance) {
            //         isAlreadyMarked = false
            //     }

            // if (inTime && checkAttendance?.checkIn ) {
            //     return { message: "You Already Checked In.", status: STATUSCODES.CONFLICT }
            // }

            // if (outTime && checkAttendance?.checkOut && checkAttendance.checkIn) {
            //     return { message: "You Already Checked In and out. You can't mark attendance again for today", status: STATUSCODES.CONFLICT }
            // }
            if (inTime && existingCheckOuts.length > 0) {
                return { status: STATUSCODES.CONFLICT, message: "You Already Checked In." };
            }

            if (outTime && existingCheckOuts.length === 0) {
                return { status: STATUSCODES.BAD_REQUEST, message: "You Already Checked Out or No check-in found for the day." };
            }

            if (inTime && !outTime) {
                const attendance = new Attendance();
                attendance.empId = emp_id;
                attendance.checkIn = inTime;
                attendance.duration = "0";
                await this.attendanceRepositry.save(attendance);
            } else if (outTime && !inTime) {
                const lastCheckIn = existingCheckOuts[existingCheckOuts.length - 1];
                if (!lastCheckIn) {
                    throw new Error("Something Went Wrong.");
                }
                const duration: string = this.getInterval(lastCheckIn.checkIn, outTime);
                await this.attendanceRepositry.createQueryBuilder()
                    .update(Attendance)
                    .set({ checkOut: outTime, duration })
                    .where("attendanceId = :attendanceId", { attendanceId: lastCheckIn.attendanceId })
                    .execute();
            } else {
                return { status: STATUSCODES.BAD_REQUEST, message: "Invalid Request." };
            }

            const data: { inTime?: Date, outTime?: Date } = {
                inTime: inTime ? inTime : existingCheckOuts[existingCheckOuts.length - 1]?.checkIn,
                outTime: outTime
            };

            return { status: STATUSCODES.SUCCESS, message: "Attendance Marked.", data };
        } catch (error) {
            throw error;
        }
    }

    async attendanceList(payload: IUser, input: GetAttendanceList): Promise<IApiResponse> {
        try {
            const { empId } = input;
            const startDate = startOfMonth(new Date());
            const endDate = endOfMonth(new Date());

            const list: IAttendance[] | null = await this.attendanceRepositry.
                find({
                    where: {
                        empId: Number(empId),
                        createdAt: Between(startDate, endDate)
                    },
                    order: {
                        createdAt: "ASC"
                    }
                });

            return { status: STATUSCODES.SUCCESS, message: "Success.", data: list };
        } catch (error) {
            throw error;
        }
    }

    async attendanceReport(payload: IUser, input: any): Promise<IApiResponse> {
        const { role } = payload;
        const currentYr = new Date().getFullYear();
        // const today = new Date().getFullYear();
        let startTimeline: any = null, endTimeline: any = null
        const today = new Date();
        startTimeline = new Date(today)
        startTimeline.setUTCHours(0, 0, 0, 0)


        endTimeline = new Date(today)
        endTimeline.setUTCHours(23, 59, 59, 999)

        const { timePeriod = [TimelineEnum.YEAR, currentYr] } = input;
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


        if (timePeriod[0] === TimelineEnum.MONTH && timePeriod[1]) {
            const currentMonthIndex = today.getMonth();
           
            if (timePeriod[1] == '1') {
                startTimeline = new Date(Date.UTC(currentYr, +currentMonthIndex, 1)).toISOString();
                endTimeline = new Date(Date.UTC(currentYr, +currentMonthIndex + 1, 0, 23, 59, 59, 999)).toISOString();
            } else {
                if (currentMonthIndex == 0) {
                    startTimeline = new Date(Date.UTC(currentYr - 1, 11, 1)).toISOString();
                    endTimeline = new Date(Date.UTC(currentYr - 1, 12, 0, 23, 59, 59, 999)).toISOString();
                } else {
                    startTimeline = new Date(Date.UTC(currentYr, +currentMonthIndex - 1, 1)).toISOString();
                    endTimeline = new Date(Date.UTC(currentYr, +currentMonthIndex, 0, 23, 59, 59, 999)).toISOString();
                }
            }




        } else if (timePeriod[0] === TimelineEnum.WEEK && timePeriod[1]) {

            const getStartOfWeek = (date: Date): Date => {
                const start = new Date(date);
                const day = start.getDay(); // Get the current day (0 = Sunday, 1 = Monday, etc.)
                const diff = (day === 0 ? -6 : 1) - day; // Adjust to Monday
                start.setDate(start.getDate() + diff); // Set to the Monday of the current week
                start.setUTCHours(0, 0, 0, 0); // Reset time to midnight
                return start;
            };
            
            const getEndOfWeek = (date: Date): Date => {
                const end = new Date(date);
                const day = end.getDay(); // Get the current day
                const diff = (day === 0 ? 0 : 7 - day); // Adjust to Sunday
                end.setDate(end.getDate() + diff); // Set to the Sunday of the current week
                end.setUTCHours(23, 59, 59, 999); // Set to end of the day
                return end;
            };
            
            const today = new Date();
            const startOfCurrentWeek = getStartOfWeek(today);
            const endOfCurrentWeek = getEndOfWeek(today);

            // Calculate the start and end of the previous week
            const startOfPreviousWeek = new Date(startOfCurrentWeek);
            startOfPreviousWeek.setDate(startOfPreviousWeek.getDate() - 7);
            const endOfPreviousWeek = new Date(endOfCurrentWeek);
            endOfPreviousWeek.setDate(endOfPreviousWeek.getDate() - 7);
            if (timePeriod[1] === '1') {
                startTimeline = startOfCurrentWeek.toISOString();
                endTimeline = endOfCurrentWeek.toISOString();
            } else {
                startTimeline = startOfPreviousWeek.toISOString();
                endTimeline = endOfPreviousWeek.toISOString();
            }
        } else if (timePeriod[0] === TimelineEnum.QUARTER && timePeriod[1]) {
            const selectedQuarter: any = quarters[timePeriod[1].toUpperCase().replace("Q", "")];
            startTimeline = selectedQuarter.start
            endTimeline = selectedQuarter.end
        }
        try {

            const userLists: IUser[] | null = await this.userRespositry.find({ select: ["emp_id"] });
            let empIds = userLists.map((data: any) => data.emp_id);
           
            const attendance: IAttendance[] | null = await this.attendanceRepositry
            .createQueryBuilder('attendance')
            .leftJoin("attendance.user", "user")
            .select("user.firstname", "firstname")
            .addSelect("user.lastname", "lastname")
            .addSelect("attendance.checkIn", "checkIn")
            .addSelect("attendance.empId", "empId")
            .addSelect("attendance.checkOut", "checkOut")
            .addSelect("attendance.duration", "duration")
            .where('attendance.empId IN (:...empIds)', {empIds})
            .andWhere('(attendance.checkIn BETWEEN :startDate AND :endDate OR attendance.checkOut BETWEEN :startDate AND :endDate)')
            .setParameter('startDate', startTimeline)
            .setParameter('endDate', endTimeline)
            .orderBy('attendance.createdAt', 'DESC')
            .getRawMany();
            return { status: STATUSCODES.SUCCESS, message: "Success.", data: attendance };
        } catch (error) {
            throw error;
        }
    }

    getInterval(inTime: Date, outTime: Date): string {
        const start = new Date(inTime);
        const end = new Date(outTime);
        const timeDifferenceInMilliseconds = end.getTime() - start.getTime();
        // Calculate hours and minutes
        const hours = Math.floor(timeDifferenceInMilliseconds / (1000 * 60 * 60));
        const minutes = Math.floor((timeDifferenceInMilliseconds % (1000 * 60 * 60)) / (1000 * 60));
        return `${hours}:${minutes}`;
    }

    async todayInAndOutTIme(payload: IUser): Promise<IApiResponse> {
        try {
            const { emp_id } = payload;
            const startDate = startOfDay(new Date());
            const endDate = endOfDay(new Date());
            const attendance: IAttendance | null = await this.attendanceRepositry
                .createQueryBuilder('attendance')
                .where('attendance.empId = :empId', { empId: emp_id })
                .andWhere('(attendance.checkIn BETWEEN :startDate AND :endDate OR attendance.checkOut BETWEEN :startDate AND :endDate)')
                .setParameter('startDate', startDate)
                .setParameter('endDate', endDate)
                .orderBy('attendance.createdAt', 'DESC') // or orderBy('attendance.checkOut', 'DESC') depending on which one you want to prioritize
                .take(1)
                .getOne();

            const data: { inTime?: Date, outTime?: Date | null } = {
                inTime: attendance?.checkIn,
                outTime: attendance?.checkOut
            }
            return { status: STATUSCODES.SUCCESS, message: "Success.", data };
        } catch (error) {
            throw error;
        }
    }
}

export { AttendanceService as Attendance }