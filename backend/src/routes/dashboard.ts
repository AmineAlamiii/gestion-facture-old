import { Router } from 'express';
import { DashboardController } from '../controllers/DashboardController';
import { validateQuery } from '../middleware/validation';

const router = Router();
const dashboardController = new DashboardController();

// GET /api/dashboard/stats - Statistiques du tableau de bord
router.get('/stats', dashboardController.getDashboardStats);

// GET /api/dashboard/charts - Données pour les graphiques
router.get('/charts', validateQuery, dashboardController.getDashboardCharts);

// GET /api/dashboard/health - État de santé du système
router.get('/health', dashboardController.getDashboardHealth);

export default router;
