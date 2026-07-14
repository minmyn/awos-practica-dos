import { type Request, type Response, type NextFunction } from 'express';
import { PurchaseService } from './shopping.service.js';
import { BadRequestError } from '../../infra/errors/specific.errors.js';
import type { CreatePurchaseDto } from './dtos/create-shopping.dt.js';

export class PurchaseController {
  constructor(private purchaseService: PurchaseService) {}

  getPurchases = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const pageStr = req.query.page as string || '1';
      const limitStr = req.query.limit as string || '10';

      const page = parseInt(pageStr, 10);
      const limit = parseInt(limitStr, 10);

      if (isNaN(page) || page <= 0) {
        throw new BadRequestError('La estructura de la petición contiene errores de sintaxis o parámetros ausentes.', {
          invalidQueryParam: 'page',
          expectedType: 'integer',
          receivedValue: pageStr
        });
      }
      if (isNaN(limit) || limit <= 0) {
        throw new BadRequestError('La estructura de la petición contiene errores de sintaxis o parámetros ausentes.', {
          invalidQueryParam: 'limit',
          expectedType: 'integer',
          receivedValue: limitStr
        });
      }

      const allPurchases = await this.purchaseService.getPurchases();
      
      const total = allPurchases.length;
      const totalPages = Math.ceil(total / limit);
      const startIndex = (page - 1) * limit;
      const paginatedData = allPurchases.slice(startIndex, startIndex + limit);

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

  getPurchaseById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const purchase = await this.purchaseService.getPurchaseById(String(id));
      res.status(200).json(purchase);
    } catch (error) {
      next(error);
    }
  };

  createPurchase = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const dto: CreatePurchaseDto = req.body;

      if (!dto.supplierName || !dto.bill || !Array.isArray(dto.items) || dto.items.length === 0) {
        throw new BadRequestError('La estructura de la petición contiene errores de sintaxis o parámetros ausentes.', {
          invalidFields: ['supplierName', 'bill', 'items'].filter(f => req.body[f] === undefined)
        });
      }

      const newPurchase = await this.purchaseService.createPurchase(dto);
      res.status(201).json(newPurchase);
    } catch (error) {
      next(error);
    }
  };

  deletePurchase = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      await this.purchaseService.removePurchase(String(id));
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
}