import crypto from 'crypto';
import type { ProductEntity } from './entities/product.entity.js';
import type { CreateProductDto } from './dtos/create-product.dto.js';
import type { UpdateProductDto } from './dtos/update-product.dto.js';
import { IProductRepository } from './interfaces/product.repository.interface.js';

export class ProductRepositoryMocks implements IProductRepository {
  private static products: ProductEntity[] = [];


  async findAll(): Promise<ProductEntity[]> {
    return ProductRepositoryMocks.products.filter(p => p.active);
  }

  async findById(id: string): Promise<ProductEntity | null> {
    const product = ProductRepositoryMocks.products.find(p => p.id === id && p.active);
    return product || null;
  }

  async findByName(name: string): Promise<ProductEntity | null> {
    const product = ProductRepositoryMocks.products.find(
      p => p.name.toLowerCase() === name.toLowerCase() && p.active
    );
    return product || null;
  }

  async create(entity: ProductEntity): Promise<ProductEntity> {
    ProductRepositoryMocks.products.push(entity);
    return entity;
  }

  async update(id: string, dto: UpdateProductDto): Promise<ProductEntity | null> {
    const product = ProductRepositoryMocks.products.find(p => p.id === id && p.active);
    if (!product) return null;
    Object.assign(product, dto);
    return product;
  }

  async softDelete(id: string): Promise<boolean> {
    const product = ProductRepositoryMocks.products.find(p => p.id === id && p.active);
    if (!product) return false;

    product.active = false;
    product.inStock = 0;
    return true;
  }
}