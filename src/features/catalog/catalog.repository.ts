import type { CategoryEntity } from './entities/catalog.entity.js';
import { ICatalogRepository } from './interfaces/catalog.repository.interface.js';
import { pool } from '../../infra/database/mysql.config.js';
import { RowDataPacket } from 'mysql2';

export class CategoryRepositoryMocks implements ICatalogRepository {
  private static categories: CategoryEntity[] = [];

  async findAll(): Promise<CategoryEntity[]> {
    return CategoryRepositoryMocks.categories;
  }

  async findById(id: string): Promise<CategoryEntity | null> {
    return CategoryRepositoryMocks.categories.find(c => c.id === id) || null;
  }

  async findByName(name: string): Promise<CategoryEntity | null> {
    return CategoryRepositoryMocks.categories.find(c => c.name.toLowerCase() === name.toLowerCase()) || null;
  }

  async create(entity: CategoryEntity): Promise<CategoryEntity> {
    CategoryRepositoryMocks.categories.push(entity);
    return entity;
  }

  async update(entity: CategoryEntity): Promise<CategoryEntity | null> {
    const index = CategoryRepositoryMocks.categories.findIndex(c => c.id === entity.id);
    if (index === -1) return null;
    
    CategoryRepositoryMocks.categories[index] = entity;
    return entity;
  }

  async delete(id: string): Promise<boolean> {
    const index = CategoryRepositoryMocks.categories.findIndex(c => c.id === id);
    if (index === -1) return false;

    CategoryRepositoryMocks.categories.splice(index, 1);
    return true;
  }
}

export class CategoryRepositoryMysql implements ICatalogRepository {
  async findAll(): Promise<CategoryEntity[]> {
    const [rows] = await pool.query('SELECT id, name FROM categories') as [RowDataPacket[], any];
    return rows as CategoryEntity[];
  }

  async findById(id: string): Promise<CategoryEntity | null> {
    const [rows] = await pool.query('SELECT id, name FROM categories WHERE id = ?', [id]) as [RowDataPacket[], any];
    return rows.length ? (rows[0] as CategoryEntity) : null;
  }

  async findByName(name: string): Promise<CategoryEntity | null> {
    const [rows] = await pool.query('SELECT id, name FROM categories WHERE name = ?', [name]) as [RowDataPacket[], any];
    return rows.length ? (rows[0] as CategoryEntity) : null;
  }

  async create(entity: CategoryEntity): Promise<CategoryEntity> {
    await pool.query('INSERT INTO categories (id, name) VALUES (?, ?)', [entity.id, entity.name]);
    return entity;
  }

  async update(entity: CategoryEntity): Promise<CategoryEntity | null> {
    const [result] = await pool.query('UPDATE categories SET name = ? WHERE id = ?', [entity.name, entity.id]) as [any, any];
    return result.affectedRows > 0 ? entity : null;
  }

  async delete(id: string): Promise<boolean> {
    const [result] = await pool.query('DELETE FROM categories WHERE id = ?', [id]) as [any, any];
    return result.affectedRows > 0;
  }
}