import type { SupplierEntity } from '../../supplier/entities/supplier.entity.js';
import type { ProductEntity } from '../../products/entities/product.entity.js';

export interface PurchaseItemEntity {
  product: ProductEntity;
  quantity: number;
}

export interface PurchaseEntity {
  id: string;
  supplier: SupplierEntity;
  invoiceNumber: string;
  items: PurchaseItemEntity[];
  createdAt: string;
  active: boolean;
}