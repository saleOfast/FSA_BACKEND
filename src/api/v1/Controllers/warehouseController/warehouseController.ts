import { STATUSCODES } from "../../../../core/types/Constent/common";
import { IApiResponse } from "../../../../core/types/Constent/commonService";
import { IUser } from "../../../../core/types/AuthService/AuthService";
import { CreateWarehouseDto,GetWarehouseById ,GetWarehouseList,DeleteWarehouseById,UpdateWarehouse} from "../../../../core/types/warehouseService/warehouseService";
import { Warehouse, WarehouseRepository } from "../../../../core/DB/Entities/warehouse.entity";
import { CountryRepository } from "../../../../core/DB/Entities/country.entity";
import { StateRepository } from "../../../../core/DB/Entities/state.entity";
import { DistrictRepository } from "../../../../core/DB/Entities/district.entity";
import { WarehouseStatusEnum } from "../../../../core/types/Constent/common";
// Configuration flag - set to true after running the database migration
const ENABLE_USER_NAME_FEATURES = true;

class WarehouseController {
	private repo = WarehouseRepository();
	private countryRepo=CountryRepository();
	private stateRepo=StateRepository();
	private districtRepo=DistrictRepository();

	constructor() {}

	async createWarehouse(input: CreateWarehouseDto, payload: IUser): Promise<IApiResponse> {
		 const existing = await this.repo.findOne({
    where: [
      { warehouseCode: input.warehouseCode },
      { warehouseName: input.warehouseName },
    ],
  });

  if (existing) {
    return {
      status: STATUSCODES.CONFLICT,
      message: "Warehouse with same code or name already exists.",
    };
  }

  // 2. Validate Foreign Keys
  const country = await this.countryRepo.findOne({ where: { countryId: input.shippingCountryId } });
  if (!country) {
    return { status: STATUSCODES.BAD_REQUEST, message: "Invalid shipping country." };
  }

  const state = await this.stateRepo.findOne({ where: { stateId: input.shippingStateId } });
  if (!state) {
    return { status: STATUSCODES.BAD_REQUEST, message: "Invalid shipping state." };
  }

  const district = await this.districtRepo.findOne({ where: { districtId: input.shippingDistrictId } });
  if (!district) {
    return { status: STATUSCODES.BAD_REQUEST, message: "Invalid shipping district." };
  }

  // 3. Create Entity
  const entity = new Warehouse();

  // Core
  entity.warehouseCode = input.warehouseCode;
  entity.warehouseName = input.warehouseName;
  entity.status = input.status ?? WarehouseStatusEnum.DRAFT;
  entity.activeFlag = input.activeFlag ?? true;
  entity.effectiveFrom = input.effectiveFrom;
  entity.effectiveTo = input.effectiveTo ?? undefined;

  // Business
  entity.ownershipType = input.ownershipType;
  entity.businessRole = input.businessRole;
  entity.legalEntityId = input.legalEntityId ?? null;
  entity.parentPartnerId = input.parentPartnerId ?? null;
  entity.franchise = input.franchise;

  // Shipping Address (Relations)
  entity.shippingCountry = country;
  entity.shippingState = state;
  entity.shippingDistrict = district;
  entity.shippingStreet = input.shippingStreet;
  entity.shippingCity = input.shippingCity;
  entity.shippingPinCode = input.shippingPinCode;

  entity.shippingCountryName = country.countryName;
entity.shippingStateName = state.stateName;
entity.shippingDistrictName = district.districtName;

  // Tax / Compliance
  entity.gstNo = input.gstNo ?? undefined;
  entity.vatRegistrationNo = input.vatRegistrationNo ?? undefined;
  entity.taxRegistrationType = input.taxRegistrationType ?? undefined;
  entity.sez = input.sez;
  entity.customZone = input.customZone;

  // Operational Flags
  entity.allowsSales = input.allowsSales ?? true;
  entity.allowsPurchase = input.allowsPurchase ?? true;
  entity.allowsReturns = input.allowsReturns ?? true;
  entity.supportsBatch = input.supportsBatch ?? false;
  entity.supportsExpiry = input.supportsExpiry ?? false;
  entity.supportsSerial = input.supportsSerial ?? false;
  entity.temperatureControlled = input.temperatureControlled ?? false;
  entity.crossDockingFlag = input.crossDockingFlag ?? false;
  entity.consignmentFlag = input.consignmentFlag ?? false;

  // 4. Save
  await this.repo.save(entity);

  return {
    status: STATUSCODES.SUCCESS,
    message: "Warehouse created successfully.",
  };
}

async getById(input: GetWarehouseById): Promise<IApiResponse> {
  const { warehouseId } = input;

  const warehouse = await this.repo
    .createQueryBuilder("w")
    .leftJoinAndSelect("w.shippingCountry", "country")
    .leftJoinAndSelect("w.shippingState", "state")
    .leftJoinAndSelect("w.shippingDistrict", "district")
    .where("w.warehouse_id = :warehouseId", { warehouseId })
    .andWhere("w.is_deleted = false")
    .getOne();

  if (!warehouse) {
    return {
      status: STATUSCODES.NOT_FOUND,
      message: "Warehouse not found.",
    };
  }

  return {
    status: STATUSCODES.SUCCESS,
    message: "Success.",
    data: {
      ...warehouse,
  
    },
  };
}



async list(
  input: GetWarehouseList,
  payload: IUser
): Promise<IApiResponse> {
  try {
    const query = this.repo
      .createQueryBuilder("warehouse")
      .leftJoinAndSelect("warehouse.shippingCountry", "country")
      .leftJoinAndSelect("warehouse.shippingState", "state")
      .leftJoinAndSelect("warehouse.shippingDistrict", "district")
      // ✅ always exclude deleted
      .where("warehouse.isDeleted = :isDeleted", { isDeleted: false });

    // 🔍 Filters
    if (input.warehouseId) {
      query.andWhere("warehouse.warehouseId = :warehouseId", {
        warehouseId: input.warehouseId,
      });
    }

    if (input.warehouseCode) {
      query.andWhere("LOWER(warehouse.warehouseCode) LIKE LOWER(:code)", {
        code: `%${input.warehouseCode}%`,
      });
    }

    if (input.warehouseName) {
      query.andWhere("LOWER(warehouse.warehouseName) LIKE LOWER(:name)", {
        name: `%${input.warehouseName}%`,
      });
    }

    if (input.status) {
      query.andWhere("warehouse.status = :status", {
        status: input.status,
      });
    }

    if (input.activeFlag !== undefined) {
      query.andWhere("warehouse.activeFlag = :activeFlag", {
        activeFlag: input.activeFlag,
      });
    }

    if (input.shippingCountryId) {
      query.andWhere("country.id = :countryId", {
        countryId: input.shippingCountryId,
      });
    }

    if (input.shippingStateId) {
      query.andWhere("state.id = :stateId", {
        stateId: input.shippingStateId,
      });
    }

    if (input.shippingDistrictId) {
      query.andWhere("district.id = :districtId", {
        districtId: input.shippingDistrictId,
      });
    }

    // ⬇ sorting
    query.orderBy("warehouse.createdAt", "DESC");

    const warehouses = await query.getMany();

    if (!warehouses.length) {
      return {
        status: 404,
        message: "Warehouse not found",
        data: [],
      };
    }

    return {
      status: 200,
      message: "Warehouses fetched successfully",
      data: warehouses.map(w => ({
        warehouseId: w.warehouseId,
        warehouseCode: w.warehouseCode,
        warehouseName: w.warehouseName,
        status: w.status,
        activeFlag: w.activeFlag,

        effectiveFrom: w.effectiveFrom,
        effectiveTo: w.effectiveTo,

        ownershipType: w.ownershipType,
        businessRole: w.businessRole,

        legalEntityId: w.legalEntityId,
        parentPartnerId: w.parentPartnerId,
        franchise: w.franchise,

        shippingCountryId: w.shippingCountry,
        shippingStateId: w.shippingState,
        shippingDistrictId: w.shippingDistrict,

        shippingStreet: w.shippingStreet,
        shippingCity: w.shippingCity,
        shippingPinCode: w.shippingPinCode,

        gstNo: w.gstNo,
        vatRegistrationNo: w.vatRegistrationNo,
        taxRegistrationType: w.taxRegistrationType,

        sez: w.sez,
        customZone: w.customZone,

        allowsSales: w.allowsSales,
        allowsPurchase: w.allowsPurchase,
        allowsReturns: w.allowsReturns,

        supportsBatch: w.supportsBatch,
        supportsExpiry: w.supportsExpiry,
        supportsSerial: w.supportsSerial,

        temperatureControlled: w.temperatureControlled,
        crossDockingFlag: w.crossDockingFlag,
        consignmentFlag: w.consignmentFlag,

        isDeleted: w.isDeleted,
        createdAt: w.createdAt,
        updatedAt: w.updatedAt,
      })),
    };
  } catch (error) {
    console.error(error);
    throw error;
  }
}



async update(input: UpdateWarehouse, payload: IUser): Promise<IApiResponse> {
  const { warehouseId, ...rest } = input;

  const existing = await this.repo.findOne({
    where: { warehouseId },
  });

  if (!existing) {
    return {
      status: STATUSCODES.NOT_FOUND,
      message: 'Warehouse not found.',
    };
  }

  // 1️⃣ Update
  await this.repo.update(
    { warehouseId },
    {
      ...rest,
      updatedAt: new Date(),
    }
  );

  // 2️⃣ Fetch updated data
  const updatedWarehouse = await this.repo.findOne({
    where: { warehouseId },
    relations: [
      'shippingCountry',
      'shippingState',
      'shippingDistrict',
    ],
  });

  return {
    status: STATUSCODES.SUCCESS,
    message: 'Updated successfully.',
    data: updatedWarehouse,
  };
}




	async delete(input: DeleteWarehouseById): Promise<IApiResponse> {
		const { warehouseId } = input;
		const existing = await this.repo.findOne({ where: { warehouseId, isDeleted: false } });
		if (!existing) {
			return { status: STATUSCODES.NOT_FOUND, message: 'Warehouse not found.' };
		}
		await this.repo.update({ warehouseId }, { isDeleted: true });
		return { status: STATUSCODES.SUCCESS, message: 'Deleted successfully.' };
	}
}

export { WarehouseController as WarehouseService }