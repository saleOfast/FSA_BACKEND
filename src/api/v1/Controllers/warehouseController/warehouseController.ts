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

async createWarehouse(
  input: CreateWarehouseDto,
  payload: IUser
): Promise<IApiResponse> {
  try {
    // ============================
    // 1️⃣ Normalize Input
    // ============================
    const normalize = (val?: string) => val?.trim();

    const warehouseCode = normalize(input.warehouseCode)?.toUpperCase();
    const warehouseName = normalize(input.warehouseName);

    // ============================
    // 2️⃣ Required Field Validation (Bug 14 FIX)
    // ============================
    if (!warehouseCode) {
      return {
        status: STATUSCODES.BAD_REQUEST,
        message: "Warehouse code is required"
      };
    }

    if (!warehouseName) {
      return {
        status: STATUSCODES.BAD_REQUEST,
        message: "Warehouse name is required"
      };
    }

    // ============================
    // 3️⃣ Duplicate Check (Case-insensitive) (Bug 10 FIX)
    // ============================
    const existing = await this.repo
      .createQueryBuilder("w")
      .where("LOWER(w.warehouseCode) = :code", {
        code: warehouseCode.toLowerCase()
      })
      .orWhere("LOWER(w.warehouseName) = :name", {
        name: warehouseName.toLowerCase()
      })
      .getOne();

    if (existing) {
      return {
        status: STATUSCODES.CONFLICT,
        message: "Warehouse with same code or name already exists"
      };
    }

    // ============================
    // 4️⃣ Fetch Foreign Keys in Parallel
    // ============================
    const [country, state, district] = await Promise.all([
      this.countryRepo.findOne({
        where: { countryId: input.shippingCountryId }
      }),
      this.stateRepo.findOne({
        where: { stateId: input.shippingStateId }
      }),
      this.districtRepo.findOne({
        where: { districtId: input.shippingDistrictId }
      })
    ]);

    if (!country) {
      return { status: STATUSCODES.BAD_REQUEST, message: "Invalid shipping country" };
    }

    if (!state) {
      return { status: STATUSCODES.BAD_REQUEST, message: "Invalid shipping state" };
    }

    if (!district) {
      return { status: STATUSCODES.BAD_REQUEST, message: "Invalid shipping district" };
    }

    // ============================
    // 5️⃣ Create Entity
    // ============================
    const entity = this.repo.create({
      // Core
      warehouseCode,
      warehouseName,
      status: input.status ?? WarehouseStatusEnum.DRAFT,
      activeFlag: input.activeFlag ?? true,
      effectiveFrom: input.effectiveFrom,
      effectiveTo: input.effectiveTo ?? undefined,

      // Business
      ownershipType: input.ownershipType,
      businessRole: input.businessRole,
      legalEntityId: input.legalEntityId ?? null,
      parentPartnerId: input.parentPartnerId ?? null,
      franchise: input.franchise,

      // Relations
      shippingCountry: country,
      shippingState: state,
      shippingDistrict: district,

      // Address
      shippingStreet: normalize(input.shippingStreet),
      shippingCity: input.shippingCity,
      shippingPinCode: input.shippingPinCode,

      // Denormalized Names
      shippingCountryName: country.countryName,
      shippingStateName: state.stateName,
      shippingDistrictName: district.districtName,

      // Tax
      gstNo: normalize(input.gstNo)?.toUpperCase(),
      vatRegistrationNo: input.vatRegistrationNo ?? undefined,
      taxRegistrationType: input.taxRegistrationType ?? undefined,
      sez: input.sez,
      customZone: input.customZone,

      // Flags
      allowsSales: input.allowsSales ?? true,
      allowsPurchase: input.allowsPurchase ?? true,
      allowsReturns: input.allowsReturns ?? true,
      supportsBatch: input.supportsBatch ?? false,
      supportsExpiry: input.supportsExpiry ?? false,
      supportsSerial: input.supportsSerial ?? false,
      temperatureControlled: input.temperatureControlled ?? false,
      crossDockingFlag: input.crossDockingFlag ?? false,
      consignmentFlag: input.consignmentFlag ?? false
    });

    // ============================
    // 6️⃣ Save (Bug 15 FIX - no extra query)
    // ============================
    const savedWarehouse = await this.repo.save(entity);

    // ✅ No extra DB call — relations already set
    // savedWarehouse.shippingCountry = country;
    // savedWarehouse.shippingState = state;
    // savedWarehouse.shippingDistrict = district;

    return {
      status: STATUSCODES.SUCCESS,
      message: "Warehouse created successfully",
      data: savedWarehouse
    };

  } catch (error: any) {
    console.error("Create Warehouse Error:", error);

    // ============================
    // 7️⃣ DB Unique Error Handling (Bonus)
    // ============================
    if (error.code === "23505") {
      return {
        status: STATUSCODES.CONFLICT,
        message: "Duplicate warehouse found"
      };
    }

    throw error;
  }
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