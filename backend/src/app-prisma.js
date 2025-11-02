const express = require('express');
const cors = require('cors');
const prisma = require('./lib/prisma');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// Fonction pour initialiser les données de test
async function initTestData() {
  try {
    // Vérifier si des données existent déjà
    const supplierCount = await prisma.supplier.count();
    
    if (supplierCount === 0) {
      console.log('📝 Insertion des données de test...');
      
      // Insérer des fournisseurs de test
      await prisma.supplier.createMany({
        data: [
          {
            id: 'supplier-1',
            name: 'Fournisseur Tech SARL',
            email: 'contact@fournisseurtech.fr',
            phone: '01 23 45 67 89',
            address: '123 Rue de la Tech, 75001 Paris',
            taxId: 'FR12345678901'
          },
          {
            id: 'supplier-2',
            name: 'Matériaux Pro',
            email: 'info@materiauxpro.fr',
            phone: '01 34 56 78 90',
            address: '456 Avenue des Matériaux, 69000 Lyon',
            taxId: 'FR23456789012'
          }
        ]
      });

      // Insérer des clients de test
      await prisma.client.createMany({
        data: [
          {
            id: 'client-1',
            name: 'Entreprise ABC',
            email: 'contact@abc-entreprise.fr',
            phone: '01 45 67 89 01',
            address: '789 Boulevard du Client, 75008 Paris',
            taxId: 'FR34567890123'
          },
          {
            id: 'client-2',
            name: 'Société XYZ',
            email: 'info@xyz-societe.fr',
            phone: '01 56 78 90 12',
            address: '456 Avenue du Commerce, 69000 Lyon',
            taxId: 'FR45678901234'
          }
        ]
      });

      console.log('✅ Données de test insérées avec succès');
    }
  } catch (error) {
    console.error('❌ Erreur lors de l\'insertion des données de test:', error);
  }
}

// Routes API

// Route de santé
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'API fonctionnelle avec Prisma' });
});

// Route pour vérifier les tables
app.get('/api/check-tables', async (req, res) => {
  try {
    const results = {
      suppliers: { count: await prisma.supplier.count() },
      clients: { count: await prisma.client.count() },
      purchaseInvoices: { count: await prisma.purchaseInvoice.count() },
      saleInvoices: { count: await prisma.saleInvoice.count() },
      products: { count: await prisma.product.count() }
    };

    res.json({ success: true, data: results });
  } catch (error) {
    console.error('Erreur lors de la vérification des tables:', error);
    res.status(500).json({ success: false, error: 'Erreur interne du serveur' });
  }
});

// Routes des fournisseurs
app.get('/api/suppliers', async (req, res) => {
  try {
    const { search } = req.query;
    
    const suppliers = await prisma.supplier.findMany({
      where: search ? {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } }
        ]
      } : {},
      orderBy: { createdAt: 'desc' }
    });

    console.log(`Récupération de ${suppliers.length} fournisseurs`);
    res.json({ success: true, data: suppliers });
  } catch (error) {
    console.error('Erreur lors de la récupération des fournisseurs:', error);
    res.status(500).json({ success: false, error: 'Erreur interne du serveur' });
  }
});

// Route pour récupérer la liste simple des fournisseurs
app.get('/api/suppliers/list', async (req, res) => {
  try {
    const suppliers = await prisma.supplier.findMany({
      select: { id: true, name: true, email: true },
      orderBy: { name: 'asc' }
    });

    res.json({ success: true, data: suppliers });
  } catch (error) {
    console.error('Erreur lors de la récupération de la liste des fournisseurs:', error);
    res.status(500).json({ success: false, error: 'Erreur interne du serveur' });
  }
});

