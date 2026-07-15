import { CategoryEntity } from '../entities/catalog.entity.js';

export interface ICatalogRepository {
  findAll(): Promise<CategoryEntity[]>;
  findById(id: string): Promise<CategoryEntity | null>;
  findByName(name: string): Promise<CategoryEntity | null>;
  create(entity: CategoryEntity): Promise<CategoryEntity>;
  update(entity: CategoryEntity): Promise<CategoryEntity | null>;
  delete(id: string): Promise<boolean>;
}