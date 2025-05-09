import { IsArray, IsBoolean, IsDateString, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { IUser } from "../AuthService/AuthService";
import { IHeadLeave } from "./LeaveService";
import { ILeaveHeadCount } from "./LeaveCountService";

export class GetUserLeave {
    @IsNotEmpty()
    @IsString()
    head_leave_cnt_id: string;

    @IsNotEmpty()
    @IsString()
    left_leave: string;
   
}
export class AddUserLeave {
    @IsNotEmpty()
    @IsString()
    head_leave_id: string;

    @IsNotEmpty()
    @IsString()
    head_leave_cnt_id: string;

    @IsNotEmpty()
    @IsString()
    left_leave: string;

    
    @IsNotEmpty()
    @IsString()
    remarks: string;
   
}
// leave_app_id, leave_app_status, head_leave_id, head_leave_cnt_id, submitted_by, no_of_days, remarks
// export class UpdateUserLeave {
//     @IsNotEmpty()
//     @IsNumber()
//     leave_app_id: number;

//     @IsOptional()
//     @IsString()
//     head_leave_name: string;

//     @IsOptional()
//     @IsString()
//     head_leave_short_name: string;

//     @IsOptional()
//     @IsBoolean()
//     status: boolean;
// }

export interface IUserLeave {
    user_leave_id: number;
    user: IUser,
    LeaveHead: IHeadLeave,
    LeaveHeadCount: ILeaveHeadCount,
    left_leave: number,
    extra_leaves: number,
    remarks: string,
    created_at: Date;
    updated_at: Date;
    deleted_at: Date;
}
