import { type Request, type Response, type NextFunction } from 'express';
import { UserService } from './user.service.js';
import { BadRequestError } from '../../infra/errors/specific.errors.js';
import type { UpdateUserDto } from './dtos/update-user.dto.js';
import { paginate } from '../../infra/utils/pagination.util.js'; //Nota Min: Cundo ya esta la base de datos cambiar la páginacion para no sobre saturar el cóigo :3

export class UserController {
  constructor(private userService: UserService) { }

  getUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const allUsers = await this.userService.getAllUsers();

      const result = paginate(allUsers, page, limit);

      res.status(200).json(result);
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
            body: 'Debe enviar al menos un campo válido para actualizar (name, username, o email).'
          }
        );
      }

      const updated = await this.userService.updateUser(String(id), dto);
      res.status(200).json(updated);
    } catch (error) {
      next(error);
    }
  };

  updateMyProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userIdFromToken = (req as any).user.id;
      const dto = req.body;
      const updatedUser = await this.userService.updateUser(userIdFromToken, dto);
      res.status(200).json(updatedUser);
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