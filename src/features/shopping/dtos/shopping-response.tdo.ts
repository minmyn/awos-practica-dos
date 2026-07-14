export interface PurchaseItemResponseDto {
  productName: string;
  quantity: number;
}

export interface PurchaseResponseDto {
  id: string;
  supplierName: string;
  bill: string;
  items: PurchaseItemResponseDto[];
  createdAt: string;
}