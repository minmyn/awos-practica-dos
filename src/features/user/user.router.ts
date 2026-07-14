import { Router } from 'express';
import { UserRepository } from './user.repository.js';
import { UserService } from './user.service.js';
import { UserController } from './user.controller.js';

const router = Router();

const repository = new UserRepository();
const service = new UserService(repository);
const controller = new UserController(service);

router.get('/', controller.getUsers);
router.get('/:id', controller.getUserById);
router.patch('/:id', controller.updateUser);
router.delete('/:id', controller.deleteUser);

export const UserRouter = router;