import {Posm,PosmRepository} from "../../../../core/DB/Entities/posm.entity"
import {IPosm} from "../../../../core/types/PosmService/PosmService"
import {  STATUSCODES} from "../../../../core/types/Constent/common";
import { IApiResponse } from "../../../../core/types/Constent/commonService";
import { IUser } from "../../../../core/types/AuthService/AuthService";
import { CustomerRepository } from "../../../../core/DB/Entities/customer.entity";
import { CreatePosmDto, UpdatePosmDto, DeletePosmDto,GetPosmByIdDto,GetPosmListDto} from "../../../../core/types/PosmService/PosmService";


class PosmController{
    private posmRepository=PosmRepository()
    private customerRepository= CustomerRepository()

    constructor() { }

 async createPosm(
  input: CreatePosmDto,
  payload: IUser
): Promise<IApiResponse> {
  try {

    /* 🔹 1. DUPLICATE CHECK */
    const existingPosm = await this.posmRepository.findOne({
      where: {
        sku: input.sku,
        campaignId: input.campaignId,
      },
    });

    if (existingPosm) {
      return {
        status: STATUSCODES.BAD_REQUEST,
        message: "POSM already exists for this SKU and campaign",
      };
    }

    /* 🔹 2. CUSTOMER FK VALIDATION */
    const customerExists = await this.customerRepository.findOne({
      where: { customerId: input.customerId },
    });

    if (!customerExists) {
      return {
        status: STATUSCODES.BAD_REQUEST,
        message: "Invalid customerId",
      };
    }

    /* 🔹 3. BUSINESS VALIDATIONS */
    if (input.quantityAllocated <= 0) {
      return {
        status: STATUSCODES.BAD_REQUEST,
        message: "quantityAllocated must be greater than 0",
      };
    }

    if (input.unitCost && input.unitCost < 0) {
      return {
        status: STATUSCODES.BAD_REQUEST,
        message: "unitCost cannot be negative",
      };
    }

    if (input.claimedTarget && input.claimedTarget < 0) {
      return {
        status: STATUSCODES.BAD_REQUEST,
        message: "claimedTarget cannot be negative",
      };
    }

    /* 🔹 4. CREATE ENTITY */
    const posm = this.posmRepository.create({
      ...input,
    });

    await this.posmRepository.save(posm);

    return {
      status: STATUSCODES.SUCCESS,
      message: "POSM created successfully",
      data: posm,
    };
  } catch (error: any) {
    console.error("Create POSM error:", error);
    throw error;
  }
}


  
async updatePosm(
  posmId: number,
  input: UpdatePosmDto,
  payload: IUser
): Promise<IApiResponse> {
  try {
    /* 🔎 1. Check POSM exists */
    const posm = await this.posmRepository.findOne({ where: { posmId } });

    if (!posm) {
      return {
        status: STATUSCODES.NOT_FOUND,
        message: "POSM not found",
      };
    }

    /* 🔒 2. Business validations (ONLY if fields present) */
    if (input.quantityAllocated !== undefined && input.quantityAllocated <= 0) {
      return {
        status: STATUSCODES.BAD_REQUEST,
        message: "quantityAllocated must be greater than 0",
      };
    }

    if (input.unitCost !== undefined && input.unitCost < 0) {
      return {
        status: STATUSCODES.BAD_REQUEST,
        message: "unitCost cannot be negative",
      };
    }

    if (input.claimedTarget !== undefined && input.claimedTarget < 0) {
      return {
        status: STATUSCODES.BAD_REQUEST,
        message: "claimedTarget cannot be negative",
      };
    }

    /* 🔄 3. Apply updates */
    Object.assign(posm, input);

    await this.posmRepository.save(posm);

    return {
      status: STATUSCODES.SUCCESS,
      message: "POSM updated successfully",
      data: posm,
    };
  } catch (error) {
    throw error;
  }
}


 async deletePosm(input:DeletePosmDto ,payload :IUser):Promise<IApiResponse>{
  try{
    const{posmId}=input;
    const existingId= await this.posmRepository.findOne({where: {posmId}})
    if(!existingId){
      return {
       status: STATUSCODES.BAD_REQUEST, message: "POSM does not exists." 
      }
    }
         await this.posmRepository
  .createQueryBuilder()
  .update(Posm)
  .set({  is_deleted: true })   // ❌ Error here
  .where("posmId = :posmId", { posmId })
  .execute();


    return { status: 200, message: "Customer deleted successfully" };
  } catch (err: any) {
    return { status: 500, message: err.message };
  }
  }

  async getPosm(input:GetPosmByIdDto , payload:IUser):Promise<IApiResponse>{

 try {
      const { posmId} = input;

      const query = await this.posmRepository
        .createQueryBuilder("posm");

      // 🔎 Apply filters if provided
      if (posmId) query.andWhere("posm.posmId = :posmId", { posmId });
   

      const result = await query.getMany();

      if (!result || result.length === 0) {
        return {
          status: 404,
          message: "POSM not found",
        };
      }

      return {
        status: 200,
        message: "Success",
        data: result,
      };
    } catch (error) {
      throw error;
    }
  }

async listPosms(
  input: GetPosmListDto,
  payload: IUser
): Promise<IApiResponse> {
  try {
    const query = this.posmRepository
      .createQueryBuilder("posm")
      .where("posm.is_deleted = false"); // ✅ mandatory filter

    // 🔍 Filters (ONLY entity fields)
    if (input.posmId) {
      query.andWhere("posm.posmId = :posmId", { posmId: input.posmId });
    }

    if (input.posmName) {
      query.andWhere("LOWER(posm.posmName) LIKE :posmName", {
        posmName: `%${input.posmName.toLowerCase()}%`,
      });
    }

    if (input.posmType) {
      query.andWhere("posm.posmType = :posmType", {
        posmType: input.posmType,
      });
    }

    if (input.posmCategory) {
      query.andWhere("posm.posmCategory = :posmCategory", {
        posmCategory: input.posmCategory,
      });
    }

    if (input.materialType) {
      query.andWhere("posm.materialType = :materialType", {
        materialType: input.materialType,
      });
    }

    if (input.campaignId) {
      query.andWhere("posm.campaignId = :campaignId", {
        campaignId: input.campaignId,
      });
    }

    if (input.customerId) {
      query.andWhere("posm.customerId = :customerId", {
        customerId: input.customerId,
      });
    }

    // 📅 Optional date filter
    if (input.allocationDate) {
      query.andWhere("posm.allocationDate = :allocationDate", {
        allocationDate: input.allocationDate,
      });
    }

    // 🔢 Sorting
    query.orderBy("posm.posmId", "DESC");

    const posms = await query.getMany();

    return {
      status: STATUSCODES.SUCCESS,
      message: "POSM list fetched successfully",
      data: posms,
    };
  } catch (error) {
    throw error;
  }
}

}

export {PosmController as PosmService}