import { UserEntity } from '../entities/user.entity.js';
import { UpdateUserDto } from '../dtos/update-user.dto.js';

export interface IUserRepository {
  findAll(): Promise<UserEntity[]>;
  findById(id: string): Promise<UserEntity | null>;
  findByUsername(username: string): Promise<UserEntity | null>;
  create(entity: UserEntity): Promise<UserEntity>;
  update(id: string, dto: UpdateUserDto): Promise<UserEntity | null>;
  hardDelete(id: string): Promise<boolean>;
}