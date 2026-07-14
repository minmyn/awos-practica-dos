import { UserRepository } from './user.repository.js';
import type { UserResponseDto } from './dtos/user.response.js';
import type { UpdateUserDto } from './dtos/update-user.dto.js';
import type { UserEntity } from './entities/user.entity.js';
import { NotFoundError } from '../../infra/errors/specific.errors.js';

export class UserService {
  constructor(private userRepository: UserRepository) { }

  async getUserProfile(id: string): Promise<UserResponseDto> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundError('El usuario solicitado no existe en el catálogo o fue removido lógicamente.', {
        searchedId: id
      });
    }
    return this.toResponseDto(user);
  }

  async getAllUsers(): Promise<UserResponseDto[]> {
    const users = await this.userRepository.findAll();
    return users.map(user => this.toResponseDto(user));
  }

  async getUserById(id: string): Promise<UserResponseDto> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundError('El usuario solicitado no existe en el catálogo o fue removido lógicamente.', {
        searchedId: id
      });
    }
    return this.toResponseDto(user);
  }

  async updateUser(id: string, dto: UpdateUserDto): Promise<UserResponseDto> {
    const updatedUser = await this.userRepository.update(id, dto);
    
    if (!updatedUser) {
      throw new NotFoundError('El usuario solicitado no existe o fue eliminado del sistema.', { searchedId: id });
    }

    return this.toResponseDto(updatedUser);
  }

  async removeUser(id: string): Promise<void> {
    const success = await this.userRepository.hardDelete(id);
    
    if (!success) {
      throw new NotFoundError('El usuario solicitado no existe o ya fue eliminado previamente.', { searchedId: id });
    }
  }


  private toResponseDto(user: UserEntity): UserResponseDto {
    return {
      id: user.id,
      fullName: user.fullName,
      username: user.username,
      email: user.email
    };
  }
}