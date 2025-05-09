import { format } from "date-fns";
import { AttendanceRepository } from "../../../core/DB/Entities/attendance.entity";
import { Equal, IsNull, Not } from "typeorm";
import { IAttendance } from "../../../core/types/AttendanceService/AttendanceService";
import { Attendance } from "../../../api/v1/Controllers/AttendanceController/Attendance.controller";

export class UpdateAttendanceCronService {
    private getAttendanceRepository = AttendanceRepository();

    constructor() { }


    async updateCheckOutTime() {
        try {
            const date = new Date();
            const formattedDate = format(date, 'yyyy-MM-dd HH:mm:ss.SSS');

            const attendance: IAttendance[] | null = await this.getAttendanceRepository
                .createQueryBuilder('Attendance')
                .where('Attendance.check_out IS NULL OR Attendance.check_out != :empty', { empty: null })
                .getMany();

            if (!attendance) {
                console.log("All Users Already checkout. Everything is goind fine.")
                throw new Error(`${this.constructor.name}: All Users Already checkout. Everything is goind fine.`)
            }

            let index = 1;
            for (let user of attendance) {
                console.log(index++)
                const attendanceService = new Attendance();
                const duration: string = attendanceService.getInterval(user.checkIn, new Date(formattedDate));
                await this.getAttendanceRepository.createQueryBuilder().update({ checkOut: new Date(formattedDate), duration }).where({ attendanceId: user.attendanceId }).execute();
            }
        } catch (error) {
            throw new Error(`${this.constructor.name}: When running cron.`)
        }
    }
}