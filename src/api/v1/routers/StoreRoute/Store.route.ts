import express, { Request, Response } from "express";
import { AccessTokenService, ResponseHandler, validateDtoMiddleware } from "../../../../core/helper/validationMiddleware";
import { RequestHandler } from "../../../../core/helper/RequestHander";
import { JwtTokenTypes } from "../../../../core/types/Constent/common";
import { IUser } from "../../../../core/types/AuthService/AuthService";
import {  CreateStoreDto, DeleteStoreById,   StoreListDto, UpdateStore,getStoreByIdDto,searchStoreDto ,GetStoresByStatusDto} from "../../../../core/types/StoreService/StoreService";
import { StoreService } from "../../Controllers/StoreController/Store.controller";
import { validateSync } from "class-validator";
import { plainToInstance } from "class-transformer";
import { STATUSCODES } from "../../../../core/types/Constent/common";

const router = express.Router();


router.post('/create', validateDtoMiddleware(CreateStoreDto),  AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
    try {
        const input: CreateStoreDto = RequestHandler.Defaults.getBody<CreateStoreDto>(req, CreateStoreDto);
        const payload: IUser = RequestHandler.Custom.getUser(req);
        const storeService = new StoreService();
        const data = await storeService.createStore(input, payload);
        ResponseHandler.sendResponse(res, data);
    } catch (error) {
        ResponseHandler.sendErrorResponse(res, error);
    }
});

router.put(
  '/update',
  validateDtoMiddleware(UpdateStore),
  AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN),
  async (req: Request, res: Response) => {
    try {
      // Extract request body
      const input: UpdateStore & { storeId?: number } = RequestHandler.Defaults.getBody<UpdateStore>(req, UpdateStore);

      // Extract authenticated user
      const payload: IUser = RequestHandler.Custom.getUser(req);

      // Check that storeId is provided
      if (!input.storeId) {
        return  ResponseHandler.sendErrorResponse(res, {
            status: STATUSCODES.BAD_REQUEST,
            message: "storeId is required in the request body"
        });
      }

      // Initialize service
      const storeService = new StoreService();

      // Call updateStore with correct arguments
      const data = await storeService.updateStore(input.storeId, input, payload);

      // Send response
      ResponseHandler.sendResponse(res, data);
    } catch (error) {
      ResponseHandler.sendErrorResponse(res, error);
    }
  }
);


router.delete('/delete/:storeId', validateDtoMiddleware(DeleteStoreById), AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
    try {
        const input: DeleteStoreById = RequestHandler.Defaults.getParams<DeleteStoreById>(req, DeleteStoreById);
        const storeService = new StoreService();
        const data = await storeService.delete(input);
        ResponseHandler.sendResponse(res, data);
    } catch (error) {
        ResponseHandler.sendErrorResponse(res, error);
    }
});

router.get('/storeList', validateDtoMiddleware(StoreListDto), AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
    try {
        const input: StoreListDto = RequestHandler.Defaults.getQuery<StoreListDto>(req, StoreListDto);
        const payload: IUser = RequestHandler.Custom.getUser(req);
        const storeService = new StoreService();
        const data = await storeService.storeList(input, payload);
        ResponseHandler.sendResponse(res, data);
    } catch (error) {
        ResponseHandler.sendErrorResponse(res, error);
    }
});

router.get('/getStore', validateDtoMiddleware(getStoreByIdDto), AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
    try {
        const input: getStoreByIdDto = RequestHandler.Defaults.getQuery<getStoreByIdDto>(req, getStoreByIdDto);
        const storeService = new StoreService();
        const data = await storeService.getStoreById(input);
        ResponseHandler.sendResponse(res, data);
    } catch (error) {
        ResponseHandler.sendErrorResponse(res, error);
    }
});

router.get('/searchStores', validateDtoMiddleware(searchStoreDto), AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
    try {
        const input: searchStoreDto = RequestHandler.Defaults.getQuery<searchStoreDto>(req, searchStoreDto);
        const storeService = new StoreService();
        const data = await storeService.searchStores(input);
        ResponseHandler.sendResponse(res, data);
    } catch (error) {
        ResponseHandler.sendErrorResponse(res, error);
    }
});

router.get('/getStatus', validateDtoMiddleware(searchStoreDto), AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
    try {
        const input: GetStoresByStatusDto = RequestHandler.Defaults.getQuery<GetStoresByStatusDto>(req, GetStoresByStatusDto);
        const storeService = new StoreService();
        const data = await storeService.getStoresByStatus(input);
        ResponseHandler.sendResponse(res, data);
    } catch (error) {
        ResponseHandler.sendErrorResponse(res, error);
    }
});

