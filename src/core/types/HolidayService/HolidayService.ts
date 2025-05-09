import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export interface IHoliday {
    holidayId: number;
    holiday: string;
    holidayDay: string;
    holidayDate: Date;
}

export class HolidayC {
    @IsOptional()
    @IsNumber()
    holidayId?: number;

    @IsNotEmpty()
    @IsString()
    holiday: string;

    @IsNotEmpty()
    date: Date;

    @IsNotEmpty()
    @IsString()
    day: string;
}

export class HolidayR {
    @IsNotEmpty()
    @IsNumber()
    holidayId: number;
}

export class HolidayU {
    @IsOptional()
    @IsNumber()
    holidayId?: number;

    @IsNotEmpty()
    @IsString()
    holiday: string;

    @IsNotEmpty()
    date: Date;

    @IsNotEmpty()
    @IsString()
    day: string;
}

export class HolidayD {
    @IsNotEmpty()
    @IsNumber()
    holidayId: number;
}