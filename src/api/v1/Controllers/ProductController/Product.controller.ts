import { IBrand } from "../../../../core/types/BrandService/BrandService";
import { BrandRepository } from "../../../../core/DB/Entities/brand.entity";
import { ProductRepository, Products } from "../../../../core/DB/Entities/products.entity";
import { DiscountType, STATUSCODES, UserRole } from "../../../../core/types/Constent/common";
import { IApiResponse } from "../../../../core/types/Constent/commonService";
import { CreateProductCategory, CreateProductRequest, DeleteCategoryById, DeleteProductById, GetCategoryById, GetProductById, GetProductListRequest, IProductCategory, IProducts, ISkuDiscount, SkuDiscount, UpdateCategoryById, UpdateProductRequest } from "../../../../core/types/ProductService/ProductService";
import { IUser } from "../../../../core/types/AuthService/AuthService";
import { ProductCategory, ProductCategoryRepository } from "../../../../core/DB/Entities/productCategory.entity";
import { FindOptionsWhere } from "typeorm";

class ProductController {
    private productRepositry = ProductRepository();
    private productModel = Products;
    private brandRepository = BrandRepository();
    private productCategoryRespositry = ProductCategoryRepository();

    constructor() { }

async createProduct(
  input: CreateProductRequest,
  payload: IUser
): Promise<IApiResponse> {
  try {
    const {
      sku,
      productName,
      brandId,
      categoryId,
      mrp,
      rlp,
      caseQty,
      skuDiscount,
      batchNumber,
      manufacturingDate,
      expiryDate,
      subcategory,
      shelf_life,
      product_state,
      unitOfMeasure,
      total_quantity,
      total_sold,
      quantity_in_stock,
      reorderLevel,
      maxStockLevel,
      currency,
      purchase_price,
      selling_price,
      storage_location,
      storage_condition,
      stock_in_date,
      stock_out_date,
      damaged_quantity,
      image,
      colour
    } = input;

    const { emp_id } = payload;

    // ✅ Validate brand
    if (!brandId || isNaN(Number(brandId)) || Number(brandId) <= 0) {
      return { message: "Invalid brandId", status: STATUSCODES.BAD_REQUEST };
    }
    const parsedBrandId = Number(brandId);
    const brand: IBrand | null = await this.brandRepository.findOneBy({
      brandId: parsedBrandId,
      isDeleted: false,
    });
    if (!brand) {
      return {
        message: `Brand ${parsedBrandId} not found`,
        status: STATUSCODES.NOT_FOUND,
      };
    }

    // ✅ Validate category
    if (categoryId) {
      const category = await this.productCategoryRespositry.findOneBy({
        productCategoryId: Number(categoryId),
        isDeleted: false,
      });
      if (!category) {
        return {
          message: "Category Not Found",
          status: STATUSCODES.NOT_FOUND,
        };
      }
    }

    // ✅ Ensure total_quantity is defined
    if (total_quantity === undefined || total_quantity < 0) {
      return {
        message: "total_quantity is required and must be >= 0",
        status: STATUSCODES.BAD_REQUEST,
      };
    }

    // ✅ Stock validation
    const totalQuantity = total_quantity;
    const totalSold = total_sold ?? 0;
    const damagedQty = damaged_quantity ?? 0;

    if (totalSold + damagedQty > totalQuantity) {
      return {
        message:
          "Invalid stock data: total sold + damaged quantity exceeds total quantity",
        status: STATUSCODES.BAD_REQUEST,
      };
    }

    // ✅ Create product
    const product = new this.productModel();
    product.sku = input.sku;
    product.productName = productName;
    product.empId = emp_id;
    product.brandId = parsedBrandId;
    product.categoryId = categoryId;
    product.mrp = mrp;
    product.rlp = rlp;
    product.caseQty = caseQty;
    product.batchNumber = batchNumber;
    product.subcategory = subcategory;
    product.shelf_life = shelf_life;
    product.product_state = product_state ?? "In stock";
    product.unitOfMeasure = unitOfMeasure;
    product.total_quantity = totalQuantity;
    product.totalSold = totalSold;
    product.damagedQuantity = damagedQty;

    product.quantityInStock =
      quantity_in_stock ?? totalQuantity - (totalSold + damagedQty);

    product.reorderLevel = reorderLevel;
    product.maxStockLevel = maxStockLevel;
    product.currency = currency;
    product.purchase_price = purchase_price;
    product.selling_price = selling_price;
    product.storage_location = storage_location;
    product.storageCondition = storage_condition;
    product.image = image;
    product.colour = input.colour;
    // ✅ Dates
    product.manufacturingDate = manufacturingDate
      ? new Date(manufacturingDate).toISOString()
      : undefined;
    product.expiryDate = expiryDate
      ? new Date(expiryDate).toISOString()
      : undefined;
    product.stock_in_date = stock_in_date
      ? new Date(stock_in_date).toISOString()
      : undefined;
    product.stock_out_date = stock_out_date
      ? new Date(stock_out_date).toISOString()
      : undefined;

    // ✅ Flags
    product.isFocused = input.isFocused ?? false;
    product.isActive = input.isActive ?? true;

    // ✅ SKU Discount
    if (skuDiscount) {
      const skuDiscountObj: ISkuDiscount = new SkuDiscount();
      skuDiscountObj.discountType = skuDiscount.discountType;
      skuDiscountObj.isActive = skuDiscount.isActive ?? false;
      skuDiscountObj.value = skuDiscount.value ?? 0;
      product.skuDiscount = skuDiscountObj;
    }

    // ✅ RLP validation
    if (product.rlp !== undefined && product.rlp > product.mrp) {
      return {
        message: "RLP must be <= MRP",
        status: STATUSCODES.BAD_REQUEST,
      };
    }

    await this.productRepositry.save(product);
    return {
      message: "Product created successfully.",
      status: STATUSCODES.SUCCESS,
    };
  } catch (error) {
    console.error("Error in createProduct:", error);
    throw error;
  }
}



