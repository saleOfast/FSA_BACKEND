import { IApiResponse } from "core/types/Constent/commonService";
import { stringify } from "querystring";
import express from 'express';
import { JwtTokenTypes, STATUSCODES, UserRole } from "../../core/types/Constent/common";
import { RequestHandler } from "./RequestHander";
import { ValidationError, validate } from "class-validator";
import { plainToClass } from "class-transformer";
import { authentication } from "./verifyToken";
import { UserRepository } from "../../core/DB/Entities/User.entity";
import { IUser } from "../../core/types/AuthService/AuthService";


const tag = "RequestValidatorMiddleware";

type AccessTokenServiceI = {
    validateTokenMiddleware: Function;
}

export const AccessTokenService: Partial<AccessTokenServiceI> = {};

AccessTokenService.validateTokenMiddleware = (tokenType?: JwtTokenTypes, allowedRoles?: UserRole[]) => {
    return async (req: express.Request, res: express.Response, next: Function) => {
        let isTokenVerified: boolean = false;
        const token = RequestHandler.Defaults.getAccessToken(req) || req.header('Authorization');
        let payloadBody: any;
        let userData: any;
        const apiFailure: IApiResponse =
        {
            message: "JWT Token Invalid.",
            status: 401
        };

        if (!token) {
            return apiFailure;
        }

        try {
            let decodedToken = authentication(token);
            if (!decodedToken.isVarified) {
                return apiFailure;
            }
            const { id } = decodedToken;
            const user: IUser | null = await UserRepository().findOne({ where: { emp_id: id } });
            if (!user) {
                throw new Error("User Not Found.");
            }
            const roles = user.role;
            if (allowedRoles && allowedRoles.length) {
                if (!allowedRoles.some(role => roles.includes(role))) {
                    throw new Error('No valid role found');
                }
            }
            payloadBody = user;
            isTokenVerified = true;
            userData = user;
        }
        catch (error: any) {
            apiFailure.error = error;
        }
        finally {
            if (isTokenVerified) {
                RequestHandler.Custom.setAccessTokenPayload(req, payloadBody);
                RequestHandler.Custom.setUser(req, userData);
                next();
            }
            else {
                ResponseHandler.sendResponse(res, apiFailure);
            }
        }
    };
}

const JwtHelper = {}

export const validateDtoMiddleware = function (dto: any) {
    return async (req: express.Request, res: express.Response, next: Function) => {
        let input: Record<string, any>;
        const body = RequestHandler.Defaults.getBody(req);
        if (Array.isArray(body)) {
            input = body;
        } else {
            input = Object.assign({}, RequestHandler.Defaults.getQuery(req), RequestHandler.Defaults.getBody(req), RequestHandler.Defaults.getParams(req));
        }
        let validationErrors: ValidationError[] = []; 
        let obj: any;
        if (Array.isArray(input)) {
            obj = [];
            input.map(async (e: Record<string, any>) => {
                const objClass: any = plainToClass(dto, e);
                const validationError = await validate(objClass, { validationError: { target: false } });
                obj.push(objClass)
                validationErrors.push(...validationError)
            });
            await Promise.all(input);
        } else {
            obj = plainToClass(dto, input);
            validationErrors = await validate(obj, { validationError: { target: false } });
        }
        const isFailed = validationErrors.length > 0;
        if (isFailed) {

            const requestInfo = RequestHandler.getRequestInfo(req);

            console.error({ message: "Request Validation Failed", error: { requestInfo, validationErrors }, tag, notify: false });

            const apiResponse: IApiResponse = {
                data: validationErrors,
                message: "Validation Failed",
                status: STATUSCODES.VALIDATION_FAILED
            }

            ResponseHandler.sendResponse(res, apiResponse);
        } else {
            req.body = obj;
            next();
        }
    };
}

export const ResponseHandler = {

    sendResponse: function (res: express.Response, body: IApiResponse) {

        if (!body.status) {
            body.status = 200;
        }

        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'POST');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
        // res.setHeader('Access-Control-Expose-Headers', 'access_token');
        res.status(body.status || 200);
        res.send(body);
    },

    sendErrorResponse: function (res: express.Response, error: any) {

        const body: IApiResponse =
        {
            status: 500,
            message: error,
            data: undefined
        };

        res.send(body);
    }
}