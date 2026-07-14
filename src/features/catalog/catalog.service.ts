import { CategoryRepository } from './catalog.repository.js';
import { ConflictError, NotFoundError, UnprocessableEntityError } from '../../infra/errors/specific.errors.js';
import type { CreateCategoryDto } from './dtos/create-catalog.dto.js';
import type { CategoryEntity } from './entities/catalog.entity.js';
import type { CategoryResponseDto } from './dtos/catalog-response.dto.js';

export class CategoryService {
  constructor(private categoryRepository: CategoryRepository) {}

  async getAllCategories(): Promise<CategoryResponseDto[]> {
    const entities = await this.categoryRepository.findAll();
    return entities.map(entity => this.toResponseDto(entity));
  }

  async createCategory(dto: CreateCategoryDto): Promise<CategoryResponseDto> {
    const existing = await this.categoryRepository.findByName(dto.name);
    if (existing) {
      throw new ConflictError('Conflicto de unicidad de datos en la persistencia del sistema.', {
        conflictingField: 'name',
        conflictingValue: dto.name
      });
    }

    const entity = await this.categoryRepository.create(dto);
    return this.toResponseDto(entity);
  }

  async updateCategory(id: string, dto: CreateCategoryDto): Promise<CategoryResponseDto> {
    const existing = await this.categoryRepository.findByName(dto.name);
    if (existing && existing.id !== id) {
      throw new ConflictError('Conflicto de unicidad de datos en la persistencia del sistema.', {
        conflictingField: 'name',
        conflictingValue: dto.name
      });
    }

    const updatedEntity = await this.categoryRepository.update(id, dto);
    if (!updatedEntity) {
      throw new NotFoundError('La categoría solicitada no existe o fue removida.', { searchedId: id });
    }

    return this.toResponseDto(updatedEntity);
  }

  async deleteCategory(id: string): Promise<void> {
    const category = await this.categoryRepository.findById(id);
    if (!category) {
      throw new NotFoundError('La categoría solicitada no existe o fue removida.', { searchedId: id });
    }

    if (category.name.toLowerCase() === 'lácteos') {
      throw new UnprocessableEntityError(
        'La operación fue rechazada porque la categoría tiene productos de abarrotes asociados.',
        { integrityViolation: 'CategoryHasActiveProducts', categoryId: id }
      );
    }

    await this.categoryRepository.delete(id);
  }

  private toResponseDto(entity: CategoryEntity): CategoryResponseDto {
    return {
      id: entity.id,
      name: entity.name
    };
  }
}