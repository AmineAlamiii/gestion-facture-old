import { PurchaseInvoice, Product } from '../types';

export const generateProductsFromPurchases = (purchases: PurchaseInvoice[]): Product[] => {
  const productMap = new Map<string, Product>();

  purchases.forEach(purchase => {
    purchase.items.forEach(item => {
      const productKey = item.description.toLowerCase().trim();
      
      if (productMap.has(productKey)) {
        const existingProduct = productMap.get(productKey)!;
        
        // Ajouter cette nouvelle entrée d'achat
        existingProduct.purchases.push({
          invoiceId: purchase.id,
          invoiceNumber: purchase.invoiceNumber,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          date: purchase.date,
        });
        
        // Mettre à jour les quantités et prix
        existingProduct.totalQuantity += item.quantity;
        
        // Calculer le prix moyen pondéré
        const totalValue = existingProduct.purchases.reduce(
          (sum, p) => sum + (p.quantity * p.unitPrice), 0
        );
        existingProduct.averageUnitPrice = totalValue / existingProduct.totalQuantity;
        
        // Mettre à jour le dernier prix et date d'achat si plus récent
        if (new Date(purchase.date) > new Date(existingProduct.lastPurchaseDate)) {
          existingProduct.lastPurchasePrice = item.unitPrice;
          existingProduct.lastPurchaseDate = purchase.date;
          existingProduct.supplierId = purchase.supplier.id;
          existingProduct.supplierName = purchase.supplier.name;
        }
      } else {
        // Créer un nouveau produit
        const newProduct: Product = {
          id: `product-${Date.now()}-${Math.random()}`,
          description: item.description,
          totalQuantity: item.quantity,
          averageUnitPrice: item.unitPrice,
          lastPurchasePrice: item.unitPrice,
          lastPurchaseDate: purchase.date,
          supplierId: purchase.supplier.id,
          supplierName: purchase.supplier.name,
          taxRate: item.taxRate,
          purchases: [{
            invoiceId: purchase.id,
            invoiceNumber: purchase.invoiceNumber,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            date: purchase.date,
          }],
        };
        
        productMap.set(productKey, newProduct);
      }
    });
  });

  return Array.from(productMap.values()).sort((a, b) => 
    a.description.localeCompare(b.description)
  );
};

export const calculateStockValue = (products: Product[]): number => {
  return products.reduce((total, product) => 
    total + (product.totalQuantity * product.averageUnitPrice), 0
  );
};

export const formatStockReport = (products: Product[]): string => {
  const totalValue = calculateStockValue(products);
  const reportDate = new Date().toLocaleDateString('fr-FR');
  
  let report = `RAPPORT DE STOCK - ${reportDate}\n`;
  report += `${'='.repeat(80)}\n\n`;
  
  report += `Nombre total de produits: ${products.length}\n`;
  report += `Valeur totale du stock: ${totalValue.toFixed(2)} DH\n\n`;
  
  report += `${'PRODUIT'.padEnd(40)} ${'QTÉ'.padStart(8)} ${'PRIX MOY.'.padStart(12)} ${'VALEUR'.padStart(12)}\n`;
  report += `${'-'.repeat(80)}\n`;
  
  products.forEach(product => {
    const value = product.totalQuantity * product.averageUnitPrice;
    report += `${product.description.padEnd(40)} `;
    report += `${product.totalQuantity.toString().padStart(8)} `;
    report += `${product.averageUnitPrice.toFixed(2).padStart(12)} `;
    report += `${value.toFixed(2).padStart(12)}\n`;
  });
  
  report += `${'-'.repeat(80)}\n`;
  report += `${'TOTAL'.padEnd(40)} ${''.padStart(8)} ${''.padStart(12)} ${totalValue.toFixed(2).padStart(12)}\n`;
  
  return report;
};