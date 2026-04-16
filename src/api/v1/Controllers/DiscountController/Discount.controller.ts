import { STATUSCODES } from "../../../../core/types/Constent/common";
import { IApiResponse } from "../../../../core/types/Constent/commonService";
import { IUser } from "../../../../core/types/AuthService/AuthService";
import {
  CreateDiscount,
  UpdateDiscount,
  DeleteDiscountById,
  GetDiscountById,
  DiscountListFilter,
  IDiscount
} from "../../../../core/types/DiscountService/DiscountService";
import { Discount, DiscountRepository } from "../../../../core/DB/Entities/discount.entity";
import { CustomerTypeRepository } from "../../../../core/DB/Entities/customerType.entity";
import { CustomerRepository } from "../../../../core/DB/Entities/customer.entity";
import { SkuRepository } from "../../../../core/DB/Entities/sku.entity";
import { CountryRepository } from "../../../../core/DB/Entities/country.entity";
import { StateRepository } from "../../../../core/DB/Entities/state.entity";
import { DistrictRepository } from "../../../../core/DB/Entities/district.entity";
import { BeatRepository } from "../../../../core/DB/Entities/beat.entity";
import { IsNull } from "typeorm";
import { DiscountStatus, ApprovalStatus } from "../../../../core/DB/Entities/discount.entity";

class DiscountController {
  private discountRepository = DiscountRepository();
  private customerTypeRepository = CustomerTypeRepository();
  private customerRepository = CustomerRepository();
  private skuRepository = SkuRepository();
  private countryRepository = CountryRepository();
  private stateRepository = StateRepository();
  private districtRepository = DistrictRepository();
  private beatRepository = BeatRepository();

  constructor() { }

