import { Router } from 'express';
import { UserRepositoryMock, UserRepositoryMysql } from './user.repository.js';
import { UserService } from './user.service.js';
import { UserController } from './user.controller.js';
import { authMiddleware } from '../../infra/middlewares/auth.middleware.js';
import { authorize } from '../../infra/middlewares/role.middleware.js';
import { IUserRepository } from './interfaces/user.repository.interface.js';

const router = Router();

const repository: IUserRepository = new UserRepositoryMysql();
const service = new UserService(repository);
const controller = new UserController(service);

router.patch('/profile', authMiddleware, controller.updateMyProfile);

router.get('/', authMiddleware, authorize(['ADMIN']), controller.getUsers);
router.get('/:id', authMiddleware, authorize(['ADMIN']), controller.getUserById);
router.patch('/:id', authMiddleware, authorize(['ADMIN']), controller.updateUser);
router.delete('/:id', authMiddleware, authorize(['ADMIN']), controller.deleteUser);

export const UserRouter = router;