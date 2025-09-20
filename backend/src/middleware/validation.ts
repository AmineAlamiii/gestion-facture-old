import Joi from 'joi';
import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../types';

// Schémas de validation
export const supplierSchema = Joi.object({
  name: Joi.string().min(2).max(100).required().messages({
    'string.min': 'Le nom doit contenir au moins 2 caractères',
    'string.max': 'Le nom ne peut pas dépasser 100 caractères',
    'any.required': 'Le nom est requis'
  }),
  email: Joi.string().email().required().messages({
    'string.email': 'Format d\'email invalide',
    'any.required': 'L\'email est requis'
  }),
  phone: Joi.string().min(10).max(20).required().messages({
    'string.min': 'Le téléphone doit contenir au moins 10 caractères',
    'string.max': 'Le téléphone ne peut pas dépasser 20 caractères',
    'any.required': 'Le téléphone est requis'
  }),
  address: Joi.string().min(10).max(200).required().messages({
    'string.min': 'L\'adresse doit contenir au moins 10 caractères',
    'string.max': 'L\'adresse ne peut pas dépasser 200 caractères',
    'any.required': 'L\'adresse est requise'
  }),
  taxId: Joi.string().max(20).optional().allow('').messages({
    'string.max': 'Le numéro de TVA ne peut pas dépasser 20 caractères'
  })
});

export const clientSchema = Joi.object({
  name: Joi.string().min(2).max(100).required().messages({
    'string.min': 'Le nom doit contenir au moins 2 caractères',
    'string.max': 'Le nom ne peut pas dépasser 100 caractères',
    'any.required': 'Le nom est requis'
  }),
  email: Joi.string().email().required().messages({
    'string.email': 'Format d\'email invalide',
    'any.required': 'L\'email est requis'
  }),
  phone: Joi.string().min(10).max(20).required().messages({
    'string.min': 'Le téléphone doit contenir au moins 10 caractères',
    'string.max': 'Le téléphone ne peut pas dépasser 20 caractères',
    'any.required': 'Le téléphone est requis'
  }),
  address: Joi.string().min(10).max(200).required().messages({
    'string.min': 'L\'adresse doit contenir au moins 10 caractères',
    'string.max': 'L\'adresse ne peut pas dépasser 200 caractères',
    'any.required': 'L\'adresse est requise'
  }),
  taxId: Joi.string().max(20).optional().allow('').messages({
    'string.max': 'Le numéro de TVA ne peut pas dépasser 20 caractères'
  })
});

export const invoiceItemSchema = Joi.object({
  description: Joi.string().min(1).max(200).required().messages({
    'string.min': 'La description doit contenir au moins 1 caractère',
    'string.max': 'La description ne peut pas dépasser 200 caractères',
    'any.required': 'La description est requise'
  }),
  quantity: Joi.number().positive().required().messages({
    'number.positive': 'La quantité doit être positive',
    'any.required': 'La quantité est requise'
  }),
  unitPrice: Joi.number().min(0).required().messages({
    'number.min': 'Le prix unitaire ne peut pas être négatif',
    'any.required': 'Le prix unitaire est requis'
  }),
  taxRate: Joi.number().min(0).max(100).default(20).messages({
    'number.min': 'Le taux de TVA ne peut pas être négatif',
    'number.max': 'Le taux de TVA ne peut pas dépasser 100%'
  })
});

export const purchaseInvoiceSchema = Joi.object({
  invoiceNumber: Joi.string().min(1).max(50).required().messages({
    'string.min': 'Le numéro de facture doit contenir au moins 1 caractère',
    'string.max': 'Le numéro de facture ne peut pas dépasser 50 caractères',
    'any.required': 'Le numéro de facture est requis'
  }),
  supplierId: Joi.string().uuid().required().messages({
    'string.guid': 'ID fournisseur invalide',
    'any.required': 'L\'ID du fournisseur est requis'
  }),
  date: Joi.date().iso().required().messages({
    'date.format': 'Format de date invalide (ISO 8601)',
    'any.required': 'La date est requise'
  }),
  dueDate: Joi.date().iso().required().messages({
    'date.format': 'Format de date invalide (ISO 8601)',
    'any.required': 'La date d\'échéance est requise'
  }),
  items: Joi.array().items(invoiceItemSchema).min(1).required().messages({
    'array.min': 'Au moins un article est requis',
    'any.required': 'Les articles sont requis'
  }),
  status: Joi.string().valid('pending', 'paid', 'overdue').default('pending').messages({
    'any.only': 'Statut invalide (pending, paid, overdue)'
  }),
  notes: Joi.string().max(500).optional().allow('').messages({
    'string.max': 'Les notes ne peuvent pas dépasser 500 caractères'
  })
});