   async updateProduct(input: UpdateProductRequest, payload: IUser): Promise<IApiResponse> {
  try {
    const {
      productId,
      sku,
      productName,
      brandId,
      categoryId,
      mrp,
      rlp,
      caseQty,
      skuDiscount,
      batchNumber,
      manufacturingDate,
      expiryDate,
      subcategory,
      shelf_life,
      product_state,
      unitOfMeasure,
      total_quantity,
      total_sold,
      quantity_in_stock,
      reorderLevel,
      maxStockLevel,
      currency,
      image,
      colour,
      purchase_price,
      selling_price,
      storage_location,
      storage_condition,
      stock_in_date,
      stock_out_date,
      damaged_quantity,
      isFocused,
      isActive,
    } = input;

    const product: Products | null = await this.productRepositry.findOne({
      where: { productId: Number(productId), isDeleted: false },
    });

    if (!product) {
      return { message: "Product Not Found.", status: STATUSCODES.NOT_FOUND };
    }

    // ✅ Validate brand if provided
    if (brandId) {
      const brand = await this.brandRepository.findOneBy({
        brandId: Number(brandId),
        isDeleted: false,
      });
      if (!brand) {
        return { message: `Brand ${brandId} not found`, status: STATUSCODES.NOT_FOUND };
      }
    }

    // ✅ Validate category if provided
    if (categoryId) {
      const category = await this.productCategoryRespositry.findOneBy({
        productCategoryId: Number(categoryId),
        isDeleted: false,
      });
      if (!category) {
        return { message: "Category Not Found", status: STATUSCODES.NOT_FOUND };
      }
    }
    // ✅ Stock validation
    const totalQty = total_quantity ?? product.total_quantity??0;
    const totalSold = total_sold ?? product.totalSold ?? 0;
    const damagedQty = damaged_quantity ?? product.damagedQuantity ?? 0;

    

    if (totalSold + damagedQty > totalQty) {
      return {
        message: "Invalid stock data: total sold + damaged quantity exceeds total quantity",
        status: STATUSCODES.BAD_REQUEST,
      };
    }

    // ✅ Build partial update object
    const updateData: Partial<Products> = {
        sku: sku ?? product.sku,
        productName: productName ?? product.productName,
        brandId: brandId ?? product.brandId,
        categoryId: categoryId ?? product.categoryId,
        mrp: mrp ?? product.mrp,
        rlp: rlp ?? product.rlp,
        image: image ?? product.image,
        colour: colour ?? product.colour,
        caseQty: caseQty ?? product.caseQty,
        batchNumber: batchNumber ?? product.batchNumber,
        subcategory: subcategory ?? product.subcategory,
        shelf_life: shelf_life ?? product.shelf_life,
        product_state: product_state ?? product.product_state,
        unitOfMeasure: unitOfMeasure ?? product.unitOfMeasure,
        total_quantity: totalQty,
        totalSold: totalSold,
        damagedQuantity: damagedQty,
        quantityInStock: quantity_in_stock ?? (totalQty - (totalSold + damagedQty)),
        reorderLevel: reorderLevel ?? product.reorderLevel,
        maxStockLevel: maxStockLevel ?? product.maxStockLevel,
        currency: currency ?? product.currency,
        purchase_price: purchase_price ?? product.purchase_price,
        selling_price: selling_price ?? product.selling_price,
        storage_location: storage_location ?? product.storage_location,
        storageCondition: storage_condition ?? product.storageCondition,
        isFocused: isFocused ?? product.isFocused,
        isActive: isActive ?? product.isActive,
      };

    // ✅ Dates
    if (manufacturingDate) updateData.manufacturingDate = new Date(manufacturingDate).toISOString();
    if (expiryDate) updateData.expiryDate = new Date(expiryDate).toISOString();
    if (stock_in_date) updateData.stock_in_date = new Date(stock_in_date).toISOString();
    if (stock_out_date) updateData.stock_out_date = new Date(stock_out_date).toISOString();

    // ✅ SKU Discount
    if (skuDiscount) {
      updateData.skuDiscount = {
        discountType: skuDiscount.discountType,
        value: skuDiscount.value ?? 0,
        isActive: skuDiscount.isActive ?? false,
      };
    }

    // ✅ RLP validation
    if (updateData.rlp !== undefined && updateData.mrp !== undefined && updateData.rlp > updateData.mrp) {
      return { message: "RLP must be <= MRP", status: STATUSCODES.BAD_REQUEST };
    }

    await this.productRepositry
    .createQueryBuilder()
    .update(Products)
    .set(updateData)
    .where({ productId: Number(productId) })
    .execute();

    return { message: "Product updated successfully.", status: STATUSCODES.SUCCESS };
  } catch (error) {
    console.error("Error in updateProduct:", error);
    throw error;
  }
}


