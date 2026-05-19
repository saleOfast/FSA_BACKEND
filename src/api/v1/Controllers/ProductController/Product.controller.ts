import { ProductRepository, Products } from "../../../../core/DB/Entities/products.entity";
import { STATUSCODES, UserRole } from "../../../../core/types/Constent/common";
import { IApiResponse } from "../../../../core/types/Constent/commonService";
import { CreateProductCategory, CreateProductRequest, DeleteCategoryById, DeleteProductById, GetCategoryById, GetProductById, GetProductListRequest, IProductCategory, IProducts, UpdateCategoryById, UpdateProductRequest } from "../../../../core/types/ProductService/ProductService";
import { IUser } from "../../../../core/types/AuthService/AuthService";
import { ProductCategory, ProductCategoryRepository } from "../../../../core/DB/Entities/productCategory.entity";
import { TaxesRepository } from "../../../../core/DB/Entities/tax.entity";
import { getSchemeRepository } from "../../../../core/DB/Entities/scheme.entity";
import { DiscountRepository } from "../../../../core/DB/Entities/discount.entity";

class ProductController {
    private productRepositry = ProductRepository();
    private productModel = Products;
    private productCategoryRespositry = ProductCategoryRepository();
    private taxesRepository = TaxesRepository();
    private schemeRepository = getSchemeRepository();
    private discountRepository = DiscountRepository();

    constructor() { }

    async createProduct(input: CreateProductRequest, payload: IUser): Promise<IApiResponse> {
        try {
            const { 
                productCode, productType, productName, categoryId, subCategoryId, 
                description, status, launchDate, discontinueDate, vol, 
                image, marketSegment, 
                productLifeCycleStage, storageCondition, 
            } = input;

                const normalizedName = productName?.trim().toLowerCase();
    const normalizedCode = productCode?.trim().toUpperCase();

        if (!normalizedName) {
      return { message: "Product name is required", status: STATUSCODES.BAD_REQUEST };
    }

    if (!normalizedCode) {
      return { message: "Product code is required", status: STATUSCODES.BAD_REQUEST };
    }

            // Validate category
            const category = await this.productCategoryRespositry.findOneBy({ productCategoryId: Number(categoryId), isDeleted: false });
            if (!category) {
                return { message: "Category Not Found.", status: STATUSCODES.NOT_FOUND }
            }

            // Validate subcategory if provided
            if (subCategoryId) {
                const subCategory = await this.productCategoryRespositry.findOneBy({ productCategoryId: Number(subCategoryId), isDeleted: false });
                if (!subCategory) {
                    return { message: "Sub Category Not Found.", status: STATUSCODES.NOT_FOUND }
                }
            }

            // Validate tax category if provided
            // if (taxCategoryId) {
            //     const taxCategory = await this.taxesRepository.findOneBy({ taxId: Number(taxCategoryId) });
            //     if (!taxCategory) {
            //         return { message: "Tax Category Not Found.", status: STATUSCODES.NOT_FOUND }
            //     }
            // }

            // Validate scheme if provided
            // if (schemeId) {
            //     const scheme = await this.schemeRepository.findOneBy({ id: Number(schemeId), isDeleted: false });
            //     if (!scheme) {
            //         return { message: "Scheme Not Found.", status: STATUSCODES.NOT_FOUND }
            //     }
            // }

            // Validate discount if provided
            // if (discountId) {
            //     const discount = await this.discountRepository.findOneBy({ discountId: Number(discountId) });
            //     if (!discount) {
            //         return { message: "Discount Not Found.", status: STATUSCODES.NOT_FOUND }
            //     }
            // }

                if (launchDate && discontinueDate) {
      if (new Date(launchDate) > new Date(discontinueDate)) {
        return {
          message: "Launch date cannot be greater than discontinue date",
          status: STATUSCODES.BAD_REQUEST
        };
      }
    }
      const existingProduct = await this.productRepositry.findOne({
      where: [
        { productCode: normalizedCode },
        { productName: normalizedName }
      ]
    });

    if (existingProduct) {
      return {
        message: "Product with same code or name already exists",
        status: STATUSCODES.CONFLICT
      };
    }
            const product = new this.productModel();
            product.productCode = normalizedCode;
            product.productType = productType;
            product.productName = normalizedName;
            product.categoryId = categoryId;
            product.subCategoryId = subCategoryId;
            product.description = description;
            product.status = status || 'Active';
            product.launchDate = launchDate ? new Date(launchDate) :undefined;
            product.discontinueDate = discontinueDate ? new Date(discontinueDate) : undefined;
            product.vol = vol;
            // product.taxCategoryId = taxCategoryId;
            // product.hsnCode = hsnCode;
            product.image = image;
            product.marketSegment = marketSegment;
            product.productLifeCycleStage = productLifeCycleStage;
            product.storageCondition = storageCondition;
            // product.schemeId = schemeId;
            // product.discountId = discountId;
            
            await this.productRepositry.save(product)

            return { message: "Success.", status: STATUSCODES.SUCCESS }
        } catch (error: any) {
               if (error.code === "23505") {
      return {
        message: "Product already exists",
        status: STATUSCODES.CONFLICT
      };
    }
            throw error;
        }
    }

