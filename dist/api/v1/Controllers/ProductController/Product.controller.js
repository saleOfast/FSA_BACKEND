"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductService = void 0;
const brand_entity_1 = require("../../../../core/DB/Entities/brand.entity");
const products_entity_1 = require("../../../../core/DB/Entities/products.entity");
const common_1 = require("../../../../core/types/Constent/common");
const ProductService_1 = require("../../../../core/types/ProductService/ProductService");
const productCategory_entity_1 = require("../../../../core/DB/Entities/productCategory.entity");
class ProductController {
    constructor() {
        this.productRepositry = (0, products_entity_1.ProductRepository)();
        this.productModel = products_entity_1.Products;
        this.brandRepository = (0, brand_entity_1.BrandRepository)();
        this.productCategoryRespositry = (0, productCategory_entity_1.ProductCategoryRepository)();
    }
    createProduct(input, payload) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { productName, brandId, categoryId, mrp, rlp, caseQty, skuDiscount, image, isFocused, isActive } = input;
                const { emp_id } = payload;
                const brand = yield this.brandRepository.findOneBy({ brandId: Number(brandId), isDeleted: false });
                if (!brand) {
                    return { message: "Brand Not Found.", status: common_1.STATUSCODES.NOT_FOUND };
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
                product.isActive = isActive;
                if (skuDiscount) {
                    // Validate skuDiscount if provided
                    const skuDiscountObj = new ProductService_1.SkuDiscount();
                    skuDiscountObj.discountType = skuDiscount.discountType;
                    skuDiscountObj.isActive = (_a = skuDiscount.isActive) !== null && _a !== void 0 ? _a : false; // Default to false if not provided
                    skuDiscountObj.value = (_b = skuDiscount.value) !== null && _b !== void 0 ? _b : 0; // Default to 0 if not provided
                    // Save skuDiscount to product
                    product.skuDiscount = skuDiscountObj;
                }
                if (product.rlp > product.mrp) {
                    return { message: "RLP must be less than or equal to MRP", status: common_1.STATUSCODES.BAD_REQUEST };
                }
                yield this.productRepositry.save(product);
                return { message: "Success.", status: common_1.STATUSCODES.SUCCESS };
            }
            catch (error) {
                throw error;
            }
        });
    }
    updateProduct(input, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { productId, productName, brandId, categoryId, mrp, rlp, caseQty, skuDiscount, isFocused, isActive } = input;
                const product = yield this.productRepositry.findOne({
                    where: { productId: Number(productId), isDeleted: false }
                });
                if (!product) {
                    return { message: "Product Not Found.", status: common_1.STATUSCODES.NOT_FOUND };
                }
                yield this.productRepositry
                    .createQueryBuilder()
                    .update({ productId, productName, brandId, categoryId, mrp, rlp, caseQty, skuDiscount, isFocused, isActive })
                    .where({ productId }).execute();
                return { message: "Success.", status: common_1.STATUSCODES.SUCCESS };
            }
            catch (error) {
                throw error;
            }
        });
    }
    getById(input) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { productId } = input;
                const product = yield this.productRepositry.findOne({
                    where: { productId: Number(productId), isDeleted: false },
                    relations: ["brand", "category"]
                });
                if (!product) {
                    return { message: "Product Not Found.", status: common_1.STATUSCODES.NOT_FOUND };
                }
                return { message: "Success.", status: common_1.STATUSCODES.SUCCESS, data: product };
            }
            catch (error) {
                throw error;
            }
        });
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
    list(input, payload) {
        return __awaiter(this, void 0, void 0, function* () {
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
                if (role === common_1.UserRole.SSM || role === common_1.UserRole.RETAILER) {
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
                const products = yield queryBuilder.getMany();
                return { message: "Success.", status: common_1.STATUSCODES.SUCCESS, data: products };
            }
            catch (error) {
                throw error;
            }
        });
    }
    deleteProduct(input) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { productId } = input;
                const product = yield this.productRepositry.findOne({
                    where: { productId: Number(productId) },
                    relations: ["brand", "category"]
                });
                if (!product) {
                    return { message: "Product Not Found.", status: common_1.STATUSCODES.NOT_FOUND };
                }
                yield this.productRepositry.createQueryBuilder()
                    .update({ isDeleted: true })
                    .where({ productId: Number(productId) })
                    .execute();
                return { message: "Success.", status: common_1.STATUSCODES.SUCCESS };
            }
            catch (error) {
                throw error;
            }
        });
    }
    /**
     * Product Category Controller
     */
    createProductCategory(input, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { name, parentId } = input;
                const { emp_id } = payload;
                const newCat = new productCategory_entity_1.ProductCategory();
                newCat.empId = emp_id;
                newCat.name = name;
                newCat.parentId = parentId;
                yield this.productCategoryRespositry.save(newCat);
                return { message: "Success.", status: common_1.STATUSCODES.SUCCESS };
            }
            catch (error) {
                throw error;
            }
        });
    }
    categoryList() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const catList = yield this.productCategoryRespositry.find({ where: { isDeleted: false }, relations: ['children', 'parent'], order: { name: 'ASC' } });
                return { message: "Success.", status: common_1.STATUSCODES.SUCCESS, data: catList };
            }
            catch (error) {
                throw error;
            }
        });
    }
    getCategoryById(input) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { catId } = input;
                const category = yield this.productCategoryRespositry.findOne({ where: { productCategoryId: Number(catId), isDeleted: false, isActive: false }, relations: ['children', 'parent'] });
                if (!category) {
                    return { message: "Category Not Found.", status: common_1.STATUSCODES.NOT_FOUND };
                }
                return { message: "Success.", status: common_1.STATUSCODES.SUCCESS, data: category };
            }
            catch (error) {
                throw error;
            }
        });
    }
    updateCategory(input) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { catId, name, parentId } = input;
                const category = yield this.productCategoryRespositry.findOne({ where: { productCategoryId: Number(catId), isDeleted: false }, relations: ['children', 'parent'] });
                if (!category) {
                    return { message: "Category Not Found.", status: common_1.STATUSCODES.NOT_FOUND };
                }
                yield this.productCategoryRespositry.createQueryBuilder().update({ name, parentId }).where({ productCategoryId: catId }).execute();
                return { message: "Success.", status: common_1.STATUSCODES.SUCCESS };
            }
            catch (error) {
                throw error;
            }
        });
    }
    deleteCategoryById(input) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { catId } = input;
                yield this.productCategoryRespositry.createQueryBuilder().update({ isDeleted: true }).where({ productCategoryId: catId }).execute();
                return { message: "Success.", status: common_1.STATUSCODES.SUCCESS };
            }
            catch (error) {
                throw error;
            }
        });
    }
    createProducts(inputs, payload) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { emp_id } = payload;
                const skippedProducts = []; // Store skipped product names
                const processedProducts = new Set(); // Store unique products to prevent duplicates from the input
                console.log({ inputs });
                // Loop through inputs
                for (const input of inputs) {
                    const { productName, brandId, categoryId, mrp, rlp, caseQty, skuDiscount, image, isFocused, isActive } = input;
                    // Create a unique key to identify each product by name, brand, and category
                    const productKey = `${productName}-${brandId}-${categoryId}`;
                    // In-memory duplicate check (skip if the product is already processed)
                    if (processedProducts.has(productKey)) {
                        skippedProducts.push(`${productName} (Duplicate in input)`);
                        continue; // Skip the duplicate in the input
                    }
                    processedProducts.add(productKey); // Mark this product as processed
                    // Check if the brand exists
                    const brand = yield this.brandRepository.findOneBy({ brandId: Number(brandId), isDeleted: false });
                    if (!brand) {
                        return { message: `Brand Not Found for product: ${productName}.`, status: common_1.STATUSCODES.NOT_FOUND };
                    }
                    // Check if the product already exists in the database
                    const existingProduct = yield this.productRepositry.findOneBy({ productName, brandId, categoryId: Number(categoryId) });
                    if (existingProduct) {
                        skippedProducts.push(`${productName} (Already exists in database)`);
                        continue; // Skip the product if it already exists
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
                        const skuDiscountObj = new ProductService_1.SkuDiscount();
                        skuDiscountObj.discountType = skuDiscount.discountType;
                        skuDiscountObj.isActive = (_a = skuDiscount.isActive) !== null && _a !== void 0 ? _a : false;
                        skuDiscountObj.value = (_b = skuDiscount.value) !== null && _b !== void 0 ? _b : 0;
                        product.skuDiscount = skuDiscountObj;
                    }
                    // Ensure RLP is less than or equal to MRP
                    if (product.rlp > product.mrp) {
                        return { message: `RLP must be less than or equal to MRP for product: ${productName}.`, status: common_1.STATUSCODES.BAD_REQUEST };
                    }
                    // Save the product
                    yield this.productRepositry.save(product);
                }
                // Return success message with information about skipped products
                const message = skippedProducts.length > 0
                    ? `Products created successfully. Skipped products: ${skippedProducts.join(', ')}.`
                    : "All products created successfully.";
                return { message, status: common_1.STATUSCODES.SUCCESS };
            }
            catch (error) {
                console.log({ error });
                throw error;
            }
        });
    }
    createImportProductCategories(input, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { emp_id } = payload;
                const skippedCategories = []; // Store skipped category names
                const processedCategories = new Set(); // Track unique categories by name
                // Validate input data
                if (input.length === 0) {
                    return { message: "No categories to create.", status: common_1.STATUSCODES.BAD_REQUEST };
                }
                const newCategories = [];
                for (const category of input) {
                    const { name } = category;
                    // In-memory duplicate check (skip if the category has already been processed)
                    if (processedCategories.has(name)) {
                        skippedCategories.push(`${name} (Duplicate in input)`);
                        continue; // Skip the duplicate in the input
                    }
                    processedCategories.add(name); // Mark this category as processed
                    // Check if the category already exists in the database
                    const existingCategory = yield this.productCategoryRespositry.findOneBy({ name, empId: emp_id });
                    if (existingCategory) {
                        skippedCategories.push(`${name} (Already exists in database)`);
                        continue; // Skip the category if it already exists in the database
                    }
                    // Create a new category object
                    const newCat = new productCategory_entity_1.ProductCategory();
                    newCat.empId = emp_id;
                    newCat.name = name;
                    newCategories.push(newCat); // Add to the list of new categories to be saved
                }
                // If there are new categories to save, save them in bulk
                if (newCategories.length > 0) {
                    yield this.productCategoryRespositry.save(newCategories);
                }
                // Return a response indicating success and any skipped categories
                const message = skippedCategories.length > 0
                    ? `Categories created successfully. Skipped categories: ${skippedCategories.join(', ')}.`
                    : "All categories created successfully.";
                return { message, status: common_1.STATUSCODES.SUCCESS };
            }
            catch (error) {
                console.log({ error });
                throw error;
            }
        });
    }
}
exports.ProductService = ProductController;