export const saleInvoiceSchema = Joi.object({
  invoiceNumber: Joi.string().min(1).max(50).required().messages({
    'string.min': 'Le numéro de facture doit contenir au moins 1 caractère',
    'string.max': 'Le numéro de facture ne peut pas dépasser 50 caractères',
    'any.required': 'Le numéro de facture est requis'
  }),
  clientId: Joi.string().uuid().required().messages({
    'string.guid': 'ID client invalide',
    'any.required': 'L\'ID du client est requis'
  }),
  date: Joi.date().iso().required().messages({
    'date.format': 'Format de date invalide (ISO 8601)',
    'any.required': 'La date est requise'
  }),
  dueDate: Joi.date().iso().required().messages({
    'date.format': 'Format de date invalide (ISO 8601)',
    'any.required': 'La date d\'échéance est requise'
  }),
  items: Joi.array().items(invoiceItemSchema).min(1).required().messages({
    'array.min': 'Au moins un article est requis',
    'any.required': 'Les articles sont requis'
  }),
  status: Joi.string().valid('draft', 'sent', 'paid', 'overdue').default('draft').messages({
    'any.only': 'Statut invalide (draft, sent, paid, overdue)'
  }),
  notes: Joi.string().max(500).optional().allow('').messages({
    'string.max': 'Les notes ne peuvent pas dépasser 500 caractères'
  }),
  basedOnPurchase: Joi.string().uuid().optional().allow('').messages({
    'string.guid': 'ID facture d\'achat invalide'
  })
});

export const idSchema = Joi.object({
  id: Joi.string().uuid().required().messages({
    'string.guid': 'ID invalide',
    'any.required': 'L\'ID est requis'
  })
});

export const querySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1).messages({
    'number.base': 'La page doit être un nombre',
    'number.integer': 'La page doit être un entier',
    'number.min': 'La page doit être au moins 1'
  }),
  limit: Joi.number().integer().min(1).max(100).default(10).messages({
    'number.base': 'La limite doit être un nombre',
    'number.integer': 'La limite doit être un entier',
    'number.min': 'La limite doit être au moins 1',
    'number.max': 'La limite ne peut pas dépasser 100'
  }),
  search: Joi.string().max(100).optional().allow('').messages({
    'string.max': 'La recherche ne peut pas dépasser 100 caractères'
  }),
  status: Joi.string().valid('pending', 'paid', 'overdue', 'draft', 'sent').optional().messages({
    'any.only': 'Statut invalide'
  })
});

// Middleware de validation générique
export const validate = (schema: Joi.ObjectSchema, source: 'body' | 'params' | 'query' = 'body') => {
  return (req: Request, res: Response, next: NextFunction) => {
    const data = source === 'body' ? req.body : source === 'params' ? req.params : req.query;
    
    const { error, value } = schema.validate(data, {
      abortEarly: false,
      stripUnknown: true,
      convert: true
    });

    if (error) {
      const response: ApiResponse = {
        success: false,
        error: 'Données de validation invalides',
        message: error.details.map(detail => detail.message).join(', ')
      };
      return res.status(400).json(response);
    }

    // Remplacer les données validées
    if (source === 'body') {
      req.body = value;
    } else if (source === 'params') {
      req.params = value;
    } else {
      req.query = value;
    }

    next();
  };
};

// Middleware de validation pour les IDs
export const validateId = validate(idSchema, 'params');

// Middleware de validation pour les requêtes
export const validateQuery = validate(querySchema, 'query');

// Middleware de validation pour les fournisseurs
export const validateSupplier = validate(supplierSchema);
export const validateSupplierUpdate = validate(supplierSchema.fork(Object.keys(supplierSchema.describe().keys), (schema) => schema.optional()));

// Middleware de validation pour les clients
export const validateClient = validate(clientSchema);
export const validateClientUpdate = validate(clientSchema.fork(Object.keys(clientSchema.describe().keys), (schema) => schema.optional()));

// Middleware de validation pour les factures
export const validatePurchaseInvoice = validate(purchaseInvoiceSchema);
export const validatePurchaseInvoiceUpdate = validate(purchaseInvoiceSchema.fork(Object.keys(purchaseInvoiceSchema.describe().keys), (schema) => schema.optional()));

export const validateSaleInvoice = validate(saleInvoiceSchema);
export const validateSaleInvoiceUpdate = validate(saleInvoiceSchema.fork(Object.keys(saleInvoiceSchema.describe().keys), (schema) => schema.optional()));
