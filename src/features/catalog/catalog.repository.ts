import type { CategoryEntity } from './entities/catalog.entity.js';
import type { CreateCategoryDto } from './dtos/create-catalog.dto.js';

export class CategoryRepository {
  private static categories: CategoryEntity[] = [
    ...Array.from({ length: 9 }, (_, index) => {
      const nombresAbarrotes = [
        'Lacteos',
        'Enlatados',
        'Limpieza',
        'Bebidas',
        'Panadería',
        'Cuidado Personal',
        'Frutas y Verduras',
      ];
      
      return {
        id: crypto.randomUUID(),
        name: nombresAbarrotes[index] || `Categoria${index + 1}`
      };
    })
  ];

  async findAll(): Promise<CategoryEntity[]> {
    return CategoryRepository.categories;
  }

  async findById(id: string): Promise<CategoryEntity | null> {
    return CategoryRepository.categories.find(c => c.id === id) || null;
  }

  async findByName(name: string): Promise<CategoryEntity | null> {
    return CategoryRepository.categories.find(c => c.name.toLowerCase() === name.toLowerCase()) || null;
  }

  async create(dto: CreateCategoryDto): Promise<CategoryEntity> {
    const newCategory: CategoryEntity = {
      id: crypto.randomUUID(),
      name: dto.name
    };
    CategoryRepository.categories.push(newCategory);
    return newCategory;
  }

  async update(id: string, dto: CreateCategoryDto): Promise<CategoryEntity | null> {
    const category = CategoryRepository.categories.find(c => c.id === id);
    if (!category) return null;

    category.name = dto.name;
    return category;
  }

  async delete(id: string): Promise<boolean> {
    const index = CategoryRepository.categories.findIndex(c => c.id === id);
    if (index === -1) return false;

    CategoryRepository.categories.splice(index, 1);
    return true;
  }
}