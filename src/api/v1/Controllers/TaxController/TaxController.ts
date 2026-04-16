import { IApiResponse } from "../../../../core/types/Constent/commonService";
import { Taxes, TaxesRepository } from "../../../../core/DB/Entities/tax.entity";
import { STATUSCODES, TimelineEnum, UserRole } from "../../../../core/types/Constent/common";
import { ITaxes, TaxesC, TaxesD, TaxesR, TaxesU,getTaskById } from "../../../../core/types/TaxesService/TaxesService";
import { IUser } from "../../../../core/types/AuthService/AuthService";
import { UserRepository } from "../../../../core/DB/Entities/User.entity";
import { Between, IsNull, Not } from "typeorm";
import { CountryRepository,Country } from "../../../../core/DB/Entities/country.entity";
import { StateRepository ,State} from "../../../../core/DB/Entities/state.entity";
import {
  TaxClassification,
  TaxComponent,
  SupplyType,
  YesNo,
} from "../../../../core/types/Constent/common";


class TaxesService {
    private TaxesRepository = TaxesRepository();
    private userRespositry = UserRepository()
    private Country=CountryRepository();
    private state=StateRepository();

    constructor() { }

async createTaxes(input: TaxesC, payload: IUser): Promise<IApiResponse> {
  try {
    // ================= 1. REQUIRED COUNTRY & STATE =================
    if (!input.countryId) {
      return {
        status: STATUSCODES.BAD_REQUEST,
        message: "countryId is required",
        data: null,
      };
    }

    if (!input.stateId) {
      return {
        status: STATUSCODES.BAD_REQUEST,
        message: "stateId is required",
        data: null,
      };
    }

    const countryId = Number(input.countryId);
    const stateId = Number(input.stateId);

    if (isNaN(countryId)) {
      return {
        status: STATUSCODES.BAD_REQUEST,
        message: "countryId must be a number",
        data: null,
      };
    }

    if (isNaN(stateId)) {
      return {
        status: STATUSCODES.BAD_REQUEST,
        message: "stateId must be a number",
        data: null,
      };
    }

    // ================= 2. COUNTRY EXISTS =================
    const countryExists = await this.Country.exists({
      where: { countryId,deletedAt: IsNull() },
    });

    if (!countryExists) {
      return {
        status: STATUSCODES.BAD_REQUEST,
        message: "Country does not exist",
        data: null,
      };
    }

    // ================= 3. STATE BELONGS TO COUNTRY =================
    const stateExists = await this.state.exists({
      where: {
        stateId, isDeleted: false,
        country: { countryId, deletedAt: IsNull() },
      },
    });

    if (!stateExists) {
      return {
        status: STATUSCODES.BAD_REQUEST,
        message: "State does not belong to the given country",
        data: null,
      };
    }

    // ================= 4. EFFECTIVE DATE VALIDATION =================
    if (input.effectiveTo && input.effectiveTo < input.effectiveFrom) {
      return {
        status: STATUSCODES.BAD_REQUEST,
        message: "effectiveTo cannot be earlier than effectiveFrom",
        data: null,
      };
    }

    // ================= 5. DUPLICATE TAX RULE CHECK =================
    const existingRule = await this.TaxesRepository.findOne({
      where: {
        taxClassification: input.taxClassification,
        taxComponent: input.taxComponent,
        supplyType: input.supplyType,
        isSez: input.isSez ?? YesNo.NO,
        isExport: input.isExport ?? YesNo.NO,
        isRcm: input.isRcm ?? YesNo.NO,
        isActive: YesNo.YES,
        country: { countryId },
        state: { stateId },
      },
    });

    if (existingRule) {
      return {
        status: STATUSCODES.CONFLICT,
        message: "Tax rule already exists for this country and state",
        data: null,
      };
    }

    // ================= 6. CREATE ENTITY =================
    const taxRule = new Taxes();

    taxRule.taxClassification = input.taxClassification;
    taxRule.hsnCode = input.hsnCode ?? "";
    taxRule.sacCode = input.sacCode ?? "";
    taxRule.taxComponent = input.taxComponent;
    taxRule.taxPercentage = input.taxPercentage;
    taxRule.supplyType = input.supplyType;

    taxRule.isSez = input.isSez ?? YesNo.NO;
    taxRule.isExport = input.isExport ?? YesNo.NO;
    taxRule.isRcm = input.isRcm ?? YesNo.NO;
    taxRule.isTaxable = input.isTaxable ?? YesNo.YES;

    taxRule.effectiveFrom = input.effectiveFrom;
    taxRule.effectiveTo = input.effectiveTo ?? null;
    taxRule.priority = input.priority ?? 1;
    taxRule.isActive = input.isActive ?? YesNo.YES;

    // ================= 7. ASSIGN RELATIONS =================
    taxRule.country = { countryId } as Country;
    taxRule.state = { stateId } as State;

    // ================= 8. SAVE =================
    const savedTaxRule = await this.TaxesRepository.save(taxRule);

    return {
      status: STATUSCODES.SUCCESS,
      message: "Tax rule created successfully",
      data: savedTaxRule,
    };
  } catch (error) {
    throw error;
  }
}


