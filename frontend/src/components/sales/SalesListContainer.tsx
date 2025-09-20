import React, { useState } from 'react';
import { useSaleInvoices } from '../../hooks/useInvoices';
import { useClients } from '../../hooks/useClients';
import { useProducts } from '../../hooks/useProducts';
import SalesList from './SalesList';
import SalesForm from './SalesForm';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { ErrorMessage } from '../common/ErrorMessage';
import { numberToWords } from '../../utils/invoiceUtils';

const SalesListContainer: React.FC = () => {
  const [editingSale, setEditingSale] = useState<any>(null);
  const [showForm, setShowForm] = useState(false);
  
  const { 
    saleInvoices: sales, 
    loading: salesLoading, 
    error: salesError, 
    createSaleInvoice, 
    updateSaleInvoice, 
    deleteSaleInvoice 
  } = useSaleInvoices();

  const { 
    clients, 
    loading: clientsLoading, 
    error: clientsError 
  } = useClients();

  const { 
    products, 
    loading: productsLoading, 
    error: productsError 
  } = useProducts();

  const handleCreateNew = () => {
    setEditingSale(null);
    setShowForm(true);
  };

  const handleEdit = (sale: any) => {
    setEditingSale(sale);
    setShowForm(true);
  };

  const handleSave = async (saleData: any) => {
    try {
      if (editingSale) {
        await updateSaleInvoice(editingSale.id, saleData);
      } else {
        await createSaleInvoice(saleData);
      }
      setShowForm(false);
      setEditingSale(null);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteSaleInvoice(id);
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
    }
  };

  const handleView = (sale: any) => {
    // TODO: Implémenter la vue détaillée
    console.log('Voir la facture:', sale);
  };

  const handlePrint = async (sale: any) => {
    try {
      // Récupérer les détails complets de la facture
      const response = await fetch(`http://localhost:3001/api/invoices/sales/${sale.id}`);
      const result = await response.json();
      
      if (!result.success) {
        console.error('Erreur lors de la récupération de la facture:', result.error);
        alert('Erreur lors de la récupération de la facture');
        return;
      }
      
      const fullSale = result.data;
      
      // Calculer le total TTC (avec TVA)
      const totalTTC = fullSale.total || 0;
      const amountInWords = numberToWords(Math.floor(totalTTC)) + ' DIRHAMS';
      
      // Ouvrir une nouvelle fenêtre pour l'impression
      const printWindow = window.open('', '_blank');
      if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Facture de Vente - ${fullSale.invoiceNumber}</title>
          <style>
            body { 
              font-family: Arial, sans-serif; 
              margin: 15px; 
              font-size: 15px;
              line-height: 1.5;
            }
            .content {
              padding-bottom: 140px;
            }
            .header { 
              text-align: center; 
              margin-bottom: 20px; 
              border-bottom: 3px solid #333;
              padding-bottom: 15px;
            }
            .company-logo {
              display: flex;
              align-items: center;
              justify-content: center;
              margin-bottom: 15px;
            }
            .logo-img {
              max-height: 100px;
              max-width: 250px;
              object-fit: contain;
            }
            .invoice-info { margin-bottom: 20px; }
            .client-info { margin-bottom: 20px; }
            .items-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
            .items-table th, .items-table td { border: 2px solid #333; padding: 15px; text-align: left; font-size: 16px; height: 60px; vertical-align: middle; }
            .items-table th { background-color: #f5f5f5; font-weight: bold; font-size: 16px; text-align: center; }
            .total { text-align: right; font-weight: bold; margin-bottom: 20px; }
            .status { padding: 4px 8px; border-radius: 4px; }
            .status.pending { background-color: #fef3c7; color: #92400e; }
            .status.paid { background-color: #d1fae5; color: #065f46; }
            .status.overdue { background-color: #fee2e2; color: #991b1b; }
            .footer {
              border-top: 3px solid #333;
              padding: 15px 15px;
              text-align: center;
              color: #666;
              font-size: 14px;
              position: fixed;
              bottom: 15px;
              left: 15px;
              right: 15px;
              background-color: white;
              z-index: 1000;
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
                height: auto;
                overflow: visible;
              }
              .content {
                padding-bottom: 0;
                height: auto;
              }
              .footer {
                position: absolute;
                bottom: 10px;
                left: 10px;
                right: 10px;
                page-break-inside: avoid;
              }
            }
          </style>
        </head>
        <body>
          <div class="content">
            <div class="main-content">
              <div class="header">
                <div class="company-logo" style="display: flex; align-items: flex-end; gap: 15px;">
                  <img src="/images/image.png" alt="LYOUSR MÉDICAL" class="logo-img" />
                  <p style="color:rgb(99, 178, 252); font-weight: bold; font-size: 14px; margin: 0;">SARL AU</p>
                </div>
              </div>
              
              <div class="invoice-info" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px;">
                <div>
                  <p style="font-size: 16px;"><strong>Date:</strong> ${new Date(fullSale.date).toLocaleDateString('fr-FR')}</p>
                </div>
                <div style="text-align: right;">
                  <p style="font-size: 16px;"><strong>N° Facture:</strong> ${fullSale.invoiceNumber}</p>
                </div>
              </div>
              
              <div class="client-info" style="margin-bottom: 30px;">
                <p style="font-size: 16px;"><strong>Client:</strong> ${fullSale.client?.name || 'N/A'}</p>
              </div>
              
              <div style="position: relative;">
                <!-- Tableau principal -->
                <table class="items-table">
                  <thead>
                    <tr>
                      <th style="width: 50%;">Désignation</th>
                      <th style="width: 2%;">Quantité</th>
                      <th style="width: 15%;">Prix U.H.T</th>
                      <th style="width: 15%;">Total H.T</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${fullSale.items?.map((item: any) => `
                      <tr>
                        <td>${item.description}</td>
                        <td style="text-align: right;">${item.quantity.toFixed(2)}</td>
                        <td style="text-align: right;">${item.unitPrice.toFixed(2)}</td>
                        <td style="text-align: right;">${item.total.toFixed(2)}</td>
                      </tr>
                    `).join('') || ''}
                  </tbody>
                </table>
                
                <!-- Tableau des totaux collé au premier tableau -->
                <div style="position: absolute; top: 100%; right: 0; width: 234px;">
                  <table style="width: 100%; border-collapse: collapse; border: 1px solid #000;">
                    <tbody>
                      <tr>
                        <td style="padding: 8px; text-align:  left; font-weight: bold; border: 2px solid #000; font-size: 14px; background-color: #fff;">Total HT</td>
                        <td style="padding: 8px; text-align: right; border: 2px solid #000; font-size: 14px; background-color: #fff;">${fullSale.subtotal?.toFixed(2) || '0.00'}</td>
                      </tr>
                      <tr>
                        <td style="padding: 8px; text-align: left; font-weight: bold; border: 2px solid #000; font-size: 14px; background-color: #fff;">TVA 20%</td>
                        <td style="padding: 8px; text-align: right; border: 2px solid #000; font-size: 14px; background-color: #fff;">${fullSale.taxAmount?.toFixed(2) || '0.00'}</td>
                      </tr>
                      <tr>
                        <td style="padding: 8px; text-align: left; font-weight: bold; border: 2px solid #000; font-size: 14px; background-color: #fff;">Total TTC</td>
                        <td style="padding: 8px; text-align: right; font-weight: bold; border: 2px solid #000; font-size: 14px; background-color: #fff;">${fullSale.total?.toFixed(2) || '0.00'}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                
                <!-- Texte au bas du tableau des totaux -->
                <div style="position: absolute; top: 100%; left: 0; margin-top: 200px; font-size: 17px;">
                  <p><strong>Arrêtée la présente facture à la somme de : ${amountInWords}</strong></p>
                </div>
              </div>
              
              ${fullSale.notes ? `
                <div style="margin-top: 40px;">
                  <h3 style="font-size: 17px;">Notes:</h3>
                  <p style="font-size: 15px;">${fullSale.notes}</p>
                </div>
              ` : ''}
            </div>
            
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
          </div>
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

  const handleCancel = () => {
    setShowForm(false);
    setEditingSale(null);
  };

  const loading = salesLoading || clientsLoading || productsLoading;
  const error = salesError || clientsError || productsError;

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <LoadingSpinner size="lg" text="Chargement des factures de vente..." />
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
      <SalesForm
        sale={editingSale}
        clients={clients}
        products={products}
        onSave={handleSave}
        onCancel={handleCancel}
      />
    );
  }

  return (
    <SalesList
      sales={sales}
      onEdit={handleEdit}
      onDelete={handleDelete}
      onView={handleView}
      onPrint={handlePrint}
      onCreateNew={handleCreateNew}
    />
  );
};

export default SalesListContainer;
