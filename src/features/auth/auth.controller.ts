import { type Request, type Response, type NextFunction } from 'express';
import { AuthService } from './auth.service.js';
import { BadRequestError } from '../../infra/errors/specific.errors.js';
import type { RegisterRequestDto } from './dtos/register.dto.js';
import type { LoginRequestDto } from './dtos/login.dto.js';
import { validateLogin, validateRegister } from '../../infra/utils/validator.js';

export class AuthController {
  constructor(private authService: AuthService) {}

  register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const dto: RegisterRequestDto = req.body;

      const errors = validateRegister(req.body);
      if (Object.keys(errors).length > 0) {
        throw new BadRequestError('Error de validación', errors);
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

      const errors = validateLogin(req.body);
      if (Object.keys(errors).length > 0) {
            throw new BadRequestError('Error de validación', errors);
        }

      const response = await this.authService.login(dto);
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  };
}