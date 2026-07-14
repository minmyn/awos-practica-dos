import crypto from 'crypto';
import { PurchaseRepository } from './shopping.repository.js';
import { ProductRepository } from '../products/product.repository.js';
import { SupplierRepository } from '../supplier/supplier.repository.js';
import { NotFoundError } from '../../infra/errors/specific.errors.js';
import type { CreatePurchaseDto } from './dtos/create-shopping.dt.js';
import type { PurchaseResponseDto } from './dtos/shopping-response.tdo.js';
import type { PurchaseEntity, PurchaseItemEntity } from './entities/shopping.entity.js';

export class PurchaseService {
  private supplierRepository = new SupplierRepository();
  private productRepository = new ProductRepository();

  constructor(private purchaseRepository: PurchaseRepository) {}

  async createPurchase(dto: CreatePurchaseDto): Promise<PurchaseResponseDto> {
    const supplier = await this.supplierRepository.findByName(dto.supplierName);
    if (!supplier) {
      throw new NotFoundError('El proveedor asociado provisto no existe en el sistema.', { supplierName: dto.supplierName });
    }

    const purchaseItemsEntities: PurchaseItemEntity[] = [];

    for (const item of dto.items) {
      const product = await this.productRepository.findByName(item.productName);
      if (!product) {
        throw new NotFoundError('El artículo solicitado no existe en el catálogo o fue removido lógicamente.', { productName: item.productName });
      }
      
      purchaseItemsEntities.push({
        product,
        quantity: item.quantity
      });
    }

    for (const itemEntity of purchaseItemsEntities) {
      itemEntity.product.inStock += itemEntity.quantity;
    }

    const newPurchase: PurchaseEntity = {
      id: crypto.randomUUID(),
      supplier,
      invoiceNumber: dto.bill,
      items: purchaseItemsEntities,
      createdAt: new Date().toISOString(),
      active: true
    };

    const savedEntity = await this.purchaseRepository.create(newPurchase);
    return this.toResponseDto(savedEntity);
  }

  async getPurchases(): Promise<PurchaseResponseDto[]> {
    const list = await this.purchaseRepository.findAll();
    return list.map(p => this.toResponseDto(p));
  }

  async getPurchaseById(id: string): Promise<PurchaseResponseDto> {
    const purchase = await this.purchaseRepository.findById(id);
    if (!purchase) {
      throw new NotFoundError('La compra solicitada no existe o fue removida lógicamente.', { searchedId: id });
    }
    return this.toResponseDto(purchase);
  }

  async removePurchase(id: string): Promise<void> {
    const success = await this.purchaseRepository.softDelete(id);
    if (!success) {
      throw new NotFoundError('La compra solicitada no existe o fue removida lógicamente.', { searchedId: id });
    }
  }

  private toResponseDto(entity: PurchaseEntity): PurchaseResponseDto {
    return {
      id: entity.id,
      supplierName: entity.supplier.name,
      bill: entity.invoiceNumber,
      items: entity.items.map(item => ({
        productName: item.product.name,
        quantity: item.quantity
      })),
      createdAt: entity.createdAt
    };
  }
}