import { STATUSCODES } from "../../../../core/types/Constent/common";
import { IApiResponse } from "../../../../core/types/Constent/commonService";
import { IUser } from "../../../../core/types/AuthService/AuthService";
import { CreateWarehouse, DeleteWarehouseById, GetWarehouseById, GetWarehouseList, UpdateWarehouse } from "../../../../core/types/warehouseService/warehouseService";
import { Warehouse, WarehouseRepository, WarehouseStatus, WarehouseType } from "../../../../core/DB/Entities/warehouse.entity";

// Configuration flag - set to true after running the database migration
const ENABLE_USER_NAME_FEATURES = true;

class WarehouseController {
	private repo = WarehouseRepository();

	constructor() {}

	async create(input: CreateWarehouse, payload: IUser): Promise<IApiResponse> {
		const existingByName = await this.repo.findOne({ where: { warehouseName: input.warehouseName } });
		if (existingByName) {
			return { status: STATUSCODES.CONFLICT, message: "Warehouse already exists." };
		}
		const entity = new Warehouse();
		entity.warehouseName = input.warehouseName;
		entity.warehouseType = input.type;
		entity.address = input.address;
		entity.city = input.city;
		entity.state = input.state;
		entity.zip = input.zip;
		entity.managerId = input.managerId ?? undefined;
		entity.email = input.email ?? undefined;
		entity.managerPhone = input.managerPhone ?? undefined;
		entity.contactPerson = input.contactPerson ?? undefined;
		entity.contactName = input.contactName ?? undefined;
		entity.capacity = input.capacity ?? undefined;
		entity.status = input.status ?? WarehouseStatus.ACTIVE;
		entity.operationalHours = input.operationalHours ?? undefined;
		entity.createdBy = input.createdBy ?? payload.emp_id;
		entity.lastModifiedBy = input.lastModifiedBy ?? payload.emp_id;

		// Set user names
		entity.createdByName = input.createdByName ?? `${payload.firstname} ${payload.lastname || ''}`.trim();
		entity.lastModifiedByName = input.lastModifiedByName ?? `${payload.firstname} ${payload.lastname || ''}`.trim();

		await this.repo.save(entity);
		return { status: STATUSCODES.SUCCESS, message: "Warehouse created successfully." };
	}

	async getById(input: GetWarehouseById): Promise<IApiResponse> {
		const { warehouseId } = input;
		const warehouse = await this.repo.findOne({ 
			where: { warehouseId }
		});
		if (!warehouse) {
			return { status: STATUSCODES.NOT_FOUND, message: "Warehouse not found." };
		}
		return { status: STATUSCODES.SUCCESS, message: "Success.", data: warehouse.toResponseFormat() };
	}

	async list(input: GetWarehouseList): Promise<IApiResponse> {
		let { search, status, pageNumber, pageSize } = input;
		pageNumber = pageNumber && pageNumber > 0 ? pageNumber : 1;
		pageSize = pageSize && pageSize > 0 ? pageSize : 10;

		const qb = this.repo.createQueryBuilder('w');
		
		if (search && search.trim()) {
			qb.andWhere(`(
				LOWER(w.warehouse_name) LIKE LOWER(:s) OR
				LOWER(w.city) LIKE LOWER(:s) OR
				LOWER(w.state) LIKE LOWER(:s) OR
				CAST(w.warehouse_id AS TEXT) LIKE :s
			)`, { s: `%${search}%` });
		}
		if (status) {
			qb.andWhere('w.status = :status', { status });
		}
		qb.orderBy('w.last_updated_date', 'DESC');
		qb.skip((pageNumber - 1) * pageSize).take(pageSize);

		const [items, total] = await qb.getManyAndCount();
		
		// Format the response data
		const formattedItems = items.map(item => item.toResponseFormat());
		
		return {
			status: STATUSCODES.SUCCESS,
			message: 'Success.',
			data: {
				warehouses: formattedItems,
				pagination: {
					pageNumber,
					pageSize,
					totalRecords: total
				}
			}
		};
	}

	async update(input: UpdateWarehouse, payload: IUser): Promise<IApiResponse> {
		const { warehouseId, type, ...rest } = input;
		const existing = await this.repo.findOne({ where: { warehouseId } });
		if (!existing) {
			return { status: STATUSCODES.NOT_FOUND, message: 'Warehouse not found.' };
		}
		const updatePayload: Partial<Warehouse> = {
			...rest,
			warehouseType: type ?? existing.warehouseType,
			lastModifiedBy: payload.emp_id,
			lastModifiedByName: `${payload.firstname} ${payload.lastname || ''}`.trim()
		};

		await this.repo.createQueryBuilder().update(updatePayload).where({ warehouseId }).execute();
		return { status: STATUSCODES.SUCCESS, message: 'Updated successfully.' };
	}

	async delete(input: DeleteWarehouseById): Promise<IApiResponse> {
		const { warehouseId } = input;
		const existing = await this.repo.findOne({ where: { warehouseId } });
		if (!existing) {
			return { status: STATUSCODES.NOT_FOUND, message: 'Warehouse not found.' };
		}
		await this.repo.delete({ warehouseId });
		return { status: STATUSCODES.SUCCESS, message: 'Deleted successfully.' };
	}
}

export { WarehouseController as WarehouseService }