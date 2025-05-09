
import { Request, Response, NextFunction } from 'express';

/**
 * @description global all else failed, handler
 * @param err- the error
 * @param req- the request
 * @param res- the response
 * @param next- callback used if headerSent already
 */
export default (err: any, req: Request, res: Response, next: NextFunction) => {
    if (res.headersSent) {
        console.log("err=====>>>>", err)
        next(err);
    } else {
        if (err && err.options) {
            console.log(`Error handler:: Error recieved from an api request ${err.message}. ${err.options.uri}`);
        } else {
            console.log('Error handler:: ', err.stack);
        }
    }

    const statusCode = err.statusCode ? err.statusCode : 500;
    const message = err.message ? err.message : 'Something has gone wrong, and we did not handle that correctly!';
    res.status(statusCode);
    res.send({
        code: statusCode,
        message
    });
}
