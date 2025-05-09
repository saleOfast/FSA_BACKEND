import { NextFunction, Request, Response } from "express";

export default (fn: Function) => (req: Request, res: Response, next: NextFunction) => {
    const routePromise = fn(req, res, next);
    if (routePromise.catch) {
        routePromise.catch((err: ErrorCallback) => next(err));
    }
};
