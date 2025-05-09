import { Request, Response } from "express";
import { IApiResponse } from "../../../../core/types/Constent/commonService";
import { Holiday, HolidayRepository } from "../../../../core/DB/Entities/holidays.entity";
import { STATUSCODES } from "../../../../core/types/Constent/common";
import { HolidayC, HolidayR, HolidayU, HolidayD, IHoliday } from "../../../../core/types/HolidayService/HolidayService";
import { Between, IsNull, Not } from "typeorm";
import { IUser } from "../../../../core/types/AuthService/AuthService";
import { UserRepository } from "../../../../core/DB/Entities/User.entity";

class HolidayService {
    private holidayRepository = HolidayRepository();
    private userRespositry = UserRepository();

    constructor() { }

    async createHoliday(input: HolidayC, payload: IUser): Promise<IApiResponse> {
        try {
            const { emp_id } = payload; // Use the correct property name from IUser
            const user = await this.userRespositry.findOne({ where: { emp_id } });
            if (!user) {
                return { status: STATUSCODES.NOT_FOUND, message: "User Not Found." };
            }

            const newHoliday = this.holidayRepository.create(input); // Use create instead of save
            await this.holidayRepository.save(newHoliday);

            return { status: STATUSCODES.SUCCESS, message: "Holiday created successfully.", data: newHoliday };
        } catch (error) {
            throw error;
        }
    }

    async getHolidays(input: HolidayR, payload: IUser): Promise<IApiResponse> {
        try {
            const holidays = await this.holidayRepository.find({
                order: { date: "ASC" }
            });
            return { status: STATUSCODES.SUCCESS, message: "Holidays retrieved successfully.", data: holidays };
        } catch (error) {
            throw error;
        }
    }

    async editHoliday(input: HolidayU, payload: IUser): Promise<IApiResponse> {
        try {
            if (input.holidayId) {
                const existingHoliday = await this.holidayRepository.findOne({
                    where: { holidayId: input.holidayId },
                });
                if (!existingHoliday) {
                    return { status: STATUSCODES.CONFLICT, message: "Holiday does not exist." };
                }
                await this.holidayRepository.update({ holidayId: input.holidayId }, input);
            }
            return { status: STATUSCODES.SUCCESS, message: "Holiday updated successfully." };
        } catch (error) {
            console.error(error);
            throw new Error("Something went wrong");
        }
    }

    async deleteHoliday(input: HolidayD, payload: IUser): Promise<IApiResponse> {
        try {
            const holiday = await this.holidayRepository.findOne({
                where: { holidayId: input.holidayId },
            });

            if (!holiday) {
                return { status: STATUSCODES.NOT_FOUND, message: "Holiday does not exist." };
            }
            await this.holidayRepository.softDelete({ holidayId: input.holidayId });
            return { status: STATUSCODES.SUCCESS, message: "Holiday deleted successfully." };
        } catch (error) {
            console.error(error);
            throw new Error("Something went wrong");
        }
    }
}

export { HolidayService as Holiday };