import { IsOptional, IsDateString } from "class-validator";

export class GetSalesReturnAnalytics {
    @IsOptional()
    @IsDateString()
    fromDate?: string;

    @IsOptional()
    @IsDateString()
    toDate?: string;

    @IsOptional()
    customerId?: number;
}

export interface SalesReturnAnalyticsResponse {
    totalReturns: number;
    pendingReviews: number;
    totalValue: number;
    completionRate: number;
}
