import type { PurchaseEntity } from '../entities/shopping.entity.js';

export interface IPurchaseRepository {
  create(purchase: PurchaseEntity): Promise<PurchaseEntity>;
  findAll(): Promise<PurchaseEntity[]>;
  findById(id: string): Promise<PurchaseEntity | null>;
  updateInvoice(id: string, invoiceNumber: string): Promise<PurchaseEntity | null>;
  softDelete(id: string): Promise<boolean>;
}