app.get('/api/suppliers/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const supplier = await prisma.supplier.findUnique({
      where: { id }
    });

    if (!supplier) {
      res.status(404).json({ success: false, error: `Fournisseur avec l'ID ${id} non trouvé` });
      return;
    }

    res.json({ success: true, data: supplier });
  } catch (error) {
    console.error('Erreur lors de la récupération du fournisseur:', error);
    res.status(500).json({ success: false, error: 'Erreur interne du serveur' });
  }
});

app.post('/api/suppliers', async (req, res) => {
  try {
    const { name, email, phone, address, taxId } = req.body;
    
    const supplier = await prisma.supplier.create({
      data: {
        name,
        email,
        phone,
        address,
        taxId
      }
    });

    res.json({ success: true, data: supplier });
  } catch (error) {
    console.error('Erreur lors de la création du fournisseur:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.put('/api/suppliers/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone, address, taxId } = req.body;
    
    const supplier = await prisma.supplier.update({
      where: { id },
      data: {
        name,
        email,
        phone,
        address,
        taxId
      }
    });

    console.log(`Fournisseur ${id} mis à jour avec succès`);
    res.json({ success: true, data: supplier });
  } catch (error) {
    if (error.code === 'P2025') {
      res.status(404).json({ success: false, error: `Fournisseur avec l'ID ${req.params.id} non trouvé` });
    } else {
      console.error('Erreur lors de la mise à jour du fournisseur:', error);
      res.status(500).json({ success: false, error: 'Erreur lors de la mise à jour' });
    }
  }
});

app.delete('/api/suppliers/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    await prisma.supplier.delete({
      where: { id }
    });

    res.json({ success: true, message: 'Fournisseur supprimé avec succès' });
  } catch (error) {
    if (error.code === 'P2025') {
      res.status(404).json({ success: false, error: 'Fournisseur non trouvé' });
    } else {
      console.error('Erreur lors de la suppression du fournisseur:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  }
});

// Routes des clients
app.get('/api/clients', async (req, res) => {
  try {
    const { search } = req.query;
    
    const clients = await prisma.client.findMany({
      where: search ? {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } }
        ]
      } : {},
      orderBy: { createdAt: 'desc' }
    });

    res.json({ success: true, data: clients });
  } catch (error) {
    console.error('Erreur lors de la récupération des clients:', error);
    res.status(500).json({ success: false, error: 'Erreur interne du serveur' });
  }
});

app.get('/api/clients/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const client = await prisma.client.findUnique({
      where: { id }
    });

    if (!client) {
      res.status(404).json({ success: false, error: 'Client non trouvé' });
      return;
    }

    res.json({ success: true, data: client });
  } catch (error) {
    console.error('Erreur lors de la récupération du client:', error);
    res.status(500).json({ success: false, error: 'Erreur interne du serveur' });
  }
});

app.post('/api/clients', async (req, res) => {
  try {
    const { name, email, phone, address, taxId } = req.body;
    
    const client = await prisma.client.create({
      data: {
        name,
        email,
        phone,
        address,
        taxId
      }
    });

    res.json({ success: true, data: client });
  } catch (error) {
    console.error('Erreur lors de la création du client:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.put('/api/clients/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone, address, taxId } = req.body;
    
    const client = await prisma.client.update({
      where: { id },
      data: {
        name,
        email,
        phone,
        address,
        taxId
      }
    });

    res.json({ success: true, data: client });
  } catch (error) {
    if (error.code === 'P2025') {
      res.status(404).json({ success: false, error: 'Client non trouvé' });
    } else {
      console.error('Erreur lors de la mise à jour du client:', error);
      res.status(500).json({ success: false, error: 'Erreur lors de la mise à jour' });
    }
  }
});

