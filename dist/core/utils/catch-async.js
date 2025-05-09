"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (fn) => (req, res, next) => {
    const routePromise = fn(req, res, next);
    if (routePromise.catch) {
        routePromise.catch((err) => next(err));
    }
};
