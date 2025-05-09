"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unAuthorize = exports.serverError = exports.success = exports.badRequest = exports.notFound = void 0;
const notFound = (res) => {
    res.status(404).json({ error: { error: true, status: 404, message: "Not Found.", data: null } });
};
exports.notFound = notFound;
const badRequest = (res, data) => {
    res.status(400).json({ error: { error: data ? data : true, status: 400, message: "Bad Request.", data: null } });
};
exports.badRequest = badRequest;
const success = (res, data) => {
    return res.status(200).json({ error: false, status: 200, message: "Success.", data: data });
};
exports.success = success;
const serverError = (res, data = null) => {
    return res.status(500).json({ error: { error: true, status: 500, message: data ? data : "Something Went Wrong!", data: null } });
};
exports.serverError = serverError;
const unAuthorize = (res) => {
    // res.redirect("authError")
    return res.status(401).json({ error: { error: true, status: 401, message: "Unauthorized.", data: null } });
};
exports.unAuthorize = unAuthorize;
