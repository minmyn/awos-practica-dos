import { Router } from 'express';
import { UserRepositoryMysql } from '../user/user.repository.js';
import { RoleRepositoryMysql } from '../user/role.repository.js'; // Añadido
import { AuthService } from './auth.service.js';
import { AuthController } from './auth.controller.js';
import { authMiddleware } from '../../infra/middlewares/auth.middleware.js';

const router = Router();

const userRepository = new UserRepositoryMysql();
const roleRepository = new RoleRepositoryMysql();
const service = new AuthService(userRepository, roleRepository);
const controller = new AuthController(service);

router.post('/register', controller.register);
router.post('/login', controller.login);

export const AuthRouter = router;