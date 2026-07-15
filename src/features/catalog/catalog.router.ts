import { Router } from 'express';
import { CategoryRepositoryMocks } from './catalog.repository.js';
import { CategoryService } from './catalog.service.js';
import { CategoryController } from './catalog.controller.js';
import { authMiddleware } from '../../infra/middlewares/auth.middleware.js';
import { authorize } from '../../infra/middlewares/role.middleware.js';

const router = Router();

const repository = new CategoryRepositoryMocks();
const service = new CategoryService(repository);
const controller = new CategoryController(service);

router.get('/', authMiddleware, controller.getCategories);
router.post('/', authMiddleware, authorize(['ADMIN']), controller.createCategory);
router.put('/:id', authMiddleware, authorize(['ADMIN']), controller.updateCategory);
router.delete('/:id', authMiddleware, authorize(['ADMIN']), controller.deleteCategory);

export const CategoryRouter = router;