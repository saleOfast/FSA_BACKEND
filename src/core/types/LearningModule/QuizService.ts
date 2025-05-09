import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export interface IQuiz {
    quizId: number;
    question: string;
    option1: string;
    option2: string;
    option3: string;
    option4: string;
    answer: string;
    marks: number;
    courseId:number;
    createdAt: Date;
}

export class AddQuiz {

    @IsNotEmpty()
    @IsString()
    question: string;

    @IsNotEmpty()
    @IsString()
    option1: string;

    @IsNotEmpty()
    @IsString()
    option2: string;

    @IsNotEmpty()
    @IsString()
    option3: string;

    @IsNotEmpty()
    @IsString()
    option4: string;

    @IsNotEmpty()
    @IsString()
    answer: string;

    @IsNotEmpty()
    @IsNumber()
    marks: number;
    
    @IsNotEmpty()
    @IsNumber()
    courseId: number;
  
}

export class UpdateQuiz {
  
    @IsNotEmpty()
    @IsNumber()
    quizId: number

    @IsNotEmpty()
    @IsNumber()
    courseId: number;

    @IsOptional()
    @IsString()
    question?: string;

    @IsOptional()
    @IsString()
    option1?: string;

    @IsOptional()
    @IsString()
    option2?: string;

    @IsOptional()
    @IsString()
    option3?: string;

    @IsOptional()
    @IsString()
    option4?: string;

    @IsOptional()
    @IsString()
    answer?: string;

    @IsOptional()
    @IsNumber()
    marks?: number;
}

export class DeleteQuiz {
    @IsNotEmpty()
    @IsString()
    quizId: string
}

export class GetQuiz {
    @IsNotEmpty()
    @IsString()
    quizId: string
}



