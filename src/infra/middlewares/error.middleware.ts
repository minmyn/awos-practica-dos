import { type Request, type Response, type NextFunction } from 'express';
import { AppError } from '../errors/app.error.js';

export const errorHandler = (
    error: Error,
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    if (error instanceof AppError) {
        res.status(error.statusCode).json({
            code: error.code,
            message: error.message,
            details: error.details
        });
        return;
    }

    console.error('Unhandled Error:', error);
    res.status(500).json({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Ocurrió un error inesperado en el servidor.',
        details: error.message || null
    });
};