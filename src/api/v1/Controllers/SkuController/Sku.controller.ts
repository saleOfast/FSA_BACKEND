import { SkuRepository, Sku } from "../../../../core/DB/Entities/sku.entity";
import { STATUSCODES } from "../../../../core/types/Constent/common";
import { IApiResponse } from "../../../../core/types/Constent/commonService";
import { CreateSkuRequest, DeleteSkuById, GetSkuById, GetSkuListRequest, UpdateSkuRequest } from "../../../../core/types/SkuService/SkuService";
import { Sku as ISku } from "../../../../core/DB/Entities/sku.entity";
import { IUser } from "../../../../core/types/AuthService/AuthService";
import { ProductRepository } from "../../../../core/DB/Entities/products.entity";
import { TaxesRepository } from "../../../../core/DB/Entities/tax.entity";
import { getSchemeRepository } from "../../../../core/DB/Entities/scheme.entity";
import { DiscountRepository } from "../../../../core/DB/Entities/discount.entity";
import { SkuStatus } from "../../../../core/DB/Entities/sku.entity";

class SkuController {
    private skuRepository = SkuRepository();
    private skuModel = Sku;
    private productRepository = ProductRepository();
    private taxRepository = TaxesRepository();
    private schemeRepository = getSchemeRepository();
    private discountRepository = DiscountRepository();

