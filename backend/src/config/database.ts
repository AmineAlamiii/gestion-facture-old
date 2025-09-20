import sqlite3 from 'sqlite3';
import { promisify } from 'util';
import path from 'path';
import fs from 'fs';

export class Database {
  private db: sqlite3.Database;
  private dbPath: string;

  constructor(dbPath: string = './database.sqlite') {
    this.dbPath = dbPath;
    this.db = new sqlite3.Database(dbPath);
    
    // Promisify database methods after db initialization
    this.run = promisify(this.db.run.bind(this.db));
    this.get = promisify(this.db.get.bind(this.db));
    this.all = promisify(this.db.all.bind(this.db));
  }

  // Promisify database methods
  private run: any;
  private get: any;
  private all: any;

  async initialize(): Promise<void> {
    try {
      // Créer les tables
      await this.createTables();
      console.log('✅ Base de données initialisée avec succès');
    } catch (error) {
      console.error('❌ Erreur lors de l\'initialisation de la base de données:', error);
      throw error;
    }
  }

  private async createTables(): Promise<void> {
    // Table des fournisseurs
    await this.run(`
      CREATE TABLE IF NOT EXISTS suppliers (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        phone TEXT NOT NULL,
        address TEXT NOT NULL,
        taxId TEXT,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Table des clients
    await this.run(`
      CREATE TABLE IF NOT EXISTS clients (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        phone TEXT NOT NULL,
        address TEXT NOT NULL,
        taxId TEXT,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Table des factures d'achat
    await this.run(`
      CREATE TABLE IF NOT EXISTS purchase_invoices (
        id TEXT PRIMARY KEY,
        invoiceNumber TEXT NOT NULL UNIQUE,
        supplierId TEXT NOT NULL,
        date TEXT NOT NULL,
        dueDate TEXT NOT NULL,
        subtotal REAL NOT NULL,
        taxAmount REAL NOT NULL,
        total REAL NOT NULL,
        status TEXT NOT NULL DEFAULT 'pending',
        notes TEXT,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (supplierId) REFERENCES suppliers (id)
      )
    `);

    // Table des factures de vente
    await this.run(`
      CREATE TABLE IF NOT EXISTS sale_invoices (
        id TEXT PRIMARY KEY,
        invoiceNumber TEXT NOT NULL UNIQUE,
        clientId TEXT NOT NULL,
        date TEXT NOT NULL,
        dueDate TEXT NOT NULL,
        subtotal REAL NOT NULL,
        taxAmount REAL NOT NULL,
        total REAL NOT NULL,
        status TEXT NOT NULL DEFAULT 'draft',
        notes TEXT,
        basedOnPurchase TEXT,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (clientId) REFERENCES clients (id),
        FOREIGN KEY (basedOnPurchase) REFERENCES purchase_invoices (id)
      )
    `);

    // Table des articles de facture
    await this.run(`
      CREATE TABLE IF NOT EXISTS invoice_items (
        id TEXT PRIMARY KEY,
        invoiceId TEXT NOT NULL,
        invoiceType TEXT NOT NULL CHECK (invoiceType IN ('purchase', 'sale')),
        description TEXT NOT NULL,
        quantity REAL NOT NULL,
        unitPrice REAL NOT NULL,
        total REAL NOT NULL,
        taxRate REAL NOT NULL DEFAULT 20,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (invoiceId) REFERENCES purchase_invoices (id) OR FOREIGN KEY (invoiceId) REFERENCES sale_invoices (id)
      )
    `);

    // Table des produits (générés automatiquement)
    await this.run(`
      CREATE TABLE IF NOT EXISTS products (
        id TEXT PRIMARY KEY,
        description TEXT NOT NULL UNIQUE,
        totalQuantity REAL NOT NULL DEFAULT 0,
        averageUnitPrice REAL NOT NULL DEFAULT 0,
        lastPurchasePrice REAL NOT NULL DEFAULT 0,
        lastPurchaseDate TEXT,
        supplierId TEXT,
        supplierName TEXT,
        taxRate REAL NOT NULL DEFAULT 20,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (supplierId) REFERENCES suppliers (id)
      )
    `);

    // Table des achats de produits (historique)
    await this.run(`
      CREATE TABLE IF NOT EXISTS product_purchases (
        id TEXT PRIMARY KEY,
        productId TEXT NOT NULL,
        invoiceId TEXT NOT NULL,
        invoiceNumber TEXT NOT NULL,
        quantity REAL NOT NULL,
        unitPrice REAL NOT NULL,
        date TEXT NOT NULL,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (productId) REFERENCES products (id),
        FOREIGN KEY (invoiceId) REFERENCES purchase_invoices (id)
      )
    `);

    // Créer des index pour améliorer les performances
    await this.run(`CREATE INDEX IF NOT EXISTS idx_suppliers_email ON suppliers (email)`);
    await this.run(`CREATE INDEX IF NOT EXISTS idx_clients_email ON clients (email)`);
    await this.run(`CREATE INDEX IF NOT EXISTS idx_purchase_invoices_supplier ON purchase_invoices (supplierId)`);
    await this.run(`CREATE INDEX IF NOT EXISTS idx_sale_invoices_client ON sale_invoices (clientId)`);
    await this.run(`CREATE INDEX IF NOT EXISTS idx_invoice_items_invoice ON invoice_items (invoiceId)`);
    await this.run(`CREATE INDEX IF NOT EXISTS idx_products_description ON products (description)`);
    await this.run(`CREATE INDEX IF NOT EXISTS idx_product_purchases_product ON product_purchases (productId)`);

    // Insérer des données de test si la base est vide
    await this.insertTestData();
  }

  private async insertTestData(): Promise<void> {
    // Vérifier si des données existent déjà
    const supplierCount = await this.get('SELECT COUNT(*) as count FROM suppliers') as { count: number };
    if (supplierCount.count > 0) return;

    console.log('📝 Insertion des données de test...');

    // Insérer des fournisseurs de test
    await this.run(`
      INSERT INTO suppliers (id, name, email, phone, address, taxId) VALUES
      ('supplier-1', 'Fournisseur Tech SARL', 'contact@fournisseurtech.fr', '01 23 45 67 89', '123 Rue de la Tech, 75001 Paris', 'FR12345678901'),
      ('supplier-2', 'Matériaux Pro', 'info@materiauxpro.fr', '01 34 56 78 90', '456 Avenue des Matériaux, 69000 Lyon', 'FR23456789012')
    `);

    // Insérer des clients de test
    await this.run(`
      INSERT INTO clients (id, name, email, phone, address, taxId) VALUES
      ('client-1', 'Entreprise ABC', 'contact@abc-entreprise.fr', '01 45 67 89 01', '789 Boulevard du Client, 75008 Paris', 'FR34567890123'),
      ('client-2', 'Société XYZ', 'info@xyz-societe.fr', '01 56 78 90 12', '456 Avenue du Commerce, 69000 Lyon', 'FR45678901234')
    `);
  }

  // Méthodes publiques pour les opérations CRUD
  async runQuery(sql: string, params: any[] = []): Promise<any> {
    return this.run(sql, params);
  }

  async getQuery(sql: string, params: any[] = []): Promise<any> {
    return this.get(sql, params);
  }

  async allQuery(sql: string, params: any[] = []): Promise<any[]> {
    return this.all(sql, params);
  }

  async close(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.close((err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  // Méthode pour obtenir les statistiques de la base de données
  async getStats(): Promise<any> {
    const stats = await this.all(`
      SELECT 
        (SELECT COUNT(*) FROM suppliers) as suppliers_count,
        (SELECT COUNT(*) FROM clients) as clients_count,
        (SELECT COUNT(*) FROM purchase_invoices) as purchase_invoices_count,
        (SELECT COUNT(*) FROM sale_invoices) as sale_invoices_count,
        (SELECT COUNT(*) FROM products) as products_count,
        (SELECT COALESCE(SUM(total), 0) FROM purchase_invoices) as total_purchases,
        (SELECT COALESCE(SUM(total), 0) FROM sale_invoices) as total_sales
    `) as any[];
    return stats[0];
  }
}

// Instance singleton
let databaseInstance: Database | null = null;

export const getDatabase = (dbPath?: string): Database => {
  if (!databaseInstance) {
    databaseInstance = new Database(dbPath);
  }
  return databaseInstance;
};
