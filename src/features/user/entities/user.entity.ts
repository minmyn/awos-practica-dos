import { UUID } from "crypto";
import { RoleEntity } from "./role.entity.js";

export interface UserEntity {
  id: UUID;
  name: string;
  username: string;
  email: string;
  password: string;
  role: RoleEntity;
}