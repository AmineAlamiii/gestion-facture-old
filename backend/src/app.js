const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// Base de données SQLite
const dbPath = process.env.DATABASE_URL || '/app/data/database.sqlite';
const db = new sqlite3.Database(dbPath);

// Initialiser la base de données
function initDatabase() {
  return new Promise((resolve, reject) => {
    // Créer les tables
    db.serialize(() => {
      // Table des fournisseurs
      db.run(`
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
      db.run(`
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
      db.run(`
        CREATE TABLE IF NOT EXISTS purchase_invoices (
          id TEXT PRIMARY KEY,
          invoiceNumber TEXT NOT NULL UNIQUE,
          supplierId TEXT NOT NULL,
          date TEXT NOT NULL,
          dueDate TEXT NOT NULL,
          status TEXT NOT NULL DEFAULT 'pending',
          subtotal REAL NOT NULL,
          taxAmount REAL NOT NULL,
          total REAL NOT NULL,
          notes TEXT,
          createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
          updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (supplierId) REFERENCES suppliers (id)
        )
      `);

      // Table des factures de vente
      db.run(`
        CREATE TABLE IF NOT EXISTS sale_invoices (
          id TEXT PRIMARY KEY,
          invoiceNumber TEXT NOT NULL UNIQUE,
          clientId TEXT NOT NULL,
          date TEXT NOT NULL,
          dueDate TEXT NOT NULL,
          status TEXT NOT NULL DEFAULT 'pending',
          subtotal REAL NOT NULL,
          taxAmount REAL NOT NULL,
          total REAL NOT NULL,
          notes TEXT,
          createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
          updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (clientId) REFERENCES clients (id)
        )
      `);

      // Table des articles de facture
      db.run(`
        CREATE TABLE IF NOT EXISTS invoice_items (
          id TEXT PRIMARY KEY,
          invoiceId TEXT NOT NULL,
          invoiceType TEXT NOT NULL,
          description TEXT NOT NULL,
          quantity INTEGER NOT NULL,
          unitPrice REAL NOT NULL,
          total REAL NOT NULL,
          taxRate REAL NOT NULL DEFAULT 0.2,
          createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Table des produits
      db.run(`
        CREATE TABLE IF NOT EXISTS products (
          id TEXT PRIMARY KEY,
          description TEXT NOT NULL UNIQUE,
          totalQuantity INTEGER NOT NULL DEFAULT 0,
          averageUnitPrice REAL NOT NULL DEFAULT 0,
          lastPurchasePrice REAL NOT NULL DEFAULT 0,
          lastPurchaseDate TEXT,
          supplierId TEXT,
          supplierName TEXT,
          taxRate REAL NOT NULL DEFAULT 0.2,
          createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
          updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Insérer des données de test
      db.get('SELECT COUNT(*) as count FROM suppliers', (err, row) => {
        if (err) {
          console.error('Erreur lors de la vérification des données:', err);
          reject(err);
          return;
        }

        if (row.count === 0) {
          console.log('📝 Insertion des données de test...');
          
          // Insérer des fournisseurs de test
          db.run(`
            INSERT INTO suppliers (id, name, email, phone, address, taxId) VALUES
            ('supplier-1', 'Fournisseur Tech SARL', 'contact@fournisseurtech.fr', '01 23 45 67 89', '123 Rue de la Tech, 75001 Paris', 'FR12345678901'),
            ('supplier-2', 'Matériaux Pro', 'info@materiauxpro.fr', '01 34 56 78 90', '456 Avenue des Matériaux, 69000 Lyon', 'FR23456789012')
          `);

          // Insérer des clients de test
          db.run(`
            INSERT INTO clients (id, name, email, phone, address, taxId) VALUES
            ('client-1', 'Entreprise ABC', 'contact@abc-entreprise.fr', '01 45 67 89 01', '789 Boulevard du Client, 75008 Paris', 'FR34567890123'),
            ('client-2', 'Société XYZ', 'info@xyz-societe.fr', '01 56 78 90 12', '456 Avenue du Commerce, 69000 Lyon', 'FR45678901234')
          `);
        }

        resolve();
      });
    });
  });
}

// Routes API

// Route de santé
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'API fonctionnelle' });
});

