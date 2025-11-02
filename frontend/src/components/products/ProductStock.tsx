import React from 'react';
import { Package, Printer, Eye, X } from 'lucide-react';
import { Product } from '../../types';
import { formatCurrency, formatDate } from '../../utils/invoiceUtils';

interface ProductStockProps {
  products: Product[];
  onClose: () => void;
  onPrint: () => void;
}

const ProductStock: React.FC<ProductStockProps> = ({ products, onClose, onPrint }) => {
  const totalStockValue = products.reduce((total, product) => 
    total + (product.totalQuantity * product.averageUnitPrice), 0
  );

  const [selectedProduct, setSelectedProduct] = React.useState<Product | null>(null);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <div className="flex items-center">
            <Package className="w-6 h-6 text-blue-600 mr-3" />
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Stock des Produits</h3>
              <p className="text-sm text-gray-600">
                {products.length} produits • Valeur totale: {formatCurrency(totalStockValue)}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Bouton Imprimer cliqué');
                onPrint();
              }}
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

        <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
          <table className="w-full">
            <thead className="bg-gray-50 sticky top-0">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Produit
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quantité
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Prix Moyen
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dernier Prix
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Valeur Stock
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dernier Fournisseur
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {products.map((product) => {
                const stockValue = product.totalQuantity * product.averageUnitPrice;
                return (
                  <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      <div>
                        <p className="font-medium">{product.description}</p>
                        <p className="text-xs text-gray-500">
                          {product.purchases?.length || 0} achat(s)
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                        {product.totalQuantity}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(product.averageUnitPrice)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div>
                        <p className="font-medium">{formatCurrency(product.lastPurchasePrice)}</p>
                        <p className="text-xs text-gray-500">
                          {formatDate(product.lastPurchaseDate)}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {formatCurrency(stockValue)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {product.supplierName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => setSelectedProduct(product)}
                        className="text-blue-600 hover:text-blue-900 transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {products.length === 0 && (
            <div className="text-center py-12">
              <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">Aucun produit en stock</p>
              <p className="text-gray-400 mt-2">Créez des factures d'achat pour voir les produits ici</p>
            </div>
          )}
        </div>
      </div>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-800">Détails du Produit</h3>
              <button 
                onClick={() => setSelectedProduct(null)} 
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              <div className="mb-6">
                <h4 className="text-xl font-bold text-gray-900 mb-2">{selectedProduct.description}</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Quantité totale:</span>
                    <span className="ml-2 font-medium">{selectedProduct.totalQuantity}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Prix moyen:</span>
                    <span className="ml-2 font-medium">{formatCurrency(selectedProduct.averageUnitPrice)}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Dernier prix:</span>
                    <span className="ml-2 font-medium">{formatCurrency(selectedProduct.lastPurchasePrice)}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Valeur stock:</span>
                    <span className="ml-2 font-medium">
                      {formatCurrency(selectedProduct.totalQuantity * selectedProduct.averageUnitPrice)}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h5 className="text-lg font-semibold text-gray-800 mb-4">Historique des Achats</h5>
                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {(selectedProduct.purchases || []).map((purchase, index) => (
                    <div key={index} className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-gray-900">{purchase.invoiceNumber}</p>
                          <p className="text-sm text-gray-600">{formatDate(purchase.date)}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-gray-900">
                            {purchase.quantity} × {formatCurrency(purchase.unitPrice)}
                          </p>
                          <p className="text-sm text-gray-600">
                            Total: {formatCurrency(purchase.quantity * purchase.unitPrice)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductStock;