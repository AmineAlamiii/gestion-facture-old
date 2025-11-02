export interface Supplier {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  taxId: string;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  taxId: string;
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
  taxRate: number;
}

export interface Product {
  id: string;
  description: string;
  totalQuantity: number;
  averageUnitPrice: number;
  lastPurchasePrice: number;
  lastPurchaseDate: string;
  supplierId: string;
  supplierName: string;
  taxRate: number;
  purchases: {
    invoiceId: string;
    invoiceNumber: string;
    quantity: number;
    unitPrice: number;
    date: string;
  }[];
}

export interface PurchaseInvoice {
  id: string;
  invoiceNumber: string;
  supplier: Supplier;
  date: string;
  dueDate: string;
  items: InvoiceItem[];
  subtotal: number;
  taxAmount: number;
  total: number;
  status: 'pending' | 'paid' | 'overdue';
  notes?: string;
}

export interface SaleInvoice {
  id: string;
  invoiceNumber: string;
  client: Client;
  date: string;
  dueDate: string;
  items: InvoiceItem[];
  subtotal: number;
  taxAmount: number;
  total: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue';
  paymentMethod?: string;
  notes?: string;
  basedOnPurchase?: string; // Reference to purchase invoice ID
}

export type InvoiceStatus = 'pending' | 'paid' | 'overdue' | 'draft' | 'sent';