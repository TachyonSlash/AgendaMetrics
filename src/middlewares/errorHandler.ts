import { Request, Response, NextFunction } from "express";

const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack)

    const statusCode = err.statusCode || 500;

    res.status(statusCode).json({
        success: false,
        status: statusCode,
        message: err.message || 'Internal Server Error'
    })
}

export default errorHandler;
