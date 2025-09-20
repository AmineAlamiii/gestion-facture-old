import { Request, Response, NextFunction } from 'express';
import { getDatabase } from '../config/database';
import { ApiResponse } from '../types';
import { asyncHandler } from '../middleware/errorHandler';

export class DashboardController {
  private db = getDatabase();

  // GET /api/dashboard/stats
  getDashboardStats = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const stats = await this.db.getStats();

    // Calculer les statistiques supplémentaires
    const recentPurchases = await this.db.allQuery(`
      SELECT 
        pi.id,
        pi.invoiceNumber,
        pi.total,
        pi.date,
        pi.status,
        s.name as supplierName
      FROM purchase_invoices pi
      JOIN suppliers s ON pi.supplierId = s.id
      ORDER BY pi.date DESC
      LIMIT 5
    `);

    const recentSales = await this.db.allQuery(`
      SELECT 
        si.id,
        si.invoiceNumber,
        si.total,
        si.date,
        si.status,
        c.name as clientName
      FROM sale_invoices si
      JOIN clients c ON si.clientId = c.id
      ORDER BY si.date DESC
      LIMIT 5
    `);

    const profit = stats.total_sales - stats.total_purchases;
    const profitMargin = stats.total_sales > 0 ? (profit / stats.total_sales) * 100 : 0;

    const dashboardData = {
      overview: {
        totalSuppliers: stats.suppliers_count,
        totalClients: stats.clients_count,
        totalPurchaseInvoices: stats.purchase_invoices_count,
        totalSaleInvoices: stats.sale_invoices_count,
        totalProducts: stats.products_count,
        totalPurchases: stats.total_purchases,
        totalSales: stats.total_sales,
        profit: profit,
        profitMargin: profitMargin
      },
      recentActivity: {
        recentPurchases: recentPurchases,
        recentSales: recentSales
      }
    };

    const response: ApiResponse = {
      success: true,
      data: dashboardData,
      message: 'Statistiques du tableau de bord récupérées'
    };

    res.json(response);
  });

  // GET /api/dashboard/charts
  getDashboardCharts = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { period = '30' } = req.query;
    const days = parseInt(period as string);

    // Statistiques par mois pour les 12 derniers mois
    const monthlyStats = await this.db.allQuery(`
      SELECT 
        strftime('%Y-%m', date) as month,
        COUNT(*) as count,
        SUM(total) as total
      FROM (
        SELECT date, total FROM purchase_invoices
        UNION ALL
        SELECT date, total FROM sale_invoices
      )
      WHERE date >= date('now', '-12 months')
      GROUP BY strftime('%Y-%m', date)
      ORDER BY month
    `);

    // Statistiques par statut
    const statusStats = await this.db.allQuery(`
      SELECT 
        'purchase' as type,
        status,
        COUNT(*) as count,
        SUM(total) as total
      FROM purchase_invoices
      GROUP BY status
      UNION ALL
      SELECT 
        'sale' as type,
        status,
        COUNT(*) as count,
        SUM(total) as total
      FROM sale_invoices
      GROUP BY status
    `);

    // Top 5 des fournisseurs par montant
    const topSuppliers = await this.db.allQuery(`
      SELECT 
        s.name,
        COUNT(pi.id) as invoiceCount,
        SUM(pi.total) as totalAmount
      FROM suppliers s
      JOIN purchase_invoices pi ON s.id = pi.supplierId
      GROUP BY s.id, s.name
      ORDER BY totalAmount DESC
      LIMIT 5
    `);

    // Top 5 des clients par montant
    const topClients = await this.db.allQuery(`
      SELECT 
        c.name,
        COUNT(si.id) as invoiceCount,
        SUM(si.total) as totalAmount
      FROM clients c
      JOIN sale_invoices si ON c.id = si.clientId
      GROUP BY c.id, c.name
      ORDER BY totalAmount DESC
      LIMIT 5
    `);

    const chartsData = {
      monthly: monthlyStats,
      status: statusStats,
      topSuppliers: topSuppliers,
      topClients: topClients
    };

    const response: ApiResponse = {
      success: true,
      data: chartsData,
      message: 'Données des graphiques récupérées'
    };

    res.json(response);
  });

  // GET /api/dashboard/health
  getDashboardHealth = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    // Vérifier la santé de la base de données
    const dbHealth = await this.db.getQuery('SELECT 1 as healthy');
    
    // Vérifier les factures en retard
    const overdueInvoices = await this.db.allQuery(`
      SELECT COUNT(*) as count
      FROM (
        SELECT id FROM purchase_invoices 
        WHERE dueDate < date('now') AND status != 'paid'
        UNION ALL
        SELECT id FROM sale_invoices 
        WHERE dueDate < date('now') AND status != 'paid'
      )
    `);

    // Vérifier les produits en rupture
    const lowStockProducts = await this.db.allQuery(`
      SELECT COUNT(*) as count
      FROM products
      WHERE totalQuantity <= 10
    `);

    const healthData = {
      database: {
        status: dbHealth ? 'healthy' : 'unhealthy',
        connected: !!dbHealth
      },
      alerts: {
        overdueInvoices: overdueInvoices[0]?.count || 0,
        lowStockProducts: lowStockProducts[0]?.count || 0
      },
      timestamp: new Date().toISOString()
    };

    const response: ApiResponse = {
      success: true,
      data: healthData,
      message: 'État de santé du système récupéré'
    };

    res.json(response);
  });
}
