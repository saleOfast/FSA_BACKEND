import express, { Request, Response } from "express";
import { AccessTokenService, ResponseHandler, validateDtoMiddleware } from "../../../../core/helper/validationMiddleware";
import { RequestHandler } from "../../../../core/helper/RequestHander";
import { CreateProductCategory, CreateProductRequest, DeleteCategoryById, DeleteProductById, GetCategoryById, GetProductById, GetProductListRequest, UpdateCategoryById, UpdateProductRequest } from "../../../../core/types/ProductService/ProductService";
import { JwtTokenTypes } from "../../../../core/types/Constent/common";
import { ProductService } from "../../Controllers/ProductController/Product.controller";
import { IUser } from "../../../../core/types/AuthService/AuthService";

const router = express.Router();


router.post('/add', validateDtoMiddleware(CreateProductRequest), AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
    try {
        const input: CreateProductRequest = RequestHandler.Defaults.getBody<CreateProductRequest>(req, CreateProductRequest);
        const payload: IUser = RequestHandler.Custom.getUser(req);
        const productService = new ProductService();
        const data = await productService.createProduct(input, payload);
        ResponseHandler.sendResponse(res, data);
    } catch (error) {
        ResponseHandler.sendErrorResponse(res, error);
    }
});

router.post('/update', validateDtoMiddleware(UpdateProductRequest), AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
    try {
        const input: UpdateProductRequest = RequestHandler.Defaults.getBody<UpdateProductRequest>(req, UpdateProductRequest);
        const payload: IUser = RequestHandler.Custom.getUser(req);
        const productService = new ProductService();
        const data = await productService.updateProduct(input, payload);
        ResponseHandler.sendResponse(res, data);
    } catch (error) {
        ResponseHandler.sendErrorResponse(res, error);
    }
});

router.get('/getById/:productId', validateDtoMiddleware(GetProductById), AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
    try {
        const input: GetProductById = RequestHandler.Defaults.getBody<GetProductById>(req, GetProductById);
        const productService = new ProductService();
        const data = await productService.getById(input);
        ResponseHandler.sendResponse(res, data);
    } catch (error) {
        ResponseHandler.sendErrorResponse(res, error);
    }
});

router.get('/list', validateDtoMiddleware(GetProductListRequest), AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
    try {
        const payload: IUser = RequestHandler.Custom.getUser(req);
        const input: GetProductListRequest = RequestHandler.Defaults.getQuery<GetProductListRequest>(req, GetProductListRequest);
        const productService = new ProductService();
        const data = await productService.list(input, payload);
        ResponseHandler.sendResponse(res, data);
    } catch (error) {
        ResponseHandler.sendErrorResponse(res, error);
    }
});

router.delete('/delete/:productId', validateDtoMiddleware(DeleteProductById), AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
    try {
        const input: DeleteProductById = RequestHandler.Defaults.getBody<DeleteProductById>(req, DeleteProductById);
        const productService = new ProductService();
        const data = await productService.deleteProduct(input);
        ResponseHandler.sendResponse(res, data);
    } catch (error) {
        ResponseHandler.sendErrorResponse(res, error);
    }
});

/**
 * Product Category Routes
 */
router.post('/category/add', validateDtoMiddleware(CreateProductCategory), AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
    try {
        const input: CreateProductCategory = RequestHandler.Defaults.getBody<CreateProductCategory>(req, CreateProductCategory);
        const payload: IUser = RequestHandler.Custom.getUser(req);
        const productService = new ProductService();
        const data = await productService.createProductCategory(input, payload);
        ResponseHandler.sendResponse(res, data);
    } catch (error) {
        ResponseHandler.sendErrorResponse(res, error);
    }
});

router.get('/category/list', AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
    try {
        const productService = new ProductService();
        const data = await productService.categoryList();
        ResponseHandler.sendResponse(res, data);
    } catch (error) {
        ResponseHandler.sendErrorResponse(res, error);
    }
});

router.get('/category/getById/:catId', validateDtoMiddleware(GetCategoryById), AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
    try {
        const input: GetCategoryById = RequestHandler.Defaults.getBody<GetCategoryById>(req, GetCategoryById);
        const productService = new ProductService();
        const data = await productService.getCategoryById(input);
        ResponseHandler.sendResponse(res, data);
    } catch (error) {
        ResponseHandler.sendErrorResponse(res, error);
    }
});

router.put('/category/update', validateDtoMiddleware(UpdateCategoryById), AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
    try {
        const input: UpdateCategoryById = RequestHandler.Defaults.getBody<UpdateCategoryById>(req, UpdateCategoryById);
        const productService = new ProductService();
        const data = await productService.updateCategory(input);
        ResponseHandler.sendResponse(res, data);
    } catch (error) {
        ResponseHandler.sendErrorResponse(res, error);
    }
});

router.delete('/category/delete/:catId', validateDtoMiddleware(DeleteCategoryById), AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
    try {
        const input: DeleteCategoryById = RequestHandler.Defaults.getBody<DeleteCategoryById>(req, DeleteCategoryById);
        const productService = new ProductService();
        const data = await productService.deleteCategoryById(input);
        ResponseHandler.sendResponse(res, data);
    } catch (error) {
        ResponseHandler.sendErrorResponse(res, error);
    }
});

router.post(
    '/import', 
    validateDtoMiddleware(CreateProductRequest), // Validate a single product DTO
    AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), 
    async (req: Request, res: Response) => {
        try {
            // Directly get the array of products from the request body
            const inputs: CreateProductRequest[] = RequestHandler.Defaults.getBody<CreateProductRequest[]>(req);
            
            // Get the user payload
            const payload: IUser = RequestHandler.Custom.getUser(req);

            // Create an instance of the ProductService and pass the array of products
            const productService = new ProductService();
            const data = await productService.createProducts(inputs, payload);

            // Send the response back
            ResponseHandler.sendResponse(res, data);
        } catch (error) {
            // Handle any errors
            ResponseHandler.sendErrorResponse(res, error);
        }
    }
    
);
router.post(
    '/category/import', 
    validateDtoMiddleware(CreateProductCategory), // Validate an array of category DTOs
    AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), 
    async (req: Request, res: Response) => {
        try {
            // Directly get the array of categories from the request body
            const inputs: CreateProductCategory[] = RequestHandler.Defaults.getBody<CreateProductCategory[]>(req);
            
            // Get the user payload
            const payload: IUser = RequestHandler.Custom.getUser(req);

            // Create an instance of the ProductService and pass the array of categories
            const productService = new ProductService();
            const data = await productService.createImportProductCategories(inputs, payload);

            // Send the response back
            ResponseHandler.sendResponse(res, data);
        } catch (error) {
            // Handle any errors
            ResponseHandler.sendErrorResponse(res, error);
        }
    }
);

export { router as ProductRoute };