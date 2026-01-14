import { IApiResponse } from "../../../../core/types/Constent/commonService";
import { IUser } from "../../../../core/types/AuthService/AuthService";
import { CreateSchemeDto, IScheme, UpdateSchemeDto ,GetAllSchemeDto,GetSchemeDto, DeleteSchemeDto} from "../../../../core/types/SchemeService/SchemeService";
import { STATUSCODES, UserRole } from "../../../../core/types/Constent/common";
import { getSchemeRepository } from "../../../../core/DB/Entities/scheme.entity";

class SchemeController {
    private getRepositry = getSchemeRepository()

    constructor() { }

 async createScheme(
  payload: IUser,
  input: CreateSchemeDto
): Promise<IApiResponse> {
  try {
    const { emp_id } = payload;

    const {
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

    const newScheme = this.getRepositry.create({
      schemeName,
      schemeType,
      schemeNature,
      startDate,
      endDate,
      status,
      priority,
      autoApply,

      // relations (IDs → entity refs)
      customer: customerId ? ({ customerId } as any) : undefined,
      customerType: customerTypeId ? ({ customerTypeId } as any) : undefined,
      products: productId ? ({ productId } as any) : undefined,
      sku: skuId ? ({ skuId } as any) : undefined,
      warehouse: warehouseId ? ({ warehouseId } as any) : undefined,
      posm: posmId ? ({ posmId } as any) : undefined,

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
      createdBy: emp_id,
    });

    const savedScheme = await this.getRepositry.save(newScheme);

    return {

      message: "Success.",
      status: STATUSCODES.SUCCESS,
      data: savedScheme,
    };
  } catch (error) {
    throw error;
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

    // Build update object
    const updateData: Partial<UpdateSchemeDto & { updatedAt: Date }> = {
      updatedAt: new Date(),
    };

    // Only include fields that are present
    if (input.schemeName !== undefined) updateData.schemeName = input.schemeName;
    if (input.schemeType !== undefined) updateData.schemeType = input.schemeType;
    if (input.schemeNature !== undefined) updateData.schemeNature = input.schemeNature;
    if (input.startDate !== undefined) updateData.startDate = input.startDate;
    if (input.endDate !== undefined) updateData.endDate = input.endDate;
    if (input.status !== undefined) updateData.status = input.status;
    if (input.priority !== undefined) updateData.priority = input.priority;
    if (input.autoApply !== undefined) updateData.autoApply = input.autoApply;

    if (input.minQty !== undefined) updateData.minQty = input.minQty;
    if (input.minValue !== undefined) updateData.minValue = input.minValue;
    if (input.slabFrom !== undefined) updateData.slabFrom = input.slabFrom;
    if (input.slabTo !== undefined) updateData.slabTo = input.slabTo;

    if (input.benefitType !== undefined) updateData.benefitType = input.benefitType;
    if (input.benefitQty !== undefined) updateData.benefitQty = input.benefitQty;
    if (input.BenefitLimit !== undefined) updateData.BenefitLimit = input.BenefitLimit;
    if (input.isClaimable !== undefined) updateData.isClaimable = input.isClaimable;
    if (input.claimPeriod !== undefined) updateData.claimPeriod = input.claimPeriod;

    if (input.isEnable !== undefined) updateData.isEnable = input.isEnable;
    if (input.isDeleted !== undefined) updateData.isDeleted = input.isDeleted;

    // Safety check
    if (Object.keys(updateData).length === 1) {
      return {
        status: STATUSCODES.BAD_REQUEST,
        message: "No fields provided to update",
      };
    }

    const result = await this.getRepositry
      .createQueryBuilder()
      .update()
      .set(updateData)
      .where("id = :id AND is_deleted = false", { id })
      .execute();

    if (!result.affected) {
      return {
        status: STATUSCODES.NOT_FOUND,
        message: "Scheme not found or already deleted",
      };
    }

    const updatedScheme = await this.getRepositry.findOne({
      where: { id },
    });

    return {
      status: STATUSCODES.SUCCESS,
      message: "Scheme updated successfully",
      data: updatedScheme,
    };
  } catch (error) {
    throw error;
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
          relations: ["customer", "customerType", "products", "sku", "warehouse", "posm"],
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
        relations: ["customer", "customerType", "products", "sku", "warehouse", "posm"],
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