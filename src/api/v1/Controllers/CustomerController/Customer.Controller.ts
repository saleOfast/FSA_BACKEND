import { DurationEnum, OrderStatus, STATUSCODES, StoreBilling, StoreTypeFilter, UserRole, VisitStatus } from "../../../../core/types/Constent/common";


// import { customerService } from '../../../../../src/core/types/CustomerService/CustomerService'
import { IBeat } from "../../../../core/types/BeatService/Beat";
import { IUser } from "../../../../core/types/AuthService/AuthService";
import { IApiResponse } from "../../../../core/types/Constent/commonService";
import { CustomerRepository,Customer } from ".././../../../core/DB/Entities/customer.entity";
import { ICustomer, IAddress,CreateCustomerDto, deleteCustomerDto ,ListCustomersDto,GetStoresByStatusDto,GetCustomerByIdDto} from "../../../../core/types/CustomerService/CustomerService";
import { BeatRepository } from "../../../../core/DB/Entities/beat.entity";
import { User } from "../../../../core/DB/Entities/User.entity";
import customers from "razorpay/dist/types/customers";


class CustomerController {

        
        private customerRepository=CustomerRepository()
        private  beatRespositry = BeatRepository();
        private userRepository = User.getRepository();
        constructor() { }


 async createCustomer(input: CreateCustomerDto, payload: IUser): Promise<IApiResponse> {
  try {
    // Check if customerCode already exists
    const existingCustomer = await this.customerRepository.findOne({ where: { customerCode: input.customerCode } });
    if (existingCustomer) {
      return { status: STATUSCODES.BAD_REQUEST, message: "Customer code already exists." };
    }


// store area in the Customer table
  const newCustomer = new Customer();
    newCustomer.customerName = input.customerName;
    newCustomer.customerCode = input.customerCode;
    newCustomer.contactPersonName = input.contactPersonName;
    newCustomer.contactNumber = input.contactNumber;
    newCustomer.email = input.email;

    // Map DTO to IAddress
    const mapAddress = (addr?: typeof input.shippingAddress): IAddress | undefined =>
      addr
        ? {
            street: addr.street || "",
            city: addr.city || "",
            state: addr.state || "",
            postalCode: addr.postalCode || "",
          }
        : undefined;

    newCustomer.shippingAddress = mapAddress(input.shippingAddress);
    newCustomer.billingAddress = mapAddress(input.billingAddress);

    newCustomer.distributorType = input.distributorType ?? "Dealer";
    newCustomer.taxIdOrGSTIN = input.taxIdOrGSTIN || "";

    newCustomer.creditLimit = input.creditLimit || 0;
    newCustomer.paymentMethod = input.paymentMethod || "Cash";
    newCustomer.status = input.status || "Active";
    newCustomer.registrationDate = input.registrationDate ? new Date(input.registrationDate) : new Date();
    newCustomer.salesManager = input.salesManagerId ? { id: input.salesManagerId } as any : undefined;
    newCustomer.distributorCategory = input.distributorCategory ?? "Primary";
    newCustomer.performanceTarget = input.performanceTarget ?? 0;
    newCustomer.remarks = input.remarks ?? "";

    // Assign Beat (region_or_territory)
    // if (input.beatId) {
    //   const beat = await this.beatRespositry.findOne({ where: { beatId: input.beatId } });
    //   if (beat) {
    //     newCustomer.beat = beat; // sets the foreign key
    //   }
    // }


   if (input.beatId) {
     const beatEntity = await this.beatRespositry.findOne({ where: { beatId: input.beatId } });
     if (!beatEntity) {
       return { status: STATUSCODES.BAD_REQUEST, message: "Invalid Beat ID" };
     }
     newCustomer.beat = beatEntity;
     newCustomer.regionOrTerritory = beatEntity.area;
   } else {
     // If no beatId, try to resolve from provided region string (supports camel and snake case)
     const regionInput = (input as any).region_or_territory ?? input.regionOrTerritory;
     if (regionInput) {
       const beatFromArea = await this.beatRespositry.findOne({ where: { area: regionInput } });
       if (!beatFromArea) {
         return { status: STATUSCODES.BAD_REQUEST, message: "Invalid regionOrTerritory: no matching Beat area" };
       }
       newCustomer.beat = beatFromArea;
       newCustomer.regionOrTerritory = beatFromArea.area;
     }
   }

   // Enforce uniqueness of regionOrTerritory if provided
   if (newCustomer.regionOrTerritory) {
     const existsRegion = await this.customerRepository.findOne({ where: { regionOrTerritory: newCustomer.regionOrTerritory } });
     if (existsRegion) {
       return { status: STATUSCODES.BAD_REQUEST, message: "regionOrTerritory must be unique" };
     }
   }

    // Audit fields
    newCustomer.createdBy = String(payload.emp_id);
    newCustomer.modifiedBy = String(payload.emp_id);

    await this.customerRepository.save(newCustomer);

    // Include region_or_territory in response
    const responseCustomer = {
      ...newCustomer,
      regionOrTerritory: newCustomer.regionOrTerritory ?? newCustomer.beat?.area,
      id: newCustomer.id,
      customerName: newCustomer.customerName,
      customerCode: newCustomer.customerCode,
      contactPersonName: newCustomer.contactPersonName,
      contactNumber: newCustomer.contactNumber,
      email: newCustomer.email,
      distributorType: newCustomer.distributorType,
      taxIdOrGSTIN: newCustomer.taxIdOrGSTIN,
      creditLimit: newCustomer.creditLimit,
      paymentMethod: newCustomer.paymentMethod,
      status: newCustomer.status,
      registrationDate: newCustomer.registrationDate,
      salesManager: newCustomer.salesManager,
      distributorCategory: newCustomer.distributorCategory,
      performanceTarget: newCustomer.performanceTarget,
      remarks: newCustomer.remarks,
    };

    return {
      status: STATUSCODES.SUCCESS,
      message: "Customer created successfully",
      data: responseCustomer,
    };
  } catch (error) {
    throw error;
  }
}