// Route pour vérifier si les tables sont vides
app.get('/api/check-tables', (req, res) => {
  const tables = ['suppliers', 'clients', 'purchase_invoices', 'sale_invoices', 'products'];
  const results = {};
  let completed = 0;

  tables.forEach(table => {
    db.get(`SELECT COUNT(*) as count FROM ${table}`, (err, row) => {
      if (err) {
        results[table] = { error: err.message };
      } else {
        results[table] = { count: row.count, isEmpty: row.count === 0 };
      }
      
      completed++;
      if (completed === tables.length) {
        res.json({ success: true, data: results });
      }
    });
  });
});

// Routes des fournisseurs
app.get('/api/suppliers', (req, res) => {
  const search = req.query.search;
  let query = 'SELECT * FROM suppliers';
  let params = [];

  if (search) {
    query += ' WHERE name LIKE ? OR email LIKE ?';
    params = [`%${search}%`, `%${search}%`];
  }

  query += ' ORDER BY createdAt DESC';

  db.all(query, params, (err, rows) => {
    if (err) {
      console.error('Erreur lors de la récupération des fournisseurs:', err);
      res.status(500).json({ success: false, error: 'Erreur interne du serveur' });
      return;
    }
    console.log(`Récupération de ${rows.length} fournisseurs`);
    res.json({ success: true, data: rows });
  });
});

// Route pour récupérer la liste simple des fournisseurs (pour les selects)
app.get('/api/suppliers/list', (req, res) => {
  db.all('SELECT id, name, email FROM suppliers ORDER BY name', (err, rows) => {
    if (err) {
      console.error('Erreur lors de la récupération de la liste des fournisseurs:', err);
      res.status(500).json({ success: false, error: 'Erreur interne du serveur' });
      return;
    }
    res.json({ success: true, data: rows });
  });
});

app.get('/api/suppliers/:id', (req, res) => {
  const { id } = req.params;
  db.get('SELECT * FROM suppliers WHERE id = ?', [id], (err, row) => {
    if (err) {
      console.error('Erreur lors de la récupération du fournisseur:', err);
      res.status(500).json({ success: false, error: 'Erreur interne du serveur' });
      return;
    }
    if (!row) {
      res.status(404).json({ success: false, error: `Fournisseur avec l'ID ${id} non trouvé` });
      return;
    }
    res.json({ success: true, data: row });
  });
});

app.post('/api/suppliers', (req, res) => {
  const { name, email, phone, address, taxId } = req.body;
  const id = 'supplier-' + Date.now();
  
  db.run(
    'INSERT INTO suppliers (id, name, email, phone, address, taxId) VALUES (?, ?, ?, ?, ?, ?)',
    [id, name, email, phone, address, taxId],
    function(err) {
      if (err) {
        res.status(500).json({ success: false, error: err.message });
        return;
      }
      res.json({ success: true, data: { id, name, email, phone, address, taxId } });
    }
  );
});

app.put('/api/suppliers/:id', (req, res) => {
  const { id } = req.params;
  const { name, email, phone, address, taxId } = req.body;
  
  // D'abord vérifier si le fournisseur existe
  db.get('SELECT * FROM suppliers WHERE id = ?', [id], (err, existingSupplier) => {
    if (err) {
      console.error('Erreur lors de la vérification du fournisseur:', err);
      res.status(500).json({ success: false, error: 'Erreur interne du serveur' });
      return;
    }
    
    if (!existingSupplier) {
      res.status(404).json({ success: false, error: `Fournisseur avec l'ID ${id} non trouvé` });
      return;
    }
    
    // Mettre à jour le fournisseur
    db.run(
      'UPDATE suppliers SET name = ?, email = ?, phone = ?, address = ?, taxId = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?',
      [name, email, phone, address, taxId, id],
      function(err) {
        if (err) {
          console.error('Erreur lors de la mise à jour du fournisseur:', err);
          res.status(500).json({ success: false, error: 'Erreur lors de la mise à jour' });
          return;
        }
        
        console.log(`Fournisseur ${id} mis à jour avec succès`);
        res.json({ success: true, data: { id, name, email, phone, address, taxId } });
      }
    );
  });
});

app.delete('/api/suppliers/:id', (req, res) => {
  const { id } = req.params;
  db.run('DELETE FROM suppliers WHERE id = ?', [id], function(err) {
    if (err) {
      res.status(500).json({ success: false, error: err.message });
      return;
    }
    if (this.changes === 0) {
      res.status(404).json({ success: false, error: 'Fournisseur non trouvé' });
      return;
    }
    res.json({ success: true, message: 'Fournisseur supprimé avec succès' });
  });
});

