import { type Request, type Response, type NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UnauthorizedError } from '../errors/specific.errors.js';

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ' )) {
        throw new UnauthorizedError('Token no proporcionado o formato inválido');
    }

    const parts = authHeader.split(' ');
    const token = parts[1];
    
    if (!token) {
        throw new UnauthorizedError('Token no proporcionado');
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret_key') as any;

        (req as any).user = decoded; 
        next();
    } catch (error) {
        throw new UnauthorizedError('Token inválido o expirado');
    }
};