// Types partagés avec le frontend
export interface Supplier {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  taxId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  taxId: string;
  createdAt: string;
  updatedAt: string;
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
  createdAt: string;
  updatedAt: string;
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
  notes?: string;
  basedOnPurchase?: string;
  createdAt: string;
  updatedAt: string;
}

export type InvoiceStatus = 'pending' | 'paid' | 'overdue' | 'draft' | 'sent';

// Types spécifiques au backend
export interface CreateSupplierRequest {
  name: string;
  email: string;
  phone: string;
  address: string;
  taxId?: string;
}

export interface UpdateSupplierRequest extends Partial<CreateSupplierRequest> {}

export interface CreateClientRequest {
  name: string;
  email: string;
  phone: string;
  address: string;
  taxId?: string;
}

export interface UpdateClientRequest extends Partial<CreateClientRequest> {}

export interface CreateInvoiceItemRequest {
  description: string;
  quantity: number;
  unitPrice: number;
  taxRate: number;
}

export interface CreatePurchaseInvoiceRequest {
  invoiceNumber: string;
  supplierId: string;
  date: string;
  dueDate: string;
  items: CreateInvoiceItemRequest[];
  status?: 'pending' | 'paid' | 'overdue';
  notes?: string;
}

export interface UpdatePurchaseInvoiceRequest extends Partial<CreatePurchaseInvoiceRequest> {}

export interface CreateSaleInvoiceRequest {
  invoiceNumber: string;
  clientId: string;
  date: string;
  dueDate: string;
  items: CreateInvoiceItemRequest[];
  status?: 'draft' | 'sent' | 'paid' | 'overdue';
  notes?: string;
  basedOnPurchase?: string;
}

export interface UpdateSaleInvoiceRequest extends Partial<CreateSaleInvoiceRequest> {}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface DatabaseConfig {
  path: string;
}

export interface ServerConfig {
  port: number;
  nodeEnv: string;
  corsOrigin: string;
  jwtSecret: string;
  jwtExpiresIn: string;
  logLevel: string;
}
