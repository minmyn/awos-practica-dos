import { SupplierRepository } from './supplier.repository.js';
import { NotFoundError, BadRequestError, ConflictError } from '../../infra/errors/specific.errors.js';
import type { CreateSupplierDto } from './dtos/create-supplier.dto.js';
import type { SupplierResponseDto } from './dtos/supplier-response.dto.js';
import type { SupplierEntity } from './entities/supplier.entity.js';
import type { UpdateSupplierDto } from './dtos/update-supplier.dto.js';

export class SupplierService {
  constructor(private supplierRepository: SupplierRepository) {}

  async getAllSuppliers(): Promise<SupplierResponseDto[]> {
    const entities = await this.supplierRepository.findAll();
    return entities.map(entity => this.toResponseDto(entity));
  }

  async getSupplierById(id: string): Promise<SupplierResponseDto> {
    const entity = await this.supplierRepository.findById(id);
    if (!entity) {
      throw new NotFoundError('El proveedor solicitado no existe o fue removido.', { searchedId: id });
    }
    return this.toResponseDto(entity);
  }

  async createSupplier(dto: CreateSupplierDto): Promise<SupplierResponseDto> {
    if (dto.phone.length < 10) {
      throw new BadRequestError('El formato del número telefónico es inválido.', { phone: 'Debe tener al menos 10 dígitos' });
    }

    const existing = await this.supplierRepository.findByName(dto.name);
    if (existing) {
      throw new ConflictError('Conflicto de unicidad de datos en la persistencia del sistema.', {
        conflictingField: 'name',
        conflictingValue: dto.name
      });
    }

    const entity = await this.supplierRepository.create(dto);
    return this.toResponseDto(entity);
  }

  async updateSupplier(id: string, dto: UpdateSupplierDto): Promise<SupplierResponseDto> {
    if (dto.phone !== undefined && dto.phone.length < 10) {
      throw new BadRequestError('El formato del número telefónico es inválido.', { phone: 'Debe tener al menos 10 dígitos' });
    }

    const updatedEntity = await this.supplierRepository.update(id, dto);
    if (!updatedEntity) {
      throw new NotFoundError('El proveedor solicitado no existe o fue removido.', { searchedId: id });
    }

    return this.toResponseDto(updatedEntity);
  }

  async deleteSupplier(id: string): Promise<void> {
    const success = await this.supplierRepository.delete(id);
    if (!success) {
      throw new NotFoundError('El proveedor solicitado no existe o fue removido.', { searchedId: id });
    }
  }

  private toResponseDto(entity: SupplierEntity): SupplierResponseDto {
    return {
      id: entity.id,
      name: entity.name,
      phone: entity.phone,
      zipCode: entity.zipCode
    };
  }
}