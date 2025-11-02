import React, { useState } from 'react';
import { useProducts } from '../../hooks/useProducts';
import ProductStock from './ProductStock';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { ErrorMessage } from '../common/ErrorMessage';

const ProductStockContainer: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { 
    products, 
    loading, 
    error 
  } = useProducts();

  const handlePrint = () => {
    console.log('🖨️ Impression de la liste des produits...', products.length);
    
    if (!products || products.length === 0) {
      alert('Aucun produit à imprimer');
      return;
    }

    const totalStockValue = products.reduce((total, product) => 
      total + (product.totalQuantity * product.averageUnitPrice), 0
    );

    // Créer le contenu HTML pour l'impression
    const printHTML = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Liste des Produits - Stock</title>
  <style>
    @page {
      size: A4;
      margin: 10mm;
    }
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      font-size: 10px;
      line-height: 1.3;
      color: #2c3e50;
      background: white;
    }
    .header {
      text-align: center;
      margin-bottom: 25px;
      padding-bottom: 20px;
      border-bottom: 3px solid #2563eb;
    }
    .header h1 {
      font-size: 22px;
      color: #2563eb;
      margin-bottom: 8px;
      font-weight: bold;
    }
    .header-info {
      display: flex;
      justify-content: space-between;
      margin-top: 12px;
      font-size: 11px;
      color: #374151;
    }
    .header-info div {
      text-align: left;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 20px;
    }
    th {
      background-color: #2563eb;
      color: white;
      padding: 8px 6px;
      text-align: left;
      font-weight: bold;
      font-size: 9px;
      border: 1px solid #1e40af;
    }
    td {
      padding: 6px;
      border: 1px solid #e5e7eb;
      font-size: 9px;
    }
    tr:nth-child(even) {
      background-color: #f9fafb;
    }
    tr:hover {
      background-color: #f3f4f6;
    }
    .text-right {
      text-align: right;
    }
    .text-center {
      text-align: center;
    }
    .total-row {
      background-color: #eff6ff !important;
      font-weight: bold;
      border-top: 2px solid #2563eb;
    }
    .footer {
      margin-top: 20px;
      padding-top: 12px;
      border-top: 2px solid #e5e7eb;
      text-align: center;
      font-size: 9px;
      color: #6b7280;
    }
    @media print {
      body {
        margin: 0;
        padding: 0;
      }
      .no-print {
        display: none;
      }
    }
    .print-button {
      position: fixed;
      top: 20px;
      right: 20px;
      background: #2563eb;
      color: white;
      border: none;
      padding: 12px 24px;
      border-radius: 8px;
      font-size: 14px;
      font-weight: bold;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
      z-index: 1000;
    }
    .print-button:hover {
      background: #1d4ed8;
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(37, 99, 235, 0.4);
    }
  </style>
  <script>
    function printList() {
      window.print();
    }
    window.onload = function() {
      document.body.focus();
      // Lancer automatiquement l'impression après un court délai
      setTimeout(function() {
        window.print();
      }, 500);
    }
    document.addEventListener('keydown', function(e) {
      if (e.ctrlKey && e.key === 'p') {
        e.preventDefault();
        printList();
      }
    });
  </script>
