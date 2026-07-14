import { Router } from 'express';
import { ProductRepository } from './product.repository.js';
import { ProductService } from './product.service.js';
import { ProductController } from './product.controller.js';

const router = Router();

const repository = new ProductRepository();
const service = new ProductService(repository);
const controller = new ProductController(service);

router.get('/', controller.getProducts);
router.get('/:id', controller.getProductById);
router.post('/', controller.createProduct);
router.put('/:id', controller.updateProduct);
router.delete('/:id', controller.deleteProduct);

export const ProductRouter = router;