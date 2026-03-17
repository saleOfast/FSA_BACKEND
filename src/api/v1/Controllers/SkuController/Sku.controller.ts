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
            const {
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

            // Validate product exists if provided
            if (productId) {
                const product = await this.productRepository.findOne({
                    where: { productId: Number(productId), isDeleted: false }
                });
                if (!product) {
                    return { message: "Product Not Found.", status: STATUSCODES.NOT_FOUND };
                }
            }

            // Validate tax if provided
          let taxData: any = null;

if (taxId) {
    taxData = await this.taxRepository.findOne({
        where: { taxId: Number(taxId) }
    });

    if (!taxData) {
        return { message: "Tax Not Found.", status: STATUSCODES.NOT_FOUND };
    }
}

      

    
            const sku = this.skuRepository.create({
                skuName,
                productId,
                packSize,
                vom,
                mrp,
                basePrice,
                taxId,
                 hsnCode: taxData?.hsnCode || null,
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

        const skuData=    await this.skuRepository.save(sku);
return {
    message: "SKU created successfully.",
    status: STATUSCODES.SUCCESS,
    data: {
      ...skuData,
       
        hsnCode: taxData?.hsnCode || null
    }
}
        } catch (error) {
            throw error;
        }
    }

    async updateSku(input: UpdateSkuRequest, payload: IUser): Promise<IApiResponse> {
        try {
            const { skuId, ...updateData } = input;

            const sku: ISku | null = await this.skuRepository.findOne({
                where: { skuId: Number(skuId), isDeleted: false }
            });

            if (!sku) {
                return { message: "SKU Not Found.", status: STATUSCODES.NOT_FOUND };
            }

            // Validate product if provided
            if (updateData.productId) {
                const product = await this.productRepository.findOne({
                    where: { productId: Number(updateData.productId), isDeleted: false }
                });
                if (!product) {
                    return { message: "Product Not Found.", status: STATUSCODES.NOT_FOUND };
                }
            }

            // Validate tax if provided
        let taxData: any = null;

if (updateData.taxId) {
    taxData = await this.taxRepository.findOne({
        where: { taxId: Number(updateData.taxId) }
    });

    if (!taxData) {
        return { message: "Tax Not Found.", status: STATUSCODES.NOT_FOUND };
    }
}



            // Prepare update object
            const updateObject: any = {};
            if (updateData.skuName !== undefined) updateObject.skuName = updateData.skuName;
            if (updateData.productId !== undefined) updateObject.productId = updateData.productId;
            if (updateData.packSize !== undefined) updateObject.packSize = updateData.packSize;
            if (updateData.vom !== undefined) updateObject.vom = updateData.vom;
            if (updateData.mrp !== undefined) updateObject.mrp = updateData.mrp;
            if (updateData.basePrice !== undefined) updateObject.basePrice = updateData.basePrice;
          if (updateData.taxId !== undefined) {
    updateObject.taxId = updateData.taxId;
    updateObject.hsnCode = taxData?.hsnCode || null;
}
            if (updateData.barcode !== undefined) updateObject.barcode = updateData.barcode;
            if (updateData.caseSize !== undefined) updateObject.caseSize = updateData.caseSize;
            if (updateData.shelfLifeDays !== undefined) updateObject.shelfLifeDays = updateData.shelfLifeDays;
            if (updateData.netWeight !== undefined) updateObject.netWeight = updateData.netWeight;
            if (updateData.grossWeight !== undefined) updateObject.grossWeight = updateData.grossWeight;
            if (updateData.dimension !== undefined) updateObject.dimension = updateData.dimension;
            if (updateData.status !== undefined) updateObject.status = updateData.status;
            if (updateData.launchDate !== undefined) updateObject.launchDate = new Date(updateData.launchDate);
            if (updateData.discontinueDate !== undefined) updateObject.discontinueDate = new Date(updateData.discontinueDate);
            if (updateData.image !== undefined) updateObject.image = updateData.image;

            if (updateData.remarks !== undefined) updateObject.remarks = updateData.remarks;

            await this.skuRepository
                .createQueryBuilder()
                .update(updateObject)
                .where({ skuId: Number(skuId) })
                .execute();

            return { message: "SKU updated successfully.", status: STATUSCODES.SUCCESS };
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

