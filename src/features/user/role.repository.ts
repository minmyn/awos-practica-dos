import { IRoleRepository } from './interfaces/role.repository.interface.js';
import { RoleEntity } from './entities/role.entity.js';

export class RoleRepositoryMock implements IRoleRepository {
  private static roles: RoleEntity[] = [
    { id: '00000000-0000-0000-0000-000000000001', name: 'ADMIN' },
    { id: '00000000-0000-0000-0000-000000000002', name: 'CLIENT' }
  ];

  async findByName(name: string): Promise<RoleEntity | null> {
    return RoleRepositoryMock.roles.find(r => r.name.toUpperCase() === name.toUpperCase()) || null;
  }
}