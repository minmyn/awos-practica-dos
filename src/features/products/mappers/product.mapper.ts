import { ProductEntity } from '../entities/product.entity.js';
import { CreateProductDto } from '../dtos/create-product.dto.js';
import { CategoryEntity } from '../../catalog/entities/catalog.entity.js';
import { ProductResponseDto } from '../dtos/product-response.dto.js';

export class ProductMapper {
  static toEntity(dto: CreateProductDto, category: CategoryEntity, id?: string): ProductEntity {
    return {
      id: id || crypto.randomUUID(),
      name: dto.name,
      price: dto.price,
      minStock: dto.minStock,
      inStock: dto.inStock || 0,
      barcode: dto.barcode,
      category: category,
      active: true
    };
  }

  static toResponseDto(entity: ProductEntity): ProductResponseDto {
    return {
      id: entity.id,
      name: entity.name,
      price: entity.price,
      minStock: entity.minStock,
      inStock: entity.inStock,
      barcode: entity.barcode,
      categoryName: entity.category.name,
      stockStatus: entity.inStock <= entity.minStock ? 'LOW_STOCK' : 'OK'
    };
  }
}