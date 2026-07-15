import { UserEntity } from '../entities/user.entity.js';
import { UserResponseDto } from '../dtos/user-response.dto.js';
import { RegisterRequestDto } from '../../auth/dtos/register.dto.js';
import { RoleEntity } from '../entities/role.entity.js';

export class UserMapper {

  static toResponseDto(entity: UserEntity): UserResponseDto {
    return {
      id: entity.id,
      name: entity.name,
      username: entity.username,
      email: entity.email,
      role: entity.role.name
    };
  }

  static toEntityFromRegister(dto: RegisterRequestDto, hashedPassword: string, role : RoleEntity): UserEntity {
    return {
      id: crypto.randomUUID(),
      name: dto.name,
      username: dto.username,
      email: dto.email,
      password: hashedPassword,
      role: role as any 
    };
  }

  static toResponseDtoList(entities: UserEntity[]): UserResponseDto[] {
    return entities.map((entity) => this.toResponseDto(entity));
  }
}