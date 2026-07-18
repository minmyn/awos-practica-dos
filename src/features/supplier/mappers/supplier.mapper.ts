import crypto from 'crypto';
import type { SupplierEntity } from '../entities/supplier.entity.js';
import type { CreateSupplierDto } from '../dtos/create-supplier.dto.js';
import type { SupplierResponseDto } from '../dtos/supplier-response.dto.js';

export class SupplierMapper {
  static toEntity(dto: CreateSupplierDto, id?: string): SupplierEntity {
    return {
      id: id || crypto.randomUUID(),
      name: dto.name.trim(),
      phone: dto.phone,
      zipCode: dto.zipCode
    };
  }

  static toResponseDto(entity: SupplierEntity): SupplierResponseDto {
    return {
      id: entity.id,
      name: entity.name,
      phone: entity.phone,
      zipCode: entity.zipCode
    };
  }
}