  async createDiscount(input: CreateDiscount, payload: IUser): Promise<IApiResponse> {
    try {
      const {
        discountName,
        discountType,
        discountCategory,
        customerTypeId,
        customerId,
        skuId,
        countryId,
        stateId,
        districtId,
        beatId,
        validFrom,
        validTill,
        status,
        approvalStatus,
        pktType,
        minQty,
        maxQty,
        minimumOrderValue,
        discountValueType,
        discountValue,
        discountPercentage
      } = input;

          if (!discountName || discountName.trim() === "") {
      return {
        status: STATUSCODES.BAD_REQUEST,
        message: "Discount name is required",
      };
    }

    if (!discountType) {
      return {
        status: STATUSCODES.BAD_REQUEST,
        message: "Discount type is required",
      };
    }

     const normalizedName = discountName.trim().toLowerCase();

         const existingDiscount = await this.discountRepository.findOne({
      where: {
        discountName: normalizedName,
        isDeleted: false,
      },
    });

    if (existingDiscount) {
      return {
        status: STATUSCODES.CONFLICT,
        message: "Discount with same name already exists",
      };
    }

     if (minQty !== undefined && minQty < 0) {
      return { status: 400, message: "minQty cannot be negative" };
    }

    if (maxQty !== undefined && maxQty < 0) {
      return { status: 400, message: "maxQty cannot be negative" };
    }

    if (minimumOrderValue !== undefined && minimumOrderValue < 0) {
      return { status: 400, message: "minimumOrderValue cannot be negative" };
    }

    if (minQty !== undefined && maxQty !== undefined && minQty > maxQty) {
      return {
        status: STATUSCODES.BAD_REQUEST,
        message: "Minimum Quantity must be <= Maximum Quantity",
      };
    }

      // Validate customer type if provided
      if (customerTypeId) {
        const customerType = await this.customerTypeRepository.findOne({
          where: { customerTypeId, isDeleted: false }
        });
        if (!customerType) {
          return { message: "Customer Type not found", status: STATUSCODES.NOT_FOUND };
        }
      }

      // Validate customer if provided
      if (customerId) {
        const customer = await this.customerRepository.findOne({
          where: { customerId,isDeleted: false }
        });
        if (!customer) {
          return { message: "Customer not found", status: STATUSCODES.NOT_FOUND };
        }
      }

      // Validate SKU if provided
      if (skuId) {
        const sku = await this.skuRepository.findOne({
          where: { skuId, isDeleted: false }
        });
        if (!sku) {
          return { message: "SKU not found", status: STATUSCODES.NOT_FOUND };
        }
      }

      // Validate country if provided
      if (countryId) {
        const country = await this.countryRepository.findOne({
          where: { countryId, deletedAt: IsNull() }
        });
        if (!country) {
          return { message: "Country not found", status: STATUSCODES.NOT_FOUND };
        }
      }

      // Validate state if provided
      if (stateId) {
        const state = await this.stateRepository.findOne({
          where: { stateId,isDeleted: false }
        });
        if (!state) {
          return { message: "State not found", status: STATUSCODES.NOT_FOUND };
        }
        // Validate state belongs to country if country is provided
        if (countryId && state.countryId !== countryId) {
          return { message: "State does not belong to the selected country", status: STATUSCODES.BAD_REQUEST };
        }
      }

      // Validate district if provided
      if (districtId) {
        const district = await this.districtRepository.findOne({
          where: { districtId }
        });
        if (!district) {
          return { message: "District not found", status: STATUSCODES.NOT_FOUND };
        }
        // Validate district belongs to state if state is provided
        if (stateId && district.stateId !== stateId) {
          return { message: "District does not belong to the selected state", status: STATUSCODES.BAD_REQUEST };
        }
      }

      // Validate beat if provided
      if (beatId) {
        const beat = await this.beatRepository.findOne({
          where: { beatId, isDeleted: false }
        });
        if (!beat) {
          return { message: "Beat not found", status: STATUSCODES.NOT_FOUND };
        }
      }

      // Validate date range
      if (validFrom && validTill && new Date(validFrom) > new Date(validTill)) {
        return { message: "Valid From date must be before Valid Till date", status: STATUSCODES.BAD_REQUEST };
      }

      // Validate discount value based on type
      if (discountValueType === "Percentage") {
        if (!discountPercentage && discountPercentage !== 0) {
          return { message: "Discount Percentage is required when Discount Value Type is Percentage", status: STATUSCODES.BAD_REQUEST };
        }
        if (discountPercentage !== undefined && (discountPercentage < 0 || discountPercentage > 100)) {
          return { message: "Discount Percentage must be between 0 and 100", status: STATUSCODES.BAD_REQUEST };
        }
      } else if (discountValueType === "Amount") {
        if (!discountValue && discountValue !== 0) {
          return { message: "Discount Value is required when Discount Value Type is Amount", status: STATUSCODES.BAD_REQUEST };
        }
        if (discountValue !== undefined && discountValue < 0) {
          return { message: "Discount Value must be greater than or equal to 0", status: STATUSCODES.BAD_REQUEST };
        }
      }

    
      const newDiscount = new Discount();
      newDiscount.discountName = normalizedName;
      newDiscount.discountType = discountType;
      newDiscount.discountCategory = discountCategory;
      newDiscount.customerTypeId = customerTypeId;
      newDiscount.customerId = customerId;
      newDiscount.skuId = skuId;
      newDiscount.countryId = countryId;
      newDiscount.stateId = stateId;
      newDiscount.districtId = districtId;
      newDiscount.beatId = beatId;
      newDiscount.validFrom = validFrom ? new Date(validFrom) : undefined;
      newDiscount.validTill = validTill ? new Date(validTill) : undefined;
      newDiscount.status = status || DiscountStatus.ACTIVE;
      newDiscount.approvalStatus = approvalStatus || ApprovalStatus.APPROVED;
      newDiscount.pktType = pktType;
      newDiscount.minQty = minQty;
      newDiscount.maxQty = maxQty;
      newDiscount.minimumOrderValue = minimumOrderValue;
      newDiscount.discountValueType = discountValueType;
      newDiscount.discountValue = discountValue;
      newDiscount.discountPercentage = discountPercentage;

      const savedDiscount = await this.discountRepository.save(newDiscount);

      // // Load relations for response
      // const discountWithRelations = await this.discountRepository.findOne({
      //   where: { discountId: savedDiscount.discountId },
      //   relations: ['customerType', 'customer', 'sku', 'country', 'state', 'district', 'beat']
      // });

      return {
        status: STATUSCODES.SUCCESS,
        message: "Discount created successfully.",
        data: savedDiscount,
      };
    } catch (error) {
      console.error("Create Discount Error:", error);
      return {
      status: STATUSCODES.BAD_REQUEST,
      message: "Failed to create discount",
    };
    }
  }