    async getById(input: GetProductById): Promise<IApiResponse> {
        try {
            const { productId } = input;

            const product: IProducts | null = await this.productRepositry.findOne({
                where: { productId: Number(productId), isDeleted: false },
                relations: ["brand", "category"]
            });

            if (!product) {
                return { message: "Product Not Found.", status: STATUSCODES.NOT_FOUND }
            }

            return { message: "Success.", status: STATUSCODES.SUCCESS, data: product }
        } catch (error) {
            throw error;
        }
    }

    // async list(input: GetProductListRequest, payload: IUser): Promise<IApiResponse> {
    //     try {
    //         const {role} = payload;
    //         const { isFocused, search, category, brand, isActive } = input;
    //         console.log({input})
    //         // const {isActive} = input
    //         let queryFilter: FindOptionsWhere<any> = { isDeleted: false }
    //         if (isFocused == 'true') {
    //             queryFilter.isFocused = true;
    //         }
    //         if (isActive == 'true') {
    //             queryFilter.isActive = true;
    //         }
    //         if (brand) {
    //             queryFilter.brand.name = brand;
    //         }
    //         if (category) {
    //             queryFilter.category.name = category;
    //         }

    //         const products: IProducts[] | null = await this.productRepositry.find({
    //             where: queryFilter,
    //             relations: ["brand", "category"],
    //             order: {
    //                 updatedAt: 'DESC',
    //                 createdAt: 'DESC'
    //             }
    //         });