    async updateProduct(input: UpdateProductRequest, payload: IUser): Promise<IApiResponse> {
        try {
            const { 
                productId, productCode, productType, productName, categoryId, subCategoryId,
                description, status, launchDate, discontinueDate, vol, 
                image, marketSegment, 
                productLifeCycleStage, storageCondition
            } = input;
            const normalize = (val?: string) => val?.trim();

            const product: IProducts | null = await this.productRepositry.findOne({
                where: { productId: Number(productId), isDeleted: false }
            });

            if (!product) {
                return { message: "Product Not Found.", status: STATUSCODES.NOT_FOUND }
            }
                  if (launchDate && discontinueDate) {
            if (new Date(launchDate) > new Date(discontinueDate)) {
                return {
                    message: "Launch date cannot be after discontinue date.",
                    status: STATUSCODES.BAD_REQUEST
                };
            }
        }

            // Validate category if provided
            if (categoryId) {
                const category = await this.productCategoryRespositry.findOneBy({ productCategoryId: Number(categoryId), isDeleted: false });
                if (!category) {
                    return { message: "Category Not Found.", status: STATUSCODES.NOT_FOUND }
                }
            }

            // Validate subcategory if provided
            if (subCategoryId) {
                const subCategory = await this.productCategoryRespositry.findOneBy({ productCategoryId: Number(subCategoryId), isDeleted: false });
                if (!subCategory) {
                    return { message: "Sub Category Not Found.", status: STATUSCODES.NOT_FOUND }
                }
            }

                  if (productCode || productName) {
            const existing = await this.productRepositry.findOne({
                where: [
                    { productCode: productCode ?? product.productCode },
                    { productName: productName ?? product.productName }
                ]
            });

            if (existing && existing.productId !== product.productId) {
                return {
                    message: "Product with same code or name already exists.",
                    status: STATUSCODES.CONFLICT
                };
            }
        }
        
        
       

            // Build update object with only provided fields
            const updateData: any = {};
          if (productCode !== undefined) {
    if (!productCode || productCode.trim() === "") {
        return {
            message: "Product code cannot be empty.",
            status: STATUSCODES.BAD_REQUEST
        };
    }
    updateData.productCode = productCode.trim().toUpperCase();
}
            if (productType !== undefined) updateData.productType = productType;
       if (productName !== undefined) {
    const name = normalize(productName);

    if (!name) {
        return {
            message: "Product name cannot be empty.",
            status: STATUSCODES.BAD_REQUEST
        };
    }

    updateData.productName = name;
}
            if (categoryId !== undefined) updateData.categoryId = categoryId;
            if (subCategoryId !== undefined) updateData.subCategoryId = subCategoryId;
            if (description !== undefined) updateData.description = description;
            if (status !== undefined) updateData.status = status;
            if (launchDate !== undefined) updateData.launchDate = launchDate ? new Date(launchDate) : null;
            if (discontinueDate !== undefined) updateData.discontinueDate = discontinueDate ? new Date(discontinueDate) : null;
            if (vol !== undefined) updateData.vol = vol;
       
            if (image !== undefined) updateData.image = image;
            if (marketSegment !== undefined) updateData.marketSegment = marketSegment;
            if (productLifeCycleStage !== undefined) updateData.productLifeCycleStage = productLifeCycleStage;
            if (storageCondition !== undefined) updateData.storageCondition = storageCondition;

                 if (Object.keys(updateData).length === 0) {
            return {
                message: "No fields provided to update.",
                status: STATUSCODES.BAD_REQUEST
            };
        }

            await this.productRepositry
                .createQueryBuilder()
                .update(Products)
                .set(updateData)
                .where({ productId: Number(productId) })
                .execute()

            return { message: "Success.", status: STATUSCODES.SUCCESS ,
                data:updateData
            }
        } catch (error) {
            throw error;
        }
    }

