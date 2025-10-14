import { IsArray, IsDateString, IsInt, IsNotEmpty, IsOptional, IsString, MaxLength } from "class-validator";
import { Transform } from "class-transformer";

export class CreateSalesReturn {
	@IsInt()
	@IsNotEmpty()
	orderId: number;

	@IsInt()
	@IsNotEmpty()
	storeId: number;

	@IsOptional()
	@IsInt()
	creditNoteId?: number;

	@IsOptional()
	@IsDateString()
	returnDate?: string; // default today if missing

	@IsOptional()
	@IsString()
	@MaxLength(1000)
	remarks?: string;

	@IsOptional()
	returnValue?: number;

	@IsOptional()
	@IsArray()
	@IsString({ each: true })
	attachments?: string[];
}

export class UpdateSalesReturn {
	@IsInt()
	@IsNotEmpty()
	returnId: number;

	@IsOptional()
	@IsInt()
	storeId?: number;

	@IsOptional()
	@IsDateString()
	returnDate?: string;

	@IsOptional()
	@IsInt()
	creditNoteId?: number;

	@IsOptional()
	@IsString()
	@MaxLength(1000)
	remarks?: string;



	@IsOptional()
	@IsArray()
	@IsString({ each: true })
	attachments?: string[];
}

export class GetSalesReturnById {
	@Transform(({ value }) => parseInt(value))
	@IsInt()
	@IsNotEmpty()
	returnId: number;
}

export class ListSalesReturnsFilter {


	@IsOptional()
	@IsInt()
	storeId?: number;

	@IsOptional()
	@IsInt()
	orderId?: number;

	@IsOptional()
	@IsDateString()
	fromDate?: string;

	@IsOptional()
	@IsDateString()
	toDate?: string;

	@IsOptional()
	@IsInt()
	page?: number;

	@IsOptional()
	@IsInt()
	pageSize?: number;
}

export class UploadFile {
	@IsNotEmpty()
	@IsString()
	fileName: string;

	@IsNotEmpty()
	@IsString()
	fileType: string; // e.g. image/jpeg, application/pdf
}