  async updateCustomer(input: Partial<CreateCustomerDto> & { id: string }, payload: IUser): Promise<IApiResponse> {
    const { id, ...rest } = input;

    const existing = await this.customerRepository.findOne({ where: { id } });
    if (!existing || (existing as any).deleted === true) {
        return { status: STATUSCODES.NOT_FOUND, message: "Customer not found." };
    }

    const mapAddress = (addr?: typeof rest.shippingAddress) =>
        addr ? {
            street: addr.street || "",
            city: addr.city || "",
            state: addr.state || "",
            postalCode: addr.postalCode || "",
        } : undefined;

    const updatePayload: Partial<Customer> = {
        ...rest,
        shippingAddress: rest.shippingAddress ? mapAddress(rest.shippingAddress) : existing.shippingAddress,
        billingAddress: rest.billingAddress ? mapAddress(rest.billingAddress) : existing.billingAddress,
        registrationDate: rest.registrationDate ? new Date(rest.registrationDate) : existing.registrationDate,
        modifiedBy: String(payload.emp_id),
        // modifiedByName: `${payload.firstname} ${payload.lastname || ""}`.trim(),
    };

    // If beatId is provided in update, load and set both beat and regionOrTerritory
    let beatEntityToSet: any = undefined;
    if ((rest as any).beatId) {
        const beatEntity = await this.beatRespositry.findOne({ where: { beatId: (rest as any).beatId } });
        if (!beatEntity) {
            return { status: STATUSCODES.BAD_REQUEST, message: "Invalid Beat ID" };
        }
        beatEntityToSet = beatEntity;
        updatePayload.regionOrTerritory = beatEntity.area;
    }
    // If no beatId but region string provided (supports camel and snake case), resolve Beat by area
    if (!(rest as any).beatId) {
        const regionInput = (rest as any).region_or_territory ?? (rest as any).regionOrTerritory;
        if (regionInput) {
            const beatFromArea = await this.beatRespositry.findOne({ where: { area: regionInput } });
            if (!beatFromArea) {
                return { status: STATUSCODES.BAD_REQUEST, message: "Invalid regionOrTerritory: no matching Beat area" };
            }
            beatEntityToSet = beatFromArea;
            updatePayload.regionOrTerritory = beatFromArea.area;
        }
    }

    // Enforce uniqueness when regionOrTerritory changes
    if (updatePayload.regionOrTerritory && updatePayload.regionOrTerritory !== existing.regionOrTerritory) {
        const dup = await this.customerRepository.findOne({ where: { regionOrTerritory: updatePayload.regionOrTerritory } });
        if (dup) {
            return { status: STATUSCODES.BAD_REQUEST, message: "regionOrTerritory must be unique" };
        }
    }

    // Use save to handle relation updates safely
    const entityToSave: Customer = Object.assign(existing, updatePayload);
    if (beatEntityToSet) {
        entityToSave.beat = beatEntityToSet;
    }

    await this.customerRepository.save(entityToSave);

    return { status: STATUSCODES.SUCCESS, message: "Customer updated successfully." };
}

async deleteCustomer(input:deleteCustomerDto ,payload:IUser):Promise<IApiResponse>{
  try{
      const { id }=input; 
    const existing = await this.customerRepository.findOne({ where:{id ,deleted:false} });
    if (!existing) {
        return { status: STATUSCODES.NOT_FOUND, message: "Customer not found." };
    }
      await this.customerRepository.update(id, { deleted: true });

    return { status: 200, message: "Customer deleted successfully" };
  } catch (err: any) {
    return { status: 500, message: err.message };
  }

}

