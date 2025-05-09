import { IApiResponse } from "../../../../core/types/Constent/commonService";
import { IUser } from "../../../../core/types/AuthService/AuthService";
import { LeaveHeadCountC, LeaveHeadCountD, LeaveHeadCountR, LeaveHeadCountU } from "../../../../core/types/LeaveService/LeaveCountService";
import { STATUSCODES } from "../../../../core/types/Constent/common";
// import { HeadLeaveCountRepository } from "../../../../core/DB/Entities/LeaveCount.entity";
import { HeadLeaveRepository } from "../../../../core/DB/Entities/Leave.entity";
import { HeadLeaveCountRepository } from "../../../../core/DB/Entities/LeaveCount.entity";

class LeaveCountController {
    private leaveCountRepository = HeadLeaveCountRepository();
    private leaveHeadRepository = HeadLeaveRepository();
    private formatDate(date: Date): string {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    }

    constructor() { }

    async createLeaveCount(input: LeaveHeadCountC, payload: IUser): Promise<IApiResponse> {
        try {
            const { headLeaveId, financialStart, financialEnd } = input;
            const leaveCountExists = await this.leaveCountRepository.findOne({
                where: {
                    headLeaveId: headLeaveId,
                    financialStart: financialStart,
                    financialEnd: financialEnd,
                }
            });

            if (leaveCountExists) {
                return { status: STATUSCODES.CONFLICT, message: "Leave Head Count Name Already Exists." };
            }

            const newLeaveCount = await this.leaveCountRepository.save(input);
            return { message: "Leave Head Count Saved Successfully", status: STATUSCODES.SUCCESS, data: newLeaveCount };
        } catch (error) {
            throw error;
        }
    }

   
    async getLeaveCount(input: LeaveHeadCountR, payload: IUser): Promise<IApiResponse> {
        try {
            const { headLeaveCntId } = input;
            let data;
            if (headLeaveCntId) {
                data = await this.leaveCountRepository.findOne({
                    where: { headLeaveCntId: Number(headLeaveCntId) }
                });
            } else {
                data = await this.leaveCountRepository.find();
            }

            return { message: "Success", status: STATUSCODES.SUCCESS, data: data };
        } catch (error) {
            throw error;
        }
    }

    async getLeaveHeadOfCurrentYear(input: any, payload: IUser): Promise<IApiResponse> {
        try {
            let { year, mode } = input;
            let currentYear = new Date().getFullYear();

            // Adjust the year if the current month is January to March
            let currentMonth = new Date().getMonth();
            if (currentMonth <= 2) {
                currentYear -= 1;
            }

            // Use a specific year if provided in the query
            if (year) {
                currentYear = parseInt(year);
            }

            // Calculate financial year dates
            const financialStart = new Date(currentYear, 3, 1);
            const financialEnd = new Date(currentYear + 1, 2, 31);
            let leaveHeadBody: any;
            let query;
            if (mode === "user") {
                query = this.leaveCountRepository
                    .createQueryBuilder("leaveCount")
                    .leftJoinAndSelect("leaveCount.headLeave", "headLeave")
                    .where("leaveCount.financialStart = :financialStart", { financialStart })
                    .andWhere("leaveCount.financialEnd = :financialEnd", { financialEnd });
            } else {
                query = this.leaveHeadRepository
                    .createQueryBuilder("leaveHead")
                    .leftJoinAndSelect(
                        "leaveHead.leave_head_count",
                        "leaveHeadCounts",
                        "leaveHeadCounts.financialStart = :financialStart AND leaveHeadCounts.financialEnd = :financialEnd AND leaveHeadCounts.deletedAt IS NULL",
                        { financialStart, financialEnd }
                    )
                    .where("leaveHead.deleted_at IS NULL");

            }

            leaveHeadBody = await query.getMany();
            return {
                message: "Leave head list Fetched Successfully",
                status: STATUSCODES.SUCCESS, data: leaveHeadBody
            };

        } catch (error) {
            console.log({error})
            throw error;
        }
    }

    async updateLeaveCount(input: LeaveHeadCountU, payload: IUser): Promise<IApiResponse> {
        try {
            const { headLeaveCntId } = input;
            if (!headLeaveCntId) return { status: STATUSCODES.BAD_REQUEST, message: "Leave Id is required." };

            const data = await this.leaveCountRepository.findOne({ where: { headLeaveCntId: headLeaveCntId } });
            if (!data) return { status: STATUSCODES.NOT_FOUND, message: "No data found with this leave id" };

            await this.leaveCountRepository.update({ headLeaveCntId: headLeaveCntId }, input);
            return { message: "Leave Count Updated Successfully", status: STATUSCODES.SUCCESS, data: data };
        } catch (error) {
            throw error;
        }
    }

    async deleteLeaveCount(input: LeaveHeadCountD, payload: IUser): Promise<IApiResponse> {
        try {
            const { headLeaveCntId } = input;
            if (!headLeaveCntId) return { status: STATUSCODES.BAD_REQUEST, message: "Leave Id is required." };

            const data = await this.leaveCountRepository.findOne({ where: { headLeaveCntId: headLeaveCntId } });
            if (!data) return { status: STATUSCODES.NOT_FOUND, message: "No data found with this leave id" };

            await this.leaveCountRepository.softDelete({ headLeaveCntId: headLeaveCntId });
            return { message: "Leave Count Deleted Successfully", status: STATUSCODES.SUCCESS };
        } catch (error) {
            throw error;
        }
    }
}

export { LeaveCountController };