// Routes des clients
app.get('/api/clients', (req, res) => {
  const search = req.query.search;
  let query = 'SELECT * FROM clients';
  let params = [];

  if (search) {
    query += ' WHERE name LIKE ? OR email LIKE ?';
    params = [`%${search}%`, `%${search}%`];
  }

  query += ' ORDER BY createdAt DESC';

  db.all(query, params, (err, rows) => {
    if (err) {
      res.status(500).json({ success: false, error: err.message });
      return;
    }
    res.json({ success: true, data: rows });
  });
});

app.get('/api/clients/:id', (req, res) => {
  const { id } = req.params;
  db.get('SELECT * FROM clients WHERE id = ?', [id], (err, row) => {
    if (err) {
      res.status(500).json({ success: false, error: err.message });
      return;
    }
    if (!row) {
      res.status(404).json({ success: false, error: 'Client non trouvé' });
      return;
    }
    res.json({ success: true, data: row });
  });
});

app.post('/api/clients', (req, res) => {
  const { name, email, phone, address, taxId } = req.body;
  const id = 'client-' + Date.now();
  
  db.run(
    'INSERT INTO clients (id, name, email, phone, address, taxId) VALUES (?, ?, ?, ?, ?, ?)',
    [id, name, email, phone, address, taxId],
    function(err) {
      if (err) {
        res.status(500).json({ success: false, error: err.message });
        return;
      }
      res.json({ success: true, data: { id, name, email, phone, address, taxId } });
    }
  );
});

app.put('/api/clients/:id', (req, res) => {
  const { id } = req.params;
  const { name, email, phone, address, taxId } = req.body;
  
  db.run(
    'UPDATE clients SET name = ?, email = ?, phone = ?, address = ?, taxId = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?',
    [name, email, phone, address, taxId, id],
    function(err) {
      if (err) {
        res.status(500).json({ success: false, error: err.message });
        return;
      }
      if (this.changes === 0) {
        res.status(404).json({ success: false, error: 'Client non trouvé' });
        return;
      }
      res.json({ success: true, data: { id, name, email, phone, address, taxId } });
    }
  );
});

app.delete('/api/clients/:id', (req, res) => {
  const { id } = req.params;
  db.run('DELETE FROM clients WHERE id = ?', [id], function(err) {
    if (err) {
      res.status(500).json({ success: false, error: err.message });
      return;
    }
    if (this.changes === 0) {
      res.status(404).json({ success: false, error: 'Client non trouvé' });
      return;
    }
    res.json({ success: true, message: 'Client supprimé avec succès' });
  });
});

// Routes des factures d'achat
app.get('/api/invoices/purchases', (req, res) => {
  const status = req.query.status;
  const search = req.query.search;
  let query = `
    SELECT pi.*, s.name as supplierName, s.email as supplierEmail 
    FROM purchase_invoices pi 
    LEFT JOIN suppliers s ON pi.supplierId = s.id
  `;
  let params = [];

  if (status || search) {
    query += ' WHERE ';
    const conditions = [];
    
    if (status) {
      conditions.push('pi.status = ?');
      params.push(status);
    }
    
    if (search) {
      conditions.push('(pi.invoiceNumber LIKE ? OR s.name LIKE ?)');
      params.push(`%${search}%`, `%${search}%`);
    }
    
    query += conditions.join(' AND ');
  }

  query += ' ORDER BY pi.createdAt DESC';

  db.all(query, params, (err, rows) => {
    if (err) {
      res.status(500).json({ success: false, error: err.message });
      return;
    }
    
    // Transformer les données pour inclure un objet supplier
    const transformedRows = rows.map(row => ({
      ...row,
      supplier: row.supplierName ? {
        id: row.supplierId,
        name: row.supplierName,
        email: row.supplierEmail
      } : null
    }));
    
    res.json({ success: true, data: transformedRows });
  });
});

