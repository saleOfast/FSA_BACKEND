import { DurationEnum, OrderStatus, STATUSCODES, StoreBilling, StoreTypeFilter, UserRole, VisitStatus } from "../../../../core/types/Constent/common";
import { IUser } from "../../../../core/types/AuthService/AuthService";
import { IApiResponse } from "../../../../core/types/Constent/commonService";
import { /* CreateCategory, */ CreateStoreDto, /* DeleteCategoryById, */ DeleteStoreById, /* GetCategoryById, */ IStore,  StoreListDto, /* UpdateCategory, */ UpdateStore,getStoreByIdDto,searchStoreDto,GetStoresByStatusDto} from "../../../../core/types/StoreService/StoreService";
import { StoreRepository, Stores } from "../../../../core/DB/Entities/stores.entity";
// import { StoreCategory, StoreCategoryRepository } from "../../../../core/DB/Entities/storeCategory.entity";
import { endOfDay, startOfDay, subDays } from "date-fns";
import { In, SelectQueryBuilder } from "typeorm";
import { OrdersRepository } from "../../../../core/DB/Entities/orders.entity";
import { BeatRepository } from "../../../../core/DB/Entities/beat.entity";
import { VisitRepository } from "../../../../core/DB/Entities/Visit.entity";
import { IBeat } from "../../../../core/types/BeatService/Beat";
import { User } from "../../../../core/DB/Entities/User.entity";
import { plainToInstance } from "class-transformer";

class StoreController {
    private storeRepositry = StoreRepository();
    // private categoryRepositry = StoreCategoryRepository();
    private orderRepositry = OrdersRepository();
    private beatRespositry = BeatRepository();
    private visitRepository = VisitRepository();
   private userRepository = User.getRepository();
    constructor() { }

  async createStore(input: CreateStoreDto, payload: IUser): Promise<IApiResponse> {
    try {
        const { storeName, customerId, address, city, state, zip, contactPerson, contactPhone, email, capacity, storeType, operationalHours, managerNameId, managerContactId, status } = input;
        const { emp_id } = payload; // get the logged-in user's ID

       const existingStore = await this.storeRepositry.createQueryBuilder("stores")
  .where("LOWER(stores.store_name) = :storeName", { storeName: storeName.toLowerCase() })
  .orWhere("stores.contact_phone = :contactPhone", { contactPhone })
  .getOne();


        if (existingStore) {
            return { message: "Store with same name or contact phone already exists.", status: STATUSCODES.BAD_REQUEST }
        }

        const newStore = new Stores();
        newStore.storeName = storeName;
        newStore.customerId = customerId ?? null;
        newStore.address = address ?? null;
        newStore.city = city ?? null;
        newStore.state = state ?? null;
        newStore.zip = zip ?? null;
        newStore.contactPerson = contactPerson;
        newStore.contactPhone = contactPhone;
        newStore.email = email ?? null;
        newStore.capacity = capacity ?? null;
        newStore.storeType = storeType ?? null;
        newStore.operationalHours = operationalHours ?? null;
        newStore.status = status ?? "Active";
        newStore.managerId = managerNameId ?? null;  
        newStore.managerContactId = managerContactId ?? null;

        // ✅ Assign createdBy properly using payload.emp_id
        newStore.createdById = emp_id;
        // newStore.createdBy = this.userRepository.create({ emp_id }); 

        await this.storeRepositry.save(newStore);
        console.log('Saved store:', {
  storeId: newStore.storeId,
  storeName: newStore.storeName,
  contactPhone: newStore.contactPhone,
  createdDate: newStore.createdDate,
});

        return { status: STATUSCODES.SUCCESS, message: "Store created successfully", data: newStore }

    } catch (error) {
        throw error;
    }
}

