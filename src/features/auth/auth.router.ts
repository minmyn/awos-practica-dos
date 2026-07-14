import { Router } from 'express';
import { UserRepository } from '../user/user.repository.js';
import { AuthService } from './auth.service.js';
import { AuthController } from './auth.controller.js';

const router = Router();

const repository = new UserRepository();
const service = new AuthService(repository);
const controller = new AuthController(service);

router.post('/register', controller.register);
router.post('/login', controller.login);

export const AuthRouter = router;