  async updateDiscount(input: UpdateDiscount, payload: IUser): Promise<IApiResponse> {
    try {
      const {
        discountId,
        discountName,
        discountType,
        discountCategory,
        customerTypeId,
        customerId,
        skuId,
        countryId,
        stateId,
        districtId,
        beatId,
        validFrom,
        validTill,
        status,
        approvalStatus,
        pktType,
        minQty,
        maxQty,
        minimumOrderValue,
        discountValueType,
        discountValue,
        discountPercentage
      } = input;

      const discount = await this.discountRepository.findOne({
        where: { discountId: Number(discountId) }
      });

      if (!discount) {
        return { message: "Discount not found", status: STATUSCODES.NOT_FOUND };
      }

      // Validate customer type if provided
      if (customerTypeId) {
        const customerType = await this.customerTypeRepository.findOne({
          where: { customerTypeId, isDeleted: false }
        });
        if (!customerType) {
          return { message: "Customer Type not found", status: STATUSCODES.NOT_FOUND };
        }
      }

      // Validate customer if provided
      if (customerId) {
        const customer = await this.customerRepository.findOne({
          where: { customerId }
        });
        if (!customer) {
          return { message: "Customer not found", status: STATUSCODES.NOT_FOUND };
        }
      }

      // Validate SKU if provided
      if (skuId) {
        const sku = await this.skuRepository.findOne({
          where: { skuId, isDeleted: false }
        });
        if (!sku) {
          return { message: "SKU not found", status: STATUSCODES.NOT_FOUND };
        }
      }

      // Validate country if provided
      if (countryId) {
        const country = await this.countryRepository.findOne({
          where: { countryId, deletedAt: IsNull() }
        });
        if (!country) {
          return { message: "Country not found", status: STATUSCODES.NOT_FOUND };
        }
      }

      // Validate state if provided
      if (stateId) {
        const state = await this.stateRepository.findOne({
          where: { stateId }
        });
        if (!state) {
          return { message: "State not found", status: STATUSCODES.NOT_FOUND };
        }
        // Validate state belongs to country if country is provided
        if (countryId && state.countryId !== countryId) {
          return { message: "State does not belong to the selected country", status: STATUSCODES.BAD_REQUEST };
        }
      }

      // Validate district if provided
      if (districtId) {
        const district = await this.districtRepository.findOne({
          where: { districtId }
        });
        if (!district) {
          return { message: "District not found", status: STATUSCODES.NOT_FOUND };
        }
        // Validate district belongs to state if state is provided
        if (stateId && district.stateId !== stateId) {
          return { message: "District does not belong to the selected state", status: STATUSCODES.BAD_REQUEST };
        }
      }

      // Validate beat if provided
      if (beatId) {
        const beat = await this.beatRepository.findOne({
          where: { beatId, isDeleted: false }
        });
        if (!beat) {
          return { message: "Beat not found", status: STATUSCODES.NOT_FOUND };
        }
      }

      // Validate date range
      if (validFrom && validTill && new Date(validFrom) > new Date(validTill)) {
        return { message: "Valid From date must be before Valid Till date", status: STATUSCODES.BAD_REQUEST };
      }

      // Validate discount value based on type
      if (discountValueType === "Percentage") {
        if (!discountPercentage && discountPercentage !== 0) {
          return { message: "Discount Percentage is required when Discount Value Type is Percentage", status: STATUSCODES.BAD_REQUEST };
        }
        if (discountPercentage !== undefined && (discountPercentage < 0 || discountPercentage > 100)) {
          return { message: "Discount Percentage must be between 0 and 100", status: STATUSCODES.BAD_REQUEST };
        }
      } else if (discountValueType === "Amount") {
        if (!discountValue && discountValue !== 0) {
          return { message: "Discount Value is required when Discount Value Type is Amount", status: STATUSCODES.BAD_REQUEST };
        }
        if (discountValue !== undefined && discountValue < 0) {
          return { message: "Discount Value must be greater than or equal to 0", status: STATUSCODES.BAD_REQUEST };
        }
      }

      // Validate quantity range
      if (minQty !== undefined && maxQty !== undefined && minQty > maxQty) {
        return { message: "Minimum Quantity must be less than or equal to Maximum Quantity", status: STATUSCODES.BAD_REQUEST };
      }

      discount.discountName = discountName;
      discount.discountType = discountType;
      discount.discountCategory = discountCategory;
      discount.customerTypeId = customerTypeId;
      discount.customerId = customerId;
      discount.skuId = skuId;
      discount.countryId = countryId;
      discount.stateId = stateId;
      discount.districtId = districtId;
      discount.beatId = beatId;
      discount.validFrom = validFrom ? new Date(validFrom) : undefined;
      discount.validTill = validTill ? new Date(validTill) : undefined;
      if (status !== undefined) discount.status = status;
      if (approvalStatus !== undefined) discount.approvalStatus = approvalStatus;
      discount.pktType = pktType;
      discount.minQty = minQty;
      discount.maxQty = maxQty;
      discount.minimumOrderValue = minimumOrderValue;
      discount.discountValueType = discountValueType;
      discount.discountValue = discountValue;
      discount.discountPercentage = discountPercentage;

      const updatedDiscount = await this.discountRepository.save(discount);

      // Load relations for response
      const discountWithRelations = await this.discountRepository.findOne({
        where: { discountId: updatedDiscount.discountId },
        relations: ['customerType', 'customer', 'sku', 'country', 'state', 'district', 'beat']
      });

      return {
        status: STATUSCODES.SUCCESS,
        message: "Discount updated successfully.",
        data: discountWithRelations
      };
    } catch (error) {
      console.error("Update Discount Error:", error);
      throw error;
    }
  }

