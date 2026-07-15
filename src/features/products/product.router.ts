import { Router } from 'express';
import { ProductRepositoryMocks } from './product.repository.js';
import { CategoryRepositoryMocks } from '../catalog/catalog.repository.js';
import { ProductService } from './product.service.js';
import { ProductController } from './product.controller.js';
import { authMiddleware } from '../../infra/middlewares/auth.middleware.js';
import { authorize } from '../../infra/middlewares/role.middleware.js';

const router = Router();

const productRepository = new ProductRepositoryMocks();
const categoryRepository = new CategoryRepositoryMocks();
const service = new ProductService(productRepository, categoryRepository);
const controller = new ProductController(service);

router.get('/external', controller.getExternalProducts);
router.get('/', controller.getProducts);
router.get('/:id', controller.getProductById);

router.post('/', authMiddleware, authorize(['ADMIN']), controller.createProduct);
router.put('/:id', authMiddleware, authorize(['ADMIN']), controller.updateProduct);
router.delete('/:id', authMiddleware, authorize(['ADMIN']), controller.deleteProduct);

export const ProductRouter = router;