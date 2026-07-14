import { ProductRepository } from './product.repository.js';
import { CategoryRepository } from '../catalog/catalog.repository.js';
import { NotFoundError, ConflictError, UnprocessableEntityError } from '../../infra/errors/specific.errors.js';
import type { CreateProductDto } from './dtos/create-product.dto.js';
import type { UpdateProductDto } from './dtos/update-product.dto.js';
import type { ProductResponseDto } from './dtos/product-response.dto.js';
import type { ProductEntity } from './entities/product.entity.js';

export class ProductService {
  private categoryRepository = new CategoryRepository();

  constructor(private productRepository: ProductRepository) {}

  async getProducts(search?: string): Promise<ProductResponseDto[]> {
    let products = await this.productRepository.findAll();

    if (search) {
      const query = search.toLowerCase();
      products = products.filter(p => 
        p.name.toLowerCase().includes(query) || p.barcode.includes(query)
      );
    }

    return products.map(p => this.toResponseDto(p));
  }

  async getProductById(id: string): Promise<ProductResponseDto> {
    const product = await this.productRepository.findById(id);
    if (!product) {
      throw new NotFoundError('El artículo solicitado no existe en el catálogo o fue removido lógicamente.', { searchedId: id });
    }
    return this.toResponseDto(product);
  }

  async createProduct(dto: CreateProductDto): Promise<ProductResponseDto> {
    if (dto.price <= 0) {
      throw new UnprocessableEntityError('El precio debe ser un valor numérico mayor a cero.');
    }

    const existingProduct = await this.productRepository.findByName(dto.name);
    if (existingProduct) {
      throw new ConflictError('Conflicto de unicidad de datos en la persistencia del sistema.', {
        conflictingField: 'name',
        conflictingValue: dto.name
      });
    }
    
    const existingCategory = await this.categoryRepository.findByName(dto.categoryName);
    if (!existingCategory) {
      throw new NotFoundError('La categoría asociada provista no existe en el sistema.', { categoryName: dto.categoryName });
    }

    const cleanDto = { ...dto, inStock: dto.inStock ?? 0 };

    const newEntity = await this.productRepository.create(cleanDto);
    return this.toResponseDto(newEntity);
  }

  async updateProduct(id: string, dto: UpdateProductDto): Promise<ProductResponseDto> {
    if (dto.price !== undefined && dto.price <= 0) {
      throw new UnprocessableEntityError('El precio debe ser un valor numérico mayor a cero.');
    }

    if (dto.categoryName !== undefined) {
      const existingCategory = await this.categoryRepository.findByName(dto.categoryName);
      if (!existingCategory) {
        throw new NotFoundError('La categoría asociada provista no existe en el sistema.', { categoryName: dto.categoryName });
      }
    }

    const updatedEntity = await this.productRepository.update(id, dto);
    if (!updatedEntity) {
      throw new NotFoundError('El artículo solicitado no existe en el catálogo o fue removido lógicamente.', { searchedId: id });
    }

    return this.toResponseDto(updatedEntity);
  }

  async removeProduct(id: string): Promise<void> {
    const success = await this.productRepository.softDelete(id);
    if (!success) {
      throw new NotFoundError('El artículo solicitado no existe en el catálogo o fue removido lógicamente.', { searchedId: id });
    }
  }

  private toResponseDto(entity: ProductEntity): ProductResponseDto {
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