  async deleteDiscount(input: DeleteDiscountById): Promise<IApiResponse> {
    try {
      const { discountId } = input;

      const discount = await this.discountRepository.findOne({
        where: { discountId: Number(discountId) }
      });

      if (!discount) {
        return { message: "Discount not found", status: STATUSCODES.NOT_FOUND };
      }

      await this.discountRepository.remove(discount);

      return { message: "Discount deleted successfully", status: STATUSCODES.SUCCESS };
    } catch (error) {
      console.error("Delete Discount Error:", error);
      throw error;
    }
  }

  async getDiscountById(input: GetDiscountById): Promise<IApiResponse> {
    try {
      const { discountId } = input;

      const discount = await this.discountRepository.findOne({
        where: { discountId: Number(discountId) },
        relations: ['customerType', 'customer', 'sku', 'country', 'state', 'district', 'beat']
      });

      if (!discount) {
        return { message: "Discount not found", status: STATUSCODES.NOT_FOUND };
      }

      return {
        status: STATUSCODES.SUCCESS,
        message: "Success.",
        data: discount
      };
    } catch (error) {
      console.error("Get Discount Error:", error);
      throw error;
    }
  }

  async discountList(input: DiscountListFilter, payload: IUser): Promise<IApiResponse> {
    try {
      const {
        search,
        discountType,
        discountCategory,
        status,
        approvalStatus,
        customerTypeId,
        customerId,
        skuId,
        countryId,
        stateId,
        districtId,
        beatId,
        pageNumber,
        pageSize
      } = input;

      const queryBuilder = this.discountRepository.createQueryBuilder('discount')
        .leftJoinAndSelect('discount.customerType', 'customerType')
        .leftJoinAndSelect('discount.customer', 'customer')
        .leftJoinAndSelect('discount.sku', 'sku')
        .leftJoinAndSelect('discount.country', 'country')
        .leftJoinAndSelect('discount.state', 'state')
        .leftJoinAndSelect('discount.district', 'district')
        .leftJoinAndSelect('discount.beat', 'beat')
        .where('1=1');

      if (search) {
        queryBuilder.andWhere(
          `(LOWER(discount.discountName) LIKE LOWER(:search) OR 
           CAST(discount.discountId AS TEXT) LIKE :search)`,
          { search: `%${search}%` }
        );
      }

      if (discountType) {
        queryBuilder.andWhere('discount.discountType = :discountType', { discountType });
      }

      if (discountCategory) {
        queryBuilder.andWhere('discount.discountCategory = :discountCategory', { discountCategory });
      }

      if (status) {
        queryBuilder.andWhere('discount.status = :status', { status });
      }

      if (approvalStatus) {
        queryBuilder.andWhere('discount.approvalStatus = :approvalStatus', { approvalStatus });
      }

      if (customerTypeId !== undefined && customerTypeId !== null) {
        queryBuilder.andWhere('discount.customerTypeId = :customerTypeId', { customerTypeId });
      }

      if (customerId !== undefined && customerId !== null) {
        queryBuilder.andWhere('discount.customerId = :customerId', { customerId });
      }

      if (skuId !== undefined && skuId !== null) {
        queryBuilder.andWhere('discount.skuId = :skuId', { skuId });
      }

      if (countryId !== undefined && countryId !== null) {
        queryBuilder.andWhere('discount.countryId = :countryId', { countryId });
      }

      if (stateId !== undefined && stateId !== null) {
        queryBuilder.andWhere('discount.stateId = :stateId', { stateId });
      }

      if (districtId !== undefined && districtId !== null) {
        queryBuilder.andWhere('discount.districtId = :districtId', { districtId });
      }

      if (beatId !== undefined && beatId !== null) {
        queryBuilder.andWhere('discount.beatId = :beatId', { beatId });
      }

      queryBuilder.orderBy('discount.createdAt', 'DESC')
        .skip((+pageNumber - 1) * +pageSize)
        .take(+pageSize);

      const [discounts, total] = await queryBuilder.getManyAndCount();

      return {
        status: STATUSCODES.SUCCESS,
        message: "Success.",
        data: {
          discounts,
          pagination: {
            pageNumber: +pageNumber,
            pageSize: +pageSize,
            totalRecords: total
          }
        }
      };
    } catch (error) {
      console.error("Discount List Error:", error);
      throw error;
    }
  }
}

export { DiscountController as DiscountService };

