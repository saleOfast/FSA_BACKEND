import { IsArray, IsBoolean, IsDateString, IsEmail, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { SpecialDiscountStatus, UserRole } from "../Constent/common";
import { User } from "../../DB/Entities/User.entity"
import { Profile } from "../../DB/Entities/profile.entity"

export interface IUser {
    emp_id: number;

    firstname: string;
    middlename?: string | null;
    lastname: string;
    name?: string | null;

    username: string;
    nickname?: string | null;

    email?: string | null;

    password: string;

    active: boolean;

    country?: string | null;
    state?: string | null;
    city?: string | null;
    region?: string | null;
    pincode?: string | null;
    street?: string | null;

    phone?: string | null;
    mobile?: string | null;

    department?: string | null;
    division?: string | null;
    team?: string | null;
    vertical?: string | null;
    title?: string | null;

    language?: string | null;
    timeZone?: string | null;

    employeeId?: string | null;

    joining_date?: Date | null;
    resignationDate?: Date | null;

    managerId?: number | null;
    manager?: User | null;

    delegatedApproverId?: number | null;
    delegatedApprover?: User | null;

    roleId?: number | null;

    profileId?: number | null;
    profile?: Profile | null;

    // role: UserRole;

    isDeleted: boolean;

    createdAt: Date;
    updatedAt: Date;

    deleted_at?: Date | null;
}

export class Login {
    @IsNotEmpty()
    @IsNumber()
    phone: number;

    @IsNotEmpty()
    @IsString()
    password: string;
}

export class ForgetPassword {
    // @IsNotEmpty()
    // @IsEmail()
    // emailId: string;
    @IsNotEmpty()
    @IsNumber()
    phone: number;


  @IsNotEmpty()
  @IsDateString()
  joining_date: Date;
}

export class ResetPassword {
    @IsNotEmpty()
    @IsString()
    id: string

    @IsNotEmpty()
    @IsString()
    token: string
}

export class ResetConfirmPassword {
    @IsNotEmpty()
    @IsString()
    password: string

    @IsNotEmpty()
    @IsString()
    confirmPassword: string

    @IsNotEmpty()
    @IsNumber()
    empId: string
}

export class SignUp {

    @IsString()
    @IsNotEmpty()
    firstname: string;

    @IsOptional()
    @IsString()
    middlename?: string;

    @IsString()
    @IsNotEmpty()
    lastname: string;

    @IsString()
    @IsNotEmpty()
    username: string;

    @IsOptional()
    @IsEmail()
    email?: string;

    @IsString()
    @IsNotEmpty()
    password: string;

    @IsOptional()
    @IsBoolean()
    active?: boolean;

    @IsOptional()
    @IsString()
    country?: string;

    @IsOptional()
    @IsString()
    state?: string;

    @IsOptional()
    @IsString()
    city?: string;

    @IsOptional()
    @IsString()
    region?: string;

    @IsOptional()
    @IsString()
    pincode?: string;

    @IsOptional()
    @IsString()
    street?: string;

    @IsOptional()
    @IsString()
    phone?: string;

    @IsOptional()
    @IsString()
    mobile?: string;

    @IsOptional()
    @IsString()
    department?: string;

    @IsOptional()
    @IsString()
    division?: string;

    @IsOptional()
    @IsString()
    team?: string;

    @IsOptional()
    @IsString()
    vertical?: string;

    @IsOptional()
    @IsString()
    title?: string;

    @IsOptional()
    @IsString()
    language?: string;

    @IsOptional()
    @IsString()
    timeZone?: string;

    @IsOptional()
    @IsString()
    employeeId?: string;

    @IsOptional()
    @IsDateString()
    joining_date?: Date;

    @IsOptional()
    @IsDateString()
    resignationDate?: Date;

    @IsOptional()
    @IsNumber()
    managerId?: number;

    @IsOptional()
    @IsNumber()
    delegatedApproverId?: number;

    @IsOptional()
    @IsNumber()
    roleId?: number;

    @IsOptional()
    @IsNumber()
    profileId?: number;

    @IsOptional()
    @IsBoolean()
    isDeleted?: boolean;

    // @IsNotEmpty()
    // @IsEnum(UserRole)
    // role: UserRole;
}
export class UpdateUserProfile {
    // @IsNotEmpty()
    // @IsString()
    // image: string

    @IsNotEmpty()
    @IsString()
    empId: string
}

export class DeleteUserProfile {
    @IsNotEmpty()
    @IsString()
    empId: string
}


export class DashboardFilter {
    @IsOptional()
    @IsArray()
    timePeriod: string
}

export class TargetFilter {
    @IsNotEmpty()
    @IsString()
    empId: string

    @IsNotEmpty()
    @IsString()
    year: string
}

export class TargetSummaryFilter {
  
    @IsOptional()
    @IsString()
    timelineYear: string
}

export declare namespace IUserProfile {

    interface IProfile {

        emp_id: number;

        firstname: string;
        middlename?: string | null;
        lastname: string;
        name?: string | null;

        username: string;

        email?: string | null;

        phone?: string | null;
        mobile?: string | null;

        country?: string | null;
        state?: string | null;
        city?: string | null;
        region?: string | null;
        pincode?: string | null;
        street?: string | null;

        department?: string | null;
        division?: string | null;
        team?: string | null;
        vertical?: string | null;
        title?: string | null;

        language?: string | null;
        timeZone?: string | null;

        employeeId?: string | null;

        joining_date?: Date | null;
        resignationDate?: Date | null;

        managerName?: string | null;
        delegatedApproverName?: string | null;

        role: UserRole;

        active: boolean;

        createdAt: Date;
        updatedAt: Date;
    }
}

export class GetUsers {
    @IsNotEmpty()
    @IsString()
    empId: string
}
export class UpdateUser {

    @IsNotEmpty()
    @IsNumber()
    emp_id: number;

    @IsOptional()
    @IsString()
    firstname?: string;

    @IsOptional()
    @IsString()
    middlename?: string;

    @IsOptional()
    @IsString()
    lastname?: string;

    @IsOptional()
    @IsString()
    username?: string;

    @IsOptional()
    @IsEmail()
    email?: string;

    @IsOptional()
    @IsString()
    phone?: string;

    @IsOptional()
    @IsString()
    mobile?: string;

    @IsOptional()
    @IsString()
    country?: string;

    @IsOptional()
    @IsString()
    state?: string;

    @IsOptional()
    @IsString()
    city?: string;

    @IsOptional()
    @IsString()
    region?: string;

    @IsOptional()
    @IsString()
    pincode?: string;

    @IsOptional()
    @IsString()
    street?: string;

    @IsOptional()
    @IsString()
    department?: string;

    @IsOptional()
    @IsString()
    division?: string;

    @IsOptional()
    @IsString()
    team?: string;

    @IsOptional()
    @IsString()
    vertical?: string;

    @IsOptional()
    @IsString()
    title?: string;

    @IsOptional()
    @IsString()
    language?: string;

    @IsOptional()
    @IsString()
    timeZone?: string;

    @IsOptional()
    @IsString()
    employeeId?: string;

    @IsOptional()
    @IsDateString()
    joining_date?: Date;

    @IsOptional()
    @IsDateString()
    resignationDate?: Date;

    @IsOptional()
    @IsString()
    managerName?: string;

    @IsOptional()
    @IsString()
    delegatedApproverName?: string;

    @IsOptional()
    @IsNumber()
    roleId?: number;

    @IsOptional()
    @IsNumber()
    profileId?: number;

    @IsOptional()
    @IsBoolean()
    active?: boolean;

    @IsOptional()
    @IsBoolean()
    isDeleted?: boolean;

    @IsOptional()
    @IsEnum(UserRole)
    role?: UserRole;
}

export class DeleteUser {
    @IsNotEmpty()
    @IsString()
    empId: string
}


// export class UpdateApprovalStore {
//     @IsNotEmpty()
//     @IsEnum(SpecialDiscountStatus)
//     specialDiscountStatus: SpecialDiscountStatus;

//     @IsNotEmpty()
//     @IsNumber()
//     orderId: number

//     @IsOptional()
//     @IsString()
//     specialDiscountComment?: string
// }