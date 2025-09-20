import { Request, Response, NextFunction } from 'express';
import { ProductModel } from '../models/Product';
import { ApiResponse } from '../types';
import { asyncHandler, createError } from '../middleware/errorHandler';

export class ProductController {
  private productModel = new ProductModel();

  // GET /api/products
  getAllProducts = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { search, lowStock } = req.query;
    
    let products;
    if (search && typeof search === 'string') {
      products = await this.productModel.search(search);
    } else if (lowStock === 'true') {
      const threshold = parseInt(req.query.threshold as string) || 10;
      products = await this.productModel.getLowStock(threshold);
    } else {
      products = await this.productModel.findAll();
    }

    const response: ApiResponse = {
      success: true,
      data: products,
      message: `${products.length} produit(s) trouvé(s)`
    };

    res.json(response);
  });

  // GET /api/products/:id
  getProductById = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const product = await this.productModel.findById(id);
    if (!product) {
      throw createError('Produit non trouvé', 404);
    }

    const response: ApiResponse = {
      success: true,
      data: product
    };

    res.json(response);
  });

  // GET /api/products/search/:description
  getProductByDescription = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { description } = req.params;

    const product = await this.productModel.findByDescription(description);
    if (!product) {
      throw createError('Produit non trouvé', 404);
    }

    const response: ApiResponse = {
      success: true,
      data: product
    };

    res.json(response);
  });

  // GET /api/products/stats
  getProductStats = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const stats = await this.productModel.getStats();

    const response: ApiResponse = {
      success: true,
      data: stats,
      message: 'Statistiques des produits récupérées'
    };

    res.json(response);
  });

  // GET /api/products/report/stock
  getStockReport = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const report = await this.productModel.getStockReport();

    const response: ApiResponse = {
      success: true,
      data: { report },
      message: 'Rapport de stock généré'
    };

    res.json(response);
  });

  // GET /api/products/low-stock
  getLowStockProducts = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const threshold = parseInt(req.query.threshold as string) || 10;
    const products = await this.productModel.getLowStock(threshold);

    const response: ApiResponse = {
      success: true,
      data: products,
      message: `${products.length} produit(s) en rupture de stock`
    };

    res.json(response);
  });
}
