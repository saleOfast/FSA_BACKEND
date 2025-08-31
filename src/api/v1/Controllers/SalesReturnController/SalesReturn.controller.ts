import { STATUSCODES } from "../../../../core/types/Constent/common";
import { IApiResponse } from "../../../../core/types/Constent/commonService";
import { IUser } from "../../../../core/types/AuthService/AuthService";
import { CreateSalesReturn, GetSalesReturnById, ListSalesReturnsFilter, UpdateSalesReturn } from "../../../../core/types/SalesReturnService/SalesReturnService";
import { GetSalesReturnAnalytics, SalesReturnAnalyticsResponse } from "../../../../core/types/SalesReturnService/SalesReturnAnalytics";
import { SalesReturn, SalesReturnRepository } from "../../../../core/DB/Entities/sales_return.entity";
import { OrdersRepository } from "../../../../core/DB/Entities/orders.entity";
import { StoreRepository } from "../../../../core/DB/Entities/stores.entity";
import { Between, FindOptionsWhere } from "typeorm";

class SalesReturnController {
	private repo = SalesReturnRepository();
	private orderRepo = OrdersRepository();
	private storeRepo = StoreRepository();

	constructor() {}



async create(input: CreateSalesReturn, payload: IUser): Promise<IApiResponse> {
  const { orderId, customerId, returnDate, returnValue, creditNoteId, remarks, attachments } = input;
  const { emp_id } = payload;

  // Check if the order already has a return request
  const existingReturnRequest = await this.repo.findOne({ where: { orderId } });
  if (existingReturnRequest) {
    return { status: STATUSCODES.BAD_REQUEST, message: "Order return request already generated." };
  }

  // Check if the order exists
  const order = await this.orderRepo.findOne({ where: { orderId } });
  if (!order) return { status: STATUSCODES.NOT_FOUND, message: "Order not found." };

  // Check if the customer exists
  const customer = await this.storeRepo.findOne({ where: { storeId: customerId } });
  if (!customer) return { status: STATUSCODES.NOT_FOUND, message: "Customer not found." };

  // Create the sales return entity
  const entity = new SalesReturn();
  entity.orderId = orderId;
  entity.customerId = customerId;
  entity.returnDate = returnDate ? new Date(returnDate) : new Date();
  entity.remarks = remarks;
  entity.creditNoteId = creditNoteId ?? null;
  entity.attachments = attachments ?? [];
  entity.returnValue = returnValue || 0;
  entity.createdBy = `${payload.firstname} ${payload.lastname || ''}`.trim();
  entity.createdByUserId = emp_id;
  entity.lastModifiedBy = `${payload.firstname} ${payload.lastname || ''}`.trim();
  entity.lastModifiedByUserId = emp_id;

  // Save the sales return
  const savedReturn = await this.repo.save(entity);

  return { status: STATUSCODES.SUCCESS, message: "Sales return created.", data: { savedReturn } };
}

	async update(input: UpdateSalesReturn, payload: IUser): Promise<IApiResponse> {
		const { returnId, customerId, returnDate, creditNoteId, remarks, attachments } = input;
		const { emp_id } = payload;

		const entity = await this.repo.findOne({ where: { returnId } });
		if (!entity) return { status: STATUSCODES.NOT_FOUND, message: "Sales return not found." };

		if (customerId) {
			const customer = await this.storeRepo.findOne({ where: { storeId: customerId } });
			if (!customer) return { status: STATUSCODES.NOT_FOUND, message: "Customer not found." };
			entity.customerId = customerId;
		}
		if (returnDate) entity.returnDate = new Date(returnDate);
		if (typeof creditNoteId !== "undefined") entity.creditNoteId = creditNoteId ?? null;
		if (typeof remarks !== "undefined") entity.remarks = remarks;
		if (typeof attachments !== "undefined") entity.attachments = attachments;



		entity.lastModifiedBy = `${payload.firstname} ${payload.lastname || ''}`.trim();
		entity.lastModifiedByUserId = emp_id;
		await this.repo.save(entity);
		return { status: STATUSCODES.SUCCESS, message: "Sales return updated." };
	}

