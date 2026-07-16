import type { SupplierEntity } from './entities/supplier.entity.js';
import type { CreateSupplierDto } from './dtos/create-supplier.dto.js';
import type { UpdateSupplierDto } from './dtos/update-supplier.dto.js';

export class SupplierRepository {
  private static suppliers: SupplierEntity[] = [
    ...Array.from({ length: 5 }, (_, index) => {
      const idNum = index + 1;
      return {
        id: crypto.randomUUID(),
        name: `Proveedor${idNum}`,
        phone: `55500000${idNum < 10 ? '0' + idNum : idNum}`,
        zipCode: `100${idNum}`
      };
    })
  ];

  async findAll(): Promise<SupplierEntity[]> {
    return SupplierRepository.suppliers;
  }

  async findById(id: string): Promise<SupplierEntity | null> {
    return SupplierRepository.suppliers.find(s => s.id === id) || null;
  }

  async findByName(name: string): Promise<SupplierEntity | null> {
    // Usamos trim() para evitar que espacios al inicio o final burlen la validación de duplicados
    return SupplierRepository.suppliers.find(
      s => s.name.trim().toLowerCase() === name.trim().toLowerCase()
    ) || null;
  }

  async create(dto: CreateSupplierDto): Promise<SupplierEntity> {
    const newSupplier: SupplierEntity = {
      id: crypto.randomUUID(),
      name: dto.name.trim(),
      phone: dto.phone,
      zipCode: dto.zipCode
    };
    SupplierRepository.suppliers.push(newSupplier);
    return newSupplier;
  }

  async update(id: string, dto: UpdateSupplierDto): Promise<SupplierEntity | null> {
    const supplier = SupplierRepository.suppliers.find(s => s.id === id);
    if (!supplier) return null;

    if (dto.name !== undefined) supplier.name = dto.name.trim();
    if (dto.phone !== undefined) supplier.phone = dto.phone;
    if (dto.zipCode !== undefined) supplier.zipCode = dto.zipCode;

    return supplier;
  }

  async delete(id: string): Promise<boolean> {
    const index = SupplierRepository.suppliers.findIndex(s => s.id === id);
    if (index === -1) return false;
    
    SupplierRepository.suppliers.splice(index, 1);
    return true;
  }
}