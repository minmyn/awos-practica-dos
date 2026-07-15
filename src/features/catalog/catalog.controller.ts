import { type Request, type Response, type NextFunction } from 'express';
import { CategoryService } from './catalog.service.js';
import { BadRequestError } from '../../infra/errors/specific.errors.js';
import type { CreateCategoryDto } from './dtos/create-catalog.dto.js';
import { paginate } from '../../infra/utils/pagination.util.js';
import { validateCategory } from '../../infra/utils/validator.js';

export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  getCategories = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const allCategories = await this.categoryService.getAllCategories();
      
      const result = paginate(allCategories, page, limit);
      
      res.status(200).json({ result });
    } catch (error) {
      next(error);
    }
  };

  createCategory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const dto: CreateCategoryDto = req.body;
      
      const errors = validateCategory(dto);
      if (Object.keys(errors).length > 0) {
        throw new BadRequestError('Error de validación', errors);
      }

      const newCategory = await this.categoryService.createCategory(dto);
      res.status(201).json(newCategory);
    } catch (error) {
      next(error);
    }
  };

  updateCategory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const dto: CreateCategoryDto = req.body;

      if (!id || id === ':id' || id === 'undefined') {
        throw new BadRequestError(
          'La estructura de la petición contiene errores de sintaxis o parámetros ausentes.',
          { invalidQueryParam: 'id', expectedType: 'string/UUID', receivedValue: id }
        );
      }

      const errors = validateCategory(dto);
      if (Object.keys(errors).length > 0) {
        throw new BadRequestError('Error de validación', errors);
      }

      const updatedCategory = await this.categoryService.updateCategory(String(id), dto);
      res.status(200).json(updatedCategory);
    } catch (error) {
      next(error);
    }
  };

  deleteCategory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;

      if (!id || id === ':id' || id === 'undefined') {
        throw new BadRequestError(
          'La estructura de la petición contiene errores de sintaxis o parámetros ausentes.',
          { invalidQueryParam: 'id', expectedType: 'string/UUID', receivedValue: id }
        );
      }

      await this.categoryService.deleteCategory(String(id));
      res.status(204).send(); 
    } catch (error) {
      next(error);
    }
  };
}