    constructor() { }

async createSku(input: CreateSkuRequest, payload: IUser): Promise<IApiResponse> {
  try {
    let {
      skuName,
      productId,
      packSize,
      vom,
      mrp,
      basePrice,
      taxId,
      barcode,
      caseSize,
      shelfLifeDays,
      netWeight,
      grossWeight,
      dimension,
      status,
      launchDate,
      discontinueDate,
      image,
      remarks
    } = input;

    /* =========================================================
       1️⃣ TRIM + NORMALIZE (Bug 35, 36)
    ========================================================= */
    skuName = skuName?.trim();
    barcode = barcode?.trim();

    const normalizedSkuName = skuName?.toLowerCase();
    const normalizedBarcode = barcode?.toLowerCase();

    /* =========================================================
       2️⃣ REQUIRED FIELD VALIDATION (Bug 39)
    ========================================================= */
    if (!skuName) {
      return {
        status: STATUSCODES.BAD_REQUEST,
        message: "SKU Name is required"
      };
    }

    /* =========================================================
       3️⃣ DUPLICATE CHECK (Bug 34, 35, 36)
    ========================================================= */
    const existingSku = await this.skuRepository
      .createQueryBuilder("sku")
      .where("LOWER(TRIM(sku.skuName)) = :skuName", { skuName: normalizedSkuName })
      .orWhere("LOWER(TRIM(sku.barcode)) = :barcode", { barcode: normalizedBarcode })
      .andWhere("sku.isDeleted = false")
      .getOne();

    if (existingSku) {
      return {
        status: STATUSCODES.CONFLICT,
        message: "SKU with same name or barcode already exists"
      };
    }

    /* =========================================================
       4️⃣ PRODUCT VALIDATION
    ========================================================= */
    if (productId) {
      const product = await this.productRepository.findOne({
        where: { productId: Number(productId), isDeleted: false }
      });

      if (!product) {
        return {
          message: "Product Not Found.",
          status: STATUSCODES.NOT_FOUND
        };
      }
    }

    /* =========================================================
       5️⃣ TAX VALIDATION (Bug 37)
    ========================================================= */
    let taxData: any = null;

    if (taxId) {
      taxData = await this.taxRepository.findOne({
        where: { taxId: Number(taxId), isDeleted: false }
      });

      if (!taxData) {
        return {
          message: "Tax Not Found.",
          status: STATUSCODES.NOT_FOUND
        };
      }
    }

    /* =========================================================
       6️⃣ DATE VALIDATION (Bug 38)
    ========================================================= */
    if (launchDate && discontinueDate) {
      const lDate = new Date(launchDate);
      const dDate = new Date(discontinueDate);

      if (lDate > dDate) {
        return {
          status: STATUSCODES.BAD_REQUEST,
          message: "Launch date cannot be greater than discontinue date"
        };
      }
    }

    /* =========================================================
       7️⃣ CREATE SKU
    ========================================================= */
    const sku = this.skuRepository.create({
      skuName,
      productId,
      packSize,
      vom,
      mrp,
      basePrice,
      taxId,
      // ⚠️ Bug 40 FIX: avoid storing redundant HSN
      // hsnCode: taxData?.hsnCode || null,  ❌ REMOVE THIS
      barcode,
      caseSize,
      shelfLifeDays,
      netWeight,
      grossWeight,
      dimension,
      status: status || SkuStatus.ACTIVE,
      launchDate: launchDate ? new Date(launchDate) : undefined,
      discontinueDate: discontinueDate ? new Date(discontinueDate) : undefined,
      image,
      remarks
    });

    const skuData = await this.skuRepository.save(sku);

    return {
      message: "SKU created successfully.",
      status: STATUSCODES.SUCCESS,
      data: {
        ...skuData,
        // If needed, return HSN dynamically instead
        hsnCode: taxData?.hsnCode || null
      }
    };

  } catch (error) {
    throw error;
  }
}

async updateSku(input: UpdateSkuRequest, payload: IUser): Promise<IApiResponse> {
  try {
    const { skuId, ...updateData } = input;

    /* =========================================================
       1️⃣ FIND SKU
    ========================================================= */
    const sku = await this.skuRepository.findOne({
      where: { skuId: Number(skuId), isDeleted: false }
    });

    if (!sku) {
      return { message: "SKU Not Found.", status: STATUSCODES.NOT_FOUND };
    }

    /* =========================================================
       2️⃣ TRIM + NORMALIZE
    ========================================================= */
    if (updateData.skuName !== undefined) {
      updateData.skuName = updateData.skuName?.trim();
    }

    if (updateData.barcode !== undefined) {
      updateData.barcode = updateData.barcode?.trim();
    }

    const normalizedSkuName = updateData.skuName?.toLowerCase();
    const normalizedBarcode = updateData.barcode?.toLowerCase();

    /* =========================================================
       3️⃣ REQUIRED FIELD CHECK (if provided empty)
    ========================================================= */
    if (updateData.skuName !== undefined && !updateData.skuName) {
      return {
        status: STATUSCODES.BAD_REQUEST,
        message: "SKU Name cannot be empty"
      };
    }

    /* =========================================================
       4️⃣ DUPLICATE CHECK (excluding current SKU)
    ========================================================= */
    if (normalizedSkuName || normalizedBarcode) {
      const duplicate = await this.skuRepository
        .createQueryBuilder("sku")
        .where("sku.skuId != :skuId", { skuId })
        .andWhere("sku.isDeleted = false")
        .andWhere(
          `(LOWER(TRIM(sku.skuName)) = :skuName OR LOWER(TRIM(sku.barcode)) = :barcode)`,
          {
            skuName: normalizedSkuName,
            barcode: normalizedBarcode
          }
        )
        .getOne();

      if (duplicate) {
        return {
          status: STATUSCODES.CONFLICT,
          message: "SKU with same name or barcode already exists"
        };
      }
    }

    /* =========================================================
       5️⃣ PRODUCT VALIDATION
    ========================================================= */
    if (updateData.productId !== undefined) {
      const product = await this.productRepository.findOne({
        where: { productId: Number(updateData.productId), isDeleted: false }
      });

      if (!product) {
        return { message: "Product Not Found.", status: STATUSCODES.NOT_FOUND };
      }
    }

    /* =========================================================
       6️⃣ TAX VALIDATION (with soft delete)
    ========================================================= */
    let taxData: any = null;

    if (updateData.taxId !== undefined) {
      taxData = await this.taxRepository.findOne({
        where: { taxId: Number(updateData.taxId), isDeleted: false }
      });

      if (!taxData) {
        return { message: "Tax Not Found.", status: STATUSCODES.NOT_FOUND };
      }
    }

    /* =========================================================
       7️⃣ DATE VALIDATION
    ========================================================= */
    const finalLaunchDate = updateData.launchDate
      ? new Date(updateData.launchDate)
      : sku.launchDate;

    const finalDiscontinueDate = updateData.discontinueDate
      ? new Date(updateData.discontinueDate)
      : sku.discontinueDate;

    if (finalLaunchDate && finalDiscontinueDate && finalLaunchDate > finalDiscontinueDate) {
      return {
        status: STATUSCODES.BAD_REQUEST,
        message: "Launch date cannot be greater than discontinue date"
      };
    }

    /* =========================================================
       8️⃣ PREPARE UPDATE OBJECT
    ========================================================= */
    const updateObject: any = {};

    if (updateData.skuName !== undefined) updateObject.skuName = updateData.skuName;
    if (updateData.productId !== undefined) updateObject.productId = updateData.productId;
    if (updateData.packSize !== undefined) updateObject.packSize = updateData.packSize;
    if (updateData.vom !== undefined) updateObject.vom = updateData.vom;
    if (updateData.mrp !== undefined) updateObject.mrp = updateData.mrp;
    if (updateData.basePrice !== undefined) updateObject.basePrice = updateData.basePrice;

    if (updateData.taxId !== undefined) {
      updateObject.taxId = updateData.taxId;
      // ❌ DO NOT STORE HSN
    }

    if (updateData.barcode !== undefined) updateObject.barcode = updateData.barcode;
    if (updateData.caseSize !== undefined) updateObject.caseSize = updateData.caseSize;
    if (updateData.shelfLifeDays !== undefined) updateObject.shelfLifeDays = updateData.shelfLifeDays;
    if (updateData.netWeight !== undefined) updateObject.netWeight = updateData.netWeight;
    if (updateData.grossWeight !== undefined) updateObject.grossWeight = updateData.grossWeight;
    if (updateData.dimension !== undefined) updateObject.dimension = updateData.dimension;
    if (updateData.status !== undefined) updateObject.status = updateData.status;

    if (updateData.launchDate !== undefined) {
      updateObject.launchDate = updateData.launchDate ? new Date(updateData.launchDate) : null;
    }

    if (updateData.discontinueDate !== undefined) {
      updateObject.discontinueDate = updateData.discontinueDate
        ? new Date(updateData.discontinueDate)
        : null;
    }

    if (updateData.image !== undefined) updateObject.image = updateData.image;
    if (updateData.remarks !== undefined) updateObject.remarks = updateData.remarks;

    /* =========================================================
       9️⃣ UPDATE
    ========================================================= */
    await this.skuRepository
      .createQueryBuilder()
      .update() // or .update(SkuEntity)
      .set(updateObject)
      .where("skuId = :skuId", { skuId: Number(skuId) })
      .execute();

    return {
      message: "SKU updated successfully.",
      status: STATUSCODES.SUCCESS
    };

  } catch (error) {
    throw error;
  }
}

