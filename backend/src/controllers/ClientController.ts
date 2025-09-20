import { Request, Response, NextFunction } from 'express';
import { ClientModel } from '../models/Client';
import { ApiResponse } from '../types';
import { asyncHandler, createError } from '../middleware/errorHandler';

export class ClientController {
  private clientModel = new ClientModel();

  // GET /api/clients
  getAllClients = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { search } = req.query;
    
    let clients;
    if (search && typeof search === 'string') {
      clients = await this.clientModel.search(search);
    } else {
      clients = await this.clientModel.findAll();
    }

    const response: ApiResponse = {
      success: true,
      data: clients,
      message: `${clients.length} client(s) trouvé(s)`
    };

    res.json(response);
  });

  // GET /api/clients/:id
  getClientById = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const client = await this.clientModel.findById(id);
    if (!client) {
      throw createError('Client non trouvé', 404);
    }

    const response: ApiResponse = {
      success: true,
      data: client
    };

    res.json(response);
  });

  // POST /api/clients
  createClient = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const clientData = req.body;

    // Vérifier si l'email existe déjà
    const existingClient = await this.clientModel.findByEmail(clientData.email);
    if (existingClient) {
      throw createError('Un client avec cet email existe déjà', 409);
    }

    const client = await this.clientModel.create(clientData);

    const response: ApiResponse = {
      success: true,
      data: client,
      message: 'Client créé avec succès'
    };

    res.status(201).json(response);
  });

  // PUT /api/clients/:id
  updateClient = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const updateData = req.body;

    // Vérifier si le client existe
    const existingClient = await this.clientModel.findById(id);
    if (!existingClient) {
      throw createError('Client non trouvé', 404);
    }

    // Si l'email est modifié, vérifier qu'il n'existe pas déjà
    if (updateData.email && updateData.email !== existingClient.email) {
      const emailExists = await this.clientModel.findByEmail(updateData.email);
      if (emailExists) {
        throw createError('Un client avec cet email existe déjà', 409);
      }
    }

    const client = await this.clientModel.update(id, updateData);
    if (!client) {
      throw createError('Erreur lors de la mise à jour du client', 500);
    }

    const response: ApiResponse = {
      success: true,
      data: client,
      message: 'Client mis à jour avec succès'
    };

    res.json(response);
  });

  // DELETE /api/clients/:id
  deleteClient = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    // Vérifier si le client existe
    const existingClient = await this.clientModel.findById(id);
    if (!existingClient) {
      throw createError('Client non trouvé', 404);
    }

    const deleted = await this.clientModel.delete(id);
    if (!deleted) {
      throw createError('Erreur lors de la suppression du client', 500);
    }

    const response: ApiResponse = {
      success: true,
      message: 'Client supprimé avec succès'
    };

    res.json(response);
  });

  // GET /api/clients/stats
  getClientStats = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const stats = await this.clientModel.getStats();

    const response: ApiResponse = {
      success: true,
      data: stats,
      message: 'Statistiques des clients récupérées'
    };

    res.json(response);
  });
}