  async updateStore(storeId: number, input: UpdateStore, payload: IUser): Promise<IApiResponse> {
  try {
    // 🔎 First check if the store exists
    const store = await this.storeRepositry.findOne({ where: {storeId: storeId } });

    if (!store) {
      return { status: STATUSCODES.NOT_FOUND, message: "Store not found" };
    }

    // ⚡ Run the update query
    await this.storeRepositry
      .createQueryBuilder()
      .update(Stores)
      .set({
        storeName: input.storeName ?? store.storeName,
        address: input.address ?? store.address,
        city: input.city ?? store.city,
        state: input.state ?? store.state,
        zip: input.zip ?? store.zip,
        contactPerson: input.contactPerson ?? store.contactPerson,
        contactPhone: input.contactPhone ?? store.contactPhone,
        email: input.email ?? store.email,
        capacity: input.capacity ?? store.capacity,
        storeType: input.storeType ?? store.storeType,
        operationalHours: input.operationalHours ?? store.operationalHours,
        managerId: input.managerNameId ?? store.managerId,
        managerContactId: input.managerContactId ?? store.managerContactId,
    status: input.status === "Active" || input.status === "Inactive"
  ? input.status
  : store.status,
   lastModifiedById: payload.emp_id?? store.lastModifiedById,
      })
      .where("store_id = :storeId", { storeId })
      .execute();

    return { status: STATUSCODES.SUCCESS, message: "Store updated successfully" };
  } catch (error) {
    throw error;
  }
}


    async delete(input: DeleteStoreById): Promise<IApiResponse> {
        try {
            const { storeId } = input;

            // Soft delete using deletedAt instead of isDeleted
            await this.storeRepositry.createQueryBuilder().update({ deleted:true}).where({ storeId: Number(storeId) }).execute();

            return { message: "Category Deleted.", status: STATUSCODES.SUCCESS }
        } catch (error) {
            throw error;
        }
    }

    async storeList(input:  StoreListDto, payload: IUser): Promise<IApiResponse> {
        try {
      const query = this.storeRepositry.createQueryBuilder("store");

      // Apply filters only if provided
      if (input.storeName) query.andWhere("LOWER(store.storeName) LIKE :storeName", { storeName: `%${input.storeName.toLowerCase()}%` });
      if (input.customerId) query.andWhere("store.customerId = :customerId", { customerId: input.customerId });
      if (input.address) query.andWhere("LOWER(store.address) LIKE :address", { address: `%${input.address.toLowerCase()}%` });
      if (input.city) query.andWhere("LOWER(store.city) LIKE :city", { city: `%${input.city.toLowerCase()}%` });
      if (input.state) query.andWhere("LOWER(store.state) LIKE :state", { state: `%${input.state.toLowerCase()}%` });
      if (input.zip) query.andWhere("store.zip = :zip", { zip: input.zip });
      if (input.contactPerson) query.andWhere("LOWER(store.contactPerson) LIKE :contactPerson", { contactPerson: `%${input.contactPerson.toLowerCase()}%` });
      if (input.contactPhone) query.andWhere("store.contactPhone = :contactPhone", { contactPhone: input.contactPhone });
      if (input.email) query.andWhere("LOWER(store.email) LIKE :email", { email: `%${input.email.toLowerCase()}%` });
      if (input.capacity) query.andWhere("store.capacity = :capacity", { capacity: input.capacity });
      if (input.storeType) query.andWhere("LOWER(store.storeType) LIKE :storeType", { storeType: `%${input.storeType.toLowerCase()}%` });
      if (input.operationalHours) query.andWhere("store.operationalHours = :operationalHours", { operationalHours: input.operationalHours });
      if (input.managerNameId) query.andWhere("store.managerId = :managerNameId", { managerNameId: input.managerNameId });
      if (input.managerContactId) query.andWhere("store.managerContactId = :managerContactId", { managerContactId: input.managerContactId });
      if (input.status) query.andWhere("LOWER(store.status) = :status", { status: input.status.toLowerCase() });

      query.orderBy("store.storeName", "ASC");

      const stores = await query.getMany(); // fetch all matching stores

      return {
        status: STATUSCODES.SUCCESS,
        message: "Store list fetched successfully",
        data: stores,
      };
    } catch (error) {
      throw error;
    }
  }


