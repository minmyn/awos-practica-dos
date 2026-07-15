import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import { AuthRouter } from './features/auth/auth.router.js';
import { UserRouter } from './features/user/user.router.js';
import { CategoryRouter } from './features/catalog/catalog.router.js';
import { ProductRouter } from './features/products/product.router.js';
import { ShoppingRouter } from './features/shopping/shopping.router.js';
import { SupplierRouter } from './features/supplier/supplier.router.js'; 
import { errorHandler } from './infra/middlewares/error.middleware.js';

const app = express();
const PORT = process.env.PORT || 4000;

const allowedOrigins = [
  'http://localhost:3000',
  'http://127.0.0.1:3000' 
];

app.use(cors({
  origin: (
    origin: string | undefined, 
    callback: (err: Error | null, allow?: boolean) => void
  ) => {
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(null, false); 
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  credentials: true
}));

app.use(express.json());

app.use('/api/v1/auth', AuthRouter);
app.use('/api/v1/users', UserRouter);
app.use('/api/v1/categories', CategoryRouter);
app.use('/api/v1/products', ProductRouter);
app.use('/api/v1/purchase', ShoppingRouter);
app.use('/api/v1/suppliers', SupplierRouter);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 Servidor backend unificado corriendo en http://localhost:${PORT}`);
});