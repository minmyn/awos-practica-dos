import crypto from 'crypto';
import type { ProductEntity } from './entities/product.entity.js';
import type { CreateProductDto } from './dtos/create-product.dto.js';
import type { UpdateProductDto } from './dtos/update-product.dto.js';
import { CategoryRepository } from '../catalog/catalog.repository.js';
import type { CategoryEntity } from '../catalog/entities/catalog.entity.js';

export class ProductRepository {
  private static products: ProductEntity[] = [];
  private categoryRepo = new CategoryRepository();

  constructor() {
    if (ProductRepository.products.length === 0) {
      this.initializeMockProducts();
    }
  }

  private async initializeMockProducts() {
    const catuni: CategoryEntity = { 
      id: crypto.randomUUID(),
      name: 'General' 
    };

    const nombresProductos = [
      'Leche Entera 1L', 'Atún en Agua 140g', 'Detergente Multiusos 1kg', 'Refresco de Cola 2L'
    ];

    nombresProductos.forEach((name, index) => {
      ProductRepository.products.push({
        id: crypto.randomUUID(),
        name,
        price: parseFloat((Math.random() * 50 + 10).toFixed(2)),
        minStock: 5,
        inStock: Math.floor(Math.random() * 20) + 1,
        barcode: `750102030${100 + index}`,
        category: catuni, 
        active: true
      });
    });
  }

  async findAll(): Promise<ProductEntity[]> {
    return ProductRepository.products.filter(p => p.active);
  }

  async findById(id: string): Promise<ProductEntity | null> {
    const product = ProductRepository.products.find(p => p.id === id && p.active);
    return product || null;
  }

  async findByName(name: string): Promise<ProductEntity | null> {
    const product = ProductRepository.products.find(
      p => p.name.toLowerCase() === name.toLowerCase() && p.active
    );
    return product || null;
  }

  async create(dto: CreateProductDto): Promise<ProductEntity> {
    const category = await this.categoryRepo.findByName(dto.categoryName);
    
    const newProduct: ProductEntity = {
      id: crypto.randomUUID(),
      name: dto.name,
      price: dto.price,
      minStock: dto.minStock,
      inStock: dto.inStock || 0,
      barcode: dto.barcode,
      category: category!,
      active: true
    };
    ProductRepository.products.push(newProduct);
    return newProduct;
  }

  async update(id: string, dto: UpdateProductDto): Promise<ProductEntity | null> {
    const product = ProductRepository.products.find(p => p.id === id && p.active);
    if (!product) return null;

    if (dto.name !== undefined) product.name = dto.name;
    if (dto.price !== undefined) product.price = dto.price;
    if (dto.minStock !== undefined) product.minStock = dto.minStock;
    if (dto.inStock !== undefined) product.inStock = dto.inStock;
    if (dto.barcode !== undefined) product.barcode = dto.barcode;
    
    if (dto.categoryName !== undefined) {
      const category = await this.categoryRepo.findById(dto.categoryName);
      if (category) product.category = category;
    }

    return product;
  }

  async softDelete(id: string): Promise<boolean> {
    const product = ProductRepository.products.find(p => p.id === id && p.active);
    if (!product) return false;

    product.active = false;
    product.inStock = 0;
    return true;
  }
}