  async getStoreById(input: getStoreByIdDto): Promise<IApiResponse> {
        try {
            const { storeId } = input;

            const storeDetails = await this.storeRepositry.createQueryBuilder('stores')
                // .leftJoinAndSelect('stores.createdBy', 'createdBy')
                // .leftJoinAndSelect('stores.managerName', 'managerName')
                // .leftJoinAndSelect('stores.managerContact', 'managerContact')
                // Store category relation commented out
                // .leftJoinAndSelect('stores.storeCat', 'storeCat')
                .where('stores.storeId = :storeId', { storeId: Number(storeId) })
                .getOne();

            if (!storeDetails) {
                return { message: "Store Not Found.", status: STATUSCODES.NOT_FOUND }
            }

            return { message: "Success.", status: STATUSCODES.SUCCESS, data: storeDetails }

        } catch (error) {
            console.log(error)
            throw error;
        }
    }

async searchStores(input: searchStoreDto): Promise<IApiResponse> {
      try {
    const query = this.storeRepositry.createQueryBuilder("store");

     if (input.storeId) {
      query.andWhere("store.store_id = :id", { id: input.storeId });
    }

    if (input.storeName) {
      query.andWhere("LOWER(store.store_name) LIKE :storeName", {
        storeName: `%${input.storeName.toLowerCase()}%`,
      });
    }

    if (input.city) {
      query.andWhere("LOWER(store.city) LIKE :city", {
        city: `%${input.city.toLowerCase()}%`,
      });
    }
    const stores = await query.getMany();

    return {
      status: STATUSCODES.SUCCESS,
      message: stores.length ? "Stores fetched successfully" : "No stores found",
      data: stores,
    };
  } catch (error) {
    throw error;
  }
}

