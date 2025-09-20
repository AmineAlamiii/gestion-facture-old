import { Request, Response, NextFunction } from 'express';
import { SupplierModel } from '../models/Supplier';
import { ApiResponse, PaginatedResponse } from '../types';
import { asyncHandler, createError } from '../middleware/errorHandler';

export class SupplierController {
  private supplierModel = new SupplierModel();

  // GET /api/suppliers
  getAllSuppliers = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { search } = req.query;
    
    let suppliers;
    if (search && typeof search === 'string') {
      suppliers = await this.supplierModel.search(search);
    } else {
      suppliers = await this.supplierModel.findAll();
    }

    const response: ApiResponse = {
      success: true,
      data: suppliers,
      message: `${suppliers.length} fournisseur(s) trouvé(s)`
    };

    res.json(response);
  });

  // GET /api/suppliers/:id
  getSupplierById = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const supplier = await this.supplierModel.findById(id);
    if (!supplier) {
      throw createError('Fournisseur non trouvé', 404);
    }

    const response: ApiResponse = {
      success: true,
      data: supplier
    };

    res.json(response);
  });

  // POST /api/suppliers
  createSupplier = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const supplierData = req.body;

    // Vérifier si l'email existe déjà
    const existingSupplier = await this.supplierModel.findByEmail(supplierData.email);
    if (existingSupplier) {
      throw createError('Un fournisseur avec cet email existe déjà', 409);
    }

    const supplier = await this.supplierModel.create(supplierData);

    const response: ApiResponse = {
      success: true,
      data: supplier,
      message: 'Fournisseur créé avec succès'
    };

    res.status(201).json(response);
  });

  // PUT /api/suppliers/:id
  updateSupplier = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const updateData = req.body;

    // Vérifier si le fournisseur existe
    const existingSupplier = await this.supplierModel.findById(id);
    if (!existingSupplier) {
      throw createError('Fournisseur non trouvé', 404);
    }

    // Si l'email est modifié, vérifier qu'il n'existe pas déjà
    if (updateData.email && updateData.email !== existingSupplier.email) {
      const emailExists = await this.supplierModel.findByEmail(updateData.email);
      if (emailExists) {
        throw createError('Un fournisseur avec cet email existe déjà', 409);
      }
    }

    const supplier = await this.supplierModel.update(id, updateData);
    if (!supplier) {
      throw createError('Erreur lors de la mise à jour du fournisseur', 500);
    }

    const response: ApiResponse = {
      success: true,
      data: supplier,
      message: 'Fournisseur mis à jour avec succès'
    };

    res.json(response);
  });

  // DELETE /api/suppliers/:id
  deleteSupplier = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    // Vérifier si le fournisseur existe
    const existingSupplier = await this.supplierModel.findById(id);
    if (!existingSupplier) {
      throw createError('Fournisseur non trouvé', 404);
    }

    const deleted = await this.supplierModel.delete(id);
    if (!deleted) {
      throw createError('Erreur lors de la suppression du fournisseur', 500);
    }

    const response: ApiResponse = {
      success: true,
      message: 'Fournisseur supprimé avec succès'
    };

    res.json(response);
  });

  // GET /api/suppliers/stats
  getSupplierStats = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const stats = await this.supplierModel.getStats();

    const response: ApiResponse = {
      success: true,
      data: stats,
      message: 'Statistiques des fournisseurs récupérées'
    };

    res.json(response);
  });
}
