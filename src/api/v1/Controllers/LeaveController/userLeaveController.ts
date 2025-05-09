import { IApiResponse } from "../../../../core/types/Constent/commonService";
import { IUser } from "../../../../core/types/AuthService/AuthService";
import { STATUSCODES, } from "../../../../core/types/Constent/common";
import { UserLeaveRepository } from "../../../../core/DB/Entities/userLeave.entity";
import { GetUserLeave } from "../../../../core/types/LeaveService/userLeaveService";

class UserLeaveController {
    private userLeaveRepository = UserLeaveRepository();
    constructor() { }

   

   

    async getUserPendingLeavesCount(input: GetUserLeave, payload: IUser): Promise<IApiResponse> {
        try {
            const { head_leave_cnt_id, left_leave } = input;
            const { emp_id } = payload
            let data;
            if (head_leave_cnt_id) {
                data = await this.userLeaveRepository.findOne({
                    where: { head_leave_cnt_id: Number(head_leave_cnt_id), user_id:emp_id }
                });
            } 
            if(!data){
                return { message: "Success", status: STATUSCODES.SUCCESS, data: { left_leave } }
            }
            return { message: "Success", status: STATUSCODES.SUCCESS, data: data }
        } catch (error) {
            throw error;
        }
    }

   

    // async updateLeadHead(input: HeadLeaveU, payload: IUser): Promise<IApiResponse> {
    //     try {
    //         const { head_leave_id } = input;
    //         if (!head_leave_id) return { status: STATUSCODES.BAD_REQUEST, message: "Leave Id is required." };

    //         const data = await this.leaveHeadRepository.findOne({ where: { head_leave_id: head_leave_id } });
    //         if (!data) return { status: STATUSCODES.NOT_FOUND, message: "No data found with this leave id" };

    //         await this.leaveHeadRepository.update({ head_leave_id: head_leave_id }, input)
    //         return { message: "Leave Updated Successfully", status: STATUSCODES.SUCCESS, data: data }
    //     } catch (error) {
    //         throw error;
    //     }
    // }

  
}

export { UserLeaveController }