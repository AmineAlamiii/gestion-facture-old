import { getDatabase } from '../config/database';
import { Client, CreateClientRequest, UpdateClientRequest } from '../types';
import { v4 as uuidv4 } from 'uuid';

export class ClientModel {
  private db = getDatabase();

  async findAll(): Promise<Client[]> {
    const clients = await this.db.allQuery(`
      SELECT * FROM clients 
      ORDER BY name ASC
    `);
    return clients;
  }

  async findById(id: string): Promise<Client | null> {
    const client = await this.db.getQuery(`
      SELECT * FROM clients WHERE id = ?
    `, [id]);
    return client || null;
  }

  async findByEmail(email: string): Promise<Client | null> {
    const client = await this.db.getQuery(`
      SELECT * FROM clients WHERE email = ?
    `, [email]);
    return client || null;
  }

  async create(data: CreateClientRequest): Promise<Client> {
    const id = uuidv4();
    const now = new Date().toISOString();

    await this.db.runQuery(`
      INSERT INTO clients (id, name, email, phone, address, taxId, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [id, data.name, data.email, data.phone, data.address, data.taxId || '', now, now]);

    const client = await this.findById(id);
    if (!client) {
      throw new Error('Erreur lors de la création du client');
    }
    return client;
  }

  async update(id: string, data: UpdateClientRequest): Promise<Client | null> {
    const now = new Date().toISOString();
    
    // Construire la requête dynamiquement
    const fields = [];
    const values = [];

    if (data.name !== undefined) {
      fields.push('name = ?');
      values.push(data.name);
    }
    if (data.email !== undefined) {
      fields.push('email = ?');
      values.push(data.email);
    }
    if (data.phone !== undefined) {
      fields.push('phone = ?');
      values.push(data.phone);
    }
    if (data.address !== undefined) {
      fields.push('address = ?');
      values.push(data.address);
    }
    if (data.taxId !== undefined) {
      fields.push('taxId = ?');
      values.push(data.taxId);
    }

    if (fields.length === 0) {
      return this.findById(id);
    }

    fields.push('updatedAt = ?');
    values.push(now);
    values.push(id);

    await this.db.runQuery(`
      UPDATE clients 
      SET ${fields.join(', ')}
      WHERE id = ?
    `, values);

    return this.findById(id);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.db.runQuery(`
      DELETE FROM clients WHERE id = ?
    `, [id]);

    return result.changes > 0;
  }

  async search(query: string): Promise<Client[]> {
    const clients = await this.db.allQuery(`
      SELECT * FROM clients 
      WHERE name LIKE ? OR email LIKE ? OR phone LIKE ?
      ORDER BY name ASC
    `, [`%${query}%`, `%${query}%`, `%${query}%`]);
    return clients;
  }

  async getStats(): Promise<{ total: number; withInvoices: number }> {
    const stats = await this.db.getQuery(`
      SELECT 
        COUNT(*) as total,
        COUNT(DISTINCT si.clientId) as withInvoices
      FROM clients c
      LEFT JOIN sale_invoices si ON c.id = si.clientId
    `);
    return stats;
  }
}
