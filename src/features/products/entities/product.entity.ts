import type { CategoryEntity } from '../../catalog/entities/catalog.entity.js';

export interface ProductEntity {
  id: string;
  name: string;
  price: number;
  minStock: number;
  inStock: number;
  barcode: string;
  category: CategoryEntity;
  active: boolean;
}