"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestHandler = void 0;
const class_transformer_1 = require("class-transformer");
const common_1 = require("../../core/types/Constent/common");
function getBody(req, cls) {
    if (cls) {
        return (0, class_transformer_1.plainToClass)(cls, req.body);
    }
    else {
        return req.body;
    }
}
function getParams(req, cls) {
    if (cls) {
        return (0, class_transformer_1.plainToClass)(cls, req.params);
    }
    else {
        return req.params;
    }
}
function getQuery(req, cls) {
    if (cls) {
        return (0, class_transformer_1.plainToClass)(cls, req.query);
    }
    else {
        return req.query;
    }
}
function getCookies(req) {
    return req.cookies;
}
function getAccessToken(req) {
    if (req && req.headers && req.headers.Authorization) {
        return req.headers.Authorization;
    }
    return null;
}
function getRefreshToken(req) {
    if (req && req.headers && req.headers.refresh_token) {
        return req.headers.refresh_token;
    }
    return null;
}
function getUserAgent(req) {
    const userAgent = req.useragent;
    return userAgent;
}
const Defaults = {
    getBody,
    getParams,
    getQuery,
    getCookies,
    getAccessToken,
    getRefreshToken,
    getUserAgent,
    getUser,
};
function getAccessTokenPayload(req) {
    let payload = req[common_1.ExpressExtendedRequestParams.PAYLOAD];
    if (!payload) {
        throw new Error("cannot get null payload");
    }
    return payload;
}
function setAccessTokenPayload(req, payload) {
    if (!payload) {
        throw new Error("cannot set null payload");
    }
    req[common_1.ExpressExtendedRequestParams.PAYLOAD] = payload;
}
function getUser(req) {
    let user = req[common_1.ExpressExtendedRequestParams.USER];
    if (!user) {
        return null;
    }
    return user;
}
function setUser(req, userData) {
    if (!userData) {
        throw new Error("cannot set null user data.");
    }
    req[common_1.ExpressExtendedRequestParams.USER] = userData;
}
const Custom = {
    getAccessTokenPayload, setAccessTokenPayload,
    getUser, setUser
};
exports.RequestHandler = {
    Custom,
    Defaults,
    getRequestInfo: function (req) {
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
};