</head>
<body>
  <button class="print-button no-print" onclick="printList()">🖨️ Imprimer (Ctrl+P)</button>
  
  <div class="header">
    <h1>LISTE DES PRODUITS - STOCK</h1>
    <div class="header-info">
      <div>
        <strong>Date d'impression:</strong> ${new Date().toLocaleDateString('fr-FR', { 
          day: '2-digit', 
          month: '2-digit', 
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })}
      </div>
      <div style="text-align: right;">
        <strong>Nombre de produits:</strong> ${products.length}<br>
        <strong>Valeur totale du stock:</strong> ${totalStockValue.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ' ')} DH
      </div>
    </div>
  </div>

  <table>
    <thead>
      <tr>
        <th style="width: 35%;">Produit</th>
        <th style="width: 10%;" class="text-center">Quantité</th>
        <th style="width: 12%;" class="text-right">Prix Moyen</th>
        <th style="width: 12%;" class="text-right">Dernier Prix</th>
        <th style="width: 13%;" class="text-right">Valeur Stock</th>
        <th style="width: 18%;">Dernier Fournisseur</th>
      </tr>
    </thead>
    <tbody>
      ${products.map((product) => {
        const stockValue = product.totalQuantity * product.averageUnitPrice;
        return `
          <tr>
            <td><strong>${product.description}</strong><br><span style="color: #6b7280; font-size: 10px;">${product.purchases?.length || 0} achat(s)</span></td>
            <td class="text-center"><span style="background: #dbeafe; padding: 3px 8px; border-radius: 4px; font-weight: bold;">${product.totalQuantity}</span></td>
            <td class="text-right">${product.averageUnitPrice.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ' ')} DH</td>
            <td class="text-right">${product.lastPurchasePrice.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ' ')} DH</td>
            <td class="text-right"><strong>${stockValue.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ' ')} DH</strong></td>
            <td>${product.supplierName || 'N/A'}</td>
          </tr>
        `;
      }).join('')}
      <tr class="total-row">
        <td colspan="4" style="text-align: right; padding-right: 15px;"><strong>TOTAL GÉNÉRAL:</strong></td>
        <td class="text-right" style="font-size: 13px;">${totalStockValue.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ' ')} DH</td>
        <td></td>
      </tr>
    </tbody>
  </table>

  <div class="footer">
    <p><strong>LYOUSR MÉDICAL - SARL AU</strong></p>
    <p>N°3 LOTISSEMENT MABROUKA RUE MOHAMED VI RESIDENCE MOHAMMED VI FES</p>
    <p>TÉL : 05 32 02 57 39 / 06 94 86 41 49 | E-MAIL : Lyourmodomall.com/www.lyousmucial.co</p>
    <p>RC : 62295 / TP : 14000024 / IF : 45635405 / C.N.SS : 1772459 / ICE : 00222452000023</p>
  </div>
</body>
</html>`;

    // Créer un blob et ouvrir dans un nouvel onglet
    const blob = new Blob([printHTML], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    
    try {
      console.log('Création de la fenêtre d\'impression...');
      const printWindow = window.open('', '_blank');
      
      if (printWindow) {
        console.log('Fenêtre ouverte avec succès');
        printWindow.document.write(printHTML);
        printWindow.document.close();
        
        // Attendre que le contenu soit chargé
        printWindow.onload = () => {
          console.log('Contenu chargé, lancement de l\'impression...');
          setTimeout(() => {
            printWindow.print();
            setTimeout(() => URL.revokeObjectURL(url), 1000);
          }, 500);
        };
        
        // Fallback: si onload ne se déclenche pas, essayer quand même après un délai
        setTimeout(() => {
          if (printWindow && !printWindow.closed) {
            console.log('Fallback: lancement de l\'impression...');
            printWindow.focus();
            printWindow.print();
          }
          setTimeout(() => URL.revokeObjectURL(url), 1000);
        }, 1500);
      } else {
        console.log('Popup bloquée, téléchargement du fichier...');
        // Si popup bloquée, télécharger le fichier
        const link = document.createElement('a');
        link.href = url;
        link.download = `Liste_Produits_${new Date().toISOString().split('T')[0]}.html`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setTimeout(() => URL.revokeObjectURL(url), 100);
        alert('Popup bloquée. Le fichier a été téléchargé. Ouvrez-le et utilisez Ctrl+P pour imprimer.');
      }
    } catch (error) {
      console.error('Erreur lors de l\'impression:', error);
      // En cas d'erreur, télécharger le fichier
      try {
        const link = document.createElement('a');
        link.href = url;
        link.download = `Liste_Produits_${new Date().toISOString().split('T')[0]}.html`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setTimeout(() => URL.revokeObjectURL(url), 100);
        alert('Une erreur est survenue. Le fichier a été téléchargé. Ouvrez-le et utilisez Ctrl+P pour imprimer.');
      } catch (e) {
        console.error('Erreur lors du téléchargement:', e);
        alert('Erreur lors de l\'impression. Vérifiez la console pour plus de détails.');
      }
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 flex flex-col items-center">
          <LoadingSpinner size="lg" text="Chargement du stock..." />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-md">
          <ErrorMessage 
            error={error}
            className="mb-4"
          />
          <button
            onClick={onClose}
            className="w-full bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
          >
            Fermer
          </button>
        </div>
      </div>
    );
  }

  return (
    <ProductStock
      products={products}
      onClose={onClose}
      onPrint={handlePrint}
    />
  );
};

export default ProductStockContainer;
