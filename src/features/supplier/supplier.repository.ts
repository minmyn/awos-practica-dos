import type { SupplierEntity } from './entities/supplier.entity.js';
import type { CreateSupplierDto } from './dtos/create-supplier.dto.js';
import type { UpdateSupplierDto } from './dtos/update-supplier.dto.js';
import type { ISupplierRepository } from './interfaces/supplier.repository.interface.js';
import { pool } from '../../infra/database/mysql.config.js'; 
import crypto from 'crypto';

export class SupplierRepository implements ISupplierRepository {

  async findAll(): Promise<SupplierEntity[]> {
    const [rows]: any = await pool.query('SELECT * FROM suppliers');
    
    return rows.map((row: any) => ({
      id: row.id,
      name: row.name,
      phone: row.phone,
      zipCode: row.zip_code
    }));
  }

  async findById(id: string): Promise<SupplierEntity | null> {
    const [rows]: any = await pool.query('SELECT * FROM suppliers WHERE id = ?', [id]);
    
    if (rows.length === 0) return null;
    const row = rows[0];

    return {
      id: row.id,
      name: row.name,
      phone: row.phone,
      zipCode: row.zip_code
    };
  }

  async findByName(name: string): Promise<SupplierEntity | null> {
    const [rows]: any = await pool.query(
      'SELECT * FROM suppliers WHERE LOWER(TRIM(name)) = LOWER(TRIM(?))', 
      [name]
    );

    if (rows.length === 0) return null;
    const row = rows[0];

    return {
      id: row.id,
      name: row.name,
      phone: row.phone,
      zipCode: row.zip_code
    };
  }

  async create(dto: CreateSupplierDto): Promise<SupplierEntity> {
    const newSupplier: SupplierEntity = {
      id: crypto.randomUUID(),
      name: dto.name.trim(),
      phone: dto.phone,
      zipCode: dto.zipCode
    };

    await pool.query(
      'INSERT INTO suppliers (id, name, phone, zip_code) VALUES (?, ?, ?, ?)',
      [newSupplier.id, newSupplier.name, newSupplier.phone, newSupplier.zipCode]
    );

    return newSupplier;
  }

  async update(id: string, dto: UpdateSupplierDto): Promise<SupplierEntity | null> {
    const fields: string[] = [];
    const values: any[] = [];

    if (dto.name !== undefined) {
      fields.push('name = ?');
      values.push(dto.name.trim());
    }
    if (dto.phone !== undefined) {
      fields.push('phone = ?');
      values.push(dto.phone);
    }
    if (dto.zipCode !== undefined) {
      fields.push('zip_code = ?');
      values.push(dto.zipCode);
    }

    if (fields.length === 0) {
      return this.findById(id);
    }

    values.push(id);

    await pool.query(
      `UPDATE suppliers SET ${fields.join(', ')} WHERE id = ?`,
      values
    );

    return this.findById(id);
  }

  async delete(id: string): Promise<boolean> {
    const [result]: any = await pool.query('DELETE FROM suppliers WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }
}