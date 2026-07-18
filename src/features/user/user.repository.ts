import type { UserEntity } from './entities/user.entity.js';
import type { UpdateUserDto } from './dtos/update-user.dto.js';
import { IUserRepository } from './interfaces/user.repository.interface.js';
import bcrypt from 'bcryptjs';
import { pool } from '../../infra/database/mysql.config.js';
import { RowDataPacket } from 'mysql2';

export class UserRepositoryMock implements IUserRepository {
  private static users: UserEntity[] = [
    {
      id: '00000000-0000-0000-0000-000000000000',
      name: 'Administrador del Sistema',
      username: 'admin',
      email: 'admin@tienda.com',
      password: bcrypt.hashSync('admin123', 10),
      role: { id: '00000000-0000-0000-0000-000000000001', name: 'ADMIN' }
    }
  ];

  async findAll(): Promise<UserEntity[]> {
    return UserRepositoryMock.users;
  }

  async findById(id: string): Promise<UserEntity | null> {
    const user = UserRepositoryMock.users.find(u => u.id === id);
    return user || null;
  }

  async findByUsername(username: string): Promise<UserEntity | null> {
    const user = UserRepositoryMock.users.find(u => u.username.toLowerCase() === username.toLowerCase());
    return user || null;
  }

  async create(entity: UserEntity): Promise<UserEntity> {
    UserRepositoryMock.users.push(entity);
    return entity;
  }

  async update(id: string, dto: UpdateUserDto): Promise<UserEntity | null> {
    const user = UserRepositoryMock.users.find(u => u.id === id);
    if (!user) return null;

    if (dto.name !== undefined) user.name = dto.name;
    if (dto.username !== undefined) user.username = dto.username;
    if (dto.email !== undefined) user.email = dto.email;
    if (dto.password !== undefined) user.password = dto.password;

    return user;
  }

  async hardDelete(id: string): Promise<boolean> {
    const index = UserRepositoryMock.users.findIndex(u => u.id === id);
    if (index === -1) return false;

    UserRepositoryMock.users.splice(index, 1);
    return true;
  }
}

export class UserRepositoryMysql implements IUserRepository {
  private mapRowToEntity(row: any): UserEntity {
    return {
      id: row.id,
      name: row.name,
      username: row.username,
      email: row.email,
      password: row.password,
      role: {
        id: row.role_id,
        name: row.role_name
      }
    };
  }

  async findAll(): Promise<UserEntity[]> {
    const query = `
      SELECT u.*, r.name as role_name 
      FROM users u JOIN roles r ON u.role_id = r.id
    `;
    const [rows] = await pool.query(query) as [RowDataPacket[], any];
    return rows.map(row => this.mapRowToEntity(row));
  }

  async findById(id: string): Promise<UserEntity | null> {
    const query = `
      SELECT u.*, r.name as role_name 
      FROM users u JOIN roles r ON u.role_id = r.id WHERE u.id = ?
    `;
    const [rows] = await pool.query(query, [id]) as [RowDataPacket[], any];
    return rows.length ? this.mapRowToEntity(rows[0]) : null;
  }

  async findByUsername(username: string): Promise<UserEntity | null> {
    const query = `
      SELECT u.*, r.name as role_name 
      FROM users u JOIN roles r ON u.role_id = r.id WHERE LOWER(u.username) = LOWER(?)
    `;
    const [rows] = await pool.query(query, [username]) as [RowDataPacket[], any];
    return rows.length ? this.mapRowToEntity(rows[0]) : null;
  }

  async create(entity: UserEntity): Promise<UserEntity> {
    const query = 'INSERT INTO users (id, name, username, email, password, role_id) VALUES (?, ?, ?, ?, ?, ?)';
    await pool.query(query, [
      entity.id, entity.name, entity.username, entity.email, entity.password, entity.role.id
    ]);
    return entity;
  }

  async update(id: string, dto: UpdateUserDto): Promise<UserEntity | null> {
    const user = await this.findById(id);
    if (!user) return null;
    
    const updated = { ...user, ...dto };
    const query = 'UPDATE users SET name = ?, username = ?, email = ?, password = ? WHERE id = ?';
    await pool.query(query, [updated.name, updated.username, updated.email, updated.password, id]);
    return updated;
  }

  async hardDelete(id: string): Promise<boolean> {
    const [result] = await pool.query('DELETE FROM users WHERE id = ?', [id]) as [any, any];
    return result.affectedRows > 0;
  }
}