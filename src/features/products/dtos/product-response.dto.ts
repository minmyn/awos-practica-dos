export interface ProductResponseDto {
  id: string;
  name: string;
  price: number;

  minStock: number;
  inStock: number;
  barcode: string;
  categoryName: string;
  stockStatus: 'OK' | 'LOW_STOCK';
}