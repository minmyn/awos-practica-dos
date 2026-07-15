import { RoleEntity } from '../entities/role.entity.js';

export interface IRoleRepository {
  findByName(name: string): Promise<RoleEntity | null>;
}