app.delete('/api/clients/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    await prisma.client.delete({
      where: { id }
    });

    res.json({ success: true, message: 'Client supprimé avec succès' });
  } catch (error) {
    if (error.code === 'P2025') {
      res.status(404).json({ success: false, error: 'Client non trouvé' });
    } else {
      console.error('Erreur lors de la suppression du client:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  }
});

// Routes des factures d'achat
app.get('/api/invoices/purchases', async (req, res) => {
  try {
    const { status, search } = req.query;
    
    const where = {};
    if (status) where.status = status;
    if (search) {
      where.OR = [
        { invoiceNumber: { contains: search, mode: 'insensitive' } },
        { supplier: { name: { contains: search, mode: 'insensitive' } } }
      ];
    }

    const invoices = await prisma.purchaseInvoice.findMany({
      where,
      include: {
        supplier: {
          select: { id: true, name: true, email: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    // Transformer les données pour inclure un objet supplier
    const transformedInvoices = invoices.map(invoice => ({
      ...invoice,
      supplier: invoice.supplier ? {
        id: invoice.supplier.id,
        name: invoice.supplier.name,
        email: invoice.supplier.email
      } : null
    }));

    res.json({ success: true, data: transformedInvoices });
  } catch (error) {
    console.error('Erreur lors de la récupération des factures d\'achat:', error);
    res.status(500).json({ success: false, error: 'Erreur interne du serveur' });
  }
});

app.get('/api/invoices/purchases/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const invoice = await prisma.purchaseInvoice.findUnique({
      where: { id },
      include: {
        supplier: true
      }
    });

    if (!invoice) {
      res.status(404).json({ success: false, error: 'Facture d\'achat non trouvée' });
      return;
    }

    // Récupérer les articles de la facture
    const items = await prisma.invoiceItem.findMany({
      where: {
        invoiceId: id,
        invoiceType: 'purchase'
      }
    });

    // Ajouter les articles à la facture
    invoice.items = items;

    res.json({ success: true, data: invoice });
  } catch (error) {
    console.error('Erreur lors de la récupération de la facture d\'achat:', error);
    res.status(500).json({ success: false, error: 'Erreur interne du serveur' });
  }
});

app.post('/api/invoices/purchases', async (req, res) => {
  try {
    const { invoiceNumber, supplier, supplierId: directSupplierId, date, dueDate, status, items, notes } = req.body;
    
    // Extraire l'ID du fournisseur (accepter plusieurs formats)
    const supplierId = directSupplierId || (typeof supplier === 'object' ? supplier.id : supplier);
    
    if (!supplierId) {
      res.status(400).json({ success: false, error: 'ID du fournisseur requis' });
      return;
    }

    // Récupérer le fournisseur depuis la base de données pour obtenir son nom
    const supplierData = await prisma.supplier.findUnique({
      where: { id: supplierId },
      select: { name: true }
    });
    
    const supplierName = supplierData?.name || (typeof supplier === 'object' ? supplier.name : null) || 'N/A';
    
    // Calculer les totaux à partir de quantity et unitPrice
    const subtotal = items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
    const taxAmount = items.reduce((sum, item) => sum + (item.quantity * item.unitPrice * item.taxRate / 100), 0);
    const total = subtotal + taxAmount;

    // Créer la facture
    const invoice = await prisma.purchaseInvoice.create({
      data: {
        invoiceNumber,
        supplierId,
        date,
        dueDate,
        status,
        subtotal,
        taxAmount,
        total,
        notes
      }
    });

    // Créer les articles de la facture
    const createdItems = await Promise.all(
      items.map(item =>
        prisma.invoiceItem.create({
          data: {
            invoiceId: invoice.id,
            invoiceType: 'purchase',
            description: item.description,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            total: item.quantity * item.unitPrice,
            taxRate: item.taxRate
          }
        })
      )
    );

    // Ajouter les articles à la facture
    invoice.items = createdItems;

    // Mettre à jour ou créer les produits
    for (const item of items) {
      const existingProduct = await prisma.product.findUnique({
        where: { description: item.description }
      });

      if (existingProduct) {
        // Mettre à jour le produit existant
        const newTotalQuantity = existingProduct.totalQuantity + item.quantity;
        const newAveragePrice = ((existingProduct.averageUnitPrice * existingProduct.totalQuantity) + (item.unitPrice * item.quantity)) / newTotalQuantity;
        
        await prisma.product.update({
          where: { description: item.description },
          data: {
            totalQuantity: newTotalQuantity,
            averageUnitPrice: newAveragePrice,
            lastPurchasePrice: item.unitPrice,
            lastPurchaseDate: date,
            supplierId,
            supplierName,
            taxRate: item.taxRate
          }
        });
        
        console.log(`Produit "${item.description}" mis à jour: quantité +${item.quantity}`);
      } else {
        // Créer un nouveau produit
        await prisma.product.create({
          data: {
            description: item.description,
            totalQuantity: item.quantity,
            averageUnitPrice: item.unitPrice,
            lastPurchasePrice: item.unitPrice,
            lastPurchaseDate: date,
            supplierId,
            supplierName,
            taxRate: item.taxRate
          }
        });
        
        console.log(`Nouveau produit créé: "${item.description}" (quantité: ${item.quantity})`);
      }
    }

    res.json({ success: true, data: invoice });
  } catch (error) {
    console.error('Erreur lors de la création de la facture d\'achat:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Route pour supprimer une facture d'achat
app.delete('/api/invoices/purchases/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Récupérer la facture
    const invoice = await prisma.purchaseInvoice.findUnique({
      where: { id }
    });

    if (!invoice) {
      res.status(404).json({ success: false, error: 'Facture d\'achat non trouvée' });
      return;
    }

    // Récupérer les articles de la facture
    const items = await prisma.invoiceItem.findMany({
      where: {
        invoiceId: id,
        invoiceType: 'purchase'
      }
    });

    // Mettre à jour le stock des produits (diminuer les quantités)
    for (const item of items) {
      const product = await prisma.product.findUnique({
        where: { description: item.description }
      });

      if (product) {
        const newQuantity = Math.max(0, product.totalQuantity - item.quantity);
        
        if (newQuantity === 0) {
          // Supprimer le produit si la quantité devient 0
          await prisma.product.delete({
            where: { description: item.description }
          });
          console.log(`Produit "${item.description}" supprimé (stock à zéro)`);
        } else {
          // Mettre à jour la quantité
          await prisma.product.update({
            where: { description: item.description },
            data: { totalQuantity: newQuantity }
          });
          console.log(`Produit "${item.description}" mis à jour: quantité -${item.quantity}`);
        }
      }
    }

    // Supprimer la facture (les articles seront supprimés automatiquement par CASCADE)
    await prisma.purchaseInvoice.delete({
      where: { id }
    });

    console.log(`Facture d'achat ${id} supprimée avec succès`);
    res.json({ success: true, message: 'Facture d\'achat supprimée avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression de la facture d\'achat:', error);
    res.status(500).json({ success: false, error: 'Erreur interne du serveur' });
  }
});

// Routes des factures de vente
app.get('/api/invoices/sales', async (req, res) => {
  try {
    const { status, search } = req.query;
    
    const where = {};
    if (status) where.status = status;
    if (search) {
      where.OR = [
        { invoiceNumber: { contains: search, mode: 'insensitive' } },
        { client: { name: { contains: search, mode: 'insensitive' } } }
      ];
    }

    const invoices = await prisma.saleInvoice.findMany({
      where,
      include: {
        client: {
          select: { id: true, name: true, email: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    // Transformer les données pour inclure un objet client
    const transformedInvoices = invoices.map(invoice => ({
      ...invoice,
      client: invoice.client ? {
        id: invoice.client.id,
        name: invoice.client.name,
        email: invoice.client.email
      } : null
    }));

    res.json({ success: true, data: transformedInvoices });
  } catch (error) {
    console.error('Erreur lors de la récupération des factures de vente:', error);
    res.status(500).json({ success: false, error: 'Erreur interne du serveur' });
  }
});

app.get('/api/invoices/sales/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const invoice = await prisma.saleInvoice.findUnique({
      where: { id },
      include: {
        client: true
      }
    });

    if (!invoice) {
      res.status(404).json({ success: false, error: 'Facture de vente non trouvée' });
      return;
    }

    // Récupérer les articles de la facture
    const items = await prisma.invoiceItem.findMany({
      where: {
        invoiceId: id,
        invoiceType: 'sale'
      }
    });

    // Ajouter les articles à la facture
    invoice.items = items;

    res.json({ success: true, data: invoice });
  } catch (error) {
    console.error('Erreur lors de la récupération de la facture de vente:', error);
    res.status(500).json({ success: false, error: 'Erreur interne du serveur' });
  }
});

app.post('/api/invoices/sales', async (req, res) => {
  try {
    const { invoiceNumber, client, clientId: directClientId, date, dueDate, status, paymentMethod, items, notes } = req.body;
    
    // Extraire l'ID du client (accepter plusieurs formats)
    const clientId = directClientId || (typeof client === 'object' ? client.id : client);
    
    if (!clientId) {
      res.status(400).json({ success: false, error: 'ID du client requis' });
      return;
    }
    
    // Calculer les totaux à partir de quantity et unitPrice
    const subtotal = items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
    const taxAmount = items.reduce((sum, item) => sum + (item.quantity * item.unitPrice * item.taxRate / 100), 0);
    const total = subtotal + taxAmount;

    // Créer la facture
    const invoice = await prisma.saleInvoice.create({
      data: {
        invoiceNumber,
        clientId,
        date,
        dueDate,
        status,
        subtotal,
        taxAmount,
        total,
        paymentMethod: paymentMethod || 'Espèces',
        notes
      }
    });

    // Créer les articles de la facture
    const createdItems = await Promise.all(
      items.map(item =>
        prisma.invoiceItem.create({
          data: {
            invoiceId: invoice.id,
            invoiceType: 'sale',
            description: item.description,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            total: item.quantity * item.unitPrice,
            taxRate: item.taxRate
          }
        })
      )
    );

    // Ajouter les articles à la facture
    invoice.items = createdItems;

    res.json({ success: true, data: invoice });
  } catch (error) {
    console.error('Erreur lors de la création de la facture de vente:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Route pour supprimer une facture de vente
app.delete('/api/invoices/sales/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Récupérer la facture
    const invoice = await prisma.saleInvoice.findUnique({
      where: { id }
    });

    if (!invoice) {
      res.status(404).json({ success: false, error: 'Facture de vente non trouvée' });
      return;
    }

    // Récupérer les articles de la facture
    const items = await prisma.invoiceItem.findMany({
      where: {
        invoiceId: id,
        invoiceType: 'sale'
      }
    });

    // Mettre à jour le stock des produits (augmenter les quantités car on annule une vente)
    for (const item of items) {
      const product = await prisma.product.findUnique({
        where: { description: item.description }
      });

      if (product) {
        const newQuantity = product.totalQuantity + item.quantity;
        
        await prisma.product.update({
          where: { description: item.description },
          data: { totalQuantity: newQuantity }
        });
        
        console.log(`Produit "${item.description}" mis à jour: quantité +${item.quantity} (annulation vente)`);
      }
    }

    // Supprimer la facture (les articles seront supprimés automatiquement par CASCADE)
    await prisma.saleInvoice.delete({
      where: { id }
    });

    console.log(`Facture de vente ${id} supprimée avec succès`);
    res.json({ success: true, message: 'Facture de vente supprimée avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression de la facture de vente:', error);
    res.status(500).json({ success: false, error: 'Erreur interne du serveur' });
  }
});

// Routes des produits
app.get('/api/products', async (req, res) => {
  try {
    const { search } = req.query;
    
    const products = await prisma.product.findMany({
      where: search ? {
        description: { contains: search, mode: 'insensitive' }
      } : {},
      include: {
        supplier: true
      },
      orderBy: { description: 'asc' }
    });

    // Formater les produits pour inclure supplierName et récupérer l'historique des achats
    const productsWithPurchases = await Promise.all(
      products.map(async (product) => {
        // Récupérer l'historique des achats pour ce produit
        const invoiceItems = await prisma.invoiceItem.findMany({
          where: {
            invoiceType: 'purchase',
            description: product.description
          },
          orderBy: { createdAt: 'desc' }
        });

        // Pour chaque item, récupérer les informations de la facture d'achat
        const purchases = await Promise.all(
          invoiceItems.map(async (item) => {
            const purchaseInvoice = await prisma.purchaseInvoice.findUnique({
              where: { id: item.invoiceId },
              select: {
                invoiceNumber: true,
                date: true
              }
            });

            return {
              invoiceId: item.invoiceId,
              invoiceNumber: purchaseInvoice?.invoiceNumber || '',
              quantity: item.quantity,
              unitPrice: item.unitPrice,
              date: purchaseInvoice?.date || ''
            };
          })
        );

        return {
          ...product,
          supplierName: product.supplier?.name || product.supplierName || 'N/A',
          supplierId: product.supplierId || '',
          purchases: purchases
        };
      })
    );

    res.json({ success: true, data: productsWithPurchases });
  } catch (error) {
    console.error('Erreur lors de la récupération des produits:', error);
    res.status(500).json({ success: false, error: 'Erreur interne du serveur' });
  }
});

// Route du tableau de bord
app.get('/api/dashboard/stats', async (req, res) => {
  try {
    const [
      totalSuppliers,
      totalClients,
      totalPurchaseInvoices,
      totalSaleInvoices,
      totalProducts,
      totalPurchases,
      totalSales
    ] = await Promise.all([
      prisma.supplier.count(),
      prisma.client.count(),
      prisma.purchaseInvoice.count(),
      prisma.saleInvoice.count(),
      prisma.product.count(),
      prisma.purchaseInvoice.aggregate({ _sum: { total: true } }),
      prisma.saleInvoice.aggregate({ _sum: { total: true } })
    ]);

    const profit = (totalSales._sum.total || 0) - (totalPurchases._sum.total || 0);
    const profitMargin = (totalSales._sum.total || 0) > 0 ? (profit / (totalSales._sum.total || 0)) * 100 : 0;

    res.json({
      success: true,
      data: {
        overview: {
          totalSuppliers,
          totalClients,
          totalPurchaseInvoices,
          totalSaleInvoices,
          totalProducts,
          totalPurchases: totalPurchases._sum.total || 0,
          totalSales: totalSales._sum.total || 0,
          profit,
          profitMargin
        }
      }
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques:', error);
    res.status(500).json({ success: false, error: 'Erreur interne du serveur' });
  }
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
    console.log('🔄 Connexion à la base de données PostgreSQL...');
    
    // Tester la connexion à la base de données
    await prisma.$connect();
    console.log('✅ Connexion à PostgreSQL établie');

    // Initialiser les données de test
    await initTestData();

    app.listen(PORT, () => {
      console.log('🚀 Serveur démarré avec succès!');
      console.log(`📡 API disponible sur: http://localhost:${PORT}/api`);
      console.log(`🌍 Environnement: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🔗 CORS autorisé pour: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
      console.log('🗄️ Base de données: PostgreSQL avec Prisma');
    });
  } catch (error) {
    console.error('❌ Erreur lors du démarrage du serveur:', error);
    process.exit(1);
  }
}

// Gestion gracieuse de l'arrêt
process.on('SIGINT', async () => {
  console.log('\n🛑 Arrêt du serveur...');
  await prisma.$disconnect();
  console.log('✅ Connexion à la base de données fermée');
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n🛑 Arrêt du serveur...');
  await prisma.$disconnect();
  console.log('✅ Connexion à la base de données fermée');
  process.exit(0);
});

startServer();
