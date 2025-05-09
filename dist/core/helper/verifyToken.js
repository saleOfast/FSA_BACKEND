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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyEmailToken = exports.verifyRefreshToken = exports.authentication = exports.generateVerifyEmailToken = exports.generateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const response_1 = require("../utils/response");
const config_1 = require("../config");
const { privateKey, expiry } = (0, config_1.config)();
const generateToken = (object) => __awaiter(void 0, void 0, void 0, function* () {
    if (!privateKey || !expiry) {
        throw new Error("Secret key Not Found.");
    }
    const token = yield jsonwebtoken_1.default.sign(object, privateKey, { expiresIn: expiry });
    return token;
});
exports.generateToken = generateToken;
const authentication = (token) => {
    try {
        if (!privateKey) {
            throw new Error("Secret key Not Found.");
        }
        const user = jsonwebtoken_1.default.verify(token, privateKey);
        const newObj = {
            id: user.id,
            email: user.email,
            isVarified: true,
            role: user.role
        };
        return newObj;
    }
    catch (error) {
        throw error;
    }
};
exports.authentication = authentication;
const generateVerifyEmailToken = (object) => __awaiter(void 0, void 0, void 0, function* () {
    const token = yield jsonwebtoken_1.default.sign(object, process.env.EMAILTOKENPRIVATEKEY || '', { expiresIn: process.env.EMAILTOKENEXPIRY });
    return token;
});
exports.generateVerifyEmailToken = generateVerifyEmailToken;
const verifyRefreshToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.header('refreshToken');
    try {
        if (token) {
            try {
                req.user = jsonwebtoken_1.default.verify(token, process.env.REFRESHTOKENPRIVATEKEY || '');
                req.refreshTokenParam = token;
                next();
            }
            catch (error) {
                (0, response_1.unAuthorize)(res);
            }
        }
        else {
            (0, response_1.notFound)(res);
        }
    }
    catch (error) {
        (0, response_1.badRequest)(res, {});
    }
});
exports.verifyRefreshToken = verifyRefreshToken;
const verifyEmailToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.params.token;
    try {
        if (token) {
            try {
                req.user = jsonwebtoken_1.default.verify(token, process.env.EMAILTOKENPRIVATEKEY || '');
                req.refreshTokenParam = token;
                next();
            }
            catch (error) {
                if (error.name === 'TokenExpiredError') {
                    // res.status(401).json({ message: 'Token has expired' });
                    res.render("sessionExpired");
                }
                else {
                    // unAuthorize(res);
                    res.render("authError");
                }
            }
        }
        else {
            (0, response_1.notFound)(res);
        }
    }
    catch (error) {
        (0, response_1.badRequest)(res, {});
    }
});
exports.verifyEmailToken = verifyEmailToken;
