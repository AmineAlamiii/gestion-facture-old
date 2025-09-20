import { InvoiceItem, PurchaseInvoice, SaleInvoice } from '../types';

export const calculateItemTotal = (quantity: number, unitPrice: number): number => {
  return quantity * unitPrice;
};

export const calculateSubtotal = (items: InvoiceItem[]): number => {
  return items.reduce((sum, item) => sum + item.total, 0);
};

export const calculateTaxAmount = (items: InvoiceItem[]): number => {
  return items.reduce((sum, item) => sum + (item.total * item.taxRate / 100), 0);
};

export const calculateTotal = (items: InvoiceItem[]): number => {
  const subtotal = calculateSubtotal(items);
  const taxAmount = calculateTaxAmount(items);
  return subtotal + taxAmount;
};

export const generateInvoiceNumber = (prefix: string): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `${prefix}-${year}${month}${day}-${random}`;
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('fr-FR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount) + ' DH';
};

export const formatDate = (date: string): string => {
  return new Date(date).toLocaleDateString('fr-FR');
};

// Fonction pour convertir un nombre en lettres en français
export const numberToWords = (num: number): string => {
  const ones = ['', 'UN', 'DEUX', 'TROIS', 'QUATRE', 'CINQ', 'SIX', 'SEPT', 'HUIT', 'NEUF', 'DIX', 'ONZE', 'DOUZE', 'TREIZE', 'QUATORZE', 'QUINZE', 'SEIZE', 'DIX-SEPT', 'DIX-HUIT', 'DIX-NEUF'];
  const tens = ['', '', 'VINGT', 'TRENTE', 'QUARANTE', 'CINQUANTE', 'SOIXANTE', 'SOIXANTE-DIX', 'QUATRE-VINGT', 'QUATRE-VINGT-DIX'];
  const hundreds = ['', 'CENT', 'DEUX-CENTS', 'TROIS-CENTS', 'QUATRE-CENTS', 'CINQ-CENTS', 'SIX-CENTS', 'SEPT-CENTS', 'HUIT-CENTS', 'NEUF-CENTS'];

  if (num === 0) return 'ZÉRO';

  let result = '';

  // Gestion des milliers
  if (num >= 1000) {
    const thousands = Math.floor(num / 1000);
    if (thousands === 1) {
      result += 'MILLE ';
    } else {
      result += numberToWords(thousands) + ' MILLE ';
    }
    num %= 1000;
  }

  // Gestion des centaines
  if (num >= 100) {
    const hundredsDigit = Math.floor(num / 100);
    if (hundredsDigit === 1 && num % 100 === 0) {
      result += 'CENT ';
    } else if (hundredsDigit === 1) {
      result += 'CENT ';
    } else {
      result += hundreds[hundredsDigit] + ' ';
    }
    num %= 100;
  }

  // Gestion des dizaines et unités
  if (num >= 20) {
    const tensDigit = Math.floor(num / 10);
    const onesDigit = num % 10;
    
    if (tensDigit === 7 || tensDigit === 9) {
      // Cas spéciaux pour 70-79 et 90-99
      const base = tensDigit === 7 ? 60 : 80;
      const remainder = num - base;
      result += tens[Math.floor(base / 10)] + '-' + ones[remainder] + ' ';
    } else {
      result += tens[tensDigit];
      if (onesDigit === 1 && tensDigit !== 8) {
        result += '-ET-UN ';
      } else if (onesDigit > 0) {
        result += '-' + ones[onesDigit] + ' ';
      } else {
        result += ' ';
      }
    }
  } else if (num > 0) {
    result += ones[num] + ' ';
  }

  return result.trim();
};