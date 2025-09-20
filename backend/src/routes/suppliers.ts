import { Router } from 'express';
import { SupplierController } from '../controllers/SupplierController';
import { 
  validateId, 
  validateSupplier, 
  validateSupplierUpdate,
  validateQuery 
} from '../middleware/validation';

const router = Router();
const supplierController = new SupplierController();

// GET /api/suppliers - Récupérer tous les fournisseurs
router.get('/', validateQuery, supplierController.getAllSuppliers);

// GET /api/suppliers/stats - Statistiques des fournisseurs
router.get('/stats', supplierController.getSupplierStats);

// GET /api/suppliers/:id - Récupérer un fournisseur par ID
router.get('/:id', validateId, supplierController.getSupplierById);

// POST /api/suppliers - Créer un nouveau fournisseur
router.post('/', validateSupplier, supplierController.createSupplier);

// PUT /api/suppliers/:id - Mettre à jour un fournisseur
router.put('/:id', validateId, validateSupplierUpdate, supplierController.updateSupplier);

// DELETE /api/suppliers/:id - Supprimer un fournisseur
router.delete('/:id', validateId, supplierController.deleteSupplier);

export default router;
