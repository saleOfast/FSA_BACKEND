import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export interface IPayment {
    paymentId: number;
    orderId: number;
    paymentDate: string;
    transactionId: string;
    status:string;
    paymentMode: string;
    createdAt: Date;
    updatedAt: Date;
    paymentRefImg: string;
}

export class OrderPayment {
    @IsNotEmpty()
    @IsNumber()
    orderId: number;

    @IsNotEmpty()
    @IsString()
    paymentDate: string;

    @IsNotEmpty()
    @IsString()
    transactionId: string;

    @IsNotEmpty()
    @IsString()
    status:string;

    @IsNotEmpty()
    @IsString()
    paymentMode: string;

    @IsNotEmpty()
    @IsNumber()
    amount: number;

    @IsOptional()
    @IsString()
    paymentRefImg?: string;
}

export class OnlinePayment {
    @IsNotEmpty()
    @IsString()
    keyId: string;

    @IsNotEmpty()
    @IsString()
    keySecret: string;

    @IsNotEmpty()
    @IsNumber()
    amount:number;

    @IsNotEmpty()
    @IsString()
    currency: string;
}

export class GetPayment {
    @IsNotEmpty()
    @IsString()
    orderId: string
}