import { Router } from 'express';
import { CategoryRepository } from './catalog.repository.js';
import { CategoryService } from './catalog.service.js';
import { CategoryController } from './catalog.controller.js';

const router = Router();

const repository = new CategoryRepository();
const service = new CategoryService(repository);
const controller = new CategoryController(service);

router.get('/', controller.getCategories);
router.post('/', controller.createCategory);
router.put('/:id', controller.updateCategory);
router.delete('/:id', controller.deleteCategory);

export const CategoryRouter = router;