    //         return { message: "Success.", status: STATUSCODES.SUCCESS, data: products }
    //     } catch (error) {
    //         throw error;
    //     }
    // }
    async list(input: GetProductListRequest, payload: IUser): Promise<IApiResponse> {
        try {
            const { role } = payload;
            const { isFocused, search, category, brand, isActive } = input;

            console.log({ input });

            // Initialize the QueryBuilder
            const queryBuilder = this.productRepositry.createQueryBuilder('product')
                .leftJoinAndSelect('product.brand', 'brand')
                .leftJoinAndSelect('product.category', 'category')
                .where('product.isDeleted = :isDeleted', { isDeleted: false });

            // Add conditions dynamically

            if (isFocused === 'true') {
                queryBuilder.andWhere('product.isFocused = :isFocused', { isFocused: true });
            }
            if (role === UserRole.SSM || role === UserRole.RETAILER) {
                queryBuilder.andWhere('product.isActive = :isActive', { isActive: true });
            }
            if (isActive === 'true') {
                queryBuilder.andWhere('product.isActive = :isActive', { isActive: true });
            }
            if (Number(brand) > 0) {
                queryBuilder.andWhere('brand.brandId = :brandId', { brandId: brand });
            }
            if (Number(category) > 0) {
                queryBuilder.andWhere('category.productCategoryId = :productCategoryId', { productCategoryId: category });
            }
            if (search) {
                queryBuilder.andWhere('product.name LIKE :search', { search: `%${search}%` });
            }

            // Add ordering
            queryBuilder.orderBy('product.isActive', 'DESC')
                .addOrderBy('product.isFocused', 'DESC')
                .addOrderBy('product.productName', 'ASC')
                .addOrderBy('product.createdAt', 'DESC');

            // Execute the query and get the results
            const products = await queryBuilder.getMany();

            return { message: "Success.", status: STATUSCODES.SUCCESS, data: products };
        } catch (error) {
            throw error;
        }
    }

    async deleteProduct(input: DeleteProductById): Promise<IApiResponse> {
        try {
            const { productId } = input;

            const product: IProducts | null = await this.productRepositry.findOne({
                where: { productId: Number(productId) },
                relations: ["brand", "category"]
            });

            if (!product) {
                return { message: "Product Not Found.", status: STATUSCODES.NOT_FOUND }
            }

            await this.productRepositry.createQueryBuilder()
                .update({ isDeleted: true })
                .where({ productId: Number(productId) })
                .execute()

            return { message: "Success.", status: STATUSCODES.SUCCESS }
        } catch (error) {
            throw error;
        }
    }

    /**
     * Product Category Controller
     */
    async createProductCategory(input: CreateProductCategory, payload: IUser): Promise<IApiResponse> {
        try {
            const { name, parentId } = input;
            const { emp_id } = payload;
            const newCat = new ProductCategory();
            newCat.empId = emp_id;
            newCat.name = name;
            newCat.parentId = parentId

            await this.productCategoryRespositry.save(newCat);

            return { message: "Success.", status: STATUSCODES.SUCCESS }
        } catch (error) {
            throw error;
        }
    }

    async categoryList(): Promise<IApiResponse> {
        try {
            const catList: IProductCategory[] | null = await this.productCategoryRespositry.find({ where: { isDeleted: false }, relations: ['children', 'parent'], order: { name: 'ASC' } });
            return { message: "Success.", status: STATUSCODES.SUCCESS, data: catList }
        } catch (error) {
            throw error;
        }
    }

    async getCategoryById(input: GetCategoryById): Promise<IApiResponse> {
        try {
            const { catId } = input;

            const category: IProductCategory | null = await this.productCategoryRespositry.findOne({ where: { productCategoryId: Number(catId), isDeleted: false, isActive: false }, relations: ['children', 'parent'] });

            if (!category) {
                return { message: "Category Not Found.", status: STATUSCODES.NOT_FOUND }
            }

            return { message: "Success.", status: STATUSCODES.SUCCESS, data: category }
        } catch (error) {
            throw error;
        }
    }

