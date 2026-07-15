import { IUserRepository } from '../user/interfaces/user.repository.interface.js';
import { ConflictError, UnauthorizedError, NotFoundError } from '../../infra/errors/specific.errors.js';
import type { RegisterRequestDto } from './dtos/register.dto.js';
import type { LoginRequestDto } from './dtos/login.dto.js';
import type { AuthResponseDto } from './dtos/auth-response.dto.js';
import jwt from 'jsonwebtoken'; 
import bcrypt from 'bcryptjs';
import { IRoleRepository } from '../user/interfaces/role.repository.interface.js';
import { UserMapper } from '../user/mappers/user.mapper.js';

export class AuthService {
  constructor(
    private userRepository: IUserRepository,
    private roleRepository: IRoleRepository 
  ) {}

  async register(dto: RegisterRequestDto): Promise<AuthResponseDto> {
    const existingUser = await this.userRepository.findByUsername(dto.username);

    if (existingUser) throw new ConflictError('Usuario ya existe');

    const clientRole = await this.roleRepository.findByName('CLIENT');
    if (!clientRole) throw new Error('Rol por defecto no encontrado');

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const userEntity = UserMapper.toEntityFromRegister(dto, hashedPassword, clientRole);

    const savedUser = await this.userRepository.create(userEntity);

    return this.toAuthResponseDto(savedUser);
  }

  async login(dto: LoginRequestDto): Promise<AuthResponseDto> {
    const existingUser = await this.userRepository.findByUsername(dto.username);
    if (!existingUser) throw new UnauthorizedError('Credenciales incorrectas');
  
    const isMatch = await bcrypt.compare(dto.password, existingUser.password);
    if (!isMatch) {
      throw new UnauthorizedError('Credenciales incorrectas');
    }

    return this.toAuthResponseDto({ ...existingUser });
  }

  private toAuthResponseDto(user: any): AuthResponseDto {
    const userRole = user.role.name;
    
    const token = jwt.sign(
      { id: user.id, role: userRole }, 
      process.env.JWT_SECRET || 'secret_key', 
      { expiresIn: '1h' }
    );

    return {
      id: user.id,
      name: user.name,
      username: user.username,
      email: user.email,
      role: userRole,
      token: token,
      expiresIn: '3600s'
    };
  }

}