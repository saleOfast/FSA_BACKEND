import { IApiResponse } from "../../../../core/types/Constent/commonService";
import { IUser } from "../../../../core/types/AuthService/AuthService";
import { CreateSchemeDto, IScheme, UpdateSchemeDto ,GetAllSchemeDto,GetSchemeDto, DeleteSchemeDto} from "../../../../core/types/SchemeService/SchemeService";
import { STATUSCODES, UserRole } from "../../../../core/types/Constent/common";
import { getSchemeRepository } from "../../../../core/DB/Entities/scheme.entity";
import { CustomerRepository } from "../../../../core/DB/Entities/customer.entity";
import { CustomerTypeRepository } from "../../../../core/DB/Entities/customerType.entity";
import { ProductRepository } from "../../../../core/DB/Entities/products.entity";
import { SkuRepository } from "../../../../core/DB/Entities/sku.entity";
import { WarehouseRepository } from "../../../../core/DB/Entities/warehouse.entity";
import { PosmRepository } from "../../../../core/DB/Entities/posm.entity";
import { BeatRepository } from "../../../../core/DB/Entities/beat.entity";

class SchemeController {
    private getRepositry = getSchemeRepository()
    private customerRepository = CustomerRepository();
    private customerTypeRepository = CustomerTypeRepository();
    private productRepository = ProductRepository();
    private skuRepository = SkuRepository();
    private warehouseRepository = WarehouseRepository();
    private posmRepository = PosmRepository();
    private beatRepo = BeatRepository();

    constructor() { }

async createScheme(
  payload: IUser,
  input: CreateSchemeDto
): Promise<IApiResponse> {
  try {
    const { emp_id } = payload;

    let {
      schemeName,
      schemeType,
      schemeNature,
      startDate,
      endDate,
      status,
      priority,
      autoApply,
      customerId,
      customerTypeId,
      productId,
      skuId,
      warehouseId,
      posmId,
      beatId,
      minQty,
      minValue,
      slabFrom,
      slabTo,
      benefitType,
      benefitQty,
      BenefitLimit,
      isClaimable,
      claimPeriod,
    } = input;

    /* =====================================================
     1️⃣ TRIM + REQUIRED VALIDATION (Bug 76, 83)
    ===================================================== */
    if (!schemeName || schemeName.trim() === "") {
      return { status: 400, message: "Scheme name is required" };
    }

    const normalizedName = schemeName.trim().toLowerCase();

    /* =====================================================
     2️⃣ DATE VALIDATION (Bug 75)
    ===================================================== */
    let start: Date | undefined;
    let end: Date | undefined;

    if (startDate) {
      start = new Date(startDate);
      if (isNaN(start.getTime())) {
        return { status: 400, message: "Invalid startDate" };
      }
    }

    if (endDate) {
      end = new Date(endDate);
      if (isNaN(end.getTime())) {
        return { status: 400, message: "Invalid endDate" };
      }
    }

    if (start && end && start > end) {
      return {
        status: 400,
        message: "Start date must be before end date",
      };
    }

    /* =====================================================
     3️⃣ NUMERIC VALIDATION (Bug 78)
    ===================================================== */
    if (minQty !== undefined && minQty < 0) {
      return { status: 400, message: "minQty cannot be negative" };
    }

    if (minValue !== undefined && minValue < 0) {
      return { status: 400, message: "minValue cannot be negative" };
    }

    if (benefitQty !== undefined && benefitQty < 0) {
      return { status: 400, message: "benefitQty cannot be negative" };
    }

    /* =====================================================
     4️⃣ DUPLICATE SCHEME CHECK (Bug 74)
    ===================================================== */
    const existingScheme = await this.getRepositry.findOne({
      where: { schemeName: normalizedName, isDeleted: false },
    });

    if (existingScheme) {
      return { status: 409, message: "Scheme already exists" };
    }

    /* =====================================================
     5️⃣ FK VALIDATIONS (Bug 73, 80, 81)
    ===================================================== */

    let customer, customerType, product, sku, warehouse, beat, posm;

    if (customerId) {
      customer = await this.customerRepository.findOne({
        where: { customerId, isDeleted: false },
      });
      if (!customer) return { status: 404, message: "Invalid customer" };
    }

    if (customerTypeId) {
      customerType = await this.customerTypeRepository.findOne({
        where: { customerTypeId, isDeleted: false },
      });
      if (!customerType) return { status: 404, message: "Invalid customerType" };
    }

    if (productId) {
      product = await this.productRepository.findOne({
        where: { productId, isDeleted: false },
      });
      if (!product) return { status: 404, message: "Invalid product" };
    }

    if (skuId) {
      sku = await this.skuRepository.findOne({
        where: { skuId, isDeleted: false },
      });
      if (!sku) return { status: 404, message: "Invalid SKU" };

      // ✅ Bug 79 FIX
      if (product && sku.productId !== product.productId) {
        return {
          status: 400,
          message: "SKU does not belong to selected product",
        };
      }
    }

    if (warehouseId) {
      const warehouseIdStr = String(warehouseId); // ✅ Bug 77 fix

      warehouse = await this.warehouseRepository.findOne({
        where: { warehouseId: warehouseIdStr, isDeleted: false },
      });

      if (!warehouse) {
        return { status: 404, message: "Invalid warehouse" };
      }
    }

    if (beatId) {
      beat = await this.beatRepo.findOne({
        where: { beatId, isDeleted: false },
      });
      if (!beat) return { status: 404, message: "Invalid beat" };
    }

    if (posmId) {
      posm = await this.posmRepository.findOne({
        where: { posmId, is_deleted: false }, // ✅ Bug 81 FIX
      });

      if (!posm) return { status: 404, message: "Invalid POSM" };

      // ✅ Bug 82/84 (if POSM has dates)
   let start: Date | undefined;
let end: Date | undefined;

if (startDate) {
  start = new Date(startDate);
  if (isNaN(start.getTime())) {
    return { status: 400, message: "Invalid startDate" };
  }
}

if (endDate) {
  end = new Date(endDate);
  if (isNaN(end.getTime())) {
    return { status: 400, message: "Invalid endDate" };
  }
}

if (start && end && start > end) {
  return {
    status: 400,
    message: "Start date must be before end date",
  };
}
    }

    /* =====================================================
     6️⃣ CREATE SCHEME (NO "as any")
    ===================================================== */
    const newScheme = this.getRepositry.create({
      schemeName: normalizedName,
      schemeType,
      schemeNature,
      startDate: start,
      endDate: end,
      status,
      priority,
      autoApply,

      customer,
      customerType,
      product,
      sku,
      warehouse,
      posm,
      beat,

      minQty,
      minValue,
      slabFrom,
      slabTo,
      benefitType,
      benefitQty,
      BenefitLimit,
      isClaimable,
      claimPeriod,

      createdBy: emp_id,
    });

    const savedScheme = await this.getRepositry.save(newScheme);

    return {
      status: STATUSCODES.SUCCESS,
      message: "Scheme created successfully",
      data: savedScheme,
    };

  } catch (error: any) {
    console.error("Create Scheme Error:", error);

    return {
      status: STATUSCODES.BAD_REQUEST,
      message: error.message || "Failed to create scheme",
    };
  }
}

