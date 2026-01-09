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
const products_entity_1 = require("../../../../core/DB/Entities/products.entity");
const common_1 = require("../../../../core/types/Constent/common");
const productCategory_entity_1 = require("../../../../core/DB/Entities/productCategory.entity");
const tax_entity_1 = require("../../../../core/DB/Entities/tax.entity");
const scheme_entity_1 = require("../../../../core/DB/Entities/scheme.entity");
const discount_entity_1 = require("../../../../core/DB/Entities/discount.entity");
class ProductController {
    constructor() {
        this.productRepositry = (0, products_entity_1.ProductRepository)();
        this.productModel = products_entity_1.Products;
        this.productCategoryRespositry = (0, productCategory_entity_1.ProductCategoryRepository)();
        this.taxesRepository = (0, tax_entity_1.TaxesRepository)();
        this.schemeRepository = (0, scheme_entity_1.getSchemeRepository)();
        this.discountRepository = (0, discount_entity_1.DiscountRepository)();
    }
    createProduct(input, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { productCode, productType, productName, categoryId, subCategoryId, description, status, launchDate, discontinueDate, vol, taxCategoryId, hsnCode, image, marketSegment, productLifeCycleStage, storageCondition, schemeId, discountId } = input;
                // Validate category
                const category = yield this.productCategoryRespositry.findOneBy({ productCategoryId: Number(categoryId), isDeleted: false });
                if (!category) {
                    return { message: "Category Not Found.", status: common_1.STATUSCODES.NOT_FOUND };
                }
                // Validate subcategory if provided
                if (subCategoryId) {
                    const subCategory = yield this.productCategoryRespositry.findOneBy({ productCategoryId: Number(subCategoryId), isDeleted: false });
                    if (!subCategory) {
                        return { message: "Sub Category Not Found.", status: common_1.STATUSCODES.NOT_FOUND };
                    }
                }
                // Validate tax category if provided
                if (taxCategoryId) {
                    const taxCategory = yield this.taxesRepository.findOneBy({ taxId: Number(taxCategoryId) });
                    if (!taxCategory) {
                        return { message: "Tax Category Not Found.", status: common_1.STATUSCODES.NOT_FOUND };
                    }
                }
                // Validate scheme if provided
                if (schemeId) {
                    const scheme = yield this.schemeRepository.findOneBy({ id: Number(schemeId), isDeleted: false });
                    if (!scheme) {
                        return { message: "Scheme Not Found.", status: common_1.STATUSCODES.NOT_FOUND };
                    }
                }
                // Validate discount if provided
                if (discountId) {
                    const discount = yield this.discountRepository.findOneBy({ discountId: Number(discountId) });
                    if (!discount) {
                        return { message: "Discount Not Found.", status: common_1.STATUSCODES.NOT_FOUND };
                    }
                }
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
                product.taxCategoryId = taxCategoryId;
                product.hsnCode = hsnCode;
                product.image = image;
                product.marketSegment = marketSegment;
                product.productLifeCycleStage = productLifeCycleStage;
                product.storageCondition = storageCondition;
                product.schemeId = schemeId;
                product.discountId = discountId;
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
                const { productId, productCode, productType, productName, categoryId, subCategoryId, description, status, launchDate, discontinueDate, vol, taxCategoryId, hsnCode, image, marketSegment, productLifeCycleStage, storageCondition, schemeId, discountId } = input;
                const product = yield this.productRepositry.findOne({
                    where: { productId: Number(productId), isDeleted: false }
                });
                if (!product) {
                    return { message: "Product Not Found.", status: common_1.STATUSCODES.NOT_FOUND };
                }
                // Validate category if provided
                if (categoryId) {
                    const category = yield this.productCategoryRespositry.findOneBy({ productCategoryId: Number(categoryId), isDeleted: false });
                    if (!category) {
                        return { message: "Category Not Found.", status: common_1.STATUSCODES.NOT_FOUND };
                    }
                }
                // Validate subcategory if provided
                if (subCategoryId) {
                    const subCategory = yield this.productCategoryRespositry.findOneBy({ productCategoryId: Number(subCategoryId), isDeleted: false });
                    if (!subCategory) {
                        return { message: "Sub Category Not Found.", status: common_1.STATUSCODES.NOT_FOUND };
                    }
                }
                // Validate tax category if provided
                if (taxCategoryId) {
                    const taxCategory = yield this.taxesRepository.findOneBy({ taxId: Number(taxCategoryId) });
                    if (!taxCategory) {
                        return { message: "Tax Category Not Found.", status: common_1.STATUSCODES.NOT_FOUND };
                    }
                }
                // Validate scheme if provided
                if (schemeId) {
                    const scheme = yield this.schemeRepository.findOneBy({ id: Number(schemeId), isDeleted: false });
                    if (!scheme) {
                        return { message: "Scheme Not Found.", status: common_1.STATUSCODES.NOT_FOUND };
                    }
                }
                // Validate discount if provided
                if (discountId) {
                    const discount = yield this.discountRepository.findOneBy({ discountId: Number(discountId) });
                    if (!discount) {
                        return { message: "Discount Not Found.", status: common_1.STATUSCODES.NOT_FOUND };
                    }
                }
                // Build update object with only provided fields
                const updateData = {};
                if (productCode !== undefined)
                    updateData.productCode = productCode;
                if (productType !== undefined)
                    updateData.productType = productType;
                if (productName !== undefined)
                    updateData.productName = productName;
                if (categoryId !== undefined)
                    updateData.categoryId = categoryId;
                if (subCategoryId !== undefined)
                    updateData.subCategoryId = subCategoryId;
                if (description !== undefined)
                    updateData.description = description;
                if (status !== undefined)
                    updateData.status = status;
                if (launchDate !== undefined)
                    updateData.launchDate = launchDate ? new Date(launchDate) : null;
                if (discontinueDate !== undefined)
                    updateData.discontinueDate = discontinueDate ? new Date(discontinueDate) : null;
                if (vol !== undefined)
                    updateData.vol = vol;
                if (taxCategoryId !== undefined)
                    updateData.taxCategoryId = taxCategoryId;
                if (hsnCode !== undefined)
                    updateData.hsnCode = hsnCode;
                if (image !== undefined)
                    updateData.image = image;
                if (marketSegment !== undefined)
                    updateData.marketSegment = marketSegment;
                if (productLifeCycleStage !== undefined)
                    updateData.productLifeCycleStage = productLifeCycleStage;
                if (storageCondition !== undefined)
                    updateData.storageCondition = storageCondition;
                if (schemeId !== undefined)
                    updateData.schemeId = schemeId;
                if (discountId !== undefined)
                    updateData.discountId = discountId;
                yield this.productRepositry
                    .createQueryBuilder()
                    .update(updateData)
                    .where({ productId: Number(productId) })
                    .execute();
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
                    relations: ["category", "subCategory", "taxCategory", "scheme", "discount"]
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
                const { search, category, isActive } = input;
                console.log({ input });
                // Initialize the QueryBuilder
                const queryBuilder = this.productRepositry.createQueryBuilder('product')
                    .leftJoinAndSelect('product.category', 'category')
                    .leftJoinAndSelect('product.subCategory', 'subCategory')
                    .leftJoinAndSelect('product.taxCategory', 'taxCategory')
                    .leftJoinAndSelect('product.scheme', 'scheme')
                    .leftJoinAndSelect('product.discount', 'discount')
                    .where('product.isDeleted = :isDeleted', { isDeleted: false });
                // Add conditions dynamically
                if (role === common_1.UserRole.SSM || role === common_1.UserRole.RETAILER) {
                    queryBuilder.andWhere('product.status = :status', { status: 'Active' });
                }
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
                    where: { productId: Number(productId), isDeleted: false },
                    // Remove relations - brand doesn't exist anymore, and we don't need category for deletion
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
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const skippedProducts = []; // Store skipped product names
                const processedProducts = new Set(); // Store unique products to prevent duplicates from the input
                console.log({ inputs });
                // Loop through inputs
                for (const input of inputs) {
                    const { productCode, productType, productName, categoryId, subCategoryId, description, status, launchDate, discontinueDate, vol, taxCategoryId, hsnCode, image, marketSegment, productLifeCycleStage, storageCondition, schemeId, discountId } = input;
                    // Create a unique key to identify each product by name and category
                    const productKey = `${productName}-${categoryId}`;
                    // In-memory duplicate check (skip if the product is already processed)
                    if (processedProducts.has(productKey)) {
                        skippedProducts.push(`${productName} (Duplicate in input)`);
                        continue; // Skip the duplicate in the input
                    }
                    processedProducts.add(productKey); // Mark this product as processed
                    // Validate category
                    const category = yield this.productCategoryRespositry.findOneBy({ productCategoryId: Number(categoryId), isDeleted: false });
                    if (!category) {
                        skippedProducts.push(`${productName} (Category Not Found)`);
                        continue;
                    }
                    // Validate subcategory if provided
                    if (subCategoryId) {
                        const subCategory = yield this.productCategoryRespositry.findOneBy({ productCategoryId: Number(subCategoryId), isDeleted: false });
                        if (!subCategory) {
                            skippedProducts.push(`${productName} (Sub Category Not Found)`);
                            continue;
                        }
                    }
                    // Validate tax category if provided
                    if (taxCategoryId) {
                        const taxCategory = yield this.taxesRepository.findOneBy({ taxId: Number(taxCategoryId) });
                        if (!taxCategory) {
                            skippedProducts.push(`${productName} (Tax Category Not Found)`);
                            continue;
                        }
                    }
                    // Validate scheme if provided
                    if (schemeId) {
                        const scheme = yield this.schemeRepository.findOneBy({ id: Number(schemeId), isDeleted: false });
                        if (!scheme) {
                            skippedProducts.push(`${productName} (Scheme Not Found)`);
                            continue;
                        }
                    }
                    // Validate discount if provided
                    if (discountId) {
                        const discount = yield this.discountRepository.findOneBy({ discountId: Number(discountId) });
                        if (!discount) {
                            skippedProducts.push(`${productName} (Discount Not Found)`);
                            continue;
                        }
                    }
                    // Check if the product already exists in the database
                    const existingProduct = yield this.productRepositry.findOneBy({ productName, categoryId: Number(categoryId) });
                    if (existingProduct) {
                        skippedProducts.push(`${productName} (Already exists in database)`);
                        continue; // Skip the product if it already exists
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
                    product.taxCategoryId = taxCategoryId;
                    product.hsnCode = hsnCode;
                    product.image = image;
                    product.marketSegment = marketSegment;
                    product.productLifeCycleStage = productLifeCycleStage;
                    product.storageCondition = storageCondition;
                    product.schemeId = schemeId;
                    product.discountId = discountId;
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
