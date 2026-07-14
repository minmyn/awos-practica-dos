import crypto from 'crypto';
import type { PurchaseEntity } from './entities/shopping.entity.js';
import type { SupplierEntity } from '../supplier/entities/supplier.entity.js';
import type { ProductEntity } from '../products/entities/product.entity.js';

export class PurchaseRepository {
  private static purchases: PurchaseEntity[] = [];

  constructor() {
    if (PurchaseRepository.purchases.length === 0) {
      this.initializeMockPurchases();
    }
  }

  private initializeMockPurchases(): void {
    const mockSuppliers = [
      { id: crypto.randomUUID(), name: 'Coca'},
      { id: crypto.randomUUID(), name: 'Nestle'}
    ] as SupplierEntity[];

    const mockProducts = [
      { id: crypto.randomUUID(), name: 'Pluma', price: 10 },
      { id: crypto.randomUUID(), name: 'Leche Entera 1L', price: 25},
      { id: crypto.randomUUID(), name: 'Galletas de Chocolate', price: 181}
    ] as ProductEntity[];

    const facturasfalsas = ['FEAC-23', 'BILL-9982', 'FACT-404', 'INV-7712', 'TICK-902'];

    for (let i = 0; i < 5; i++) {
      const supplier = mockSuppliers[i % mockSuppliers.length];
      
      const items = [
        {
          product: mockProducts[0],
          quantity: Math.floor(Math.random() * 10) + i + 1
        },
        {
          product: mockProducts[(i + 1) % mockProducts.length],
          quantity: Math.floor(Math.random() * 5) + 2
        }
      ];

      PurchaseRepository.purchases.push({
        id: crypto.randomUUID(),
        supplier: supplier!, 
        invoiceNumber: facturasfalsas[i]!,
        items: items.map(item => ({
          product: item.product!, 
          quantity: item.quantity
        })),
        createdAt: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString(),
        active: true
      });
    }
  }

  async create(purchase: PurchaseEntity): Promise<PurchaseEntity> {
    PurchaseRepository.purchases.push(purchase);
    return purchase;
  }

  async findAll(): Promise<PurchaseEntity[]> {
    return PurchaseRepository.purchases.filter(p => p.active);
  }

  async findById(id: string): Promise<PurchaseEntity | null> {
    const purchase = PurchaseRepository.purchases.find(p => p.id === id && p.active);
    return purchase || null;
  }

  async updateInvoice(id: string, invoiceNumber: string): Promise<PurchaseEntity | null> {
    const purchase = PurchaseRepository.purchases.find(p => p.id === id && p.active);
    if (!purchase) return null;
    purchase.invoiceNumber = invoiceNumber;
    return purchase;
  }

  async softDelete(id: string): Promise<boolean> {
    const purchase = PurchaseRepository.purchases.find(p => p.id === id && p.active);
    if (!purchase) return false;

    purchase.active = false;
    return true;
  }
}