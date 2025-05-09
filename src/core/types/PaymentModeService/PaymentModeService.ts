import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export interface IPaymentMode {
    paymentModeId: number;
    empId: number;
    name: string;
    isDeleted: boolean;
    createdAt: Date;
    updatedAt: Date
}


export class CreatePaymentMode {
    @IsNotEmpty()
    @IsString()
    name: string;
}

export class UpdatePaymentMode {
    @IsOptional()
    @IsString()
    name?: string;

    @IsNotEmpty()
    @IsNumber()
    paymentModeId: number
}

export class DeletePaymentMode {
    @IsNotEmpty()
    @IsString()
    paymentModeId: string
}

export class GetPaymentMode {
    @IsNotEmpty()
    @IsString()
    paymentModeId: string
}