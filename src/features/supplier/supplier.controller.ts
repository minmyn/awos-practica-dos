import { type Request, type Response, type NextFunction } from 'express';
import { SupplierService } from './supplier.service.js';
import { BadRequestError } from '../../infra/errors/specific.errors.js';
import type { CreateSupplierDto } from './dtos/create-supplier.dto.js';
import type { UpdateSupplierDto } from './dtos/update-supplier.dto.js';

export class SupplierController {
  constructor(private supplierService: SupplierService) {}

  getSuppliers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {

      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const allSuppliers = await this.supplierService.getAllSuppliers();
      
      const total = allSuppliers.length;
      const totalPages = Math.ceil(total / limit) || 1;
      const startIndex = (page - 1) * limit;
      const paginatedData = allSuppliers.slice(startIndex, startIndex + limit);

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

  getSupplierById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const supplier = await this.supplierService.getSupplierById(String(id));
      res.status(200).json(supplier);
    } catch (error) {
      next(error);
    }
  };

  createSupplier = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const dto: CreateSupplierDto = req.body;

      if (!dto || !dto.name || !dto.phone || !dto.zipCode) {
        throw new BadRequestError(
          'La estructura de la petición contiene errores de sintaxis o parámetros ausentes.',
          {
            invalidFields: ['name', 'phone', 'zipCode'].filter(f => !req.body?.[f]),
            expectedType: 'string'
          }
        );
      }

      const newSupplier = await this.supplierService.createSupplier(dto);
      res.status(201).json(newSupplier);
    } catch (error) {
      next(error);
    }
  };

  updateSupplier = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const dto: UpdateSupplierDto = req.body;

      if (!dto || Object.keys(dto).length === 0) {
        throw new BadRequestError(
          'La estructura de la petición contiene errores de sintaxis o parámetros ausentes.',
          {
            body: 'Debe enviar al menos un campo válido para actualizar (name, phone, o zipCode).'
          }
        );
      }

      const updatedSupplier = await this.supplierService.updateSupplier(String(id), dto);
      res.status(200).json(updatedSupplier);
    } catch (error) {
      next(error);
    }
  };

  deleteSupplier = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      await this.supplierService.deleteSupplier(String(id));
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
}