    async getTaxes(input: TaxesR, payload: IUser): Promise<IApiResponse> {
        try {
          const TaxesList = await this.TaxesRepository.createQueryBuilder("tax")
  .select([
    "tax.taxId",
    "tax.taxClassification",
    "tax.hsnCode",
    "tax.sacCode",
    "tax.taxComponent",
    "tax.taxPercentage",
    "tax.supplyType",
    "tax.isSez",
    "tax.isExport",
    "tax.isRcm",
    "tax.isTaxable",
    "tax.effectiveFrom",
    "tax.effectiveTo",
    "tax.priority",
    "tax.isActive",
    "tax.createdAt",
    "tax.updatedAt",
    "country.countryId",
    "state.stateId"
  ])
  .leftJoin("tax.country", "country")
  .leftJoin("tax.state", "state")
  .where("tax.isDeleted = :isDeleted", { isDeleted: false })
  .orderBy("tax.createdAt", "DESC")
  .getMany();


      if (!TaxesList || TaxesList.length === 0) {
      return {
        status: STATUSCODES.NOT_FOUND,
        message: "Taxes data not found",
        data: [],
      };
    }

            return { status: STATUSCODES.SUCCESS, message: "Taxes list retrieved successfully.", data: TaxesList };
        } catch (error) {
            console.error(error);
            throw new Error("Something went wrong");
        }
    }

async getTaxesById(payload: IUser, input: getTaskById): Promise<IApiResponse> {
  try {
    const { taxId } = input;

    const Taxes = await this.TaxesRepository.createQueryBuilder("tax")
      .select([
        "tax.taxId",
        "tax.taxClassification",
        "tax.hsnCode",
        "tax.sacCode",
        "tax.taxComponent",
        "tax.taxPercentage",
        "tax.supplyType",
        "tax.isSez",
        "tax.isExport",
        "tax.isRcm",
        "tax.isTaxable",
        "tax.effectiveFrom",
        "tax.effectiveTo",
        "tax.priority",
        "tax.isActive",
            "country.countryId",
        "state.stateId",
        "tax.createdAt",
        "tax.updatedAt",
    
      ])
      .leftJoin("tax.country", "country")
      .leftJoin("tax.state", "state")
      .where("tax.taxId = :taxId", { taxId: Number(taxId) })
      .andWhere("tax.isDeleted = :isDeleted", { isDeleted: false })
      .getOne();

    if (!Taxes) {
      return {
        status: STATUSCODES.NOT_FOUND,
        message: "Tax not found",
        data: null,
      };
    }

    return {
      status: STATUSCODES.SUCCESS,
      message: "Tax retrieved successfully",
      data: Taxes,
    };

  } catch (error) {
    console.error(error);
    throw new Error("Something went wrong");
  }
}

async editTaxes(input: TaxesU, payload: IUser): Promise<IApiResponse> {
    try {
        const { taxId, countryId, stateId, ...otherFields } = input;

        // 1️⃣ Validate taxId
        if (!taxId) {
            return {
                status: STATUSCODES.BAD_REQUEST,
                message: "taxId is required.",
                data: null
            };
        }

        // 2️⃣ Find existing tax record
        const existingTax = await this.TaxesRepository.findOne({
            where: { taxId: Number(taxId), isDeleted: false },
        });

        if (!existingTax) {
            return {
                status: STATUSCODES.NOT_FOUND,
                message: "Tax record does not exist.",
                data: null
            };
        }

        // 3️⃣ Prepare update object
        const updateData: any = { ...otherFields };

        // Handle country relation if provided
        if (countryId) {
            const countryExists = await this.Country.exists({ where: { countryId: Number(countryId) } });
            if (!countryExists) {
                return {
                    status: STATUSCODES.BAD_REQUEST,
                    message: "Country does not exist.",
                    data: null
                };
            }
            updateData.country = { countryId: Number(countryId) };
        }

        // Handle state relation if provided
        if (stateId) {
            const stateExists = await this.state.exists({ where: { stateId: Number(stateId) } });
            if (!stateExists) {
                return {
                    status: STATUSCODES.BAD_REQUEST,
                    message: "State does not exist.",
                    data: null
                };
            }
            updateData.state = { stateId: Number(stateId) };
        }

        // 4️⃣ Update the tax record
        await this.TaxesRepository.update({ taxId: Number(taxId) }, updateData);

        // 5️⃣ Fetch the updated record
        const updatedTax = await this.TaxesRepository.findOne({
            where: { taxId: Number(taxId), isDeleted: false },
            relations: ["country", "state"],
        });

        if (!updatedTax) {
            return {
                status: STATUSCODES.NOT_FOUND,
                message: "Failed to fetch updated tax record",
                data: null
            };
        }

        // 6️⃣ Map response to include only countryId and stateId
        const responseData = {
            ...updatedTax,
            country: updatedTax.country?.countryId ?? null,
            state: updatedTax.state?.stateId ?? null
        };

        return {
            status: STATUSCODES.SUCCESS,
            message: "Tax updated successfully.",
            data: responseData
        };
    } catch (error) {
       throw error;
    }
}


async deleteTaxes(input: TaxesD, payload: IUser): Promise<IApiResponse> {
    try {
        const { taxId } = input;

        // Find the tax record that is not already deleted
        const tax = await this.TaxesRepository.findOne({
            where: {
                taxId: Number(taxId),
                isDeleted: false
            }
        });

        if (!tax) {
            return {
                status: STATUSCODES.NOT_FOUND,
                message: "Tax record does not exist or is already deleted.",
                data: null
            };
        }

        if(tax.isDeleted){
            return { status: STATUSCODES.BAD_REQUEST, message: "Tax record is already deleted.", data: null };
        }
        // Soft delete
          // Update isDeleted to true
        await this.TaxesRepository.update({ taxId: tax.taxId }, { isDeleted: true });


        return {
            status: STATUSCODES.SUCCESS,
            message: "Tax deleted successfully.",
            data: null
        };
    } catch (error) {
        console.error("Error in deleteTaxes:", error);
        throw new Error("Something went wrong while deleting tax");
    }
}



}

export { TaxesService as Taxes }