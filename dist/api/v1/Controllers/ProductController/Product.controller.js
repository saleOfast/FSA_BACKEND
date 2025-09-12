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
        var _a, _b, _c, _d;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { sku, productName, brandId, categoryId, mrp, rlp, caseQty, skuDiscount, batchNumber, manufacturingDate, expiryDate, subcategory, shelf_life, product_state, unitOfMeasure, total_quantity, total_sold, quantity_in_stock, reorderLevel, maxStockLevel, currency, purchase_price, selling_price, storage_location, storage_condition, stock_in_date, stock_out_date, damaged_quantity, } = input;
                const { emp_id } = payload;
                // ✅ Validate brand
                if (!brandId || isNaN(Number(brandId)) || Number(brandId) <= 0) {
                    return { message: "Invalid brandId", status: common_1.STATUSCODES.BAD_REQUEST };
                }
                const parsedBrandId = Number(brandId);
                const brand = yield this.brandRepository.findOneBy({
                    brandId: parsedBrandId,
                    isDeleted: false,
                });
                if (!brand) {
                    return {
                        message: `Brand ${parsedBrandId} not found`,
                        status: common_1.STATUSCODES.NOT_FOUND,
                    };
                }
                // ✅ Validate category
                if (categoryId) {
                    const category = yield this.productCategoryRespositry.findOneBy({
                        productCategoryId: Number(categoryId),
                        isDeleted: false,
                    });
                    if (!category) {
                        return {
                            message: "Category Not Found",
                            status: common_1.STATUSCODES.NOT_FOUND,
                        };
                    }
                }
                // ✅ Ensure total_quantity is defined
                if (total_quantity === undefined || total_quantity < 0) {
                    return {
                        message: "total_quantity is required and must be >= 0",
                        status: common_1.STATUSCODES.BAD_REQUEST,
                    };
                }
                // ✅ Stock validation
                const totalQuantity = total_quantity;
                const totalSold = total_sold !== null && total_sold !== void 0 ? total_sold : 0;
                const damagedQty = damaged_quantity !== null && damaged_quantity !== void 0 ? damaged_quantity : 0;
                if (totalSold + damagedQty > totalQuantity) {
                    return {
                        message: "Invalid stock data: total sold + damaged quantity exceeds total quantity",
                        status: common_1.STATUSCODES.BAD_REQUEST,
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
                product.product_state = product_state !== null && product_state !== void 0 ? product_state : "In stock";
                product.unitOfMeasure = unitOfMeasure;
                product.total_quantity = totalQuantity;
                product.totalSold = totalSold;
                product.damagedQuantity = damagedQty;
                product.quantityInStock =
                    quantity_in_stock !== null && quantity_in_stock !== void 0 ? quantity_in_stock : totalQuantity - (totalSold + damagedQty);
                product.reorderLevel = reorderLevel;
                product.maxStockLevel = maxStockLevel;
                product.currency = currency;
                product.purchase_price = purchase_price;
                product.selling_price = selling_price;
                product.storage_location = storage_location;
                product.storageCondition = storage_condition;
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
                product.isFocused = (_a = input.isFocused) !== null && _a !== void 0 ? _a : false;
                product.isActive = (_b = input.isActive) !== null && _b !== void 0 ? _b : true;
                // ✅ SKU Discount
                if (skuDiscount) {
                    const skuDiscountObj = new ProductService_1.SkuDiscount();
                    skuDiscountObj.discountType = skuDiscount.discountType;
                    skuDiscountObj.isActive = (_c = skuDiscount.isActive) !== null && _c !== void 0 ? _c : false;
                    skuDiscountObj.value = (_d = skuDiscount.value) !== null && _d !== void 0 ? _d : 0;
                    product.skuDiscount = skuDiscountObj;
                }
                // ✅ RLP validation
                if (product.rlp !== undefined && product.rlp > product.mrp) {
                    return {
                        message: "RLP must be <= MRP",
                        status: common_1.STATUSCODES.BAD_REQUEST,
                    };
                }
                yield this.productRepositry.save(product);
                return {
                    message: "Product created successfully.",
                    status: common_1.STATUSCODES.SUCCESS,
                };
            }
            catch (error) {
                console.error("Error in createProduct:", error);
                throw error;
            }
        });
    }
    updateProduct(input, payload) {
        var _a, _b, _c, _d, _e;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { productId, sku, productName, brandId, categoryId, mrp, rlp, caseQty, skuDiscount, batchNumber, manufacturingDate, expiryDate, subcategory, shelf_life, product_state, unitOfMeasure, total_quantity, total_sold, quantity_in_stock, reorderLevel, maxStockLevel, currency, purchase_price, selling_price, storage_location, storage_condition, stock_in_date, stock_out_date, damaged_quantity, isFocused, isActive, } = input;
                const product = yield this.productRepositry.findOne({
                    where: { productId: Number(productId), isDeleted: false },
                });
                if (!product) {
                    return { message: "Product Not Found.", status: common_1.STATUSCODES.NOT_FOUND };
                }
                // ✅ Validate brand if provided
                if (brandId) {
                    const brand = yield this.brandRepository.findOneBy({
                        brandId: Number(brandId),
                        isDeleted: false,
                    });
                    if (!brand) {
                        return { message: `Brand ${brandId} not found`, status: common_1.STATUSCODES.NOT_FOUND };
                    }
                }
                // ✅ Validate category if provided
                if (categoryId) {
                    const category = yield this.productCategoryRespositry.findOneBy({
                        productCategoryId: Number(categoryId),
                        isDeleted: false,
                    });
                    if (!category) {
                        return { message: "Category Not Found", status: common_1.STATUSCODES.NOT_FOUND };
                    }
                }
                // ✅ Stock validation
                const totalQty = (_a = total_quantity !== null && total_quantity !== void 0 ? total_quantity : product.total_quantity) !== null && _a !== void 0 ? _a : 0;
                const totalSold = (_b = total_sold !== null && total_sold !== void 0 ? total_sold : product.totalSold) !== null && _b !== void 0 ? _b : 0;
                const damagedQty = (_c = damaged_quantity !== null && damaged_quantity !== void 0 ? damaged_quantity : product.damagedQuantity) !== null && _c !== void 0 ? _c : 0;
                if (totalSold + damagedQty > totalQty) {
                    return {
                        message: "Invalid stock data: total sold + damaged quantity exceeds total quantity",
                        status: common_1.STATUSCODES.BAD_REQUEST,
                    };
                }
                // ✅ Build partial update object
                const updateData = {
                    sku: sku !== null && sku !== void 0 ? sku : product.sku,
                    productName: productName !== null && productName !== void 0 ? productName : product.productName,
                    brandId: brandId !== null && brandId !== void 0 ? brandId : product.brandId,
                    categoryId: categoryId !== null && categoryId !== void 0 ? categoryId : product.categoryId,
                    mrp: mrp !== null && mrp !== void 0 ? mrp : product.mrp,
                    rlp: rlp !== null && rlp !== void 0 ? rlp : product.rlp,
                    caseQty: caseQty !== null && caseQty !== void 0 ? caseQty : product.caseQty,
                    batchNumber: batchNumber !== null && batchNumber !== void 0 ? batchNumber : product.batchNumber,
                    subcategory: subcategory !== null && subcategory !== void 0 ? subcategory : product.subcategory,
                    shelf_life: shelf_life !== null && shelf_life !== void 0 ? shelf_life : product.shelf_life,
                    product_state: product_state !== null && product_state !== void 0 ? product_state : product.product_state,
                    unitOfMeasure: unitOfMeasure !== null && unitOfMeasure !== void 0 ? unitOfMeasure : product.unitOfMeasure,
                    total_quantity: totalQty,
                    totalSold: totalSold,
                    damagedQuantity: damagedQty,
                    quantityInStock: quantity_in_stock !== null && quantity_in_stock !== void 0 ? quantity_in_stock : (totalQty - (totalSold + damagedQty)),
                    reorderLevel: reorderLevel !== null && reorderLevel !== void 0 ? reorderLevel : product.reorderLevel,
                    maxStockLevel: maxStockLevel !== null && maxStockLevel !== void 0 ? maxStockLevel : product.maxStockLevel,
                    currency: currency !== null && currency !== void 0 ? currency : product.currency,
                    purchase_price: purchase_price !== null && purchase_price !== void 0 ? purchase_price : product.purchase_price,
                    selling_price: selling_price !== null && selling_price !== void 0 ? selling_price : product.selling_price,
                    storage_location: storage_location !== null && storage_location !== void 0 ? storage_location : product.storage_location,
                    storageCondition: storage_condition !== null && storage_condition !== void 0 ? storage_condition : product.storageCondition,
                    isFocused: isFocused !== null && isFocused !== void 0 ? isFocused : product.isFocused,
                    isActive: isActive !== null && isActive !== void 0 ? isActive : product.isActive,
                };
                // ✅ Dates
                if (manufacturingDate)
                    updateData.manufacturingDate = new Date(manufacturingDate).toISOString();
                if (expiryDate)
                    updateData.expiryDate = new Date(expiryDate).toISOString();
                if (stock_in_date)
                    updateData.stock_in_date = new Date(stock_in_date).toISOString();
                if (stock_out_date)
                    updateData.stock_out_date = new Date(stock_out_date).toISOString();
                // ✅ SKU Discount
                if (skuDiscount) {
                    updateData.skuDiscount = {
                        discountType: skuDiscount.discountType,
                        value: (_d = skuDiscount.value) !== null && _d !== void 0 ? _d : 0,
                        isActive: (_e = skuDiscount.isActive) !== null && _e !== void 0 ? _e : false,
                    };
                }
                // ✅ RLP validation
                if (updateData.rlp !== undefined && updateData.mrp !== undefined && updateData.rlp > updateData.mrp) {
                    return { message: "RLP must be <= MRP", status: common_1.STATUSCODES.BAD_REQUEST };
                }
                yield this.productRepositry
                    .createQueryBuilder()
                    .update(products_entity_1.Products)
                    .set(updateData)
                    .where({ productId: Number(productId) })
                    .execute();
                return { message: "Product updated successfully.", status: common_1.STATUSCODES.SUCCESS };
            }
            catch (error) {
                console.error("Error in updateProduct:", error);
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
                    const { productName, brandId, categoryId, mrp, rlp, caseQty, skuDiscount, isFocused, isActive } = input;
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
                    // product.image = image;
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
