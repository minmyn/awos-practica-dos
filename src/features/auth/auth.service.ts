import { UserRepository } from '../user/user.repository.js';
import { ConflictError, UnauthorizedError, NotFoundError } from '../../infra/errors/specific.errors.js';
import type { RegisterRequestDto } from './dtos/register.request.js';
import type { LoginRequestDto } from './dtos/login.request.js';
import type { AuthResponseDto } from './dtos/auth.response.js';

export class AuthService {
  constructor(private userRepository: UserRepository) {}

  async register(dto: RegisterRequestDto): Promise<AuthResponseDto> {
    const existingUser = await this.userRepository.findByUsername(dto.username);
    if (existingUser) {
      throw new ConflictError(
        'Conflicto de unicidad de datos en la persistencia del sistema.',
        { conflictingField: 'username', conflictingValue: dto.username }
      );
    }

    const existingEmail = await this.userRepository.findByEmail(dto.email);
    if (existingEmail) {
      throw new ConflictError(
        'Conflicto de unicidad de datos en la persistencia del sistema.',
        { conflictingField: 'email', conflictingValue: dto.email }
      );
    }

    const userEntity = await this.userRepository.create(dto);

    const userWithRole = { ...userEntity, role: 'CLIENT' };

    return this.toAuthResponseDto(userWithRole);
  }

  async login(dto: LoginRequestDto): Promise<AuthResponseDto> {
    const user = await this.userRepository.findByUsername(dto.username);
    if (!user) {
      throw new NotFoundError(
        'El usuario solicitado no existe en el sistema.',
        { searchedUsername: dto.username }
      );
    }
  
    if (user.password !== `hashed_${dto.password}`) {
      throw new UnauthorizedError(
        'No se ha proporcionado una sesión activa o las credenciales son incorrectas.',
        { status: 'InvalidCredentials' }
      );
    }

    const role = user.username.toLowerCase() === 'admin' ? 'ADMIN' : 'CLIENT';

    return this.toAuthResponseDto({ ...user, role });
  }

  private toAuthResponseDto(user: any): AuthResponseDto {
    const userRole = user.role || 'CLIENT';
    return {
      id: user.id,
      name: user.fullName || user.name,
      username: user.username,
      email: user.email,
      role: userRole,
      token: `${user.id}.${userRole}`, 
      expiresIn: '3600s'
    };
  }
}