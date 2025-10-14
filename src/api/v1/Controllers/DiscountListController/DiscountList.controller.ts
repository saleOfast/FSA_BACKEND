import {STATUSCODES } from "../../../../core/types/Constent/common";
import { IUser } from "../../../../core/types/AuthService/AuthService";
import { IApiResponse } from "../../../../core/types/Constent/commonService";
import { User } from "../../../../core/DB/Entities/User.entity";
import {DiscountItemRepository,DiscountItem} from "../../../../core/DB/Entities/discountItem.entity"
import{DiscountListRepository,DiscountList } from "../../../../core/DB/Entities/discountList.entity"
// import { IUser } from "../../../../core/types/AuthService/AuthService";
import{CreateDiscountListDto,DiscountStatus,ListDiscountListsDto,GetDiscountListByIdDto,DeleteDiscountListDto, GetDiscountListByStatusDto,CreateDiscountItemDto,UpdateDiscountItemDto,DeleteDiscountItemDto,ListDiscountItemsDto,GetDiscountItemByIdDto,UpdateDiscountListDto} from "../../../../core/types/DiscountListService/DiscountListService"

 class DiscountController{

        private  ItemRepo=DiscountItemRepository();
        private  ListRepo=DiscountListRepository()
        private UserRepo=User.getRepository();

            constructor() { }

async createDiscountList(input: CreateDiscountListDto, payload: IUser): Promise<IApiResponse> {
  try {
    // // Ensure authenticated payload present
    // if (!payload || payload.emp_id === undefined || payload.emp_id === null) {
    //   return { status: STATUSCODES.ACCESS_DENIED, message: "Unauthorized" };
    // }
    // Check if discountListName already exists
    const existingList = await this.ListRepo.findOne({
      where: { discountListName: input.discountListName },
    });
    if (existingList) {
      return { status: STATUSCODES.BAD_REQUEST, message: "Discount List name already exists." };
    }

    // Create new Discount List
    const newList = new DiscountList();
    newList.discountListName = input.discountListName;
    newList.description = input.description ?? "";
    newList.startDate = new Date(input.startDate);
    newList.endDate = new Date(input.endDate);
    newList.discountType = input.discountType;
    newList.applicableProducts = input.applicableProducts ?? [];
    newList.applicableCategories = input.applicableCategories ?? [];
    newList.customerSegment = input.customerSegment ?? "";
    newList.minOrderValue = input.minOrderValue ?? 0;
    newList.maxDiscountAmount = input.maxDiscountAmount ?? 0;
    newList.usageLimit = input.usageLimit ?? 0;
    newList.status = input.status ?? DiscountStatus.ACTIVE;

    const user = await this.UserRepo.findOne({ where: { emp_id: payload.emp_id } });
   
        newList.createdByUser = user;
        newList.lastModifiedByUser = user;

    // Map Discount Items if provided
    if (input.items?.length) {
      newList.items = input.items.map((i) => {
        const item = new DiscountItem();
        // item.discountItemId = `DI-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
        item.productId = i.productId;
        item.discountValue = i.discountValue;
        item.discountConditionRules = i.discountConditionRules ?? "";
        item.priorityLevel = i.priorityLevel ?? 0;
        item.remarks = i.remarks ?? "";
        // set relations instead of read-only getter fields
        if (!user) {
          throw new Error("Authenticated user not found while creating discount items");
        }
        item.createdByUser = user;
        item.lastModifiedByUser = user;
        // owning side relation for cascade
        item.discountList = newList;
        return item;
      });
    }

    // Save Discount List along with items (cascade)
    await this.ListRepo.save(newList);

    // Build a plain response to avoid circular JSON (exclude relation objects)
    const responseData = {
      discountListId: newList.discountListId,
      discountListName: newList.discountListName,
      description: newList.description,
      startDate: newList.startDate,
      endDate: newList.endDate,
      discountType: newList.discountType,
      applicableProducts: newList.applicableProducts,
      applicableCategories: newList.applicableCategories,
      customerSegment: newList.customerSegment,
      minOrderValue: newList.minOrderValue,
      maxDiscountAmount: newList.maxDiscountAmount,
      usageLimit: newList.usageLimit,
      status: newList.status,
      createdDate: newList.createdDate,
      lastUpdatedDate: newList.lastUpdatedDate,
      createdBy: newList.createdBy,
      lastModifiedBy: newList.lastModifiedBy
    };

    return {
      status: STATUSCODES.SUCCESS,
      message: "Discount List created successfully",
      data: responseData,
    };
  } catch (error) {
    throw error;
  }
}

async getDiscountList(input:ListDiscountListsDto,payload:IUser):Promise<IApiResponse>{
    try{
           const query = this.ListRepo.createQueryBuilder("discountList");

      // Apply filters if provided
      if (input.discountListId) {
        query.andWhere("discountList.discountListId = :discountListId", { discountListId: input.discountListId });
      }

      if (input.discountListName) {
        query.andWhere("LOWER(discountList.discountListName) LIKE :discountListName", { discountListName: `%${input.discountListName.toLowerCase()}%` });
      }

      if (input.discountType) {
        query.andWhere("discountList.discountType = :discountType", { discountType: input.discountType });
      }

      if (input.status) {
        query.andWhere("discountList.status = :status", { status: input.status });
      }

      if (input.startDate) {
        query.andWhere("DATE(discountList.startDate) >= :startDate", { startDate: input.startDate });
      }

      if (input.endDate) {
        query.andWhere("DATE(discountList.endDate) <= :endDate", { endDate: input.endDate });
      }

      if (input.createdBy) {
        query.andWhere("discountList.createdByUser = :createdBy", { createdBy: input.createdBy });
      }

      if (input.lastModifiedBy) {
        query.andWhere("discountList.lastModifiedByUser = :lastModifiedBy", { lastModifiedBy: input.lastModifiedBy });
      }

      query.orderBy("discountList.startDate", "DESC");

      const discounts = await query.getMany();

      return {
        status: STATUSCODES.SUCCESS,
        message: "Discount list fetched successfully",
        data: discounts,
      };
    } catch (error) {
      throw error;
    }
    }

  async  getDiscountById(input:GetDiscountListByIdDto,payload:IUser):Promise<IApiResponse>{
try{
  const {  discountListId }=input

const existing = await this.ListRepo
  .createQueryBuilder("discount")
  .where("discount.discountListId = :discountListId", { discountListId }) // 👈 FIXED
  .getOne();

  if(!existing){
     return { message: "Discount Not Found.", status: STATUSCODES.NOT_FOUND }
  }
    return { message: "Success.", status: STATUSCODES.SUCCESS, data: existing }

    }
    catch(error){
      throw error
    }
  
}

async deleteDiscountList(input:DeleteDiscountListDto,payload:IUser):Promise<IApiResponse>{

    try{
           const { discountListId }=input; 
   const existing = await this.ListRepo.findOne({ 
  where: { discountListId, is_deleted: false }
});
    if (!existing) {
        return { status: STATUSCODES.NOT_FOUND, message: "Customer not found." };
    }
      await this.ListRepo.update(discountListId , { is_deleted: true });

    return { status: 200, message: "Customer deleted successfully" };
  } catch (err: any) {
    return { status: 500, message: err.message };
  }
}
    
async getDiscountListsByStatus(input: GetDiscountListByStatusDto): Promise<IApiResponse> {
  try {
    if (!input.status) {
      return {
        status: STATUSCODES.BAD_REQUEST,
        message: "Status is required (Active / Inactive / Expired)",
        data: [],
      };
    }

    // Normalize to lowercase
    const statusLower = input.status.toLowerCase();

    if (!["active", "inactive", "expired"].includes(statusLower)) {
      return {
        status: STATUSCODES.BAD_REQUEST,
        message: "Invalid status. Allowed values: Active, Inactive, Expired",
        data: [],
      };
    }

    // Case-insensitive filter
    const discountLists = await this.ListRepo
      .createQueryBuilder("discount")
      .where("discount.status::text ILIKE :status", { status: input.status })
      .andWhere("discount.is_deleted = false")   // ✅ avoid deleted ones
      .orderBy("discount.discountListName", "ASC")
      .getMany();

    if (!discountLists.length) {
      return {
        status: STATUSCODES.NOT_FOUND,
        message: `No ${input.status} discount lists found`,
        data: [],
      };
    }

    return {
      status: STATUSCODES.SUCCESS,
      message: `${input.status} discount lists fetched successfully`,
      data: discountLists,
    };
  } catch (error) {
    throw error;
  }
}



//update discountList

async updateDiscountList(
  discountListId: string,
  input: UpdateDiscountListDto,
  payload: IUser
): Promise<IApiResponse> {
  try {
    // 🔎 First check if the discount list exists
    const discountList = await this.ListRepo.findOne({ where: { discountListId, is_deleted: false } });
    if (!discountList) {
      return { status: STATUSCODES.NOT_FOUND, message: "Discount List not found" };
    }

    const user = await this.UserRepo.findOne({ where: { emp_id: payload.emp_id } });
if (!user) {
  return { status: STATUSCODES.BAD_REQUEST, message: "Authenticated user not found." };
}

    // ⚡ Run the update query dynamically
    await this.ListRepo
      .createQueryBuilder()
      .update(DiscountList)
      .set({
        
  discountListName: input.discountListName ?? discountList.discountListName,
  description: input.description ?? discountList.description,
  startDate: input.startDate ? new Date(input.startDate) : discountList.startDate,
  endDate: input.endDate ? new Date(input.endDate) : discountList.endDate,
  discountType: input.discountType ?? discountList.discountType,
  applicableProducts: input.applicableProducts ?? discountList.applicableProducts,
  applicableCategories: input.applicableCategories ?? discountList.applicableCategories,
  customerSegment: input.customerSegment ?? discountList.customerSegment,
  minOrderValue: input.minOrderValue ?? discountList.minOrderValue,
  maxDiscountAmount: input.maxDiscountAmount ?? discountList.maxDiscountAmount,
  usageLimit: input.usageLimit ?? discountList.usageLimit,
  status: input.status ?? discountList.status,

  lastUpdatedDate: new Date(),
  lastModifiedByUser: user// track who modified
      })
      .where("discountListId = :discountListId", { discountListId })
      .execute();

    return { status: STATUSCODES.SUCCESS, message: "Discount List updated successfully" };
  } catch (error: any) {
   throw error;
  }
}




//create discountItem

 async createDiscountItem(
    input: CreateDiscountItemDto,
    payload: IUser
  ): Promise<IApiResponse> {
    try {
      // Ensure authenticated payload present
      if (!payload || payload.emp_id === undefined || payload.emp_id === null) {
        return { status: STATUSCODES.ACCESS_DENIED, message: "Unauthorized" };
      }

         // 2️⃣ Check for duplicate product in the list
      const existingItem = await this.ItemRepo.findOne({
        where: {
          discountListId: input.discountListId,
          productId: input.productId,
        },
      });

      if (existingItem) {
        return {
          status: STATUSCODES.BAD_REQUEST,
          message: "Discount Item for this product already exists in the list.",
        };
      }
      // 1️⃣ Validate Discount List existence
      const discountList = await this.ListRepo.findOne({
        where: { discountListId: input.discountListId },
      });

      if (!discountList) {
        return {
          status: STATUSCODES.BAD_REQUEST,
          message: "Discount List not found for the provided ID.",
        };
      }

      // 3️⃣ Get authenticated user
      const user = await this.UserRepo.findOne({ where: { emp_id: payload.emp_id } });
      if (!user) throw new Error("Authenticated user not found");

      // 4️⃣ Create Discount Item entity
      const newItem = new DiscountItem();
      newItem.productId = input.productId;
      newItem.discountValue = input.discountValue;
      newItem.discountConditionRules = input.discountConditionRules ?? "";
      newItem.priorityLevel = input.priorityLevel ?? 0;
      newItem.remarks = input.remarks ?? "";
      newItem.discountList = discountList;
      newItem.createdByUser = user;
      newItem.lastModifiedByUser = user;

      // 5️⃣ Save to DB
      await this.ItemRepo.save(newItem);

      // 6️⃣ Build response
        const responseData = {
        discountItemId: newItem.discountItemId,
        productId: newItem.productId,
        discountValue: newItem.discountValue,
        discountConditionRules: newItem.discountConditionRules,
        priorityLevel: newItem.priorityLevel,
        remarks: newItem.remarks,
        discountListId: discountList.discountListId,
        createdDate: newItem.createdDate,
        lastUpdatedDate: newItem.lastUpdatedDate,
        createdBy: newItem.createdBy,
        lastModifiedBy: newItem.lastModifiedBy,
      };

      return {
        status: STATUSCODES.SUCCESS,
        message: "Discount Item created successfully",
        data: responseData,
      };
    } catch (error) {
      throw error;
    }
  }


 async updateDiscountItem(
  discountItemId:number,
  input: UpdateDiscountItemDto,
  payload: IUser
): Promise<IApiResponse> {
  try {
    // 1️⃣ Find existing Discount Item
    const discountItem = await this.ItemRepo.findOne({
      where: { discountItemId },
      relations: ["discountList", "createdByUser", "lastModifiedByUser"],
    });

    if (!discountItem) {
      return {
        status: STATUSCODES.BAD_REQUEST,
        message: "Discount Item not found for the provided ID.",
      };
    }

    // 2️⃣ Get authenticated user (for audit fields)
    const user = await this.UserRepo.findOne({ where: { emp_id: payload.emp_id } });
    if (!user) {
      return {
        status: STATUSCODES.BAD_REQUEST,
        message: "Authenticated user not found.",
      };
    }

    // 3️⃣ Update fields (only if provided)
    if (input.productId !== undefined) discountItem.productId = input.productId;
    if (input.discountValue !== undefined) discountItem.discountValue = input.discountValue;
    if (input.discountConditionRules !== undefined) discountItem.discountConditionRules = input.discountConditionRules;
    if (input.priorityLevel !== undefined) discountItem.priorityLevel = input.priorityLevel;
    if (input.remarks !== undefined) discountItem.remarks = input.remarks;

    // 4️⃣ Update audit fields
    discountItem.lastModifiedByUser = user;
    discountItem.lastUpdatedDate = new Date();

    // 5️⃣ Save updated entity
    await this.ItemRepo.save(discountItem);

    // 6️⃣ Build response
    const responseData = {
      discountItemId: discountItem.discountItemId,
      productId: discountItem.productId,
      discountValue: discountItem.discountValue,
      discountConditionRules: discountItem.discountConditionRules,
      priorityLevel: discountItem.priorityLevel,
      remarks: discountItem.remarks,
      discountListId: discountItem.discountList.discountListId,
      createdDate: discountItem.createdDate,
      lastUpdatedDate: discountItem.lastUpdatedDate,
      createdBy: discountItem.createdBy,
      lastModifiedBy: discountItem.lastModifiedBy,
    };

    return {
      status: STATUSCODES.SUCCESS,
      message: "Discount Item updated successfully.",
      data: responseData,
    };
  } catch (error) {
    throw error;
  }
}

 async deleteDiscountItem(input:DeleteDiscountItemDto , payload: IUser): Promise<IApiResponse> {
  try {
    const { discountItemId } = input;

    // 1️⃣ Find the discount item (only not deleted ones)
    const existingItem = await this.ItemRepo.findOne({ 
      where: { discountItemId, deleted: false } 
    });

    if (!existingItem) {
      return { status: STATUSCODES.NOT_FOUND, message: "Discount Item not found." };
    }

    const user = await this.UserRepo.findOne({ where: { emp_id: payload.emp_id } });
    if (!user) {
      return { status: STATUSCODES.BAD_REQUEST, message: "Authenticated user not found." };
    }

    // 3️⃣ Soft delete the item and update audit fields
    existingItem.deleted = true;
    existingItem.lastModifiedByUser = user;
    existingItem.lastUpdatedDate = new Date();
    await this.ItemRepo.save(existingItem);

    // 4️⃣ Return success
    return { status: STATUSCODES.SUCCESS, message: "Discount Item deleted successfully." };

  } catch (err: any) {
      throw err;
  }
}

async listDiscountItem(input:ListDiscountItemsDto , payload: IUser): Promise<IApiResponse>{

try {
  // Build where object inline
  const items = await this.ItemRepo.find({
    where: {
      ...(input?.discountListId && { discountList: { discountListId: input.discountListId } }),
      ...(input?.productId !== undefined && { productId: input.productId }),
    },
    relations: ["discountList", "createdByUser", "lastModifiedByUser"],
    order: { createdDate: "DESC" },
  });

  
    // Map response
    const responseData = items.map(item => ({
      discountItemId: item.discountItemId,
      productId: item.productId,
      discountValue: item.discountValue,
      discountConditionRules: item.discountConditionRules,
      priorityLevel: item.priorityLevel,
      remarks: item.remarks,
      discountListId: item.discountList.discountListId,
      createdDate: item.createdDate,
      lastUpdatedDate: item.lastUpdatedDate,
      createdBy: item.createdBy,
      lastModifiedBy: item.lastModifiedBy,
    }));

    return {
      status: STATUSCODES.SUCCESS,
      message: "Discount Items fetched successfully",
      data: responseData,
    };
  } catch (err: any) {
    throw err;
  }
}

async getDiscountItemById(input:GetDiscountItemByIdDto,payload:IUser):Promise<IApiResponse>{

    try {
    const { discountItemId } = input;

    if (!discountItemId) {
      return { status: STATUSCODES.BAD_REQUEST, message: "discountItemId is required." };
    }

    // Fetch discount item regardless of deleted status
    const existingItem = await this.ItemRepo
      .createQueryBuilder("discountItem")
      .leftJoinAndSelect("discountItem.discountList", "discountList")
      .leftJoinAndSelect("discountItem.createdByUser", "createdByUser")
      .leftJoinAndSelect("discountItem.lastModifiedByUser", "lastModifiedByUser")
      .where("discountItem.discountItemId = :discountItemId", { discountItemId })
      .getOne();

    if (!existingItem) {
      return { status: STATUSCODES.NOT_FOUND, message: "Discount Item Not Found." };
    }

    // Build response including deleted flag
    const responseData = {
      discountItemId: existingItem.discountItemId,
      productId: existingItem.productId,
      discountValue: existingItem.discountValue,
      discountConditionRules: existingItem.discountConditionRules,
      priorityLevel: existingItem.priorityLevel,
      remarks: existingItem.remarks,
      discountListId: existingItem.discountList.discountListId,
      deleted: existingItem.deleted,
      createdDate: existingItem.createdDate,
      lastUpdatedDate: existingItem.lastUpdatedDate,
      createdBy: existingItem.createdBy,
      lastModifiedBy: existingItem.lastModifiedBy,
    };

    return { status: STATUSCODES.SUCCESS, message: "Success.", data: responseData };
  } catch (error) {
    throw error;
  }
}
}

 
  

 

export {DiscountController as DiscountService };