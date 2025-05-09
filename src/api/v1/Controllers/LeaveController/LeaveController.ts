import { IApiResponse } from "../../../../core/types/Constent/commonService";
import { IUser } from "../../../../core/types/AuthService/AuthService";
import { HeadLeaveC, HeadLeaveD, HeadLeaveR, HeadLeaveU } from "../../../../core/types/LeaveService/LeaveService";
import { CallType, DurationEnum, STATUSCODES, UserRole, VisitStatus } from "../../../../core/types/Constent/common";
import { HeadLeaveRepository } from "../../../../core/DB/Entities/Leave.entity";

class LeaveHeadController {
    private leaveHeadRepository = HeadLeaveRepository();
    constructor() { }

    async createLeadHead(input: HeadLeaveC, payload: IUser): Promise<IApiResponse> {
        try {
            const { head_leave_name } = input;
            const leaveHeadExists = await this.leaveHeadRepository.findOne({
                where: { head_leave_name: head_leave_name }
            });
            if (leaveHeadExists) {
                return { status: STATUSCODES.CONFLICT, message: "Leave Head Name Alredy Exist." };
            }
            let count: number = await this.leaveHeadRepository.count();
            const head_leave_code = `LH${(count + 1).toString().padStart(7, '0')}`
            const newLeaveHead = await this.leaveHeadRepository.save({
                ...input, head_leave_code: head_leave_code
            })
            return { message: "Success", status: STATUSCODES.SUCCESS, data: newLeaveHead }
        } catch (error) {
            throw error;
        }
    }

    async getLeadHead(input: HeadLeaveR, payload: IUser): Promise<IApiResponse> {
        try {
            const { head_leave_id } = input;
            let data
            if (head_leave_id) {
                data = await this.leaveHeadRepository.findOne({
                    where: { head_leave_id: Number(head_leave_id) }
                });
            } else {
                data = await this.leaveHeadRepository.find();
            }
            return { message: "Success", status: STATUSCODES.SUCCESS, data: data }
        } catch (error) {
            throw error;
        }
    }

    async getLeaveHeadById(payload: IUser, input: HeadLeaveR): Promise<IApiResponse> {
        try {
            const { head_leave_id } = input;
            const policy: any | null = await this.leaveHeadRepository.findOne({ where: { head_leave_id: Number(head_leave_id) } });
            if (!policy) {
                return { message: "Not Found.", status: STATUSCODES.NOT_FOUND }
            }

            return { message: "Success.", status: STATUSCODES.SUCCESS, data: policy }
        } catch (error) {
            throw error;
        }
    }


    async updateLeadHead(input: HeadLeaveU, payload: IUser): Promise<IApiResponse> {
        try {
            const { head_leave_id } = input;
            if (!head_leave_id) return { status: STATUSCODES.BAD_REQUEST, message: "Leave Id is required." };

            const data = await this.leaveHeadRepository.findOne({ where: { head_leave_id: head_leave_id } });
            if (!data) return { status: STATUSCODES.NOT_FOUND, message: "No data found with this leave id" };

            await this.leaveHeadRepository.update({ head_leave_id: head_leave_id }, input)
            return { message: "Leave Updated Successfully", status: STATUSCODES.SUCCESS, data: data }
        } catch (error) {
            throw error;
        }
    }

    async deleteLeadHead(input: HeadLeaveD, payload: IUser): Promise<IApiResponse> {
        try {
            const { head_leave_id } = input;
            if (!head_leave_id) return { status: STATUSCODES.BAD_REQUEST, message: "Leave Id is required." };

            const data = await this.leaveHeadRepository.findOne({ where: { head_leave_id: Number(head_leave_id) } });
            if (!data) return { status: STATUSCODES.NOT_FOUND, message: "No data found with this leave id" };

            await this.leaveHeadRepository.softDelete({ head_leave_id: Number(head_leave_id) })
            return { message: "Leave Deleted Successfully", status: STATUSCODES.SUCCESS }
        } catch (error) {
            throw error;
        }
    }
}

export { LeaveHeadController }