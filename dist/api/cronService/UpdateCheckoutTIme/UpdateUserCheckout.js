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
exports.UpdateAttendanceCronService = void 0;
const date_fns_1 = require("date-fns");
const attendance_entity_1 = require("../../../core/DB/Entities/attendance.entity");
const Attendance_controller_1 = require("../../../api/v1/Controllers/AttendanceController/Attendance.controller");
class UpdateAttendanceCronService {
    constructor() {
        this.getAttendanceRepository = (0, attendance_entity_1.AttendanceRepository)();
    }
    updateCheckOutTime() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const date = new Date();
                const formattedDate = (0, date_fns_1.format)(date, 'yyyy-MM-dd HH:mm:ss.SSS');
                const attendance = yield this.getAttendanceRepository
                    .createQueryBuilder('Attendance')
                    .where('Attendance.check_out IS NULL OR Attendance.check_out != :empty', { empty: null })
                    .getMany();
                if (!attendance) {
                    console.log("All Users Already checkout. Everything is goind fine.");
                    throw new Error(`${this.constructor.name}: All Users Already checkout. Everything is goind fine.`);
                }
                let index = 1;
                for (let user of attendance) {
                    console.log(index++);
                    const attendanceService = new Attendance_controller_1.Attendance();
                    const duration = attendanceService.getInterval(user.checkIn, new Date(formattedDate));
                    yield this.getAttendanceRepository.createQueryBuilder().update({ checkOut: new Date(formattedDate), duration }).where({ attendanceId: user.attendanceId }).execute();
                }
            }
            catch (error) {
                throw new Error(`${this.constructor.name}: When running cron.`);
            }
        });
    }
}
exports.UpdateAttendanceCronService = UpdateAttendanceCronService;
