import type { CategoryEntity } from './entities/catalog.entity.js';
import { ICatalogRepository } from './interfaces/catalog.repository.interface.js';

export class CategoryRepositoryMocks implements ICatalogRepository {
  private static categories: CategoryEntity[] = [];

  async findAll(): Promise<CategoryEntity[]> {
    return CategoryRepositoryMocks.categories;
  }

  async findById(id: string): Promise<CategoryEntity | null> {
    return CategoryRepositoryMocks.categories.find(c => c.id === id) || null;
  }

  async findByName(name: string): Promise<CategoryEntity | null> {
    return CategoryRepositoryMocks.categories.find(c => c.name.toLowerCase() === name.toLowerCase()) || null;
  }

  async create(entity: CategoryEntity): Promise<CategoryEntity> {
    CategoryRepositoryMocks.categories.push(entity);
    return entity;
  }

  async update(entity: CategoryEntity): Promise<CategoryEntity | null> {
    const index = CategoryRepositoryMocks.categories.findIndex(c => c.id === entity.id);
    if (index === -1) return null;
    
    CategoryRepositoryMocks.categories[index] = entity;
    return entity;
  }

  async delete(id: string): Promise<boolean> {
    const index = CategoryRepositoryMocks.categories.findIndex(c => c.id === id);
    if (index === -1) return false;

    CategoryRepositoryMocks.categories.splice(index, 1);
    return true;
  }
}