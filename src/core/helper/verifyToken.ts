import { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken';
import { unAuthorize, notFound, badRequest } from '../utils/response';
import { config as envConfig } from '../config';
import { UserRole } from "../../core/types/Constent/common";
const { privateKey, expiry } = envConfig();


const generateToken = async (object: { id: number, email: string, role: UserRole }) => {
    if (!privateKey || !expiry) {
        throw new Error("Secret key Not Found.")
    }
    const token = await jwt.sign(object, privateKey, { expiresIn: expiry });
    return token;
}


const authentication = (token: string): { id: number, email: string, isVarified?: boolean } => {
    try {
        if (!privateKey) {
            throw new Error("Secret key Not Found.")
        }
        const user = jwt.verify(token, privateKey) as { id: number, email: string, role: UserRole };
        const newObj: { id: number, email: string, isVarified?: boolean, role: UserRole } = {
            id: user.id,
            email: user.email,
            isVarified: true,
            role: user.role
        }
        return newObj;
    } catch (error) {
        throw error;
    }
}

const generateVerifyEmailToken = async (object: { id: number, email: string }) => {
    const token = await jwt.sign(object, process.env.EMAILTOKENPRIVATEKEY || '', { expiresIn: process.env.EMAILTOKENEXPIRY });
    return token;
}

const verifyRefreshToken = async (req: any, res: Response, next: NextFunction) => {
    const token = req.header('refreshToken');
    try {
        if (token) {
            try {
                req.user = jwt.verify(token, process.env.REFRESHTOKENPRIVATEKEY || '');
                req.refreshTokenParam = token;
                next();
            } catch (error) {
                unAuthorize(res);
            }
        } else {
            notFound(res);
        }
    } catch (error) {
        badRequest(res, {});
    }
}

const verifyEmailToken = async (req: any, res: Response , next: NextFunction) => {
    const token = req.params.token;
    try {
        if (token) {
            try {
                req.user = jwt.verify(token, process.env.EMAILTOKENPRIVATEKEY || '');
                req.refreshTokenParam = token;
                next();
            } catch (error: any) {
                if (error.name === 'TokenExpiredError') {
                    // res.status(401).json({ message: 'Token has expired' });
                    res.render("sessionExpired")
                } else {
                    // unAuthorize(res);
                    res.render("authError")
                }
            }
        } else {
            notFound(res);
        }
    } catch (error) {
        badRequest(res, {});
    }
}

export { generateToken, generateVerifyEmailToken, authentication, verifyRefreshToken, verifyEmailToken }