    async updateCategory(input: UpdateCategoryById): Promise<IApiResponse> {
        try {
            const { catId, name, parentId } = input;
            const category: IProductCategory | null = await this.productCategoryRespositry.findOne({ where: { productCategoryId: Number(catId), isDeleted: false }, relations: ['children', 'parent'] });

            if (!category) {
                return { message: "Category Not Found.", status: STATUSCODES.NOT_FOUND }
            }
            await this.productCategoryRespositry.createQueryBuilder().update({ name, parentId }).where({ productCategoryId: catId }).execute();

            return { message: "Success.", status: STATUSCODES.SUCCESS }
        } catch (error) {
            throw error;
        }
    }

    async deleteCategoryById(input: DeleteCategoryById): Promise<IApiResponse> {
        try {
            const { catId } = input;

            await this.productCategoryRespositry.createQueryBuilder().update({ isDeleted: true }).where({ productCategoryId: catId }).execute();

            return { message: "Success.", status: STATUSCODES.SUCCESS }
        } catch (error) {
            throw error;
        }
    }

   async createProducts(
  inputs: CreateProductRequest[],
  payload: IUser
): Promise<IApiResponse> {
  try {
    const { emp_id } = payload;
    const skippedProducts: string[] = [];
    const processedProducts: Set<string> = new Set();

    for (const input of inputs) {
      const {
        sku,
        productName,
        brandId,
        categoryId,
        mrp,
        rlp,
        caseQty,
        skuDiscount,
        batchNumber,
        manufacturingDate,
        expiryDate,
        subcategory,
        shelf_life,
        product_state,
        unitOfMeasure,
        total_quantity,
        total_sold,
        quantity_in_stock,
        reorderLevel,
        maxStockLevel,
        currency,
        purchase_price,
        selling_price,
        storage_location,
        storage_condition,
        stock_in_date,
        stock_out_date,
        damaged_quantity,
        image,
        colour,
        isFocused,
        isActive,
      } = input;

      const productKey = `${productName}-${brandId}-${categoryId}`;
      if (processedProducts.has(productKey)) {
        skippedProducts.push(`${productName} (Duplicate in input)`);
        continue;
      }
      processedProducts.add(productKey);

      // Validate brand
      if (!brandId || isNaN(Number(brandId)) || Number(brandId) <= 0) {
        skippedProducts.push(`${productName} (Invalid brandId)`);
        continue;
      }
      const parsedBrandId = Number(brandId);
      const brand: IBrand | null = await this.brandRepository.findOneBy({
        brandId: parsedBrandId,
        isDeleted: false,
      });
      if (!brand) {
        skippedProducts.push(`${productName} (Brand not found)`);
        continue;
      }

      // Validate category
      if (categoryId) {
        const category = await this.productCategoryRespositry.findOneBy({
          productCategoryId: Number(categoryId),
          isDeleted: false,
        });
        if (!category) {
          skippedProducts.push(`${productName} (Category not found)`);
          continue;
        }
      }

      // Stock validation
      const totalQty = total_quantity ?? 0;
      const totalSold = total_sold ?? 0;
      const damagedQty = damaged_quantity ?? 0;
      const qtyInStock =
        quantity_in_stock ?? totalQty - (totalSold + damagedQty);

      if (totalSold + damagedQty > totalQty) {
        skippedProducts.push(
          `${productName} (totalSold + damagedQuantity exceeds totalQuantity)`
        );
        continue;
      }

      // Check if product already exists
      const existingProduct = await this.productRepositry.findOneBy({
        productName,
        brandId: parsedBrandId,
        categoryId: Number(categoryId),
      });
      if (existingProduct) {
        skippedProducts.push(`${productName} (Already exists)`);
        continue;
      }

      // Create product
      const product = new this.productModel();
      product.sku = sku;
      product.productName = productName;
      product.empId = emp_id;
      product.brandId = parsedBrandId;
      product.categoryId = categoryId;
      product.mrp = mrp;
      product.rlp = rlp;
      product.caseQty = caseQty;
      product.batchNumber = batchNumber;
      product.subcategory = subcategory;
      product.shelf_life = shelf_life;
      product.product_state = product_state ?? "In stock";
      product.unitOfMeasure = unitOfMeasure;
      product.total_quantity = totalQty;
      product.totalSold = totalSold;
      product.damagedQuantity = damagedQty;
      product.quantityInStock = qtyInStock;
      product.reorderLevel = reorderLevel;
      product.maxStockLevel = maxStockLevel;
      product.currency = currency;
      product.purchase_price = purchase_price;
      product.selling_price = selling_price;
      product.storage_location = storage_location;
      product.storageCondition = storage_condition;
      product.image = image;
      product.colour = colour;

      // Dates
      product.manufacturingDate = manufacturingDate
        ? new Date(manufacturingDate).toISOString()
        : undefined;
      product.expiryDate = expiryDate
        ? new Date(expiryDate).toISOString()
        : undefined;
      product.stock_in_date = stock_in_date
        ? new Date(stock_in_date).toISOString()
        : undefined;
      product.stock_out_date = stock_out_date
        ? new Date(stock_out_date).toISOString()
        : undefined;

      // Flags
      product.isFocused = isFocused ?? false;
      product.isActive = isActive ?? true;

      // SKU Discount
      if (skuDiscount) {
        const skuDiscountObj: ISkuDiscount = new SkuDiscount();
        skuDiscountObj.discountType = skuDiscount.discountType;
        skuDiscountObj.isActive = skuDiscount.isActive ?? false;
        skuDiscountObj.value = skuDiscount.value ?? 0;
        product.skuDiscount = skuDiscountObj;
      }

      // RLP validation
      if (product.rlp !== undefined && product.rlp > product.mrp) {
        skippedProducts.push(`${productName} (RLP > MRP)`);
        continue;
      }

      await this.productRepositry.save(product);
    }

    const message = skippedProducts.length
      ? `Products created successfully. Skipped: ${skippedProducts.join(", ")}`
      : "All products created successfully.";

    return { message, status: STATUSCODES.SUCCESS };
  } catch (error) {
    console.error("Error in createProducts:", error);
    throw error;
  }
}