// router.get('/getStoreByType', validateDtoMiddleware(GetStoreByType), AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
//     try {
//         const input: GetStoreByType = RequestHandler.Defaults.getQuery<GetStoreByType>(req, GetStoreByType);
//         const storeService = new StoreService();
//         const data = await storeService.getStoreByType(input);
//         ResponseHandler.sendResponse(res, data);
//     } catch (error) {
//         ResponseHandler.sendErrorResponse(res, error);
//     }
// });

// router.post('/createCategory', validateDtoMiddleware(CreateCategory),  AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
//     try {
//         const input: CreateCategory = RequestHandler.Defaults.getBody<CreateCategory>(req, CreateCategory);
//         const payload: IUser = RequestHandler.Custom.getUser(req);
//         const storeService = new StoreService();
//         const data = await storeService.createCategory(input, payload);
//         ResponseHandler.sendResponse(res, data);
//     } catch (error) {
//         ResponseHandler.sendErrorResponse(res, error);
//     }
// });

// router.get('/categoryList', AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
//     try {
//         const payload: IUser = RequestHandler.Custom.getUser(req);
//         const storeService = new StoreService();
//         const data = await storeService.categoryList(payload);
//         ResponseHandler.sendResponse(res, data);
//     } catch (error) {
//         ResponseHandler.sendErrorResponse(res, error);
//     }
// });

// router.get('/getCategoryById/:categoryId', validateDtoMiddleware(GetCategoryById), AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
//     try {
//         const input: GetCategoryById = RequestHandler.Defaults.getParams<GetCategoryById>(req, GetCategoryById);
//         const storeService = new StoreService();
//         const data = await storeService.getCatoryById(input);
//         ResponseHandler.sendResponse(res, data);
//     } catch (error) {
//         ResponseHandler.sendErrorResponse(res, error);
//     }
// });

// router.post('/updateCategory', validateDtoMiddleware(UpdateCategory), AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
//     try {
//         const input: UpdateCategory = RequestHandler.Defaults.getBody<UpdateCategory>(req, UpdateCategory);
//         const storeService = new StoreService();
//         const data = await storeService.udpateCategory(input);
//         ResponseHandler.sendResponse(res, data);
//     } catch (error) {
//         ResponseHandler.sendErrorResponse(res, error);
//     }
// });

// router.delete('/deleteCategory/:categoryId', validateDtoMiddleware(DeleteCategoryById), AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
//     try {
//         const input: DeleteCategoryById = RequestHandler.Defaults.getParams<DeleteCategoryById>(req, DeleteCategoryById);
//         const storeService = new StoreService();
//         const data = await storeService.deleteCategory(input);
//         ResponseHandler.sendResponse(res, data);
//     } catch (error) {
//         ResponseHandler.sendErrorResponse(res, error);
//     }
// });

// router.post('/add/importStore',
//     AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), 
//     async (req: Request, res: Response) => {
//         try {
//             const inputs: CreateStoreDto[] = RequestHandler.Defaults.getBody<CreateStoreDto[]>(req);

//             // Manually validate array of inputs
//             if (!Array.isArray(inputs)) {
//                 return res.status(400).json({ message: 'Expected an array of stores.' });
//             }

//             for (const input of inputs) {
//                 const errors = validateSync(plainToInstance(CreateStore, input));
//                 if (errors.length > 0) {
//                     return res.status(400).json({ errors });
//                 }
//             }

//             const payload: IUser = RequestHandler.Custom.getUser(req);
//             const storeService = new StoreService();

//             const results = await storeService.createImportStores(inputs, payload);

//             ResponseHandler.sendResponse(res, results);
//         } catch (error) {
//             ResponseHandler.sendErrorResponse(res, error);
//         }
//     }
// );
// router.post('/importStoreCategories',
//     AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN),
//     async (req: Request, res: Response) => {
//         try {
//             const inputs: CreateCategory[] = RequestHandler.Defaults.getBody<CreateCategory[]>(req);

//             // Validate that the input is an array
//             if (!Array.isArray(inputs)) {
//                 return res.status(400).json({ message: 'Expected an array of categories.' });
//             }

//             // Validate each input object
//             for (const input of inputs) {
//                 const errors = validateSync(plainToInstance(CreateCategory, input));
//                 if (errors.length > 0) {
//                     return res.status(400).json({ errors });
//                 }
//             }

//             const payload: IUser = RequestHandler.Custom.getUser(req);
//             const storeService = new StoreService();

//             // Process the array of categories
//             const results = await storeService.createCategories(inputs, payload);

//             ResponseHandler.sendResponse(res, results);
//         } catch (error) {
//             ResponseHandler.sendErrorResponse(res, error);
//         }
//     }
// );

export { router as StoreRoute };