app.get('/api/invoices/purchases/:id', (req, res) => {
  const { id } = req.params;
  
  // Récupérer la facture avec les informations du fournisseur
  db.get(`
    SELECT pi.*, s.name as supplierName, s.email as supplierEmail, s.phone as supplierPhone, s.address as supplierAddress, s.taxId as supplierTaxId
    FROM purchase_invoices pi 
    LEFT JOIN suppliers s ON pi.supplierId = s.id
    WHERE pi.id = ?
  `, [id], (err, invoice) => {
    if (err) {
      res.status(500).json({ success: false, error: err.message });
      return;
    }
    
    if (!invoice) {
      res.status(404).json({ success: false, error: 'Facture d\'achat non trouvée' });
      return;
    }

    // Récupérer les articles de la facture
    db.all('SELECT * FROM invoice_items WHERE invoiceId = ? AND invoiceType = ?', [id, 'purchase'], (err, items) => {
      if (err) {
        res.status(500).json({ success: false, error: err.message });
        return;
      }

      // Construire l'objet fournisseur
      const supplier = {
        id: invoice.supplierId,
        name: invoice.supplierName,
        email: invoice.supplierEmail,
        phone: invoice.supplierPhone,
        address: invoice.supplierAddress,
        taxId: invoice.supplierTaxId
      };

      res.json({ 
        success: true, 
        data: { 
          ...invoice, 
          supplier, 
          items 
        } 
      });
    });
  });
});

app.post('/api/invoices/purchases', (req, res) => {
  const { invoiceNumber, supplier, date, dueDate, status, items, notes } = req.body;
  const id = 'purchase-' + Date.now();
  
  // Extraire l'ID du fournisseur (peut être un objet ou un string)
  const supplierId = typeof supplier === 'object' ? supplier.id : supplier;
  const supplierName = typeof supplier === 'object' ? supplier.name : null;
  
  // Validation
  if (!supplierId) {
    res.status(400).json({ success: false, error: 'ID du fournisseur requis' });
    return;
  }
  
  // Calculer les totaux
  const subtotal = items.reduce((sum, item) => sum + item.total, 0);
  const taxAmount = items.reduce((sum, item) => sum + (item.total * item.taxRate), 0);
  const total = subtotal + taxAmount;

  db.serialize(() => {
    // Insérer la facture
    db.run(
      'INSERT INTO purchase_invoices (id, invoiceNumber, supplierId, date, dueDate, status, subtotal, taxAmount, total, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [id, invoiceNumber, supplierId, date, dueDate, status, subtotal, taxAmount, total, notes],
      function(err) {
        if (err) {
          res.status(500).json({ success: false, error: err.message });
          return;
        }

        // Insérer les articles
        const stmt = db.prepare('INSERT INTO invoice_items (id, invoiceId, invoiceType, description, quantity, unitPrice, total, taxRate) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');
        
        items.forEach(item => {
          const itemId = 'item-' + Date.now() + '-' + Math.random();
          stmt.run([itemId, id, 'purchase', item.description, item.quantity, item.unitPrice, item.total, item.taxRate]);
          
          // Générer/mettre à jour le produit dans la table products
          db.get('SELECT * FROM products WHERE description = ?', [item.description], (err, existingProduct) => {
            if (err) {
              console.error('Erreur lors de la vérification du produit:', err);
              return;
            }
            
            if (existingProduct) {
              // Mettre à jour le produit existant
              const newTotalQuantity = existingProduct.totalQuantity + item.quantity;
              const newAveragePrice = ((existingProduct.averageUnitPrice * existingProduct.totalQuantity) + (item.unitPrice * item.quantity)) / newTotalQuantity;
              
              db.run(
                'UPDATE products SET totalQuantity = ?, averageUnitPrice = ?, lastPurchasePrice = ?, lastPurchaseDate = ?, supplierId = ?, supplierName = ?, taxRate = ? WHERE description = ?',
                [newTotalQuantity, newAveragePrice, item.unitPrice, date, supplierId, supplierName, item.taxRate, item.description],
                (err) => {
                  if (err) {
                    console.error('Erreur lors de la mise à jour du produit:', err);
                  } else {
                    console.log(`Produit "${item.description}" mis à jour: quantité +${item.quantity}`);
                  }
                }
              );
            } else {
              // Créer un nouveau produit
              const productId = 'product-' + Date.now() + '-' + Math.random();
              db.run(
                'INSERT INTO products (id, description, totalQuantity, averageUnitPrice, lastPurchasePrice, lastPurchaseDate, supplierId, supplierName, taxRate) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
                [productId, item.description, item.quantity, item.unitPrice, item.unitPrice, date, supplierId, supplierName, item.taxRate],
                (err) => {
                  if (err) {
                    console.error('Erreur lors de la création du produit:', err);
                  } else {
                    console.log(`Nouveau produit créé: "${item.description}" (quantité: ${item.quantity})`);
                  }
                }
              );
            }
          });
        });
        
        stmt.finalize();

        res.json({ success: true, data: { id, invoiceNumber, supplierId, date, dueDate, status, subtotal, taxAmount, total, notes, items } });
      }
    );
  });
});

