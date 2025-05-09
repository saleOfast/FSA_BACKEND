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
exports.Holiday = void 0;
const holidays_entity_1 = require("../../../../core/DB/Entities/holidays.entity");
const common_1 = require("../../../../core/types/Constent/common");
const User_entity_1 = require("../../../../core/DB/Entities/User.entity");
class HolidayService {
    constructor() {
        this.holidayRepository = (0, holidays_entity_1.HolidayRepository)();
        this.userRespositry = (0, User_entity_1.UserRepository)();
    }
    createHoliday(input, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { emp_id } = payload; // Use the correct property name from IUser
                const user = yield this.userRespositry.findOne({ where: { emp_id } });
                if (!user) {
                    return { status: common_1.STATUSCODES.NOT_FOUND, message: "User Not Found." };
                }
                const newHoliday = this.holidayRepository.create(input); // Use create instead of save
                yield this.holidayRepository.save(newHoliday);
                return { status: common_1.STATUSCODES.SUCCESS, message: "Holiday created successfully.", data: newHoliday };
            }
            catch (error) {
                throw error;
            }
        });
    }
    getHolidays(input, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const holidays = yield this.holidayRepository.find({
                    order: { date: "ASC" }
                });
                return { status: common_1.STATUSCODES.SUCCESS, message: "Holidays retrieved successfully.", data: holidays };
            }
            catch (error) {
                throw error;
            }
        });
    }
    editHoliday(input, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (input.holidayId) {
                    const existingHoliday = yield this.holidayRepository.findOne({
                        where: { holidayId: input.holidayId },
                    });
                    if (!existingHoliday) {
                        return { status: common_1.STATUSCODES.CONFLICT, message: "Holiday does not exist." };
                    }
                    yield this.holidayRepository.update({ holidayId: input.holidayId }, input);
                }
                return { status: common_1.STATUSCODES.SUCCESS, message: "Holiday updated successfully." };
            }
            catch (error) {
                console.error(error);
                throw new Error("Something went wrong");
            }
        });
    }
    deleteHoliday(input, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const holiday = yield this.holidayRepository.findOne({
                    where: { holidayId: input.holidayId },
                });
                if (!holiday) {
                    return { status: common_1.STATUSCODES.NOT_FOUND, message: "Holiday does not exist." };
                }
                yield this.holidayRepository.softDelete({ holidayId: input.holidayId });
                return { status: common_1.STATUSCODES.SUCCESS, message: "Holiday deleted successfully." };
            }
            catch (error) {
                console.error(error);
                throw new Error("Something went wrong");
            }
        });
    }
}
exports.Holiday = HolidayService;
