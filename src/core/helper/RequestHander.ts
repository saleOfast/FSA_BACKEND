import * as express from 'express';
import { Details } from "express-useragent";
import { ClassConstructor, plainToClass } from 'class-transformer';
import { Schema } from 'mongoose';
import { ExpressExtendedRequestParams, UserRole } from '../../core/types/Constent/common';

export interface IUser {
    _id: Schema.Types.ObjectId,
    emailId: string,
    firstName: string,
    lastName: string,
    companyName: string,
    phoneNumber: string,
    verified: boolean,
    roles: UserRole[]
}

function getBody<T>(req: express.Request, cls?: ClassConstructor<T>): T {
    if (cls) {
        return plainToClass(cls, req.body);
    } else {
        return req.body as T;
    }
}

function getParams<T>(req: express.Request, cls?: ClassConstructor<T>): T {
    if (cls) {
        return plainToClass(cls, req.params);
    } else {
        return req.params as T;
    }
}

function getQuery<T>(req: express.Request, cls?: ClassConstructor<T>): T {
    if (cls) {
        return plainToClass(cls, req.query);
    } else {
        return req.query as T;
    }
}

function getCookies(req: express.Request) {
    return req.cookies;
}

function getAccessToken(req: express.Request): string | null {
    if (req && req.headers && (req.headers as any).Authorization) {
        return (req.headers as any).Authorization;
    }
    return null;
}

function getRefreshToken(req: express.Request): string | null {
    if (req && req.headers && (req.headers as any).refresh_token) {
        return (req.headers as any).refresh_token;
    }
    return null;
}

function getUserAgent(req: express.Request): Details | undefined {
    const userAgent: Details | undefined = req.useragent;
    return userAgent;
}

const Defaults =
{
    getBody,
    getParams,
    getQuery,
    getCookies,
    getAccessToken,
    getRefreshToken,
    getUserAgent,
    getUser,
}



function getAccessTokenPayload(req: express.Request): any {
    let payload = (req as any)[ExpressExtendedRequestParams.PAYLOAD];
    if (!payload) {
        throw new Error("cannot get null payload");
    }
    return payload;
}


function setAccessTokenPayload(req: express.Request, payload: Object) {
    if (!payload) {
        throw new Error("cannot set null payload");
    }
    (req as any)[ExpressExtendedRequestParams.PAYLOAD] = payload;
}

function getUser(req: express.Request): any {
    let user: IUser = (req as any)[ExpressExtendedRequestParams.USER];
    if (!user) {
        return null;
    }
    return user;
}

function setUser(req: express.Request, userData: IUser) {
    if (!userData) {
        throw new Error("cannot set null user data.");
    }
    (req as any)[ExpressExtendedRequestParams.USER] = userData;
}

const Custom =
{
    getAccessTokenPayload, setAccessTokenPayload,
    getUser, setUser
}


export const RequestHandler =
{
    Custom,
    Defaults,

    getRequestInfo: function (req: express.Request) {

        const info = {
            url: req.url,
            path: req.path,
            query: getQuery(req),
            params: getParams(req),
            body: getBody(req),
            accessToken: getAccessToken(req),
            userAgent: getUserAgent(req)
        };

        return info;
    }
}