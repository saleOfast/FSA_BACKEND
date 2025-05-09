import { Type } from "class-transformer";
import { IsArray, IsBoolean, IsDate, IsDateString, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
// 
export class CreateUserLeaveApplication {
    @IsNotEmpty()
    @IsNumber()
    head_leave_id: number;

    @IsNotEmpty()
    @IsNumber()
    head_leave_cnt_id: number;

    @IsNotEmpty()
    @IsString()
    from_date: Date;

    @IsNotEmpty()
    @IsString()
    to_date: Date;

    @IsOptional()
    @IsNumber()
    no_of_days: number;

    @IsNotEmpty()
    @IsString()
    reason: string;

    @IsOptional()
    @IsNumber()
    emp_id: number;

    @IsOptional()
    // @IsNumber()
    manager_id: any;
}



export class GetUserLeaveApplication {
    @IsNotEmpty()
    @IsString()
    leave_app_status: string;

    @IsNotEmpty()
    @IsString()
    report_to: string;
}



export class DeleteUserLeaveAppl {
    @IsNotEmpty()
    @IsString()
    leave_app_id: string;
}
// leave_app_id, leave_app_status, head_leave_id, head_leave_cnt_id, submitted_by, no_of_days, remarks

// export class UpdateLeaveAppl {
//     @IsNotEmpty()
//     @IsNumber()
//     leave_app_id: number;

//     @IsNotEmpty()
//     @IsNumber()
//     head_leave_id: number;

//     @IsNotEmpty()
//     @IsNumber()
//     head_leave_cnt_id: number;

//     @IsOptional()
//     @IsString()
//     leave_app_status: string;

//     @IsOptional()
//     @IsString()
//     submitted_by: string;

//     @IsOptional()
//     @IsBoolean()
//     status: boolean;
// }

export interface IUserLeaveApplication {
    leave_app_id: number;
    manager_id: any;
    emp_id: any;
    LeaveHead: any;
    LeaveHeadCount: any;
    reason: string;
    no_of_days: number;
    from_date: string;
    to_date: string;
    leave_app_status: string;
    remarks: string;
    created_at: Date;
    updated_at: Date;
    deleted_at: Date;
}

export class UpdateLeaveApp {
    @IsNotEmpty()
    @IsNumber()
    leave_app_id: number;

    @IsNotEmpty()
    @IsString()
    leave_app_status: 'pending' | 'approved' | 'rejected';

    @IsOptional()
    @IsString()
    remarks: string;
}