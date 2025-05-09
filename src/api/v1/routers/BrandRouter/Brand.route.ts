import express, { Request, Response } from "express";
import { AccessTokenService, ResponseHandler, validateDtoMiddleware } from "../../../../core/helper/validationMiddleware";
import { RequestHandler } from "../../../../core/helper/RequestHander";
import { JwtTokenTypes } from "../../../../core/types/Constent/common";
import { IUser } from "../../../../core/types/AuthService/AuthService";
import { CreateBrand, DeleteBrand, GetBrand, GetBrandList, UpdateBrand } from "../../../../core/types/BrandService/BrandService";
import { BrandService } from "../../Controllers/BrandController/Brand.controller";
import { validateSync } from "class-validator";
import { plainToInstance } from "class-transformer";
const router = express.Router();

router.post('/add', validateDtoMiddleware(CreateBrand), AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
    try {
        const input: CreateBrand = RequestHandler.Defaults.getBody<CreateBrand>(req, CreateBrand);
        const payload: IUser = RequestHandler.Custom.getUser(req);
        const brandService = new BrandService();
        const data = await brandService.add(input, payload);
        ResponseHandler.sendResponse(res, data);
    } catch (error) {
        ResponseHandler.sendErrorResponse(res, error);
    }
});

router.get('/list', AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
    try {
        const input: GetBrandList = RequestHandler.Defaults.getQuery<GetBrandList>(req, GetBrandList);
        const payload: IUser = RequestHandler.Custom.getUser(req);
        const brandService = new BrandService();
        const data = await brandService.list(input, payload);
        ResponseHandler.sendResponse(res, data);
    } catch (error) {
        ResponseHandler.sendErrorResponse(res, error);
    }
});

router.post('/update', validateDtoMiddleware(UpdateBrand), AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
    try {
        const input: UpdateBrand = RequestHandler.Defaults.getBody<UpdateBrand>(req, UpdateBrand);
        const payload: IUser = RequestHandler.Custom.getUser(req);
        const brandService = new BrandService();
        const data = await brandService.update(payload, input);
        ResponseHandler.sendResponse(res, data);
    } catch (error) {
        ResponseHandler.sendErrorResponse(res, error);
    }
});

router.get('/getById/:brandId', validateDtoMiddleware(GetBrand), AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
    try {
        const input: GetBrand = RequestHandler.Defaults.getParams<GetBrand>(req, GetBrand);
        const query: GetBrandList = RequestHandler.Defaults.getQuery<GetBrandList>(req, GetBrandList);
        const payload: IUser = RequestHandler.Custom.getUser(req);
        const brandService = new BrandService();
        const data = await brandService.getBrandById(payload, input, query);
        ResponseHandler.sendResponse(res, data);
    } catch (error) {
        ResponseHandler.sendErrorResponse(res, error);
    }
});

router.delete('/delete/:brandId', validateDtoMiddleware(DeleteBrand), AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
    try {
        const input: DeleteBrand = RequestHandler.Defaults.getParams<DeleteBrand>(req, DeleteBrand);
        const query: GetBrandList = RequestHandler.Defaults.getQuery<GetBrandList>(req, GetBrandList);
        const payload: IUser = RequestHandler.Custom.getUser(req);
        const brandService = new BrandService();
        const data = await brandService.delete(payload, input, query);
        ResponseHandler.sendResponse(res, data);
    } catch (error) {
        ResponseHandler.sendErrorResponse(res, error);
    }
});

router.post('/import',
    AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN),
    async (req: Request, res: Response) => {
        try {
            // Extract the array of CreateBrand inputs from the request body
            const inputs: CreateBrand[] = RequestHandler.Defaults.getBody<CreateBrand[]>(req);
            const input: GetBrandList = RequestHandler.Defaults.getQuery<GetBrandList>(req, GetBrandList);

            // Validate if the input is an array
            if (!Array.isArray(inputs)) {
                return res.status(400).json({ message: 'Expected an array of brands.' });
            }

            // Validate each input in the array manually
            for (const input of inputs) {
                const errors = validateSync(plainToInstance(CreateBrand, input));
                if (errors.length > 0) {
                    return res.status(400).json({ errors });
                }
            }

            // Retrieve user payload from request
            const payload: IUser = RequestHandler.Custom.getUser(req);

            // Instantiate the BrandService
            const brandService = new BrandService();

            // Call the service to handle multiple brand creation
            const results = await brandService.addMultipleBrands(inputs, payload, input.isCompetitor);

            // Send the successful response with the results
            ResponseHandler.sendResponse(res, results);
        } catch (error) {
            // Send error response in case of failure
            console.error("Error while adding multiple brands:", error);
            ResponseHandler.sendErrorResponse(res, error);
        }
    }
);

export { router as BrandRouter }