// Route pour supprimer une facture d'achat
app.delete('/api/invoices/purchases/:id', (req, res) => {
  const { id } = req.params;
  
  db.serialize(() => {
    // D'abord, récupérer les articles pour mettre à jour le stock des produits
    db.all('SELECT * FROM invoice_items WHERE invoiceId = ? AND invoiceType = ?', [id, 'purchase'], (err, items) => {
      if (err) {
        res.status(500).json({ success: false, error: err.message });
        return;
      }
      
      // Mettre à jour le stock des produits (diminuer les quantités)
      items.forEach(item => {
        db.get('SELECT * FROM products WHERE description = ?', [item.description], (err, product) => {
          if (err) {
            console.error('Erreur lors de la récupération du produit:', err);
            return;
          }
          
          if (product) {
            const newQuantity = Math.max(0, product.totalQuantity - item.quantity);
            
            if (newQuantity === 0) {
              // Supprimer le produit si la quantité devient 0
              db.run('DELETE FROM products WHERE description = ?', [item.description], (err) => {
                if (err) {
                  console.error('Erreur lors de la suppression du produit:', err);
                } else {
                  console.log(`Produit "${item.description}" supprimé (stock à zéro)`);
                }
              });
            } else {
              // Mettre à jour la quantité
              db.run('UPDATE products SET totalQuantity = ? WHERE description = ?', [newQuantity, item.description], (err) => {
                if (err) {
                  console.error('Erreur lors de la mise à jour du produit:', err);
                } else {
                  console.log(`Produit "${item.description}" mis à jour: quantité -${item.quantity}`);
                }
              });
            }
          }
        });
      });
      
      // Supprimer les articles de la facture
      db.run('DELETE FROM invoice_items WHERE invoiceId = ? AND invoiceType = ?', [id, 'purchase'], (err) => {
        if (err) {
          res.status(500).json({ success: false, error: err.message });
          return;
        }
        
        // Supprimer la facture
        db.run('DELETE FROM purchase_invoices WHERE id = ?', [id], function(err) {
          if (err) {
            res.status(500).json({ success: false, error: err.message });
            return;
          }
          
          if (this.changes === 0) {
            res.status(404).json({ success: false, error: 'Facture d\'achat non trouvée' });
            return;
          }
          
          console.log(`Facture d'achat ${id} supprimée avec succès`);
          res.json({ success: true, message: 'Facture d\'achat supprimée avec succès' });
        });
      });
    });
  });
});

// Routes des factures de vente
app.get('/api/invoices/sales', (req, res) => {
  const status = req.query.status;
  const search = req.query.search;
  let query = `
    SELECT si.*, c.name as clientName, c.email as clientEmail 
    FROM sale_invoices si 
    LEFT JOIN clients c ON si.clientId = c.id
  `;
  let params = [];

  if (status || search) {
    query += ' WHERE ';
    const conditions = [];
    
    if (status) {
      conditions.push('si.status = ?');
      params.push(status);
    }
    
    if (search) {
      conditions.push('(si.invoiceNumber LIKE ? OR c.name LIKE ?)');
      params.push(`%${search}%`, `%${search}%`);
    }
    
    query += conditions.join(' AND ');
  }

  query += ' ORDER BY si.createdAt DESC';

  db.all(query, params, (err, rows) => {
    if (err) {
      res.status(500).json({ success: false, error: err.message });
      return;
    }
    
    // Transformer les données pour inclure un objet client
    const transformedRows = rows.map(row => ({
      ...row,
      client: row.clientName ? {
        id: row.clientId,
        name: row.clientName,
        email: row.clientEmail
      } : null
    }));
    
    res.json({ success: true, data: transformedRows });
  });
});

