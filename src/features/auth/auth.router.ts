import { Router } from 'express';
import { UserRepositoryMock } from '../user/user.repository.js';
import { RoleRepositoryMock } from '../user/role.repository.js'; // Añadido
import { AuthService } from './auth.service.js';
import { AuthController } from './auth.controller.js';
import { authMiddleware } from '../../infra/middlewares/auth.middleware.js';

const router = Router();

const userRepository = new UserRepositoryMock();
const roleRepository = new RoleRepositoryMock();
const service = new AuthService(userRepository, roleRepository);
const controller = new AuthController(service);

router.post('/register', controller.register);
router.post('/login', controller.login);

export const AuthRouter = router;