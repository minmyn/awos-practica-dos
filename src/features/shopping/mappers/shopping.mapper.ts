import type { PurchaseEntity } from '../entities/shopping.entity.js';
import type { PurchaseResponseDto } from '../dtos/shopping-response.tdo.js';

export class PurchaseMapper {
  static toResponseDto(entity: PurchaseEntity): PurchaseResponseDto {
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