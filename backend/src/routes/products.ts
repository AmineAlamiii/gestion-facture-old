import { Router } from 'express';
import { ProductController } from '../controllers/ProductController';
import { validateId, validateQuery } from '../middleware/validation';

const router = Router();
const productController = new ProductController();

// GET /api/products - Récupérer tous les produits
router.get('/', validateQuery, productController.getAllProducts);

// GET /api/products/stats - Statistiques des produits
router.get('/stats', productController.getProductStats);

// GET /api/products/report/stock - Rapport de stock
router.get('/report/stock', productController.getStockReport);

// GET /api/products/low-stock - Produits en rupture de stock
router.get('/low-stock', productController.getLowStockProducts);

// GET /api/products/:id - Récupérer un produit par ID
router.get('/:id', validateId, productController.getProductById);

// GET /api/products/search/:description - Rechercher un produit par description
router.get('/search/:description', productController.getProductByDescription);

export default router;