    async createImportProductCategories(input: CreateProductCategory[], payload: IUser): Promise<IApiResponse> {
        try {
            const { emp_id } = payload;
            const skippedCategories: string[] = [];  // Store skipped category names
            const processedCategories: Set<string> = new Set(); // Track unique categories by name

            // Validate input data
            if (input.length === 0) {
                return { message: "No categories to create.", status: STATUSCODES.BAD_REQUEST };
            }

            const newCategories = [];

            for (const category of input) {
                const { name } = category;

                // In-memory duplicate check (skip if the category has already been processed)
                if (processedCategories.has(name)) {
                    skippedCategories.push(`${name} (Duplicate in input)`);
                    continue;  // Skip the duplicate in the input
                }

                processedCategories.add(name);  // Mark this category as processed

                // Check if the category already exists in the database
                const existingCategory = await this.productCategoryRespositry.findOneBy({ name, empId: emp_id });
                if (existingCategory) {
                    skippedCategories.push(`${name} (Already exists in database)`);
                    continue;  // Skip the category if it already exists in the database
                }

                // Create a new category object
                const newCat = new ProductCategory();
                newCat.empId = emp_id;
                newCat.name = name;

                newCategories.push(newCat);  // Add to the list of new categories to be saved
            }

            // If there are new categories to save, save them in bulk
            if (newCategories.length > 0) {
                await this.productCategoryRespositry.save(newCategories);
            }

            // Return a response indicating success and any skipped categories
            const message = skippedCategories.length > 0
                ? `Categories created successfully. Skipped categories: ${skippedCategories.join(', ')}.`
                : "All categories created successfully.";

            return { message, status: STATUSCODES.SUCCESS };
        } catch (error) {
            console.log({ error });
            throw error;
        }
    }
}

export { ProductController as ProductService }