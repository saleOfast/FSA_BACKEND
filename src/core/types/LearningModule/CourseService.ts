import { IsArray, IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export interface ICourse {
    courseId: number;
    empId: number;
    courseName: string;
    description: string;
    isActive: boolean;
    dueDate: Date;
    videoLink?: string;
    thumbnailUrl?: string;
    targetAudience: string[];
    quizDuration: number;
    launchedDate: Date;
    createdAt: Date;
    updatedAt: Date;
}

export class AddCourse {

    @IsNotEmpty()
    @IsString()
    courseName: string;

    @IsNotEmpty()
    @IsString()
    description: string;

    @IsNotEmpty()
    @IsBoolean()
    isActive: boolean;

    @IsNotEmpty()
    @IsString()
    dueDate: Date;

    @IsOptional()
    @IsString()
    videoLink?: string;

    @IsOptional()
    @IsString()
    thumbnailUrl?: string;

    @IsNotEmpty()
    @IsArray()
    targetAudience: string[];

    @IsNotEmpty()
    @IsNumber()
    quizDuration: number;

    @IsNotEmpty()
    @IsString()
    launchedDate: Date;
}
export class GetCourse {
    @IsNotEmpty()
    @IsString()
    courseId: string
}

export class UpdateCourse {
  
    @IsNotEmpty()
    @IsNumber()
    courseId: number

    @IsOptional()
    @IsString()
    courseName?: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsBoolean()
    isActive?: boolean;

    @IsOptional()
    @IsString()
    dueDate?: Date;

    @IsOptional()
    @IsString()
    videoLink?: string;

    @IsOptional()
    @IsArray()
    targetAudience?: string[];

    @IsOptional()
    @IsNumber()
    quizDuration?: number;

    @IsOptional()
    @IsString()
    launchedDate?: Date;
}

export class DeleteCourse {
    @IsNotEmpty()
    @IsString()
    courseId: string
}


