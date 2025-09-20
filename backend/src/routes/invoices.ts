import { Router } from 'express';
import { InvoiceController } from '../controllers/InvoiceController';
import { 
  validateId, 
  validatePurchaseInvoice, 
  validatePurchaseInvoiceUpdate,
  validateSaleInvoice,
  validateSaleInvoiceUpdate,
  validateQuery 
} from '../middleware/validation';

const router = Router();
const invoiceController = new InvoiceController();

// === PURCHASE INVOICES ===

// GET /api/invoices/purchases - Récupérer toutes les factures d'achat
router.get('/purchases', validateQuery, invoiceController.getAllPurchaseInvoices);

// GET /api/invoices/purchases/:id - Récupérer une facture d'achat par ID
router.get('/purchases/:id', validateId, invoiceController.getPurchaseInvoiceById);

// POST /api/invoices/purchases - Créer une nouvelle facture d'achat
router.post('/purchases', validatePurchaseInvoice, invoiceController.createPurchaseInvoice);

// PUT /api/invoices/purchases/:id - Mettre à jour une facture d'achat
router.put('/purchases/:id', validateId, validatePurchaseInvoiceUpdate, invoiceController.updatePurchaseInvoice);

// DELETE /api/invoices/purchases/:id - Supprimer une facture d'achat
router.delete('/purchases/:id', validateId, invoiceController.deletePurchaseInvoice);

// === SALE INVOICES ===

// GET /api/invoices/sales - Récupérer toutes les factures de vente
router.get('/sales', validateQuery, invoiceController.getAllSaleInvoices);

// GET /api/invoices/sales/:id - Récupérer une facture de vente par ID
router.get('/sales/:id', validateId, invoiceController.getSaleInvoiceById);

// POST /api/invoices/sales - Créer une nouvelle facture de vente
router.post('/sales', validateSaleInvoice, invoiceController.createSaleInvoice);

// PUT /api/invoices/sales/:id - Mettre à jour une facture de vente
router.put('/sales/:id', validateId, validateSaleInvoiceUpdate, invoiceController.updateSaleInvoice);

// DELETE /api/invoices/sales/:id - Supprimer une facture de vente
router.delete('/sales/:id', validateId, invoiceController.deleteSaleInvoice);

export default router;