    async getById(input: GetProductById): Promise<IApiResponse> {
        try {
            const { productId } = input;

            const product: IProducts | null = await this.productRepositry.findOne({
                where: { productId: Number(productId), isDeleted: false },
                relations: ["category", "subCategory"]
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
            const { roleId } = payload;
            const { search, category, isActive } = input;

            console.log({ input });

            // Initialize the QueryBuilder
            const queryBuilder = this.productRepositry.createQueryBuilder('product')
                .leftJoinAndSelect('product.category', 'category')
                .leftJoinAndSelect('product.subCategory', 'subCategory')
                // .leftJoinAndSelect('product.taxCategory', 'taxCategory')
                // .leftJoinAndSelect('product.scheme', 'scheme')
                // .leftJoinAndSelect('product.discount', 'discount')
                .where('product.isDeleted = :isDeleted', { isDeleted: false });

            // Add conditions dynamically
            // if (role === UserRole.SSM || role === UserRole.RETAILER) {
            //     queryBuilder.andWhere('product.status = :status', { status: 'Active' });
            // }
            if (isActive === 'true') {
                queryBuilder.andWhere('product.status = :status', { status: 'Active' });
            }
            if (Number(category) > 0) {
                queryBuilder.andWhere('category.productCategoryId = :productCategoryId', { productCategoryId: category });
            }
            if (search) {
                queryBuilder.andWhere('product.productName LIKE :search', { search: `%${search}%` });
            }

            // Add ordering
            queryBuilder.orderBy('product.status', 'DESC')
                .addOrderBy('product.productName', 'ASC')
                .addOrderBy('product.createdDate', 'DESC');

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
            where: { productId: Number(productId), isDeleted: false },
            // Remove relations - brand doesn't exist anymore, and we don't need category for deletion
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

    async createProducts(inputs: CreateProductRequest[], payload: IUser): Promise<IApiResponse> {
        try {
            const skippedProducts: string[] = [];  // Store skipped product names
            const processedProducts: Set<string> = new Set(); // Store unique products to prevent duplicates from the input

            console.log({ inputs });

            // Loop through inputs
            for (const input of inputs) {
                const { 
                    productCode, productType, productName, categoryId, subCategoryId,
                    description, status, launchDate, discontinueDate, vol, 
                 image, marketSegment, 
                    productLifeCycleStage, storageCondition,
                } = input;

                // Create a unique key to identify each product by name and category
                const productKey = `${productName}-${categoryId}`;

                // In-memory duplicate check (skip if the product is already processed)
                if (processedProducts.has(productKey)) {
                    skippedProducts.push(`${productName} (Duplicate in input)`);
                    continue;  // Skip the duplicate in the input
                }

                processedProducts.add(productKey);  // Mark this product as processed

                // Validate category
                const category = await this.productCategoryRespositry.findOneBy({ productCategoryId: Number(categoryId), isDeleted: false });
                if (!category) {
                    skippedProducts.push(`${productName} (Category Not Found)`);
                    continue;
                }

                // Validate subcategory if provided
                if (subCategoryId) {
                    const subCategory = await this.productCategoryRespositry.findOneBy({ productCategoryId: Number(subCategoryId), isDeleted: false });
                    if (!subCategory) {
                        skippedProducts.push(`${productName} (Sub Category Not Found)`);
                        continue;
                    }
                }

                // Validate tax category if provided
            

                // Validate scheme if provided
           

                // Validate discount if provided
         

                // Check if the product already exists in the database
                const existingProduct = await this.productRepositry.findOneBy({ productName, categoryId: Number(categoryId) });
                if (existingProduct) {
                    skippedProducts.push(`${productName} (Already exists in database)`);
                    continue;  // Skip the product if it already exists
                }

                // Create a new product object
                const product = new this.productModel();
                product.productCode = productCode;
                product.productType = productType;
                product.productName = productName;
                product.categoryId = categoryId;
                product.subCategoryId = subCategoryId;
                product.description = description;
                product.status = status || 'Active';
                product.launchDate = launchDate ? new Date(launchDate) : undefined;
                product.discontinueDate = discontinueDate ? new Date(discontinueDate) : undefined;
                product.vol = vol;
         
                product.image = image;
                product.marketSegment = marketSegment;
                product.productLifeCycleStage = productLifeCycleStage;
                product.storageCondition = storageCondition;
          

                // Save the product
                await this.productRepositry.save(product);
            }

            // Return success message with information about skipped products
            const message = skippedProducts.length > 0
                ? `Products created successfully. Skipped products: ${skippedProducts.join(', ')}.`
                : "All products created successfully.";

            return { message, status: STATUSCODES.SUCCESS };
        } catch (error) {
            console.log({ error });
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