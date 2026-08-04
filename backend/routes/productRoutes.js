import express from 'express';
import { createProduct, getProducts, getLowStockProducts } from '../controllers/productController.js';
import protect from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.post('/', createProduct);
router.get('/', getProducts);
router.get('/low-stock', getLowStockProducts);

export default router;