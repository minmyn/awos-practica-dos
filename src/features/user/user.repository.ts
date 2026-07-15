import type { UserEntity } from './entities/user.entity.js';
import type { UpdateUserDto } from './dtos/update-user.dto.js';
import { IUserRepository } from './interfaces/user.repository.interface.js';
import bcrypt from 'bcryptjs';

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
  async findAll(): Promise<UserEntity[]> {
    throw new Error('Method not implemented.');
  }
  async findById(id: string): Promise<UserEntity | null> {
    throw new Error('Method not implemented.');
  }
  async findByUsername(username: string): Promise<UserEntity | null> {
    throw new Error('Method not implemented.');
  }
  
  async create(entity: UserEntity): Promise<UserEntity> {
    throw new Error('Method not implemented.');
  }

  async update(id: string, dto: UpdateUserDto): Promise<UserEntity | null> {
    throw new Error('Method not implemented.');
  }
  async hardDelete(id: string): Promise<boolean> {
    throw new Error('Method not implemented.');
  }
}