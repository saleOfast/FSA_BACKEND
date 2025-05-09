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

    async createProduct(input: CreateProductRequest, payload: IUser): Promise<IApiResponse> {
        try {
            const { productName, brandId, categoryId, mrp, rlp, caseQty, skuDiscount, image, isFocused, isActive } = input;
            const { emp_id } = payload;

            const brand: IBrand | null = await this.brandRepository.findOneBy({ brandId: Number(brandId), isDeleted: false });
            if (!brand) {
                return { message: "Brand Not Found.", status: STATUSCODES.NOT_FOUND }
            }
            const product = new this.productModel();
            product.productName = productName;
            product.empId = emp_id;
            product.brandId = brandId;
            product.categoryId = categoryId;
            product.mrp = mrp;
            product.rlp = rlp;
            product.caseQty = caseQty;
            product.image = image;
            product.isFocused = isFocused;
            product.isActive = isActive

            if (skuDiscount) {
                // Validate skuDiscount if provided
                const skuDiscountObj: ISkuDiscount = new SkuDiscount();
                skuDiscountObj.discountType = skuDiscount.discountType as DiscountType;
                skuDiscountObj.isActive = skuDiscount.isActive ?? false; // Default to false if not provided
                skuDiscountObj.value = skuDiscount.value ?? 0; // Default to 0 if not provided

                // Save skuDiscount to product
                product.skuDiscount = skuDiscountObj;
            }

            if (product.rlp > product.mrp) {
                return { message: "RLP must be less than or equal to MRP", status: STATUSCODES.BAD_REQUEST }
            }
            await this.productRepositry.save(product)

            return { message: "Success.", status: STATUSCODES.SUCCESS }
        } catch (error) {
            throw error;
        }
    }

    async updateProduct(input: UpdateProductRequest, payload: IUser): Promise<IApiResponse> {
        try {
            const { productId, productName, brandId, categoryId, mrp, rlp, caseQty, skuDiscount, isFocused, isActive } = input;

            const product: IProducts | null = await this.productRepositry.findOne({
                where: { productId: Number(productId), isDeleted: false }
            });

            if (!product) {
                return { message: "Product Not Found.", status: STATUSCODES.NOT_FOUND }
            }

            await this.productRepositry
                .createQueryBuilder()
                .update({ productId, productName, brandId, categoryId, mrp, rlp, caseQty, skuDiscount, isFocused, isActive })
                .where({ productId }).execute()

            return { message: "Success.", status: STATUSCODES.SUCCESS }
        } catch (error) {
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

    async createProducts(inputs: CreateProductRequest[], payload: IUser): Promise<IApiResponse> {
        try {
            const { emp_id } = payload;
            const skippedProducts: string[] = [];  // Store skipped product names
            const processedProducts: Set<string> = new Set(); // Store unique products to prevent duplicates from the input

            console.log({ inputs });

            // Loop through inputs
            for (const input of inputs) {
                const { productName, brandId, categoryId, mrp, rlp, caseQty, skuDiscount, image, isFocused, isActive } = input;

                // Create a unique key to identify each product by name, brand, and category
                const productKey = `${productName}-${brandId}-${categoryId}`;

                // In-memory duplicate check (skip if the product is already processed)
                if (processedProducts.has(productKey)) {
                    skippedProducts.push(`${productName} (Duplicate in input)`);
                    continue;  // Skip the duplicate in the input
                }

                processedProducts.add(productKey);  // Mark this product as processed

                // Check if the brand exists
                const brand: IBrand | null = await this.brandRepository.findOneBy({ brandId: Number(brandId), isDeleted: false });
                if (!brand) {
                    return { message: `Brand Not Found for product: ${productName}.`, status: STATUSCODES.NOT_FOUND };
                }

                // Check if the product already exists in the database
                const existingProduct = await this.productRepositry.findOneBy({ productName, brandId, categoryId: Number(categoryId) });
                if (existingProduct) {
                    skippedProducts.push(`${productName} (Already exists in database)`);
                    continue;  // Skip the product if it already exists
                }

                // Create a new product object
                const product = new this.productModel();
                product.productName = productName;
                product.empId = emp_id;
                product.brandId = brandId;
                product.categoryId = categoryId;
                product.mrp = mrp;
                product.rlp = rlp;
                product.caseQty = caseQty;
                product.image = image;
                product.isFocused = isFocused;
                product.isActive = isActive;

                // Add SKU discount if available
                if (skuDiscount) {
                    const skuDiscountObj: ISkuDiscount = new SkuDiscount();
                    skuDiscountObj.discountType = skuDiscount.discountType as DiscountType;
                    skuDiscountObj.isActive = skuDiscount.isActive ?? false;
                    skuDiscountObj.value = skuDiscount.value ?? 0;
                    product.skuDiscount = skuDiscountObj;
                }

                // Ensure RLP is less than or equal to MRP
                if (product.rlp > product.mrp) {
                    return { message: `RLP must be less than or equal to MRP for product: ${productName}.`, status: STATUSCODES.BAD_REQUEST };
                }

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