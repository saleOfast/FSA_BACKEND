import express, { Request, Response } from "express";
import { AccessTokenService, ResponseHandler, validateDtoMiddleware } from "../../../../core/helper/validationMiddleware";
import { RequestHandler } from "../../../../core/helper/RequestHander";
import { JwtTokenTypes } from "../../../../core/types/Constent/common";
import catchAsync from "../../../../core/utils/catch-async";
import {TaxesC,TaxesR,TaxesU ,TaxesD, getTaskById} from "../../../../core/types/TaxesService/TaxesService"
import {Taxes} from "../../Controllers/TaxController/TaxController"
import { IUser } from "../../../../core/types/AuthService/AuthService";
const router = express.Router();



router.post('/create', validateDtoMiddleware(TaxesC),  AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
    try {
        const input: TaxesC = RequestHandler.Defaults.getBody<TaxesC>(req, TaxesC);
        const payload: IUser = RequestHandler.Custom.getUser(req);
        const taxes = new Taxes();
        const data = await  taxes.createTaxes(input, payload);
        ResponseHandler.sendResponse(res, data);
    } catch (error) {
        ResponseHandler.sendErrorResponse(res, error);
    }
});

router.get('/list',validateDtoMiddleware(TaxesR),AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN),async (req:Request,res:Response)=>{
        try {
        const input: TaxesR = RequestHandler.Defaults.getParams<TaxesR>(req, TaxesR);
        const payload: IUser = RequestHandler.Custom.getUser(req);
        const taxes = new Taxes();
        const data = await  taxes.getTaxes(input, payload);
        ResponseHandler.sendResponse(res, data);
    } catch (error) {
        ResponseHandler.sendErrorResponse(res, error);
    }
})

router.get('/get/:taxId',validateDtoMiddleware(getTaskById),AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN),async (req:Request,res:Response)=>{
    try{
         const input: getTaskById = RequestHandler.Defaults.getParams< getTaskById>(req, getTaskById);
        const payload: IUser = RequestHandler.Custom.getUser(req);
        const taxes = new Taxes();
        const data = await  taxes.getTaxesById( payload,input);
        ResponseHandler.sendResponse(res, data);
    }
    catch (error) {
        ResponseHandler.sendErrorResponse(res, error);
    }
})

router.delete('/delete/:taxId',validateDtoMiddleware(TaxesD),AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN),async (req:Request,res:Response)=>{
    try{
         const input:TaxesD = RequestHandler.Defaults.getParams< TaxesD>(req,TaxesD);
        const payload: IUser = RequestHandler.Custom.getUser(req);
        const taxes = new Taxes();
        const data = await  taxes.deleteTaxes( input,payload);
        ResponseHandler.sendResponse(res, data);
    }
    catch (error) {
        ResponseHandler.sendErrorResponse(res, error);
    }
})

router.put(
  "/update",
  validateDtoMiddleware(TaxesU), // validate input DTO
 AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN),async (req:Request,res:Response)=>{
    try{
         const input:TaxesU = RequestHandler.Defaults.getBody< TaxesU>(req,TaxesU);
        const payload: IUser = RequestHandler.Custom.getUser(req);
   

     const taxes = new Taxes();
        const data = await  taxes.editTaxes( input,payload);
        ResponseHandler.sendResponse(res, data);
    }
     catch (error) {
        ResponseHandler.sendErrorResponse(res, error);
    }
}

);

export
 { router as taxRoute };