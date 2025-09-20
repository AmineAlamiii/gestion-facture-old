import { Router } from 'express';
import { ClientController } from '../controllers/ClientController';
import { 
  validateId, 
  validateClient, 
  validateClientUpdate,
  validateQuery 
} from '../middleware/validation';

const router = Router();
const clientController = new ClientController();

// GET /api/clients - Récupérer tous les clients
router.get('/', validateQuery, clientController.getAllClients);

// GET /api/clients/stats - Statistiques des clients
router.get('/stats', clientController.getClientStats);

// GET /api/clients/:id - Récupérer un client par ID
router.get('/:id', validateId, clientController.getClientById);

// POST /api/clients - Créer un nouveau client
router.post('/', validateClient, clientController.createClient);

// PUT /api/clients/:id - Mettre à jour un client
router.put('/:id', validateId, validateClientUpdate, clientController.updateClient);

// DELETE /api/clients/:id - Supprimer un client
router.delete('/:id', validateId, clientController.deleteClient);

export default router;
