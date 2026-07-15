import { type Request, type Response, type NextFunction } from 'express';
import { ForbiddenError } from '../errors/specific.errors.js';

export const authorize = (allowedRoles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const user = (req as any).user;

        if (!user || !allowedRoles.includes(user.role)) {
            throw new ForbiddenError('No tienes permisos suficientes para realizar esta acción');
        }
        next();
    };
};