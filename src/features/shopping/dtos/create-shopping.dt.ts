export interface PurchaseItemDto {
  productName: string;
  quantity: number;
}

export interface CreatePurchaseDto {
  supplierName: string;
  bill: string;
  items: PurchaseItemDto[];
}