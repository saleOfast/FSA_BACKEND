import {  STATUSCODES} from "../../../../core/types/Constent/common";
import { IApiResponse } from "../../../../core/types/Constent/commonService";
import { IUser } from "../../../../core/types/AuthService/AuthService";
import { GrnHeaderCreateDto, GrnHeaderDeleteDto, GrnHeaderGetDto, GrnHeaderListDto, GrnHeaderUpdateDto } from "../../../../core/types/grnHeaderService/grnHeaderService";
import { GrnHeader, GrnHeaderRepository } from "../../../../core/DB/Entities/grnHeader.entity";
import { Warehouse } from "../../../../core/DB/Entities/warehouse.entity";

class GrnHeaderController {
    private grnHeaderRepo = GrnHeaderRepository();
    private warehouseRepo = Warehouse.getRepository();

    constructor() {}

    async createGrnHeader(input: GrnHeaderCreateDto, payload:IUser):Promise<IApiResponse>{
        try{

            const {...inputData} = input;
            const grnHeader = this.grnHeaderRepo.create({
                ...inputData,
                createdBy: payload.emp_id
            });
            if(inputData.warehouseId){
                const warehouse = await this.warehouseRepo.findOne({where:{warehouseId: inputData.warehouseId}});
                if(!warehouse) return {
                    status: STATUSCODES.NOT_FOUND,
                    message: "Warehouse not found",
                    data: null
                }
            }
            await this.grnHeaderRepo.save(grnHeader);
            return {
                status: STATUSCODES.SUCCESS,
                message: "GRN Header created successfully",
                data: grnHeader
            };
        }catch(error){
            throw error;

    }
        
    }

async updateGrnHeader(input: GrnHeaderUpdateDto, payload:IUser):Promise<IApiResponse>{
    try{
        const {...inputData} = input;
        const grnHeader = await this.grnHeaderRepo.findOne({where:{grnId: inputData.grnId}});
        if(!grnHeader)  return {            
            status: STATUSCODES.NOT_FOUND,
            message: "GRN Header not found",
            data: null
        }
        Object.assign(grnHeader, inputData);
        await this.grnHeaderRepo.save(grnHeader);
        return {
            status: STATUSCODES.SUCCESS,
            message: "GRN Header updated successfully",
            data: grnHeader
        };
    }catch(error){
        throw error;
    }
}

async deleteGrnHeader(input: GrnHeaderDeleteDto, payload:IUser):Promise<IApiResponse>{
    try{
        const {...inputData} = input;
        const grnHeader = await this.grnHeaderRepo.findOne({where:{grnId: inputData.grnId}});
        if(!grnHeader)  return {
            status: STATUSCODES.NOT_FOUND,
            message: "GRN Header not found",
            data: null
        }

          if (grnHeader.isDeleted) {
      return {
        status: STATUSCODES.BAD_REQUEST,
        message: "GRN Header already deleted",
        data: null
      };
    }
        grnHeader.isDeleted = true;
        await this.grnHeaderRepo.save(grnHeader);
        return {
            status: STATUSCODES.SUCCESS,
            message: "GRN Header deleted successfully",
            data: null
        };
    }catch(error){
        throw error;
    }
}

async getGrnHeaderById(
  input: GrnHeaderGetDto,
  payload: IUser
): Promise<IApiResponse> {
  try {
    const { grnId } = input;

    const grnHeader = await this.grnHeaderRepo
      .createQueryBuilder('grn')
      .where('grn.grnId = :grnId', { grnId })
      
      .andWhere('grn.isDeleted = false')
      .getOne();

    if (!grnHeader) {
      return {
        status: STATUSCODES.NOT_FOUND,
        message: 'GRN Header not found',
        data: null
      };
    }

    return {
      status: STATUSCODES.SUCCESS,
      message: 'GRN Header fetched successfully',
      data: {...grnHeader,poId: grnHeader.poId,createdBy: payload.emp_id,createdAt: grnHeader.createdAt}
    };
  } catch (error) {
    throw error;
  }
}

async listGrnHeader(input:GrnHeaderListDto, payload:IUser):Promise<IApiResponse>{ 
    try {
        const query = this.grnHeaderRepo.createQueryBuilder('grn')
        .where('grn.isDeleted = false');
        if(input.grnId){
            query.andWhere('grn.grnId = :grnId', { grnId: input.grnId });
        }

        const grnHeaders = await query.getMany();
        return {
            status: STATUSCODES.SUCCESS,
            message: "GRN Headers fetched successfully",
            data: grnHeaders
        };
    } catch (error) {
        throw error;
    }
}

}
export { GrnHeaderController as GrnHeaderService }
