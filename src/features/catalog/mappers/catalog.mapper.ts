import { CategoryEntity } from '../entities/catalog.entity.js';
import { CategoryResponseDto } from '../dtos/catalog-response.dto.js';

export class CatalogMapper {
  static toResponseDto(entity: CategoryEntity): CategoryResponseDto {
    return {
      id: entity.id,
      name: entity.name
    };
  }

  static toResponseDtoList(entities: CategoryEntity[]): CategoryResponseDto[] {
    return entities.map(entity => this.toResponseDto(entity));
  }
}