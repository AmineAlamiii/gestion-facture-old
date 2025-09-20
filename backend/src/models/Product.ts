import { getDatabase } from '../config/database';
import { Product } from '../types';

export class ProductModel {
  private db = getDatabase();

  async findAll(): Promise<Product[]> {
    const products = await this.db.allQuery(`
      SELECT 
        p.*,
        s.name as supplierName
      FROM products p
      LEFT JOIN suppliers s ON p.supplierId = s.id
      ORDER BY p.description ASC
    `);

    return Promise.all(products.map(product => this.formatProduct(product)));
  }

  async findById(id: string): Promise<Product | null> {
    const product = await this.db.getQuery(`
      SELECT 
        p.*,
        s.name as supplierName
      FROM products p
      LEFT JOIN suppliers s ON p.supplierId = s.id
      WHERE p.id = ?
    `, [id]);

    if (!product) return null;
    return this.formatProduct(product);
  }

  async findByDescription(description: string): Promise<Product | null> {
    const product = await this.db.getQuery(`
      SELECT 
        p.*,
        s.name as supplierName
      FROM products p
      LEFT JOIN suppliers s ON p.supplierId = s.id
      WHERE LOWER(p.description) = LOWER(?)
    `, [description]);

    if (!product) return null;
    return this.formatProduct(product);
  }

  async search(query: string): Promise<Product[]> {
    const products = await this.db.allQuery(`
      SELECT 
        p.*,
        s.name as supplierName
      FROM products p
      LEFT JOIN suppliers s ON p.supplierId = s.id
      WHERE p.description LIKE ? OR s.name LIKE ?
      ORDER BY p.description ASC
    `, [`%${query}%`, `%${query}%`]);

    return Promise.all(products.map(product => this.formatProduct(product)));
  }

  async getLowStock(threshold: number = 10): Promise<Product[]> {
    const products = await this.db.allQuery(`
      SELECT 
        p.*,
        s.name as supplierName
      FROM products p
      LEFT JOIN suppliers s ON p.supplierId = s.id
      WHERE p.totalQuantity <= ?
      ORDER BY p.totalQuantity ASC
    `, [threshold]);

    return Promise.all(products.map(product => this.formatProduct(product)));
  }

  async getStats(): Promise<{
    totalProducts: number;
    totalValue: number;
    lowStockCount: number;
    averagePrice: number;
  }> {
    const stats = await this.db.getQuery(`
      SELECT 
        COUNT(*) as totalProducts,
        COALESCE(SUM(totalQuantity * averageUnitPrice), 0) as totalValue,
        COUNT(CASE WHEN totalQuantity <= 10 THEN 1 END) as lowStockCount,
        COALESCE(AVG(averageUnitPrice), 0) as averagePrice
      FROM products
    `);

    return {
      totalProducts: stats.totalProducts,
      totalValue: stats.totalValue,
      lowStockCount: stats.lowStockCount,
      averagePrice: stats.averagePrice,
    };
  }

  async getStockReport(): Promise<string> {
    const products = await this.findAll();
    const stats = await this.getStats();
    const reportDate = new Date().toLocaleDateString('fr-FR');
    
    let report = `RAPPORT DE STOCK - ${reportDate}\n`;
    report += `${'='.repeat(80)}\n\n`;
    
    report += `Nombre total de produits: ${stats.totalProducts}\n`;
    report += `Valeur totale du stock: ${stats.totalValue.toFixed(2)} €\n`;
    report += `Produits en rupture: ${stats.lowStockCount}\n\n`;
    
    report += `${'PRODUIT'.padEnd(40)} ${'QTÉ'.padStart(8)} ${'PRIX MOY.'.padStart(12)} ${'VALEUR'.padStart(12)}\n`;
    report += `${'-'.repeat(80)}\n`;
    
    products.forEach(product => {
      const value = product.totalQuantity * product.averageUnitPrice;
      report += `${product.description.padEnd(40)} `;
      report += `${product.totalQuantity.toString().padStart(8)} `;
      report += `${product.averageUnitPrice.toFixed(2).padStart(12)} `;
      report += `${value.toFixed(2).padStart(12)}\n`;
    });
    
    report += `${'-'.repeat(80)}\n`;
    report += `${'TOTAL'.padEnd(40)} ${''.padStart(8)} ${''.padStart(12)} ${stats.totalValue.toFixed(2).padStart(12)}\n`;
    
    return report;
  }

  private async formatProduct(product: any): Promise<Product> {
    // Récupérer l'historique des achats
    const purchases = await this.db.allQuery(`
      SELECT 
        pp.invoiceId,
        pp.invoiceNumber,
        pp.quantity,
        pp.unitPrice,
        pp.date
      FROM product_purchases pp
      WHERE pp.productId = ?
      ORDER BY pp.date DESC
    `, [product.id]);

    return {
      id: product.id,
      description: product.description,
      totalQuantity: product.totalQuantity,
      averageUnitPrice: product.averageUnitPrice,
      lastPurchasePrice: product.lastPurchasePrice,
      lastPurchaseDate: product.lastPurchaseDate,
      supplierId: product.supplierId || '',
      supplierName: product.supplierName || '',
      taxRate: product.taxRate,
      purchases: purchases.map(purchase => ({
        invoiceId: purchase.invoiceId,
        invoiceNumber: purchase.invoiceNumber,
        quantity: purchase.quantity,
        unitPrice: purchase.unitPrice,
        date: purchase.date,
      })),
    };
  }
}
