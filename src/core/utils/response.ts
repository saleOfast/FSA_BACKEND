import { Response } from "express";

export const notFound = (res: Response) => {
    res.status(404).json({ error: { error: true, status: 404, message: "Not Found.", data: null } });
};

export const badRequest = (res: Response, data: any) => {
    res.status(400).json({ error: { error: data ? data : true, status: 400, message: "Bad Request.", data: null } });
};

export const success = (res: Response, data: any) => {
    return res.status(200).json({ error: false, status: 200, message: "Success.", data: data });
}

export const serverError = (res: Response, data: any = null) => {
    return res.status(500).json({ error: { error: true, status: 500, message: data ? data : "Something Went Wrong!", data: null } });
}

export const unAuthorize = (res: Response) => {
    // res.redirect("authError")
    return res.status(401).json({ error: { error: true, status: 401, message: "Unauthorized.", data: null } });
}
