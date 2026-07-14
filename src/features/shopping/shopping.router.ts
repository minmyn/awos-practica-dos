import { Router } from 'express';
import { PurchaseRepository } from './shopping.repository.js';
import { PurchaseService } from './shopping.service.js';
import { PurchaseController} from './shopping.controller.js';

const router = Router();
const repository = new PurchaseRepository();
const service = new PurchaseService(repository);
const controller = new PurchaseController(service);

router.post('/', controller.createPurchase);      
router.get('/', controller.getPurchases);       
router.get('/:id', controller.getPurchaseById);   
router.delete('/:id', controller.deletePurchase); 

export const ShoppingRouter = router;