import { Router } from 'express';
import { Request, Response } from 'express';
import { ApiResponse } from '../types';

// Import des routes
import suppliersRouter from './suppliers';
import clientsRouter from './clients';
import invoicesRouter from './invoices';
import productsRouter from './products';
import dashboardRouter from './dashboard';

const router = Router();

// Route de santé
router.get('/health', (req: Request, res: Response) => {
  const response: ApiResponse = {
    success: true,
    data: {
      status: 'OK',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development'
    },
    message: 'API en fonctionnement'
  };
  res.json(response);
});

// Route d'accueil
router.get('/', (req: Request, res: Response) => {
  const response: ApiResponse = {
    success: true,
    data: {
      name: 'Invoice Management API',
      version: '1.0.0',
      description: 'API pour la gestion des factures',
      endpoints: {
        suppliers: '/api/suppliers',
        clients: '/api/clients',
        invoices: '/api/invoices',
        products: '/api/products',
        dashboard: '/api/dashboard'
      }
    },
    message: 'Bienvenue sur l\'API de gestion des factures'
  };
  res.json(response);
});

// Montage des routes
router.use('/suppliers', suppliersRouter);
router.use('/clients', clientsRouter);
router.use('/invoices', invoicesRouter);
router.use('/products', productsRouter);
router.use('/dashboard', dashboardRouter);

export default router;
