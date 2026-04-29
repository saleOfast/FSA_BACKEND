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
import { DiscountStatus, ApprovalStatus} from "../../../../core/DB/Entities/discount.entity";
import { scopeType as ScopeType } from "../../../../core/DB/Entities/discount.entity";



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
        discountPercentage,
              priority,
      isStackable,
      isStickable,
      scopeType,
      lineCap,
      orderCap,
        
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

        if (!scopeType) {
      return {
        status: 400,
        message: "Scope type is required (LINE / ORDER)",
      };
    }
        if (priority !== undefined && priority < 0) {
      return { status: 400, message: "Priority cannot be negative" };
    }

        if (isStackable === false && isStickable === true) {
      return {
        status: 400,
        message: "Non-stackable discount cannot be stickable",
      };
    }
    if (lineCap !== undefined && lineCap < 0) {
      return { status: 400, message: "Line cap cannot be negative" };
    }
        if (orderCap !== undefined && orderCap < 0) {
      return { status: 400, message: "Order cap cannot be negative" };
    }
        if (scopeType === "LINE" && !skuId) {
      return {
        status: 400,
        message: "SKU is required for LINE level discount",
      };
    }

    if (scopeType === "ORDER" && skuId) {
      return {
        status: 400,
        message: "SKU should not be provided for ORDER level discount",
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

    if (scopeType === "LINE" && !skuId) {
  return {
    status: 400,
    message: "SKU is required for LINE level discount",
  };
}

if (scopeType === "ORDER") {
  // force remove SKU for order level
  input.skuId = null;
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
        newDiscount.priority = priority ?? 0;
    newDiscount.isStackable = isStackable ?? false;
    newDiscount.isStickable = isStickable ?? false;
    newDiscount.scopeType = scopeType;
    newDiscount.lineCap = lineCap;
    newDiscount.orderCap = orderCap;

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
      discountPercentage,
      scopeType,
      priority,
      isStackable,
      isStickable,
      lineCap,
      orderCap,
    } = input;

    const id = Number(discountId);

    // ✅ Fetch (with soft delete)
    const discount = await this.discountRepository.findOne({
      where: { discountId: id, isDeleted: false },
    });

    if (!discount) {
      return { status: 404, message: "Discount not found" };
    }

    // ✅ Duplicate name check (FIXED)
    if (discountName) {
      const normalizedName = discountName.trim().toLowerCase();

      const existing = await this.discountRepository.findOne({
        where: {
          discountName: normalizedName,
          isDeleted: false,
        },
      });

      if (existing && existing.discountId !== id) {
        return {
          status: 409,
          message: "Discount with same name already exists",
        };
      }

      discount.discountName = normalizedName; // ✅ normalize
    }

    // ✅ Validations
    if (minQty !== undefined && minQty < 0)
      return { status: 400, message: "minQty cannot be negative" };

    if (maxQty !== undefined && maxQty < 0)
      return { status: 400, message: "maxQty cannot be negative" };

    if (minimumOrderValue !== undefined && minimumOrderValue < 0)
      return { status: 400, message: "minimumOrderValue cannot be negative" };

    if (minQty !== undefined && maxQty !== undefined && minQty > maxQty)
      return { status: 400, message: "MinQty must be <= MaxQty" };

    if (priority !== undefined && priority < 0)
      return { status: 400, message: "Priority cannot be negative" };

    if (lineCap !== undefined && lineCap < 0)
      return { status: 400, message: "Line cap cannot be negative" };

    if (orderCap !== undefined && orderCap < 0)
      return { status: 400, message: "Order cap cannot be negative" };

    if (isStackable === false && isStickable === true) {
      return {
        status: 400,
        message: "Non-stackable discount cannot be stickable",
      };
    }

    // ✅ Date validation
    if (validFrom && validTill && new Date(validFrom) > new Date(validTill)) {
      return {
        status: 400,
        message: "Valid From must be before Valid Till",
      };
    }

    // ✅ Discount value validation
    if (discountValueType === "Percentage") {
      if (discountPercentage === undefined)
        return { status: 400, message: "Discount % required" };

      if (discountPercentage < 0 || discountPercentage > 100)
        return { status: 400, message: "Discount % must be 0–100" };
    }

    if (discountValueType === "Amount") {
      if (discountValue === undefined)
        return { status: 400, message: "Discount value required" };

      if (discountValue < 0)
        return { status: 400, message: "Discount value cannot be negative" };
    }

    // ✅ Scope validation
    if (scopeType !== undefined) {
      if (scopeType === "LINE" && !skuId) {
        return {
          status: 400,
          message: "SKU is required for LINE level discount",
        };
      }
    }

    // ✅ Relation validations (shortened)
    if (customerTypeId) {
      const ct = await this.customerTypeRepository.findOne({
        where: { customerTypeId, isDeleted: false },
      });
      if (!ct) return { status: 404, message: "Customer Type not found" };
    }

    if (customerId) {
      const c = await this.customerRepository.findOne({
        where: { customerId, isDeleted: false },
      });
      if (!c) return { status: 404, message: "Customer not found" };
    }

    if (skuId) {
      const s = await this.skuRepository.findOne({
        where: { skuId, isDeleted: false },
      });
      if (!s) return { status: 404, message: "SKU not found" };
    }

    // ✅ Assign values safely
    discount.discountType = discountType ?? discount.discountType;
    discount.discountCategory = discountCategory ?? discount.discountCategory;

    discount.customerTypeId = customerTypeId;
    discount.customerId = customerId;
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

    // ✅ Scope handling (FIXED)
    if (scopeType !== undefined) {
      discount.scopeType = scopeType;

      if (scopeType === "ORDER") {
        discount.skuId = null; // remove SKU
      } else {
        discount.skuId = skuId;
      }
    } else {
      discount.skuId = skuId;
    }

    // ✅ New fields
    if (priority !== undefined) discount.priority = priority;
    if (isStackable !== undefined) discount.isStackable = isStackable;
    if (isStickable !== undefined) discount.isStickable = isStickable;
    if (lineCap !== undefined) discount.lineCap = lineCap;
    if (orderCap !== undefined) discount.orderCap = orderCap;

    // ✅ Save
    const updated = await this.discountRepository.save(discount);

    // ✅ Return with relations
    const result = await this.discountRepository.findOne({
      where: { discountId: updated.discountId },
      relations: ["customerType", "customer", "sku", "country", "state", "district", "beat"],
    });

    return {
      status: 200,
      message: "Discount updated successfully",
      data: result,
    };

  } catch (error) {
    console.error("Update Discount Error:", error);
    return {
      status: 400,
      message: "Failed to update discount",
    };
  }
}

  async deleteDiscount(input: DeleteDiscountById): Promise<IApiResponse> {
  try {
    const { discountId } = input;

    const discount = await this.discountRepository.findOne({
      where: { discountId: Number(discountId), isDeleted: false },
    });

    if (!discount) {
      return {
        message: "Discount not found",
        status: STATUSCODES.NOT_FOUND,
      };
    }

    // ✅ Soft delete
    discount.isDeleted = true;

    await this.discountRepository.save(discount);

    return {
      message: "Discount deleted successfully",
      status: STATUSCODES.SUCCESS,
    };
  } catch (error) {
    console.error("Delete Discount Error:", error);
    return {
      status: STATUSCODES.BAD_REQUEST,
      message: "Failed to delete discount",
    };
  }
}
async getDiscountById(input: GetDiscountById): Promise<IApiResponse> {
  try {
    const { discountId } = input;

    // ✅ Validate ID
    if (!discountId || isNaN(Number(discountId))) {
      return {
        status: STATUSCODES.BAD_REQUEST,
        message: "Invalid discountId",
      };
    }

    const discount = await this.discountRepository.findOne({
      where: {
        discountId: Number(discountId),
        isDeleted: false, // ✅ important
      },
      relations: [
        "customerType",
        "customer",
        "sku",
        "country",
        "state",
        "district",
        "beat",
      ],
    });

    if (!discount) {
      return {
        status: STATUSCODES.NOT_FOUND,
        message: "Discount not found",
      };
    }

    return {
      status: STATUSCODES.SUCCESS,
      message: "Discount fetched successfully",
      data: discount,
    };
  } catch (error) {
    console.error("Get Discount Error:", error);
    return {
      status: STATUSCODES.BAD_REQUEST,
      message: "Failed to fetch discount",
    };
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
      pageNumber = 1,
      pageSize = 10,
      scopeType,
      isStackable,
      priority,
      minQty,
      maxQty,
      minimumOrderValue
    } = input;

    const queryBuilder = this.discountRepository
      .createQueryBuilder("discount")
      .leftJoinAndSelect("discount.customerType", "customerType")
      .leftJoinAndSelect("discount.customer", "customer")
      .leftJoinAndSelect("discount.sku", "sku")
      .leftJoinAndSelect("discount.country", "country")
      .leftJoinAndSelect("discount.state", "state")
      .leftJoinAndSelect("discount.district", "district")
      .leftJoinAndSelect("discount.beat", "beat")
      .where("discount.isDeleted = false"); // ✅ important

    // 🔍 Search
    if (search) {
      queryBuilder.andWhere(
        `(LOWER(discount.discountName) LIKE LOWER(:search) 
        OR CAST(discount.discountId AS TEXT) LIKE :search)`,
        { search: `%${search}%` }
      );
    }

    // 🎯 Filters
    if (discountType) {
      queryBuilder.andWhere("discount.discountType = :discountType", { discountType });
    }

    if (discountCategory) {
      queryBuilder.andWhere("discount.discountCategory = :discountCategory", { discountCategory });
    }

    if (status) {
      queryBuilder.andWhere("discount.status = :status", { status });
    }

    if (approvalStatus) {
      queryBuilder.andWhere("discount.approvalStatus = :approvalStatus", { approvalStatus });
    }

    if (customerTypeId != null) {
      queryBuilder.andWhere("discount.customerTypeId = :customerTypeId", { customerTypeId });
    }

    if (customerId != null) {
      queryBuilder.andWhere("discount.customerId = :customerId", { customerId });
    }

    if (skuId != null) {
      queryBuilder.andWhere("discount.skuId = :skuId", { skuId });
    }

    if (countryId != null) {
      queryBuilder.andWhere("discount.countryId = :countryId", { countryId });
    }

    if (stateId != null) {
      queryBuilder.andWhere("discount.stateId = :stateId", { stateId });
    }

    if (districtId != null) {
      queryBuilder.andWhere("discount.districtId = :districtId", { districtId });
    }

    if (beatId != null) {
      queryBuilder.andWhere("discount.beatId = :beatId", { beatId });
    }

    // 🔥 Additional filters (you missed these earlier)
    if (scopeType) {
      queryBuilder.andWhere("discount.scopeType = :scopeType", { scopeType });
    }

    if (isStackable !== undefined) {
      queryBuilder.andWhere("discount.isStackable = :isStackable", { isStackable });
    }

    if (priority !== undefined) {
      queryBuilder.andWhere("discount.priority = :priority", { priority });
    }

    if (minQty !== undefined) {
      queryBuilder.andWhere("discount.minQty >= :minQty", { minQty });
    }

    if (maxQty !== undefined) {
      queryBuilder.andWhere("discount.maxQty <= :maxQty", { maxQty });
    }

    if (minimumOrderValue !== undefined) {
      queryBuilder.andWhere("discount.minimumOrderValue >= :minimumOrderValue", {
        minimumOrderValue,
      });
    }

    // 📅 Optional: Active date filter (recommended)
    queryBuilder.andWhere(
      `(discount.validFrom IS NULL OR discount.validFrom <= NOW()) 
       AND (discount.validTill IS NULL OR discount.validTill >= NOW())`
    );

    // 📊 Sorting (better than only createdAt)
    queryBuilder
      .orderBy("discount.priority", "DESC")
      .addOrderBy("discount.createdAt", "DESC");

    // 📄 Pagination (safe parsing)
    const page = Number(pageNumber) || 1;
    const limit = Number(pageSize) || 10;

    queryBuilder.skip((page - 1) * limit).take(limit);

    const [discounts, total] = await queryBuilder.getManyAndCount();

    return {
      status: STATUSCODES.SUCCESS,
      message: "Discount list fetched successfully",
      data: {
        discounts,
        pagination: {
          pageNumber: page,
          pageSize: limit,
          totalRecords: total,
          totalPages: Math.ceil(total / limit),
        },
      },
    };
  } catch (error) {
    console.error("Discount List Error:", error);
    return {
      status: STATUSCODES.BAD_REQUEST,
      message: "Failed to fetch discount list",
    };
  }
}
}

export { DiscountController as DiscountService };

