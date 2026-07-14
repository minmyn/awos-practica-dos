import { type Request, type Response, type NextFunction } from 'express';
import { UserService } from './user.service.js';
import { BadRequestError } from '../../infra/errors/specific.errors.js';
import type { UserResponseDto } from './dtos/user.response.js';
import type { UpdateUserDto } from './dtos/update-user.dto.js';

export class UserController {
  constructor(private userService: UserService) {}

  getUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      let data: UserResponseDto[] = await this.userService.getAllUsers();

      const total = data.length;
      const totalPages = Math.ceil(total / limit) || 1;
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      
      const paginatedData = data.slice(startIndex, endIndex);

      res.status(200).json({
        data: paginatedData,
        meta: {
          page,
          limit,
          total,
          totalPages
        }
      });
    } catch (error) {
      next(error);
    }
  };

  getUserById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const user = await this.userService.getUserById(String(id));
      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  };

  updateUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const dto: UpdateUserDto = req.body;

      if (!dto || Object.keys(dto).length === 0) {
        throw new BadRequestError(
          'La estructura de la petición contiene errores de sintaxis o parámetros ausentes.',
          {
            body: 'Debe enviar al menos un campo válido para actualizar (fullName, username, o email).'
          }
        );
      }

      const updated = await this.userService.updateUser(String(id), dto);
      res.status(200).json(updated);
    } catch (error) {
      next(error);
    }
  };

  deleteUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      
      await this.userService.removeUser(String(id));
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
}