    // async getScheme(): Promise<IApiResponse> {
    //     try {
    //         const schemes: IScheme[] | null = await this.getRepositry.find({ where: { isEnable: true } });

    //         const currentDate = new Date();
    //         const month = currentDate.getMonth() + 1;
    //         const year = currentDate.getFullYear();
    //         // console.log(month, year);

    //         let activeScheme: IScheme[] | null = [];
    //         for (let scheme of schemes) {
    //             if (scheme.month == month && scheme.year == year) {
    //                 activeScheme.push(scheme)
    //             }
    //         }

    //         if (!activeScheme) {
    //             return { message: "No Scheme Found for this Month.", status: STATUSCODES.NOT_FOUND }
    //         }

    //         return { message: "Success.", status: STATUSCODES.SUCCESS, data: activeScheme }
    //     } catch (error) {
    //         throw error;
    //     }
    // }

    // async schemeList(payload: IUser): Promise<IApiResponse> {
    //     const { role } = payload;
    //     try {
    //         let filterQuery : any = {};
    //         if(role === UserRole.RETAILER){
    //             filterQuery = {isDeleted: false, isEnable: true}
    //         }else{
    //             filterQuery = {isDeleted: false}
    //         }
    //         const schemes: IScheme[] | null = await this.getRepositry.find({ where: filterQuery });
    //         return { message: "Success.", status: STATUSCODES.SUCCESS, data: schemes }
    //     } catch (error) {
    //         throw error;
    //     }
    // }

async update(
  payload: IUser,
  id: number,
  input: UpdateSchemeDto
): Promise<IApiResponse> {
  try {
    const { emp_id } = payload;

    // 1️⃣ Find existing scheme
    const scheme = await this.getRepositry.findOne({
      where: { id, isDeleted: false },
      relations: ["product","beat"],
    });

    if (!scheme) {
      return {
        status: STATUSCODES.NOT_FOUND,
        message: "Scheme not found or already deleted",
      };
    }

    /* =====================================================
     2️⃣ SCHEME NAME VALIDATION + DUPLICATE
    ===================================================== */
    if (input.schemeName !== undefined) {
      if (!input.schemeName || input.schemeName.trim() === "") {
        return { status: 400, message: "Scheme name cannot be empty" };
      }

      const normalizedName = input.schemeName.trim().toLowerCase();

      const existing = await this.getRepositry.findOne({
        where: { schemeName: normalizedName, isDeleted: false },
      });

      if (existing && existing.id !== id) {
        return {
          status: 409,
          message: "Scheme with same name already exists",
        };
      }

      scheme.schemeName = normalizedName;
    }

    /* =====================================================
     3️⃣ DATE VALIDATION (FIXED TS + RUNTIME)
    ===================================================== */
    let start: Date | undefined;
    let end: Date | undefined;

    if (input.startDate !== undefined) {
      start = input.startDate ? new Date(input.startDate) : undefined;

      if (start && isNaN(start.getTime())) {
        return { status: 400, message: "Invalid startDate" };
      }
    } else if (scheme.startDate) {
      start = new Date(scheme.startDate);
    }

    if (input.endDate !== undefined) {
      end = input.endDate ? new Date(input.endDate) : undefined;

      if (end && isNaN(end.getTime())) {
        return { status: 400, message: "Invalid endDate" };
      }
    } else if (scheme.endDate) {
      end = new Date(scheme.endDate);
    }

    if (start && end && start > end) {
      return {
        status: 400,
        message: "Start date must be before end date",
      };
    }

    if (input.startDate !== undefined && start) {
      scheme.startDate = start;
    }

    if (input.endDate !== undefined && end) {
      scheme.endDate = end;
    }

    /* =====================================================
     4️⃣ NUMERIC VALIDATION
    ===================================================== */
    if (input.minQty !== undefined && input.minQty < 0) {
      return { status: 400, message: "minQty cannot be negative" };
    }

    if (input.minValue !== undefined && input.minValue < 0) {
      return { status: 400, message: "minValue cannot be negative" };
    }

    if (input.benefitQty !== undefined && input.benefitQty < 0) {
      return { status: 400, message: "benefitQty cannot be negative" };
    }

    if (input.BenefitLimit !== undefined && input.BenefitLimit < 0) {
      return { status: 400, message: "BenefitLimit cannot be negative" };
    }

    if (
      input.slabFrom !== undefined &&
      input.slabTo !== undefined &&
      input.slabFrom > input.slabTo
    ) {
      return {
        status: 400,
        message: "slabFrom cannot be greater than slabTo",
      };
    }

    /* =====================================================
     5️⃣ FK VALIDATION (SAFE)
    ===================================================== */

    // CUSTOMER
    if (input.customerId !== undefined) {
      if (input.customerId === null) {
        return { status: 400, message: "Customer cannot be null" };
      }

      const customer = await this.customerRepository.findOne({
        where: { customerId: input.customerId, isDeleted: false },
      });

      if (!customer) {
        return { status: 404, message: "Invalid customer" };
      }

      scheme.customer = customer;
    }

    // PRODUCT
    if (input.productId !== undefined) {
      if (input.productId === null) {
        return { status: 400, message: "Product cannot be null" };
      }

      const product = await this.productRepository.findOne({
        where: { productId: input.productId, isDeleted: false },
      });

      if (!product) {
        return { status: 404, message: "Invalid product" };
      }

      scheme.product = product;
    }

    // SKU
    if (input.skuId !== undefined) {
      if (input.skuId === null) {
        return { status: 400, message: "SKU cannot be null" };
      }

      const sku = await this.skuRepository.findOne({
        where: { skuId: input.skuId, isDeleted: false },
      });

      if (!sku) {
        return { status: 404, message: "Invalid SKU" };
      }

      if (scheme.product && sku.productId !== scheme.product.productId) {
        return {
          status: 400,
          message: "SKU does not belong to selected product",
        };
      }

      scheme.sku = sku;
    }

    // WAREHOUSE
    if (input.warehouseId !== undefined) {
      if (input.warehouseId === null) {
        return { status: 400, message: "Warehouse cannot be null" };
      }

      const warehouse = await this.warehouseRepository.findOne({
        where: {
          warehouseId: String(input.warehouseId),
          isDeleted: false,
        },
      });

      if (!warehouse) {
        return { status: 404, message: "Invalid warehouse" };
      }

      scheme.warehouse = warehouse;
    }

    // BEAT
 if (input.beatId !== undefined) {
  if (input.beatId === null) {
    scheme.beat = null as any;
  } else {
    const beat = await this.beatRepo.findOne({
      where: { beatId: input.beatId, isDeleted: false },
    });

    if (!beat) {
      return { status: 404, message: "Invalid beat" };
    }

    scheme.beat = beat as any; // 🔥 FIX
  }
}

    // POSM
    if (input.posmId !== undefined) {
      if (input.posmId === null) {
        scheme.posm = null as any;
      } else {
        const posm = await this.posmRepository.findOne({
          where: { posmId: input.posmId, is_deleted: false },
        });

        if (!posm) {
          return { status: 404, message: "Invalid POSM" };
        }

        scheme.posm = posm as any; // 🔥 FIX
      }
    }

    /* =====================================================
     6️⃣ OTHER FIELDS
    ===================================================== */
    Object.assign(scheme, {
      schemeType: input.schemeType ?? scheme.schemeType,
      schemeNature: input.schemeNature ?? scheme.schemeNature,
      status: input.status ?? scheme.status,
      priority: input.priority ?? scheme.priority,
      autoApply: input.autoApply ?? scheme.autoApply,
      minQty: input.minQty ?? scheme.minQty,
      minValue: input.minValue ?? scheme.minValue,
      slabFrom: input.slabFrom ?? scheme.slabFrom,
      slabTo: input.slabTo ?? scheme.slabTo,
      benefitType: input.benefitType ?? scheme.benefitType,
      benefitQty: input.benefitQty ?? scheme.benefitQty,
      BenefitLimit: input.BenefitLimit ?? scheme.BenefitLimit,
      isClaimable: input.isClaimable ?? scheme.isClaimable,
      claimPeriod: input.claimPeriod ?? scheme.claimPeriod,
      isEnable: input.isEnable ?? scheme.isEnable,
    });

    /* =====================================================
     7️⃣ SAVE
    ===================================================== */
    const saved = await this.getRepositry.save(scheme);

    return {
      status: STATUSCODES.SUCCESS,
      message: "Scheme updated successfully",
      data: saved,
    };

  } catch (error: any) {
    console.error("Update Scheme Error:", error);

    return {
      status: STATUSCODES.BAD_REQUEST,
      message: error.message || "Failed to update scheme",
    };
  }
}

// async deleteByIdOrName(payload: IUser, input: DeleteSchemeDto): Promise<IApiResponse> {
//   const { id, schemeName } = input;

//   if (!id && (!schemeName || schemeName.trim() === "")) {
//     return {
//       status: STATUSCODES.BAD_REQUEST,
//       message: "Provide at least id or schemeName to delete",
//     };
//   }

//   const query = this.getRepositry.createQueryBuilder()
//     .update()
//     .set({ isDeleted: true, updatedAt: new Date() });

//   const conditions: string[] = [];
//   const params: any = {};

//   if (id) {
//     conditions.push("id = :id");
//     params.id = id;
//   }

//   if (schemeName) {
//     conditions.push("schemeName = :name");
//     params.name = schemeName;
//   }

//   query.where(conditions.join(" AND ") + " AND is_deleted = false", params);

//   const result = await query.execute();

//   if (!result.affected) {
//     return {
//       status: STATUSCODES.NOT_FOUND,
//       message: "Scheme not found or already deleted",
//     };
//   }

//   return {
//     status: STATUSCODES.SUCCESS,
//     message: "Scheme deleted successfully",
//   };
// }


async getAllSchemes(input: GetAllSchemeDto,payload: IUser): Promise<IApiResponse> {
    try {
      const query = this.getRepositry.createQueryBuilder("scheme")
        .where("scheme.isDeleted = :isDeleted", { isDeleted: false });

      if (input.schemeType) query.andWhere("scheme.schemeType = :schemeType", { schemeType: input.schemeType });
      if (input.schemeNature) query.andWhere("scheme.schemeNature = :schemeNature", { schemeNature: input.schemeNature });
      if (input.status) query.andWhere("scheme.status = :status", { status: input.status });
      if (input.customerId) query.andWhere("scheme.customerId = :customerId", { customerId: input.customerId });
      if (input.productId) query.andWhere("scheme.productId = :productId", { productId: input.productId });
      if (input.skuId) query.andWhere("scheme.skuId = :skuId", { skuId: input.skuId });
      if (input.warehouseId) query.andWhere("scheme.warehouseId = :warehouseId", { warehouseId: input.warehouseId });
      if (input.posmId) query.andWhere("scheme.posmId = :posmId", { posmId: input.posmId });
      if (input.beatId) query.andWhere("scheme.beatId = :beatId", { beatId: input.beatId });
      if (input.isEnable !== undefined) query.andWhere("scheme.isEnable = :isEnable", { isEnable: input.isEnable });
      // if (input.isDeleted !== undefined) query.andWhere("scheme.isDeleted = :isDeleted", { isDeleted: false });
      if (input.startDateFrom) query.andWhere("scheme.startDate >= :startDateFrom", { startDateFrom: input.startDateFrom });
      if (input.startDateTo) query.andWhere("scheme.startDate <= :startDateTo", { startDateTo: input.startDateTo });
      if (input.endDateFrom) query.andWhere("scheme.endDate >= :endDateFrom", { endDateFrom: input.endDateFrom });
      if (input.endDateTo) query.andWhere("scheme.endDate <= :endDateTo", { endDateTo: input.endDateTo });

      const schemes = await query.getMany();

      return {
        message: "Success.",
        status: STATUSCODES.SUCCESS,
        data: schemes,
      };
    } catch (error) {
      throw error;
    }
  }

async getScheme(input: GetSchemeDto): Promise<IApiResponse> {
    try {
      const { id, schemeName } = input;

      if (!id && !schemeName) {
        return {
          status: STATUSCODES.BAD_REQUEST,
          message: "Please provide either scheme ID or scheme name",
          data: null,
        };
      }

      // If ID is provided, return exactly one scheme
      if (id) {
        const scheme = await this.getRepositry.findOne({
          where: { id ,isDeleted:false},
          relations: ["customer", "customerType", "product", "sku", "warehouse", "posm"],
        });

        if (!scheme) {
          return {
            status: STATUSCODES.NOT_FOUND,
            message: "Scheme not found",
            data: null,
          };
        }

        return {
          status: STATUSCODES.SUCCESS,
          message: "Scheme fetched successfully",
          data: scheme,
        };
      }
      // If schemeName is provided, return all matching schemes
      const schemes = await this.getRepositry.find({
        where: { schemeName ,isDeleted:false },
        relations: ["customer", "customerType", "product", "sku", "warehouse", "posm"],
      });

      if (!schemes.length) {
        return {
          status: STATUSCODES.NOT_FOUND,
          message: "Schemes not found",
          data: null,
        };
      }

      return {
        status: STATUSCODES.SUCCESS,
        message: "Schemes fetched successfully",
        data: schemes,
      };
    } catch (err: any) {
      console.error("Get Scheme error:", err);
      return {
        status: STATUSCODES.BAD_REQUEST,
        message: "Failed to fetch scheme",
        data: err?.message || err,
      };
    }
  }


async deleteScheme(input: DeleteSchemeDto, payload: IUser): Promise<IApiResponse> {
  try {
    const { id, schemeName } = input;

    if (!id && !schemeName) {
      return {
        status: STATUSCODES.BAD_REQUEST,
        message: "Please provide either scheme ID or scheme name",
        data: null
      };
    }

    let deletedSchemes = [];

    if (id) {
      // Delete by ID
      const scheme = await this.getRepositry.findOne({ where: { id } });
      if (!scheme) {
        return { status: STATUSCODES.NOT_FOUND, message: "Scheme not found", data: null };
      }

      if (scheme.isDeleted) {
        return { status: STATUSCODES.NOT_FOUND, message: "Scheme already deleted", data: null };
      }

      scheme.isDeleted = true;
      deletedSchemes.push(await this.getRepositry.save(scheme));
    } else if (schemeName) {
      // Delete by schemeName (all matching)
      const schemes = await this.getRepositry.find({ where: { schemeName } });
      if (!schemes.length) {
        return { status: STATUSCODES.NOT_FOUND, message: "Schemes not found", data: null };
      }

      // Soft delete all
      for (const s of schemes) {
        if (!s.isDeleted) {
          s.isDeleted = true;
          deletedSchemes.push(await this.getRepositry.save(s));
        }
      }

      if (!deletedSchemes.length) {
        return { status: STATUSCODES.NOT_FOUND, message: "All schemes already deleted", data: null };
      }
    }

    return {
      status: STATUSCODES.SUCCESS,
      message: "Scheme(s) deleted successfully",
      data: deletedSchemes
    };
  } catch (err: any) {
    console.error("Delete Scheme error:", err);
    return {
      status: STATUSCODES.BAD_REQUEST,
      message: "Failed to delete scheme",
      data: err?.message || err
    };
  }
}


}

export { SchemeController as SchemeService }