	async getById(input: GetSalesReturnById): Promise<IApiResponse> {
		const { returnId } = input;
		const data = await this.repo.findOne({ 
			where: { returnId },
			relations: ['createdByUser', 'lastModifiedByUser'],
			select: {
				createdByUser: {
					emp_id: true,
					firstname: true,
					lastname: true
				},
				lastModifiedByUser: {
					emp_id: true,
					firstname: true,
					lastname: true
				}
			}
		});
		if (!data) return { status: STATUSCODES.NOT_FOUND, message: "Sales return not found." };
		
		// Transform the response to match desired structure
		const transformedData = {
			...data,
			createdBy: data.createdByUser ? {
				emp_id: data.createdByUser.emp_id,
				firstname: data.createdByUser.firstname,
				lastname: data.createdByUser.lastname
			} : null,
			lastModifiedBy: data.lastModifiedByUser ? {
				emp_id: data.lastModifiedByUser.emp_id,
				firstname: data.lastModifiedByUser.firstname,
				lastname: data.lastModifiedByUser.lastname
			} : null
		};
		
		// Remove the original user objects
		delete transformedData.createdByUser;
		delete transformedData.lastModifiedByUser;
		
		return { status: STATUSCODES.SUCCESS, message: "Success.", data: transformedData };
	}

	async list(filter: ListSalesReturnsFilter): Promise<IApiResponse> {
		const { orderId, customerId, fromDate, toDate, page = 1, pageSize = 20 } = filter;
		const where: FindOptionsWhere<SalesReturn> = {};
		if (orderId) where.orderId = orderId;
		if (customerId) where.customerId = customerId;
		if (fromDate && toDate) where.returnDate = Between(new Date(fromDate), new Date(toDate));

		const [rows, total] = await this.repo.findAndCount({
			where,
			relations: ['createdByUser', 'lastModifiedByUser'],
			select: {
				createdByUser: {
					emp_id: true,
					firstname: true,
					lastname: true
				},
				lastModifiedByUser: {
					emp_id: true,
					firstname: true,
					lastname: true
				}
			},
			skip: (page - 1) * pageSize,
			take: pageSize,
			order: { returnDate: "DESC", returnId: "DESC" }
		});

		// Transform each row to match desired structure
		const transformedRows = rows.map(row => {
			const transformedRow = {
				...row,
				createdBy: row.createdByUser ? {
					emp_id: row.createdByUser.emp_id,
					firstname: row.createdByUser.firstname,
					lastname: row.createdByUser.lastname
				} : null,
				lastModifiedBy: row.lastModifiedByUser ? {
					emp_id: row.lastModifiedByUser.emp_id,
					firstname: row.lastModifiedByUser.firstname,
					lastname: row.lastModifiedByUser.lastname
				} : null
			};
			
			// Remove the original user objects
			delete transformedRow.createdByUser;
			delete transformedRow.lastModifiedByUser;
			
			return transformedRow;
		});

		return { status: STATUSCODES.SUCCESS, message: "Success.", data: { rows: transformedRows, total, page, pageSize } };
	}

	async getAnalytics(filter: GetSalesReturnAnalytics): Promise<IApiResponse> {
		const { fromDate, toDate, customerId } = filter;
		
		// Set default date range if not provided (last 30 days)
		const endDate = toDate ? new Date(toDate) : new Date();
		const startDate = fromDate ? new Date(fromDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
		
		// Build base query conditions
		const whereConditions: any = {
			returnDate: Between(startDate, endDate)
		};
		
		if (customerId) {
			whereConditions.customerId = customerId;
		}
		
		// Get all returns in the period
		const allReturns = await this.repo.find({
			where: whereConditions,
			select: ['returnId', 'returnDate', 'returnValue', 'creditNoteId', 'createdAt', 'lastUpdatedDate']
		});
		
		// Calculate analytics
		const totalReturns = allReturns.length;
		const totalValue = allReturns.reduce((sum, ret) => sum + (Number(ret.returnValue) || 0), 0);
		
		// Pending reviews: returns without credit note ID (not processed)
		const pendingReviews = allReturns.filter(ret => !ret.creditNoteId).length;
		
		// Completion rate: percentage of returns that have been processed (have credit note)
		const completionRate = totalReturns > 0 ? ((totalReturns - pendingReviews) / totalReturns) * 100 : 0;
		
		const analyticsData: SalesReturnAnalyticsResponse = {
			totalReturns,
			pendingReviews,
			totalValue: Math.round(totalValue * 100) / 100, // Round to 2 decimal places
			completionRate: Math.round(completionRate * 100) / 100 // Round to 2 decimal places
		};
		
		return { 
			status: STATUSCODES.SUCCESS, 
			message: "Analytics retrieved successfully.", 
			data: analyticsData 
		};
	}
}

export { SalesReturnController as SalesReturnService }