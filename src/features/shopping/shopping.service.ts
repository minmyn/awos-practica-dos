import crypto from 'crypto';
import { PurchaseRepository } from './shopping.repository.js';
import { ProductRepositoryMocks } from '../products/product.repository.js';
import { SupplierRepository } from '../supplier/supplier.repository.js';
import { NotFoundError, BadRequestError } from '../../infra/errors/specific.errors.js'; 
import type { CreatePurchaseDto } from './dtos/create-shopping.dt.js';
import type { PurchaseResponseDto } from './dtos/shopping-response.tdo.js';
import type { PurchaseEntity, PurchaseItemEntity } from './entities/shopping.entity.js';
import { PurchaseMapper } from './mappers/shopping.mapper.js';


export class PurchaseService {
  private supplierRepository = new SupplierRepository();
  private productRepository = new ProductRepositoryMocks();

  constructor(private purchaseRepository: PurchaseRepository) {}

  async createPurchase(dto: CreatePurchaseDto): Promise<PurchaseResponseDto> {
    if (!dto.bill || dto.bill.trim() === '') {
      throw new BadRequestError('El número de factura (bill) no puede estar vacío o contener solo espacios.', { bill: dto.bill });
    }

    const supplier = await this.supplierRepository.findByName(dto.supplierName);
    if (!supplier) {
      throw new NotFoundError('El proveedor asociado provisto no existe en el sistema.', { supplierName: dto.supplierName });
    }

    const purchaseItemsEntities: PurchaseItemEntity[] = [];

    for (const item of dto.items) {
      if (typeof item.quantity !== 'number' || item.quantity <= 0) {
        throw new BadRequestError('La cantidad de cada artículo comprado debe ser un número entero mayor a cero.', { 
          productName: item.productName, 
          receivedQuantity: item.quantity 
        });
      }

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
      invoiceNumber: dto.bill.trim(),
      items: purchaseItemsEntities,
      createdAt: new Date().toISOString(),
      active: true
    };

    const savedEntity = await this.purchaseRepository.create(newPurchase);
    return PurchaseMapper.toResponseDto(savedEntity);
  }

  async getPurchases(): Promise<PurchaseResponseDto[]> {
    const list = await this.purchaseRepository.findAll();
    return list.map(p => PurchaseMapper.toResponseDto(p));
  }

  async getPurchaseById(id: string): Promise<PurchaseResponseDto> {
    const purchase = await this.purchaseRepository.findById(id);
    if (!purchase) {
      throw new NotFoundError('La compra solicitada no existe o fue removida lógicamente.', { searchedId: id });
    }
    return PurchaseMapper.toResponseDto(purchase);
  }

  async removePurchase(id: string): Promise<void> {
    const purchase = await this.purchaseRepository.findById(id);
    if (!purchase) {
      throw new NotFoundError('La compra solicitada no existe o fue removida lógicamente.', { searchedId: id });
    }

    for (const item of purchase.items) {
      if (item.product.inStock < item.quantity) {
        throw new BadRequestError(
          'No se puede eliminar la compra porque el stock actual del producto es menor a la cantidad comprada que se intenta revertir.',
          { productName: item.product.name, currentStock: item.product.inStock, purchaseQuantity: item.quantity }
        );
      }
    }

    for (const item of purchase.items) {
      item.product.inStock -= item.quantity;
    }
    await this.purchaseRepository.softDelete(id);
  }
}