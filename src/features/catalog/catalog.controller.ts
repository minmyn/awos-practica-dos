import { type Request, type Response, type NextFunction } from 'express';
import { CategoryService } from './catalog.service.js';
import { BadRequestError } from '../../infra/errors/specific.errors.js';
import type { CreateCategoryDto } from './dtos/create-catalog.dto.js';

export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  getCategories = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      if (isNaN(page) || isNaN(limit)) {
        throw new BadRequestError(
          'La estructura de la petición contiene errores de sintaxis o parámetros ausentes.',
          {
            invalidQueryParam: isNaN(limit) ? 'limit' : 'page',
            expectedType: 'integer',
            receivedValue: isNaN(limit) ? req.query.limit : req.query.page
          }
        );
      }

      const allCategories = await this.categoryService.getAllCategories();
      
      const total = allCategories.length;
      const totalPages = Math.ceil(total / limit) || 1;
      const startIndex = (page - 1) * limit;
      const paginatedData = allCategories.slice(startIndex, startIndex + limit);

      res.status(200).json({
        data: paginatedData,
        pagination: { 
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

  createCategory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const dto: CreateCategoryDto = req.body;
      
      if (!dto || !dto.name) {
        throw new BadRequestError(
          'La estructura de la petición contiene errores de sintaxis o parámetros ausentes.',
          {
            invalidFields: ['name'].filter(f => !req.body?.[f]),
            expectedType: 'string'
          }
        );
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

      if (!dto || Object.keys(dto).length === 0 || !dto.name) {
        throw new BadRequestError(
          'La estructura de la petición contiene errores de sintaxis o parámetros ausentes.',
          { body: 'Debe enviar el campo name para actualizar.' }
        );
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