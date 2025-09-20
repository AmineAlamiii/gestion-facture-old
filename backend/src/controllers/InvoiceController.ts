import { Request, Response, NextFunction } from 'express';
import { InvoiceModel } from '../models/Invoice';
import { ApiResponse } from '../types';
import { asyncHandler, createError } from '../middleware/errorHandler';

export class InvoiceController {
  private invoiceModel = new InvoiceModel();

  // === PURCHASE INVOICES ===

  // GET /api/invoices/purchases
  getAllPurchaseInvoices = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { status, search } = req.query;
    
    let invoices = await this.invoiceModel.findAllPurchases();
    
    // Filtrer par statut si fourni
    if (status && typeof status === 'string') {
      invoices = invoices.filter(invoice => invoice.status === status);
    }
    
    // Filtrer par recherche si fourni
    if (search && typeof search === 'string') {
      const searchLower = search.toLowerCase();
      invoices = invoices.filter(invoice => 
        invoice.invoiceNumber.toLowerCase().includes(searchLower) ||
        invoice.supplier.name.toLowerCase().includes(searchLower)
      );
    }

    const response: ApiResponse = {
      success: true,
      data: invoices,
      message: `${invoices.length} facture(s) d'achat trouvée(s)`
    };

    res.json(response);
  });

  // GET /api/invoices/purchases/:id
  getPurchaseInvoiceById = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const invoice = await this.invoiceModel.findPurchaseById(id);
    if (!invoice) {
      throw createError('Facture d\'achat non trouvée', 404);
    }

    const response: ApiResponse = {
      success: true,
      data: invoice
    };

    res.json(response);
  });

  // POST /api/invoices/purchases
  createPurchaseInvoice = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const invoiceData = req.body;

    const invoice = await this.invoiceModel.createPurchase(invoiceData);

    const response: ApiResponse = {
      success: true,
      data: invoice,
      message: 'Facture d\'achat créée avec succès'
    };

    res.status(201).json(response);
  });

  // PUT /api/invoices/purchases/:id
  updatePurchaseInvoice = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const updateData = req.body;

    // Vérifier si la facture existe
    const existingInvoice = await this.invoiceModel.findPurchaseById(id);
    if (!existingInvoice) {
      throw createError('Facture d\'achat non trouvée', 404);
    }

    const invoice = await this.invoiceModel.updatePurchase(id, updateData);
    if (!invoice) {
      throw createError('Erreur lors de la mise à jour de la facture d\'achat', 500);
    }

    const response: ApiResponse = {
      success: true,
      data: invoice,
      message: 'Facture d\'achat mise à jour avec succès'
    };

    res.json(response);
  });

  // DELETE /api/invoices/purchases/:id
  deletePurchaseInvoice = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    // Vérifier si la facture existe
    const existingInvoice = await this.invoiceModel.findPurchaseById(id);
    if (!existingInvoice) {
      throw createError('Facture d\'achat non trouvée', 404);
    }

    const deleted = await this.invoiceModel.deletePurchase(id);
    if (!deleted) {
      throw createError('Erreur lors de la suppression de la facture d\'achat', 500);
    }

    const response: ApiResponse = {
      success: true,
      message: 'Facture d\'achat supprimée avec succès'
    };

    res.json(response);
  });

  // === SALE INVOICES ===

  // GET /api/invoices/sales
  getAllSaleInvoices = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { status, search } = req.query;
    
    let invoices = await this.invoiceModel.findAllSales();
    
    // Filtrer par statut si fourni
    if (status && typeof status === 'string') {
      invoices = invoices.filter(invoice => invoice.status === status);
    }
    
    // Filtrer par recherche si fourni
    if (search && typeof search === 'string') {
      const searchLower = search.toLowerCase();
      invoices = invoices.filter(invoice => 
        invoice.invoiceNumber.toLowerCase().includes(searchLower) ||
        invoice.client.name.toLowerCase().includes(searchLower)
      );
    }

    const response: ApiResponse = {
      success: true,
      data: invoices,
      message: `${invoices.length} facture(s) de vente trouvée(s)`
    };

    res.json(response);
  });

  // GET /api/invoices/sales/:id
  getSaleInvoiceById = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const invoice = await this.invoiceModel.findSaleById(id);
    if (!invoice) {
      throw createError('Facture de vente non trouvée', 404);
    }

    const response: ApiResponse = {
      success: true,
      data: invoice
    };

    res.json(response);
  });

  // POST /api/invoices/sales
  createSaleInvoice = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const invoiceData = req.body;

    const invoice = await this.invoiceModel.createSale(invoiceData);

    const response: ApiResponse = {
      success: true,
      data: invoice,
      message: 'Facture de vente créée avec succès'
    };

    res.status(201).json(response);
  });

  // PUT /api/invoices/sales/:id
  updateSaleInvoice = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const updateData = req.body;

    // Vérifier si la facture existe
    const existingInvoice = await this.invoiceModel.findSaleById(id);
    if (!existingInvoice) {
      throw createError('Facture de vente non trouvée', 404);
    }

    const invoice = await this.invoiceModel.updateSale(id, updateData);
    if (!invoice) {
      throw createError('Erreur lors de la mise à jour de la facture de vente', 500);
    }

    const response: ApiResponse = {
      success: true,
      data: invoice,
      message: 'Facture de vente mise à jour avec succès'
    };

    res.json(response);
  });

  // DELETE /api/invoices/sales/:id
  deleteSaleInvoice = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    // Vérifier si la facture existe
    const existingInvoice = await this.invoiceModel.findSaleById(id);
    if (!existingInvoice) {
      throw createError('Facture de vente non trouvée', 404);
    }

    const deleted = await this.invoiceModel.deleteSale(id);
    if (!deleted) {
      throw createError('Erreur lors de la suppression de la facture de vente', 500);
    }

    const response: ApiResponse = {
      success: true,
      message: 'Facture de vente supprimée avec succès'
    };

    res.json(response);
  });
}
