import type { SupplierEntity } from '../entities/supplier.entity.js';
import type { CreateSupplierDto } from '../dtos/create-supplier.dto.js';
import type { UpdateSupplierDto } from '../dtos/update-supplier.dto.js';

export interface ISupplierRepository {
  findAll(): Promise<SupplierEntity[]>;
  findById(id: string): Promise<SupplierEntity | null>;
  findByName(name: string): Promise<SupplierEntity | null>;
  create(dto: CreateSupplierDto): Promise<SupplierEntity>;
  update(id: string, dto: UpdateSupplierDto): Promise<SupplierEntity | null>;
  delete(id: string): Promise<boolean>;
}