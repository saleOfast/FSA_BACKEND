import { IsArray, IsBoolean, IsDate, IsEmail, IsEnum, IsNotEmpty, IsNumber, IsObject, IsOptional, IsString, ValidateNested } from "class-validator";
import { DiscountType, DurationEnum, PracticeTypeEnum, StoreBilling, StoreTypeFilter } from "../Constent/common";
import { Type } from "class-transformer";
import { User } from "../../DB/Entities/User.entity";
import { Transform } from "class-transformer";

// export interface IStoreFlatDiscount {
//     discountType: DiscountType,
//     value: number,
//     isActive: boolean
// }

// export interface IStoreVisibilityDiscount {
//     discountType: DiscountType,
//     value: number,
//     isActive: boolean
// }

// export interface IOrderValueDiscount {
//     amountRange: string,
//     discountType: DiscountType,
//     value: number
// }
export interface IStore {
  storeId: number;                // matches @PrimaryGeneratedColumn
  storeName: string;              // required, unique
  customerId?: string | null;     // nullable in entity
  address?: string | null;
  city?: string | null;
  state?: string | null;
  zip?: string | null;
  contactPerson?: string | null;  // now nullable to align with entity
  contactPhone?: string | null;   // now nullable to align with entity
  email?: string | null;
  capacity?: string | null;
  storeType?: "Distribution Center" | "Cold Storage" | "Storage" | null;
  operationalHours?: string | null;

  // Location fields - added for Visit controller compatibility
  lat?: string | null;
  long?: string | null;

  // Relations
  managerName?: User | null;      // ManyToOne → User
  managerContact?: User | null;   // ManyToOne → User

  // Status
  status: "Active" | "Inactive";

  // Audit fields
  createdDate: Date;
  lastUpdatedDate: Date;
  createdBy?: User | null;        // ManyToOne → User
  lastModifiedBy?: User | null;   // ManyToOne → User
  deletedAt?: Date | null;        // soft delete
}


// export interface IStoreCategory {
//     storeCategoryId: number;
//     categoryName: string;
//     empId: number;
//     isDeleted: boolean;
//     createdAt: Date;
//     updatedAt: Date;
// }

// export interface IOrderCollectionResponse {
//     totalAmount: number,
//     totalCollectedAmount: number,
//     netAmount: number,
//     orderId: number,
//     store: {
//         storeId: number,
//         storeName: string,
//         storeCat: {
//             categoryName: string
//         }
//     }
//     collectedAmount: number,
//     orderAmount: number,

// }

// export interface IOrderCollectionResponse {
//     storeId: number,
//     orderCount: number,
//     totalAmount: string,
//     totalCollectedAmount: string
// }
// export interface IOrderStoreCollection {
//     store: { storeId: number }

// }
// export interface ICollectionResponse {
//     storeId: number,
//     storeName: string,
//     storeType: string,
//     pendingAmount: number,
//     status: string,
//     totalOrderAmount: number,
//     totalCollectedAmount: number,
//     netAmount: number,
//     orderId: number
// }

// export class StoreFlatDiscount {
//     @IsNotEmpty()
//     @IsEnum(DiscountType)
//     discountType: DiscountType

//     @IsNotEmpty()
//     @IsNumber()
//     value: number

//     @IsNotEmpty()
//     @IsBoolean()
//     isActive: boolean
// }

// export class StoreVisibilityDiscount {
//     @IsNotEmpty()
//     @IsEnum(DiscountType)
//     discountType: DiscountType

//     @IsNotEmpty()
//     @IsNumber()
//     value: number

//     @IsNotEmpty()
//     @IsBoolean()
//     isActive: boolean
// }

// export class OrderValueDiscount {
//     @IsOptional()
//     @IsString()
//     amountRange: string

//     @IsOptional()
//     @IsEnum(DiscountType)
//     discountType: DiscountType

//     @IsOptional()
//     @IsNumber()
//     value: number
// }

export class CreateStoreDto {
  @IsNotEmpty()
  @IsString()
  storeName: string;

  @IsOptional()
  @IsString()
  customerId?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  state?: string;

  @IsOptional()
  @IsString()
  zip?: string;

  @IsNotEmpty()
  @IsString()
  contactPerson: string;

  @IsNotEmpty()
  @IsString()
  contactPhone: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  capacity?: string;

  @IsOptional()
  @IsEnum(["Distribution Center", "Cold Storage", "Storage"])
  storeType?: "Distribution Center" | "Cold Storage" | "Storage";

  @IsOptional()
  @IsString()
  operationalHours?: string;

  @IsOptional()
  @IsNumber()
  managerNameId?: number;

  @IsOptional()
  @IsNumber()
  managerContactId?: number;

  @IsOptional()
  @IsEnum(["Active", "Inactive"])
  status?: "Active" | "Inactive";
}


export class UpdateStore {
    // @IsOptional()
    // @IsNumber()
    // assignTo: number;

    // @IsOptional()
    // @IsNumber()
    // assignToRetailor: number;

    // @IsNotEmpty()
    // @IsNumber()
    // storeId: number


  @IsOptional()
  @IsString()
  storeName?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  state?: string;

  @IsOptional()
  @IsString()
  zip?: string;

  @IsOptional()
  @IsString()
  contactPerson?: string;

  @IsOptional()
  @IsString()
  contactPhone?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  capacity?: string;

      @IsOptional()
    @IsEnum(["Distribution Center", "Cold Storage", "Storage"])
    storeType?: "Distribution Center" | "Cold Storage" | "Storage";

  @IsOptional()
  @IsString()
  operationalHours?: string;

  @IsOptional()
  managerNameId?: number;

  @IsOptional()
  managerContactId?: number;

  @IsOptional()
  @IsString()
  status?: string;
 
}



// export class CreateCategory {
//     @IsNotEmpty()
//     @IsString()
//     categoryName: string
// }

// export class GetCategoryById {
//     @IsNotEmpty()
//     @IsString()
//     categoryId: string
// }

// export class DeleteCategoryById {
//     @IsNotEmpty()
//     @IsString()
//     categoryId: string
// }

export class DeleteStoreById {
    @IsNotEmpty()
    @IsNumber()
    storeId: number

}

// export class UpdateCategory {
//     @IsNotEmpty()
//     @IsString()
//     categoryName: string

//     @IsNotEmpty()
//     @IsString()
//     categoryId: string
// }
export class StoreListDto {
  @IsOptional()
  @IsString()
  storeName?: string;

  @IsOptional()
  @IsString()
  customerId?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  state?: string;

  @IsOptional()
  @IsString()
  zip?: string;

  @IsOptional()
  @IsString()
  contactPerson?: string;

  @IsOptional()
  @IsString()
  contactPhone?: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsString()
  capacity?: string;

  @IsOptional()
  @IsString()
  storeType?: string;

  @IsOptional()
  @IsString()
  operationalHours?: string;

  @IsOptional()
  @IsNumber()
  managerNameId?: number;

  @IsOptional()
  @IsNumber()
  managerContactId?: number;

  @IsOptional()
  @IsString()
  status?: string;
}

export class getStoreByIdDto{
    @IsNotEmpty()
    @IsNumber()
    storeId: number
}

export class searchStoreDto{
    @IsOptional()
    @IsString()
    storeName?: string

    @IsOptional()
    @IsNumber()
    storeId?: number

    @IsOptional()
    @IsString()
    city?:string

}
export class GetStoresByStatusDto {
  @IsOptional()
  @IsString()
  status?: "Active" | "Inactive";
}        
