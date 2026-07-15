import crypto from 'crypto';
import { ICatalogRepository } from './interfaces/catalog.repository.interface.js';
import { ConflictError, NotFoundError, UnprocessableEntityError } from '../../infra/errors/specific.errors.js';
import type { CreateCategoryDto } from './dtos/create-catalog.dto.js';
import type { CategoryEntity } from './entities/catalog.entity.js';
import type { CategoryResponseDto } from './dtos/catalog-response.dto.js';
import { CatalogMapper } from './mappers/catalog.mapper.js';

export class CategoryService {
  constructor(private categoryRepository: ICatalogRepository) {}

  async getAllCategories(): Promise<CategoryResponseDto[]> {
    const entities = await this.categoryRepository.findAll();
    return CatalogMapper.toResponseDtoList(entities);
  }

  async createCategory(dto: CreateCategoryDto): Promise<CategoryResponseDto> {
    const existing = await this.categoryRepository.findByName(dto.name);
    if (existing) {
      throw new ConflictError('Conflicto de unicidad de datos en la persistencia del sistema.', {
        conflictingField: 'name',
        conflictingValue: dto.name
      });
    }

    const newCategory: CategoryEntity = {
      id: crypto.randomUUID(),
      name: dto.name
    };

    const entity = await this.categoryRepository.create(newCategory);
    return CatalogMapper.toResponseDto(entity);
  }

  async updateCategory(id: string, dto: CreateCategoryDto): Promise<CategoryResponseDto> {
    const existing = await this.categoryRepository.findByName(dto.name);
    if (existing && existing.id !== id) {
      throw new ConflictError('Conflicto de unicidad de datos en la persistencia del sistema.', {
        conflictingField: 'name',
        conflictingValue: dto.name
      });
    }

    const entityToUpdate: CategoryEntity = {
      id,
      name: dto.name
    };

    const updatedEntity = await this.categoryRepository.update(entityToUpdate);
    if (!updatedEntity) {
      throw new NotFoundError('La categoría solicitada no existe o fue removida.', { searchedId: id });
    }

    return CatalogMapper.toResponseDto(updatedEntity);
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
}