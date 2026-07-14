import { type Request, type Response, type NextFunction } from 'express';
import { AuthService } from './auth.service.js';
import { BadRequestError } from '../../infra/errors/specific.errors.js';
import type { RegisterRequestDto } from './dtos/register.request.js';
import type { LoginRequestDto } from './dtos/login.request.js';

export class AuthController {
  constructor(private authService: AuthService) {}

  register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const dto: RegisterRequestDto = req.body;

      if (!dto.name || !dto.username || !dto.email || !dto.password) {
        throw new BadRequestError(
          'La estructura de la petición contiene errores de sintaxis o parámetros ausentes.',
          { 
            invalidFields: ['name', 'username', 'email', 'password'].filter(f => !req.body[f]),
            expectedType: 'string'
          }
        );
      }

      const response = await this.authService.register(dto);
      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  };

  login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const dto: LoginRequestDto = req.body;

      if (!dto.username || !dto.password) {
        throw new BadRequestError(
          'La estructura de la petición contiene errores de sintaxis o parámetros ausentes.',
          { 
            invalidFields: ['username', 'password'].filter(f => !req.body[f]),
            expectedType: 'string'
          }
        );
      }

      const response = await this.authService.login(dto);
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  };
}