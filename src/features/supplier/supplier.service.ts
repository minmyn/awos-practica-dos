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
    // REGLA: El teléfono debe tener al menos 10 dígitos y solo contener números
    const phoneRegex = /^\d+$/;
    if (dto.phone.length < 10 || !phoneRegex.test(dto.phone)) {
      throw new BadRequestError('El formato del número telefónico es inválido.', { 
        phone: 'Debe tener al menos 10 dígitos y contener únicamente números.' 
      });
    }

    // REGLA: No duplicar nombres al crear
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
    // Primero verificamos que el proveedor a actualizar realmente exista
    const currentSupplier = await this.supplierRepository.findById(id);
    if (!currentSupplier) {
      throw new NotFoundError('El proveedor solicitado no existe o fue removido.', { searchedId: id });
    }

    // REGLA: Si se actualiza el teléfono, validar su longitud y formato
    if (dto.phone !== undefined) {
      const phoneRegex = /^\d+$/;
      if (dto.phone.length < 10 || !phoneRegex.test(dto.phone)) {
        throw new BadRequestError('El formato del número telefónico es inválido.', { 
          phone: 'Debe tener al menos 10 dígitos y contener únicamente números.' 
        });
      }
    }

    // REGLA: Si se cambia el nombre, verificar que el nuevo nombre no lo tenga YA otro proveedor
    if (dto.name !== undefined && dto.name.toLowerCase() !== currentSupplier.name.toLowerCase()) {
      const existing = await this.supplierRepository.findByName(dto.name);
      if (existing) {
        throw new ConflictError('Ya existe otro proveedor con ese nombre.', {
          conflictingField: 'name',
          conflictingValue: dto.name
        });
      }
    }

    const updatedEntity = await this.supplierRepository.update(id, dto);
    return this.toResponseDto(updatedEntity!);
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