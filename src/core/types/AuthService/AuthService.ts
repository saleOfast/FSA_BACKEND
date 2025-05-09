import { IsArray, IsDateString, IsEmail, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { SpecialDiscountStatus, UserRole } from "../Constent/common";

export interface IUser {
    emp_id: number;
    firstname: string;
    lastname: string;
    age: number;
    dob: Date;
    address: string;
    city: string;
    state: string;
    pincode: string;
    phone: string;
    email: string;
    zone: string;
    joining_date: Date;
    password: string;
    managerId: number;
    image: string | null;
    role: UserRole;
    learningRole?: string | null;
    createdAt: Date;
    updatedAt: Date;
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
    dob: Date;
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

    @IsString()
    @IsOptional()
    lastname: string;

    @IsNumber()
    @IsOptional()
    age: number;

    @IsString()
    @IsOptional()
    address: string;

    @IsString()
    @IsOptional()
    city: string;

    @IsString()
    @IsOptional()
    state: string;

    @IsString()
    @IsOptional()
    pincode: string;

    @IsString()
    @IsNotEmpty()
    phone: string;

    @IsString()
    @IsOptional()
    email: string;

    @IsString()
    @IsOptional()
    zone: string;

    @IsDateString()
    @IsNotEmpty()
    joining_date: Date;

    // @IsDateString()
    @IsOptional()
    dob: Date;

    @IsString()
    @IsNotEmpty()
    password: string;

    @IsNotEmpty()
    @IsNumber()
    managerId: number;

    @IsNotEmpty()
    @IsEnum(UserRole)
    role: UserRole;

    @IsOptional()
    @IsString()
    learningRole?: string;
}

export class UpdateUserProfile {
    @IsNotEmpty()
    @IsString()
    image: string

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
        id: number,
        name: string,
        address: string,
        contactNumber: string,
        joiningDate: string,
        emailId: string,
        zone: string,
        manager: string,
        isCheckInMarked: boolean,
        isCheckOutMarked: boolean,
        role: UserRole,
        image: string | null
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
    empId: number

    @IsString()
    @IsNotEmpty()
    firstname: string;

    @IsString()
    @IsOptional()
    lastname: string;

    @IsNumber()
    @IsOptional()
    age: number;

    @IsString()
    @IsOptional()
    address: string;

    @IsString()
    @IsOptional()
    city: string;

    @IsString()
    @IsOptional()
    state: string;

    @IsString()
    @IsOptional()
    pincode: string;

    @IsString()
    @IsNotEmpty()
    phone: string;

    @IsString()
    @IsOptional()
    email: string;

    @IsString()
    @IsOptional()
    zone: string;

    @IsDateString()
    @IsOptional()
    joining_date: Date;
    
    // @IsDateString()
    @IsOptional()
    dob: Date;
    // @IsString()
    // @IsNotEmpty()
    // password: string;

    @IsNotEmpty()
    @IsNumber()
    managerId: number;

    @IsNotEmpty()
    @IsEnum(UserRole)
    role: UserRole;

    @IsOptional()
    @IsString()
    learningRole?: string;
}

export class DeleteUser {
    @IsNotEmpty()
    @IsString()
    empId: string
}
export class UpdateApprovalStore {
    @IsNotEmpty()
    @IsEnum(SpecialDiscountStatus)
    specialDiscountStatus: SpecialDiscountStatus;

    @IsNotEmpty()
    @IsNumber()
    orderId: number

    @IsOptional()
    @IsString()
    specialDiscountComment?: string
}