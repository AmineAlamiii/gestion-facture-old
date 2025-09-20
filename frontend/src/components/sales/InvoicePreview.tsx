import React from 'react';
import { X, Printer } from 'lucide-react';
import { SaleInvoice } from '../../types';
import { formatCurrency, formatDate } from '../../utils/invoiceUtils';

interface InvoicePreviewProps {
  invoice: SaleInvoice;
  onClose: () => void;
  onPrint: () => void;
}

const InvoicePreview: React.FC<InvoicePreviewProps> = ({ invoice, onClose, onPrint }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-800">Aperçu de la Facture</h3>
          <div className="flex items-center space-x-3">
            <button
              onClick={onPrint}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
            >
              <Printer className="w-4 h-4 mr-2" />
              Imprimer
            </button>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Invoice Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
          <div id="invoice-content" className="bg-white" style={{ minHeight: '297mm', width: '210mm', margin: '0 auto', padding: '0' }}>
            
            {/* En-tête avec logo et informations entreprise */}
            <div className="bg-blue-600 text-white p-8 flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mr-6">
                  <span className="text-blue-600 font-bold text-xl">LOGO</span>
                </div>
                <div>
                  <h1 className="text-2xl font-bold">VOTRE ENTREPRISE</h1>
                  <p className="text-blue-100">Solutions professionnelles</p>
                </div>
              </div>
              <div className="text-right text-blue-100">
                <p>N°3 LOTISSEMENT MABROUKA RUE MOHAMED VI</p>
                <p>RESIDENCE MOHAMMED VI FES</p>
                <p>Tél: 05 32 02 57 39 / 06 94 86 41 49</p>
                <p>Email: Lyourmodomall.com</p>
                <p>RC: 62295 / TP: 14000024 / IF: 45635405</p>
                <p>C.N.SS: 1772459 / ICE: 00222452000023</p>
              </div>
            </div>

            {/* Contenu principal de la facture */}
            <div className="p-8 flex-1">
              {/* Titre et numéro de facture */}
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h2 className="text-3xl font-bold text-gray-800 mb-2">FACTURE</h2>
                  <p className="text-gray-600 text-lg">N° {invoice.invoiceNumber}</p>
                </div>
                <div className="text-right">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Date d'émission</p>
                    <p className="font-semibold text-gray-800">{formatDate(invoice.date)}</p>
                    <p className="text-sm text-gray-600 mt-2">Date d'échéance</p>
                    <p className="font-semibold text-gray-800">{formatDate(invoice.dueDate)}</p>
                  </div>
                </div>
              </div>

              {/* Informations client */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-3 border-b border-gray-200 pb-2">
                  Facturé à:
                </h3>
                <div className="bg-gray-50 p-6 rounded-lg">
                  <p className="font-bold text-gray-800 text-lg mb-2">{invoice.client.name}</p>
                  <p className="text-gray-600 mb-1">{invoice.client.address}</p>
                  <p className="text-gray-600 mb-1">Email: {invoice.client.email}</p>
                  <p className="text-gray-600 mb-1">Tél: {invoice.client.phone}</p>
                  {invoice.client.taxId && (
                    <p className="text-gray-600">N° TVA: {invoice.client.taxId}</p>
                  )}
                </div>
              </div>

              {/* Tableau des articles */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2">
                  Détail des prestations
                </h3>
                <table className="w-full border-collapse border border-gray-300 rounded-lg overflow-hidden">
                  <thead>
                    <tr className="bg-blue-600 text-white">
                      <th className="border border-gray-300 px-4 py-3 text-left font-semibold">
                        Description
                      </th>
                      <th className="border border-gray-300 px-4 py-3 text-center font-semibold w-20">
                        Qté
                      </th>
                      <th className="border border-gray-300 px-4 py-3 text-right font-semibold w-24">
                        Prix unit.
                      </th>
                      <th className="border border-gray-300 px-4 py-3 text-center font-semibold w-16">
                        TVA
                      </th>
                      <th className="border border-gray-300 px-4 py-3 text-right font-semibold w-24">
                        Total HT
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoice.items.map((item, index) => (
                      <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                        <td className="border border-gray-300 px-4 py-3 text-gray-800">
                          {item.description}
                        </td>
                        <td className="border border-gray-300 px-4 py-3 text-center text-gray-800">
                          {item.quantity}
                        </td>
                        <td className="border border-gray-300 px-4 py-3 text-right text-gray-800">
                          {formatCurrency(item.unitPrice)}
                        </td>
                        <td className="border border-gray-300 px-4 py-3 text-center text-gray-800">
                          {item.taxRate}%
                        </td>
                        <td className="border border-gray-300 px-4 py-3 text-right font-medium text-gray-800">
                          {formatCurrency(item.total)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Totaux */}
              <div className="flex justify-end mb-8">
                <div className="w-80">
                  <div className="bg-gray-50 p-6 rounded-lg border">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Sous-total HT:</span>
                        <span className="font-medium text-gray-800">{formatCurrency(invoice.subtotal)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">TVA:</span>
                        <span className="font-medium text-gray-800">{formatCurrency(invoice.taxAmount)}</span>
                      </div>
                      <div className="border-t border-gray-300 pt-3">
                        <div className="flex justify-between items-center">
                          <span className="text-xl font-bold text-gray-800">Total TTC:</span>
                          <span className="text-xl font-bold text-blue-600">{formatCurrency(invoice.total)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Notes */}
              {invoice.notes && (
                <div className="mb-8">
                  <h4 className="font-semibold text-gray-800 mb-3 border-b border-gray-200 pb-2">Notes:</h4>
                  <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
                    <p className="text-gray-700">{invoice.notes}</p>
                  </div>
                </div>
              )}

              {/* Conditions de paiement */}
              <div className="mb-8">
                <h4 className="font-semibold text-gray-800 mb-3 border-b border-gray-200 pb-2">
                  Conditions de paiement
                </h4>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Paiement à réception de facture</li>
                    <li>• Pénalités de retard: 3 fois le taux d'intérêt légal</li>
                    <li>• Indemnité forfaitaire pour frais de recouvrement: 40 DH</li>
                    <li>• Escompte pour paiement anticipé: nous consulter</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-gray-800 text-white p-6 mt-auto">
              <div className="text-center">
                <p className="font-bold text-blue-300 mb-2">N°3 LOTISSEMENT MABROUKA RUE MOHAMED VI RESIDENCE MOHAMMED VI FES</p>
                <p className="text-sm text-gray-300 mb-1">TÉL : 05 32 02 57 39 / 06 94 86 41 49</p>
                <p className="text-sm text-gray-300 mb-1">E-MAIL : Lyourmodomall.com/www.lyousmucial.co</p>
                <p className="text-sm text-gray-300">RC : 62295 / TP : 14000024 / IF : 45635405 / C.N.SS : 1772459 / ICE : 00222452000023</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoicePreview;