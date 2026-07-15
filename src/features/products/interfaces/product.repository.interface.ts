import { ProductEntity } from '../entities/product.entity.js';
import { UpdateProductDto } from '../dtos/update-product.dto.js';

export interface IProductRepository {
  findAll(): Promise<ProductEntity[]>;
  findById(id: string): Promise<ProductEntity | null>;
  findByName(name: string): Promise<ProductEntity | null>;
  create(entity: ProductEntity): Promise<ProductEntity>;
  update(id: string, dto: UpdateProductDto): Promise<ProductEntity | null>;
  softDelete(id: string): Promise<boolean>;
}