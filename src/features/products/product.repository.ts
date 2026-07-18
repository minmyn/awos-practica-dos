import crypto from 'crypto';
import type { ProductEntity } from './entities/product.entity.js';
import type { UpdateProductDto } from './dtos/update-product.dto.js';
import { IProductRepository } from './interfaces/product.repository.interface.js';
import { pool } from '../../infra/database/mysql.config.js';
import { RowDataPacket } from 'mysql2';

export class ProductRepositoryMocks implements IProductRepository {
  private static products: ProductEntity[] = [];


  async findAll(): Promise<ProductEntity[]> {
    return ProductRepositoryMocks.products.filter(p => p.active);
  }

  async findById(id: string): Promise<ProductEntity | null> {
    const product = ProductRepositoryMocks.products.find(p => p.id === id && p.active);
    return product || null;
  }

  async findByName(name: string): Promise<ProductEntity | null> {
    const product = ProductRepositoryMocks.products.find(
      p => p.name.toLowerCase() === name.toLowerCase() && p.active
    );
    return product || null;
  }

  async create(entity: ProductEntity): Promise<ProductEntity> {
    ProductRepositoryMocks.products.push(entity);
    return entity;
  }

  async update(id: string, dto: UpdateProductDto): Promise<ProductEntity | null> {
    const product = ProductRepositoryMocks.products.find(p => p.id === id && p.active);
    if (!product) return null;
    Object.assign(product, dto);
    return product;
  }

  async softDelete(id: string): Promise<boolean> {
    const product = ProductRepositoryMocks.products.find(p => p.id === id && p.active);
    if (!product) return false;

    product.active = false;
    product.inStock = 0;
    return true;
  }
}

export class ProductRepositoryMysql implements IProductRepository {
  private mapRowToEntity(row: any): ProductEntity {
    return {
      id: row.id,
      name: row.name,
      price: Number(row.price),
      minStock: row.min_stock,
      inStock: row.in_stock,
      barcode: row.barcode,
      active: Boolean(row.active),
      category: {
        id: row.category_id,
        name: row.category_name
      }
    };
  }

  async findAll(): Promise<ProductEntity[]> {
    const query = `
      SELECT p.*, c.name as category_name 
      FROM products p 
      JOIN categories c ON p.category_id = c.id 
      WHERE p.active = 1
    `;
    const [rows] = await pool.query(query) as [RowDataPacket[], any];
    return rows.map(row => this.mapRowToEntity(row));
  }

  async findById(id: string): Promise<ProductEntity | null> {
    const query = `
      SELECT p.*, c.name as category_name 
      FROM products p 
      JOIN categories c ON p.category_id = c.id 
      WHERE p.id = ? AND p.active = 1
    `;
    const [rows] = await pool.query(query, [id]) as [RowDataPacket[], any];
    return rows.length ? this.mapRowToEntity(rows[0]) : null;
  }

  async findByName(name: string): Promise<ProductEntity | null> {
    const query = `
      SELECT p.*, c.name as category_name 
      FROM products p 
      JOIN categories c ON p.category_id = c.id 
      WHERE LOWER(p.name) = LOWER(?) AND p.active = 1
    `;
    const [rows] = await pool.query(query, [name]) as [RowDataPacket[], any];
    return rows.length ? this.mapRowToEntity(rows[0]) : null;
  }

  async create(entity: ProductEntity): Promise<ProductEntity> {
    const query = `
      INSERT INTO products (id, name, price, min_stock, in_stock, barcode, category_id, active) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    await pool.query(query, [
      entity.id, entity.name, entity.price, entity.minStock, 
      entity.inStock, entity.barcode, entity.category.id, entity.active ? 1 : 0
    ]);
    return entity;
  }

  async update(id: string, dto: UpdateProductDto): Promise<ProductEntity | null> {
    const product = await this.findById(id);
    if (!product) return null;

    const updated = { ...product, ...dto };
    const query = `
      UPDATE products SET 
      name = ?, price = ?, min_stock = ?, in_stock = ?, barcode = ?
      WHERE id = ?
    `;
    await pool.query(query, [
      updated.name, updated.price, updated.minStock, updated.inStock, updated.barcode, id
    ]);
    return updated;
  }

  async softDelete(id: string): Promise<boolean> {
    const [result] = await pool.query('UPDATE products SET active = 0, in_stock = 0 WHERE id = ?', [id]) as [any, any];
    return result.affectedRows > 0;
  }
}