    async listCustomers(
    input: ListCustomersDto,
    payload: IUser
  ): Promise<IApiResponse> {
    try {
      const query = this.customerRepository.createQueryBuilder("customer");

      // Apply filters if provided
      if (input.id) query.andWhere("customer.id = :id", { id: input.id });
      if (input.customerName) query.andWhere("LOWER(customer.customerName) LIKE :customerName", { customerName: `%${input.customerName.toLowerCase()}%` });
      if (input.customerCode) query.andWhere("LOWER(customer.customerCode) LIKE :customerCode", { customerCode: `%${input.customerCode.toLowerCase()}%` });
      if (input.contactPersonName) query.andWhere("LOWER(customer.contactPersonName) LIKE :contactPersonName", { contactPersonName: `%${input.contactPersonName.toLowerCase()}%` });
      if (input.contactNumber) query.andWhere("customer.contactNumber = :contactNumber", { contactNumber: input.contactNumber });
      if (input.emailAddress) query.andWhere("LOWER(customer.emailAddress) LIKE :emailAddress", { emailAddress: `%${input.emailAddress.toLowerCase()}%` });
      if (input.regionOrTerritory) query.andWhere("LOWER(customer.regionOrTerritory) LIKE :regionOrTerritory", { regionOrTerritory: `%${input.regionOrTerritory.toLowerCase()}%` });
      if (input.distributorType) query.andWhere("customer.distributorType = :distributorType", { distributorType: input.distributorType });
      if (input.taxIdOrGSTIN) query.andWhere("LOWER(customer.taxIdOrGSTIN) LIKE :taxIdOrGSTIN", { taxIdOrGSTIN: `%${input.taxIdOrGSTIN.toLowerCase()}%` });
      if (input.creditLimit) query.andWhere("customer.creditLimit = :creditLimit", { creditLimit: input.creditLimit });
      if (input.paymentMethod) query.andWhere("LOWER(customer.paymentMethod) LIKE :paymentMethod", { paymentMethod: `%${input.paymentMethod.toLowerCase()}%` });
      if (input.status) query.andWhere("customer.status = :status", { status: input.status });
      if (input.registrationDate) query.andWhere("DATE(customer.registrationDate) = :registrationDate", { registrationDate: input.registrationDate });
      if (input.salesManager) query.andWhere("customer.salesManager = :salesManager", { salesManager: input.salesManager });
      if (input.distributorCategory) query.andWhere("customer.distributorCategory = :distributorCategory", { distributorCategory: input.distributorCategory });
      if (input.salesVolume) query.andWhere("customer.salesVolume = :salesVolume", { salesVolume: input.salesVolume });
      if (input.targetAchievement) query.andWhere("customer.targetAchievement = :targetAchievement", { targetAchievement: input.targetAchievement });
      if (input.remarks) query.andWhere("LOWER(customer.remarks) LIKE :remarks", { remarks: `%${input.remarks.toLowerCase()}%` });
      if (input.createdBy) query.andWhere("customer.createdBy = :createdBy", { createdBy: input.createdBy });
      if (input.modifiedBy) query.andWhere("customer.modifiedBy = :modifiedBy", { modifiedBy: input.modifiedBy });

      query.orderBy("customer.customerName", "ASC");

      const customers = await query.getMany();

      return {
        status: STATUSCODES.SUCCESS,
        message: "Customer list fetched successfully",
        data: customers,
      };
    } catch (error) {
      throw error;
    }
  }
  async getCustomersByStatus(input:GetStoresByStatusDto ): Promise<IApiResponse> {
    try {
      if (!input.status) {
        return {
          status: STATUSCODES.BAD_REQUEST,
          message: "Status is required (Active / Inactive)",
          data: [],
        };
      }

      // Normalize input to lowercase
      const statusLower = input.status.toLowerCase();

      if (statusLower !== "active" && statusLower !== "inactive") {
        return {
          status: STATUSCODES.BAD_REQUEST,
          message: "Invalid status. Allowed values: Active, Inactive",
          data: [],
        };
      }

      // Case-insensitive search for status
      const customers = await this.customerRepository
        .createQueryBuilder("customer")
        .where("customer.status::text ILIKE :status", { status: input.status })
        .orderBy("customer.customerName", "ASC")
        .getMany();

      if (!customers.length) {
        return {
          status: STATUSCODES.NOT_FOUND,
          message: `No ${input.status} customers found`,
          data: [],
        };
      }

      return {
        status: STATUSCODES.SUCCESS,
        message: `${input.status} customers fetched successfully`,
        data: customers,
      };
    } catch (error) {
      throw error;
    }
  }

  async getCustomerById(input:GetCustomerByIdDto,payload:IUser):Promise<IApiResponse>{
    try{
      const { id } = input;

const existing = await this.customerRepository
  .createQueryBuilder("customer")            // ✅ use string alias
  .where("customer.id = :id", { id })         // ✅ use parameter binding
  .getOne();                                  // ✅ await the query
  
  if(!existing){
     return { message: "Store Not Found.", status: STATUSCODES.NOT_FOUND }
  }
    return { message: "Success.", status: STATUSCODES.SUCCESS, data: existing }

    }
    catch(error){
      throw error
    }
  }

 
}

  
export { CustomerController as CustomerService };





