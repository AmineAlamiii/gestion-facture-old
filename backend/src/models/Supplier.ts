import { getDatabase } from '../config/database';
import { Supplier, CreateSupplierRequest, UpdateSupplierRequest } from '../types';
import { v4 as uuidv4 } from 'uuid';

export class SupplierModel {
  private db = getDatabase();

  async findAll(): Promise<Supplier[]> {
    const suppliers = await this.db.allQuery(`
      SELECT * FROM suppliers 
      ORDER BY name ASC
    `);
    return suppliers;
  }

  async findById(id: string): Promise<Supplier | null> {
    const supplier = await this.db.getQuery(`
      SELECT * FROM suppliers WHERE id = ?
    `, [id]);
    return supplier || null;
  }

  async findByEmail(email: string): Promise<Supplier | null> {
    const supplier = await this.db.getQuery(`
      SELECT * FROM suppliers WHERE email = ?
    `, [email]);
    return supplier || null;
  }

  async create(data: CreateSupplierRequest): Promise<Supplier> {
    const id = uuidv4();
    const now = new Date().toISOString();

    await this.db.runQuery(`
      INSERT INTO suppliers (id, name, email, phone, address, taxId, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [id, data.name, data.email, data.phone, data.address, data.taxId || '', now, now]);

    const supplier = await this.findById(id);
    if (!supplier) {
      throw new Error('Erreur lors de la création du fournisseur');
    }
    return supplier;
  }

  async update(id: string, data: UpdateSupplierRequest): Promise<Supplier | null> {
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
      UPDATE suppliers 
      SET ${fields.join(', ')}
      WHERE id = ?
    `, values);

    return this.findById(id);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.db.runQuery(`
      DELETE FROM suppliers WHERE id = ?
    `, [id]);

    return result.changes > 0;
  }

  async search(query: string): Promise<Supplier[]> {
    const suppliers = await this.db.allQuery(`
      SELECT * FROM suppliers 
      WHERE name LIKE ? OR email LIKE ? OR phone LIKE ?
      ORDER BY name ASC
    `, [`%${query}%`, `%${query}%`, `%${query}%`]);
    return suppliers;
  }

  async getStats(): Promise<{ total: number; withInvoices: number }> {
    const stats = await this.db.getQuery(`
      SELECT 
        COUNT(*) as total,
        COUNT(DISTINCT pi.supplierId) as withInvoices
      FROM suppliers s
      LEFT JOIN purchase_invoices pi ON s.id = pi.supplierId
    `);
    return stats;
  }
}
