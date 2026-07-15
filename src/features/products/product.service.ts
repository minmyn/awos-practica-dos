import crypto from 'crypto';
import { NotFoundError, ConflictError, UnprocessableEntityError } from '../../infra/errors/specific.errors.js';
import type { CreateProductDto } from './dtos/create-product.dto.js';
import type { UpdateProductDto } from './dtos/update-product.dto.js';
import type { ProductResponseDto } from './dtos/product-response.dto.js';
import { FakeStoreProvider } from '../../infra/providers/fake-store.provider.js';
import { IProductRepository } from './interfaces/product.repository.interface.js';
import { ICatalogRepository } from '../catalog/interfaces/catalog.repository.interface.js';
import { ProductMapper } from './mappers/product.mapper.js';

export class ProductService {
  private fakeStoreProvider = new FakeStoreProvider();

  constructor(
    private productRepository: IProductRepository,
    private categoryRepository: ICatalogRepository
  ) {}

  async getExternalProducts(search: string): Promise<any[]> {
    const externalProducts = await this.fakeStoreProvider.getAllProducts();
    
    const query = search.toLowerCase();
    const filteredProducts = externalProducts.filter((ep: any) => 
      ep.title.toLowerCase().includes(query)
    );

    return filteredProducts.map((ep: any) => ({
      name: ep.title,
      price: ep.price,
      categoryName: ep.category,
      minStock: 5,
      inStock: 0,
      barcode: `Fake-${ep.id}`
    }));
  }

  async getProducts(search?: string): Promise<ProductResponseDto[]> {
    let products = await this.productRepository.findAll();
    if (search) {
      const query = search.toLowerCase();
      products = products.filter(p => 
        p.name.toLowerCase().includes(query) || p.barcode.includes(query)
      );
    }
    return products.map(p => ProductMapper.toResponseDto(p));
  }

  async getProductById(id: string): Promise<ProductResponseDto> {
    const product = await this.productRepository.findById(id);
    if (!product) {
      throw new NotFoundError('El articulo solicitado no existe.', { searchedId: id });
    }
    return ProductMapper.toResponseDto(product);
  }

  async createProduct(dto: CreateProductDto): Promise<ProductResponseDto> {
    if (dto.price <= 0) {
      throw new UnprocessableEntityError('El precio debe ser un valor numerico mayor a cero.');
    }

    const existingProduct = await this.productRepository.findByName(dto.name);
    if (existingProduct) {
      throw new ConflictError('Conflicto de unicidad.', {
        conflictingField: 'name',
        conflictingValue: dto.name
      });
    }
    
    let category = await this.categoryRepository.findByName(dto.categoryName);
    if (!category) {
      category = await this.categoryRepository.create({
        id: crypto.randomUUID(),
        name: dto.categoryName
      });
    }

    const cleanDto = { ...dto, inStock: dto.inStock ?? 0 };
    const newEntity = ProductMapper.toEntity(cleanDto, category);
    const savedEntity = await this.productRepository.create(newEntity);

    return ProductMapper.toResponseDto(savedEntity);
  }

  async updateProduct(id: string, dto: UpdateProductDto): Promise<ProductResponseDto> {
    if (dto.price !== undefined && dto.price <= 0) {
      throw new UnprocessableEntityError('El precio debe ser un valor numerico mayor a cero.');
    }

    if (dto.categoryName !== undefined) {
      const existingCategory = await this.categoryRepository.findByName(dto.categoryName);
      if (!existingCategory) {
        throw new NotFoundError('La categoria no existe.', { categoryName: dto.categoryName });
      }
    }

    const updatedEntity = await this.productRepository.update(id, dto);
    if (!updatedEntity) {
      throw new NotFoundError('El articulo solicitado no existe.', { searchedId: id });
    }

    return ProductMapper.toResponseDto(updatedEntity);
  }

  async removeProduct(id: string): Promise<void> {
    const success = await this.productRepository.softDelete(id);
    if (!success) {
      throw new NotFoundError('El articulo solicitado no existe.', { searchedId: id });
    }
  }
}