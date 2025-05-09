import { IsNotEmpty, IsNumber } from "class-validator";

export interface ILearningSession {
    learningSessionId: number;
    courseId: number;
    userId: number;
    createdAt: Date;
    updatedAt: Date;
}

export class AddLearningSession {

    @IsNotEmpty()
    @IsNumber()
    courseId: number;

    @IsNotEmpty()
    @IsNumber()
    userId: number;
  
}



