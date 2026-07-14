export interface UpdateProductDto {
  name?: string;
  price?: number;
  minStock?: number;
  inStock?: number;
  barcode?: string;
  categoryName?: string;
}