 async getStoresByStatus(input: GetStoresByStatusDto): Promise<IApiResponse> {
  try {
    if (!input.status) {
      return {
        status: STATUSCODES.BAD_REQUEST,
        message: "Status is required (Active / Inactive)",
        data: [],
      };
    }

    // Normalize input to lower case
    const statusLower = input.status.toLowerCase();

    if (statusLower !== "active" && statusLower !== "inactive") {
      return {
        status: STATUSCODES.BAD_REQUEST,
        message: "Invalid status. Allowed values: Active, Inactive",
        data: [],
      };
    }

    // Use QueryBuilder with LOWER() for case-insensitive search
    const stores = await this.storeRepositry
  .createQueryBuilder("store")
  .where("store.status::text ILIKE :status", { status: input.status })
  .orderBy("store.storeName", "ASC")
  .getMany();

    if (!stores.length) {
      return {
        status: STATUSCODES.NOT_FOUND,
        message: `No ${input.status} stores found`,
        data: [],
      };
    }

    return {
      status: STATUSCODES.SUCCESS,
      message: `${input.status} stores fetched successfully`,
      data: stores,
    };
  } catch (error: any) {
     throw error
  }
}
}

    // async getStoreByType(input: GetStoreByType): Promise<IApiResponse> {
    //     try {
    //         const { storeType } = input;

    //         const query = this.storeRepositry.createQueryBuilder('stores')
    //             .select(['stores.storeId', 'stores.storeName']);

    //         if (storeType === "doctor") {
    //             const doctorQuery = await this.storeRepositry.createQueryBuilder('stores')
    //                 .select(['stores.storeId'])
    //                 .getMany();

    //             const storeTypeIds = doctorQuery.map(store => store.storeId);

    //             if (storeTypeIds.length > 0) {
    //                 query.where('stores.storeId IN (:...storeTypeIds)', { storeTypeIds });
    //             } else {
    //                 query.where('1=0'); // Ensures no records are returned if no matching store IDs exist
    //             }
    //         } else {
    //             query.where('stores.storeType = :storeType', { storeType });
    //         }

    //         const storeDetails = await query.getMany();

    //         return { message: "Success.", status: STATUSCODES.SUCCESS, data: storeDetails };
    //     } catch (error) {
    //         throw error;
    //     }
    // }


    // async createCategory(input: CreateCategory, payload: IUser): Promise<IApiResponse> {
    //     try {
    //         const { categoryName } = input;
    //         const { emp_id } = payload;

    //         const createCategory = new StoreCategory();
    //         createCategory.categoryName = categoryName;
    //         createCategory.empId = emp_id;
    //         const cat = await this.categoryRepositry.save(createCategory);
    //         return { status: STATUSCODES.SUCCESS, message: "Success." }
    //     } catch (error) {
    //         throw error;
    //     }
    // }

    // async categoryList(payload: IUser): Promise<IApiResponse> {
    //     try {
    //         const categoryList: IStoreCategory[] | null = await this.categoryRepositry.find({ where: { isDeleted: false } });

    //         return { status: STATUSCODES.SUCCESS, message: "Success.", data: categoryList }
    //     } catch (error) {
    //         throw error;
    //     }
    // }

    // async getCatoryById(input: GetCategoryById): Promise<IApiResponse> {
    //     try {
    //         const { categoryId } = input;

    //         const categoryDetails: IStoreCategory | null = await this.categoryRepositry.findOne({ where: { storeCategoryId: Number(categoryId), isDeleted: false } });

    //         if (!categoryDetails) {
    //             return { message: "Store Category Not Found.", status: STATUSCODES.NOT_FOUND }
    //         }

    //         return { message: "Success.", status: STATUSCODES.SUCCESS, data: categoryDetails }
    //     } catch (error) {
    //         throw error;
    //     }
    // }

    // async udpateCategory(input: UpdateCategory): Promise<IApiResponse> {
    //     try {
    //         const { categoryId, categoryName } = input;

    //         const category: IStoreCategory | null = await this.categoryRepositry.findOne({ where: { storeCategoryId: Number(categoryId), isDeleted: false } });

    //         if (!category) {
    //             return { message: "Store Category Not Found.", status: STATUSCODES.NOT_FOUND }
    //         }

    //         await this.categoryRepositry.createQueryBuilder().update({ categoryName }).where({ storeCategoryId: Number(categoryId) }).execute();

    //         return { message: "Success.", status: STATUSCODES.SUCCESS }
    //     } catch (error) {
    //         throw error;
    //     }
    // }

    // async deleteCategory(input: DeleteCategoryById): Promise<IApiResponse> {
    //     try {
    //         const { categoryId } = input;

    //         await this.categoryRepositry.createQueryBuilder().update({ isDeleted: true }).where({ storeCategoryId: Number(categoryId) }).execute();

    //         return { message: "Category Deleted.", status: STATUSCODES.SUCCESS }
    //     } catch (error) {
    //         throw error;
    //     }
    // }

    // async createImportStores(inputs: any[], payload: IUser): Promise<IApiResponse> {
    //     const { emp_id, role } = payload;
    //     const skippedStores: string[] = [];  // Track skipped stores
    //     const processedStores: Set<string> = new Set();  // Track unique stores by combination of storeName, uid, and empId

    //     // Validate input data
    //     if (inputs.length === 0) {
    //         return { message: "No stores to create.", status: STATUSCODES.BAD_REQUEST };
    //     }

    //     // Filter and prepare stores to save
    //     const storeEntities = [];

    //     for (const input of inputs) {
    //         const {
    //             assignTo, storeName, uid, addressLine1, addressLine2, townCity, state, email, pinCode, ownerName,
    //             mobileNumber, openingTime, closingTime, isPremiumStore, isActive, storeType, lat, long,
    //             flatDiscount, visibilityDiscount, isActiveOrderValueDiscount, orderValueDiscount,
    //             empId, assignToRetailor
    //         } = input;

    //         const actualEmpId = (role === UserRole.SSM || role === UserRole.RETAILER) ? emp_id : assignTo;

    //         // Create a unique identifier for in-memory duplicate detection
    //         const uniqueStoreKey = `${storeName}-${uid}-${actualEmpId}`;

    //         // In-memory duplicate check
    //         if (processedStores.has(uniqueStoreKey)) {
    //             skippedStores.push(`${storeName} (Duplicate in input)`);
    //             continue;  // Skip duplicate store in input
    //         }

    //         // Mark this store as processed
    //         processedStores.add(uniqueStoreKey);

    //         // Check if the store already exists in the database
    //         const existingStore = await this.storeRepositry.findOneBy({ storeName });
    //         if (existingStore) {
    //             skippedStores.push(`${storeName} (Already exists in database)`);
    //             continue;  // Skip the store if it already exists in the database
    //         }

    //         // Create new store object - only using fields that exist in entity
    //         const newStore = new Stores();
    //         // newStore.empId = actualEmpId; // Field doesn't exist in entity
    //         // newStore.retailorId = assignToRetailor ?? null; // Field doesn't exist in entity
    //         newStore.storeName = storeName;
    //         // newStore.uid = uid; // Field doesn't exist in entity
    //         // newStore.lat = lat; // Field doesn't exist in entity
    //         // newStore.long = long; // Field doesn't exist in entity
    //         newStore.storeType = storeType as "Distribution Center" | "Cold Storage" | "Storage" | null;
    //         // newStore.addressLine1 = addressLine1; // Field doesn't exist in entity
    //         // newStore.addressLine2 = addressLine2; // Field doesn't exist in entity
    //         // newStore.townCity = townCity; // Field doesn't exist in entity
    //         newStore.state = state;
    //         newStore.email = email;
    //         // newStore.pinCode = pinCode; // Field doesn't exist in entity
    //         // newStore.ownerName = ownerName; // Field doesn't exist in entity
    //         // newStore.mobileNumber = mobileNumber; // Field doesn't exist in entity
    //         // newStore.openingTime = openingTime; // Field doesn't exist in entity
    //         // newStore.closingTime = closingTime; // Field doesn't exist in entity
    //         // newStore.isActive = isActive; // Field doesn't exist in entity
    //         // newStore.isPremiumStore = isPremiumStore; // Field doesn't exist in entity
    //         // newStore.flatDiscount = flatDiscount; // Field doesn't exist in entity
    //         // newStore.visibilityDiscount = visibilityDiscount; // Field doesn't exist in entity
    //         // newStore.isActiveOrderValueDiscount = isActiveOrderValueDiscount; // Field doesn't exist in entity
    //         // newStore.orderValueDiscount = orderValueDiscount; // Field doesn't exist in entity
    //         newStore.createdById = actualEmpId;

    //         storeEntities.push(newStore);
    //     }

    //     try {
    //         // Save all valid new stores at once
    //         if (storeEntities.length > 0) {
    //             await this.storeRepositry.save(storeEntities);
    //         }

    //         // Construct the response message
    //         const message = skippedStores.length > 0
    //             ? `Stores created successfully. Skipped stores: ${skippedStores.join(', ')}.`
    //             : "All stores created successfully.";

    //         return { status: STATUSCODES.SUCCESS, message };
    //     } catch (error) {
    //         console.error(error);
    //         throw error;
    //     }
    // }

    // Store Category functionality - COMMENTED OUT
    // async createCategories(inputs: CreateCategory[], payload: IUser): Promise<IApiResponse> {
    //     const { emp_id } = payload;
    //     const skippedCategories: string[] = [];  // Track skipped categories
    //     const processedCategories: Set<string> = new Set();  // Track unique categories by combination of categoryName and empId

    //     // Validate input data
    //     if (inputs.length === 0) {
    //         return { message: "No categories to create.", status: STATUSCODES.BAD_REQUEST };
    //     }

    //     const categoryEntities = [];

    //     for (const input of inputs) {
    //         const { categoryName } = input;

    //         // Create a unique identifier for in-memory duplicate detection
    //         const uniqueCategoryKey = `${categoryName}-${emp_id}`;

    //         // In-memory duplicate check
    //         if (processedCategories.has(uniqueCategoryKey)) {
    //             skippedCategories.push(`${categoryName} (Duplicate in input)`);
    //             continue;  // Skip duplicate category in input
    //         }

    //         // Mark this category as processed
    //         processedCategories.add(uniqueCategoryKey);

    //         // Store category functionality commented out
    //         // Check if the category already exists in the database
    //         // const existingCategory = await this.categoryRepositry.findOneBy({ categoryName, empId: emp_id });
    //         // if (existingCategory) {
    //         //     skippedCategories.push(`${categoryName} (Already exists in database)`);
    //         //     continue;  // Skip the category if it already exists in the database
    //         // }

    //         // Store category functionality commented out
    //         // Create new category object
    //         // const category = new StoreCategory();
    //         // category.categoryName = categoryName;
    //         // category.empId = emp_id;

    //         // categoryEntities.push(category);  // Add to the list of new categories to be saved
    //     }

    //     try {
    //         // Store category functionality commented out
    //         // Save all valid new categories at once
    //         // if (categoryEntities.length > 0) {
    //         //     await this.categoryRepositry.save(categoryEntities);
    //         // }

    //         // Construct the response message
    //         const message = skippedCategories.length > 0
    //             ? `Categories created successfully. Skipped categories: ${skippedCategories.join(', ')}.`
    //             : "All categories created successfully.";

    //         return { status: STATUSCODES.SUCCESS, message };
    //     } catch (error) {
    //         console.error(error);
    //         throw error;
    //     }
    // }


export { StoreController as StoreService }