    async getById(input: GetSkuById): Promise<IApiResponse> {
        try {
            const { skuId } = input;

            const sku: ISku | null = await this.skuRepository.findOne({
                where: { skuId: Number(skuId), isDeleted: false },
                relations: ["product", "tax"]
            });

            if (!sku) {
                return { message: "SKU Not Found.", status: STATUSCODES.NOT_FOUND };
            }

            return { message: "Success.", status: STATUSCODES.SUCCESS, data: sku };
        } catch (error) {
            throw error;
        }
    }

    async list(input: GetSkuListRequest, payload: IUser): Promise<IApiResponse> {
        try {
            const { search, status, productId, page, limit } = input;

            const queryBuilder = this.skuRepository
                .createQueryBuilder('sku')
                .leftJoinAndSelect('sku.product', 'product')
                .leftJoinAndSelect('sku.tax', 'tax')
               
                .where('sku.isDeleted = :isDeleted', { isDeleted: false });

            if (search) {
                queryBuilder.andWhere(
                    '(sku.skuName LIKE :search OR sku.barcode LIKE :search)',
                    { search: `%${search}%` }
                );
            }

            if (status) {
                queryBuilder.andWhere('sku.status = :status', { status });
            }

            if (productId) {
                queryBuilder.andWhere('sku.productId = :productId', { productId: Number(productId) });
            }

            // Pagination
            const pageNumber = page ? parseInt(page) : 1;
            const limitNumber = limit ? parseInt(limit) : 100;
            const skip = (pageNumber - 1) * limitNumber;

            queryBuilder
                .skip(skip)
                .take(limitNumber)
                .orderBy('sku.createdAt', 'DESC')
                .addOrderBy('sku.skuName', 'ASC');

            const [skus, total] = await queryBuilder.getManyAndCount();

            return {
                message: "Success.",
                status: STATUSCODES.SUCCESS,
                data: {
                    skus,
                    pagination: {
                        total,
                        page: pageNumber,
                        limit: limitNumber,
                        totalPages: Math.ceil(total / limitNumber)
                    }
                }
            };
        } catch (error) {
            throw error;
        }
    }

    async deleteSku(input: DeleteSkuById): Promise<IApiResponse> {
        try {
            const { skuId } = input;

            const sku: ISku | null = await this.skuRepository.findOne({
                where: { skuId: Number(skuId) }
            });

            if (!sku) {
                return { message: "SKU Not Found.", status: STATUSCODES.NOT_FOUND };
            }

            await this.skuRepository
                .createQueryBuilder()
                .update({ isDeleted: true })
                .where({ skuId: Number(skuId) })
                .execute();

            return { message: "SKU deleted successfully.", status: STATUSCODES.SUCCESS };
        } catch (error) {
            throw error;
        }
    }
}


export { SkuController as SkuService };