app.get('/api/invoices/sales/:id', (req, res) => {
  const { id } = req.params;
  
  // Récupérer la facture avec les informations du client
  db.get(`
    SELECT si.*, c.name as clientName, c.email as clientEmail, c.phone as clientPhone, c.address as clientAddress, c.taxId as clientTaxId
    FROM sale_invoices si 
    LEFT JOIN clients c ON si.clientId = c.id
    WHERE si.id = ?
  `, [id], (err, invoice) => {
    if (err) {
      res.status(500).json({ success: false, error: err.message });
      return;
    }
    
    if (!invoice) {
      res.status(404).json({ success: false, error: 'Facture de vente non trouvée' });
      return;
    }

    // Récupérer les articles de la facture
    db.all('SELECT * FROM invoice_items WHERE invoiceId = ? AND invoiceType = ?', [id, 'sale'], (err, items) => {
      if (err) {
        res.status(500).json({ success: false, error: err.message });
        return;
      }

      // Construire l'objet client
      const client = {
        id: invoice.clientId,
        name: invoice.clientName,
        email: invoice.clientEmail,
        phone: invoice.clientPhone,
        address: invoice.clientAddress,
        taxId: invoice.clientTaxId
      };

      res.json({ 
        success: true, 
        data: { 
          ...invoice, 
          client, 
          items 
        } 
      });
    });
  });
});

app.post('/api/invoices/sales', (req, res) => {
  const { invoiceNumber, client, date, dueDate, status, items, notes } = req.body;
  const id = 'sale-' + Date.now();
  
  // Extraire l'ID du client (peut être un objet ou un string)
  const clientId = typeof client === 'object' ? client.id : client;
  
  // Validation
  if (!clientId) {
    res.status(400).json({ success: false, error: 'ID du client requis' });
    return;
  }
  
  // Calculer les totaux
  const subtotal = items.reduce((sum, item) => sum + item.total, 0);
  const taxAmount = items.reduce((sum, item) => sum + (item.total * item.taxRate), 0);
  const total = subtotal + taxAmount;

  db.serialize(() => {
    // Insérer la facture
    db.run(
      'INSERT INTO sale_invoices (id, invoiceNumber, clientId, date, dueDate, status, subtotal, taxAmount, total, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [id, invoiceNumber, clientId, date, dueDate, status, subtotal, taxAmount, total, notes],
      function(err) {
        if (err) {
          res.status(500).json({ success: false, error: err.message });
          return;
        }

        // Insérer les articles
        const stmt = db.prepare('INSERT INTO invoice_items (id, invoiceId, invoiceType, description, quantity, unitPrice, total, taxRate) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');
        
        items.forEach(item => {
          const itemId = 'item-' + Date.now() + '-' + Math.random();
          stmt.run([itemId, id, 'sale', item.description, item.quantity, item.unitPrice, item.total, item.taxRate]);
        });
        
        stmt.finalize();

        res.json({ success: true, data: { id, invoiceNumber, clientId, date, dueDate, status, subtotal, taxAmount, total, notes, items } });
      }
    );
  });
});

// Route pour supprimer une facture de vente
app.delete('/api/invoices/sales/:id', (req, res) => {
  const { id } = req.params;
  
  db.serialize(() => {
    // D'abord, récupérer les articles pour mettre à jour le stock des produits
    db.all('SELECT * FROM invoice_items WHERE invoiceId = ? AND invoiceType = ?', [id, 'sale'], (err, items) => {
      if (err) {
        res.status(500).json({ success: false, error: err.message });
        return;
      }
      
      // Mettre à jour le stock des produits (augmenter les quantités car on annule une vente)
      items.forEach(item => {
        db.get('SELECT * FROM products WHERE description = ?', [item.description], (err, product) => {
          if (err) {
            console.error('Erreur lors de la récupération du produit:', err);
            return;
          }
          
          if (product) {
            const newQuantity = product.totalQuantity + item.quantity;
            
            // Mettre à jour la quantité
            db.run('UPDATE products SET totalQuantity = ? WHERE description = ?', [newQuantity, item.description], (err) => {
              if (err) {
                console.error('Erreur lors de la mise à jour du produit:', err);
              } else {
                console.log(`Produit "${item.description}" mis à jour: quantité +${item.quantity} (annulation vente)`);
              }
            });
          }
        });
      });
      
      // Supprimer les articles de la facture
      db.run('DELETE FROM invoice_items WHERE invoiceId = ? AND invoiceType = ?', [id, 'sale'], (err) => {
        if (err) {
          res.status(500).json({ success: false, error: err.message });
          return;
        }
        
        // Supprimer la facture
        db.run('DELETE FROM sale_invoices WHERE id = ?', [id], function(err) {
          if (err) {
            res.status(500).json({ success: false, error: err.message });
            return;
          }
          
          if (this.changes === 0) {
            res.status(404).json({ success: false, error: 'Facture de vente non trouvée' });
            return;
          }
          
          console.log(`Facture de vente ${id} supprimée avec succès`);
          res.json({ success: true, message: 'Facture de vente supprimée avec succès' });
        });
      });
    });
  });
});

