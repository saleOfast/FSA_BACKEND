import {Posm,PosmRepository} from "../../../../core/DB/Entities/posm.entity"
import {IPosm} from "../../../../core/types/PosmService/PosmService"
import {  STATUSCODES} from "../../../../core/types/Constent/common";
import { IApiResponse } from "../../../../core/types/Constent/commonService";
import { IUser } from "../../../../core/types/AuthService/AuthService";
import { Distributor, DistributorRepository} from "../../../../core/DB/Entities/distributors.entity";
import { createPosmDto, updatePosmDto, deletePosmDto,getPosmByIdDto,GetPosmListDto} from "../../../../core/types/PosmService/PosmService";

class PosmController{
    private posmRepository=PosmRepository()
    private distributorRepository= DistributorRepository()

    constructor() { }

  async createposm(input: createPosmDto, payload: IUser): Promise<IApiResponse> {
    try {
      const {
        posmCode,
        posmName,
        posmType,
        quantityAllocated,
        quantityDistributed,
        quantityReturned,
        distributorId,
        outletId,
        campaignId,
        startDate,
        endDate,
        status,
        assignedTo,
      } = input;

      const { emp_id } = payload;

      // Check if POSM code already exists
      const existingPosm = await this.posmRepository.findOne({ where: { posmCode } });
      if (existingPosm) {
        return { status: STATUSCODES.BAD_REQUEST, message: "POSM code already exists." };
      }

      // Validate distributor
let distributorEntity: Distributor | null = null;

if (distributorId) {
  distributorEntity = await this.distributorRepository.findOne({
    where: { distributorId },
  });

  if (!distributorEntity) {
    return { status: STATUSCODES.BAD_REQUEST, message: "Invalid distributorId" };
  }
}

// Assign relation

      // Quantities validation
      if (quantityAllocated < 0 || quantityDistributed < 0) {
        return { status: STATUSCODES.BAD_REQUEST, message: "Quantities cannot be negative" };
      }
      if (quantityReturned && quantityReturned < 0) {
        return { status: STATUSCODES.BAD_REQUEST, message: "quantityReturned cannot be negative" };
      }

      // Create new POSM entity
      const newPosm = new Posm();
      newPosm.posmCode = posmCode;
      newPosm.posmName = posmName;
      newPosm.posmType = posmType;
      newPosm.quantityAllocated = quantityAllocated;
      newPosm.quantityDistributed = quantityDistributed;
      newPosm.quantityReturned = quantityReturned ?? 0;
      newPosm.distributor = distributorEntity ?? undefined; // assign the relation directly
      newPosm.outletId = outletId;
      newPosm.campaignId = campaignId;
      newPosm.startDate = new Date(startDate).toISOString().split("T")[0];
      newPosm.endDate = endDate ? new Date(endDate).toISOString().split("T")[0] : undefined;

      newPosm.status = status;
      newPosm.assignedTo = assignedTo;

      // Audit fields
      newPosm.createdDate = new Date();
      newPosm.lastUpdatedDate = new Date();

      // Save to DB
      await this.posmRepository.save(newPosm);

      // Prepare response
      const responsePosm = {
        ...newPosm,
        id: newPosm.posmId,
       
      };

      return { status: STATUSCODES.SUCCESS, message: "POSM created successfully", data: responsePosm };
    } catch (error) {
      console.error("Error creating POSM:", error);
       throw error;
    }
  }

  
 async updatePosm(posmId:number ,input: updatePosmDto, payload: IUser):Promise<IApiResponse>{
      try {
    // 🔎 Check if the POSM exists
    const posm = await this.posmRepository.findOne({ where: { posmId } });

    if (!posm) {
      return { status: STATUSCODES.NOT_FOUND, message: "POSM not found" };
    }

    // ⚡ Run the update query
    await this.posmRepository
      .createQueryBuilder()
      .update(Posm)
      .set({
        posmCode: input.posmCode ?? posm.posmCode,
        posmName: input.posmName ?? posm.posmName,
        posmType: input.posmType ?? posm.posmType,
        quantityAllocated: input.quantityAllocated ?? posm.quantityAllocated,
        quantityDistributed: input.quantityDistributed ?? posm.quantityDistributed,
        quantityReturned: input.quantityReturned ?? posm.quantityReturned,
        distributorId: input.distributorId ?? posm.distributorId,
        outletId: input.outletId ?? posm.outletId,
        campaignId: input.campaignId ?? posm.campaignId,
        startDate: input.startDate ?? posm.startDate,
        endDate: input.endDate ?? posm.endDate,
        status: ["Active", "Inactive", "Returned", "Lost"].includes(input.status ?? "")
          ? input.status
          : posm.status,
        assignedTo: input.assignedTo ?? posm.assignedTo,
      
        lastUpdatedDate: new Date(),
      })
        .where("posmId = :posmId", { posmId })   // ✅ FIXED
  .execute();

    return { status: STATUSCODES.SUCCESS, message: "POSM updated successfully" };
  } catch (error) {
    throw error;
  }
 }

 async deletePosm(input:deletePosmDto ,payload :IUser):Promise<IApiResponse>{
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

  async getPosm(input:getPosmByIdDto , payload:IUser):Promise<IApiResponse>{

 try {
      const { posmId, posmCode, posmName } = input;

      const query = await this.posmRepository
        .createQueryBuilder("posm");

      // 🔎 Apply filters if provided
      if (posmId) query.andWhere("posm.posmId = :posmId", { posmId });
      if (posmCode) query.andWhere("posm.posmCode = :posmCode", { posmCode });
      if (posmName) query.andWhere("posm.posmName = :posmName", { posmName });

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

  async listPosms(input: GetPosmListDto, payload: IUser): Promise<IApiResponse> {
    try {
      const query = this.posmRepository.createQueryBuilder("posm");

      // Apply filters if provided
      if (input.posmId) query.andWhere("posm.posmId = :posmId", { posmId: input.posmId });
      if (input.posmCode) query.andWhere("LOWER(posm.posmCode) LIKE :posmCode", { posmCode: `%${input.posmCode.toLowerCase()}%` });
      if (input.posmName) query.andWhere("LOWER(posm.posmName) LIKE :posmName", { posmName: `%${input.posmName.toLowerCase()}%` });
      if (input.posmType) query.andWhere("LOWER(posm.posmType) LIKE :posmType", { posmType: `%${input.posmType.toLowerCase()}%` });
      if (input.status) query.andWhere("posm.status = :status", { status: input.status });
      if (input.distributorId) query.andWhere("posm.distributorId = :distributorId", { distributorId: input.distributorId });
      if (input.outletId) query.andWhere("posm.outletId = :outletId", { outletId: input.outletId });
      if (input.campaignId) query.andWhere("posm.campaignId = :campaignId", { campaignId: input.campaignId });

      // Order by POSM name
      query.orderBy("posm.posmId", "ASC");

      const posms = await query.getMany();

      return {
        status: 200,
        message: "POSM list fetched successfully",
        data: posms,
      };
    } catch (error) {
      throw error;
    }
  }
}

export {PosmController as PosmService}



