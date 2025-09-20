import React, { useState } from 'react';
import { usePurchaseInvoices } from '../../hooks/useInvoices';
import { useSuppliers } from '../../hooks/useSuppliers';
import { useProducts } from '../../hooks/useProducts';
import PurchaseList from './PurchaseList';
import PurchaseForm from './PurchaseForm';
import ProductStock from '../products/ProductStock';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { ErrorMessage } from '../common/ErrorMessage';

const PurchaseListContainer: React.FC = () => {
  const [editingPurchase, setEditingPurchase] = useState<any>(null);
  const [showForm, setShowForm] = useState(false);
  const [showProductStock, setShowProductStock] = useState(false);
  
  const { 
    purchaseInvoices: purchases, 
    loading: purchasesLoading, 
    error: purchasesError, 
    createPurchaseInvoice, 
    updatePurchaseInvoice, 
    deletePurchaseInvoice 
  } = usePurchaseInvoices();

  const { 
    suppliers, 
    loading: suppliersLoading, 
    error: suppliersError 
  } = useSuppliers();

  const { 
    products, 
    loading: productsLoading, 
    error: productsError 
  } = useProducts();

  const handleCreateNew = () => {
    setEditingPurchase(null);
    setShowForm(true);
  };

  const handleEdit = (purchase: any) => {
    setEditingPurchase(purchase);
    setShowForm(true);
  };

  const handleSave = async (purchaseData: any) => {
    try {
      if (editingPurchase) {
        await updatePurchaseInvoice(editingPurchase.id, purchaseData);
      } else {
        await createPurchaseInvoice(purchaseData);
      }
      setShowForm(false);
      setEditingPurchase(null);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deletePurchaseInvoice(id);
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
    }
  };

  const handleView = (purchase: any) => {
    // TODO: Implémenter la vue détaillée
    console.log('Voir la facture:', purchase);
  };

  const handlePrint = async (purchase: any) => {
    try {
      // Récupérer les détails complets de la facture
      const response = await fetch(`http://localhost:3001/api/invoices/purchases/${purchase.id}`);
      const result = await response.json();
      
      if (!result.success) {
        console.error('Erreur lors de la récupération de la facture:', result.error);
        alert('Erreur lors de la récupération de la facture');
        return;
      }
      
      const fullPurchase = result.data;
      
      // Ouvrir une nouvelle fenêtre pour l'impression
      const printWindow = window.open('', '_blank');
      if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Facture d'Achat - ${fullPurchase.invoiceNumber}</title>
          <style>
            body { 
              font-family: Arial, sans-serif; 
              margin: 15px; 
              font-size: 11px;
              line-height: 1.3;
            }
            .header { 
              text-align: center; 
              margin-bottom: 10px; 
              border-bottom: 1px solid #333;
              padding-bottom: 8px;
            }
            .company-logo {
              display: flex;
              align-items: center;
              justify-content: center;
              margin-bottom: 8px;
            }
            .logo-img {
              max-height: 70px;
              max-width: 200px;
              object-fit: contain;
            }
            .invoice-info { margin-bottom: 8px; }
            .supplier-info { margin-bottom: 8px; }
            .items-table { width: 100%; border-collapse: collapse; margin-bottom: 8px; }
            .items-table th, .items-table td { border: 1px solid #ddd; padding: 4px; text-align: left; }
            .items-table th { background-color: #f2f2f2; }
            .total { text-align: right; font-weight: bold; }
            .status { padding: 4px 8px; border-radius: 4px; }
            .status.pending { background-color: #fef3c7; color: #92400e; }
            .status.paid { background-color: #d1fae5; color: #065f46; }
            .status.overdue { background-color: #fee2e2; color: #991b1b; }
            .footer {
              margin-top: 15px;
              border-top: 1px solid #333;
              padding: 8px 0;
              text-align: center;
              color: #666;
              font-size: 10px;
            }
            @media print {
              @page {
                size: A4;
                margin: 0;
                @top-left { content: ""; }
                @top-center { content: ""; }
                @top-right { content: ""; }
                @bottom-left { content: ""; }
                @bottom-center { content: ""; }
                @bottom-right { content: ""; }
              }
              body { 
                margin: 0; 
                padding: 10mm;
              }
              .footer {
                margin-top: 20px;
                border-top: 2px solid #333;
                padding: 10px 0;
                text-align: center;
                color: #666;
                font-size: 11px;
              }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="company-logo" style="display: flex; align-items: flex-end; gap: 15px;">
              <img src="/images/image.png" alt="LYOUSR MÉDICAL" class="logo-img" />
              <p style="color: #69A5CD; font-weight: bold; font-size: 14px; margin: 0;">SARL AU</p>
            </div>
            <h1>FACTURE D'ACHAT</h1>
            <h2>${fullPurchase.invoiceNumber}</h2>
          </div>
          
          <div class="invoice-info" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
            <div>
              <p><strong>Date:</strong> ${new Date(fullPurchase.date).toLocaleDateString('fr-FR')}</p>
            </div>
            <div style="text-align: right;">
              <p><strong>N° Facture:</strong> ${fullPurchase.invoiceNumber}</p>
            </div>
          </div>
          
          <div class="supplier-info" style="margin-bottom: 20px;">
            <p><strong>Fournisseur:</strong> ${fullPurchase.supplier?.name || 'N/A'}</p>
          </div>
          
          <table class="items-table">
            <thead>
              <tr>
                <th>Description</th>
                <th>Quantité</th>
                <th>Prix unitaire</th>
                <th>TVA (%)</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              ${fullPurchase.items?.map((item: any) => `
                <tr>
                  <td>${item.description}</td>
                  <td>${item.quantity}</td>
                  <td>${item.unitPrice.toFixed(2)} DH</td>
                  <td>${item.taxRate}%</td>
                  <td>${(item.total + (item.total * item.taxRate / 100)).toFixed(2)} DH</td>
                </tr>
              `).join('') || ''}
            </tbody>
          </table>
          
          <div class="total">
            <p><strong>Total TTC: ${fullPurchase.total?.toFixed(2) || '0.00'} DH</strong></p>
          </div>
          
          ${fullPurchase.notes ? `
            <div style="margin-top: 30px;">
              <h3>Notes:</h3>
              <p>${fullPurchase.notes}</p>
            </div>
          ` : ''}
          
          <footer class="footer">
            <div style="margin-bottom: 10px; font-weight: bold; color: #2563eb;">
              N°3 LOTISSEMENT MABROUKA RUE MOHAMED VI RESIDENCE MOHAMMED VI FES
            </div>
            <div style="margin-bottom: 5px;">
              TÉL : 05 32 02 57 39 / 06 94 86 41 49
            </div>
            <div style="margin-bottom: 5px;">
              E-MAIL : Lyourmodomall.com/www.lyousmucial.co
            </div>
            <div>
              RC : 62295 / TP : 14000024 / IF : 45635405 / C.N.SS : 1772459 / ICE : 00222452000023
            </div>
          </footer>
        </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
      }
    } catch (error) {
      console.error('Erreur lors de l\'impression:', error);
      alert('Erreur lors de l\'impression de la facture');
    }
  };

  const handleViewStock = () => {
    setShowProductStock(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingPurchase(null);
  };

  const handleCloseStock = () => {
    setShowProductStock(false);
  };

  const loading = purchasesLoading || suppliersLoading || productsLoading;
  const error = purchasesError || suppliersError || productsError;

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <LoadingSpinner size="lg" text="Chargement des factures d'achat..." />
      </div>
    );
  }

  if (error) {
    return (
      <ErrorMessage 
        error={error}
        className="mb-4"
      />
    );
  }

  if (showForm) {
    return (
      <PurchaseForm
        purchase={editingPurchase}
        suppliers={suppliers}
        onSave={handleSave}
        onCancel={handleCancel}
      />
    );
  }

  if (showProductStock) {
    return (
      <ProductStock
        products={products}
        onClose={handleCloseStock}
        onPrint={() => console.log('Imprimer le stock')}
      />
    );
  }

  return (
    <PurchaseList
      purchases={purchases}
      onEdit={handleEdit}
      onDelete={handleDelete}
      onView={handleView}
      onPrint={handlePrint}
      onCreateNew={handleCreateNew}
      onViewStock={handleViewStock}
    />
  );
};

export default PurchaseListContainer;
