export interface CreateProductDto {
  name: string;
  price: number;
  categoryName: string;
  
  minStock: number;
  inStock: number;
  barcode: string;
}