// Routes des produits
app.get('/api/products', (req, res) => {
  const search = req.query.search;
  let query = 'SELECT * FROM products';
  let params = [];

  if (search) {
    query += ' WHERE description LIKE ?';
    params = [`%${search}%`];
  }

  query += ' ORDER BY description';

  db.all(query, params, (err, rows) => {
    if (err) {
      res.status(500).json({ success: false, error: err.message });
      return;
    }
    res.json({ success: true, data: rows });
  });
});

// Route du tableau de bord
app.get('/api/dashboard/stats', (req, res) => {
  const query = `
    SELECT 
      (SELECT COUNT(*) FROM suppliers) as totalSuppliers,
      (SELECT COUNT(*) FROM clients) as totalClients,
      (SELECT COUNT(*) FROM purchase_invoices) as totalPurchaseInvoices,
      (SELECT COUNT(*) FROM sale_invoices) as totalSaleInvoices,
      (SELECT COUNT(*) FROM products) as totalProducts,
      (SELECT COALESCE(SUM(total), 0) FROM purchase_invoices) as totalPurchases,
      (SELECT COALESCE(SUM(total), 0) FROM sale_invoices) as totalSales
  `;

  db.get(query, (err, row) => {
    if (err) {
      res.status(500).json({ success: false, error: err.message });
      return;
    }
    
    const profit = row.totalSales - row.totalPurchases;
    const profitMargin = row.totalSales > 0 ? (profit / row.totalSales) * 100 : 0;

    res.json({
      success: true,
      data: {
        overview: {
          totalSuppliers: row.totalSuppliers,
          totalClients: row.totalClients,
          totalPurchaseInvoices: row.totalPurchaseInvoices,
          totalSaleInvoices: row.totalSaleInvoices,
          totalProducts: row.totalProducts,
          totalPurchases: row.totalPurchases,
          totalSales: row.totalSales,
          profit: profit,
          profitMargin: profitMargin
        }
      }
    });
  });
});

// Gestion des erreurs
app.use((err, req, res, next) => {
  console.error('Erreur:', err);
  res.status(500).json({ success: false, error: 'Erreur interne du serveur' });
});

// Route 404
app.use('*', (req, res) => {
  res.status(404).json({ success: false, error: 'Route non trouvée' });
});

// Démarrer le serveur
async function startServer() {
  try {
    console.log('🔄 Initialisation de la base de données...');
    await initDatabase();
    console.log('✅ Base de données initialisée avec succès');

    app.listen(PORT, () => {
      console.log('🚀 Serveur démarré avec succès!');
      console.log(`📡 API disponible sur: http://localhost:${PORT}/api`);
      console.log(`🌍 Environnement: ${process.env.NODE_ENV || 'development'}`);
      console.log(`📊 Base de données: ${dbPath}`);
      console.log(`🔗 CORS autorisé pour: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
    });
  } catch (error) {
    console.error('❌ Erreur lors du démarrage du serveur:', error);
    process.exit(1);
  }
}

// Gestion gracieuse de l'arrêt
process.on('SIGINT', () => {
  console.log('\n🛑 Arrêt du serveur...');
  db.close((err) => {
    if (err) {
      console.error('Erreur lors de la fermeture de la base de données:', err);
    } else {
      console.log('✅ Base de données fermée');
    }
    process.exit(0);
  });
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Arrêt du serveur...');
  db.close((err) => {
    if (err) {
      console.error('Erreur lors de la fermeture de la base de données:', err);
    } else {
      console.log('✅ Base de données fermée');
    }
    process.exit(0);
  });
});

startServer();
