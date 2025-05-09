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
exports.ResponseHandler = exports.validateDtoMiddleware = exports.AccessTokenService = void 0;
const common_1 = require("../../core/types/Constent/common");
const RequestHander_1 = require("./RequestHander");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const verifyToken_1 = require("./verifyToken");
const User_entity_1 = require("../../core/DB/Entities/User.entity");
const tag = "RequestValidatorMiddleware";
exports.AccessTokenService = {};
exports.AccessTokenService.validateTokenMiddleware = (tokenType, allowedRoles) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        let isTokenVerified = false;
        const token = RequestHander_1.RequestHandler.Defaults.getAccessToken(req) || req.header('Authorization');
        let payloadBody;
        let userData;
        const apiFailure = {
            message: "JWT Token Invalid.",
            status: 401
        };
        if (!token) {
            return apiFailure;
        }
        try {
            let decodedToken = (0, verifyToken_1.authentication)(token);
            if (!decodedToken.isVarified) {
                return apiFailure;
            }
            const { id } = decodedToken;
            const user = yield (0, User_entity_1.UserRepository)().findOne({ where: { emp_id: id } });
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
        catch (error) {
            apiFailure.error = error;
        }
        finally {
            if (isTokenVerified) {
                RequestHander_1.RequestHandler.Custom.setAccessTokenPayload(req, payloadBody);
                RequestHander_1.RequestHandler.Custom.setUser(req, userData);
                next();
            }
            else {
                exports.ResponseHandler.sendResponse(res, apiFailure);
            }
        }
    });
};
const JwtHelper = {};
const validateDtoMiddleware = function (dto) {
    return (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        let input;
        const body = RequestHander_1.RequestHandler.Defaults.getBody(req);
        if (Array.isArray(body)) {
            input = body;
        }
        else {
            input = Object.assign({}, RequestHander_1.RequestHandler.Defaults.getQuery(req), RequestHander_1.RequestHandler.Defaults.getBody(req), RequestHander_1.RequestHandler.Defaults.getParams(req));
        }
        let validationErrors = [];
        let obj;
        if (Array.isArray(input)) {
            obj = [];
            input.map((e) => __awaiter(this, void 0, void 0, function* () {
                const objClass = (0, class_transformer_1.plainToClass)(dto, e);
                const validationError = yield (0, class_validator_1.validate)(objClass, { validationError: { target: false } });
                obj.push(objClass);
                validationErrors.push(...validationError);
            }));
            yield Promise.all(input);
        }
        else {
            obj = (0, class_transformer_1.plainToClass)(dto, input);
            validationErrors = yield (0, class_validator_1.validate)(obj, { validationError: { target: false } });
        }
        const isFailed = validationErrors.length > 0;
        if (isFailed) {
            const requestInfo = RequestHander_1.RequestHandler.getRequestInfo(req);
            console.error({ message: "Request Validation Failed", error: { requestInfo, validationErrors }, tag, notify: false });
            const apiResponse = {
                data: validationErrors,
                message: "Validation Failed",
                status: common_1.STATUSCODES.VALIDATION_FAILED
            };
            exports.ResponseHandler.sendResponse(res, apiResponse);
        }
        else {
            req.body = obj;
            next();
        }
    });
};
exports.validateDtoMiddleware = validateDtoMiddleware;
exports.ResponseHandler = {
    sendResponse: function (res, body) {
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
    sendErrorResponse: function (res, error) {
        const body = {
            status: 500,
            message: error,
            data: undefined
        };
        res.send(body);
    }
};
