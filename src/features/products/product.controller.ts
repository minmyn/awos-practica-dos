import { type Request, type Response, type NextFunction } from 'express';
import { ProductService } from './product.service.js';
import { BadRequestError } from '../../infra/errors/specific.errors.js';
import type { CreateProductDto } from './dtos/create-product.dto.js';
import type { UpdateProductDto } from './dtos/update-product.dto.js';
import { paginate } from '../../infra/utils/pagination.util.js';

export class ProductController {
  constructor(private productService: ProductService) {}

  getExternalProducts = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const search = req.query.search as string | undefined;
      if (!search) {
        throw new BadRequestError(
          'Debes proporcionar una palabra de búsqueda.', 
          { invalidQueryParam: 'search' }
        );
      }

      const products = await this.productService.getExternalProducts(search);
      res.status(200).json(products);
    } catch (error) {
      next(error);
    }
  };

  getProducts = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const search = req.query.search as string | undefined;
      const pageStr = req.query.page as string || '1';
      const limitStr = req.query.limit as string || '10';
      const page = parseInt(pageStr, 10);
      const limit = parseInt(limitStr, 10);

      if (isNaN(page) || page <= 0) {
        throw new BadRequestError('Error en parametros', { invalidQueryParam: 'page' });
      }
      if (isNaN(limit) || limit <= 0) {
        throw new BadRequestError('Error en parametros', { invalidQueryParam: 'limit' });
      }

      const allProducts = await this.productService.getProducts(search);
      const result = paginate(allProducts, page, limit);

      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  getProductById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const product = await this.productService.getProductById(String(id));
      res.status(200).json(product);
    } catch (error) {
      next(error);
    }
  };

  createProduct = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const dto: CreateProductDto = req.body;
      if (!dto.name || dto.price === undefined || !dto.categoryName) {
        throw new BadRequestError('Parametros ausentes', { 
          invalidFields: ['name', 'price', 'categoryName'].filter(f => req.body[f] === undefined) 
        });
      }
      const newProduct = await this.productService.createProduct(dto);
      res.status(201).json(newProduct);
    } catch (error) {
      next(error);
    }
  };

  updateProduct = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const dto: UpdateProductDto = req.body;
      const updated = await this.productService.updateProduct(String(id), dto);
      res.status(200).json(updated);
    } catch (error) {
      next(error);
    }
  };

  deleteProduct = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      await this.productService.removeProduct(String(id));
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
}