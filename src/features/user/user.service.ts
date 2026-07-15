import { IUserRepository } from './interfaces/user.repository.interface.js';
import type { UserResponseDto } from './dtos/user-response.dto.js';
import type { UpdateUserDto } from './dtos/update-user.dto.js';
import { NotFoundError } from '../../infra/errors/specific.errors.js';
import { UserMapper } from './mappers/user.mapper.js';
import bcrypt from 'bcryptjs';

export class UserService {

  constructor(private userRepository: IUserRepository) { }

  async getUserProfile(id: string): Promise<UserResponseDto> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundError('El usuario solicitado no existe.', { searchedId: id });
    }
    return UserMapper.toResponseDto(user);
  }

  async getAllUsers(): Promise<UserResponseDto[]> {
    const users = await this.userRepository.findAll();
    return UserMapper.toResponseDtoList(users);
  }

  async getUserById(id: string): Promise<UserResponseDto> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundError('El usuario solicitado no existe.', { searchedId: id });
    }
    
    return UserMapper.toResponseDto(user);
  }

  async updateUser(id: string, dto: UpdateUserDto): Promise<UserResponseDto> {
    if (dto.password) {
      dto.password = await bcrypt.hash(dto.password, 10);
    }

    const updatedUser = await this.userRepository.update(id, dto);
    
    if (!updatedUser) {
      throw new NotFoundError('El usuario solicitado no existe.', { searchedId: id });
    }
    return UserMapper.toResponseDto(updatedUser);
  }

  async removeUser(id: string): Promise<void> {
    const success = await this.userRepository.hardDelete(id);
    
    if (!success) {
      throw new NotFoundError('El usuario solicitado no existe.', { searchedId: id });
    }
  }
}